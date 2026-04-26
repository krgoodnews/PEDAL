import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, mock_open
import subprocess
import os

# Set up a dummy API key for testing BEFORE importing the app
os.environ["PEDAL_API_KEY"] = "test-api-key"

# Import app from server
from server import app

client = TestClient(app)

def test_get_status_success():
    """Test the GET /api/status endpoint."""
    with patch("os.path.exists", return_value=True), \
         patch("builtins.open", mock_open(read_data='{"version": "2.0"}')):
        response = client.get("/api/status")
        assert response.status_code == 200
        assert response.json() == {"version": "2.0"}

def test_update_status_success():
    """Test successful status update via POST /api/status/update."""
    payload = {
        "feature_id": "test-feature",
        "phase": "engineering",
        "description": "Test description"
    }
    headers = {"X-API-Key": "test-api-key"}
    
    with patch("subprocess.run") as mock_run:
        mock_run.return_value = MagicMock(returncode=0, stdout="Successfully updated", stderr="")
        
        response = client.post("/api/status/update", json=payload, headers=headers)
        
        assert response.status_code == 200
        assert response.json()["success"] is True
        assert response.json()["new_phase"] == "engineering"
        
        # Verify subprocess call
        args = mock_run.call_args[0][0]
        assert "pedal-sync.sh" in args[1]
        assert "update" in args
        assert "--feature" in args
        assert "test-feature" in args
        assert "--phase" in args
        assert "engineering" in args

def test_update_status_unauthorized():
    """Test status update without or with invalid API Key."""
    payload = {"feature_id": "test", "phase": "do"}
    
    # No API Key
    response = client.post("/api/status/update", json=payload)
    assert response.status_code == 401
    
    # Invalid API Key
    response = client.post("/api/status/update", json=payload, headers={"X-API-Key": "wrong"})
    assert response.status_code == 401

def test_update_status_validation_error():
    """Test validation errors (invalid phase, missing fields, etc.)."""
    headers = {"X-API-Key": "test-api-key"}
    
    # Invalid phase
    response = client.post("/api/status/update", json={"feature_id": "test", "phase": "invalid"}, headers=headers)
    assert response.status_code == 422
    
    # Invalid feature_id (special chars)
    response = client.post("/api/status/update", json={"feature_id": "test!!!", "phase": "do"}, headers=headers)
    assert response.status_code == 422

def test_update_status_script_failure():
    """Test handling of shell script execution failure."""
    payload = {"feature_id": "test", "phase": "engineering"}
    headers = {"X-API-Key": "test-api-key"}
    
    with patch("subprocess.run") as mock_run:
        # Simulate script failure
        mock_run.return_value = MagicMock(returncode=1, stdout="", stderr="Lock error")
        
        response = client.post("/api/status/update", json=payload, headers=headers)
        
        assert response.status_code == 500
        assert "Lock error" in response.json()["detail"]

def test_update_status_lock_contention():
    """Test handling of lock contention (429 Too Many Requests)."""
    payload = {"feature_id": "test", "phase": "engineering"}
    headers = {"X-API-Key": "test-api-key"}
    
    with patch("subprocess.run") as mock_run:
        # Simulate lock failure message that triggers 429
        mock_run.return_value = MagicMock(returncode=1, stdout="", stderr="Failed to acquire lock")
        
        response = client.post("/api/status/update", json=payload, headers=headers)
        
        assert response.status_code == 429
        assert "Failed to acquire lock" in response.json()["detail"]

def test_update_status_timeout():
    """Test handling of script execution timeout."""
    payload = {"feature_id": "test", "phase": "engineering"}
    headers = {"X-API-Key": "test-api-key"}
    
    with patch("subprocess.run") as mock_run:
        mock_run.side_effect = subprocess.TimeoutExpired(cmd=["test"], timeout=30)
        
        response = client.post("/api/status/update", json=payload, headers=headers)
        
        assert response.status_code == 504
        assert "timed out" in response.json()["detail"]
