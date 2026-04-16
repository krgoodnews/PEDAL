import os
import json
import asyncio
from typing import AsyncGenerator
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from mcp.server import Server
from mcp.server.sse import SseServerTransport
from pydantic import BaseModel

# FastAPI 설정
app = FastAPI(title="PEDAL Manager Backend")

# CORS 설정 (Next.js 대시보드 통신용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 운영 시에는 제한 필요
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# MCP Tools 등록 예시 (추후 확장)
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
    raise ValueError(f"Unknown tool: {name}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
