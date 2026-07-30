ALTER TABLE national_coordination
  ADD COLUMN national_coordinator_activist_id CHAR(36) NULL,
  ADD COLUMN deputy_national_coordinator_activist_id CHAR(36) NULL,
  ADD COLUMN operations_coordinator_activist_id CHAR(36) NULL,
  ADD COLUMN content_coordinator_activist_id CHAR(36) NULL,
  ADD COLUMN polls_coordinator_activist_id CHAR(36) NULL,
  ADD CONSTRAINT fk_national_coordinator_activist
    FOREIGN KEY (national_coordinator_activist_id) REFERENCES activists(id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_deputy_national_coordinator_activist
    FOREIGN KEY (deputy_national_coordinator_activist_id) REFERENCES activists(id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_operations_coordinator_activist
    FOREIGN KEY (operations_coordinator_activist_id) REFERENCES activists(id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_content_coordinator_activist
    FOREIGN KEY (content_coordinator_activist_id) REFERENCES activists(id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_polls_coordinator_activist
    FOREIGN KEY (polls_coordinator_activist_id) REFERENCES activists(id)
    ON DELETE SET NULL;
