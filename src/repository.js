const crypto = require("node:crypto");

const {
  buildNationalReach,
  buildProvinceProgress,
  buildSexSummary,
} = require("./territory-progress");
const { MUNICIPALITIES_BY_PROVINCE } = require("./territorial-catalog");

const NATIONAL_ASSIGNMENTS = [
  ["nationalCoordinator", "national_coordinator", "Coordinador nacional"],
  ["deputyNationalCoordinator", "deputy_national_coordinator", "Subcoordinador nacional"],
  [
    "operationsCoordinator",
    "operations_coordinator",
    "Coordinador nacional de operaciones digitales",
  ],
  ["contentCoordinator", "content_coordinator", "Coordinador nacional de contenidos"],
  ["pollsCoordinator", "polls_coordinator", "Coordinador nacional de sondeos"],
];

function createRepository(pool, fields) {
  const asDate = (value) => (value ? new Date(value).toISOString() : null);
  const asDateOnly = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value.slice(0, 10);
    return new Date(value).toISOString().slice(0, 10);
  };

  function publicUser(row) {
    return {
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
      lastLoginAt: asDate(row.last_login_at),
      createdAt: asDate(row.created_at),
    };
  }

  function mapProvince(row) {
    return {
      province: row.province,
      region: row.region_name,
      macroRegion: row.macro_region,
      plannedCells: Number(row.planned_cells),
      unitGoal: Number(row.unit_goal),
      provincialGoal: Number(row.provincial_goal),
      provincialCoordinator: row.provincial_coordinator,
      regionalCoordinator: row.regional_coordinator,
      macroCoordinator: row.macro_coordinator,
      whatsappGroupUrl: row.whatsapp_group_url || "",
    };
  }

  function mapExterior(row) {
    return {
      seccional: row.seccional,
      zone: row.zone_name,
      macroRegion: row.macro_region,
      circunscriptionCount: Number(row.circunscription_count),
      sectionalDirectiveGoal: Number(row.sectional_directive_goal),
      circunscriptionGoal: Number(row.circunscription_goal),
      provincialCoordinator: row.provincial_coordinator,
      regionalCoordinator: row.regional_coordinator,
      macroCoordinator: row.macro_coordinator,
      whatsappGroupUrl: row.whatsapp_group_url || "",
    };
  }

  function mapActivist(row, networksByActivist, skillsByActivist) {
    return {
      id: row.id,
      cedula: fields.decrypt(row.cedula_encrypted),
      firstName: row.first_name,
      lastName: row.last_name,
      phone: fields.decrypt(row.phone_encrypted),
      whatsapp: fields.decrypt(row.whatsapp_encrypted),
      email: fields.decrypt(row.email_encrypted),
      ageRange: row.age_range || "",
      sex: row.sex || "",
      territoryScope: row.territory_scope,
      status: row.status_name,
      province: row.province || "",
      exteriorSection: row.exterior_section || "",
      exteriorCircunscription: row.exterior_circunscription || "",
      municipality: row.municipality || "",
      districtMunicipal: row.district_municipal || "",
      region: row.region_name || "",
      macroRegion: row.macro_region || "",
      role: row.organizational_role || "Activista",
      provincialCoordinator: row.provincial_coordinator,
      regionalCoordinator: row.regional_coordinator,
      macroCoordinator: row.macro_coordinator,
      tookInduction: Boolean(row.took_induction),
      inductionDate: asDateOnly(row.induction_date),
      c28Registered: Boolean(row.c28_registered),
      responseWindow: row.response_window,
      availability: row.availability,
      pollSquad: Boolean(row.poll_squad),
      skills: skillsByActivist.get(row.id) || [],
      networks: networksByActivist.get(row.id) || {},
      notes: fields.decrypt(row.notes_encrypted),
      createdAt: asDate(row.created_at),
      updatedAt: asDate(row.updated_at),
    };
  }

  function mapNationalCoordination(coordination, records) {
    return Object.fromEntries(
      NATIONAL_ASSIGNMENTS.map(([key, column, assignedRole]) => {
        const activistId = coordination[`${column}_activist_id`] || "";
        const record = records.find((item) => item.id === activistId);
        return [
          key,
          record
            ? {
                activistId: record.id,
                fullName: `${record.firstName} ${record.lastName}`.trim(),
                organizationalRole: assignedRole,
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
                fullName: coordination[column] || "",
                organizationalRole: "",
                phone: "",
                whatsapp: "",
                email: "",
                territoryScope: "",
                territory: "",
              },
        ];
      })
    );
  }

  async function roleId(connection, name) {
    const [rows] = await connection.query(
      "SELECT id FROM organizational_roles WHERE name = ? LIMIT 1",
      [name || "Activista"]
    );
    if (!rows.length) throw Object.assign(new Error("El rol organizativo no existe."), { status: 400 });
    return rows[0].id;
  }

  async function loadState(viewer = null) {
    const [
      [provinceRows],
      [exteriorRows],
      [coordinationRows],
      [municipalityCoordinatorRows],
      [activistRows],
      [networkRows],
      [skillRows],
      [roleRows],
      [catalogSkillRows],
    ] = await Promise.all([
      pool.query("SELECT * FROM province_plans ORDER BY province"),
      pool.query("SELECT * FROM exterior_plans ORDER BY seccional"),
      pool.query("SELECT * FROM national_coordination WHERE singleton_id = 1"),
      pool.query(`
        SELECT province, municipality, coordinator_name
        FROM municipality_coordinators
        ORDER BY province, municipality
      `),
      pool.query(`
        SELECT a.*, r.name AS organizational_role
        FROM activists a
        LEFT JOIN organizational_roles r ON r.id = a.organizational_role_id
        ORDER BY a.updated_at DESC
      `),
      pool.query("SELECT * FROM activist_networks ORDER BY id"),
      pool.query(`
        SELECT acts.activist_id, skills.name
        FROM activist_skills acts
        INNER JOIN skills ON skills.id = acts.skill_id
        ORDER BY skills.sort_order, skills.name
      `),
      pool.query("SELECT name FROM organizational_roles ORDER BY sort_order, name"),
      pool.query("SELECT name FROM skills ORDER BY sort_order, name"),
    ]);

    const networksByActivist = new Map();
    networkRows.forEach((row) => {
      if (!networksByActivist.has(row.activist_id)) networksByActivist.set(row.activist_id, {});
      networksByActivist.get(row.activist_id)[row.network_key] = {
        handle: fields.decrypt(row.handle_encrypted),
        followers: Number(row.followers),
        active: Boolean(row.active),
      };
    });

    const skillsByActivist = new Map();
    skillRows.forEach((row) => {
      if (!skillsByActivist.has(row.activist_id)) skillsByActivist.set(row.activist_id, []);
      skillsByActivist.get(row.activist_id).push(row.name);
    });

    const coordination = coordinationRows[0] || {};
    const mappedRecords = activistRows.map((row) =>
      mapActivist(row, networksByActivist, skillsByActivist)
    );
    const snapshot = {
      nationalCoordination: mapNationalCoordination(coordination, mappedRecords),
      nationalReach: buildNationalReach(mappedRecords),
      provincePlans: provinceRows.map(mapProvince),
      exteriorPlans: exteriorRows.map(mapExterior),
      municipalityCoordinators: municipalityCoordinatorRows.map((row) => ({
        province: row.province,
        municipality: row.municipality,
        coordinatorName: row.coordinator_name,
      })),
      records: mappedRecords,
      catalogs: {
        organizationalRoles: roleRows.map((row) => row.name),
        skills: catalogSkillRows.map((row) => row.name),
        municipalitiesByProvince: MUNICIPALITIES_BY_PROVINCE,
      },
    };

    if (viewer?.access_role !== "activist") return snapshot;

    const ownRow = activistRows.find((row) => row.user_id === viewer.id);
    if (!ownRow) {
      throw Object.assign(new Error("La cuenta no tiene una ficha de activista vinculada."), {
        status: 403,
      });
    }
    const ownRecord = mapActivist(ownRow, networksByActivist, skillsByActivist);
    const territoryProgress = buildProvinceProgress(
      snapshot.provincePlans,
      snapshot.records
    );
    const sameTerritory = (row) =>
      ownRow.territory_scope === "exterior"
        ? row.territory_scope === "exterior" &&
          row.exterior_section === ownRow.exterior_section
        : row.territory_scope === "provincia" && row.province === ownRow.province;
    const ownTerritoryRecords = activistRows
      .filter(sameTerritory)
      .map((row) => mapActivist(row, networksByActivist, skillsByActivist));
    const territoryRecords = activistRows.filter(sameTerritory).map((row) => {
      const record = mapActivist(row, networksByActivist, skillsByActivist);
      return {
        id: "",
        firstName: record.firstName,
        lastName: record.lastName,
        cedula: "",
        phone: "",
        whatsapp: "",
        email: "",
        notes: "",
        ageRange: "",
        sex: "",
        territoryScope: record.territoryScope,
        status: record.status,
        province: record.province,
        exteriorSection: record.exteriorSection,
        exteriorCircunscription: "",
        municipality: record.municipality,
        districtMunicipal: "",
        region: record.region,
        macroRegion: record.macroRegion,
        role: record.role,
        provincialCoordinator: "",
        regionalCoordinator: "",
        macroCoordinator: "",
        tookInduction: record.tookInduction,
        inductionDate: "",
        c28Registered: record.c28Registered,
        responseWindow: record.responseWindow,
        availability: record.availability,
        pollSquad: record.pollSquad,
        skills: [],
        networks: Object.fromEntries(
          Object.entries(record.networks).map(([key, network]) => [
            key,
            {
              handle: network.handle,
              followers: network.followers,
              active: network.active,
            },
          ])
        ),
        createdAt: null,
        updatedAt: null,
      };
    });

    const provincePlans = snapshot.provincePlans.map((plan) => {
      const ownProvince =
        ownRow.territory_scope === "provincia" && plan.province === ownRow.province;
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

    return {
      nationalCoordination: snapshot.nationalCoordination,
      nationalReach: snapshot.nationalReach,
      provincePlans,
      exteriorPlans:
        ownRow.territory_scope === "exterior"
          ? snapshot.exteriorPlans.filter((plan) => plan.seccional === ownRow.exterior_section)
          : [],
      municipalityCoordinators:
        ownRow.territory_scope === "provincia"
          ? snapshot.municipalityCoordinators.filter(
              (assignment) =>
                assignment.province === ownRow.province &&
                assignment.municipality === ownRow.municipality
            )
          : [],
      records: territoryRecords,
      ownRecord,
      ownTerritoryInsights: {
        sex: buildSexSummary(ownTerritoryRecords),
      },
      territoryProgress,
      catalogs: snapshot.catalogs,
      viewMode: "territory",
    };
  }

  async function getPublicCatalogs() {
    const [[provinceRows], [exteriorRows]] = await Promise.all([
      pool.query(
        "SELECT province, region_name, macro_region FROM province_plans ORDER BY province"
      ),
      pool.query(
        "SELECT seccional, zone_name, macro_region FROM exterior_plans ORDER BY seccional"
      ),
    ]);
    return {
      provinces: provinceRows.map((row) => ({
        province: row.province,
        region: row.region_name,
        macroRegion: row.macro_region,
      })),
      exteriorSections: exteriorRows.map((row) => ({
        seccional: row.seccional,
        zone: row.zone_name,
        macroRegion: row.macro_region,
      })),
      municipalitiesByProvince: MUNICIPALITIES_BY_PROVINCE,
    };
  }

  async function writeActivist(payload, actorId, existingId = null, options = {}) {
    const id = existingId || crypto.randomUUID();
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      if (options.selfService) {
        const [currentRows] = await connection.query(
          `SELECT a.*, r.name AS organizational_role
           FROM activists a
           LEFT JOIN organizational_roles r ON r.id = a.organizational_role_id
           WHERE a.id = ? AND a.user_id = ? LIMIT 1`,
          [existingId, actorId]
        );
        if (!currentRows.length) {
          throw Object.assign(new Error("Solo puede actualizar su propia ficha."), { status: 403 });
        }
        const current = currentRows[0];
        payload = {
          ...payload,
          territoryScope: current.territory_scope,
          province: current.province || "",
          exteriorSection: current.exterior_section || "",
          status: current.status_name,
          role: current.organizational_role || "Activista",
          provincialCoordinator: current.provincial_coordinator,
          regionalCoordinator: current.regional_coordinator,
          macroCoordinator: current.macro_coordinator,
        };
      }
      const organizationalRoleId = await roleId(connection, payload.role);
      const [territoryRows] =
        payload.territoryScope === "exterior"
          ? await connection.query(
              `SELECT zone_name AS region_name, macro_region, provincial_coordinator,
                      regional_coordinator, macro_coordinator
               FROM exterior_plans WHERE seccional = ? LIMIT 1`,
              [payload.exteriorSection]
            )
          : await connection.query(
              `SELECT region_name, macro_region, provincial_coordinator,
                      regional_coordinator, macro_coordinator
               FROM province_plans WHERE province = ? LIMIT 1`,
              [payload.province]
            );
      if (!territoryRows.length) {
        throw Object.assign(new Error("El territorio seleccionado no existe."), { status: 400 });
      }
      const territory = territoryRows[0];
      const values = {
        id,
        cedulaHash: fields.fingerprint(payload.cedula),
        cedula: fields.encrypt(payload.cedula),
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: fields.encrypt(payload.phone),
        whatsapp: fields.encrypt(payload.whatsapp),
        email: fields.encrypt(payload.email),
        ageRange: payload.ageRange || null,
        sex: payload.sex || null,
        territoryScope: payload.territoryScope,
        status: payload.status,
        province: payload.territoryScope === "exterior" ? null : payload.province || null,
        exteriorSection: payload.territoryScope === "exterior" ? payload.exteriorSection || null : null,
        exteriorCircunscription:
          payload.territoryScope === "exterior" ? payload.exteriorCircunscription || null : null,
        municipality: payload.municipality || null,
        districtMunicipal: payload.territoryScope === "exterior" ? null : payload.districtMunicipal || null,
        region: territory.region_name,
        macroRegion: territory.macro_region,
        organizationalRoleId,
        provincialCoordinator: territory.provincial_coordinator || "",
        regionalCoordinator: territory.regional_coordinator || "",
        macroCoordinator: territory.macro_coordinator || "",
        tookInduction: Boolean(payload.tookInduction),
        inductionDate: payload.tookInduction && payload.inductionDate ? payload.inductionDate : null,
        c28Registered: Boolean(payload.c28Registered),
        responseWindow: payload.responseWindow,
        availability: payload.availability,
        pollSquad: Boolean(payload.pollSquad),
        notes: fields.encrypt(payload.notes),
        actorId,
      };

      if (existingId) {
        const [result] = await connection.execute(
          `UPDATE activists SET
             cedula_hash=:cedulaHash, cedula_encrypted=:cedula, first_name=:firstName,
             last_name=:lastName, phone_encrypted=:phone, whatsapp_encrypted=:whatsapp,
             email_encrypted=:email, age_range=:ageRange, sex=:sex,
             territory_scope=:territoryScope, status_name=:status, province=:province,
             exterior_section=:exteriorSection, exterior_circunscription=:exteriorCircunscription,
             municipality=:municipality, district_municipal=:districtMunicipal,
             region_name=:region, macro_region=:macroRegion,
             organizational_role_id=:organizationalRoleId,
             provincial_coordinator=:provincialCoordinator,
             regional_coordinator=:regionalCoordinator, macro_coordinator=:macroCoordinator,
             took_induction=:tookInduction, induction_date=:inductionDate,
             c28_registered=:c28Registered, response_window=:responseWindow,
             availability=:availability, poll_squad=:pollSquad, notes_encrypted=:notes,
             updated_by=:actorId
           WHERE id=:id`,
          values
        );
        if (!result.affectedRows) throw Object.assign(new Error("Registro no encontrado."), { status: 404 });
      } else {
        await connection.execute(
          `INSERT INTO activists (
             id, cedula_hash, cedula_encrypted, first_name, last_name, phone_encrypted,
             whatsapp_encrypted, email_encrypted, age_range, sex, territory_scope,
             status_name, province, exterior_section, exterior_circunscription,
             municipality, district_municipal, region_name, macro_region,
             organizational_role_id, provincial_coordinator, regional_coordinator,
             macro_coordinator, took_induction, induction_date, c28_registered,
             response_window, availability, poll_squad, notes_encrypted, created_by, updated_by
           ) VALUES (
             :id, :cedulaHash, :cedula, :firstName, :lastName, :phone, :whatsapp,
             :email, :ageRange, :sex, :territoryScope, :status, :province,
             :exteriorSection, :exteriorCircunscription, :municipality, :districtMunicipal,
             :region, :macroRegion, :organizationalRoleId, :provincialCoordinator,
             :regionalCoordinator, :macroCoordinator, :tookInduction, :inductionDate,
             :c28Registered, :responseWindow, :availability, :pollSquad, :notes,
             :actorId, :actorId
           )`,
          values
        );
      }

      await connection.query("DELETE FROM activist_skills WHERE activist_id = ?", [id]);
      for (const skillName of payload.skills || []) {
        await connection.query(
          `INSERT INTO activist_skills (activist_id, skill_id)
           SELECT ?, id FROM skills WHERE name = ?`,
          [id, skillName]
        );
      }

      await connection.query("DELETE FROM activist_networks WHERE activist_id = ?", [id]);
      for (const [networkKey, network] of Object.entries(payload.networks || {})) {
        await connection.query(
          `INSERT INTO activist_networks
             (activist_id, network_key, handle_encrypted, followers, active)
           VALUES (?, ?, ?, ?, ?)`,
          [
            id,
            networkKey,
            fields.encrypt(network.handle),
            Math.max(0, Number(network.followers) || 0),
            Boolean(network.active),
          ]
        );
      }

      await connection.commit();
      return id;
    } catch (error) {
      await connection.rollback();
      if (error.code === "ER_DUP_ENTRY") {
        throw Object.assign(new Error("La cedula ya existe en la base de datos."), { status: 409 });
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  async function deleteActivist(id) {
    const [result] = await pool.query("DELETE FROM activists WHERE id = ?", [id]);
    if (!result.affectedRows) throw Object.assign(new Error("Registro no encontrado."), { status: 404 });
  }

  async function updateProvince(province, payload) {
    const [result] = await pool.execute(
      `UPDATE province_plans SET
         planned_cells=?, unit_goal=?, provincial_goal=?,
         provincial_coordinator=?, regional_coordinator=?, macro_coordinator=?,
         whatsapp_group_url=?
       WHERE province=?`,
      [
        payload.plannedCells,
        payload.unitGoal,
        payload.provincialGoal,
        payload.provincialCoordinator || "",
        payload.regionalCoordinator || "",
        payload.macroCoordinator || "",
        payload.whatsappGroupUrl || "",
        province,
      ]
    );
    if (!result.affectedRows) throw Object.assign(new Error("Provincia no encontrada."), { status: 404 });
  }

  async function updateExterior(seccional, payload) {
    const [result] = await pool.execute(
      `UPDATE exterior_plans SET
         circunscription_count=?, sectional_directive_goal=?, circunscription_goal=?,
         provincial_coordinator=?, regional_coordinator=?, macro_coordinator=?,
         whatsapp_group_url=?
       WHERE seccional=?`,
      [
        payload.circunscriptionCount,
        payload.sectionalDirectiveGoal,
        payload.circunscriptionGoal,
        payload.provincialCoordinator || "",
        payload.regionalCoordinator || "",
        payload.macroCoordinator || "",
        payload.whatsappGroupUrl || "",
        seccional,
      ]
    );
    if (!result.affectedRows) throw Object.assign(new Error("Seccional no encontrada."), { status: 404 });
  }

  async function updateMunicipalityCoordinator(
    province,
    municipality,
    coordinatorName,
    actorId = null
  ) {
    if (!coordinatorName) {
      await pool.execute(
        "DELETE FROM municipality_coordinators WHERE province=? AND municipality=?",
        [province, municipality]
      );
      return;
    }
    await pool.execute(
      `INSERT INTO municipality_coordinators
         (province, municipality, coordinator_name, updated_by)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         coordinator_name=VALUES(coordinator_name),
         updated_by=VALUES(updated_by)`,
      [province, municipality, coordinatorName, actorId]
    );
  }

  async function updateCoordination(payload) {
    const requestedIds = NATIONAL_ASSIGNMENTS.map(
      ([key]) => payload[key]?.activistId || ""
    ).filter(Boolean);
    const selectedIds = [...new Set(requestedIds)];
    if (selectedIds.length !== requestedIds.length) {
      throw Object.assign(
        new Error("Una persona solo puede ocupar un cargo nacional a la vez."),
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [currentRows] = await connection.query(
        "SELECT * FROM national_coordination WHERE singleton_id=1 FOR UPDATE"
      );
      let recordsById = new Map();
      if (selectedIds.length) {
        const placeholders = selectedIds.map(() => "?").join(",");
        const [rows] = await connection.query(
          `SELECT id, first_name, last_name
           FROM activists
           WHERE id IN (${placeholders})`,
          selectedIds
        );
        recordsById = new Map(rows.map((row) => [row.id, row]));
        if (recordsById.size !== selectedIds.length) {
          throw Object.assign(
            new Error("Una de las personas seleccionadas ya no está disponible."),
            { status: 400 }
          );
        }
      }

      const values = NATIONAL_ASSIGNMENTS.flatMap(([key]) => {
        const activistId = payload[key]?.activistId || null;
        const record = activistId ? recordsById.get(activistId) : null;
        return [
          record ? `${record.first_name} ${record.last_name}`.trim() : "",
          activistId,
        ];
      });
      await connection.execute(
        `UPDATE national_coordination SET
           national_coordinator=?, national_coordinator_activist_id=?,
           deputy_national_coordinator=?, deputy_national_coordinator_activist_id=?,
           operations_coordinator=?, operations_coordinator_activist_id=?,
           content_coordinator=?, content_coordinator_activist_id=?,
           polls_coordinator=?, polls_coordinator_activist_id=?
         WHERE singleton_id=1`,
        values
      );

      for (const [key, , assignedRole] of NATIONAL_ASSIGNMENTS) {
        const activistId = payload[key]?.activistId;
        if (!activistId) continue;
        await connection.execute(
          `UPDATE activists AS a
           INNER JOIN organizational_roles AS r ON r.name=?
           SET a.organizational_role_id=r.id
           WHERE a.id=?`,
          [assignedRole, activistId]
        );
        await connection.execute(
          `UPDATE users AS u
           INNER JOIN activists AS a ON a.user_id=u.id
           INNER JOIN organizational_roles AS r ON r.name=?
           SET u.organizational_role_id=r.id
           WHERE a.id=?`,
          [assignedRole, activistId]
        );
      }

      const current = currentRows[0] || {};
      const previousIds = NATIONAL_ASSIGNMENTS.map(
        ([, column]) => current[`${column}_activist_id`]
      ).filter(Boolean);
      const removedIds = [
        ...new Set(previousIds.filter((id) => !selectedIds.includes(id))),
      ];
      if (removedIds.length) {
        const idPlaceholders = removedIds.map(() => "?").join(",");
        const rolePlaceholders = NATIONAL_ASSIGNMENTS.map(() => "?").join(",");
        await connection.query(
          `UPDATE users AS u
           INNER JOIN activists AS a ON a.user_id=u.id
           INNER JOIN organizational_roles AS current_role
             ON current_role.id=u.organizational_role_id
           INNER JOIN organizational_roles AS default_role
             ON default_role.name='Activista'
           SET u.organizational_role_id=default_role.id
           WHERE a.id IN (${idPlaceholders})
             AND current_role.name IN (${rolePlaceholders})`,
          [
            ...removedIds,
            ...NATIONAL_ASSIGNMENTS.map(([, , assignedRole]) => assignedRole),
          ]
        );
        await connection.query(
          `UPDATE activists AS a
           INNER JOIN organizational_roles AS current_role
             ON current_role.id=a.organizational_role_id
           INNER JOIN organizational_roles AS default_role
             ON default_role.name='Activista'
           SET a.organizational_role_id=default_role.id
           WHERE a.id IN (${idPlaceholders})
             AND current_role.name IN (${rolePlaceholders})`,
          [
            ...removedIds,
            ...NATIONAL_ASSIGNMENTS.map(([, , assignedRole]) => assignedRole),
          ]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async function findUserByUsername(username) {
    const [rows] = await pool.query(
      `SELECT u.*, r.name AS organizational_role,
              a.id AS activist_id, a.territory_scope AS activist_territory_scope,
              a.province AS activist_province, a.exterior_section AS activist_exterior_section
       FROM users u
       LEFT JOIN organizational_roles r ON r.id = u.organizational_role_id
       LEFT JOIN activists a ON a.user_id = u.id
       WHERE u.username = ? LIMIT 1`,
      [username]
    );
    return rows[0] || null;
  }

  async function findUserById(id) {
    const [rows] = await pool.query(
      `SELECT u.*, r.name AS organizational_role,
              a.id AS activist_id, a.territory_scope AS activist_territory_scope,
              a.province AS activist_province, a.exterior_section AS activist_exterior_section
       FROM users u
       LEFT JOIN organizational_roles r ON r.id = u.organizational_role_id
       LEFT JOIN activists a ON a.user_id = u.id
       WHERE u.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }

  async function listUsers() {
    const [rows] = await pool.query(
      `SELECT u.*, r.name AS organizational_role,
              a.id AS activist_id, a.territory_scope AS activist_territory_scope,
              a.province AS activist_province, a.exterior_section AS activist_exterior_section
       FROM users u
       LEFT JOIN organizational_roles r ON r.id = u.organizational_role_id
       LEFT JOIN activists a ON a.user_id = u.id
       ORDER BY u.active DESC, u.full_name`
    );
    return rows.map(publicUser);
  }

  async function createUser(input) {
    const id = crypto.randomUUID();
    const connection = await pool.getConnection();
    try {
      const organizationalRoleId = input.organizationalRole
        ? await roleId(connection, input.organizationalRole)
        : null;
      await connection.execute(
        `INSERT INTO users
          (id, username, full_name, password_hash, access_role, organizational_role_id,
           active, must_change_password)
         VALUES (?, ?, ?, ?, ?, ?, TRUE, TRUE)`,
        [
          id,
          input.username,
          input.fullName,
          input.passwordHash,
          input.accessRole,
          organizationalRoleId,
        ]
      );
      return id;
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw Object.assign(new Error("Ese nombre de usuario ya existe."), { status: 409 });
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  async function registerActivistAccount(input) {
    const userId = crypto.randomUUID();
    const activistId = crypto.randomUUID();
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const organizationalRoleId = await roleId(connection, "Activista");
      const [territoryRows] =
        input.activist.territoryScope === "exterior"
          ? await connection.query(
              "SELECT zone_name AS region_name, macro_region FROM exterior_plans WHERE seccional=? LIMIT 1",
              [input.activist.exteriorSection]
            )
          : await connection.query(
              "SELECT region_name, macro_region FROM province_plans WHERE province=? LIMIT 1",
              [input.activist.province]
            );
      if (!territoryRows.length) {
        throw Object.assign(new Error("El territorio seleccionado no existe."), { status: 400 });
      }
      const territory = territoryRows[0];
      await connection.execute(
        `INSERT INTO users
          (id, username, full_name, password_hash, access_role, organizational_role_id,
           active, must_change_password)
         VALUES (?, ?, ?, ?, 'activist', ?, TRUE, FALSE)`,
        [
          userId,
          input.username,
          `${input.activist.firstName} ${input.activist.lastName}`,
          input.passwordHash,
          organizationalRoleId,
        ]
      );
      await connection.execute(
        `INSERT INTO activists (
           id, user_id, cedula_hash, cedula_encrypted, first_name, last_name,
           phone_encrypted, whatsapp_encrypted, email_encrypted, age_range, sex,
           territory_scope, status_name, province, exterior_section,
           exterior_circunscription, municipality, district_municipal, region_name,
           macro_region, organizational_role_id, response_window, availability,
           notes_encrypted, created_by, updated_by
         ) VALUES (
           ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente de activación', ?, ?, ?, ?,
           ?, ?, ?, ?, '2 horas+', 'Mañana', ?, ?, ?
         )`,
        [
          activistId,
          userId,
          fields.fingerprint(input.activist.cedula),
          fields.encrypt(input.activist.cedula),
          input.activist.firstName,
          input.activist.lastName,
          fields.encrypt(input.activist.phone),
          fields.encrypt(input.activist.whatsapp),
          fields.encrypt(input.activist.email),
          input.activist.ageRange || null,
          input.activist.sex || null,
          input.activist.territoryScope,
          input.activist.territoryScope === "exterior" ? null : input.activist.province,
          input.activist.territoryScope === "exterior" ? input.activist.exteriorSection : null,
          input.activist.territoryScope === "exterior"
            ? input.activist.exteriorCircunscription || null
            : null,
          input.activist.municipality || null,
          input.activist.territoryScope === "exterior"
            ? null
            : input.activist.districtMunicipal || null,
          territory.region_name,
          territory.macro_region,
          organizationalRoleId,
          fields.encrypt("Registro creado por autoservicio."),
          userId,
          userId,
        ]
      );
      await connection.commit();
      return { userId, activistId };
    } catch (error) {
      await connection.rollback();
      if (error.code === "ER_DUP_ENTRY") {
        throw Object.assign(
          new Error("El usuario o la cédula ya están registrados."),
          { status: 409 }
        );
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  async function updateUserStatus(id, active) {
    const [result] = await pool.query("UPDATE users SET active = ? WHERE id = ?", [Boolean(active), id]);
    if (!result.affectedRows) throw Object.assign(new Error("Usuario no encontrado."), { status: 404 });
    if (!active) await pool.query("DELETE FROM user_sessions WHERE user_id = ?", [id]);
  }

  async function resetUserPassword(id, passwordHash) {
    const [result] = await pool.query(
      `UPDATE users SET password_hash=?, must_change_password=TRUE,
       failed_login_attempts=0, locked_until=NULL WHERE id=?`,
      [passwordHash, id]
    );
    if (!result.affectedRows) throw Object.assign(new Error("Usuario no encontrado."), { status: 404 });
    await pool.query("DELETE FROM user_sessions WHERE user_id = ?", [id]);
  }

  async function setPassword(id, passwordHash) {
    await pool.query(
      `UPDATE users SET password_hash=?, must_change_password=FALSE,
       failed_login_attempts=0, locked_until=NULL WHERE id=?`,
      [passwordHash, id]
    );
    await pool.query("DELETE FROM user_sessions WHERE user_id = ?", [id]);
  }

  async function countUsers() {
    const [[row]] = await pool.query("SELECT COUNT(*) AS total FROM users");
    return Number(row.total);
  }

  async function countActiveAdmins() {
    const [[row]] = await pool.query(
      "SELECT COUNT(*) AS total FROM users WHERE access_role='admin' AND active=TRUE"
    );
    return Number(row.total);
  }

  async function recordLoginFailure(user) {
    const attempts = Number(user.failed_login_attempts || 0) + 1;
    const locked = attempts >= 5;
    await pool.query(
      `UPDATE users SET failed_login_attempts=?, locked_until=?
       WHERE id=?`,
      [locked ? 0 : attempts, locked ? new Date(Date.now() + 15 * 60_000) : null, user.id]
    );
  }

  async function recordLoginSuccess(id) {
    await pool.query(
      `UPDATE users SET failed_login_attempts=0, locked_until=NULL, last_login_at=UTC_TIMESTAMP()
       WHERE id=?`,
      [id]
    );
  }

  async function createSession(userId, tokenHash, expiresAt, request) {
    await pool.query(
      `INSERT INTO user_sessions
       (id, user_id, token_hash, ip_address, user_agent, expires_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        crypto.randomUUID(),
        userId,
        tokenHash,
        request.ip?.slice(0, 64) || null,
        request.get("user-agent")?.slice(0, 255) || null,
        expiresAt,
      ]
    );
  }

  async function findSession(tokenHash) {
    const [rows] = await pool.query(
      `SELECT s.id AS session_id, s.expires_at, u.*, r.name AS organizational_role,
              a.id AS activist_id, a.territory_scope AS activist_territory_scope,
              a.province AS activist_province, a.exterior_section AS activist_exterior_section
       FROM user_sessions s
       INNER JOIN users u ON u.id = s.user_id
       LEFT JOIN organizational_roles r ON r.id = u.organizational_role_id
       LEFT JOIN activists a ON a.user_id = u.id
       WHERE s.token_hash=? AND s.expires_at > UTC_TIMESTAMP() AND u.active=TRUE
       LIMIT 1`,
      [tokenHash]
    );
    return rows[0] || null;
  }

  async function deleteSession(tokenHash) {
    await pool.query("DELETE FROM user_sessions WHERE token_hash=?", [tokenHash]);
  }

  async function cleanupSessions() {
    await pool.query("DELETE FROM user_sessions WHERE expires_at <= UTC_TIMESTAMP()");
  }

  async function audit(userId, action, entityType, entityId, metadata, request) {
    await pool.query(
      `INSERT INTO audit_logs
       (user_id, action_name, entity_type, entity_id, metadata_json, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId || null,
        action,
        entityType,
        entityId || null,
        metadata ? JSON.stringify(metadata) : null,
        request?.ip?.slice(0, 64) || null,
      ]
    );
  }

  async function listAuditLogs(limit = 100) {
    const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);
    const [rows] = await pool.query(
      `SELECT a.id, a.action_name, a.entity_type, a.entity_id, a.metadata_json,
              a.ip_address, a.created_at, u.username, u.full_name
       FROM audit_logs a
       LEFT JOIN users u ON u.id = a.user_id
       ORDER BY a.created_at DESC
       LIMIT ${safeLimit}`
    );
    return rows.map((row) => ({
      id: Number(row.id),
      action: row.action_name,
      entityType: row.entity_type,
      entityId: row.entity_id,
      metadata: row.metadata_json || null,
      ipAddress: row.ip_address,
      username: row.username || "sistema",
      fullName: row.full_name || "Sistema",
      createdAt: asDate(row.created_at),
    }));
  }

  return {
    publicUser,
    loadState,
    getPublicCatalogs,
    writeActivist,
    deleteActivist,
    updateProvince,
    updateExterior,
    updateMunicipalityCoordinator,
    updateCoordination,
    findUserByUsername,
    findUserById,
    listUsers,
    createUser,
    registerActivistAccount,
    updateUserStatus,
    resetUserPassword,
    setPassword,
    countUsers,
    countActiveAdmins,
    recordLoginFailure,
    recordLoginSuccess,
    createSession,
    findSession,
    deleteSession,
    cleanupSessions,
    audit,
    listAuditLogs,
  };
}

module.exports = { createRepository };
