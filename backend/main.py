from fastapi import FastAPI, File, UploadFile, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict
import json
import os
import sys
import numpy as np
from pydantic import BaseModel

# Add current directory to sys.path
sys.path.append(os.getcwd())

from services.face_logic import face_service
from services.vector_search import vector_search
from core.database import supabase

app = FastAPI(
    title="Attendance System AI Backend",
    description="High-Precision Face Recognition API (InsightFace + FAISS)",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class RecognitionResponse(BaseModel):
    success: bool
    student_id: Optional[str] = None
    distance: Optional[float] = None
    confidence: Optional[float] = None
    message: str

class RegisterResponse(BaseModel):
    success: bool
    embedding: List[float]
    message: str

# --- Lifecycle ---
@app.on_event("startup")
async def startup_event():
    print("🚀 Starting up... Syncing FAISS index with Database...")
    try:
        if supabase():
            # Fetch all students with embeddings
            # Note: This checks if 'face_embedding' is not null
            response = supabase().table("students").select("id, face_embedding").not_.is_("face_embedding", "null").execute()
            data = response.data
            
            if data:
                embeddings_dict = {}
                for record in data:
                    s_id = str(record['id'])
                    # Parse string vector if needed, supabase-py might return string or list
                    emb = record['face_embedding']
                    if isinstance(emb, str):
                        emb = json.loads(emb)
                    embeddings_dict[s_id] = emb
                
                vector_search.rebuild_index(embeddings_dict)
                print(f"✅ Synced {len(embeddings_dict)} students from DB to FAISS.")
            else:
                print("⚠️ No students found in DB to sync.")
        else:
            print("⚠️ Supabase not configured, skipping sync.")
    except Exception as e:
        print(f"❌ Startup sync failed: {e}")

# --- Endpoints ---

@app.get("/")
async def root():
    return {
        "message": "AI Attendance Backend (InsightFace + FAISS)",
        "vectors_loaded": vector_search.index.ntotal
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "engine": "insightface", "vectors": vector_search.index.ntotal}

@app.post("/api/face/register", response_model=RegisterResponse)
async def register_face(
    image: UploadFile = File(...),
    student_id: Optional[str] = Form(None)
):
    """
    Detect face and return 512-D embedding.
    If student_id is provided, it also adds it to the FAISS index immediately 
    (assuming the caller will save to DB).
    """
    try:
        image_bytes = await image.read()
        embedding = face_service.get_embedding(image_bytes)
        
        if embedding is None:
            raise HTTPException(status_code=400, detail="No face detected. Ensure good lighting and clear face.")
            
        embedding_list = embedding.tolist()
        
        # If ID provided, update cache immediately
        if student_id:
            vector_search.add_vector(student_id, embedding)
        
        return {
            "success": True,
            "embedding": embedding_list,
            "message": "Face processed successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/face/recognize", response_model=RecognitionResponse)
async def recognize_face(image: UploadFile = File(...)):
    """
    Recognize face against the server-side FAISS index.
    Sub-millisecond search for 1:N matching.
    """
    try:
        image_bytes = await image.read()
        
        # 1. Get embedding from image
        target_embedding = face_service.get_embedding(image_bytes)
        if target_embedding is None:
             return {
                "success": False,
                "message": "No face detected"
            }

        # 2. Search in FAISS
        student_id, distance = face_service.recognize_face(target_embedding)
        
        # Logic for "Match Found" defined by threshold
        # ArcFace L2 < 1.0 is usually a strong match
        # Relaxed to 1.25 to accommodate real-world lighting/angles
        THRESHOLD = 1.25 
        
        if student_id and distance < THRESHOLD:
            return {
                "success": True,
                "student_id": student_id,
                "distance": distance,
                "confidence": max(0, (THRESHOLD - distance) / THRESHOLD), # Rough confidence score
                "message": "Match found"
            }
        else:
            return {
                "success": False,
                "distance": distance,
                "message": "Unknown face"
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/face/sync")
async def sync_index(background_tasks: BackgroundTasks):
    """
    Force re-sync of FAISS index from Supabase.
    Call this after bulk importing students.
    """
    background_tasks.add_task(startup_event)
    return {"status": "Sync started in background"}

