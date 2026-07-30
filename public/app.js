const STATUS_OPTIONS = [
  "Activo",
  "En inducción",
  "Pendiente de activación",
  "Coordinando estructura",
];
const AGE_RANGE_OPTIONS = ["18-24", "25-34", "35-44", "45-54", "55+"];
const SEX_OPTIONS = ["Femenino", "Masculino"];
const RESPONSE_WINDOWS = ["5 min", "15 min", "30 min", "1 hora", "2 horas+"];
const AVAILABILITY_OPTIONS = ["Mañana", "Mediodía", "Tarde", "Noche", "24/7"];
const NETWORK_CONFIG = [
  { key: "x", label: "X / Twitter" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "TikTok" },
  { key: "youtube", label: "YouTube" },
  { key: "threads", label: "Threads" },
];
const MAP_SIZE = { width: 860, height: 620, padding: 28 };
const DEFAULT_VIEW_HASH = "#dashboard";
const DOMESTIC_SCOPE = "provincia";
const EXTERIOR_SCOPE = "exterior";
const MAP_PROVINCE_ALIASES = { baoruco: "Bahoruco" };
const MAP_LABEL_OVERRIDES = {
  "Distrito Nacional": { dx: 18, dy: -10, label: "D.N." },
  "Santo Domingo": { dx: 28, dy: 18, label: "Sto. Dgo.", fontSize: 8.4 },
  "María Trinidad Sánchez": { label: "M.T. Sánchez", fontSize: 8.2 },
  "Hermanas Mirabal": { label: "Hnas. Mirabal", fontSize: 8.2 },
  "San José de Ocoa": { label: "S.J. de Ocoa", fontSize: 8 },
  "Santiago Rodríguez": { label: "S. Rodríguez", fontSize: 8.1 },
  "Sánchez Ramírez": { label: "S. Ramírez", fontSize: 8.2 },
  "Monseñor Nouel": { label: "M. Nouel", fontSize: 8.2 },
  "San Pedro de Macorís": { label: "S.P. de Macorís", fontSize: 7.7 },
};
const NATIONAL_COORDINATION_FIELDS = [
  ["nationalCoordinator", "Coordinador nacional general"],
  ["deputyNationalCoordinator", "Subcoordinador nacional"],
  ["operationsCoordinator", "Responsable de operaciones digitales"],
  ["contentCoordinator", "Responsable de contenidos"],
  ["pollsCoordinator", "Responsable de sondeos"],
];

const state = {
  currentUser: null,
  nationalCoordination: {},
  municipalityCoordinators: [],
  nationalReach: null,
  provinceNetworkReach: {
    provinces: [],
    totals: {},
    grandTotal: 0,
  },
  provincePlans: [],
  exteriorPlans: [],
  records: [],
  territoryProgress: [],
  ownTerritoryInsights: {
    sex: null,
  },
  catalogs: {
    organizationalRoles: [],
    skills: [],
    municipalitiesByProvince: {},
  },
  users: [],
  audits: [],
  ownRecord: null,
  viewMode: "national",
  publicCatalogs: {
    provinces: [],
    exteriorSections: [],
    municipalitiesByProvince: {},
  },
};

const nodes = Object.fromEntries(
  [
    "authScreen",
    "loginForm",
    "loginUsername",
    "loginPassword",
    "loginMessage",
    "createActivistAccountBtn",
    "selfRegistrationDialog",
    "selfRegistrationForm",
    "closeSelfRegistrationBtn",
    "cancelSelfRegistrationBtn",
    "selfUsername",
    "selfPassword",
    "selfConfirmPassword",
    "selfCedula",
    "selfFirstName",
    "selfLastName",
    "selfPhone",
    "selfWhatsapp",
    "selfEmail",
    "selfAgeRange",
    "selfSex",
    "selfTerritoryScope",
    "selfProvinceField",
    "selfProvince",
    "selfExteriorField",
    "selfExteriorSection",
    "selfMunicipality",
    "selfDistrictField",
    "selfDistrict",
    "selfExteriorDistrictField",
    "selfExteriorDistrict",
    "selfRegistrationMessage",
    "passwordDialog",
    "passwordForm",
    "passwordDialogHelp",
    "currentPassword",
    "newPassword",
    "confirmPassword",
    "passwordMessage",
    "cancelPasswordBtn",
    "resetPasswordDialog",
    "resetPasswordForm",
    "resetTargetUserId",
    "resetTemporaryPassword",
    "resetConfirmPassword",
    "resetPasswordMessage",
    "cancelResetPasswordBtn",
    "changePasswordBtn",
    "logoutBtn",
    "sidebarUserName",
    "sidebarUserRole",
    "sidebarToggle",
    "sidebarBackdrop",
    "sidebarCollapse",
    "sidebarNav",
    "moduleEyebrow",
    "moduleTitle",
    "moduleSummary",
    "moduleContextPill",
    "dashboard",
    "heroSignals",
    "heroInsights",
    "heroReach",
    "heroResponse",
    "metricGrid",
    "pulseList",
    "funnelGrid",
    "provinceSummaryTable",
    "toggleNetworkReachBtn",
    "networkReachPanel",
    "networkReachTable",
    "coordinationDirectoryPanel",
    "coordinationDirectory",
    "rdMap",
    "mapStatus",
    "provinceDetail",
    "activistForm",
    "recordId",
    "cedulaInput",
    "autofillStatus",
    "territoryScopeInput",
    "provinceField",
    "exteriorSectionField",
    "districtField",
    "exteriorDistrictField",
    "territoryNameLabel",
    "districtFieldLabel",
    "provCoordinatorLabel",
    "regionalCoordinatorLabel",
    "macroCoordinatorLabel",
    "provinceInput",
    "exteriorSectionInput",
    "exteriorDistrictInput",
    "municipalityInput",
    "regionInput",
    "macroRegionInput",
    "adminRoleSection",
    "roleInput",
    "statusInput",
    "ageRangeInput",
    "sexInput",
    "responseWindowInput",
    "availabilityInput",
    "networkFields",
    "skillsPicker",
    "provinceConfigTable",
    "recordTableBody",
    "recordCount",
    "databaseStatus",
    "territoryWhatsappLink",
    "searchInput",
    "filterProvince",
    "filterRole",
    "filterStatus",
    "clearFormBtn",
    "exportCsvBtn",
    "exportJsonBtn",
    "exportTerritorialBtn",
    "toastStack",
    "userForm",
    "userFullName",
    "userUsername",
    "userAccessRole",
    "userOrganizationalRole",
    "userTemporaryPassword",
    "userFormMessage",
    "userTableBody",
    "auditTableBody",
    "heroPrimaryAction",
    "heroSecondaryAction",
  ].map((id) => [id, document.getElementById(id)])
);
nodes.appShell = document.querySelector(".app-shell");
nodes.contentShell = document.querySelector(".content-shell");
nodes.appViews = [...document.querySelectorAll(".app-view")];

let mapModel = null;
let loadingState = false;
let nationalAssignmentQuery = "";
const selectedMunicipalities = new Map();

bootstrap();

function bootstrap() {
  attachEvents();
  initializeSession();
}

async function initializeSession() {
  try {
    const { user } = await api("/api/auth/me", { allowUnauthorized: true });
    await acceptAuthenticatedUser(user);
  } catch {
    showLogin();
  }
}

function attachEvents() {
  nodes.loginForm.addEventListener("submit", handleLogin);
  nodes.createActivistAccountBtn.addEventListener("click", openSelfRegistration);
  nodes.closeSelfRegistrationBtn.addEventListener("click", () => nodes.selfRegistrationDialog.close());
  nodes.cancelSelfRegistrationBtn.addEventListener("click", () => nodes.selfRegistrationDialog.close());
  nodes.selfRegistrationForm.addEventListener("submit", handleSelfRegistration);
  nodes.selfTerritoryScope.addEventListener("change", syncSelfRegistrationTerritory);
  nodes.selfProvince.addEventListener("change", syncSelfRegistrationTerritory);
  nodes.selfExteriorSection.addEventListener("change", syncSelfRegistrationTerritory);
  nodes.selfCedula.addEventListener("input", () => {
    nodes.selfCedula.value = normalizeCedula(nodes.selfCedula.value);
  });
  nodes.passwordForm.addEventListener("submit", handlePasswordChange);
  nodes.cancelPasswordBtn.addEventListener("click", () => nodes.passwordDialog.close());
  nodes.resetPasswordForm.addEventListener("submit", handleResetUserPassword);
  nodes.cancelResetPasswordBtn.addEventListener("click", () => nodes.resetPasswordDialog.close());
  nodes.changePasswordBtn.addEventListener("click", () => openPasswordDialog(false));
  nodes.logoutBtn.addEventListener("click", handleLogout);
  nodes.sidebarToggle.addEventListener("click", () => setSidebarOpen(true));
  nodes.sidebarBackdrop.addEventListener("click", () => setSidebarOpen(false));
  nodes.sidebarCollapse.addEventListener("click", toggleSidebarCollapsed);
  window.addEventListener("resize", () => !isMobileViewport() && setSidebarOpen(false));
  window.addEventListener("hashchange", () => activateView(window.location.hash || DEFAULT_VIEW_HASH));

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      activateView(link.getAttribute("href"), { updateHash: true });
      if (isMobileViewport()) setSidebarOpen(false);
    });
  });

  nodes.territoryScopeInput.addEventListener("change", () => {
    syncTerritoryScopeUI();
    syncLocationFieldsFromPlan();
  });
  nodes.provinceInput.addEventListener("change", syncLocationFieldsFromPlan);
  nodes.exteriorSectionInput.addEventListener("change", syncLocationFieldsFromPlan);
  document.getElementById("inductionInput").addEventListener("change", () =>
    syncInductionControls(true)
  );
  nodes.cedulaInput.addEventListener("input", formatCedulaInput);
  nodes.cedulaInput.addEventListener("blur", findRecordByCedula);
  nodes.activistForm.addEventListener("submit", handleRecordSubmit);
  nodes.clearFormBtn.addEventListener("click", () => clearForm());
  nodes.exportCsvBtn.addEventListener("click", exportRecordsCsv);
  nodes.exportJsonBtn.addEventListener("click", exportRecordsJson);
  nodes.exportTerritorialBtn.addEventListener("click", exportTerritorialCsv);
  nodes.toggleNetworkReachBtn.addEventListener("click", () => {
    setNetworkReachView(nodes.networkReachPanel.hidden);
  });
  [nodes.searchInput, nodes.filterProvince, nodes.filterRole, nodes.filterStatus].forEach((input) => {
    input.addEventListener("input", renderRecordTable);
    input.addEventListener("change", renderRecordTable);
  });
  nodes.userForm.addEventListener("submit", handleCreateUser);
}

async function api(url, options = {}) {
  const request = {
    method: options.method || "GET",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "X-RADC28-Request": "1",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  };
  const response = await fetch(url, request);
  const data = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && !options.allowUnauthorized && !url.includes("/api/auth/")) {
      showLogin("La sesión terminó. Inicie sesión nuevamente.");
    }
    throw Object.assign(new Error(data?.error || "No fue posible completar la operación."), {
      status: response.status,
      code: data?.code,
    });
  }
  return data;
}

async function handleLogin(event) {
  event.preventDefault();
  setMessage(nodes.loginMessage, "");
  setFormBusy(nodes.loginForm, true);
  try {
    const { user } = await api("/api/auth/login", {
      method: "POST",
      body: { username: nodes.loginUsername.value, password: nodes.loginPassword.value },
      allowUnauthorized: true,
    });
    nodes.loginPassword.value = "";
    await acceptAuthenticatedUser(user);
  } catch (error) {
    setMessage(nodes.loginMessage, error.message, true);
  } finally {
    setFormBusy(nodes.loginForm, false);
  }
}

