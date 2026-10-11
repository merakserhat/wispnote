-- The analyzer keeps its own state (validation check runs) in a separate database on the same server.
CREATE DATABASE wispnote_analyzer OWNER wispnote;

\connect wispnote_analyzer

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
ALTER DATABASE wispnote_analyzer SET timezone TO 'UTC';
