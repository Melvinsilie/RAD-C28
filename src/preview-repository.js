const crypto = require("node:crypto");

const ROLES = [
  "Activista",
  "Coordinador nacional",
  "Subcoordinador nacional",
  "Coordinador nacional de operaciones digitales",
  "Coordinador nacional de contenidos",
  "Coordinador nacional de sondeos",
  "Coordinador municipal",
  "Coordinador provincial",
  "Coordinador regional",
  "Coordinador macroregional",
  "Apoyo de contenidos",
  "Escuadra de sondeos",
];

const SKILLS = [
  "Comentarios estratégicos",
  "Compartir y amplificar",
  "Moderación de comunidades",
  "Sondeos y votaciones",
  "Creación de contenido",
  "Video corto",
  "Diseño gráfico",
  "Monitoreo temprano",
];

const PROVINCES = [
  ["Azua", "Valdesia", "Suroeste", 4, 10],
  ["Bahoruco", "Enriquillo", "Suroeste", 2, 10],
  ["Barahona", "Enriquillo", "Suroeste", 4, 10],
  ["Dajabón", "Cibao Noroeste", "Norte", 3, 10],
  ["Distrito Nacional", "Ozama", "Sureste", 1, 20],
  ["Duarte", "Cibao Nordeste", "Norte", 4, 10],
  ["Elías Piña", "El Valle", "Suroeste", 2, 10],
  ["El Seibo", "Yuma", "Sureste", 2, 10],
  ["Espaillat", "Cibao Norte", "Norte", 4, 10],
  ["Hato Mayor", "Higüamo", "Sureste", 3, 10],
  ["Hermanas Mirabal", "Cibao Nordeste", "Norte", 2, 10],
  ["Independencia", "Enriquillo", "Suroeste", 2, 10],
  ["La Altagracia", "Yuma", "Sureste", 4, 10],
  ["La Romana", "Yuma", "Sureste", 3, 10],
  ["La Vega", "Cibao Sur", "Norte", 4, 10],
  ["María Trinidad Sánchez", "Cibao Nordeste", "Norte", 4, 10],
  ["Monseñor Nouel", "Cibao Sur", "Norte", 3, 10],
  ["Monte Cristi", "Cibao Noroeste", "Norte", 4, 10],
  ["Monte Plata", "Higüamo", "Sureste", 4, 10],
  ["Pedernales", "Enriquillo", "Suroeste", 2, 10],
  ["Peravia", "Valdesia", "Suroeste", 3, 10],
  ["Puerto Plata", "Cibao Norte", "Norte", 4, 10],
  ["Samaná", "Cibao Nordeste", "Norte", 3, 10],
  ["San Cristóbal", "Valdesia", "Suroeste", 6, 10],
  ["San José de Ocoa", "Valdesia", "Suroeste", 2, 10],
  ["San Juan", "El Valle", "Suroeste", 5, 10],
  ["San Pedro de Macorís", "Higüamo", "Sureste", 4, 10],
  ["Sánchez Ramírez", "Cibao Sur", "Norte", 3, 10],
  ["Santiago", "Cibao Norte", "Norte", 7, 10],
  ["Santiago Rodríguez", "Cibao Noroeste", "Norte", 2, 10],
  ["Santo Domingo", "Ozama", "Sureste", 7, 20],
  ["Valverde", "Cibao Noroeste", "Norte", 3, 10],
];

const EXTERIOR = [
  ["Nueva York", "USA y Canadá"],
  ["New Jersey", "USA y Canadá"],
  ["Boston", "USA y Canadá"],
  ["Miami", "Florida"],
  ["Puerto Rico", "Caribe"],
  ["Madrid", "Europa"],
  ["Barcelona", "Europa"],
  ["Zurich", "Europa"],
];

