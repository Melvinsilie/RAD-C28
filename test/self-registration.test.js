const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const { createApp } = require("../src/app");
const { createPreviewRepository } = require("../src/preview-repository");

function cookieFrom(response) {
  return response.headers.get("set-cookie").split(";")[0];
}

test("el activista compara el mapa nacional sin acceder a directorios ajenos", async (context) => {
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
  const catalogsData = await catalogs.json();
  assert.equal(catalogsData.provinces.length, 32);
  assert.equal(catalogsData.municipalitiesByProvince.Santiago.includes("Baitoa"), true);
  assert.equal(
    Object.values(catalogsData.municipalitiesByProvince).flat().length,
    158
  );

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

  const otherGroupUrl = "https://chat.whatsapp.com/OtherTerritoryInvite";
  const configuredOtherGroup = await fetch(
    `${base}/api/plans/provinces/${encodeURIComponent("Santiago")}`,
    {
      method: "PUT",
      headers: { ...headers, cookie: adminCookie },
      body: JSON.stringify({
        plannedCells: 7,
        unitGoal: 10,
        provincialGoal: 20,
        provincialCoordinator: "Coordinación reservada",
        regionalCoordinator: "",
        macroCoordinator: "",
        whatsappGroupUrl: otherGroupUrl,
      }),
    }
  );
  assert.equal(configuredOtherGroup.status, 200);

  const azuaMunicipalCoordinator = await fetch(
    `${base}/api/plans/municipalities/${encodeURIComponent("Azua")}/${encodeURIComponent("Azua")}`,
    {
      method: "PUT",
      headers: { ...headers, cookie: adminCookie },
      body: JSON.stringify({ coordinatorName: "María Coordinadora" }),
    }
  );
  assert.equal(azuaMunicipalCoordinator.status, 200);

  const santiagoMunicipalCoordinator = await fetch(
    `${base}/api/plans/municipalities/${encodeURIComponent(
      "Santiago"
    )}/${encodeURIComponent("Baitoa")}`,
    {
      method: "PUT",
      headers: { ...headers, cookie: adminCookie },
      body: JSON.stringify({ coordinatorName: "Coordinación reservada de Baitoa" }),
    }
  );
  assert.equal(santiagoMunicipalCoordinator.status, 200);

  const invalidMunicipalCoordinator = await fetch(
    `${base}/api/plans/municipalities/${encodeURIComponent(
      "Azua"
    )}/${encodeURIComponent("Baitoa")}`,
    {
      method: "PUT",
      headers: { ...headers, cookie: adminCookie },
      body: JSON.stringify({ coordinatorName: "No debe guardarse" }),
    }
  );
  assert.equal(invalidMunicipalCoordinator.status, 400);

  const otherRegistration = await fetch(`${base}/api/public/register`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      username: "activista.santiago",
      password: "Activista-2026!",
      cedula: "001-0000001-7",
      firstName: "Equipo",
      lastName: "Santiago",
      phone: "809-555-3000",
      whatsapp: "809-555-4000",
      email: "santiago@example.test",
      sex: "Masculino",
      territoryScope: "provincia",
      province: "Santiago",
      municipality: "Santiago",
    }),
  });
  assert.equal(otherRegistration.status, 201);
  const otherRegistrationData = await otherRegistration.json();

  const nationalAssignment = await fetch(`${base}/api/coordination`, {
    method: "PUT",
    headers: { ...headers, cookie: adminCookie },
    body: JSON.stringify({
      nationalCoordinator: {
        activistId: otherRegistrationData.user.activistId,
      },
      deputyNationalCoordinator: { activistId: "" },
      operationsCoordinator: { activistId: "" },
      contentCoordinator: { activistId: "" },
      pollsCoordinator: { activistId: "" },
    }),
  });
  assert.equal(nationalAssignment.status, 200);
  const adminStateAfterAssignment = await (
    await fetch(`${base}/api/state`, {
      headers: { cookie: adminCookie, "x-radc28-request": "1" },
    })
  ).json();
  assert.equal(
    adminStateAfterAssignment.records.find(
      (record) => record.id === otherRegistrationData.user.activistId
    ).role,
    "Coordinador nacional"
  );

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
      sex: "Femenino",
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
  assert.equal(state.nationalReach, 0);
  assert.equal(state.provincePlans.length, 32);
  assert.equal(state.territoryProgress.length, 32);
  assert.equal(state.records.length, 1);
  assert.equal(state.records[0].firstName, "Cuenta");
  assert.equal(state.records[0].whatsapp, "");
  assert.equal(state.records[0].cedula, "");
  assert.equal(state.records[0].email, "");
  assert.equal(state.ownRecord.cedula, "001-0000000-9");
  assert.deepEqual(state.municipalityCoordinators, [
    {
      province: "Azua",
      municipality: "Azua",
      coordinatorName: "María Coordinadora",
    },
  ]);
  assert.deepEqual(state.ownTerritoryInsights.sex, {
    femaleCount: 1,
    maleCount: 0,
    declaredCount: 1,
    unspecifiedCount: 0,
    femaleRate: 100,
    maleRate: 0,
  });
  assert.equal(
    state.provincePlans.find((plan) => plan.province === "Azua").whatsappGroupUrl,
    groupUrl
  );
  assert.equal(
    state.provincePlans.find((plan) => plan.province === "Santiago").whatsappGroupUrl,
    ""
  );
  assert.equal(
    state.provincePlans.find((plan) => plan.province === "Santiago").provincialCoordinator,
    ""
  );
  assert.equal(
    state.territoryProgress.find((item) => item.province === "Santiago").activists,
    1
  );
  assert.equal(
    state.records.some((record) => record.firstName === "Equipo"),
    false
  );
  assert.equal(state.nationalCoordination.nationalCoordinator.fullName, "Equipo Santiago");
  assert.equal(
    state.nationalCoordination.nationalCoordinator.whatsapp,
    "809-555-4000"
  );
  assert.equal(JSON.stringify(state).includes(otherGroupUrl), false);
  assert.equal(JSON.stringify(state).includes("Coordinación reservada"), false);
  assert.equal(JSON.stringify(state).includes("001-0000001-7"), false);

  const trainingUpdate = await fetch(
    `${base}/api/activists/${encodeURIComponent(state.ownRecord.id)}`,
    {
      method: "PUT",
      headers: { ...headers, cookie: adminCookie },
      body: JSON.stringify({
        ...state.ownRecord,
        role: "Coordinador municipal",
        tookInduction: true,
        inductionDate: "2026-07-30",
        c28Registered: true,
      }),
    }
  );
  assert.equal(trainingUpdate.status, 200);

  const forbiddenTerritoryChange = await fetch(
    `${base}/api/activists/${encodeURIComponent(state.ownRecord.id)}`,
    {
      method: "PUT",
      headers: { ...headers, cookie },
      body: JSON.stringify({
        ...state.ownRecord,
        province: "Santiago",
        networks: {
          instagram: { handle: "@cuenta.territorial", followers: 120, active: true },
        },
      }),
    }
  );
  assert.equal(forbiddenTerritoryChange.status, 400);

  const profileUpdate = await fetch(
    `${base}/api/activists/${encodeURIComponent(state.ownRecord.id)}`,
    {
      method: "PUT",
      headers: { ...headers, cookie },
      body: JSON.stringify({
        ...state.ownRecord,
        tookInduction: true,
        inductionDate: "2026-07-30",
        c28Registered: true,
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
  assert.equal(updatedState.ownRecord.province, "Azua");
  assert.equal(updatedState.records[0].role, "Coordinador municipal");
  assert.equal(updatedState.ownRecord.role, "Coordinador municipal");
  assert.equal(updatedState.ownRecord.tookInduction, true);
  assert.equal(updatedState.ownRecord.inductionDate, "2026-07-30");
  assert.equal(updatedState.ownRecord.c28Registered, true);
  assert.equal(updatedState.nationalReach, 120);

  const operationalUpdate = await fetch(
    `${base}/api/activists/${encodeURIComponent(updatedState.ownRecord.id)}`,
    {
      method: "PUT",
      headers: { ...headers, cookie },
      body: JSON.stringify({
        ...updatedState.ownRecord,
        tookInduction: false,
        inductionDate: "",
        c28Registered: false,
      }),
    }
  );
  assert.equal(operationalUpdate.status, 200);
  const operationalState = await (
    await fetch(`${base}/api/state`, {
      headers: { cookie, "x-radc28-request": "1" },
    })
  ).json();
  assert.equal(operationalState.ownRecord.tookInduction, false);
  assert.equal(operationalState.ownRecord.inductionDate, "");
  assert.equal(operationalState.ownRecord.c28Registered, false);

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

  const forbiddenMunicipalChange = await fetch(
    `${base}/api/plans/municipalities/${encodeURIComponent(
      "Azua"
    )}/${encodeURIComponent("Azua")}`,
    {
      method: "PUT",
      headers: { ...headers, cookie },
      body: JSON.stringify({ coordinatorName: "Cambio no autorizado" }),
    }
  );
  assert.equal(forbiddenMunicipalChange.status, 403);
});
