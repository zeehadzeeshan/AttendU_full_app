# Python Backend Setup Instructions

## Prerequisites
- Python 3.8 or higher
- **No C++ compiler needed!** (Using DeepFace instead of face_recognition)

## Installation Steps

### 1. Navigate to Backend Directory
```bash
cd "c:\Users\arefi\OneDrive\Desktop\Attendance prototype\backend"
```

### 2. Create Virtual Environment (Recommended)
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

> **Note**: This will install DeepFace and TensorFlow. The first installation may take a few minutes as it downloads the face recognition models (~100MB).

### 4. Run the Backend Server
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server should start at `http://localhost:8000`

## Verification

### Test Health Endpoint
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status": "healthy", "service": "face_recognition"}
```

## Frontend Integration

The frontend is already configured to connect to `http://localhost:8000`. Make sure:
1. Python backend is running on port 8000
2. Frontend is running (usually on port 5173)
3. Both can communicate (CORS is configured)

## Technical Details

### Why DeepFace?
- ✅ No CMake/C++ compiler required
- ✅ Easy installation on Windows
- ✅ Supports multiple face recognition models (using Facenet)
- ✅ Good accuracy and performance
- ✅ Actively maintained

### Embedding Dimensions
- **DeepFace Facenet model**: 128 dimensions
- **Compatible with existing database schema**

## Troubleshooting

### Port 8000 already in use
Change the port:
```bash
python -m uvicorn main:app --reload --port 8001
```
Then update `api.ts` to use port 8001 instead.

### CORS errors
Make sure the frontend URL is in the `origins` list in `main.py`

### TensorFlow warnings
You may see TensorFlow warnings about GPU/CPU optimization. These are normal and can be ignored for this application.
