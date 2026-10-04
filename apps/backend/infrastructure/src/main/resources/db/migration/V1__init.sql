CREATE TABLE note
(
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted    BOOLEAN          DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE       NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    title      TEXT                           NOT NULL,
    content    TEXT
);

CREATE UNIQUE INDEX uq_note_title ON note (title) WHERE deleted IS FALSE;