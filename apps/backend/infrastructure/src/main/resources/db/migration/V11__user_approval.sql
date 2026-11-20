CREATE TABLE feature_flag
(
    feature_name    TEXT PRIMARY KEY,
    feature_enabled INTEGER,
    strategy_id     TEXT,
    strategy_params TEXT
);

INSERT INTO feature_flag (feature_name, feature_enabled)
VALUES ('ADMIN_APPROVAL_REQUIRED', 0);

ALTER TABLE member
    ADD COLUMN access_status TEXT NOT NULL DEFAULT 'approved';

CREATE INDEX idx_member_access_status ON member (access_status, created_at) WHERE deleted IS FALSE;
