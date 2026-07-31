const crypto = require("node:crypto");

const {
  buildNationalReach,
  buildProvinceNetworkReach,
  buildProvinceProgress,
  buildSexSummary,
} = require("./territory-progress");
const { MUNICIPALITIES_BY_PROVINCE } = require("./territorial-catalog");
const { applyRoleAssignments } = require("./structure-assignments");
const { buildSqlBackup } = require("./database-backup");

const NATIONAL_ASSIGNMENT_ROLES = {
  nationalCoordinator: "Coordinador nacional",
  deputyNationalCoordinator: "Subcoordinador nacional",
  operationsCoordinator: "Coordinador nacional de operaciones digitales",
  contentCoordinator: "Coordinador nacional de contenidos",
  pollsCoordinator: "Coordinador nacional de sondeos",
  trainingCoordinator: "Coordinador nacional de capacitaciones",
  xCoordinator: "Coordinador nacional de X / Twitter",
  instagramCoordinator: "Coordinador nacional de Instagram",
  facebookCoordinator: "Coordinador nacional de Facebook",
  tiktokCoordinator: "Coordinador nacional de TikTok",
  youtubeCoordinator: "Coordinador nacional de YouTube",
  threadsCoordinator: "Coordinador nacional de Threads",
};
const NATIONAL_ASSIGNMENT_KEYS = Object.keys(NATIONAL_ASSIGNMENT_ROLES);

