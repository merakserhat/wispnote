CREATE TABLE note_automation_run
(
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted    BOOLEAN          DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE       NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    version    BIGINT                         NOT NULL,
    note_id    UUID                           NOT NULL,
    member_id  UUID                           NOT NULL
);

CREATE UNIQUE INDEX uq_note_automation_run_note ON note_automation_run (note_id) WHERE deleted IS FALSE;

CREATE TABLE note_automation_run_item
(
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted       BOOLEAN          DEFAULT FALSE NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE       NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE,
    version       BIGINT                         NOT NULL,
    run_id        UUID                           NOT NULL REFERENCES note_automation_run (id),
    automation_id UUID                           NOT NULL,
    action_type   VARCHAR(40)                    NOT NULL,
    status        VARCHAR(20)                    NOT NULL,
    outcome       VARCHAR(20),
    confidence    INTEGER,
    details       TEXT,
    note_group_id UUID
);

CREATE UNIQUE INDEX uq_note_automation_run_item_automation ON note_automation_run_item (run_id, automation_id) WHERE deleted IS FALSE;
