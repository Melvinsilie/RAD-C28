CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(100) PRIMARY KEY,
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS organizational_roles (
  id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  full_name VARCHAR(160) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  access_role ENUM('admin', 'operator') NOT NULL DEFAULT 'operator',
  organizational_role_id SMALLINT UNSIGNED NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
  failed_login_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
  locked_until DATETIME NULL,
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_organizational_role
    FOREIGN KEY (organizational_role_id) REFERENCES organizational_roles(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_sessions (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  ip_address VARCHAR(64) NULL,
  user_agent VARCHAR(255) NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sessions_expiration (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS province_plans (
  province VARCHAR(100) PRIMARY KEY,
  region_name VARCHAR(100) NOT NULL,
  macro_region VARCHAR(100) NOT NULL,
  planned_cells SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  unit_goal SMALLINT UNSIGNED NOT NULL DEFAULT 10,
  provincial_goal SMALLINT UNSIGNED NOT NULL DEFAULT 20,
  provincial_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  regional_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  macro_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS exterior_plans (
  seccional VARCHAR(100) PRIMARY KEY,
  zone_name VARCHAR(100) NOT NULL,
  macro_region VARCHAR(100) NOT NULL DEFAULT 'Exterior',
  circunscription_count SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  sectional_directive_goal SMALLINT UNSIGNED NOT NULL DEFAULT 20,
  circunscription_goal SMALLINT UNSIGNED NOT NULL DEFAULT 20,
  provincial_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  regional_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  macro_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS national_coordination (
  singleton_id TINYINT UNSIGNED PRIMARY KEY DEFAULT 1,
  national_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  deputy_national_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  operations_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  content_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  polls_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_national_coordination_singleton CHECK (singleton_id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS activists (
  id CHAR(36) PRIMARY KEY,
  cedula_hash CHAR(64) NOT NULL UNIQUE,
  cedula_encrypted TEXT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone_encrypted TEXT NULL,
  whatsapp_encrypted TEXT NULL,
  email_encrypted TEXT NULL,
  age_range VARCHAR(20) NULL,
  sex VARCHAR(30) NULL,
  territory_scope ENUM('provincia', 'exterior') NOT NULL DEFAULT 'provincia',
  status_name VARCHAR(80) NOT NULL,
  province VARCHAR(100) NULL,
  exterior_section VARCHAR(100) NULL,
  exterior_circunscription VARCHAR(120) NULL,
  municipality VARCHAR(120) NULL,
  district_municipal VARCHAR(120) NULL,
  region_name VARCHAR(100) NULL,
  macro_region VARCHAR(100) NULL,
  organizational_role_id SMALLINT UNSIGNED NULL,
  provincial_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  regional_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  macro_coordinator VARCHAR(160) NOT NULL DEFAULT '',
  took_induction BOOLEAN NOT NULL DEFAULT FALSE,
  induction_date DATE NULL,
  c28_registered BOOLEAN NOT NULL DEFAULT FALSE,
  response_window VARCHAR(30) NOT NULL,
  availability VARCHAR(40) NOT NULL,
  poll_squad BOOLEAN NOT NULL DEFAULT FALSE,
  notes_encrypted TEXT NULL,
  created_by CHAR(36) NULL,
  updated_by CHAR(36) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_activists_role FOREIGN KEY (organizational_role_id)
    REFERENCES organizational_roles(id) ON DELETE SET NULL,
  CONSTRAINT fk_activists_created_by FOREIGN KEY (created_by)
    REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_activists_updated_by FOREIGN KEY (updated_by)
    REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_activists_name (last_name, first_name),
  INDEX idx_activists_province (province),
  INDEX idx_activists_exterior (exterior_section),
  INDEX idx_activists_status (status_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS skills (
  id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS activist_skills (
  activist_id CHAR(36) NOT NULL,
  skill_id SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (activist_id, skill_id),
  CONSTRAINT fk_activist_skills_activist FOREIGN KEY (activist_id)
    REFERENCES activists(id) ON DELETE CASCADE,
  CONSTRAINT fk_activist_skills_skill FOREIGN KEY (skill_id)
    REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS activist_networks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  activist_id CHAR(36) NOT NULL,
  network_key VARCHAR(30) NOT NULL,
  handle_encrypted TEXT NULL,
  followers BIGINT UNSIGNED NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_networks_activist FOREIGN KEY (activist_id)
    REFERENCES activists(id) ON DELETE CASCADE,
  UNIQUE KEY uq_activist_network (activist_id, network_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NULL,
  action_name VARCHAR(80) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id VARCHAR(120) NULL,
  metadata_json JSON NULL,
  ip_address VARCHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_created (created_at),
  INDEX idx_audit_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
