ALTER TABLE member
    ADD COLUMN email_verified_at TIMESTAMP WITH TIME ZONE;

CREATE TABLE email_verification
(
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted        BOOLEAN          DEFAULT FALSE NOT NULL,
    created_at     TIMESTAMP WITH TIME ZONE       NOT NULL,
    updated_at     TIMESTAMP WITH TIME ZONE,
    member_id      UUID                           NOT NULL REFERENCES member (id),
    email          TEXT                           NOT NULL,
    code_hash      TEXT                           NOT NULL,
    status         TEXT                           NOT NULL,
    expires_at     TIMESTAMP WITH TIME ZONE       NOT NULL,
    wrong_attempts INTEGER          DEFAULT 0     NOT NULL
);

CREATE INDEX ix_email_verification_email_created_at ON email_verification (email, created_at);
CREATE INDEX ix_email_verification_member_pending ON email_verification (member_id) WHERE status = 'pending';
