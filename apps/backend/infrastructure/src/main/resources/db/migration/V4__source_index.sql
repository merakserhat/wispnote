ALTER TABLE source
    ADD COLUMN external_id TEXT,
    ADD COLUMN page_count  INTEGER;

CREATE INDEX idx_note_source_live ON note (source_id, created_at DESC) WHERE deleted IS FALSE;
