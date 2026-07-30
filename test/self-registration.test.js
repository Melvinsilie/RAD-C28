const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const { createApp } = require("../src/app");
const { createPreviewRepository } = require("../src/preview-repository");

function cookieFrom(response) {
  return response.headers.get("set-cookie").split(";")[0];
}

test("el autorregistro limita la cuenta al directorio de su territorio", async (context) => {
  const repository = createPreviewRepository({
    passwordHash: await bcrypt.hash("Vista-Local-2026!", 4),
  });
  const app = createApp({
    repository,
    config: { trustProxy: 0, sessionHours: 8, env: "test" },
  });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  context.after(() => new Promise((resolve) => server.close(resolve)));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;
  const headers = {
    "content-type": "application/json",
    "x-radc28-request": "1",
  };

  const catalogs = await fetch(`${base}/api/public/catalogs`);
  assert.equal(catalogs.status, 200);
  assert.equal((await catalogs.json()).provinces.length, 32);

  const adminLogin = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers,
    body: JSON.stringify({ username: "vista", password: "Vista-Local-2026!" }),
  });
  const adminCookie = cookieFrom(adminLogin);
  const groupUrl = "https://chat.whatsapp.com/ExampleTerritoryInvite";
  const configuredGroup = await fetch(
    `${base}/api/plans/provinces/${encodeURIComponent("Azua")}`,
    {
      method: "PUT",
      headers: { ...headers, cookie: adminCookie },
      body: JSON.stringify({
        plannedCells: 4,
        unitGoal: 10,
        provincialGoal: 20,
        provincialCoordinator: "",
        regionalCoordinator: "",
        macroCoordinator: "",
        whatsappGroupUrl: groupUrl,
      }),
    }
  );
  assert.equal(configuredGroup.status, 200);

  const registration = await fetch(`${base}/api/public/register`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      username: "activista.azua",
      password: "Activista-2026!",
      cedula: "001-0000000-9",
      firstName: "Cuenta",
      lastName: "Territorial",
      phone: "809-555-1000",
      whatsapp: "809-555-2000",
      email: "cuenta@example.test",
      territoryScope: "provincia",
      province: "Azua",
      municipality: "Azua",
    }),
  });
  assert.equal(registration.status, 201);
  const registrationData = await registration.json();
  assert.equal(registrationData.user.accessRole, "activist");
  const cookie = cookieFrom(registration);

  const stateResponse = await fetch(`${base}/api/state`, {
    headers: { cookie, "x-radc28-request": "1" },
  });
  assert.equal(stateResponse.status, 200);
  const state = await stateResponse.json();
  assert.equal(state.viewMode, "territory");
  assert.equal(state.provincePlans.length, 1);
  assert.equal(state.provincePlans[0].province, "Azua");
  assert.equal(state.records.length, 1);
  assert.equal(state.records[0].firstName, "Cuenta");
  assert.equal(state.records[0].whatsapp, "");
  assert.equal(state.records[0].cedula, "");
  assert.equal(state.records[0].email, "");
  assert.equal(state.ownRecord.cedula, "001-0000000-9");
  assert.equal(state.provincePlans[0].whatsappGroupUrl, groupUrl);

  const profileUpdate = await fetch(
    `${base}/api/activists/${encodeURIComponent(state.ownRecord.id)}`,
    {
      method: "PUT",
      headers: { ...headers, cookie },
      body: JSON.stringify({
        ...state.ownRecord,
        networks: {
          instagram: { handle: "@cuenta.territorial", followers: 120, active: true },
        },
      }),
    }
  );
  assert.equal(profileUpdate.status, 200);
  const updatedState = await (
    await fetch(`${base}/api/state`, {
      headers: { cookie, "x-radc28-request": "1" },
    })
  ).json();
  assert.equal(
    updatedState.records[0].networks.instagram.handle,
    "@cuenta.territorial"
  );
  assert.equal(updatedState.records[0].whatsapp, "");

  const forbiddenPlanChange = await fetch(
    `${base}/api/plans/provinces/${encodeURIComponent("Azua")}`,
    {
      method: "PUT",
      headers: { ...headers, cookie },
      body: JSON.stringify({
        plannedCells: 1,
        unitGoal: 10,
        provincialGoal: 20,
      }),
    }
  );
  assert.equal(forbiddenPlanChange.status, 403);
});
