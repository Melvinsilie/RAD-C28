ALTER TABLE province_plans
  ADD COLUMN whatsapp_group_url VARCHAR(500) NOT NULL DEFAULT '';

ALTER TABLE exterior_plans
  ADD COLUMN whatsapp_group_url VARCHAR(500) NOT NULL DEFAULT '';
