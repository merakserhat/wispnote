-- Extensions the application relies on for UUID / text search support.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Sensible defaults for a local dev database.
ALTER DATABASE wispnote SET timezone TO 'UTC';
