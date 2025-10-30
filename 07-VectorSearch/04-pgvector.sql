-- 1️⃣ Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2️⃣ Drop and recreate the table
DROP TABLE IF EXISTS movies;

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title TEXT,
    year INT,
    rating FLOAT,
    embedding VECTOR(3)  -- embedding dimension = 3
);

-- 3️⃣ Insert movie data
INSERT INTO movies (title, year, rating, embedding) VALUES
('The Matrix', 1999, 8.7, '[0.1, 0.3, 0.5]'),
('Inception', 2010, 8.8, '[0.2, 0.1, 0.4]'),
('Pulp Fiction', 1994, 8.9, '[0.05, 0.2, 0.45]'),
('Fight Club', 1999, 8.8, '[0.15, 0.25, 0.5]'),
('The Godfather', 1972, 9.2, '[0.02, 0.3, 0.4]');

-- 4️⃣ (Optional) Create an approximate nearest neighbor index
-- Choose one method: ivfflat (faster, approximate) or hnsw (more accurate)
-- Must run ANALYZE after building the index

CREATE INDEX ON movies USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
-- or
CREATE INDEX ON movies USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

ANALYZE movies;

-- 5️⃣ Perform a vector similarity query with a filter (year < 2000)
-- '<->' is the Euclidean distance operator (smaller = more similar)

SELECT 
    title, 
    year, 
    rating,
    embedding <-> '[0.1, 0.25, 0.45]'::vector AS distance
FROM movies
WHERE year < 2000
ORDER BY embedding <-> '[0.1, 0.25, 0.45]'::vector
LIMIT 5;
