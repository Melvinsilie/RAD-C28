CREATE TABLE IF NOT EXISTS municipality_coordinators (
  province VARCHAR(100) NOT NULL,
  municipality VARCHAR(120) NOT NULL,
  coordinator_name VARCHAR(160) NOT NULL,
  updated_by CHAR(36) NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (province, municipality),
  CONSTRAINT fk_municipality_coordinators_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
