ALTER TABLE automation_check_run_item
    ADD COLUMN version BIGINT DEFAULT 0 NOT NULL;
