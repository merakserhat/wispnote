DROP TABLE IF EXISTS note;

CREATE TABLE source
(
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted    BOOLEAN          DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE       NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    member_id  UUID                           NOT NULL REFERENCES member (id),
    kind       VARCHAR(20)                    NOT NULL,
    key        TEXT                           NOT NULL,
    title      TEXT             DEFAULT ''    NOT NULL,
    url        TEXT,
    file_path  TEXT,
    app_name   TEXT,
    bundle_id  TEXT,
    metadata   JSONB            DEFAULT '{}'::jsonb NOT NULL
);

CREATE UNIQUE INDEX uq_source_member_key ON source (member_id, key) WHERE deleted IS FALSE;
CREATE INDEX idx_source_member ON source (member_id) WHERE deleted IS FALSE;

CREATE TABLE note
(
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted           BOOLEAN          DEFAULT FALSE       NOT NULL,
    created_at        TIMESTAMP WITH TIME ZONE             NOT NULL,
    updated_at        TIMESTAMP WITH TIME ZONE,
    member_id         UUID                                 NOT NULL REFERENCES member (id),
    source_id         UUID                                 NOT NULL REFERENCES source (id),
    kind              VARCHAR(20)      DEFAULT 'highlight' NOT NULL,
    selected_text     TEXT             DEFAULT ''          NOT NULL,
    user_note         TEXT             DEFAULT ''          NOT NULL,
    context_before    TEXT             DEFAULT ''          NOT NULL,
    context_after     TEXT             DEFAULT ''          NOT NULL,
    section           TEXT,
    page_number       INTEGER,
    location          JSONB            DEFAULT '{}'::jsonb NOT NULL,
    window_title      TEXT,
    enrichment_status VARCHAR(20)      DEFAULT 'pending'   NOT NULL,
    raw_capture       JSONB            DEFAULT '{}'::jsonb NOT NULL
);

CREATE INDEX idx_note_source ON note (source_id);
CREATE INDEX idx_note_member_created ON note (member_id, created_at DESC) WHERE deleted IS FALSE;

CREATE TABLE tag
(
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted    BOOLEAN          DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE       NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    name       TEXT                           NOT NULL
);

CREATE UNIQUE INDEX uq_tag_name ON tag (name) WHERE deleted IS FALSE;

CREATE TABLE note_tag
(
    note_id UUID NOT NULL REFERENCES note (id) ON DELETE CASCADE,
    tag_id  UUID NOT NULL REFERENCES tag (id) ON DELETE CASCADE,

    PRIMARY KEY (note_id, tag_id)
);