function createPreviewRepository({ passwordHash }) {
  const users = [
    {
      id: crypto.randomUUID(),
      username: "vista",
      full_name: "Administrador de vista local",
      password_hash: passwordHash,
      access_role: "admin",
      organizational_role: "Coordinador nacional",
      active: true,
      must_change_password: false,
      failed_login_attempts: 0,
      locked_until: null,
      created_at: new Date(),
      last_login_at: null,
    },
  ];
  const sessions = new Map();
  const records = [];
  const audits = [];
  const provincePlans = PROVINCES.map(([province, region, macroRegion, plannedCells, unitGoal]) => ({
    province,
    region,
    macroRegion,
    plannedCells,
    unitGoal,
    provincialGoal: 20,
    provincialCoordinator: "",
    regionalCoordinator: "",
    macroCoordinator: "",
    whatsappGroupUrl: "",
  }));
  const exteriorPlans = EXTERIOR.map(([seccional, zone]) => ({
    seccional,
    zone,
    macroRegion: "Exterior",
    circunscriptionCount: 1,
    sectionalDirectiveGoal: 20,
    circunscriptionGoal: 20,
    provincialCoordinator: "",
    regionalCoordinator: "",
    macroCoordinator: "",
    whatsappGroupUrl: "",
  }));
  const nationalCoordination = {
    nationalCoordinator: "",
    deputyNationalCoordinator: "",
    operationsCoordinator: "",
    contentCoordinator: "",
    pollsCoordinator: "",
  };

  const publicUser = (row) => ({
    id: row.id,
    username: row.username,
    fullName: row.full_name,
    accessRole: row.access_role,
    organizationalRole: row.organizational_role || "",
    activistId: row.activist_id || null,
    territoryScope: row.activist_territory_scope || null,
    province: row.activist_province || null,
    exteriorSection: row.activist_exterior_section || null,
    active: Boolean(row.active),
    mustChangePassword: Boolean(row.must_change_password),
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
  });

  return {
    publicUser,
    async findUserByUsername(username) {
      return users.find((user) => user.username === username) || null;
    },
    async findUserById(id) {
      return users.find((user) => user.id === id) || null;
    },
    async recordLoginFailure(user) {
      user.failed_login_attempts += 1;
    },
    async recordLoginSuccess(id) {
      const user = users.find((item) => item.id === id);
      if (user) user.last_login_at = new Date().toISOString();
    },
    async createSession(userId, tokenHash, expiresAt) {
      const user = users.find((item) => item.id === userId);
      sessions.set(tokenHash, { ...user, expires_at: expiresAt });
    },
    async findSession(tokenHash) {
      return sessions.get(tokenHash) || null;
    },
    async deleteSession(tokenHash) {
      sessions.delete(tokenHash);
    },
    async setPassword(id, nextPasswordHash) {
      const user = users.find((item) => item.id === id);
      user.password_hash = nextPasswordHash;
      user.must_change_password = false;
      sessions.clear();
    },
    async getPublicCatalogs() {
      return {
        provinces: provincePlans.map(({ province, region, macroRegion }) => ({
          province,
          region,
          macroRegion,
        })),
        exteriorSections: exteriorPlans.map(({ seccional, zone, macroRegion }) => ({
          seccional,
          zone,
          macroRegion,
        })),
      };
    },
    async loadState(viewer = null) {
      const snapshot = {
        nationalCoordination,
        provincePlans,
        exteriorPlans,
        records,
        catalogs: { organizationalRoles: ROLES, skills: SKILLS },
      };
      if (viewer?.access_role !== "activist") return structuredClone(snapshot);
      const ownRecord = records.find((record) => record.userId === viewer.id);
      if (!ownRecord) throw Object.assign(new Error("Ficha no vinculada."), { status: 403 });
      const sameTerritory = records.filter((record) =>
        ownRecord.territoryScope === "exterior"
          ? record.territoryScope === "exterior" &&
            record.exteriorSection === ownRecord.exteriorSection
          : record.territoryScope === "provincia" && record.province === ownRecord.province
      );
      const anonymized = sameTerritory.map((record) => ({
        ...record,
        id: "",
        userId: undefined,
        cedula: "",
        phone: "",
        whatsapp: "",
        email: "",
        notes: "",
        networks: record.networks,
      }));
      return structuredClone({
        nationalCoordination: {},
        provincePlans:
          ownRecord.territoryScope === "provincia"
            ? provincePlans.filter((plan) => plan.province === ownRecord.province)
            : [],
        exteriorPlans:
          ownRecord.territoryScope === "exterior"
            ? exteriorPlans.filter((plan) => plan.seccional === ownRecord.exteriorSection)
            : [],
        records: anonymized,
        ownRecord,
        catalogs: snapshot.catalogs,
        viewMode: "territory",
      });
    },
    async writeActivist(payload, actorId, existingId = null, options = {}) {
      const now = new Date().toISOString();
      const id = existingId || crypto.randomUUID();
      const existingIndex = records.findIndex((record) => record.id === id);
      const duplicate = records.find((record) => record.cedula === payload.cedula && record.id !== id);
      if (duplicate) throw Object.assign(new Error("La cédula ya existe."), { status: 409 });
      const protectedValues =
        options.selfService && existingIndex >= 0
          ? {
              status: records[existingIndex].status,
              role: records[existingIndex].role,
              provincialCoordinator: records[existingIndex].provincialCoordinator,
              regionalCoordinator: records[existingIndex].regionalCoordinator,
              macroCoordinator: records[existingIndex].macroCoordinator,
              tookInduction: records[existingIndex].tookInduction,
              inductionDate: records[existingIndex].inductionDate,
              c28Registered: records[existingIndex].c28Registered,
            }
          : {};
      if (options.selfService && records[existingIndex]?.userId !== actorId) {
        throw Object.assign(new Error("Solo puede actualizar su propia ficha."), { status: 403 });
      }
      const record = {
        ...payload,
        ...protectedValues,
        id,
        userId: existingIndex >= 0 ? records[existingIndex].userId : null,
        createdAt: existingIndex >= 0 ? records[existingIndex].createdAt : now,
        updatedAt: now,
        createdBy: actorId,
      };
      if (existingIndex >= 0) records[existingIndex] = record;
      else records.unshift(record);
      return id;
    },
    async deleteActivist(id) {
      const index = records.findIndex((record) => record.id === id);
      if (index < 0) throw Object.assign(new Error("Registro no encontrado."), { status: 404 });
      records.splice(index, 1);
    },
    async updateProvince(province, payload) {
      const plan = provincePlans.find((item) => item.province === province);
      if (!plan) throw Object.assign(new Error("Provincia no encontrada."), { status: 404 });
      Object.assign(plan, payload);
    },
    async updateExterior(seccional, payload) {
      const plan = exteriorPlans.find((item) => item.seccional === seccional);
      if (!plan) throw Object.assign(new Error("Seccional no encontrada."), { status: 404 });
      Object.assign(plan, payload);
    },
    async updateCoordination(payload) {
      Object.assign(nationalCoordination, payload);
    },
    async audit(userId, action, entityType, entityId) {
      const user = users.find((item) => item.id === userId);
      audits.unshift({
        id: audits.length + 1,
        action,
        entityType,
        entityId,
        username: user?.username || "sistema",
        fullName: user?.full_name || "Sistema",
        createdAt: new Date().toISOString(),
      });
    },
    async listAuditLogs() {
      return structuredClone(audits.slice(0, 100));
    },
    async listUsers() {
      return users.map(publicUser);
    },
    async createUser(input) {
      if (users.some((user) => user.username === input.username)) {
        throw Object.assign(new Error("Ese nombre de usuario ya existe."), { status: 409 });
      }
      const id = crypto.randomUUID();
      users.push({
        id,
        username: input.username,
        full_name: input.fullName,
        password_hash: input.passwordHash,
        access_role: input.accessRole,
        organizational_role: input.organizationalRole,
        active: true,
        must_change_password: true,
        created_at: new Date(),
      });
      return id;
    },
    async registerActivistAccount(input) {
      if (
        users.some((user) => user.username === input.username) ||
        records.some((record) => record.cedula === input.activist.cedula)
      ) {
        throw Object.assign(new Error("El usuario o la cédula ya están registrados."), {
          status: 409,
        });
      }
      const userId = crypto.randomUUID();
      const activistId = crypto.randomUUID();
      const user = {
        id: userId,
        username: input.username,
        full_name: `${input.activist.firstName} ${input.activist.lastName}`,
        password_hash: input.passwordHash,
        access_role: "activist",
        organizational_role: "Activista",
        activist_id: activistId,
        activist_territory_scope: input.activist.territoryScope,
        activist_province: input.activist.province || null,
        activist_exterior_section: input.activist.exteriorSection || null,
        active: true,
        must_change_password: false,
        failed_login_attempts: 0,
        locked_until: null,
        created_at: new Date(),
      };
      const now = new Date().toISOString();
      records.unshift({
        ...input.activist,
        id: activistId,
        userId,
        createdAt: now,
        updatedAt: now,
      });
      users.push(user);
      return { userId, activistId };
    },
    async updateUserStatus(id, active) {
      const user = users.find((item) => item.id === id);
      if (!user) throw Object.assign(new Error("Usuario no encontrado."), { status: 404 });
      user.active = active;
    },
    async resetUserPassword(id, nextPasswordHash) {
      const user = users.find((item) => item.id === id);
      if (!user) throw Object.assign(new Error("Usuario no encontrado."), { status: 404 });
      user.password_hash = nextPasswordHash;
      user.must_change_password = true;
    },
    async countActiveAdmins() {
      return users.filter((user) => user.active && user.access_role === "admin").length;
    },
  };
}

module.exports = { createPreviewRepository };
