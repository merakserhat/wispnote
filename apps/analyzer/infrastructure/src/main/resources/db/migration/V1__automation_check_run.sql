CREATE TABLE automation_check_run
(
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted       BOOLEAN          DEFAULT FALSE NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE       NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE,
    version       BIGINT                         NOT NULL,
    automation_id UUID                           NOT NULL,
    member_id     UUID                           NOT NULL,
    fingerprint   INTEGER                        NOT NULL,
    confidence    INTEGER
);

CREATE UNIQUE INDEX uq_automation_check_run_automation ON automation_check_run (automation_id) WHERE deleted IS FALSE;

CREATE TABLE automation_check_run_item
(
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted              BOOLEAN          DEFAULT FALSE NOT NULL,
    created_at           TIMESTAMP WITH TIME ZONE       NOT NULL,
    updated_at           TIMESTAMP WITH TIME ZONE,
    run_id               UUID                           NOT NULL REFERENCES automation_check_run (id),
    stage                VARCHAR(30)                    NOT NULL,
    status               VARCHAR(20)                    NOT NULL,
    outcome              VARCHAR(20),
    rejection_reason     VARCHAR(30),
    details              TEXT,
    confidence           INTEGER,
    decided_action_type  VARCHAR(40),
    condition            TEXT,
    required_group_title TEXT
);

CREATE INDEX idx_automation_check_run_item_run ON automation_check_run_item (run_id) WHERE deleted IS FALSE;
