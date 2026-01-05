import numpy as np
import cv2
import insightface
from insightface.app import FaceAnalysis
from PIL import Image
import io
import os
import time
from .image_enhancement import enhancer
from .vector_search import vector_search

class FaceLogic:
    def __init__(self, tolerance=0.5):
        """
        Initialize InsightFace pipeline.
        Model Pack: buffalo_l (ResNet-50/100 ArcFace + SCRFD)
        """
        self.tolerance = tolerance # Not used for ArcFace directly usually, but 1.22 is roughly 0.5 cos
        # ArcFace thresholds: 
        # L2 Distance: 1.24 (approx 99% accuracy suitable) / Cosine: 0.3-0.4
        
        print("⏳ Initializing InsightFace (buffalo_l)... This may take a moment to download models.")
        try:
            # providers=['CUDAExecutionProvider', 'CPUExecutionProvider'] if GPU available
            self.app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
            self.app.prepare(ctx_id=0, det_size=(640, 640))
            print("✅ InsightFace model loaded successfully.")
        except Exception as e:
            print(f"❌ Failed to initialize InsightFace: {e}")
            self.app = None

    def get_embedding(self, image_bytes):
        """
        Extract high-accuracy face embedding (512-d).
        """
        if self.app is None:
            print("❌ InsightFace not initialized.")
            return None

        try:
            # Decode and Enhance
            img_np = self._decode_image(image_bytes)
            if img_np is None: return None
            
            # Low-light enhancement
            img_enhanced = enhancer.enhance_if_needed(img_np)
            
            # Detect and align
            faces = self.app.get(img_enhanced)
            
            if len(faces) == 0:
                print("⚠️ No faces detected by InsightFace.")
                return None
            
            # Get largest face
            largest_face = max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
            
            # InsightFace automatically computes embedding in .embedding or .normed_embedding
            # valid range for ArcFace is usually checking normed_embedding
            embedding = largest_face.normed_embedding # 512-D
            
            # Ensure it is float32 for FAISS
            return np.array(embedding, dtype=np.float32)

        except Exception as e:
            print(f"❌ Error in get_embedding: {e}")
            return None

    def get_embeddings_batch(self, image_bytes):
        """
        Extract multiple normalized embeddings.
        """
        if self.app is None: return []

        try:
            img_np = self._decode_image(image_bytes)
            if img_np is None: return []

            img_enhanced = enhancer.enhance_if_needed(img_np)
            faces = self.app.get(img_enhanced)
            
            embeddings = [np.array(face.normed_embedding, dtype=np.float32) for face in faces]
            return embeddings

        except Exception as e:
            print(f"❌ Error in batch extraction: {e}")
            return []

    def recognize_face(self, detected_embedding):
        """
        Search for the face in the vector database.
        Returns: (student_id, distance)
        """
        # Vector search returns closest match
        # standard ArcFace L2 threshold is ~1.24
        # stricter for attendance: 1.0 or 0.9
        
        matches = vector_search.search(detected_embedding, k=1)
        
        if not matches:
            return None, 100.0
            
        student_id, distance = matches[0]
        return student_id, distance

    def _decode_image(self, image_bytes):
        try:
            if isinstance(image_bytes, bytes):
                img_np = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
            else:
                # If it's already a PIL image or other
                image = Image.open(image_bytes).convert("RGB")
                img_np = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            return img_np
        except Exception as e:
            print(f"❌ Failed to decode image: {e}")
            return None

# Global instance
face_service = FaceLogic()
