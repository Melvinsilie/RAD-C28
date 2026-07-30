const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createFieldCrypto } = require("../src/field-crypto");
const { splitStatements } = require("../src/database");
const {
  validatePassword,
  validateActivist,
  validateUsername,
} = require("../src/validation");

test("el cifrado de campos no conserva texto plano y puede descifrarse", () => {
  const fields = createFieldCrypto("a".repeat(64));
  const encrypted = fields.encrypt("001-0000000-1");
  assert.notEqual(encrypted, "001-0000000-1");
  assert.equal(fields.decrypt(encrypted), "001-0000000-1");
  assert.equal(fields.fingerprint("valor"), fields.fingerprint("valor"));
  assert.notEqual(fields.encrypt("valor"), fields.encrypt("valor"));
});

test("la contraseña exige longitud y complejidad", () => {
  assert.throws(() => validatePassword("debil"), /12 caracteres/);
  assert.equal(validatePassword("Temporal-2026!"), "Temporal-2026!");
});

test("el usuario se normaliza y rechaza caracteres no permitidos", () => {
  assert.equal(validateUsername(" Operador.01 "), "operador.01");
  assert.throws(() => validateUsername("a"), /al menos 3/);
});

test("el registro de activista normaliza cedula y descarta redes desconocidas", () => {
  const payload = validateActivist({
    cedula: "00100000009",
    firstName: "Ana",
    lastName: "Pérez",
    territoryScope: "provincia",
    status: "Activo",
    province: "Azua",
    role: "Activista",
    responseWindow: "15 min",
    availability: "Noche",
    networks: {
      instagram: { handle: "@ana", followers: 100, active: true },
      unknown: { handle: "x", followers: 100, active: true },
    },
  });
  assert.equal(payload.cedula, "001-0000000-9");
  assert.deepEqual(Object.keys(payload.networks), ["instagram"]);
});

test("el separador de migraciones conserva sentencias individuales", () => {
  assert.deepEqual(splitStatements("CREATE TABLE a (id INT);\nINSERT INTO a VALUES (1);\n"), [
    "CREATE TABLE a (id INT)",
    "INSERT INTO a VALUES (1)",
  ]);
});

test("todos los nodos declarados por la interfaz existen y no hay ids duplicados", () => {
  const root = path.join(__dirname, "..", "public");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const javascript = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "No debe haber identificadores HTML duplicados.");

  const declaration = javascript.match(
    /const nodes = Object\.fromEntries\(\s*\[\s*([\s\S]*?)\]\.map/
  );
  assert.ok(declaration, "Debe encontrarse el registro central de nodos.");
  const requiredIds = [...declaration[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  const missing = requiredIds.filter((id) => !ids.includes(id));
  assert.deepEqual(missing, []);
});

test("la interfaz publicada no contiene datos ni mensajes de demostracion", () => {
  const publicRoot = path.join(__dirname, "..", "public");
  const content = ["index.html", "app.js"]
    .map((file) => fs.readFileSync(path.join(publicRoot, file), "utf8"))
    .join("\n")
    .toLowerCase();
  for (const forbidden of ["localstorage", "demo_records", "directorio local", "primera version"]) {
    assert.equal(content.includes(forbidden), false, `No debe aparecer ${forbidden}.`);
  }
});
