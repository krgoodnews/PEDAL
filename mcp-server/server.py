import os
import json
import asyncio
import subprocess
from enum import Enum
from typing import AsyncGenerator, Optional
from fastapi import FastAPI, Request, Response, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from mcp.server import Server
from mcp.server.sse import SseServerTransport
from pydantic import BaseModel, Field, constr

# --- Models ---

class PedalPhase(str, Enum):
    PLAN = "plan"
    ENGINEERING = "engineering"
    DO = "do"
    ANALYZE = "analyze"
    ITERATE = "iterate"
    LEARN = "learn"

class StatusUpdateRequest(BaseModel):
    feature_id: constr(pattern=r"^[a-zA-Z0-9\-_]+$", min_length=3, max_length=50) = Field(
        ..., description="The ID of the feature to update"
    )
    phase: PedalPhase = Field(..., description="The target phase")
    description: Optional[constr(max_length=500)] = Field(
        None, description="Detailed reason for the change"
    )

class StatusUpdateResponse(BaseModel):
    success: bool
    message: str
    feature_id: str
    new_phase: PedalPhase

# --- FastAPI Setup ---

app = FastAPI(title="PEDAL Manager Backend")

# Read CORS origins from environment variable, default to "*"
cors_origins = os.getenv("PEDAL_CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Authentication ---

async def verify_api_key(x_api_key: str = Header(None)):
    expected_key = os.getenv("PEDAL_API_KEY")
    if not expected_key:
        # If no key is set in ENV, we might allow local access or require one
        # For this implementation, we enforce it if set, or reject if not set (safe default)
        raise HTTPException(status_code=500, detail="PEDAL_API_KEY not configured on server")
    
    if x_api_key != expected_key:
        raise HTTPException(status_code=401, detail="Invalid or missing API Key")
    return x_api_key

# --- Internal Logic ---

async def run_pedal_sync_update(feature_id: str, phase: str, description: Optional[str] = None):
    """Calls pedal-sync.sh update command via subprocess."""
    script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "scripts", "pedal-sync.sh"))
    
    cmd = ["bash", script_path, "update", "--feature", feature_id, "--phase", phase]
    if description:
        cmd.extend(["--desc", description])
    
    try:
        # Run with 30s timeout as per engineering doc
        process = await asyncio.to_thread(
            subprocess.run, 
            cmd, 
            capture_output=True, 
            text=True, 
            timeout=30
        )
        
        if process.returncode == 0:
            return True, process.stdout.strip()
        else:
            # Handle specific error codes if needed (e.g., lock contention)
            # For now, we return the stderr message
            error_msg = process.stderr.strip() or process.stdout.strip()
            return False, error_msg
            
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Status update script timed out (30s)")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to execute sync script: {str(e)}")

# --- Endpoints ---

# MCP 서버 설정
mcp_server = Server("PEDAL-Manager")

# SSE 전송 계층 인스턴스
sse_transport = SseServerTransport("/mcp/messages")

# 상태 파일 경로
STATUS_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".pedal-status.shared.json"))

@app.get("/api/status")
async def get_status():
    """PEDAL 상태 파일(.pedal-status.shared.json)을 읽어 반환합니다."""
    try:
        if os.path.exists(STATUS_FILE):
            with open(STATUS_FILE, "r") as f:
                return json.load(f)
        return {"error": "Status file not found", "path": STATUS_FILE}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/status/update", response_model=StatusUpdateResponse)
async def update_status(request: StatusUpdateRequest, api_key: str = Depends(verify_api_key)):
    """PEDAL 상태를 업데이트합니다 (pedal-sync.sh 호출)."""
    success, message = await run_pedal_sync_update(
        request.feature_id, 
        request.phase.value, 
        request.description
    )
    
    if not success:
        # Distinguish lock contention (common script error)
        if "Failed to acquire lock" in message:
            raise HTTPException(status_code=429, detail=message)
        raise HTTPException(status_code=500, detail=message)
        
    return StatusUpdateResponse(
        success=True,
        message=message,
        feature_id=request.feature_id,
        new_phase=request.phase
    )

@app.get("/mcp/sse")
async def mcp_sse(request: Request):
    """AI 에이전트 연결을 위한 SSE 엔드포인트"""
    async with sse_transport.connect_sse(
        request.scope, request.receive, request._send
    ) as (read_stream, write_stream):
        await mcp_server.run(
            read_stream,
            write_stream,
            mcp_server.create_initialization_options(),
        )

@app.post("/mcp/messages")
async def mcp_messages(request: Request):
    """MCP 메시지 수신 엔드포인트"""
    await sse_transport.handle_post_message(request.scope, request.receive, request._send)

# --- MCP Tools ---

@mcp_server.list_tools()
async def list_tools():
    from mcp.types import Tool
    return [
        Tool(
            name="get_pedal_status",
            description="현재 프로젝트의 PEDAL 진행 상태를 가져옵니다.",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        Tool(
            name="update_pedal_status",
            description="특정 피처의 PEDAL 단계를 업데이트합니다.",
            inputSchema={
                "type": "object",
                "properties": {
                    "feature_id": { 
                        "type": "string", 
                        "pattern": "^[a-zA-Z0-9\\-_]+$", 
                        "minLength": 3, 
                        "maxLength": 50 
                    },
                    "phase": { 
                        "type": "string", 
                        "enum": [p.value for p in PedalPhase] 
                    },
                    "description": { 
                        "type": "string", 
                        "maxLength": 500 
                    }
                },
                "required": ["feature_id", "phase"],
            },
        )
    ]

@mcp_server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "get_pedal_status":
        status = await get_status()
        return [
            {
                "type": "text",
                "text": json.dumps(status, indent=2, ensure_ascii=False)
            }
        ]
    
    elif name == "update_pedal_status":
        try:
            # Validate input using Pydantic model
            req = StatusUpdateRequest(**arguments)
            # Internal call (bypass HTTP Auth for MCP Tool as it's typically internal to the agent environment)
            success, message = await run_pedal_sync_update(req.feature_id, req.phase.value, req.description)
            
            result = {
                "success": success,
                "message": message,
                "feature_id": req.feature_id,
                "new_phase": req.phase.value if success else None
            }
            
            return [
                {
                    "type": "text",
                    "text": json.dumps(result, indent=2, ensure_ascii=False)
                }
            ]
        except Exception as e:
            return [
                {
                    "type": "text",
                    "text": f"Error updating status: {str(e)}"
                }
            ]
            
    raise ValueError(f"Unknown tool: {name}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
