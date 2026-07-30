const { municipalitiesForProvince } = require("./territorial-catalog");

const STATUS_OPTIONS = new Set([
  "Activo",
  "En inducción",
  "Pendiente de activación",
  "Coordinando estructura",
]);
const RESPONSE_WINDOWS = new Set(["5 min", "15 min", "30 min", "1 hora", "2 horas+"]);
const AVAILABILITY_OPTIONS = new Set(["Mañana", "Mediodía", "Tarde", "Noche", "24/7"]);
const TERRITORY_SCOPES = new Set(["provincia", "exterior"]);
const NETWORK_KEYS = new Set(["x", "instagram", "facebook", "tiktok", "youtube", "threads"]);

function cleanText(value, maxLength = 255) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function normalizeUsername(value) {
  return cleanText(value, 80).toLowerCase();
}

function validateUsername(value) {
  const username = normalizeUsername(value);
  if (!/^[a-z0-9][a-z0-9._-]{2,79}$/.test(username)) {
    throw badRequest("El usuario debe tener al menos 3 caracteres y usar letras, numeros, punto, guion o guion bajo.");
  }
  return username;
}

function validatePassword(value) {
  const password = String(value ?? "");
  if (
    password.length < 6 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    throw badRequest(
      "La contraseña debe tener al menos 6 caracteres, mayuscula, minuscula, numero y simbolo."
    );
  }
  return password;
}

function normalizeCedula(value) {
  const raw = String(value ?? "").replace(/\D/g, "").slice(0, 11);
  if (raw.length !== 11) throw badRequest("La cedula debe contener 11 digitos.");
  if (!isValidDominicanCedula(raw)) throw badRequest("La cedula no supera la validacion numerica.");
  return `${raw.slice(0, 3)}-${raw.slice(3, 10)}-${raw.slice(10)}`;
}

function isValidDominicanCedula(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!/^\d{11}$/.test(digits) || /^(\d)\1{10}$/.test(digits)) return false;
  const total = digits
    .slice(0, 10)
    .split("")
    .reduce((sum, digit, index) => {
      const product = Number(digit) * (index % 2 === 0 ? 1 : 2);
      return sum + (product > 9 ? product - 9 : product);
    }, 0);
  return (10 - (total % 10)) % 10 === Number(digits[10]);
}

function oneOf(value, options, label) {
  if (!options.has(value)) throw badRequest(`${label} no es valido.`);
  return value;
}

function integer(value, label, min = 0, max = 1000000) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw badRequest(`${label} debe ser un numero entero entre ${min} y ${max}.`);
  }
  return parsed;
}

function whatsappGroupUrl(value) {
  const url = cleanText(value, 500);
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || parsed.hostname !== "chat.whatsapp.com") {
      throw new Error();
    }
    return parsed.toString();
  } catch {
    throw badRequest("El enlace debe ser una invitacion valida de chat.whatsapp.com.");
  }
}