async function openSelfRegistration() {
  nodes.selfRegistrationForm.reset();
  setMessage(nodes.selfRegistrationMessage, "");
  try {
    if (!state.publicCatalogs.provinces.length) {
      state.publicCatalogs = await api("/api/public/catalogs", {
        allowUnauthorized: true,
      });
    }
    populateSelect(
      nodes.selfProvince,
      state.publicCatalogs.provinces.map((item) => item.province)
    );
    populateSelect(
      nodes.selfExteriorSection,
      state.publicCatalogs.exteriorSections.map((item) => item.seccional),
      true
    );
    populateSelect(nodes.selfAgeRange, AGE_RANGE_OPTIONS, true);
    populateSelect(nodes.selfSex, SEX_OPTIONS, true);
    nodes.selfTerritoryScope.value = DOMESTIC_SCOPE;
    syncSelfRegistrationTerritory();
    nodes.selfRegistrationDialog.showModal();
  } catch (error) {
    setMessage(nodes.loginMessage, error.message, true);
  }
}

function syncSelfRegistrationTerritory() {
  const exterior = nodes.selfTerritoryScope.value === EXTERIOR_SCOPE;
  nodes.selfProvinceField.classList.toggle("hidden", exterior);
  nodes.selfExteriorField.classList.toggle("hidden", !exterior);
  nodes.selfDistrictField.classList.toggle("hidden", exterior);
  nodes.selfExteriorDistrictField.classList.toggle("hidden", !exterior);
  nodes.selfProvince.required = !exterior;
  nodes.selfExteriorSection.required = exterior;
  const municipalities = exterior
    ? [nodes.selfExteriorSection.value].filter(Boolean)
    : state.publicCatalogs.municipalitiesByProvince?.[nodes.selfProvince.value] || [];
  populateSelect(nodes.selfMunicipality, municipalities, municipalities.length === 0);
  nodes.selfMunicipality.required = municipalities.length > 0;
}

async function handleSelfRegistration(event) {
  event.preventDefault();
  if (nodes.selfPassword.value !== nodes.selfConfirmPassword.value) {
    return setMessage(nodes.selfRegistrationMessage, "Las contraseñas no coinciden.", true);
  }
  setFormBusy(nodes.selfRegistrationForm, true);
  setMessage(nodes.selfRegistrationMessage, "");
  try {
    const exterior = nodes.selfTerritoryScope.value === EXTERIOR_SCOPE;
    const { user } = await api("/api/public/register", {
      method: "POST",
      allowUnauthorized: true,
      body: {
        username: nodes.selfUsername.value,
        password: nodes.selfPassword.value,
        cedula: nodes.selfCedula.value,
        firstName: nodes.selfFirstName.value,
        lastName: nodes.selfLastName.value,
        phone: nodes.selfPhone.value,
        whatsapp: nodes.selfWhatsapp.value,
        email: nodes.selfEmail.value,
        ageRange: nodes.selfAgeRange.value,
        sex: nodes.selfSex.value,
        territoryScope: nodes.selfTerritoryScope.value,
        province: exterior ? "" : nodes.selfProvince.value,
        exteriorSection: exterior ? nodes.selfExteriorSection.value : "",
        exteriorCircunscription: exterior ? nodes.selfExteriorDistrict.value : "",
        municipality: nodes.selfMunicipality.value,
        districtMunicipal: exterior ? "" : nodes.selfDistrict.value,
      },
    });
    nodes.selfRegistrationDialog.close();
    await acceptAuthenticatedUser(user);
    toast("Su cuenta de activista fue creada correctamente.");
  } catch (error) {
    setMessage(nodes.selfRegistrationMessage, error.message, true);
  } finally {
    setFormBusy(nodes.selfRegistrationForm, false);
  }
}

async function acceptAuthenticatedUser(user) {
  state.currentUser = user;
  document.body.classList.add("is-authenticated");
  nodes.authScreen.hidden = true;
  nodes.sidebarUserName.textContent = user.fullName;
  nodes.sidebarUserRole.textContent =
    user.accessRole === "admin" ? "Administrador" : user.organizationalRole || "Acceso operativo";
  const isActivist = user.accessRole === "activist";
  document.querySelectorAll(".staff-only").forEach((node) => {
    node.hidden = isActivist;
  });
  document.querySelectorAll(".admin-only").forEach((node) => {
    node.hidden = user.accessRole !== "admin";
  });
  const registrationLabel = document.querySelector('a[href="#registro"] .side-link-label');
  const databaseLabel = document.querySelector('a[href="#base"] .side-link-label');
  if (registrationLabel) registrationLabel.textContent = isActivist ? "Mi perfil" : "Registro";
  if (databaseLabel) databaseLabel.textContent = isActivist ? "Mi territorio" : "Directorio";

  if (user.mustChangePassword) {
    openPasswordDialog(true);
    return;
  }
  await loadApplicationState();
}

function showLogin(message = "") {
  state.currentUser = null;
  document.body.classList.remove("is-authenticated");
  nodes.authScreen.hidden = false;
  if (nodes.passwordDialog.open) nodes.passwordDialog.close();
  setMessage(nodes.loginMessage, message, Boolean(message));
  window.setTimeout(() => nodes.loginUsername.focus(), 0);
}

function openPasswordDialog(required) {
  nodes.passwordForm.reset();
  setMessage(nodes.passwordMessage, "");
  nodes.cancelPasswordBtn.hidden = required;
  nodes.passwordDialogHelp.textContent = required
    ? "Debe reemplazar la contraseña temporal antes de utilizar la plataforma."
    : "Actualice la contraseña de su cuenta.";
  nodes.passwordDialog.showModal();
}

async function handlePasswordChange(event) {
  event.preventDefault();
  if (nodes.newPassword.value !== nodes.confirmPassword.value) {
    return setMessage(nodes.passwordMessage, "Las contraseñas nuevas no coinciden.", true);
  }
  setFormBusy(nodes.passwordForm, true);
  try {
    await api("/api/auth/change-password", {
      method: "POST",
      body: {
        currentPassword: nodes.currentPassword.value,
        newPassword: nodes.newPassword.value,
      },
    });
    state.currentUser.mustChangePassword = false;
    nodes.passwordDialog.close();
    toast("Contraseña actualizada correctamente.");
    await loadApplicationState();
  } catch (error) {
    setMessage(nodes.passwordMessage, error.message, true);
  } finally {
    setFormBusy(nodes.passwordForm, false);
  }
}

async function handleLogout() {
  try {
    await api("/api/auth/logout", { method: "POST" });
  } finally {
    showLogin();
  }
}

async function loadApplicationState() {
  if (loadingState) return;
  loadingState = true;
  nodes.databaseStatus.textContent = "Sincronizando con la base central...";
  try {
    const snapshot = await api("/api/state");
    Object.assign(state, snapshot);
    configureAccessView();
    renderStaticOptions();
    renderAll();
    mapModel = null;
    await mountProvinceMap();
    if (state.currentUser.accessRole === "admin") await loadUsers();
    activateView(window.location.hash || DEFAULT_VIEW_HASH);
  } catch (error) {
    toast(error.message, "warning");
  } finally {
    loadingState = false;
  }
}

function renderStaticOptions() {
  populateSelect(nodes.statusInput, STATUS_OPTIONS);
  populateSelect(nodes.roleInput, state.catalogs.organizationalRoles);
  populateSelect(nodes.ageRangeInput, AGE_RANGE_OPTIONS, true);
  populateSelect(nodes.sexInput, SEX_OPTIONS, true);
  populateSelect(nodes.responseWindowInput, RESPONSE_WINDOWS);
  populateSelect(nodes.availabilityInput, AVAILABILITY_OPTIONS);
  populateSelect(nodes.provinceInput, state.provincePlans.map((plan) => plan.province));
  populateSelect(nodes.exteriorSectionInput, state.exteriorPlans.map((plan) => plan.seccional), true);
  populateSelect(nodes.userOrganizationalRole, state.catalogs.organizationalRoles);
  renderSkillChips();
  renderNetworkCards();
  clearForm();
}

function configureAccessView() {
  const activist = state.currentUser?.accessRole === "activist";
  [
    nodes.territoryScopeInput,
    nodes.provinceInput,
    nodes.exteriorSectionInput,
    nodes.statusInput,
    document.getElementById("provCoordinatorInput"),
    document.getElementById("regionalCoordinatorInput"),
    document.getElementById("macroCoordinatorInput"),
  ].forEach((control) => {
    if (control) control.disabled = activist;
  });
  nodes.clearFormBtn.hidden = activist;
  document.getElementById("saveRecordBtn").textContent = activist
    ? "Actualizar mi perfil"
    : "Guardar registro";
  syncInductionControls(false);

  const dashboardView = document.getElementById("dashboard");
  const registrationView = document.getElementById("registro");
  const databaseView = document.getElementById("base");
  const heroTitle = document.querySelector(".hero-copy h2");
  const heroText = document.querySelector(".hero-text");
  const registrationHeading = document.querySelector("#registro .section-intro h3");
  const databaseHeading = document.querySelector("#base .panel-head h3");
  const actionHeading = document.querySelector("#base thead th:last-child");
  const scoreboardHeading = document.querySelector(".scoreboard-panel .panel-head h3");

  if (activist) {
    dashboardView.dataset.moduleTitle = "Mapa nacional y avances de mi territorio";
    dashboardView.dataset.moduleSummary =
      "Compare el avance agregado de las 32 provincias y consulte la operación de su propio territorio.";
    dashboardView.dataset.modulePill = "Competencia territorial";
    registrationView.dataset.moduleTitle = "Mi perfil de activista";
    registrationView.dataset.moduleSummary =
      "Actualice su contacto, disponibilidad, capacidades y redes sociales.";
    registrationView.dataset.modulePill = "Perfil personal";
    databaseView.dataset.moduleTitle = "Directorio de mi territorio";
    databaseView.dataset.moduleSummary =
      "Consulte integrantes, roles y redes públicas de su equipo territorial.";
    databaseView.dataset.modulePill = "Directorio territorial";
    heroTitle.textContent = "Tu territorio dentro del avance nacional.";
    heroText.textContent =
      "Compare el progreso de las provincias en el mapa nacional, siga los indicadores de su equipo y conecte con las redes de los integrantes de su territorio.";
    registrationHeading.textContent = "Mantenga actualizada su ficha y capacidad de activación.";
    databaseHeading.textContent = "Integrantes y redes de mi equipo territorial";
    actionHeading.textContent = "Acceso";
    scoreboardHeading.textContent = "Clasificación nacional de provincias";
    nodes.heroPrimaryAction.textContent = "Actualizar mi ficha";
    nodes.heroSecondaryAction.textContent = "Ver mi directorio";
  } else {
    dashboardView.dataset.moduleTitle = "Centro nacional de operaciones RAD-C28";
    dashboardView.dataset.moduleSummary =
      "Indicadores de registro, cobertura territorial, formación y capacidad de respuesta.";
    dashboardView.dataset.modulePill = "Resumen nacional";
    registrationView.dataset.moduleTitle = "Alta y edicion de activistas RAD-C28";
    registrationView.dataset.moduleSummary =
      "Registra identidad, estructura territorial, redes, disponibilidad y capacidades operativas.";
    registrationView.dataset.modulePill = "Registro operativo";
    databaseView.dataset.moduleTitle = "Consulta, filtros y exportación de registros";
    databaseView.dataset.moduleSummary =
      "Consulta integrantes, abre fichas para edición y genera exportaciones autorizadas.";
    databaseView.dataset.modulePill = "Directorio activo";
    heroTitle.textContent = "Gestión nacional de activistas y estructura territorial.";
    heroText.textContent =
      "Centraliza el registro, la organización territorial, la formación y la capacidad de activación de la Red de Activistas Digitales RAD-C28.";
    registrationHeading.textContent = "Incorporación y actualización de integrantes de RAD-C28.";
    databaseHeading.textContent = "Consulta y seguimiento de integrantes de RAD-C28";
    actionHeading.textContent = "Acciones";
    scoreboardHeading.textContent = "Ranking de provincias y alertas";
    nodes.heroPrimaryAction.textContent = "Registrar activista";
    nodes.heroSecondaryAction.textContent = "Consultar registros";
  }
}

function renderAll() {
  renderCoordinationDirectory();
  renderMetrics();
  renderPulse();
  renderFunnel();
  renderProvinceSummary();
  renderProvinceNetworkReach();
  renderStructure();
  renderFilters();
  renderRecordTable();
  updateHeroSignals();
  renderHeroInsights();
  paintMap();
}

