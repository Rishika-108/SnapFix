# main.py
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
import logging
import io
import torch
import torch.nn.functional as F
from PIL import Image, UnidentifiedImageError
from transformers import CLIPProcessor, CLIPModel

# ---------------- Logger ----------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("snapfix")

# ---------------- App ------------------
app = FastAPI(title="SnapFix AI Engine", version="1.1")

# ---------------- Models ----------------
CLIP_MODEL_NAME = "openai/clip-vit-base-patch32"

# Define prompts for zero-shot classification to detect "civic issues"
LABELS = [
    "a photo showing a civic issue like a pothole, garbage, broken infrastructure, or urban damage",
    "a photo of a clean street or regular urban scene without any issues",
    "a photo of a person, pet, or indoor scene",
    "a generic photo of nature, trees, or sky"
]

# Load models and pre-calculate text embeddings
try:
    logger.info("Loading CLIP model...")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    clip_model = CLIPModel.from_pretrained(CLIP_MODEL_NAME).to(device)
    clip_processor = CLIPProcessor.from_pretrained(CLIP_MODEL_NAME)
    
    logger.info("Pre-calculating text embeddings for zero-shot classification...")
    with torch.no_grad():
        text_inputs = clip_processor(text=LABELS, return_tensors="pt", padding=True).to(device)
        text_features = clip_model.get_text_features(**text_inputs)
        text_features = F.normalize(text_features, p=2, dim=-1)
    
    logger.info("Models and text features loaded successfully.")
except Exception as e:
    logger.exception("Failed to load models at startup.")
    raise

# ---------------- Routes ----------------
@app.get("/")
async def root():
    return {"message": "SnapFix AI Perception Layer is running 🚀"}

@app.get("/health")
async def health():
    return {"status": "ok", "message": "Perception layer ready"}

@app.post("/get_embedding")
async def get_embedding(file: UploadFile = File(...)):
    """
    Perception Layer Endpoint:
    1. Determines if the image is a valid civic issue.
    2. Provides a confidence score.
    3. Returns a normalized semantic embedding.
    """
    try:
        image_bytes = await file.read()
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        logger.exception("Error processing uploaded image")
        raise HTTPException(status_code=400, detail="Invalid image file")

    try:
        with torch.no_grad():
            # 1. Process image and get raw features
            inputs = clip_processor(images=img, return_tensors="pt").to(device)
            image_features = clip_model.get_image_features(**inputs)
            
            # 2. Normalize the embedding vector
            normalized_embedding = F.normalize(image_features, p=2, dim=-1)
            
            # 3. Calculate validity via zero-shot classification
            # Compare image features with our pre-calculated text features
            logit_scale = clip_model.logit_scale.exp()
            logits_per_image = (normalized_embedding @ text_features.T) * logit_scale
            probs = logits_per_image.softmax(dim=-1).cpu().numpy()[0]
            
            # We consider the first label as the "Positive" civic issue class
            civic_issue_confidence = float(probs[0])
            is_valid = civic_issue_confidence > 0.45  # Tuned threshold for general civic issues
            
            return {
                "embedding": normalized_embedding[0].tolist(),
                "is_valid": is_valid,
                "confidence": civic_issue_confidence
            }
            
    except Exception as e:
        logger.exception("Error in perception layer processing")
        raise HTTPException(status_code=500, detail="Error processing image semantics")
