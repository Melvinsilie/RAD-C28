const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createFieldCrypto } = require("../src/field-crypto");
const { splitStatements } = require("../src/database");
const { MUNICIPALITIES_BY_PROVINCE } = require("../src/territorial-catalog");
const {
  buildNationalReach,
  buildSexSummary,
} = require("../src/territory-progress");
const {
  validatePassword,
  validateActivist,
  validateMunicipalityCoordinator,
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
  assert.throws(() => validatePassword("Aa1!b"), /6 caracteres/);
  assert.equal(validatePassword("Aa1!bc"), "Aa1!bc");
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
    municipality: "Azua",
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

test("municipio, induccion e inscripcion C28 se validan de forma consistente", () => {
  const base = {
    cedula: "00100000009",
    firstName: "Ana",
    lastName: "Pérez",
    territoryScope: "provincia",
    status: "Activo",
    province: "Azua",
    municipality: "Azua",
    role: "Activista",
    responseWindow: "15 min",
    availability: "Noche",
  };
  assert.equal(
    Object.values(MUNICIPALITIES_BY_PROVINCE).flat().length,
    158
  );
  assert.throws(
    () => validateActivist({ ...base, municipality: "Santiago" }),
    /no corresponde/
  );
  assert.throws(
    () => validateActivist({ ...base, tookInduction: true }),
    /fecha/
  );
  const completed = validateActivist({
    ...base,
    tookInduction: true,
    inductionDate: "2026-07-30",
    c28Registered: true,
  });
  assert.equal(completed.tookInduction, true);
  assert.equal(completed.inductionDate, "2026-07-30");
  assert.equal(completed.c28Registered, true);
});

test("la coordinacion municipal exige una combinacion territorial valida", () => {
  assert.deepEqual(
    validateMunicipalityCoordinator("Santiago", "Baitoa", {
      coordinatorName: "  Ana Pérez  ",
    }),
    {
      province: "Santiago",
      municipality: "Baitoa",
      coordinatorName: "Ana Pérez",
    }
  );
  assert.throws(
    () =>
      validateMunicipalityCoordinator("Azua", "Baitoa", {
        coordinatorName: "Ana Pérez",
      }),
    /no corresponde/
  );
});

test("el indicador de sexo usa solo registros declarados", () => {
  assert.deepEqual(
    buildSexSummary([
      { sex: "Femenino" },
      { sex: "Femenino" },
      { sex: "Masculino" },
      { sex: "" },
    ]),
    {
      femaleCount: 2,
      maleCount: 1,
      declaredCount: 3,
      unspecifiedCount: 1,
      femaleRate: 67,
      maleRate: 33,
    }
  );
});

test("el alcance nacional suma únicamente seguidores de redes activas", () => {
  assert.equal(
    buildNationalReach([
      {
        networks: {
          instagram: { followers: 1200, active: true },
          facebook: { followers: 800, active: false },
        },
      },
      {
        networks: {
          x: { followers: 2100, active: true },
        },
      },
    ]),
    3300
  );
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

  const declaredNodes = new Set([
    ...requiredIds,
    ...[...javascript.matchAll(/nodes\.([A-Za-z0-9_]+)\s*=/g)].map((match) => match[1]),
  ]);
  const usedNodes = [
    ...new Set(
      [...javascript.matchAll(/nodes\.([A-Za-z0-9_]+)/g)].map((match) => match[1])
    ),
  ];
  const undeclared = usedNodes.filter((id) => !declaredNodes.has(id));
  assert.deepEqual(
    undeclared,
    [],
    `Cada nodo usado debe registrarse antes de iniciar la interfaz: ${undeclared.join(", ")}`
  );
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

test("el dashboard mantiene visibles los controles de sesion", () => {
  const publicRoot = path.join(__dirname, "..", "public");
  const css = fs.readFileSync(path.join(publicRoot, "styles.css"), "utf8");
  const html = fs.readFileSync(path.join(publicRoot, "index.html"), "utf8");
  assert.doesNotMatch(
    css,
    /\.content-shell\.dashboard-mode\s+\.content-bar\s*\{[^}]*display\s*:\s*none/i
  );
  assert.match(html, /id="logoutBtn"[^>]*>\s*Cerrar sesión\s*</);
});

test("los controles operativos no muestran un cursor de carga permanente", () => {
  const publicRoot = path.join(__dirname, "..", "public");
  const css = fs.readFileSync(path.join(publicRoot, "styles.css"), "utf8");
  const javascript = fs.readFileSync(path.join(publicRoot, "app.js"), "utf8");
  const disabledBlock = css.match(
    /button:disabled,\s*input:disabled,\s*select:disabled,\s*textarea:disabled\s*\{([^}]*)\}/i
  );
  assert.ok(disabledBlock);
  assert.doesNotMatch(disabledBlock[1], /cursor:\s*wait/i);
  assert.match(disabledBlock[1], /cursor:\s*not-allowed/i);
  assert.match(css, /form\.is-busy[\s\S]*?cursor:\s*wait/i);
  assert.doesNotMatch(
    javascript,
    /document\.getElementById\("inductionInput"\),\s*document\.getElementById\("c28Input"\),/
  );
});

test("los porcentajes del embudo permanecen centrados entre navegadores", () => {
  const css = fs.readFileSync(
    path.join(__dirname, "..", "public", "styles.css"),
    "utf8"
  );
  assert.match(css, /\.ring\s*\{[^}]*position:\s*relative/s);
  assert.match(css, /\.ring::after\s*\{[^}]*position:\s*absolute[^}]*inset:\s*10px/s);
  assert.match(
    css,
    /\.ring span\s*\{[^}]*position:\s*absolute[^}]*inset:\s*0[^}]*place-items:\s*center/s
  );
});