async function handleRecordSubmit(event) {
  event.preventDefault();
  const payload = collectFormData();
  if (!payload.cedula || !payload.firstName || !payload.lastName) {
    return toast("Complete cédula, nombre y apellido.", "warning");
  }
  setFormBusy(nodes.activistForm, true);
  try {
    const id = nodes.recordId.value;
    await api(id ? `/api/activists/${encodeURIComponent(id)}` : "/api/activists", {
      method: id ? "PUT" : "POST",
      body: payload,
    });
    toast(id ? "Registro actualizado." : "Activista registrado.");
    await refreshState();
    clearForm();
  } catch (error) {
    toast(error.message, "warning");
  } finally {
    setFormBusy(nodes.activistForm, false);
  }
}

function collectFormData() {
  const networks = Object.fromEntries(
    NETWORK_CONFIG.map(({ key }) => [
      key,
      {
        handle: valueOf(`${key}Handle`),
        followers: Number(document.getElementById(`${key}Followers`).value || 0),
        active: document.getElementById(`${key}Active`).checked,
      },
    ])
  );
  return {
    cedula: nodes.cedulaInput.value,
    firstName: valueOf("firstNameInput"),
    lastName: valueOf("lastNameInput"),
    phone: valueOf("phoneInput"),
    whatsapp: valueOf("whatsappInput"),
    email: valueOf("emailInput"),
    ageRange: nodes.ageRangeInput.value,
    sex: nodes.sexInput.value,
    territoryScope: nodes.territoryScopeInput.value,
    status: nodes.statusInput.value,
    province: nodes.provinceInput.value,
    exteriorSection: nodes.exteriorSectionInput.value,
    exteriorCircunscription: nodes.exteriorDistrictInput.value,
    municipality: valueOf("municipalityInput"),
    districtMunicipal: valueOf("districtInput"),
    region: nodes.regionInput.value,
    macroRegion: nodes.macroRegionInput.value,
    role: nodes.recordId.value ? nodes.roleInput.value : "Activista",
    provincialCoordinator: valueOf("provCoordinatorInput"),
    regionalCoordinator: valueOf("regionalCoordinatorInput"),
    macroCoordinator: valueOf("macroCoordinatorInput"),
    tookInduction: document.getElementById("inductionInput").checked,
    inductionDate: valueOf("inductionDateInput"),
    c28Registered: document.getElementById("c28Input").checked,
    responseWindow: nodes.responseWindowInput.value,
    availability: nodes.availabilityInput.value,
    pollSquad: document.getElementById("pollSquadInput").checked,
    skills: [...document.querySelectorAll(".skill-chip input:checked")].map((input) => input.value),
    networks,
    notes: valueOf("notesInput"),
  };
}

async function refreshState() {
  const snapshot = await api("/api/state");
  Object.assign(state, snapshot);
  configureAccessView();
  renderAll();
  mapModel = null;
  await mountProvinceMap();
}

function findRecordByCedula() {
  if (state.currentUser?.accessRole === "activist") return;
  const cedula = normalizeCedula(nodes.cedulaInput.value);
  if (cedula.length !== 13) {
    nodes.autofillStatus.textContent = "Cédula incompleta";
    return;
  }
  const record = state.records.find((item) => item.cedula === cedula);
  if (record) {
    loadRecordIntoForm(record);
    nodes.autofillStatus.textContent = "Registro encontrado";
    toast("Se cargó el registro existente para edición.");
  } else {
    nodes.autofillStatus.textContent = "Nuevo registro";
  }
}

function loadRecordIntoForm(record) {
  nodes.recordId.value = record.id;
  nodes.territoryScopeInput.value = record.territoryScope;
  nodes.provinceInput.value = record.province;
  nodes.exteriorSectionInput.value = record.exteriorSection;
  syncTerritoryScopeUI();
  syncLocationFieldsFromPlan(record.municipality);
  nodes.adminRoleSection.classList.toggle(
    "hidden",
    state.currentUser?.accessRole === "activist"
  );
  const values = {
    cedulaInput: record.cedula,
    firstNameInput: record.firstName,
    lastNameInput: record.lastName,
    phoneInput: record.phone,
    whatsappInput: record.whatsapp,
    emailInput: record.email,
    ageRangeInput: record.ageRange,
    sexInput: record.sex,
    statusInput: record.status,
    exteriorDistrictInput: record.exteriorCircunscription,
    districtInput: record.districtMunicipal,
    roleInput: record.role,
    inductionDateInput: record.inductionDate,
    responseWindowInput: record.responseWindow,
    availabilityInput: record.availability,
    notesInput: record.notes,
  };
  Object.entries(values).forEach(([id, value]) => setValue(id, value));
  setChecked("inductionInput", record.tookInduction);
  setChecked("c28Input", record.c28Registered);
  setChecked("pollSquadInput", record.pollSquad);
  syncInductionControls(false);
  document.querySelectorAll(".skill-chip input").forEach((input) => {
    input.checked = record.skills.includes(input.value);
  });
  NETWORK_CONFIG.forEach(({ key }) => {
    const network = record.networks[key] || {};
    setValue(`${key}Handle`, network.handle || "");
    setValue(`${key}Followers`, network.followers || 0);
    setChecked(`${key}Active`, network.active);
  });
}

function clearForm() {
  if (state.currentUser?.accessRole === "activist" && state.ownRecord) {
    loadRecordIntoForm(state.ownRecord);
    nodes.autofillStatus.textContent = "Mi ficha de activista";
    return;
  }
  nodes.activistForm.reset();
  nodes.recordId.value = "";
  nodes.adminRoleSection.classList.add("hidden");
  nodes.territoryScopeInput.value = DOMESTIC_SCOPE;
  nodes.statusInput.value = STATUS_OPTIONS[0];
  nodes.responseWindowInput.value = RESPONSE_WINDOWS[1];
  nodes.availabilityInput.value = AVAILABILITY_OPTIONS[0];
  nodes.provinceInput.value = state.provincePlans[0]?.province || "";
  nodes.autofillStatus.textContent = "Cédula sin validar";
  syncTerritoryScopeUI();
  syncLocationFieldsFromPlan();
  syncInductionControls(false);
  document.querySelectorAll(".skill-chip input").forEach((input) => (input.checked = false));
}

async function deleteRecord(id) {
  const record = state.records.find((item) => item.id === id);
  if (!record || !window.confirm(`¿Eliminar a ${record.firstName} ${record.lastName}?`)) return;
  try {
    await api(`/api/activists/${encodeURIComponent(id)}`, { method: "DELETE" });
    toast("Registro eliminado.", "warning");
    await refreshState();
  } catch (error) {
    toast(error.message, "warning");
  }
}

function syncTerritoryScopeUI() {
  const exterior = nodes.territoryScopeInput.value === EXTERIOR_SCOPE;
  nodes.provinceField.classList.toggle("hidden", exterior);
  nodes.exteriorSectionField.classList.toggle("hidden", !exterior);
  nodes.districtField.classList.toggle("hidden", exterior);
  nodes.exteriorDistrictField.classList.toggle("hidden", !exterior);
  nodes.provinceInput.required = !exterior;
  nodes.exteriorSectionInput.required = exterior;
  nodes.municipalityInput.required = !exterior || Boolean(nodes.exteriorSectionInput.value);
  nodes.provCoordinatorLabel.textContent = exterior ? "Responsable seccional" : "Coordinador provincial";
  nodes.regionalCoordinatorLabel.textContent = exterior
    ? "Coordinador de circunscripción"
    : "Coordinador regional";
  nodes.macroCoordinatorLabel.textContent = exterior ? "Enlace de exterior" : "Coordinador macroregional";
}

function syncLocationFieldsFromPlan(preferredMunicipality = "") {
  const preferred =
    typeof preferredMunicipality === "string"
      ? preferredMunicipality
      : nodes.municipalityInput.value;
  if (nodes.territoryScopeInput.value === EXTERIOR_SCOPE) {
    const plan = state.exteriorPlans.find((item) => item.seccional === nodes.exteriorSectionInput.value);
    nodes.regionInput.value = plan?.zone || "";
    nodes.macroRegionInput.value = plan?.macroRegion || "Exterior";
    setValue("provCoordinatorInput", plan?.provincialCoordinator || "");
    setValue("regionalCoordinatorInput", plan?.regionalCoordinator || "");
    setValue("macroCoordinatorInput", plan?.macroCoordinator || "");
    const cityOptions = [plan?.seccional].filter(Boolean);
    populateSelect(nodes.municipalityInput, cityOptions, cityOptions.length === 0);
  } else {
    const plan = state.provincePlans.find((item) => item.province === nodes.provinceInput.value);
    nodes.regionInput.value = plan?.region || "";
    nodes.macroRegionInput.value = plan?.macroRegion || "";
    setValue("provCoordinatorInput", plan?.provincialCoordinator || "");
    setValue("regionalCoordinatorInput", plan?.regionalCoordinator || "");
    setValue("macroCoordinatorInput", plan?.macroCoordinator || "");
    const municipalities =
      state.catalogs.municipalitiesByProvince?.[nodes.provinceInput.value] || [];
    populateSelect(
      nodes.municipalityInput,
      municipalities,
      municipalities.length === 0
    );
  }
  if ([...nodes.municipalityInput.options].some((option) => option.value === preferred)) {
    nodes.municipalityInput.value = preferred;
  }
  nodes.municipalityInput.required = nodes.municipalityInput.options.length > 0;
}

function syncInductionControls(setDefaultDate) {
  const induction = document.getElementById("inductionInput");
  const date = document.getElementById("inductionDateInput");
  date.disabled = !induction.checked;
  date.required = induction.checked;
  if (!induction.checked) {
    date.value = "";
  } else if (setDefaultDate && !date.value) {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    date.value = today.toISOString().slice(0, 10);
  }
}

function renderCoordinationDirectory() {
  const cards = NATIONAL_COORDINATION_FIELDS.map(([key, label]) => ({
    label,
    ...(state.nationalCoordination?.[key] || {}),
  }));
  if (state.currentUser?.accessRole === "activist") {
    const ownPlan = getOwnTerritoryPlan();
    const territorialAssignments = [
      [
        state.ownRecord?.territoryScope === EXTERIOR_SCOPE
          ? "Responsable seccional"
          : "Coordinador provincial",
        ownPlan?.provincialCoordinator,
      ],
      [
        state.ownRecord?.territoryScope === EXTERIOR_SCOPE
          ? "Coordinador de circunscripción"
          : "Coordinador regional",
        ownPlan?.regionalCoordinator,
      ],
      [
        state.ownRecord?.territoryScope === EXTERIOR_SCOPE
          ? "Enlace de exterior"
          : "Coordinador macroregional",
        ownPlan?.macroCoordinator,
      ],
    ];
    territorialAssignments.forEach(([label, fullName]) => {
      cards.push({
        label,
        fullName: fullName || "",
        organizationalRole: "Coordinación de mi territorio",
        territory:
          state.ownRecord?.territoryScope === EXTERIOR_SCOPE
            ? state.ownRecord?.exteriorSection
            : state.ownRecord?.province,
      });
    });
    const municipalAssignment = state.municipalityCoordinators.find(
      (assignment) =>
        assignment.province === state.ownRecord?.province &&
        assignment.municipality === state.ownRecord?.municipality
    );
    const municipalRoleRecord = municipalAssignment
      ? null
      : findTerritorialRoleAssignment("Coordinador municipal");
    cards.push({
      label: "Coordinador municipal",
      fullName:
        municipalAssignment?.coordinatorName ||
        (municipalRoleRecord
          ? `${municipalRoleRecord.firstName} ${municipalRoleRecord.lastName}`
          : ""),
      organizationalRole: "Coordinación municipal",
      territory: [state.ownRecord?.municipality, state.ownRecord?.province]
        .filter(Boolean)
        .join(" · "),
    });
    [["Enlace de contenidos territorial", "Apoyo de contenidos"]].forEach(
      ([label, role]) => {
      const record = findTerritorialRoleAssignment(role);
      const publicNetworks = record ? formatNetworkHandles(record.networks) : "";
      cards.push({
        label,
        fullName: record ? `${record.firstName} ${record.lastName}` : "",
        organizationalRole: record?.role || "",
        territory: record
          ? [record.municipality, territoryName(record)].filter(Boolean).join(" · ")
          : "",
        publicNetworks:
          publicNetworks && publicNetworks !== "Sin redes registradas"
            ? publicNetworks
            : "",
      });
      }
    );
  }

  nodes.coordinationDirectory.innerHTML = cards
    .map((assignment) => {
      const contact = [
        assignment.whatsapp ? `WhatsApp: ${assignment.whatsapp}` : "",
        assignment.phone ? `Tel.: ${assignment.phone}` : "",
        assignment.email || "",
        assignment.publicNetworks ? `Redes: ${assignment.publicNetworks}` : "",
      ].filter(Boolean);
      return `
        <article class="coordination-directory-card${assignment.fullName ? "" : " is-vacant"}">
          <p>${escapeHtml(assignment.label)}</p>
          <strong>${escapeHtml(assignment.fullName || "Por asignar")}</strong>
          ${
            assignment.fullName
              ? `<span>${escapeHtml(
                  [assignment.organizationalRole, assignment.territory]
                    .filter(Boolean)
                    .join(" · ")
                )}</span>`
              : "<span>La administración aún no ha realizado esta designación.</span>"
          }
          ${
            contact.length
              ? `<small>${contact.map((item) => escapeHtml(item)).join("<br>")}</small>`
              : ""
          }
        </article>`;
    })
    .join("");
}

