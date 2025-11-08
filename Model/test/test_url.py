import requests

# FastAPI running endpoint
url = "http://127.0.0.1:8000/predict_url"

# Sample Cloudinary image URL (replace with your real one)
payload = {
    "image_url": "https://res.cloudinary.com/dl5h78jh3/image/upload/v1762512545/reports_uploads/imu2tq9uyaccqwgoxt32.jpg",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "description": "random issue from url test"
}

response = requests.post(url, json=payload)

print("Status Code:", response.status_code)

# Handle both JSON and error output gracefully
try:
    print("Response JSON:", response.json())
except Exception:
    print("Non-JSON Response:")
    print(response.text)
