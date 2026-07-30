ALTER TABLE users
  MODIFY access_role ENUM('admin', 'operator', 'activist') NOT NULL DEFAULT 'operator';

ALTER TABLE activists
  ADD COLUMN user_id CHAR(36) NULL AFTER id,
  ADD CONSTRAINT fk_activists_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  ADD UNIQUE KEY uq_activists_user (user_id);
