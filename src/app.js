const crypto = require("node:crypto");
const path = require("node:path");
const { promisify } = require("node:util");
const { gzip } = require("node:zlib");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const {
  cleanText,
  normalizeUsername,
  validateUsername,
  validatePassword,
  validateActivist,
  validateProvincePlan,
  validateExteriorPlan,
  validateMunicipalityCoordinator,
  badRequest,
} = require("./validation");

const COOKIE_NAME = "radc28_session";
const gzipAsync = promisify(gzip);

function createApp({ repository, config }) {
  const app = express();
  app.set("trust proxy", config.trustProxy);
  app.disable("x-powered-by");
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", "data:"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          frameAncestors: ["'none'"],
        },
      },
      crossOriginResourcePolicy: { policy: "same-origin" },
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use("/api", (_request, response, next) => {
    response.setHeader("Cache-Control", "no-store");
    next();
  });

  const loginLimiter = rateLimit({
    windowMs: 15 * 60_000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Demasiados intentos. Espere unos minutos antes de volver a intentar." },
  });
  const registrationLimiter = rateLimit({
    windowMs: 60 * 60_000,
    limit: 10,
    skip: () => config.env !== "production",
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Se alcanzo el limite temporal de registros desde esta conexion." },
  });

  const asyncRoute = (handler) => (request, response, next) =>
    Promise.resolve(handler(request, response, next)).catch(next);

  const tokenHash = (token) => crypto.createHash("sha256").update(token).digest("hex");

  async function authenticate(request, response, next) {
    const token = request.cookies[COOKIE_NAME];
    if (!token) return response.status(401).json({ error: "Debe iniciar sesion." });
    const session = await repository.findSession(tokenHash(token));
    if (!session) {
      response.clearCookie(COOKIE_NAME, { path: "/" });
      return response.status(401).json({ error: "La sesion expiro. Inicie sesion nuevamente." });
    }
    request.user = session;
    request.sessionTokenHash = tokenHash(token);
    next();
  }

  function requireReadyUser(request, response, next) {
    if (request.user.must_change_password) {
      return response.status(428).json({
        error: "Debe cambiar la contraseña temporal antes de continuar.",
        code: "PASSWORD_CHANGE_REQUIRED",
      });
    }
    next();
  }

  function requireAdmin(request, response, next) {
    if (request.user.access_role !== "admin") {
      return response.status(403).json({ error: "Esta accion requiere permisos de administrador." });
    }
    next();
  }

  function requireStaff(request, response, next) {
    if (!["admin", "operator"].includes(request.user.access_role)) {
      return response.status(403).json({
        error: "Su cuenta solo puede consultar su territorio y actualizar su propia ficha.",
      });
    }
    next();
  }

  function requireMutationHeader(request, response, next) {
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method) && request.get("x-radc28-request") !== "1") {
      return response.status(403).json({ error: "Solicitud rechazada por proteccion de origen." });
    }
    next();
  }

  async function issueSession(userId, request, response) {
    const token = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + config.sessionHours * 60 * 60_000);
    await repository.createSession(userId, tokenHash(token), expiresAt, request);
    response.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      path: "/",
      expires: expiresAt,
    });
  }

  app.get(
    "/api/health",
    asyncRoute(async (_request, response) => {
      response.json({ status: "ok", service: "RAD-C28", database: "connected" });
    })
  );

  app.post(
    "/api/auth/login",
    loginLimiter,
    requireMutationHeader,
    asyncRoute(async (request, response) => {
      const username = normalizeUsername(request.body?.username);
      const password = String(request.body?.password || "");
      const user = await repository.findUserByUsername(username);
      const lockedUntil = user?.locked_until ? new Date(user.locked_until) : null;
      if (lockedUntil && lockedUntil.getTime() > Date.now()) {
        throw Object.assign(new Error("La cuenta esta bloqueada temporalmente."), { status: 423 });
      }
      if (!user || !user.active || !(await bcrypt.compare(password, user.password_hash))) {
        if (user?.active) await repository.recordLoginFailure(user);
        await repository.audit(user?.id, "login_failed", "session", null, { username }, request);
        throw Object.assign(new Error("Usuario o contraseña incorrectos."), { status: 401 });
      }

      await repository.recordLoginSuccess(user.id);
      await issueSession(user.id, request, response);
      await repository.audit(user.id, "login_success", "session", null, null, request);
      response.json({ user: repository.publicUser(user) });
    })
  );

  app.get(
    "/api/public/catalogs",
    asyncRoute(async (_request, response) => {
      response.json(await repository.getPublicCatalogs());
    })
  );

  app.post(
    "/api/public/register",
    registrationLimiter,
    requireMutationHeader,
    asyncRoute(async (request, response) => {
      const username = validateUsername(request.body?.username);
      const password = validatePassword(request.body?.password);
      const activist = validateActivist({
        ...request.body,
        status: "Pendiente de activación",
        role: "Activista",
        responseWindow: "2 horas+",
        availability: "Mañana",
        tookInduction: false,
        c28Registered: false,
        pollSquad: false,
        skills: [],
        networks: {},
        notes: "",
      });
      const { userId, activistId } = await repository.registerActivistAccount({
        username,
        passwordHash: await bcrypt.hash(password, 12),
        activist,
      });
      await issueSession(userId, request, response);
      await repository.audit(
        userId,
        "self_register",
        "activist",
        activistId,
        { territoryScope: activist.territoryScope },
        request
      );
      const user = await repository.findUserById(userId);
      response.status(201).json({ user: repository.publicUser(user) });
    })
  );

  app.get(
    "/api/auth/me",
    asyncRoute(authenticate),
    asyncRoute(async (request, response) => {
      response.json({ user: repository.publicUser(request.user) });
    })
  );

  app.post(
    "/api/auth/logout",
    requireMutationHeader,
    asyncRoute(authenticate),
    asyncRoute(async (request, response) => {
      await repository.deleteSession(request.sessionTokenHash);
      await repository.audit(request.user.id, "logout", "session", null, null, request);
      response.clearCookie(COOKIE_NAME, { path: "/" });
      response.status(204).end();
    })
  );

  app.post(
    "/api/auth/change-password",
    requireMutationHeader,
    asyncRoute(authenticate),
    asyncRoute(async (request, response) => {
      const currentPassword = String(request.body?.currentPassword || "");
      const newPassword = validatePassword(request.body?.newPassword);
      const user = await repository.findUserById(request.user.id);
      if (!(await bcrypt.compare(currentPassword, user.password_hash))) {
        throw Object.assign(new Error("La contraseña actual no es correcta."), { status: 401 });
      }
      if (await bcrypt.compare(newPassword, user.password_hash)) {
        throw badRequest("La contraseña nueva debe ser diferente de la actual.");
      }
      const passwordHash = await bcrypt.hash(newPassword, 12);
      await repository.setPassword(user.id, passwordHash);
      await issueSession(user.id, request, response);
      await repository.audit(user.id, "password_changed", "user", user.id, null, request);
      response.json({ ok: true });
    })
  );

  app.use("/api", requireMutationHeader, asyncRoute(authenticate), requireReadyUser);

  app.get(
    "/api/state",
    asyncRoute(async (_request, response) => {
      response.json(await repository.loadState(_request.user));
    })
  );

  app.post(
    "/api/activists",
    requireStaff,
    asyncRoute(async (request, response) => {
      const payload = validateActivist(request.body);
      const id = await repository.writeActivist(payload, request.user.id);
      await repository.audit(request.user.id, "create", "activist", id, null, request);
      response.status(201).json({ id });
    })
  );

  app.post(
    "/api/activists/me",
    asyncRoute(async (request, response) => {
      if (request.user.access_role !== "activist") {
        throw Object.assign(
          new Error("Esta acción solo está disponible para cuentas de activistas."),
          { status: 403 }
        );
      }
      if (request.user.activist_id) {
        throw Object.assign(new Error("La cuenta ya tiene una ficha de activista."), {
          status: 409,
        });
      }
      const payload = validateActivist({
        ...request.body,
        status: "Pendiente de activación",
        role: "Activista",
        tookInduction: false,
        inductionDate: "",
        c28Registered: false,
        pollSquad: false,
      });
      const id = await repository.writeActivist(payload, request.user.id, null, {
        userId: request.user.id,
      });
      await repository.audit(
        request.user.id,
        "complete_profile",
        "activist",
        id,
        null,
        request
      );
      const user = await repository.findUserById(request.user.id);
      response.status(201).json({ id, user: repository.publicUser(user) });
    })
  );

  app.put(
    "/api/activists/:id",
    asyncRoute(async (request, response) => {
      const payload = validateActivist(request.body);
      const id = cleanText(request.params.id, 36);
      const selfService = request.user.access_role === "activist";
      if (selfService && request.user.activist_id !== id) {
        throw Object.assign(new Error("Solo puede actualizar su propia ficha."), { status: 403 });
      }
      await repository.writeActivist(payload, request.user.id, id, { selfService });
      await repository.audit(request.user.id, "update", "activist", id, null, request);
      response.json({ id });
    })
  );

  app.delete(
    "/api/activists/:id",
    requireStaff,
    asyncRoute(async (request, response) => {
      const id = cleanText(request.params.id, 36);
      await repository.deleteActivist(id);
      await repository.audit(request.user.id, "delete", "activist", id, null, request);
      response.status(204).end();
    })
  );

  app.put(
    "/api/plans/provinces/:province",
    requireAdmin,
    asyncRoute(async (request, response) => {
      const province = cleanText(decodeURIComponent(request.params.province), 100);
      await repository.updateProvince(province, validateProvincePlan(request.body));
      await repository.audit(request.user.id, "update", "province_plan", province, null, request);
      response.json({ ok: true });
    })
  );

  app.put(
    "/api/plans/exterior/:seccional",
    requireAdmin,
    asyncRoute(async (request, response) => {
      const seccional = cleanText(decodeURIComponent(request.params.seccional), 100);
      await repository.updateExterior(seccional, validateExteriorPlan(request.body));
      await repository.audit(request.user.id, "update", "exterior_plan", seccional, null, request);
      response.json({ ok: true });
    })
  );

  app.put(
    "/api/plans/municipalities/:province/:municipality",
    requireAdmin,
    asyncRoute(async (request, response) => {
      const assignment = validateMunicipalityCoordinator(
        decodeURIComponent(request.params.province),
        decodeURIComponent(request.params.municipality),
        request.body
      );
      await repository.updateMunicipalityCoordinator(
        assignment.province,
        assignment.municipality,
        assignment.coordinatorName,
        request.user.id
      );
      await repository.audit(
        request.user.id,
        "update",
        "municipality_coordinator",
        `${assignment.province}/${assignment.municipality}`,
        { assigned: Boolean(assignment.coordinatorName) },
        request
      );
      response.json({ ok: true });
    })
  );

  app.put(
    "/api/coordination",
    requireAdmin,
    asyncRoute(async (request, response) => {
      const payload = Object.fromEntries(
        [
          "nationalCoordinator",
          "deputyNationalCoordinator",
          "operationsCoordinator",
          "contentCoordinator",
          "pollsCoordinator",
          "trainingCoordinator",
          "xCoordinator",
          "instagramCoordinator",
          "facebookCoordinator",
          "tiktokCoordinator",
          "youtubeCoordinator",
          "threadsCoordinator",
        ].map((key) => [
          key,
          { activistId: cleanText(request.body?.[key]?.activistId, 36) },
        ])
      );
      await repository.updateCoordination(payload);
      await repository.audit(request.user.id, "update", "national_coordination", "1", null, request);
      response.json({ ok: true });
    })
  );

  app.post(
    "/api/exports/log",
    requireStaff,
    asyncRoute(async (request, response) => {
      const format = cleanText(request.body?.format, 20);
      const report = cleanText(request.body?.report, 80);
      if (!["csv", "json"].includes(format) || !report) {
        throw badRequest("El tipo de exportacion no es valido.");
      }
      await repository.audit(
        request.user.id,
        "export",
        "report",
        report,
        { format },
        request
      );
      response.status(204).end();
    })
  );

  app.get(
    "/api/users",
    requireAdmin,
    asyncRoute(async (_request, response) => {
      response.json({
        users: await repository.listUsers(),
        audits: await repository.listAuditLogs(100),
      });
    })
  );

  app.post(
    "/api/admin/database-backup",
    requireAdmin,
    asyncRoute(async (request, response) => {
      const backup = await repository.exportDatabaseBackup();
      const compressed = await gzipAsync(Buffer.from(backup.sql, "utf8"), {
        level: 9,
      });
      await repository.audit(
        request.user.id,
        "backup",
        "database",
        null,
        {
          format: "sql.gz",
          tableCount: backup.tableCount,
          rowCount: backup.rowCount,
        },
        request
      );
      const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
      const filename = `rad-c28-respaldo-${timestamp}.sql.gz`;
      response.setHeader("Content-Type", "application/gzip");
      response.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      response.setHeader("Content-Length", compressed.length);
      response.send(compressed);
    })
  );

  app.post(
    "/api/users",
    requireAdmin,
    asyncRoute(async (request, response) => {
      const accessRole = ["admin", "operator", "activist"].includes(
        request.body?.accessRole
      )
        ? request.body.accessRole
        : "operator";
      const input = {
        username: validateUsername(request.body?.username),
        fullName: cleanText(request.body?.fullName, 160),
        accessRole,
        organizationalRole:
          accessRole === "activist"
            ? "Activista"
            : cleanText(request.body?.organizationalRole, 120),
        passwordHash: await bcrypt.hash(validatePassword(request.body?.temporaryPassword), 12),
      };
      if (!input.fullName) throw badRequest("El nombre del usuario es obligatorio.");
      const id = await repository.createUser(input);
      await repository.audit(
        request.user.id,
        "create",
        "user",
        id,
        { accessRole: input.accessRole, organizationalRole: input.organizationalRole },
        request
      );
      response.status(201).json({ id });
    })
  );

  app.patch(
    "/api/users/:id/status",
    requireAdmin,
    asyncRoute(async (request, response) => {
      const id = cleanText(request.params.id, 36);
      if (id === request.user.id && !request.body?.active) {
        throw badRequest("No puede desactivar su propia cuenta.");
      }
      if (!request.body?.active) {
        const target = await repository.findUserById(id);
        if (!target) throw Object.assign(new Error("Usuario no encontrado."), { status: 404 });
        if (target.access_role === "admin" && (await repository.countActiveAdmins()) <= 1) {
          throw badRequest("Debe existir al menos un administrador activo.");
        }
      }
      await repository.updateUserStatus(id, Boolean(request.body?.active));
      await repository.audit(
        request.user.id,
        request.body?.active ? "activate" : "deactivate",
        "user",
        id,
        null,
        request
      );
      response.json({ ok: true });
    })
  );

  app.post(
    "/api/users/:id/reset-password",
    requireAdmin,
    asyncRoute(async (request, response) => {
      const id = cleanText(request.params.id, 36);
      const passwordHash = await bcrypt.hash(validatePassword(request.body?.temporaryPassword), 12);
      await repository.resetUserPassword(id, passwordHash);
      await repository.audit(request.user.id, "reset_password", "user", id, null, request);
      response.json({ ok: true });
    })
  );

  app.all("/api/{*splat}", (_request, response) => {
    response.status(404).json({ error: "Ruta de API no encontrada." });
  });

  const staticRoot = path.join(__dirname, "..", "public");
  app.use(
    express.static(staticRoot, {
      index: false,
      etag: true,
      maxAge: config.env === "production" ? "1h" : 0,
      setHeaders(response, filePath) {
        if (filePath.endsWith("index.html")) response.setHeader("Cache-Control", "no-store");
      },
    })
  );
  app.get("/", (_request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.redirect(302, "/index.html");
  });
  app.use((_request, response) => {
    response.status(404).type("text/plain").send("Recurso no encontrado.");
  });

  app.use((error, request, response, _next) => {
    const status = Number(error.status) || 500;
    if (status >= 500) console.error(error);
    response.status(status).json({
      error: status >= 500 ? "No fue posible completar la operacion." : error.message,
      requestId: request.get("x-request-id") || undefined,
    });
  });

  return app;
}

async function ensureInitialAdmin(repository, config) {
  if ((await repository.countUsers()) > 0) return false;
  const username = validateUsername(config.initialAdmin.username);
  const password = validatePassword(config.initialAdmin.password);
  const id = await repository.createUser({
    username,
    fullName: config.initialAdmin.fullName,
    accessRole: "admin",
    organizationalRole: "Coordinador nacional",
    passwordHash: await bcrypt.hash(password, 12),
  });
  await repository.audit(id, "bootstrap", "user", id, { username }, null);
  return true;
}

module.exports = { createApp, ensureInitialAdmin, COOKIE_NAME };