test("la estructura contempla coordinacion municipal y busqueda nacional escalable", () => {
  const javascript = fs.readFileSync(
    path.join(__dirname, "..", "public", "app.js"),
    "utf8"
  );
  assert.match(javascript, /data-municipality-picker/);
  assert.match(javascript, /data-municipality-coordinator/);
  assert.match(javascript, /municipalityCoordinators/);
  assert.match(javascript, /id="nationalAssignmentSearch"/);
  assert.match(javascript, /matches\.slice\(0,\s*50\)/);
  assert.match(javascript, /query\.length >= 2/);
  assert.match(
    javascript,
    /\["Enlace de contenidos territorial", "Apoyo de contenidos"\]/
  );
  assert.match(javascript, /function findTerritorialRoleAssignment/);
});

test("centro de mando usa alcance nacional y el estado territorial puede ajustarse", () => {
  const publicRoot = path.join(__dirname, "..", "public");
  const html = fs.readFileSync(path.join(publicRoot, "index.html"), "utf8");
  const javascript = fs.readFileSync(path.join(publicRoot, "app.js"), "utf8");
  const css = fs.readFileSync(path.join(publicRoot, "styles.css"), "utf8");
  assert.match(html, /alcance potencial nacional acumulado/);
  assert.match(
    javascript,
    /nodes\.heroReach\.textContent = formatCompact\(getNationalReach\(\)\)/
  );
  assert.match(css, /\.hero-insight-head\s*\{[^}]*flex-wrap:\s*wrap/s);
  assert.match(css, /\.hero-insight-head \.score-chip\s*\{[^}]*white-space:\s*nowrap/s);
});

test("la vista local permite autorregistros repetidos y producción conserva el límite", () => {
  const server = fs.readFileSync(
    path.join(__dirname, "..", "src", "app.js"),
    "utf8"
  );
  assert.match(
    server,
    /const registrationLimiter = rateLimit\(\{[\s\S]*?skip:\s*\(\) => config\.env !== "production"/
  );
  assert.match(
    server,
    /message:\s*\{\s*error:\s*"Se alcanzo el limite temporal de registros desde esta conexion\."\s*\}/
  );
});
