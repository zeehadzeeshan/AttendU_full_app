import sys
import os
import cv2
import numpy as np

# Adjust path to find backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from services.face_logic import face_service
    from services.vector_search import vector_search
    print("✅ Successfully imported services.")
except ImportError as e:
    print(f"❌ Import failed: {e}")
    sys.exit(1)

def test_initialization():
    print("--- Testing Initialization ---")
    if face_service.app:
        print("✅ InsightFace (buffalo_l) initialized.")
    else:
        print("❌ InsightFace failed to initialize.")
    
    if vector_search.index:
        print(f"✅ FAISS index initialized (Dimension: {vector_search.dimension}, Count: {vector_search.index.ntotal})")
    else:
        print("❌ FAISS index missing.")

def test_vector_search():
    print("\n--- Testing Vector Search ---")
    # specific to our new logic
    dummy_vec = np.random.rand(512).astype('float32')
    # Normalize
    dummy_vec = dummy_vec / np.linalg.norm(dummy_vec)
    
    # Add
    idx = vector_search.add_vector("test_student_001", dummy_vec)
    print(f"Added vector. New count: {vector_search.index.ntotal}. Assigned ID: {idx}")
    
    # Search
    results = vector_search.search(dummy_vec, k=1)
    print(f"Search results: {results}")
    
    if results and results[0][0] == "test_student_001":
        print("✅ Vector search verification PASSED.")
    else:
        print("❌ Vector search verification FAILED.")

if __name__ == "__main__":
    test_initialization()
    test_vector_search()
