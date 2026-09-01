CREATE TABLE member
(
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted       BOOLEAN          DEFAULT FALSE NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE       NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE,
    email         TEXT                           NOT NULL,
    password_hash TEXT                           NOT NULL
);

CREATE UNIQUE INDEX uq_member_email ON member (email) WHERE deleted IS FALSE;