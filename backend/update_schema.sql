-- Migration to update face_embedding dimension for InsightFace (ArcFace)
-- Original: 128 (Facenet/OpenCV)
-- New: 512 (ArcFace r100)

-- We need to alter the column.
-- WARNING: This will invalidate existing 128-d embeddings. You should truncate or re-register.

-- Clear existing 128-d embeddings because they are incompatible with the new 512-d model
UPDATE students SET face_embedding = NULL;

-- Now alter the column type
ALTER TABLE students ALTER COLUMN face_embedding TYPE vector(512);

-- If you have an index, you might need to drop and recreate it
-- DROP INDEX IF EXISTS students_face_embedding_idx;
-- CREATE INDEX ON students USING ivfflat (face_embedding vector_l2_ops) WITH (lists = 100);
