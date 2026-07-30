const { config } = require("../src/config");
const { createPool, runMigrations } = require("../src/database");

async function main() {
  const pool = createPool(config.database);
  try {
    await runMigrations(pool);
    console.log("Migraciones de RADC28 aplicadas correctamente.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
