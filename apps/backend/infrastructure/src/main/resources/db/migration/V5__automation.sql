CREATE TABLE automation
(
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted    BOOLEAN          DEFAULT FALSE       NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE             NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    member_id  UUID                                 NOT NULL REFERENCES member (id),
    rule_text  TEXT                                 NOT NULL,
    enabled    BOOLEAN          DEFAULT TRUE        NOT NULL
);

CREATE INDEX idx_automation_member_created ON automation (member_id, created_at DESC) WHERE deleted IS FALSE;
CREATE INDEX idx_automation_member_enabled ON automation (member_id) WHERE deleted IS FALSE AND enabled IS TRUE;
