CREATE TABLE automation_suggestion
(
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted    BOOLEAN          DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE       NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    rule_text  TEXT                           NOT NULL,
    sort_order INTEGER                        NOT NULL
);

CREATE INDEX idx_automation_suggestion_order ON automation_suggestion (sort_order) WHERE deleted IS FALSE;
