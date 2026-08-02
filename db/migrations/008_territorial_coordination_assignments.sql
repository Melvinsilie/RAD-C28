CREATE TABLE IF NOT EXISTS territorial_coordination_assignments (
  scope_name ENUM('macroregion', 'region') NOT NULL,
  territory_name VARCHAR(100) NOT NULL,
  activist_id CHAR(36) NOT NULL,
  updated_by CHAR(36) NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (scope_name, territory_name),
  UNIQUE KEY uq_territorial_coordination_activist (activist_id),
  CONSTRAINT fk_territorial_coordination_activist
    FOREIGN KEY (activist_id) REFERENCES activists(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_territorial_coordination_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
