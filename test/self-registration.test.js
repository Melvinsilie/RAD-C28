const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const { gunzipSync } = require("node:zlib");
const { createApp } = require("../src/app");
const { createPreviewRepository } = require("../src/preview-repository");

function cookieFrom(response) {
  return response.headers.get("set-cookie").split(";")[0];
}

test("el activista compara el mapa nacional sin acceder a directorios ajenos", async (context) => {
  const repository = createPreviewRepository({
    passwordHash: await bcrypt.hash("Vista-Local-2026!", 4),
  });
  const operatorPasswordHash = await bcrypt.hash("Operador-2026!", 4);
  const operatorId = await repository.createUser({
    username: "operador",
    fullName: "Operador territorial",
    passwordHash: operatorPasswordHash,
    accessRole: "operator",
    organizationalRole: "Apoyo de contenidos",
  });
  await repository.setPassword(operatorId, operatorPasswordHash);
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
  assert.equal(adminLogin.status, 200);
  const adminLoginData = await adminLogin.json();
  const adminCookie = cookieFrom(adminLogin);
  const operatorLogin = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      username: "operador",
      password: "Operador-2026!",
    }),
  });
  assert.equal(operatorLogin.status, 200);
  const operatorCookie = cookieFrom(operatorLogin);

  const operatorCreatedActivist = await fetch(`${base}/api/activists`, {
    method: "POST",
    headers: { ...headers, cookie: operatorCookie },
    body: JSON.stringify({
      cedula: "001-0000003-3",
      firstName: "Registro",
      lastName: "Asistido",
      phone: "809-555-6000",
      whatsapp: "809-555-6000",
      email: "registro.asistido@example.test",
      territoryScope: "provincia",
      status: "Pendiente de activación",
      province: "Duarte",
      municipality: "San Francisco de Macorís",
      role: "Activista",
      responseWindow: "15 min",
      availability: "Tarde",
      networks: {},
    }),
  });
  assert.equal(operatorCreatedActivist.status, 201);

  const operatorAsActivist = await fetch(`${base}/api/users/${operatorId}`, {
    method: "PATCH",
    headers: { ...headers, cookie: adminCookie },
    body: JSON.stringify({
      username: "operador.grupo",
      fullName: "Operador de grupo",
      accessRole: "activist",
      organizationalRole: "Coordinador municipal",
    }),
  });
  assert.equal(operatorAsActivist.status, 200);
  const operatorAsActivistData = await operatorAsActivist.json();
  assert.equal(operatorAsActivistData.user.accessRole, "activist");
  assert.equal(operatorAsActivistData.user.organizationalRole, "Activista");

  const operatorOnboarding = await fetch(`${base}/api/state`, {
    headers: { cookie: operatorCookie, "x-radc28-request": "1" },
  });
  assert.equal(operatorOnboarding.status, 200);
  assert.equal((await operatorOnboarding.json()).viewMode, "onboarding");

  const restoredOperator = await fetch(`${base}/api/users/${operatorId}`, {
    method: "PATCH",
    headers: { ...headers, cookie: adminCookie },
    body: JSON.stringify({
      username: "operador.grupo",
      fullName: "Operador de grupo",
      accessRole: "operator",
      organizationalRole: "Coordinador municipal",
    }),
  });
  assert.equal(restoredOperator.status, 200);
  const restoredOperatorData = await restoredOperator.json();
  assert.equal(restoredOperatorData.user.accessRole, "operator");
  assert.equal(
    restoredOperatorData.user.organizationalRole,
    "Coordinador municipal"
  );

  const currentOperator = await (
    await fetch(`${base}/api/auth/me`, {
      headers: { cookie: operatorCookie, "x-radc28-request": "1" },
    })
  ).json();
  assert.equal(currentOperator.user.username, "operador.grupo");

  const forbiddenSelfDemotion = await fetch(
    `${base}/api/users/${adminLoginData.user.id}`,
    {
      method: "PATCH",
      headers: { ...headers, cookie: adminCookie },
      body: JSON.stringify({
        username: "vista",
        fullName: "Administrador de vista local",
        accessRole: "operator",
        organizationalRole: "Coordinador nacional",
      }),
    }
  );
  assert.equal(forbiddenSelfDemotion.status, 400);

  const adminBackup = await fetch(`${base}/api/admin/database-backup`, {
    method: "POST",
    headers: { ...headers, cookie: adminCookie },
  });
  assert.equal(adminBackup.status, 200);
  assert.equal(adminBackup.headers.get("content-type"), "application/gzip");
  assert.match(
    adminBackup.headers.get("content-disposition"),
    /rad-c28-respaldo-\d{8}T\d{6}Z\.sql\.gz/
  );
  const backupSql = gunzipSync(Buffer.from(await adminBackup.arrayBuffer())).toString(
    "utf8"
  );
  assert.match(backupSql, /Respaldo completo de la base de datos RAD-C28/);
  assert.match(backupSql, /CREATE TABLE `preview_users`/);

  const forbiddenOperatorBackup = await fetch(
    `${base}/api/admin/database-backup`,
    {
      method: "POST",
      headers: { ...headers, cookie: operatorCookie },
    }
  );
  assert.equal(forbiddenOperatorBackup.status, 403);

  const assistedAccount = await fetch(`${base}/api/users`, {
    method: "POST",
    headers: { ...headers, cookie: adminCookie },
    body: JSON.stringify({
      username: "activista.asistida",
      fullName: "Activista Asistida",
      accessRole: "activist",
      organizationalRole: "Coordinador nacional",
      temporaryPassword: "Temporal-2026!",
    }),
  });
  assert.equal(assistedAccount.status, 201);

  const assistedLogin = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      username: "activista.asistida",
      password: "Temporal-2026!",
    }),
  });
  assert.equal(assistedLogin.status, 200);
  const assistedLoginData = await assistedLogin.json();
  assert.equal(assistedLoginData.user.accessRole, "activist");
  assert.equal(assistedLoginData.user.organizationalRole, "Activista");
  assert.equal(assistedLoginData.user.activistId, null);
  assert.equal(assistedLoginData.user.mustChangePassword, true);
  const assistedTemporaryCookie = cookieFrom(assistedLogin);

  const assistedPasswordChange = await fetch(
    `${base}/api/auth/change-password`,
    {
      method: "POST",
      headers: { ...headers, cookie: assistedTemporaryCookie },
      body: JSON.stringify({
        currentPassword: "Temporal-2026!",
        newPassword: "Activista-Asistida-2026!",
      }),
    }
  );
  assert.equal(assistedPasswordChange.status, 200);
  const assistedCookie = cookieFrom(assistedPasswordChange);

  const assistedOnboarding = await fetch(`${base}/api/state`, {
    headers: { cookie: assistedCookie, "x-radc28-request": "1" },
  });
  assert.equal(assistedOnboarding.status, 200);
  const assistedOnboardingState = await assistedOnboarding.json();
  assert.equal(assistedOnboardingState.needsProfile, true);
  assert.equal(assistedOnboardingState.viewMode, "onboarding");
  assert.equal(assistedOnboardingState.records.length, 0);
  assert.equal(
    assistedOnboardingState.catalogs.organizationalRoles.includes(
      "Coordinador nacional de capacitaciones"
    ),
    true
  );
  assert.equal(
    assistedOnboardingState.catalogs.organizationalRoles.includes(
      "Coordinador nacional de Threads"
    ),
    true
  );

  const assistedProfile = await fetch(`${base}/api/activists/me`, {
    method: "POST",
    headers: { ...headers, cookie: assistedCookie },
    body: JSON.stringify({
      cedula: "001-0000002-5",
      firstName: "Activista",
      lastName: "Asistida",
      phone: "809-555-5000",
      whatsapp: "809-555-5000",
      email: "asistida@example.test",
      sex: "Femenino",
      territoryScope: "provincia",
      province: "Barahona",
      municipality: "Barahona",
      responseWindow: "15 min",
      availability: "Noche",
      skills: ["Creación de contenido"],
      networks: {
        instagram: {
          handle: "@activista_asistida",
          followers: 1250,
          active: true,
        },
      },
    }),
  });
  assert.equal(assistedProfile.status, 201);
  const assistedProfileData = await assistedProfile.json();
  assert.ok(assistedProfileData.user.activistId);

  const assistedTerritoryState = await (
    await fetch(`${base}/api/state`, {
      headers: { cookie: assistedCookie, "x-radc28-request": "1" },
    })
  ).json();
  assert.equal(assistedTerritoryState.viewMode, "territory");
  assert.equal(assistedTerritoryState.needsProfile, undefined);
  assert.equal(assistedTerritoryState.ownRecord.networks.instagram.followers, 1250);

  const assistedRoleEdit = await fetch(
    `${base}/api/users/${assistedLoginData.user.id}`,
    {
      method: "PATCH",
      headers: { ...headers, cookie: adminCookie },
      body: JSON.stringify({
        username: "activista.asistida",
        fullName: "Activista Asistida",
        accessRole: "activist",
        organizationalRole: "Coordinador municipal",
      }),
    }
  );
  assert.equal(assistedRoleEdit.status, 200);
  const assistedAfterRoleEdit = await (
    await fetch(`${base}/api/state`, {
      headers: { cookie: assistedCookie, "x-radc28-request": "1" },
    })
  ).json();
  assert.equal(assistedAfterRoleEdit.ownRecord.role, "Coordinador municipal");

  const duplicateAssistedProfile = await fetch(`${base}/api/activists/me`, {
    method: "POST",
    headers: { ...headers, cookie: assistedCookie },
    body: JSON.stringify({}),
  });
  assert.equal(duplicateAssistedProfile.status, 409);

  const forbiddenOperatorProfile = await fetch(`${base}/api/activists/me`, {
    method: "POST",
    headers: { ...headers, cookie: operatorCookie },
    body: JSON.stringify({}),
  });
  assert.equal(forbiddenOperatorProfile.status, 403);

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
      trainingCoordinator: {
        activistId: assistedProfileData.user.activistId,
      },
      xCoordinator: { activistId: "" },
      instagramCoordinator: { activistId: "" },
      facebookCoordinator: { activistId: "" },
      tiktokCoordinator: { activistId: "" },
      youtubeCoordinator: { activistId: "" },
      threadsCoordinator: { activistId: "" },
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
  assert.equal(
    adminStateAfterAssignment.records.find(
      (record) => record.id === assistedProfileData.user.activistId
    ).role,
    "Coordinador nacional de capacitaciones"
  );
  assert.equal(
    adminStateAfterAssignment.nationalCoordination.trainingCoordinator.activistId,
    assistedProfileData.user.activistId
  );
  assert.equal(adminStateAfterAssignment.provinceNetworkReach.provinces.length, 32);
  assert.equal(
    adminStateAfterAssignment.provinceNetworkReach.provinces.find(
      (province) => province.province === "Santiago"
    ).total,
    0
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
  assert.equal(state.nationalReach, 1250);
  assert.equal(state.provinceNetworkReach, undefined);
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
  assert.equal(updatedState.nationalReach, 1370);
  assert.equal(updatedState.provinceNetworkReach, undefined);
  assert.equal(
    updatedState.municipalityCoordinators[0].coordinatorName,
    "Cuenta Territorial"
  );

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

  const forbiddenOperatorPlanChange = await fetch(
    `${base}/api/plans/provinces/${encodeURIComponent("Azua")}`,
    {
      method: "PUT",
      headers: { ...headers, cookie: operatorCookie },
      body: JSON.stringify({
        plannedCells: 99,
        unitGoal: 99,
        provincialGoal: 99,
      }),
    }
  );
  assert.equal(forbiddenOperatorPlanChange.status, 403);

  const forbiddenOperatorExteriorPlanChange = await fetch(
    `${base}/api/plans/exterior/${encodeURIComponent("Nueva York")}`,
    {
      method: "PUT",
      headers: { ...headers, cookie: operatorCookie },
      body: JSON.stringify({
        circunscriptionCount: 99,
        baseGoal: 99,
        unitGoal: 99,
      }),
    }
  );
  assert.equal(forbiddenOperatorExteriorPlanChange.status, 403);

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
