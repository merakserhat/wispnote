CREATE TABLE note_group
(
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted     BOOLEAN          DEFAULT FALSE NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE       NOT NULL,
    updated_at  TIMESTAMP WITH TIME ZONE,
    member_id   UUID                           NOT NULL REFERENCES member (id),
    title       TEXT                           NOT NULL,
    description TEXT
);

CREATE UNIQUE INDEX uq_note_group_member_title
    ON note_group (member_id, title)
    WHERE deleted IS FALSE;
CREATE INDEX idx_note_group_member ON note_group (member_id) WHERE deleted IS FALSE;

CREATE TABLE note_group_note
(
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted      BOOLEAN          DEFAULT FALSE NOT NULL,
    created_at   TIMESTAMP WITH TIME ZONE       NOT NULL,
    updated_at   TIMESTAMP WITH TIME ZONE,
    note_group_id UUID                           NOT NULL REFERENCES note_group (id),
    note_id       UUID                           NOT NULL REFERENCES note (id)
);

CREATE UNIQUE INDEX uq_note_group_note_membership
    ON note_group_note (note_group_id, note_id)
    WHERE deleted IS FALSE;

CREATE INDEX idx_note_group_note_group ON note_group_note (note_group_id) WHERE deleted IS FALSE;
CREATE INDEX idx_note_group_note_note ON note_group_note (note_id) WHERE deleted IS FALSE;
