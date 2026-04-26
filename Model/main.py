# main.py
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import logging
import uuid
import json
import os
import io
import requests
import math
import numpy as np
from PIL import Image, UnidentifiedImageError
from transformers import CLIPProcessor, CLIPModel
from sentence_transformers import SentenceTransformer

# ---------------- Logger ----------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("snapfix")

# ---------------- App ------------------
app = FastAPI(title="SnapFix AI Engine", version="1.0")

# ---------------- Models ----------------
CLIP_MODEL_NAME = "openai/clip-vit-base-patch32"
SENTENCE_MODEL_NAME = "all-MiniLM-L6-v2"

# Load models with explicit logging and clear failure message
try:
    logger.info("Loading CLIP model...")
    clip_model = CLIPModel.from_pretrained(CLIP_MODEL_NAME)
    clip_processor = CLIPProcessor.from_pretrained(CLIP_MODEL_NAME)
    logger.info("Loading sentence transformer model...")
    text_model = SentenceTransformer(SENTENCE_MODEL_NAME)
    logger.info("Models loaded successfully.")
except Exception as e:
    # If model loading fails at startup, log and re-raise so user sees the error
    logger.exception("Failed to load models at startup. Check dependencies and environment.")
    raise

MODELS = {
    "clip_model": clip_model,
    "clip_processor": clip_processor,
    "text_model": text_model
}

# ---------------- Helpers ----------------
def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    na = np.linalg.norm(a)
    nb = np.linalg.norm(b)
    if na == 0 or nb == 0:
        return 0.0
    return float(np.dot(a, b) / (na * nb))

def validate_coords(lat, lon):
    """
    Validate latitude and longitude values.
    Returns True if valid floats within bounds, otherwise False.
    """
    try:
        lat = float(lat)
        lon = float(lon)
    except Exception:
        return False
    if not (-90.0 <= lat <= 90.0 and -180.0 <= lon <= 180.0):
        return False
    return True

# ---------------- Validation (civic check) ----------------
CIVIC_PROMPTS = [
    "garbage on the road",
    "pothole in street",
    "broken streetlight",
    "water leakage",
    "illegal dumping",
    "flooded road",
    "broken drain"
]

def is_civic_image(image_bytes, threshold=0.35):
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except UnidentifiedImageError:
        return False, "invalid_image", 0.0
    except Exception:
        return False, "invalid_image", 0.0

    inputs = clip_processor(text=CIVIC_PROMPTS, images=img, return_tensors="pt", padding=True)
    outputs = clip_model(**inputs)
    probs = outputs.logits_per_image.softmax(dim=1).tolist()[0]
    top_idx = int(np.argmax(probs))
    top_prob = float(probs[top_idx])
    top_label = CIVIC_PROMPTS[top_idx]
    return top_prob >= threshold, top_label, round(top_prob, 3)

# ---------------- Categorization ----------------
CATEGORIES = ["Pothole", "Garbage Dump", "Streetlight Failure", "Water Leakage", "Illegal Construction", "Road Blockage", "Broken Drain"]

def detect_category(image_bytes, description=None, conf_threshold=0.2):
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Invalid or corrupted image")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or corrupted image")

    inputs = clip_processor(text=CATEGORIES, images=img, return_tensors="pt", padding=True)
    outputs = clip_model(**inputs)
    probs = outputs.logits_per_image.softmax(dim=1).tolist()[0]
    top_idx = int(np.argmax(probs))
    confidence = float(probs[top_idx])
    category = CATEGORIES[top_idx]

    # simple keyword boost
    if description and any(cat.lower() in str(description).lower() for cat in CATEGORIES):
        confidence = min(confidence + 0.08, 1.0)

    # description embedding similarity boost
    if description:
        try:
            desc_emb = text_model.encode(str(description).strip().lower())
            cat_embs = text_model.encode([c.lower() for c in CATEGORIES])
            sims = [cosine_similarity(desc_emb, ce) for ce in cat_embs]
            best_sim = max(sims) if sims else 0.0
            if best_sim > 0.45:
                confidence = min(confidence + 0.1, 1.0)
                best_idx = int(np.argmax(sims))
                category = CATEGORIES[best_idx]
        except Exception:
            # If embedding fails for some reason, ignore the description boost
            logger.exception("Description embedding failed; continuing without text boost.")

    if confidence < conf_threshold:
        return "Unknown", round(confidence, 3)
    return category, round(confidence, 3)

# ---------------- Priority scoring ----------------
SEVERITY = {
    "garbage dump": 0.9,
    "water leakage": 0.85,
    "pothole": 0.75,
    "streetlight failure": 0.5,
    "illegal construction": 0.8,
    "road blockage": 0.7,
    "broken drain": 0.6,
    "unknown": 0.3
}

def calculate_priority(category, confidence, upvotes):
    base = SEVERITY.get(str(category).lower(), 0.4)
    up_norm = min(upvotes / 10.0, 1.0)
    score = (0.4 * confidence) + (0.4 * base) + (0.2 * up_norm)
    score = round(float(score), 3)
    if score > 0.75:
        return "High", score
    if score > 0.45:
        return "Medium", score
    return "Low", score

# ---------------- Format report ----------------
def format_report(lat, lon, category, confidence, image_url):
    priority, pscore = calculate_priority(category, confidence, 0)
    out = {
        "category": category.title() if isinstance(category, str) else category,
        "confidence": confidence,
        "priority": priority,
        "priority_score": pscore,
        "coordinates": [round(float(lat), 6), round(float(lon), 6)],
        "image_url": image_url
    }
    return out

# ---------------- Full pipeline ----------------
def process_image_url(image_url, lat, lon, description):
    # fetch image
    try:
        resp = requests.get(image_url, timeout=12)
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to fetch image from URL")
    if resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch image from URL")
    image_bytes = resp.content

    # validate civic
    civic_ok, matched_label, val_prob = is_civic_image(image_bytes, threshold=0.35)
    if not civic_ok:
        rid = f"RPT-{str(uuid.uuid4().int)[:8]}"
        pr, score = calculate_priority("unknown", val_prob, 0)
        return {
            "report_id": rid,
            "category": "Unknown",
            "confidence": val_prob,
            "priority": pr,
            "priority_score": score,
            "coordinates": [round(float(lat), 6), round(float(lon), 6)],
            "status": "Rejected - Not a civic issue",
            "upvotes": 0,
            "is_duplicate": False,
            "duplicate_of": None,
            "image_url": image_url,
            "validation_label": matched_label
        }

    # categorize
    category, confidence = detect_category(image_bytes, description=description)

    # format and return
    return format_report(lat, lon, category, confidence, image_url)

# ---------------- Routes ----------------
@app.get("/")
async def root():
    """
    Root endpoint for quick browser check.
    """
    return {"message": "SnapFix AI Engine is running 🚀"}

@app.get("/health")
async def health():
    """
    Health endpoint.
    Swagger UI available at /docs
    Redoc available at /redoc
    """
    return {"status": "ok", "message": "SnapFix AI Engine running"}

@app.post("/predict_url")
async def predict_url(payload: dict):
    image_url = payload.get("image_url")
    lat = payload.get("latitude")
    lon = payload.get("longitude")
    description = payload.get("description", "")

    if not all([image_url, lat is not None, lon is not None]):
        raise HTTPException(status_code=400, detail="Missing fields in payload")

    if not validate_coords(lat, lon):
        raise HTTPException(status_code=400, detail="Invalid coordinates")

    try:
        result = process_image_url(image_url, float(lat), float(lon), description)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error processing image URL")
        raise HTTPException(status_code=500, detail=str(e))

    return JSONResponse(result)
