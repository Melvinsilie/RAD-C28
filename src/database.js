const fs = require("node:fs/promises");
const path = require("node:path");
const mysql = require("mysql2/promise");

function createPool(databaseConfig) {
  return mysql.createPool({
    host: databaseConfig.host,
    port: databaseConfig.port,
    database: databaseConfig.name,
    user: databaseConfig.user,
    password: databaseConfig.password,
    waitForConnections: true,
    connectionLimit: databaseConfig.connectionLimit,
    queueLimit: 0,
    charset: "utf8mb4",
    timezone: "Z",
    ssl: databaseConfig.ssl ? { rejectUnauthorized: true } : undefined,
    namedPlaceholders: true,
  });
}

function splitStatements(sql) {
  return sql
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function runMigrations(pool, migrationsDirectory = path.join(__dirname, "..", "db", "migrations")) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(100) PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const files = (await fs.readdir(migrationsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort((left, right) => left.localeCompare(right));
  const [appliedRows] = await pool.query("SELECT version FROM schema_migrations");
  const applied = new Set(appliedRows.map((row) => row.version));

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = await fs.readFile(path.join(migrationsDirectory, file), "utf8");
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      for (const statement of splitStatements(sql)) {
        await connection.query(statement);
      }
      await connection.query("INSERT INTO schema_migrations (version) VALUES (?)", [file]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new Error(`No se pudo aplicar la migracion ${file}: ${error.message}`);
    } finally {
      connection.release();
    }
  }
}

module.exports = { createPool, runMigrations, splitStatements };
