import sys
import os
import io
from PIL import Image
from fastapi.testclient import TestClient

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

client = TestClient(app)

TEST_DIR = os.path.dirname(__file__)


def test_it_ai_01_valid_civic_image_classification():
    """
    IT-AI-01: Valid Civic Image Classification
    Upload pothole1.jpg to POST /get_embedding -> Returns is_valid: true, confidence > 0.55, 512-dim vector
    """
    pothole_path = os.path.join(TEST_DIR, "pothole1.jpg")
    
    # If image file exists, use it; otherwise generate synthetic civic issue image
    if os.path.exists(pothole_path):
        with open(pothole_path, "rb") as f:
            file_bytes = f.read()
    else:
        img = Image.new("RGB", (224, 224), color=(100, 100, 100))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        file_bytes = buf.getvalue()

    response = client.post(
        "/get_embedding",
        files={"file": ("pothole1.jpg", file_bytes, "image/jpeg")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "embedding" in data
    assert len(data["embedding"]) == 512
    assert "is_valid" in data
    assert "confidence" in data
    assert data["is_valid"] is True
    assert data["confidence"] >= 0.55


def test_it_ai_02_non_civic_image_filtering():
    """
    IT-AI-02: Non-Civic Image Filtering
    Upload random.png (furniture/indoor) to POST /get_embedding -> Returns is_valid: false, confidence < 0.55
    """
    random_path = os.path.join(TEST_DIR, "random.png")

    if os.path.exists(random_path):
        with open(random_path, "rb") as f:
            file_bytes = f.read()
    else:
        img = Image.new("RGB", (224, 224), color=(255, 255, 255))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        file_bytes = buf.getvalue()

    response = client.post(
        "/get_embedding",
        files={"file": ("random.png", file_bytes, "image/png")}
    )

    assert response.status_code == 200
    data = response.json()
    assert "embedding" in data
    assert "is_valid" in data
    assert "confidence" in data
    assert data["is_valid"] is False
    assert data["confidence"] < 0.55


def test_it_ai_03_corrupted_image_upload():
    """
    IT-AI-03: Corrupted Image Upload
    Send non-image string buffer to POST /get_embedding -> Returns HTTP 400 Bad Request ('Invalid image file')
    """
    corrupted_bytes = b"THIS_IS_NOT_A_VALID_IMAGE_BUFFER_CONTENT"

    response = client.post(
        "/get_embedding",
        files={"file": ("corrupted.txt", corrupted_bytes, "text/plain")}
    )

    assert response.status_code == 400
    data = response.json()
    assert data.get("detail") == "Invalid image file"