function findTerritorialRoleAssignment(role) {
  if (!state.ownRecord) return null;
  const candidates = state.records.filter((record) => record.role === role);
  return (
    candidates.find(
      (record) =>
        state.ownRecord.municipality &&
        record.municipality === state.ownRecord.municipality
    ) ||
    candidates[0] ||
    null
  );
}

function renderMetrics() {
  const metrics = computeMetrics();
  const activistView = state.currentUser?.accessRole === "activist";
  const cards = activistView
    ? [
        ["Mi equipo territorial", metrics.totalRecords, "integrantes visibles en mi directorio", `${metrics.activeRecords} activos`],
        ["Alcance de mi equipo", formatCompact(metrics.totalReach), "seguidores declarados en redes activas", `${metrics.multiNetworkRate}% con 3 redes o más`],
        ["Inducción de mi equipo", `${metrics.inductionRate}%`, "completó el taller", `${metrics.inductedCount} integrantes`],
        ["Inscripción C28 de mi equipo", `${metrics.c28Rate}%`, "con inscripción confirmada", `${metrics.c28Count} altas`],
        ["Respuesta de mi equipo", `${metrics.rapidResponseRate}%`, "disponible en 15 minutos o menos", `${metrics.rapidResponseCount} integrantes`],
        ["Provincias en verde", metrics.greenProvinces, "avance nacional agregado", `${metrics.yellowProvinces} en progreso`],
      ]
    : [
        ["Registros totales", metrics.totalRecords, "integrantes en la base central", `${metrics.activeRecords} activos`],
        ["Alcance declarado", formatCompact(metrics.totalReach), "seguidores registrados en redes activas", `${metrics.multiNetworkRate}% con 3 redes o más`],
        ["Inducción", `${metrics.inductionRate}%`, "completó el taller", `${metrics.inductedCount} integrantes`],
        ["Inscripción C28", `${metrics.c28Rate}%`, "con inscripción confirmada", `${metrics.c28Count} altas`],
        ["Respuesta temprana", `${metrics.rapidResponseRate}%`, "disponible en 15 minutos o menos", `${metrics.rapidResponseCount} integrantes`],
        ["Provincias conformes", metrics.greenProvinces, "territorios con avance sólido", `${metrics.yellowProvinces} en progreso`],
      ];
  nodes.metricGrid.innerHTML = cards
    .map(
      ([label, value, caption, trend]) => `
        <article class="metric-card">
          <p class="eyebrow">${escapeHtml(label)}</p>
          <strong>${escapeHtml(value)}</strong>
          <span>${escapeHtml(caption)}</span>
          <div class="metric-trend">${escapeHtml(trend)}</div>
        </article>`
    )
    .join("");
}

function updateHeroSignals() {
  const metrics = computeMetrics();
  const activistView = state.currentUser?.accessRole === "activist";
  const signals = [
    ["Cobertura nacional", `${metrics.coveredProvinces}/${state.provincePlans.length}`, "provincias con registros"],
    [activistView ? "Formación de mi equipo" : "Formación operativa", `${metrics.inductionRate}%`, "con inducción completada"],
    [activistView ? "Mi equipo en 15 min" : "Listos en 15 min", metrics.rapidResponseCount, "capacidad de respuesta temprana"],
  ];
  nodes.heroSignals.innerHTML = signals
    .map(
      ([label, value, caption]) => `
        <div class="signal-card">
          <p class="eyebrow">${escapeHtml(label)}</p>
          <strong>${escapeHtml(value)}</strong>
          <span>${escapeHtml(caption)}</span>
        </div>`
    )
    .join("");
  nodes.heroReach.textContent = formatCompact(getNationalReach());
  nodes.heroResponse.textContent = `${metrics.rapidResponseRate}%`;
}

function renderHeroInsights() {
  const activistView = state.currentUser?.accessRole === "activist";
  const summaries = buildProvinceSummaries();
  const sex =
    activistView && state.ownTerritoryInsights?.sex
      ? state.ownTerritoryInsights.sex
      : computeSexSummary(state.records);
  const ownTerritoryName = state.ownRecord ? territoryName(state.ownRecord) : "";
  const territorySummary = activistView
    ? state.ownRecord?.territoryScope === EXTERIOR_SCOPE
      ? getExteriorSummary(state.ownRecord.exteriorSection)
      : getProvinceSummary(state.ownRecord?.province)
    : null;
  const compliance = activistView
    ? territorySummary?.score || 0
    : average(summaries.map((summary) => summary.score));
  const complianceStatus =
    compliance >= 75 ? "Verde" : compliance >= 45 ? "Amarillo" : "Rojo";
  const reach = activistView
    ? territorySummary?.totalFollowers || 0
    : state.records.reduce((sum, record) => sum + totalFollowers(record.networks), 0);
  const reachRanking =
    activistView && state.ownRecord?.territoryScope === DOMESTIC_SCOPE
      ? [...summaries]
          .sort((a, b) => b.totalFollowers - a.totalFollowers)
          .findIndex((summary) => summary.province === state.ownRecord.province) + 1
      : 0;
  const declaredSexCaption = sex.declaredCount
    ? `${sex.declaredCount} ${sex.declaredCount === 1 ? "registro declarado" : "registros declarados"}`
    : "Sin datos declarados";
  const complianceCaption = activistView
    ? ownTerritoryName
    : "Promedio agregado de las 32 provincias";
  const reachCaption = activistView
    ? `${ownTerritoryName}${reachRanking ? ` · posición ${reachRanking} nacional` : ""}`
    : `${summaries.filter((summary) => summary.totalFollowers > 0).length} provincias con alcance declarado`;

  nodes.heroInsights.innerHTML = `
    <article class="hero-insight-card hero-insight-sex">
      <div class="hero-insight-head">
        <p class="eyebrow">Sexo</p>
        <span>${escapeHtml(declaredSexCaption)}</span>
      </div>
      <div class="metric-sex-row">
        <div class="metric-sex-chip metric-sex-chip-female">
          <span>Femenino</span><strong>${sex.femaleRate}%</strong><small>${sex.femaleCount}</small>
        </div>
        <div class="metric-sex-chip metric-sex-chip-male">
          <span>Masculino</span><strong>${sex.maleRate}%</strong><small>${sex.maleCount}</small>
        </div>
      </div>
      <div class="metric-sex-bar" aria-label="Distribución por sexo">
        <span class="metric-sex-fill metric-sex-fill-female" style="width:${sex.femaleRate}%"></span>
        <span class="metric-sex-fill metric-sex-fill-male" style="width:${sex.maleRate}%"></span>
      </div>
    </article>
    <article class="hero-insight-card">
      <div class="hero-insight-head">
        <p class="eyebrow">Cumplimiento territorial</p>
        <span class="score-chip ${statusClass(complianceStatus)}">${complianceStatus}</span>
      </div>
      <strong class="hero-insight-value">${compliance}%</strong>
      <div class="hero-insight-progress" aria-label="Nivel de cumplimiento territorial">
        <span style="width:${compliance}%"></span>
      </div>
      <small>${escapeHtml(complianceCaption)}</small>
    </article>
    <article class="hero-insight-card hero-insight-reach">
      <div class="hero-insight-head">
        <p class="eyebrow">Alcance territorial</p>
        <span>Redes activas</span>
      </div>
      <strong class="hero-insight-value">${formatCompact(reach)}</strong>
      <small>seguidores declarados</small>
      <div class="hero-insight-territory">${escapeHtml(reachCaption)}</div>
    </article>`;
}

function renderPulse() {
  const metrics = computeMetrics();
  const summaries = buildProvinceSummaries();
  const activistView = state.currentUser?.accessRole === "activist";
  const items = [
    ["Cobertura nacional sobre metas", average(summaries.map((item) => item.coverageScore)), "Avance agregado de las provincias respecto a sus metas."],
    [activistView ? "Formación de mi equipo" : "Formación", metrics.inductionRate, "Integrantes con taller de inducción completado."],
    [activistView ? "Respuesta de mi equipo" : "Respuesta temprana", metrics.rapidResponseRate, "Disponibilidad declarada en 15 minutos o menos."],
    [activistView ? "Sondeos en mi equipo" : "Capacidad de sondeos", metrics.pollSquadRate, "Integrantes disponibles para sondeos y votaciones."],
    [activistView ? "Redes de mi equipo" : "Presencia multicanal", metrics.multiNetworkRate, "Integrantes con actividad declarada en tres redes o más."],
  ];
  nodes.pulseList.innerHTML = items
    .map(
      ([label, value, caption]) => `
        <div class="pulse-item">
          <div class="pulse-title-row"><strong>${escapeHtml(label)}</strong><span>${value}%</span></div>
          <div class="progress-track"><div class="progress-value" style="width:${value}%"></div></div>
          <small class="pulse-caption">${escapeHtml(caption)}</small>
        </div>`
    )
    .join("");
}

function renderFunnel() {
  const metrics = computeMetrics();
  const items = [
    ["Base registrada", metrics.totalRecords, 100, "total de integrantes"],
    ["Inducción completada", metrics.inductedCount, metrics.inductionRate, "formación confirmada"],
    ["Inscritos en C28", metrics.c28Count, metrics.c28Rate, "inscripción confirmada"],
    ["Respuesta en 15 min", metrics.rapidResponseCount, metrics.rapidResponseRate, "respuesta temprana"],
    ["Escuadra de sondeos", metrics.pollSquadCount, metrics.pollSquadRate, "disponibilidad declarada"],
  ];
  nodes.funnelGrid.innerHTML = items
    .map(
      ([label, value, percent, caption]) => `
        <article class="funnel-card">
          <div class="ring" style="--ring-fill:${percent * 3.6}deg"><span>${percent}%</span></div>
          <div><strong>${escapeHtml(label)}</strong><div>${value}</div><small>${escapeHtml(caption)}</small></div>
        </article>`
    )
    .join("");
}

