const crypto = require("node:crypto");
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

function integer(name, fallback) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} debe ser un numero entero valido.`);
  }
  return value;
}

function boolean(name, fallback = false) {
  const value = String(process.env[name] ?? fallback).toLowerCase();
  return ["1", "true", "yes", "on"].includes(value);
}

function encryptionKey() {
  const configured = process.env.FIELD_ENCRYPTION_KEY;
  if (configured && /^[a-f0-9]{64}$/i.test(configured)) {
    return configured.toLowerCase();
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("FIELD_ENCRYPTION_KEY debe contener exactamente 64 caracteres hexadecimales.");
  }

  return crypto.createHash("sha256").update("radc28-development-only-key").digest("hex");
}

const config = {
  env: process.env.NODE_ENV || "development",
  host: process.env.HOST || "127.0.0.1",
  port: integer("PORT", 4173),
  trustProxy: integer("TRUST_PROXY", 1),
  sessionHours: integer("SESSION_HOURS", 8),
  encryptionKey: encryptionKey(),
  database: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: integer("DB_PORT", 3306),
    name: process.env.DB_NAME || "RADC28",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    connectionLimit: integer("DB_CONNECTION_LIMIT", 10),
    ssl: boolean("DB_SSL"),
  },
  initialAdmin: {
    username: process.env.ADMIN_USERNAME || "admin",
    password:
      process.env.ADMIN_PASSWORD ||
      (process.env.NODE_ENV === "production" ? "" : "RAD-C28-Temporal-2026!"),
    fullName: process.env.ADMIN_NAME || "Administrador RAD-C28",
  },
};

if (!config.database.user || !config.database.password) {
  throw new Error("Configure DB_USER y DB_PASSWORD en el archivo .env o en las variables de Hostinger.");
}

if (config.env === "production" && !config.initialAdmin.password) {
  throw new Error("Configure ADMIN_PASSWORD para crear el administrador inicial.");
}

module.exports = { config };
