import sys
import os
from fastapi.testclient import TestClient

# Ensure Model directory is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

client = TestClient(app)


def test_it_ai_04_service_health_check():
    """
    IT-AI-04: Service Health Check
    Send request to GET /health -> Returns HTTP 200 OK ({"status": "ok"})
    """
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data.get("status") == "ok"
    assert "Perception layer ready" in data.get("message", "")