function renderProvinceSummary() {
  const summaries = buildProvinceSummaries().sort((a, b) => b.score - a.score);
  const activistView = state.currentUser?.accessRole === "activist";
  nodes.provinceSummaryTable.innerHTML = `
    <div class="summary-row">
      <strong>Provincia</strong><strong>Avance</strong><strong>Meta</strong>
      <strong>Base</strong><strong>Alcance</strong><strong>Estado</strong>
    </div>
    ${summaries
      .map(
        (item, index) => `
          <button class="summary-row province-summary-trigger${isOwnProvince(item.province) ? " is-own-territory" : ""}" data-province="${escapeAttribute(item.province)}">
            <div><strong>${activistView ? `${index + 1}. ` : ""}${escapeHtml(item.province)}</strong><span class="table-muted">${escapeHtml(item.region)}${isOwnProvince(item.province) ? " · Tu territorio" : ""}</span></div>
            <div>${item.score}%</div><div>${item.targetActivists}</div><div>${item.activists}</div>
            <div>${formatCompact(item.totalFollowers)}</div>
            <div><span class="score-chip ${statusClass(item.status)}">${item.status}</span></div>
          </button>`
      )
      .join("")}`;
  nodes.provinceSummaryTable.querySelectorAll("[data-province]").forEach((button) => {
    button.addEventListener("click", () => selectProvince(button.dataset.province));
  });
}