const ROLES = [
  "Activista",
  "Coordinador nacional",
  "Subcoordinador nacional",
  "Coordinador nacional de operaciones digitales",
  "Coordinador nacional de contenidos",
  "Coordinador nacional de sondeos",
  "Coordinador nacional de capacitaciones",
  "Coordinador nacional de X / Twitter",
  "Coordinador nacional de Instagram",
  "Coordinador nacional de Facebook",
  "Coordinador nacional de TikTok",
  "Coordinador nacional de YouTube",
  "Coordinador nacional de Threads",
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
  const municipalityCoordinators = [];
  const nationalCoordination = Object.fromEntries(
    NATIONAL_ASSIGNMENT_KEYS.map((key) => [
      key,
      {
        activistId: "",
        fullName: "",
        organizationalRole: "",
        phone: "",
        whatsapp: "",
        email: "",
        territoryScope: "",
        territory: "",
      },
    ])
  );

  function currentNationalCoordination() {
    return Object.fromEntries(
      NATIONAL_ASSIGNMENT_KEYS.map((key) => {
        const current = nationalCoordination[key] || {};
        const record = records.find((item) => item.id === current.activistId);
        return [
          key,
          record
            ? {
                activistId: record.id,
                fullName: `${record.firstName} ${record.lastName}`.trim(),
                organizationalRole: NATIONAL_ASSIGNMENT_ROLES[key],
                phone: record.phone,
                whatsapp: record.whatsapp,
                email: record.email,
                territoryScope: record.territoryScope,
                territory:
                  record.territoryScope === "exterior"
                    ? record.exteriorSection
                    : record.province,
              }
            : {
                ...current,
                activistId: current.activistId || "",
              },
        ];
      })
    );
  }

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
      sessions.forEach((session, tokenHash) => {
        if (session.id === id) sessions.delete(tokenHash);
      });
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
        municipalitiesByProvince: MUNICIPALITIES_BY_PROVINCE,
      };
    },
    async loadState(viewer = null) {
      const effectiveStructure = applyRoleAssignments({
        provincePlans,
        exteriorPlans,
        municipalityCoordinators,
        records,
      });
      const snapshot = {
        nationalCoordination: currentNationalCoordination(),
        nationalReach: buildNationalReach(records),
        provinceNetworkReach: buildProvinceNetworkReach(
          effectiveStructure.provincePlans,
          records
        ),
        provincePlans: effectiveStructure.provincePlans,
        exteriorPlans: effectiveStructure.exteriorPlans,
        municipalityCoordinators: effectiveStructure.municipalityCoordinators,
        records,
        catalogs: {
          organizationalRoles: ROLES,
          skills: SKILLS,
          municipalitiesByProvince: MUNICIPALITIES_BY_PROVINCE,
        },
      };
      if (viewer?.access_role !== "activist") return structuredClone(snapshot);
      const ownRecord = records.find((record) => record.userId === viewer.id);
      if (!ownRecord) {
        return structuredClone({
          nationalCoordination: snapshot.nationalCoordination,
          nationalReach: snapshot.nationalReach,
          provincePlans: snapshot.provincePlans.map((plan) => ({
            ...plan,
            provincialCoordinator: "",
            regionalCoordinator: "",
            macroCoordinator: "",
            whatsappGroupUrl: "",
          })),
          exteriorPlans: snapshot.exteriorPlans.map((plan) => ({
            ...plan,
            provincialCoordinator: "",
            regionalCoordinator: "",
            macroCoordinator: "",
            whatsappGroupUrl: "",
          })),
          municipalityCoordinators: [],
          records: [],
          ownRecord: null,
          ownTerritoryInsights: { sex: buildSexSummary([]) },
          territoryProgress: buildProvinceProgress(snapshot.provincePlans, records),
          catalogs: snapshot.catalogs,
          viewMode: "onboarding",
          needsProfile: true,
        });
      }
      const territoryProgress = buildProvinceProgress(
        snapshot.provincePlans,
        records
      );
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
      const visibleProvincePlans = snapshot.provincePlans.map((plan) => {
        const ownProvince =
          ownRecord.territoryScope === "provincia" && plan.province === ownRecord.province;
        return {
          province: plan.province,
          region: plan.region,
          macroRegion: plan.macroRegion,
          plannedCells: plan.plannedCells,
          unitGoal: plan.unitGoal,
          provincialGoal: plan.provincialGoal,
          provincialCoordinator: ownProvince ? plan.provincialCoordinator : "",
          regionalCoordinator: ownProvince ? plan.regionalCoordinator : "",
          macroCoordinator: ownProvince ? plan.macroCoordinator : "",
          whatsappGroupUrl: ownProvince ? plan.whatsappGroupUrl : "",
        };
      });
      return structuredClone({
        nationalCoordination: snapshot.nationalCoordination,
        nationalReach: snapshot.nationalReach,
        provincePlans: visibleProvincePlans,
        exteriorPlans:
          ownRecord.territoryScope === "exterior"
            ? snapshot.exteriorPlans.filter(
                (plan) => plan.seccional === ownRecord.exteriorSection
              )
            : [],
        municipalityCoordinators:
          ownRecord.territoryScope === "provincia"
            ? snapshot.municipalityCoordinators.filter(
                (assignment) =>
                  assignment.province === ownRecord.province &&
                  assignment.municipality === ownRecord.municipality
              )
            : [],
        records: anonymized,
        ownRecord,
        ownTerritoryInsights: {
          sex: buildSexSummary(sameTerritory),
        },
        territoryProgress,
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
      if (
        options.userId &&
        records.some((record) => record.userId === options.userId)
      ) {
        throw Object.assign(new Error("La cuenta ya tiene una ficha de activista."), {
          status: 409,
        });
      }
      const protectedValues =
        options.selfService && existingIndex >= 0
          ? {
              territoryScope: records[existingIndex].territoryScope,
              province: records[existingIndex].province,
              exteriorSection: records[existingIndex].exteriorSection,
              status: records[existingIndex].status,
              role: records[existingIndex].role,
              provincialCoordinator: records[existingIndex].provincialCoordinator,
              regionalCoordinator: records[existingIndex].regionalCoordinator,
              macroCoordinator: records[existingIndex].macroCoordinator,
            }
          : {};
      if (options.selfService && records[existingIndex]?.userId !== actorId) {
        throw Object.assign(new Error("Solo puede actualizar su propia ficha."), { status: 403 });
      }
      const effectivePayload = { ...payload, ...protectedValues };
      const territory =
        effectivePayload.territoryScope === "exterior"
          ? exteriorPlans.find(
              (plan) => plan.seccional === effectivePayload.exteriorSection
            )
          : provincePlans.find((plan) => plan.province === effectivePayload.province);
      const record = {
        ...effectivePayload,
        region:
          effectivePayload.territoryScope === "exterior"
            ? territory?.zone || ""
            : territory?.region || "",
        macroRegion: territory?.macroRegion || "",
        provincialCoordinator: territory?.provincialCoordinator || "",
        regionalCoordinator: territory?.regionalCoordinator || "",
        macroCoordinator: territory?.macroCoordinator || "",
        id,
        userId:
          existingIndex >= 0
            ? records[existingIndex].userId
            : options.userId || null,
        createdAt: existingIndex >= 0 ? records[existingIndex].createdAt : now,
        updatedAt: now,
        createdBy: actorId,
      };
      if (existingIndex >= 0) records[existingIndex] = record;
      else records.unshift(record);
      if (options.userId) {
        const user = users.find((item) => item.id === options.userId);
        if (user) {
          user.activist_id = id;
          user.activist_territory_scope = record.territoryScope;
          user.activist_province = record.province || null;
          user.activist_exterior_section = record.exteriorSection || null;
          sessions.forEach((session, tokenHash) => {
            if (session.id === user.id) {
              sessions.set(tokenHash, {
                ...session,
                activist_id: id,
                activist_territory_scope: record.territoryScope,
                activist_province: record.province || null,
                activist_exterior_section: record.exteriorSection || null,
              });
            }
          });
        }
      }
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
    async updateMunicipalityCoordinator(province, municipality, coordinatorName) {
      const index = municipalityCoordinators.findIndex(
        (assignment) =>
          assignment.province === province && assignment.municipality === municipality
      );
      if (!coordinatorName) {
        if (index >= 0) municipalityCoordinators.splice(index, 1);
        return;
      }
      const assignment = { province, municipality, coordinatorName };
      if (index >= 0) municipalityCoordinators[index] = assignment;
      else municipalityCoordinators.push(assignment);
    },
    async updateCoordination(payload) {
      const requestedIds = NATIONAL_ASSIGNMENT_KEYS.map(
        (key) => payload[key]?.activistId || ""
      ).filter(Boolean);
      if (new Set(requestedIds).size !== requestedIds.length) {
        throw Object.assign(
          new Error("Una persona solo puede ocupar un cargo nacional a la vez."),
          { status: 400 }
        );
      }
      const previousIds = NATIONAL_ASSIGNMENT_KEYS.map(
        (key) => nationalCoordination[key]?.activistId
      ).filter(Boolean);
      for (const key of NATIONAL_ASSIGNMENT_KEYS) {
        const activistId = payload[key]?.activistId || "";
        const record = records.find((item) => item.id === activistId);
        if (activistId && !record) {
          throw Object.assign(
            new Error("Una de las personas seleccionadas ya no está disponible."),
            { status: 400 }
          );
        }
        nationalCoordination[key] = record
          ? {
              activistId: record.id,
              fullName: `${record.firstName} ${record.lastName}`.trim(),
              organizationalRole: NATIONAL_ASSIGNMENT_ROLES[key],
              phone: record.phone,
              whatsapp: record.whatsapp,
              email: record.email,
              territoryScope: record.territoryScope,
              territory:
                record.territoryScope === "exterior"
                  ? record.exteriorSection
                  : record.province,
            }
          : {
              activistId: "",
              fullName: "",
              organizationalRole: "",
              phone: "",
              whatsapp: "",
              email: "",
              territoryScope: "",
              territory: "",
            };
        if (record) {
          record.role = NATIONAL_ASSIGNMENT_ROLES[key];
          const user = users.find((item) => item.id === record.userId);
          if (user) user.organizational_role = NATIONAL_ASSIGNMENT_ROLES[key];
        }
      }
      previousIds
        .filter((id) => !requestedIds.includes(id))
        .forEach((id) => {
          const record = records.find((item) => item.id === id);
          if (
            record &&
            Object.values(NATIONAL_ASSIGNMENT_ROLES).includes(record.role)
          ) {
            record.role = "Activista";
            const user = users.find((item) => item.id === record.userId);
            if (
              user &&
              Object.values(NATIONAL_ASSIGNMENT_ROLES).includes(
                user.organizational_role
              )
            ) {
              user.organizational_role = "Activista";
            }
          }
        });
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
    async exportDatabaseBackup() {
      const tables = [
        {
          name: "preview_users",
          createStatement:
            "CREATE TABLE `preview_users` (`id` CHAR(36) PRIMARY KEY, `username` VARCHAR(80), `full_name` VARCHAR(160)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
          rows: users.map(({ id, username, full_name }) => ({
            id,
            username,
            full_name,
          })),
        },
        {
          name: "preview_activists",
          createStatement:
            "CREATE TABLE `preview_activists` (`id` CHAR(36) PRIMARY KEY, `record_json` JSON) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
          rows: records.map((record) => ({
            id: record.id,
            record_json: record,
          })),
        },
      ];
      return {
        sql: buildSqlBackup({
          databaseName: "rad_c28_preview",
          generatedAt: new Date(),
          tables,
        }),
        tableCount: tables.length,
        rowCount: tables.reduce((total, table) => total + table.rows.length, 0),
      };
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
      const territory =
        input.activist.territoryScope === "exterior"
          ? exteriorPlans.find(
              (plan) => plan.seccional === input.activist.exteriorSection
            )
          : provincePlans.find((plan) => plan.province === input.activist.province);
      records.unshift({
        ...input.activist,
        municipality:
          input.activist.territoryScope === "exterior"
            ? input.activist.municipality || input.activist.exteriorSection
            : input.activist.municipality,
        region:
          input.activist.territoryScope === "exterior"
            ? territory?.zone || ""
            : territory?.region || "",
        macroRegion: territory?.macroRegion || "",
        provincialCoordinator: territory?.provincialCoordinator || "",
        regionalCoordinator: territory?.regionalCoordinator || "",
        macroCoordinator: territory?.macroCoordinator || "",
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