function validateActivist(body) {
  const territoryScope = oneOf(cleanText(body.territoryScope, 20), TERRITORY_SCOPES, "El territorio");
  const province = cleanText(body.province, 100);
  const exteriorSection = cleanText(body.exteriorSection, 100);
  const municipality = cleanText(body.municipality, 120);
  if (territoryScope === "provincia" && !province) throw badRequest("Seleccione una provincia.");
  if (territoryScope === "exterior" && !exteriorSection) throw badRequest("Seleccione una seccional.");
  if (
    territoryScope === "provincia" &&
    municipality &&
    !municipalitiesForProvince(province).includes(municipality)
  ) {
    throw badRequest("El municipio no corresponde a la provincia seleccionada.");
  }

  const firstName = cleanText(body.firstName, 100);
  const lastName = cleanText(body.lastName, 100);
  if (!firstName || !lastName) throw badRequest("Nombre y apellido son obligatorios.");
  const email = cleanText(body.email, 160);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw badRequest("El correo electronico no tiene un formato valido.");
  }

  const networks = {};
  for (const [key, network] of Object.entries(body.networks || {})) {
    if (!NETWORK_KEYS.has(key)) continue;
    networks[key] = {
      handle: cleanText(network?.handle, 160),
      followers: integer(network?.followers || 0, "Seguidores", 0, 2_000_000_000),
      active: Boolean(network?.active),
    };
  }

  const tookInduction = Boolean(body.tookInduction);
  const inductionDate = cleanText(body.inductionDate, 10);
  if (tookInduction && !/^\d{4}-\d{2}-\d{2}$/.test(inductionDate)) {
    throw badRequest("Indique la fecha en que se completó la inducción.");
  }

  return {
    cedula: normalizeCedula(body.cedula),
    firstName,
    lastName,
    phone: cleanText(body.phone, 40),
    whatsapp: cleanText(body.whatsapp, 40),
    email,
    ageRange: cleanText(body.ageRange, 20),
    sex: cleanText(body.sex, 30),
    territoryScope,
    status: oneOf(cleanText(body.status, 80), STATUS_OPTIONS, "El estado"),
    province,
    exteriorSection,
    exteriorCircunscription: cleanText(body.exteriorCircunscription, 120),
    municipality,
    districtMunicipal: cleanText(body.districtMunicipal, 120),
    region: cleanText(body.region, 100),
    macroRegion: cleanText(body.macroRegion, 100),
    role: cleanText(body.role, 120) || "Activista",
    provincialCoordinator: cleanText(body.provincialCoordinator, 160),
    regionalCoordinator: cleanText(body.regionalCoordinator, 160),
    macroCoordinator: cleanText(body.macroCoordinator, 160),
    tookInduction,
    inductionDate: tookInduction ? inductionDate : "",
    c28Registered: Boolean(body.c28Registered),
    responseWindow: oneOf(
      cleanText(body.responseWindow, 30),
      RESPONSE_WINDOWS,
      "La ventana de respuesta"
    ),
    availability: oneOf(cleanText(body.availability, 40), AVAILABILITY_OPTIONS, "La disponibilidad"),
    pollSquad: Boolean(body.pollSquad),
    skills: [...new Set((Array.isArray(body.skills) ? body.skills : []).map((item) => cleanText(item, 120)))],
    networks,
    notes: cleanText(body.notes, 4000),
  };
}

function validateProvincePlan(body) {
  return {
    plannedCells: integer(body.plannedCells, "Municipios o distritos", 0, 100),
    unitGoal: integer(body.unitGoal, "Meta por territorio", 1, 10000),
    provincialGoal: integer(body.provincialGoal, "Meta provincial", 1, 10000),
    provincialCoordinator: cleanText(body.provincialCoordinator, 160),
    regionalCoordinator: cleanText(body.regionalCoordinator, 160),
    macroCoordinator: cleanText(body.macroCoordinator, 160),
    whatsappGroupUrl: whatsappGroupUrl(body.whatsappGroupUrl),
  };
}

function validateExteriorPlan(body) {
  return {
    circunscriptionCount: integer(body.circunscriptionCount, "Circunscripciones", 0, 100),
    sectionalDirectiveGoal: integer(body.sectionalDirectiveGoal, "Meta seccional", 1, 10000),
    circunscriptionGoal: integer(body.circunscriptionGoal, "Meta por circunscripcion", 1, 10000),
    provincialCoordinator: cleanText(body.provincialCoordinator, 160),
    regionalCoordinator: cleanText(body.regionalCoordinator, 160),
    macroCoordinator: cleanText(body.macroCoordinator, 160),
    whatsappGroupUrl: whatsappGroupUrl(body.whatsappGroupUrl),
  };
}

function validateMunicipalityCoordinator(provinceValue, municipalityValue, body) {
  const province = cleanText(provinceValue, 100);
  const municipality = cleanText(municipalityValue, 120);
  if (!municipalitiesForProvince(province).includes(municipality)) {
    throw badRequest("El municipio no corresponde a la provincia seleccionada.");
  }
  return {
    province,
    municipality,
    coordinatorName: cleanText(body?.coordinatorName, 160),
  };
}

function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

module.exports = {
  cleanText,
  normalizeUsername,
  validateUsername,
  validatePassword,
  validateActivist,
  validateProvincePlan,
  validateExteriorPlan,
  validateMunicipalityCoordinator,
  isValidDominicanCedula,
  badRequest,
};
