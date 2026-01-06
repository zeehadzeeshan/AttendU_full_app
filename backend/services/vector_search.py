import faiss
import numpy as np
import pickle
import os

class VectorSearch:
    def __init__(self, dimension=512, index_path="faiss_index.bin", mapping_path="id_mapping.pkl"):
        self.dimension = dimension
        self.index_path = index_path
        self.mapping_path = mapping_path
        
        # Initialize FAISS index (L2 Distance)
        self.index = faiss.IndexFlatL2(dimension)
        
        # Mapping from FAISS integer ID to Student string ID
        # FAISS uses incremental integers 0, 1, 2...
        self.id_mapping = {} 
        
        self.load_index()

    def add_vector(self, student_id: str, embedding: np.array):
        """
        Add a new vector to the index.
        """
        if embedding.shape[0] != self.dimension:
            raise ValueError(f"Embedding dimension mismatch. Expected {self.dimension}, got {embedding.shape[0]}")
        
        # Reshape for FAISS (1, d)
        vector = embedding.reshape(1, -1).astype('float32')
        
        # FAISS ID is the current number of vectors
        faiss_id = self.index.ntotal
        
        # Add to index
        self.index.add(vector)
        
        # Update mapping
        self.id_mapping[faiss_id] = student_id
        
        # Auto-save
        self.save_index()
        
        return faiss_id

    def search(self, embedding: np.array, k=1):
        """
        Search for the k nearest neighbors.
        Returns list of (student_id, distance).
        """
        if self.index.ntotal == 0:
            return []
            
        vector = embedding.reshape(1, -1).astype('float32')
        distances, indices = self.index.search(vector, k)
        
        results = []
        for i in range(k):
            idx = indices[0][i]
            dist = distances[0][i]
            
            if idx != -1 and idx in self.id_mapping:
                results.append((self.id_mapping[idx], float(dist)))
                
        return results

    def save_index(self):
        """
        Save index and mapping to disk.
        """
        try:
            faiss.write_index(self.index, self.index_path)
            with open(self.mapping_path, 'wb') as f:
                pickle.dump(self.id_mapping, f)
            print(f"✅ FAISS index saved locally ({self.index.ntotal} vectors).")
        except Exception as e:
            # On some cloud platforms (like Hugging Face), the root directory is read-only.
            # This is OK because we sync from Supabase database on startup anyway.
            print(f"ℹ️ Local FAISS cache not saved: {e}")
            print("💡 This is normal on some servers. The system will sync from Supabase on restart.")

    def load_index(self):
        """
        Load index and mapping from disk if they exist.
        """
        if os.path.exists(self.index_path) and os.path.exists(self.mapping_path):
            try:
                self.index = faiss.read_index(self.index_path)
                with open(self.mapping_path, 'rb') as f:
                    self.id_mapping = pickle.load(f)
                print(f"✅ FAISS index loaded. Total vectors: {self.index.ntotal}")
            except Exception as e:
                print(f"❌ Failed to load FAISS index: {e}. Starting fresh.")
        else:
            print("🆕 No existing FAISS index found. Starting fresh.")

    def rebuild_index(self, embeddings_dict):
        """
        Rebuild index from a dictionary of {student_id: embedding_list}.
        Useful for migration or restore.
        """
        self.index.reset()
        self.id_mapping = {}
        
        for student_id, emb_list in embeddings_dict.items():
            emb_np = np.array(emb_list).astype('float32')
            self.add_vector(student_id, emb_np)
            
        print(f"✅ FAISS index rebuilt with {len(embeddings_dict)} entries.")

# Global instance
vector_search = VectorSearch()
