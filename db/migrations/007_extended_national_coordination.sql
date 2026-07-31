INSERT IGNORE INTO organizational_roles (name, sort_order) VALUES
  ('Coordinador nacional de capacitaciones', 61),
  ('Coordinador nacional de X / Twitter', 62),
  ('Coordinador nacional de Instagram', 63),
  ('Coordinador nacional de Facebook', 64),
  ('Coordinador nacional de TikTok', 65),
  ('Coordinador nacional de YouTube', 66),
  ('Coordinador nacional de Threads', 67);

ALTER TABLE national_coordination
  ADD COLUMN training_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  ADD COLUMN training_coordinator_activist_id CHAR(36) NULL,
  ADD COLUMN x_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  ADD COLUMN x_coordinator_activist_id CHAR(36) NULL,
  ADD COLUMN instagram_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  ADD COLUMN instagram_coordinator_activist_id CHAR(36) NULL,
  ADD COLUMN facebook_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  ADD COLUMN facebook_coordinator_activist_id CHAR(36) NULL,
  ADD COLUMN tiktok_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  ADD COLUMN tiktok_coordinator_activist_id CHAR(36) NULL,
  ADD COLUMN youtube_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  ADD COLUMN youtube_coordinator_activist_id CHAR(36) NULL,
  ADD COLUMN threads_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  ADD COLUMN threads_coordinator_activist_id CHAR(36) NULL,
  ADD CONSTRAINT fk_training_coord_activist
    FOREIGN KEY (training_coordinator_activist_id) REFERENCES activists(id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_x_coord_activist
    FOREIGN KEY (x_coordinator_activist_id) REFERENCES activists(id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_instagram_coord_activist
    FOREIGN KEY (instagram_coordinator_activist_id) REFERENCES activists(id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_facebook_coord_activist
    FOREIGN KEY (facebook_coordinator_activist_id) REFERENCES activists(id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_tiktok_coord_activist
    FOREIGN KEY (tiktok_coordinator_activist_id) REFERENCES activists(id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_youtube_coord_activist
    FOREIGN KEY (youtube_coordinator_activist_id) REFERENCES activists(id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_threads_coord_activist
    FOREIGN KEY (threads_coordinator_activist_id) REFERENCES activists(id)
    ON DELETE SET NULL;
