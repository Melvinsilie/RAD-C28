const bcrypt = require("bcryptjs");
const { createApp } = require("../src/app");
const { createPreviewRepository } = require("../src/preview-repository");

const HOST = "127.0.0.1";
const PORT = Number(process.env.PREVIEW_PORT || 4174);
const USERNAME = "vista";
const PASSWORD = "Vista-Local-2026!";

async function start() {
  const repository = createPreviewRepository({
    passwordHash: await bcrypt.hash(PASSWORD, 10),
  });
  const app = createApp({
    repository,
    config: {
      env: "development",
      host: HOST,
      port: PORT,
      trustProxy: 0,
      sessionHours: 8,
    },
  });
  app.listen(PORT, HOST, () => {
    console.log(`Vista local RAD-C28: http://${HOST}:${PORT}`);
    console.log(`Usuario: ${USERNAME}`);
    console.log(`Contraseña temporal de vista: ${PASSWORD}`);
    console.log("Los datos de esta vista se eliminan al detener el servidor.");
  });
}

start().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
