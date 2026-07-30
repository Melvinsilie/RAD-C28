const { config } = require("./src/config");
const { createPool, runMigrations } = require("./src/database");
const { createFieldCrypto } = require("./src/field-crypto");
const { createRepository } = require("./src/repository");
const { createApp, ensureInitialAdmin } = require("./src/app");

async function start() {
  const pool = createPool(config.database);
  await pool.query("SELECT 1");
  await runMigrations(pool);

  const repository = createRepository(pool, createFieldCrypto(config.encryptionKey));
  const createdAdmin = await ensureInitialAdmin(repository, config);
  await repository.cleanupSessions();

  const app = createApp({ repository, config });
  const server = app.listen(config.port, config.host, () => {
    console.log(`RAD-C28 disponible en http://${config.host}:${config.port}`);
    if (createdAdmin) {
      console.log(`Administrador inicial creado: ${config.initialAdmin.username}`);
      console.log("Debe cambiar la contraseña temporal en el primer acceso.");
    }
  });

  const close = (signal) => {
    console.log(`${signal}: cerrando RAD-C28.`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };
  process.once("SIGINT", () => close("SIGINT"));
  process.once("SIGTERM", () => close("SIGTERM"));
}

start().catch((error) => {
  console.error(`No se pudo iniciar RAD-C28: ${error.message}`);
  process.exitCode = 1;
});
