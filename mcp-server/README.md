# PEDAL Manager MCP Server

This is a FastAPI-based MCP (Model Context Protocol) server for managing PEDAL projects.

## Features

- **Status API**: `GET /api/status` to retrieve the current PEDAL status.
- **Action API**: `POST /api/status/update` to transition between PEDAL phases.
- **MCP Tools**:
  - `get_pedal_status`: Retrieve status via AI Agent.
  - `update_pedal_status`: Update phase via AI Agent.

## Security

- All status updates are performed via the `scripts/pedal-sync.sh` script to ensure data integrity and lock safety.
- `POST /api/status/update` requires an API Key provided in the `X-API-Key` header.
- The API Key is configured via the `PEDAL_API_KEY` environment variable.

## Development

### Prerequisites

- [uv](https://github.com/astral-sh/uv)

### Running the server

```bash
export PEDAL_API_KEY=your-secret-key
uv run python main.py
```

### Running tests

```bash
uv run pytest
```
