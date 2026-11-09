ALTER TABLE member
    ALTER COLUMN password_hash DROP NOT NULL;

ALTER TABLE member
    ADD COLUMN google_id TEXT;

CREATE UNIQUE INDEX uq_member_google_id ON member (google_id) WHERE deleted IS FALSE;