function renderProvinceNetworkReach() {
  const reach = state.provinceNetworkReach || {
    provinces: [],
    totals: {},
    grandTotal: 0,
  };
  const provinces = Array.isArray(reach.provinces) ? reach.provinces : [];
  const headers = NETWORK_CONFIG.map(
    ({ key, label }) =>
      `<th scope="col" class="network-reach-heading" data-network="${escapeAttribute(key)}">${escapeHtml(label)}</th>`
  ).join("");

  nodes.networkReachTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th scope="col">Provincia</th>
          ${headers}
          <th scope="col">Total provincial</th>
        </tr>
      </thead>
      <tbody>
        ${provinces
          .map(
            (province) => `
              <tr>
                <th scope="row">
                  <strong>${escapeHtml(province.province)}</strong>
                  <span>${escapeHtml(province.region || "")}</span>
                </th>
                ${NETWORK_CONFIG.map(({ key }) => {
                  const value = Math.max(0, Number(province.networks?.[key]) || 0);
                  return `<td title="${escapeAttribute(formatNumber(value))}">${formatCompact(value)}</td>`;
                }).join("")}
                <td class="network-reach-row-total" title="${escapeAttribute(formatNumber(province.total))}">
                  ${formatCompact(province.total)}
                </td>
              </tr>`
          )
          .join("")}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">
            <strong>Total RAD-C28</strong>
            <span>Alcance nacional acumulado</span>
          </th>
          ${NETWORK_CONFIG.map(({ key }) => {
            const value = Math.max(0, Number(reach.totals?.[key]) || 0);
            return `<td title="${escapeAttribute(formatNumber(value))}">${formatCompact(value)}</td>`;
          }).join("")}
          <td title="${escapeAttribute(formatNumber(reach.grandTotal))}">
            ${formatCompact(reach.grandTotal)}
          </td>
        </tr>
      </tfoot>
    </table>`;
}

function setNetworkReachView(showNetworkReach) {
  const visible =
    Boolean(showNetworkReach) && state.currentUser?.accessRole === "admin";
  nodes.provinceSummaryTable.hidden = visible;
  nodes.networkReachPanel.hidden = !visible;
  nodes.toggleNetworkReachBtn.setAttribute("aria-expanded", String(visible));
  nodes.toggleNetworkReachBtn.textContent = visible
    ? "Volver al ranking"
    : "Ver alcance por red";
}

function renderStructure() {
  const coordination = state.nationalCoordination;
  const canAssignNational = state.currentUser?.accessRole === "admin";
  const assignableRecords = state.records
    .filter((record) => record.id)
    .sort((a, b) =>
      `${a.firstName} ${a.lastName}`.localeCompare(
        `${b.firstName} ${b.lastName}`,
        "es"
      )
    );
  nodes.provinceConfigTable.innerHTML = `
    <div class="planner-national-card">
      <div>
        <p class="eyebrow eyebrow-bright">Coordinación nacional</p>
        <h4>Dirección central RAD-C28</h4>
        <p>Responsables nacionales de la operación y sus equipos de apoyo.</p>
      </div>
      ${
        canAssignNational
          ? `<div class="planner-national-search">
              <label for="nationalAssignmentSearch">Buscar persona registrada</label>
              <input
                type="search"
                id="nationalAssignmentSearch"
                value="${escapeAttribute(nationalAssignmentQuery)}"
                placeholder="Nombre, cédula, provincia, municipio o cargo"
                autocomplete="off"
              />
              <small id="nationalAssignmentSearchStatus" aria-live="polite"></small>
            </div>`
          : ""
      }
      <div class="planner-national-grid">
        ${NATIONAL_COORDINATION_FIELDS
          .map(
            ([field, label]) => {
              const assignment = coordination[field] || {};
              return `
              <div class="planner-national-field">
                <label>${escapeHtml(label)}
                  <select data-national="${field}" ${canAssignNational ? "" : "disabled"}>
                    <option value="">Por asignar</option>
                  </select>
                </label>
                <small>${
                  assignment.fullName
                    ? escapeHtml(
                        [
                          assignment.organizationalRole,
                          assignment.whatsapp || assignment.phone || assignment.email,
                        ]
                          .filter(Boolean)
                          .join(" · ")
                      )
                    : "Seleccione una persona registrada."
                }</small>
              </div>`
            }
          )
          .join("")}
      </div>
    </div>
    <div class="planner-role-guide">
      <strong>Metas territoriales</strong>
      <span>Las metas pueden ajustarse según la planificación oficial.</span>
      <span>Los indicadores del dashboard se recalculan automáticamente.</span>
    </div>
    <div class="planner-board-stack">
      ${renderPlanGroups("Exterior", state.exteriorPlans, true)}
      ${["Norte", "Sureste", "Suroeste"]
        .map((macro) => renderPlanGroups(macro, state.provincePlans.filter((item) => item.macroRegion === macro), false))
        .join("")}
    </div>`;

  nodes.provinceConfigTable.querySelectorAll("[data-national]").forEach((input) => {
    input.addEventListener("change", handleCoordinationChange);
  });
  nodes.provinceConfigTable.querySelectorAll("[data-plan-key]").forEach((input) => {
    input.addEventListener("change", handlePlanChange);
  });
  nodes.provinceConfigTable
    .querySelectorAll("[data-municipality-picker]")
    .forEach((input) => input.addEventListener("change", handleMunicipalitySelection));
  nodes.provinceConfigTable
    .querySelectorAll("[data-municipality-coordinator]")
    .forEach((input) =>
      input.addEventListener("change", handleMunicipalityCoordinatorChange)
    );
  const nationalSearch = document.getElementById("nationalAssignmentSearch");
  if (nationalSearch) {
    nationalSearch.addEventListener("input", () => {
      nationalAssignmentQuery = nationalSearch.value;
      updateNationalAssignmentSelects(assignableRecords);
    });
  }
  updateNationalAssignmentSelects(assignableRecords);
}

function updateNationalAssignmentSelects(assignableRecords) {
  const query = normalizeSearchValue(nationalAssignmentQuery);
  const matches =
    query.length >= 2
      ? assignableRecords.filter((record) =>
          normalizeSearchValue(
            [
              record.firstName,
              record.lastName,
              record.cedula,
              territoryName(record),
              record.municipality,
              record.role,
            ].join(" ")
          ).includes(query)
        )
      : [];
  const visibleMatches = matches.slice(0, 50);

  nodes.provinceConfigTable.querySelectorAll("[data-national]").forEach((select) => {
    const field = select.dataset.national;
    const selectedId = state.nationalCoordination[field]?.activistId || "";
    const selectedRecord = assignableRecords.find(
      (record) => record.id === selectedId
    );
    const options = selectedRecord
      ? [
          selectedRecord,
          ...visibleMatches.filter((record) => record.id !== selectedRecord.id),
        ]
      : visibleMatches;
    select.innerHTML = `
      <option value="">Por asignar</option>
      ${options
        .map(
          (record) => `
            <option value="${escapeAttribute(record.id)}" ${
              record.id === selectedId ? "selected" : ""
            }>
              ${escapeHtml(`${record.firstName} ${record.lastName}`)} · ${escapeHtml(
                [record.municipality, territoryName(record), record.role]
                  .filter(Boolean)
                  .join(" · ")
              )}
            </option>`
        )
        .join("")}`;
  });

  const status = document.getElementById("nationalAssignmentSearchStatus");
  if (!status) return;
  if (query.length < 2) {
    status.textContent = `Escriba al menos 2 caracteres para buscar entre ${assignableRecords.length} registros.`;
  } else if (!matches.length) {
    status.textContent = "No se encontraron personas con ese criterio.";
  } else if (matches.length > visibleMatches.length) {
    status.textContent = `${matches.length} coincidencias; se muestran las primeras ${visibleMatches.length}.`;
  } else {
    status.textContent = `${matches.length} ${
      matches.length === 1 ? "persona disponible" : "personas disponibles"
    }.`;
  }
}

function renderPlanGroups(title, plans, exterior) {
  return `
    <details class="planner-group" ${exterior ? "" : "open"}>
      <summary class="planner-group-summary">
        <div class="planner-group-summary-row">
          <div class="planner-group-head"><div><p class="eyebrow">${escapeHtml(title)}</p><h4>${exterior ? "Seccionales del exterior" : `Macroregión ${escapeHtml(title)}`}</h4></div>
          <div class="planner-group-meta">${plans.length} territorios</div></div>
          <span class="planner-group-icon" aria-hidden="true">v</span>
        </div>
      </summary>
      <div class="planner-group-body"><div class="planner-group-grid">
        ${plans.map((plan) => renderPlanCard(plan, exterior)).join("")}
      </div></div>
    </details>`;
}

function renderPlanCard(plan, exterior) {
  const name = exterior ? plan.seccional : plan.province;
  const summary = exterior ? getExteriorSummary(name) : getProvinceSummary(name);
  const municipalities = exterior
    ? []
    : state.catalogs.municipalitiesByProvince?.[name] || [];
  const requestedMunicipality = selectedMunicipalities.get(name) || "";
  const selectedMunicipality = municipalities.includes(requestedMunicipality)
    ? requestedMunicipality
    : "";
  const municipalAssignment = state.municipalityCoordinators.find(
    (assignment) =>
      assignment.province === name &&
      assignment.municipality === selectedMunicipality
  );
  const canAssignMunicipal = state.currentUser?.accessRole === "admin";
  const fields = exterior
    ? [
        ["circunscriptionCount", "Circunscripciones", plan.circunscriptionCount],
        ["sectionalDirectiveGoal", "Meta seccional", plan.sectionalDirectiveGoal],
        ["circunscriptionGoal", "Meta por circunscripción", plan.circunscriptionGoal],
      ]
    : [
        ["plannedCells", "Municipios o DM", plan.plannedCells],
        ["unitGoal", "Meta por territorio", plan.unitGoal],
        ["provincialGoal", "Meta provincial", plan.provincialGoal],
      ];
  return `
    <article class="planner-card">
      <div class="planner-card-head">
        <div><h5>${escapeHtml(name)}</h5><p>${escapeHtml(exterior ? plan.zone : plan.region)}</p></div>
        <span class="score-chip ${statusClass(summary.status)}">${summary.status}</span>
      </div>
      <div class="planner-goal-grid">
        ${fields
          .map(
            ([field, label, value]) => `
              <div class="planner-input"><label>${escapeHtml(label)}
                <input type="number" min="0" value="${Number(value)}"
                  data-plan-key="${escapeAttribute(name)}" data-plan-field="${field}"
                  data-plan-scope="${exterior ? "exterior" : "province"}" />
              </label></div>`
          )
          .join("")}
      </div>
      <div class="planner-goal-grid">
        ${[
          ["provincialCoordinator", exterior ? "Responsable seccional" : "Coordinador provincial"],
          ["regionalCoordinator", exterior ? "Coordinador de circunscripción" : "Coordinador regional"],
          ["macroCoordinator", exterior ? "Enlace de exterior" : "Coordinador macroregional"],
        ]
          .map(
            ([field, label]) => `
              <div class="planner-input"><label>${escapeHtml(label)}
                <input value="${escapeAttribute(plan[field] || "")}"
                  data-plan-key="${escapeAttribute(name)}" data-plan-field="${field}"
                  data-plan-scope="${exterior ? "exterior" : "province"}" />
              </label></div>`
          )
          .join("")}
      </div>
      ${
        exterior
          ? ""
          : `<div class="planner-municipal-assignment">
              <div class="planner-municipal-head">
                <div>
                  <strong>Coordinación municipal</strong>
                  <span>Seleccione el municipio y escriba el nombre de la persona designada.</span>
                </div>
              </div>
              <div class="planner-municipal-grid">
                <label>Municipio
                  <select
                    data-municipality-picker
                    data-municipality-province="${escapeAttribute(name)}"
                    ${canAssignMunicipal ? "" : "disabled"}
                  >
                    <option value="">Seleccione un municipio</option>
                    ${municipalities
                      .map(
                        (municipality) => `
                          <option value="${escapeAttribute(municipality)}" ${
                            municipality === selectedMunicipality ? "selected" : ""
                          }>${escapeHtml(municipality)}</option>`
                      )
                      .join("")}
                  </select>
                </label>
                <label>Nombre del coordinador municipal
                  <input
                    value="${escapeAttribute(
                      municipalAssignment?.coordinatorName || ""
                    )}"
                    placeholder="${
                      selectedMunicipality
                        ? "Escriba el nombre completo"
                        : "Seleccione primero un municipio"
                    }"
                    data-municipality-coordinator
                    data-municipality-province="${escapeAttribute(name)}"
                    ${canAssignMunicipal && selectedMunicipality ? "" : "disabled"}
                  />
                </label>
              </div>
              <small>Esta designación solo será visible para los activistas de ese municipio.</small>
            </div>`
      }
      <div class="planner-input planner-whatsapp-field">
        <label>Enlace del grupo de WhatsApp
          <input type="url" value="${escapeAttribute(plan.whatsappGroupUrl || "")}"
            placeholder="https://chat.whatsapp.com/..."
            data-plan-key="${escapeAttribute(name)}" data-plan-field="whatsappGroupUrl"
            data-plan-scope="${exterior ? "exterior" : "province"}" />
        </label>
      </div>
      <div class="planner-macro-metrics">
        <div class="planner-macro-stat"><span>Base</span><strong>${summary.activists}/${summary.targetActivists}</strong></div>
        <div class="planner-macro-stat"><span>Avance</span><strong>${summary.score}%</strong></div>
      </div>
    </article>`;
}

function handleMunicipalitySelection(event) {
  const province = event.target.dataset.municipalityProvince;
  const municipality = event.target.value;
  selectedMunicipalities.set(province, municipality);
  const container = event.target.closest(".planner-municipal-assignment");
  const coordinatorInput = container?.querySelector(
    "[data-municipality-coordinator]"
  );
  if (!coordinatorInput) return;
  const assignment = state.municipalityCoordinators.find(
    (item) =>
      item.province === province && item.municipality === municipality
  );
  coordinatorInput.value = assignment?.coordinatorName || "";
  coordinatorInput.disabled = !municipality;
  coordinatorInput.placeholder = municipality
    ? "Escriba el nombre completo"
    : "Seleccione primero un municipio";
}

async function handleMunicipalityCoordinatorChange(event) {
  const province = event.target.dataset.municipalityProvince;
  const container = event.target.closest(".planner-municipal-assignment");
  const municipality =
    container?.querySelector("[data-municipality-picker]")?.value || "";
  if (!municipality) {
    toast("Seleccione primero un municipio.", "warning");
    return;
  }
  event.target.disabled = true;
  try {
    await api(
      `/api/plans/municipalities/${encodeURIComponent(
        province
      )}/${encodeURIComponent(municipality)}`,
      {
        method: "PUT",
        body: { coordinatorName: event.target.value.trim() },
      }
    );
    toast(
      event.target.value.trim()
        ? "Coordinador municipal actualizado."
        : "Designación municipal eliminada."
    );
    await refreshState();
  } catch (error) {
    toast(error.message, "warning");
    await refreshState();
  }
}

async function handlePlanChange(event) {
  const scope = event.target.dataset.planScope;
  const key = event.target.dataset.planKey;
  const plans = scope === "exterior" ? state.exteriorPlans : state.provincePlans;
  const plan = plans.find((item) => (scope === "exterior" ? item.seccional : item.province) === key);
  if (!plan) return;
  const field = event.target.dataset.planField;
  plan[field] = event.target.type === "number" ? Number(event.target.value || 0) : event.target.value.trim();
  try {
    await api(
      scope === "exterior"
        ? `/api/plans/exterior/${encodeURIComponent(key)}`
        : `/api/plans/provinces/${encodeURIComponent(key)}`,
      { method: "PUT", body: plan }
    );
    toast("Plan territorial actualizado.");
    await refreshState();
  } catch (error) {
    toast(error.message, "warning");
    await refreshState();
  }
}

async function handleCoordinationChange(event) {
  const field = event.target.dataset.national;
  state.nationalCoordination[field] = {
    ...(state.nationalCoordination[field] || {}),
    activistId: event.target.value,
  };
  try {
    const payload = Object.fromEntries(
      NATIONAL_COORDINATION_FIELDS.map(([key]) => [
        key,
        { activistId: state.nationalCoordination[key]?.activistId || "" },
      ])
    );
    await api("/api/coordination", { method: "PUT", body: payload });
    toast("Coordinación nacional actualizada.");
    await refreshState();
  } catch (error) {
    toast(error.message, "warning");
    await refreshState();
  }
}

function renderFilters() {
  populateSelect(nodes.filterProvince, [
    "Todas",
    ...state.provincePlans.map((item) => item.province),
    ...state.exteriorPlans.map((item) => item.seccional),
  ]);
  populateSelect(nodes.filterRole, ["Todos", ...state.catalogs.organizationalRoles]);
  populateSelect(nodes.filterStatus, ["Todos", ...STATUS_OPTIONS]);
}

function filteredRecords() {
  const query = nodes.searchInput.value.trim().toLowerCase();
  return state.records.filter((record) => {
    const territory = territoryName(record);
    if (nodes.filterProvince.value !== "Todas" && territory !== nodes.filterProvince.value) return false;
    if (nodes.filterRole.value !== "Todos" && record.role !== nodes.filterRole.value) return false;
    if (nodes.filterStatus.value !== "Todos" && record.status !== nodes.filterStatus.value) return false;
    const searchable = [
      record.firstName,
      record.lastName,
      record.cedula,
      territory,
      record.municipality,
      record.role,
    ]
      .join(" ")
      .toLowerCase();
    return !query || searchable.includes(query);
  });
}

function renderRecordTable() {
  const records = filteredRecords();
  const activistView = state.currentUser?.accessRole === "activist";
  nodes.recordCount.textContent = `${records.length} registros`;
  nodes.databaseStatus.textContent = records.length
    ? activistView
      ? "Directorio limitado a los integrantes de su territorio."
      : "Información sincronizada con la base central."
    : "No hay registros que coincidan con los filtros.";
  const ownPlan = getOwnTerritoryPlan();
  const groupUrl = activistView ? ownPlan?.whatsappGroupUrl || "" : "";
  nodes.territoryWhatsappLink.hidden = !groupUrl;
  nodes.territoryWhatsappLink.href = groupUrl || "#";
  nodes.recordTableBody.innerHTML = records.length
    ? records
        .map(
          (record) => `
            <tr>
              <td class="record-name"><strong>${escapeHtml(record.firstName)} ${escapeHtml(record.lastName)}</strong><span>${activistView ? escapeHtml(formatNetworkHandles(record.networks)) : escapeHtml(record.cedula)}</span></td>
              <td><strong>${escapeHtml(territoryName(record))}</strong><span class="table-muted">${escapeHtml(record.municipality || "")}</span></td>
              <td>${escapeHtml(record.role)}</td><td>${escapeHtml(record.status)}</td>
              <td>${formatCompact(totalFollowers(record.networks))}</td>
              <td>${record.tookInduction ? "Sí" : "No"}</td><td>${record.c28Registered ? "Sí" : "No"}</td>
              <td>${escapeHtml(record.responseWindow)}</td>
              <td>${
                activistView
                  ? '<span class="table-muted">Solo lectura</span>'
                  : `<div class="row-actions">
                      <button class="ghost-button" data-edit="${record.id}" type="button">Editar</button>
                      <button class="danger-button" data-delete="${record.id}" type="button">Eliminar</button>
                    </div>`
              }</td>
            </tr>`
        )
        .join("")
    : `<tr><td colspan="9" class="table-muted">La base está preparada para recibir el primer registro.</td></tr>`;
  nodes.recordTableBody.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const record = state.records.find((item) => item.id === button.dataset.edit);
      if (record) {
        loadRecordIntoForm(record);
        activateView("#registro", { updateHash: true });
      }
    });
  });
  nodes.recordTableBody.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteRecord(button.dataset.delete));
  });
}

async function loadUsers() {
  const data = await api("/api/users");
  state.users = data.users;
  state.audits = data.audits;
  renderUsers();
}

function renderUsers() {
  nodes.userTableBody.innerHTML = state.users
    .map(
      (user) => `
        <tr>
          <td class="record-name"><strong>${escapeHtml(user.fullName)}</strong><span>${escapeHtml(user.username)}</span></td>
          <td>${user.accessRole === "admin" ? "Administrador" : "Operador"}</td>
          <td>${escapeHtml(user.organizationalRole || "Sin asignar")}</td>
          <td><span class="score-chip ${user.active ? "chip-green" : "chip-red"}">${user.active ? "Activo" : "Inactivo"}</span></td>
          <td><div class="row-actions">
            <button class="ghost-button" data-reset-user="${user.id}" type="button">Restablecer clave</button>
            <button class="${user.active ? "danger-button" : "ghost-button"}" data-toggle-user="${user.id}" data-active="${!user.active}" type="button">${user.active ? "Desactivar" : "Activar"}</button>
          </div></td>
        </tr>`
    )
    .join("");
  nodes.auditTableBody.innerHTML = state.audits.length
    ? state.audits
        .map(
          (audit) => `
            <tr><td>${formatDateTime(audit.createdAt)}</td><td>${escapeHtml(audit.fullName)}</td>
            <td>${escapeHtml(actionLabel(audit.action))}</td>
            <td>${escapeHtml(audit.entityType)}${audit.entityId ? ` · ${escapeHtml(audit.entityId)}` : ""}</td></tr>`
        )
        .join("")
    : `<tr><td colspan="4" class="table-muted">No hay actividad registrada.</td></tr>`;
  nodes.userTableBody.querySelectorAll("[data-toggle-user]").forEach((button) => {
    button.addEventListener("click", () => toggleUser(button.dataset.toggleUser, button.dataset.active === "true"));
  });
  nodes.userTableBody.querySelectorAll("[data-reset-user]").forEach((button) => {
    button.addEventListener("click", () => resetUserPassword(button.dataset.resetUser));
  });
}

async function handleCreateUser(event) {
  event.preventDefault();
  setMessage(nodes.userFormMessage, "");
  setFormBusy(nodes.userForm, true);
  try {
    await api("/api/users", {
      method: "POST",
      body: {
        fullName: nodes.userFullName.value,
        username: nodes.userUsername.value,
        accessRole: nodes.userAccessRole.value,
        organizationalRole: nodes.userOrganizationalRole.value,
        temporaryPassword: nodes.userTemporaryPassword.value,
      },
    });
    nodes.userForm.reset();
    populateSelect(nodes.userOrganizationalRole, state.catalogs.organizationalRoles);
    toast("Cuenta creada. El usuario deberá cambiar la contraseña al ingresar.");
    await loadUsers();
  } catch (error) {
    setMessage(nodes.userFormMessage, error.message, true);
  } finally {
    setFormBusy(nodes.userForm, false);
  }
}

async function toggleUser(id, active) {
  try {
    await api(`/api/users/${encodeURIComponent(id)}/status`, { method: "PATCH", body: { active } });
    toast(active ? "Cuenta activada." : "Cuenta desactivada.");
    await loadUsers();
  } catch (error) {
    toast(error.message, "warning");
  }
}

async function resetUserPassword(id) {
  nodes.resetPasswordForm.reset();
  nodes.resetTargetUserId.value = id;
  setMessage(nodes.resetPasswordMessage, "");
  nodes.resetPasswordDialog.showModal();
}

async function handleResetUserPassword(event) {
  event.preventDefault();
  if (nodes.resetTemporaryPassword.value !== nodes.resetConfirmPassword.value) {
    return setMessage(nodes.resetPasswordMessage, "Las contraseñas no coinciden.", true);
  }
  setFormBusy(nodes.resetPasswordForm, true);
  try {
    await api(`/api/users/${encodeURIComponent(nodes.resetTargetUserId.value)}/reset-password`, {
      method: "POST",
      body: { temporaryPassword: nodes.resetTemporaryPassword.value },
    });
    nodes.resetPasswordDialog.close();
    toast("Contraseña temporal actualizada.");
    await loadUsers();
  } catch (error) {
    setMessage(nodes.resetPasswordMessage, error.message, true);
  } finally {
    setFormBusy(nodes.resetPasswordForm, false);
  }
}

function computeMetrics() {
  const totalRecords = state.records.length;
  const activeRecords = state.records.filter((item) => item.status !== "Pendiente de activación").length;
  const inductedCount = state.records.filter((item) => item.tookInduction).length;
  const c28Count = state.records.filter((item) => item.c28Registered).length;
  const rapidResponseCount = state.records.filter((item) => ["5 min", "15 min"].includes(item.responseWindow)).length;
  const pollSquadCount = state.records.filter((item) => item.pollSquad).length;
  const multiNetworkCount = state.records.filter((item) => activeNetworkCount(item.networks) >= 3).length;
  const summaries = buildProvinceSummaries();
  return {
    totalRecords,
    activeRecords,
    totalReach: state.records.reduce((sum, item) => sum + totalFollowers(item.networks), 0),
    inductedCount,
    c28Count,
    rapidResponseCount,
    pollSquadCount,
    inductionRate: percentage(inductedCount, totalRecords),
    c28Rate: percentage(c28Count, totalRecords),
    rapidResponseRate: percentage(rapidResponseCount, totalRecords),
    pollSquadRate: percentage(pollSquadCount, totalRecords),
    multiNetworkRate: percentage(multiNetworkCount, totalRecords),
    coveredProvinces: summaries.filter((item) => item.activists > 0).length,
    greenProvinces: summaries.filter((item) => item.status === "Verde").length,
    yellowProvinces: summaries.filter((item) => item.status === "Amarillo").length,
  };
}

function getNationalReach() {
  if (state.nationalReach !== null && state.nationalReach !== undefined) {
    return Math.max(0, Number(state.nationalReach) || 0);
  }
  if (state.currentUser?.accessRole === "activist" && state.territoryProgress.length) {
    return state.territoryProgress.reduce(
      (total, territory) => total + Math.max(0, Number(territory.totalFollowers) || 0),
      0
    );
  }
  return state.records.reduce(
    (total, record) => total + totalFollowers(record.networks),
    0
  );
}

function computeSexSummary(records) {
  const femaleCount = records.filter((record) => record.sex === "Femenino").length;
  const maleCount = records.filter((record) => record.sex === "Masculino").length;
  const declaredCount = femaleCount + maleCount;
  return {
    femaleCount,
    maleCount,
    declaredCount,
    unspecifiedCount: Math.max(0, records.length - declaredCount),
    femaleRate: percentage(femaleCount, declaredCount),
    maleRate: percentage(maleCount, declaredCount),
  };
}

function buildProvinceSummaries() {
  return state.provincePlans.map((plan) => getProvinceSummary(plan.province));
}

function getProvinceSummary(province) {
  if (state.currentUser?.accessRole === "activist") {
    const progress = state.territoryProgress.find((item) => item.province === province);
    if (progress) {
      return {
        ...progress,
        coordinators: {
          provincial: "",
          regional: "",
          macro: "",
        },
      };
    }
  }
  const plan = state.provincePlans.find((item) => item.province === province);
  return structureSummary(
    province,
    plan?.region || "",
    plan?.macroRegion || "",
    Number(plan?.provincialGoal || 20) + Number(plan?.plannedCells || 0) * Number(plan?.unitGoal || 10),
    state.records.filter((item) => item.territoryScope !== EXTERIOR_SCOPE && item.province === province),
    plan
  );
}

function getExteriorSummary(seccional) {
  const plan = state.exteriorPlans.find((item) => item.seccional === seccional);
  return structureSummary(
    seccional,
    plan?.zone || "",
    "Exterior",
    Number(plan?.sectionalDirectiveGoal || 20) +
      Number(plan?.circunscriptionCount || 0) * Number(plan?.circunscriptionGoal || 20),
    state.records.filter((item) => item.territoryScope === EXTERIOR_SCOPE && item.exteriorSection === seccional),
    plan
  );
}

function structureSummary(province, region, macroRegion, targetActivists, records, plan) {
  const activists = records.length;
  const totalFollowersValue = records.reduce((sum, item) => sum + totalFollowers(item.networks), 0);
  const coverageScore = clamp(Math.round((activists / Math.max(targetActivists, 1)) * 100));
  const inductionScore = percentage(records.filter((item) => item.tookInduction).length, activists);
  const c28Score = percentage(records.filter((item) => item.c28Registered).length, activists);
  const responseScore = percentage(
    records.filter((item) => ["5 min", "15 min"].includes(item.responseWindow)).length,
    activists
  );
  const pollScore = percentage(records.filter((item) => item.pollSquad).length, activists);
  const coordinatorCount = [plan?.provincialCoordinator, plan?.regionalCoordinator, plan?.macroCoordinator].filter(Boolean).length;
  const structureScore = percentage(coordinatorCount, 3);
  const score = clamp(
    Math.round(
      coverageScore * 0.4 +
        inductionScore * 0.18 +
        c28Score * 0.15 +
        responseScore * 0.15 +
        pollScore * 0.07 +
        structureScore * 0.05
    )
  );
  return {
    province,
    region,
    macroRegion,
    targetActivists,
    activists,
    totalFollowers: totalFollowersValue,
    coverageScore,
    inductionScore,
    c28Score,
    responseScore,
    pollScore,
    score,
    status: score >= 75 ? "Verde" : score >= 45 ? "Amarillo" : "Rojo",
    coordinators: {
      provincial: plan?.provincialCoordinator || "Por asignar",
      regional: plan?.regionalCoordinator || "Por asignar",
      macro: plan?.macroCoordinator || "Por asignar",
    },
  };
}

async function mountProvinceMap() {
  if (mapModel) {
    paintMap();
    return;
  }
  try {
    const response = await fetch("./rd-provinces.geojson");
    const featureCollection = await response.json();
    mapModel = buildMapModel(featureCollection);
    nodes.rdMap.replaceChildren(mapModel.svg);
    nodes.mapStatus.textContent = `${mapModel.provinceLayers.size} provincias sincronizadas`;
    paintMap();
  } catch {
    nodes.mapStatus.textContent = "Mapa no disponible";
  }
}

function buildMapModel(featureCollection) {
  const lookup = new Map(
    state.provincePlans.map((item) => [normalizeProvinceLabel(item.province), item.province])
  );
  Object.entries(MAP_PROVINCE_ALIASES).forEach(([alias, province]) => lookup.set(alias, province));
  const provinces = (featureCollection.features || [])
    .map((feature) => {
      const name = feature.properties?.province_name || feature.properties?.name || "";
      const province = lookup.get(normalizeProvinceLabel(name));
      return province ? { feature, province } : null;
    })
    .filter(Boolean);
  const projection = buildMapProjection(provinces.map((item) => item.feature.geometry));
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Mapa territorial de República Dominicana");
  const shapeLayer = document.createElementNS(svg.namespaceURI, "g");
  const labelLayer = document.createElementNS(svg.namespaceURI, "g");
  const provinceLayers = new Map();
  provinces.forEach(({ feature, province }) => {
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", geometryToPath(feature.geometry, projection));
    path.setAttribute("class", "province-shape");
    path.setAttribute("stroke", "rgba(255,255,255,.96)");
    path.setAttribute("stroke-width", "1.15");
    path.setAttribute("tabindex", "0");
    const label = createProvinceLabel(svg, province, feature.geometry, projection);
    [path, label.badge, label.text].forEach((node) => {
      node.style.cursor = "pointer";
      node.addEventListener("click", () => selectProvince(province));
      node.addEventListener("mouseenter", () => selectProvince(province, false));
    });
    shapeLayer.append(path);
    labelLayer.append(label.group);
    provinceLayers.set(province, { path, badge: label.badge, text: label.text });
  });
  svg.append(shapeLayer, labelLayer);
  return { svg, provinceLayers };
}

function paintMap() {
  if (!mapModel) return;
  mapModel.provinceLayers.forEach((group, province) => {
    const color = provinceColor(getProvinceSummary(province).status);
    group.path.setAttribute("fill", color);
    group.badge.setAttribute("fill", color);
    group.text.setAttribute("fill", "#fff");
  });
}

function selectProvince(province, scroll = true) {
  if (!mapModel) return;
  const summary = getProvinceSummary(province);
  const activistView = state.currentUser?.accessRole === "activist";
  const ranking = buildProvinceSummaries()
    .sort((a, b) => b.score - a.score)
    .findIndex((item) => item.province === province) + 1;
  mapModel.provinceLayers.forEach((group, name) => {
    group.path.classList.toggle("is-active", name === province);
    group.badge.classList.toggle("is-active", name === province);
  });
  nodes.provinceDetail.innerHTML = `
    <p class="eyebrow">${escapeHtml(summary.region)} · ${escapeHtml(summary.macroRegion)}</p>
    <h4>${escapeHtml(province)}</h4>
    <p>Avance operativo de <strong>${summary.score}%</strong>, calculado con registros y metas vigentes.${activistView ? ` Ocupa la posición <strong>${ranking}</strong> de 32.` : ""}</p>
    <div class="province-stat-grid">
      <div class="province-stat"><span>Base actual</span><strong>${summary.activists}/${summary.targetActivists}</strong></div>
      <div class="province-stat"><span>Alcance declarado</span><strong>${formatCompact(summary.totalFollowers)}</strong></div>
      <div class="province-stat"><span>Inducción</span><strong>${summary.inductionScore}%</strong></div>
      <div class="province-stat"><span>Respuesta 15 min</span><strong>${summary.responseScore}%</strong></div>
      <div class="province-stat"><span>Inscripción C28</span><strong>${summary.c28Score}%</strong></div>
      <div class="province-stat"><span>Sondeos</span><strong>${summary.pollScore}%</strong></div>
    </div>
    ${
      activistView
        ? `<div class="map-privacy-note"><strong>${isOwnProvince(province) ? "Tu territorio" : "Comparación protegida"}</strong><span>Estos son indicadores agregados. Los integrantes, redes, contactos y canales internos de otros territorios no se comparten.</span></div>`
        : `<div class="info-stack">
            <div class="info-item"><strong>Coordinación provincial</strong><span>${escapeHtml(summary.coordinators.provincial)}</span></div>
            <div class="info-item"><strong>Coordinación regional</strong><span>${escapeHtml(summary.coordinators.regional)}</span></div>
            <div class="info-item"><strong>Coordinación macroregional</strong><span>${escapeHtml(summary.coordinators.macro)}</span></div>
          </div>`
    }`;
  if (scroll && isMobileViewport()) nodes.provinceDetail.scrollIntoView({ behavior: "smooth" });
}

function renderSkillChips() {
  nodes.skillsPicker.innerHTML = state.catalogs.skills
    .map(
      (skill) => `
        <label class="skill-chip"><input type="checkbox" value="${escapeAttribute(skill)}" /><span>${escapeHtml(skill)}</span></label>`
    )
    .join("");
}

function renderNetworkCards() {
  nodes.networkFields.innerHTML = NETWORK_CONFIG.map(
    ({ key, label }) => `
      <article class="network-card">
        <div class="network-head"><strong>${escapeHtml(label)}</strong>
          <label class="toggle-field"><input id="${key}Active" type="checkbox" /><span>Activa</span></label>
        </div>
        <div class="network-meta">
          <label>Usuario o handle<input id="${key}Handle" placeholder="@cuenta" /></label>
          <label>Seguidores<input id="${key}Followers" type="number" min="0" step="1" value="0" /></label>
        </div>
      </article>`
  ).join("");
}

function activateView(hash, options = {}) {
  const targetHash = hash?.startsWith("#") ? hash : DEFAULT_VIEW_HASH;
  if (
    state.currentUser?.accessRole === "activist" &&
    ["#estructura", "#usuarios"].includes(targetHash)
  ) {
    return activateView(DEFAULT_VIEW_HASH, { updateHash: true });
  }
  if (targetHash === "#usuarios" && state.currentUser?.accessRole !== "admin") {
    return activateView(DEFAULT_VIEW_HASH, { updateHash: true });
  }
  if (options.updateHash && window.location.hash !== targetHash) {
    window.location.hash = targetHash;
    return;
  }
  const view = document.querySelector(targetHash);
  if (!view?.classList.contains("app-view")) return activateView(DEFAULT_VIEW_HASH, { updateHash: true });
  nodes.appViews.forEach((item) => {
    item.hidden = item !== view;
    item.classList.toggle("is-active", item === view);
  });
  document.querySelectorAll(".side-link").forEach((link) => {
    link.classList.toggle("is-current", link.getAttribute("href") === targetHash);
  });
  nodes.contentShell.classList.toggle("dashboard-mode", view.id === "dashboard");
  nodes.moduleEyebrow.textContent = view.dataset.moduleEyebrow;
  nodes.moduleTitle.textContent = view.dataset.moduleTitle;
  nodes.moduleSummary.textContent = view.dataset.moduleSummary;
  nodes.moduleContextPill.textContent = view.dataset.modulePill;
  view.scrollTop = 0;
}

async function exportRecordsCsv() {
  const rows = state.records.map((record) => ({
    cedula: record.cedula,
    nombre: `${record.firstName} ${record.lastName}`,
    territorio: territoryName(record),
    municipio: record.municipality,
    rol: record.role,
    estado: record.status,
    induccion: record.tookInduction ? "Sí" : "No",
    inscripcion_c28: record.c28Registered ? "Sí" : "No",
    respuesta: record.responseWindow,
    alcance_declarado: totalFollowers(record.networks),
  }));
  try {
    await api("/api/exports/log", {
      method: "POST",
      body: { format: "csv", report: "directorio_activistas" },
    });
    downloadFile(toCsv(rows), "rad-c28-directorio.csv", "text/csv;charset=utf-8");
  } catch (error) {
    toast(error.message, "warning");
  }
}

async function exportRecordsJson() {
  try {
    await api("/api/exports/log", {
      method: "POST",
      body: { format: "json", report: "directorio_activistas" },
    });
    downloadFile(
      JSON.stringify({ exportedAt: new Date().toISOString(), records: state.records }, null, 2),
      "rad-c28-directorio.json",
      "application/json"
    );
  } catch (error) {
    toast(error.message, "warning");
  }
}

async function exportTerritorialCsv() {
  const rows = [
    ...buildProvinceSummaries(),
    ...state.exteriorPlans.map((item) => getExteriorSummary(item.seccional)),
  ].map((item) => ({
    territorio: item.province,
    region: item.region,
    macroregion: item.macroRegion,
    estado: item.status,
    avance: item.score,
    meta: item.targetActivists,
    registros: item.activists,
    alcance_declarado: item.totalFollowers,
  }));
  try {
    await api("/api/exports/log", {
      method: "POST",
      body: { format: "csv", report: "resumen_territorial" },
    });
    downloadFile(toCsv(rows), "rad-c28-resumen-territorial.csv", "text/csv;charset=utf-8");
  } catch (error) {
    toast(error.message, "warning");
  }
}

function setSidebarOpen(open) {
  nodes.appShell.classList.toggle("sidebar-open", open && isMobileViewport());
  nodes.sidebarToggle.setAttribute("aria-expanded", String(open && isMobileViewport()));
}

function toggleSidebarCollapsed() {
  if (isMobileViewport()) return setSidebarOpen(false);
  const collapsed = !nodes.appShell.classList.contains("sidebar-collapsed");
  nodes.appShell.classList.toggle("sidebar-collapsed", collapsed);
  nodes.sidebarCollapse.setAttribute("aria-expanded", String(!collapsed));
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 860px)").matches;
}

function populateSelect(select, values, empty = false) {
  if (!select) return;
  const current = select.value;
  select.innerHTML = `${empty ? '<option value=""></option>' : ""}${values
    .map((value) => `<option value="${escapeAttribute(value)}">${escapeHtml(value)}</option>`)
    .join("")}`;
  if (values.includes(current)) select.value = current;
}

function valueOf(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function setValue(id, value) {
  const input = document.getElementById(id);
  if (input) input.value = value ?? "";
}

function setChecked(id, value) {
  const input = document.getElementById(id);
  if (input) input.checked = Boolean(value);
}

function territoryName(record) {
  return record.territoryScope === EXTERIOR_SCOPE ? record.exteriorSection : record.province;
}

function isOwnProvince(province) {
  return (
    state.ownRecord?.territoryScope === DOMESTIC_SCOPE &&
    state.ownRecord.province === province
  );
}

function getOwnTerritoryPlan() {
  if (!state.ownRecord) return null;
  return state.ownRecord.territoryScope === EXTERIOR_SCOPE
    ? state.exteriorPlans.find(
        (plan) => plan.seccional === state.ownRecord.exteriorSection
      ) || null
    : state.provincePlans.find(
        (plan) => plan.province === state.ownRecord.province
      ) || null;
}

function formatCedulaInput() {
  nodes.cedulaInput.value = normalizeCedula(nodes.cedulaInput.value);
}

function normalizeCedula(value) {
  const raw = String(value || "").replace(/\D/g, "").slice(0, 11);
  return [raw.slice(0, 3), raw.slice(3, 10), raw.slice(10)].filter(Boolean).join("-");
}

function totalFollowers(networks) {
  return Object.values(networks || {}).reduce(
    (sum, item) => sum + (item.active ? Number(item.followers || 0) : 0),
    0
  );
}

function activeNetworkCount(networks) {
  return Object.values(networks || {}).filter((item) => item.active && Number(item.followers) > 0).length;
}

function percentage(part, total) {
  return total ? Math.round((part / total) * 100) : 0;
}

function average(values) {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

function clamp(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

function formatCompact(value) {
  return new Intl.NumberFormat("es-DO", {
    notation: Number(value) >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);
}

function formatNumber(value) {
  return new Intl.NumberFormat("es-DO").format(Number(value) || 0);
}

function formatDateTime(value) {
  return value ? new Intl.DateTimeFormat("es-DO", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "";
}

function actionLabel(action) {
  return (
    {
      create: "Creación",
      update: "Actualización",
      delete: "Eliminación",
      activate: "Activación",
      deactivate: "Desactivación",
      reset_password: "Restablecimiento de contraseña",
      password_changed: "Cambio de contraseña",
      login_success: "Inicio de sesión",
      login_failed: "Intento fallido",
      logout: "Cierre de sesión",
      bootstrap: "Inicialización",
      export: "Exportación",
    }[action] || action
  );
}

function provinceColor(status) {
  if (status === "Verde") return "rgba(34,149,106,.88)";
  if (status === "Amarillo") return "rgba(229,163,33,.88)";
  return "rgba(212,75,75,.88)";
}

function statusClass(status) {
  return status === "Verde" ? "chip-green" : status === "Amarillo" ? "chip-yellow" : "chip-red";
}

function setMessage(node, message, error = false) {
  node.textContent = message;
  node.classList.toggle("is-error", error);
}

function setFormBusy(form, busy) {
  form.classList.toggle("is-busy", busy);
  form.querySelectorAll("button, input, select, textarea").forEach((control) => {
    if (busy) {
      control.dataset.preBusyDisabled = String(control.disabled);
      control.disabled = true;
    } else {
      control.disabled = control.dataset.preBusyDisabled === "true";
      delete control.dataset.preBusyDisabled;
    }
  });
}

function formatNetworkHandles(networks) {
  const labels = Object.fromEntries(NETWORK_CONFIG.map((item) => [item.key, item.label]));
  const active = Object.entries(networks || {})
    .filter(([, network]) => network.active && network.handle)
    .map(([key, network]) => `${labels[key] || key}: ${network.handle}`);
  return active.length ? active.join(" · ") : "Sin redes registradas";
}

function toast(message, kind = "success") {
  const item = document.createElement("div");
  item.className = `toast ${kind}`;
  item.textContent = message;
  nodes.toastStack.append(item);
  window.setTimeout(() => item.remove(), 3600);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return `\uFEFF${headers.join(",")}\n${rows
    .map((row) => headers.map((header) => escape(row[header])).join(","))
    .join("\n")}`;
}

function downloadFile(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function normalizeProvinceLabel(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z]/g, "")
    .toLowerCase();
}

function normalizeSearchValue(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function collectGeometryPoints(geometry) {
  const polygons = geometry.type === "MultiPolygon" ? geometry.coordinates : [geometry.coordinates];
  return polygons.flatMap((polygon) => polygon.flatMap((ring) => ring));
}

function buildMapProjection(geometries) {
  const points = geometries.flatMap(collectGeometryPoints);
  const bounds = points.reduce(
    (acc, [lon, lat]) => ({
      minLon: Math.min(acc.minLon, lon),
      maxLon: Math.max(acc.maxLon, lon),
      minLat: Math.min(acc.minLat, lat),
      maxLat: Math.max(acc.maxLat, lat),
    }),
    { minLon: Infinity, maxLon: -Infinity, minLat: Infinity, maxLat: -Infinity }
  );
  const lonSpan = Math.max(bounds.maxLon - bounds.minLon, 0.001);
  const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.001);
  const scale = Math.min(
    (MAP_SIZE.width - MAP_SIZE.padding * 2) / lonSpan,
    (MAP_SIZE.height - MAP_SIZE.padding * 2) / latSpan
  );
  const offsetX = (MAP_SIZE.width - lonSpan * scale) / 2;
  const offsetY = (MAP_SIZE.height - latSpan * scale) / 2;
  return ([lon, lat]) => ({
    x: offsetX + (lon - bounds.minLon) * scale,
    y: offsetY + (bounds.maxLat - lat) * scale,
  });
}

function geometryToPath(geometry, projection) {
  const polygons = geometry.type === "MultiPolygon" ? geometry.coordinates : [geometry.coordinates];
  return polygons
    .map((polygon) =>
      polygon
        .map(
          (ring) =>
            `${ring
              .map((point, index) => {
                const { x, y } = projection(point);
                return `${index ? "L" : "M"} ${x.toFixed(2)} ${y.toFixed(2)}`;
              })
              .join(" ")} Z`
        )
        .join(" ")
    )
    .join(" ");
}

function createProvinceLabel(svg, province, geometry, projection) {
  const points = collectGeometryPoints(geometry).map(projection);
  const center = points.reduce(
    (acc, point) => ({ x: acc.x + point.x / points.length, y: acc.y + point.y / points.length }),
    { x: 0, y: 0 }
  );
  const override = MAP_LABEL_OVERRIDES[province] || {};
  const label = override.label || province;
  const fontSize = override.fontSize || (label.length > 12 ? 8.5 : 9.2);
  const width = Math.max(36, label.length * fontSize * 0.56 + 16);
  const group = document.createElementNS(svg.namespaceURI, "g");
  const badge = document.createElementNS(svg.namespaceURI, "rect");
  badge.setAttribute("x", center.x + (override.dx || 0) - width / 2);
  badge.setAttribute("y", center.y + (override.dy || 0) - 10);
  badge.setAttribute("width", width);
  badge.setAttribute("height", 20);
  badge.setAttribute("rx", 7);
  badge.classList.add("province-label-badge");
  const text = document.createElementNS(svg.namespaceURI, "text");
  text.setAttribute("x", center.x + (override.dx || 0));
  text.setAttribute("y", center.y + (override.dy || 0) + 1);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("font-size", fontSize);
  text.classList.add("province-label-text");
  text.textContent = label;
  group.append(badge, text);
  return { group, badge, text };
}
