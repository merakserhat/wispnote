ALTER TABLE automation_check_run
    DROP COLUMN confidence;

ALTER TABLE automation_check_run_item
    ADD COLUMN required_group_id UUID;
