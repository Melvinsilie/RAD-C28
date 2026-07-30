const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const bcrypt = require("bcryptjs");
const { createApp } = require("../src/app");

function createFakeRepository() {
  const sessions = new Map();
  const user = {
    id: "user-1",
    username: "admin",
    full_name: "Administrador",
    access_role: "admin",
    organizational_role: "Coordinador nacional",
    active: true,
    must_change_password: true,
    failed_login_attempts: 0,
    locked_until: null,
    password_hash: bcrypt.hashSync("Temporal-2026!", 4),
    created_at: new Date(),
  };
  return {
    user,
    publicUser(row) {
      return {
        id: row.id,
        username: row.username,
        fullName: row.full_name,
        accessRole: row.access_role,
        organizationalRole: row.organizational_role,
        active: Boolean(row.active),
        mustChangePassword: Boolean(row.must_change_password),
      };
    },
    async findUserByUsername(username) {
      return username === user.username ? user : null;
    },
    async findUserById(id) {
      return id === user.id ? user : null;
    },
    async recordLoginFailure() {},
    async recordLoginSuccess() {},
    async audit() {},
    async createSession(userId, tokenHash, expiresAt) {
      sessions.set(tokenHash, { ...user, id: userId, expires_at: expiresAt });
    },
    async findSession(tokenHash) {
      return sessions.get(tokenHash) || null;
    },
    async deleteSession(tokenHash) {
      sessions.delete(tokenHash);
    },
    async setPassword(_id, hash) {
      user.password_hash = hash;
      user.must_change_password = false;
      sessions.clear();
    },
    async loadState() {
      return {
        records: [],
        provincePlans: [],
        exteriorPlans: [],
        nationalCoordination: {},
        catalogs: {},
      };
    },
  };
}

function cookieFrom(response) {
  return response.headers.get("set-cookie").split(";")[0];
}

test("el acceso temporal obliga a cambiar contraseña antes de consultar datos", async (context) => {
  const repository = createFakeRepository();
  const app = createApp({
    repository,
    config: { trustProxy: 0, sessionHours: 8, env: "test" },
  });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  context.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const base = `http://127.0.0.1:${address.port}`;

  const home = await fetch(base, { redirect: "manual" });
  assert.equal(home.status, 302);
  assert.equal(home.headers.get("location"), "/index.html");

  const protectedSource = await fetch(`${base}/src/config.js`);
  assert.equal(protectedSource.status, 404);
  assert.equal(protectedSource.headers.get("x-powered-by"), null);
  assert.match(protectedSource.headers.get("content-security-policy"), /default-src 'self'/);

  const login = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-radc28-request": "1" },
    body: JSON.stringify({ username: "admin", password: "Temporal-2026!" }),
  });
  assert.equal(login.status, 200);
  let cookie = cookieFrom(login);

  const blocked = await fetch(`${base}/api/state`, {
    headers: { cookie, "x-radc28-request": "1" },
  });
  assert.equal(blocked.status, 428);

  const changed = await fetch(`${base}/api/auth/change-password`, {
    method: "POST",
    headers: {
      cookie,
      "content-type": "application/json",
      "x-radc28-request": "1",
    },
    body: JSON.stringify({
      currentPassword: "Temporal-2026!",
      newPassword: "Definitiva-2026!",
    }),
  });
  assert.equal(changed.status, 200);
  cookie = cookieFrom(changed);

  const allowed = await fetch(`${base}/api/state`, {
    headers: { cookie, "x-radc28-request": "1" },
  });
  assert.equal(allowed.status, 200);

  const rawToken = cookie.split("=")[1];
  const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
  assert.ok(await repository.findSession(hash));
});
