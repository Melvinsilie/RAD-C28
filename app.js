const STORAGE_KEY = "radc28-platform-v1";
const DEFAULT_VIEW_HASH = "#dashboard";
const DOMESTIC_SCOPE = "provincia";
const EXTERIOR_SCOPE = "exterior";

const STATUS_OPTIONS = [
  "Activo",
  "En induccion",
  "Pendiente de activacion",
  "Coordinando estructura",
];

const ROLE_OPTIONS = [
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

const AGE_RANGE_OPTIONS = [
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55+",
];

const SEX_OPTIONS = ["Femenino", "Masculino"];

const RESPONSE_WINDOWS = ["5 min", "15 min", "30 min", "1 hora", "2 horas+"];

const AVAILABILITY_OPTIONS = [
  "Mañana",
  "Mediodia",
  "Tarde",
  "Noche",
  "24/7",
];

const SKILL_OPTIONS = [
  "Comentarios estrategicos",
  "Compartir y amplificar",
  "Moderacion y sentimiento",
  "Sondeos y votaciones",
  "Creacion de contenido",
  "Video corto",
  "Diseño grafico",
  "Monitoreo temprano",
];

const NETWORK_CONFIG = [
  { key: "x", label: "X / Twitter" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "TikTok" },
  { key: "youtube", label: "YouTube" },
  { key: "threads", label: "Threads" },
];

const MAP_SIZE = { width: 860, height: 620, padding: 28 };

const MAP_PROVINCE_ALIASES = {
  baoruco: "Bahoruco",
};

const MAP_LABEL_OVERRIDES = {
  "Distrito Nacional": { dx: 18, dy: -10, label: "D.N." },
  "Santo Domingo": { dx: 28, dy: 18, label: "Sto. Dgo.", fontSize: 8.4 },
  "María Trinidad Sánchez": { label: "M.T. Sanchez", fontSize: 8.2 },
  "Hermanas Mirabal": { label: "Hnas. Mirabal", fontSize: 8.2 },
  "San José de Ocoa": { label: "S.J. de Ocoa", fontSize: 8 },
  "Santiago Rodríguez": { label: "S. Rodriguez", fontSize: 8.1 },
  "Sánchez Ramírez": { label: "S. Ramirez", fontSize: 8.2 },
  "Monseñor Nouel": { label: "M. Nouel", fontSize: 8.2 },
  "San Pedro de Macorís": { label: "S.P. de Macoris", fontSize: 7.7 },
};

const DEFAULT_NATIONAL_COORDINATION = {
  nationalCoordinator: "",
  deputyNationalCoordinator: "",
  operationsCoordinator: "",
  contentCoordinator: "",
  pollsCoordinator: "",
};

const PROVINCE_BLUEPRINTS = [
  { province: "Azua", region: "Valdesia", macroRegion: "Suroeste", plannedCells: 4, unitGoal: 10 },
  { province: "Bahoruco", region: "Enriquillo", macroRegion: "Suroeste", plannedCells: 2, unitGoal: 10 },
  { province: "Barahona", region: "Enriquillo", macroRegion: "Suroeste", plannedCells: 4, unitGoal: 10 },
  { province: "Dajabón", region: "Cibao Noroeste", macroRegion: "Norte", plannedCells: 3, unitGoal: 10 },
  { province: "Distrito Nacional", region: "Ozama", macroRegion: "Sureste", plannedCells: 1, unitGoal: 20 },
  { province: "Duarte", region: "Cibao Nordeste", macroRegion: "Norte", plannedCells: 4, unitGoal: 10 },
  { province: "Elías Piña", region: "El Valle", macroRegion: "Suroeste", plannedCells: 2, unitGoal: 10 },
  { province: "El Seibo", region: "Yuma", macroRegion: "Sureste", plannedCells: 2, unitGoal: 10 },
  { province: "Espaillat", region: "Cibao Norte", macroRegion: "Norte", plannedCells: 4, unitGoal: 10 },
  { province: "Hato Mayor", region: "Higüamo", macroRegion: "Sureste", plannedCells: 3, unitGoal: 10 },
  { province: "Hermanas Mirabal", region: "Cibao Nordeste", macroRegion: "Norte", plannedCells: 2, unitGoal: 10 },
  { province: "Independencia", region: "Enriquillo", macroRegion: "Suroeste", plannedCells: 2, unitGoal: 10 },
  { province: "La Altagracia", region: "Yuma", macroRegion: "Sureste", plannedCells: 4, unitGoal: 10 },
  { province: "La Romana", region: "Yuma", macroRegion: "Sureste", plannedCells: 3, unitGoal: 10 },
  { province: "La Vega", region: "Cibao Sur", macroRegion: "Norte", plannedCells: 4, unitGoal: 10 },
  { province: "María Trinidad Sánchez", region: "Cibao Nordeste", macroRegion: "Norte", plannedCells: 4, unitGoal: 10 },
  { province: "Monseñor Nouel", region: "Cibao Sur", macroRegion: "Norte", plannedCells: 3, unitGoal: 10 },
  { province: "Monte Cristi", region: "Cibao Noroeste", macroRegion: "Norte", plannedCells: 4, unitGoal: 10 },
  { province: "Monte Plata", region: "Higüamo", macroRegion: "Sureste", plannedCells: 4, unitGoal: 10 },
  { province: "Pedernales", region: "Enriquillo", macroRegion: "Suroeste", plannedCells: 2, unitGoal: 10 },
  { province: "Peravia", region: "Valdesia", macroRegion: "Suroeste", plannedCells: 3, unitGoal: 10 },
  { province: "Puerto Plata", region: "Cibao Norte", macroRegion: "Norte", plannedCells: 4, unitGoal: 10 },
  { province: "Samaná", region: "Cibao Nordeste", macroRegion: "Norte", plannedCells: 3, unitGoal: 10 },
  { province: "San Cristóbal", region: "Valdesia", macroRegion: "Suroeste", plannedCells: 6, unitGoal: 10 },
  { province: "San José de Ocoa", region: "Valdesia", macroRegion: "Suroeste", plannedCells: 2, unitGoal: 10 },
  { province: "San Juan", region: "El Valle", macroRegion: "Suroeste", plannedCells: 5, unitGoal: 10 },
  { province: "San Pedro de Macorís", region: "Higüamo", macroRegion: "Sureste", plannedCells: 4, unitGoal: 10 },
  { province: "Sánchez Ramírez", region: "Cibao Sur", macroRegion: "Norte", plannedCells: 3, unitGoal: 10 },
  { province: "Santiago", region: "Cibao Norte", macroRegion: "Norte", plannedCells: 7, unitGoal: 10 },
  { province: "Santiago Rodríguez", region: "Cibao Noroeste", macroRegion: "Norte", plannedCells: 2, unitGoal: 10 },
  { province: "Santo Domingo", region: "Ozama", macroRegion: "Sureste", plannedCells: 7, unitGoal: 20 },
  { province: "Valverde", region: "Cibao Noroeste", macroRegion: "Norte", plannedCells: 3, unitGoal: 10 },
];

const EXTERIOR_BLUEPRINTS = [
  { seccional: "Nueva York", zone: "USA y Canada", macroRegion: "Exterior", circunscriptionCount: 1 },
  { seccional: "New Jersey", zone: "USA y Canada", macroRegion: "Exterior", circunscriptionCount: 1 },
  { seccional: "Boston", zone: "USA y Canada", macroRegion: "Exterior", circunscriptionCount: 1 },
  { seccional: "Miami", zone: "Florida", macroRegion: "Exterior", circunscriptionCount: 1 },
  { seccional: "Puerto Rico", zone: "Caribe", macroRegion: "Exterior", circunscriptionCount: 1 },
  { seccional: "Madrid", zone: "Europa", macroRegion: "Exterior", circunscriptionCount: 1 },
  { seccional: "Barcelona", zone: "Europa", macroRegion: "Exterior", circunscriptionCount: 1 },
  { seccional: "Zurich", zone: "Europa", macroRegion: "Exterior", circunscriptionCount: 1 },
];

function buildDefaultProvincePlans() {
  return PROVINCE_BLUEPRINTS.map((item) => ({
    ...item,
    provincialGoal: 20,
    provincialCoordinator: "",
    regionalCoordinator: "",
    macroCoordinator: "",
  }));
}

function buildDefaultExteriorPlans() {
  return EXTERIOR_BLUEPRINTS.map((item) => ({
    ...item,
    sectionalDirectiveGoal: 20,
    circunscriptionGoal: 20,
    provincialCoordinator: "",
    regionalCoordinator: "",
    macroCoordinator: "",
  }));
}

const DIRECTORY_SEED = [
  {
    cedula: "001-1738456-2",
    firstName: "Alba",
    lastName: "Rosario",
    province: "Santo Domingo",
    municipality: "Santo Domingo Este",
    districtMunicipal: "",
    phone: "809-555-1141",
    whatsapp: "809-555-1141",
    email: "alba.rosario@radc28.do",
  },
  {
    cedula: "002-1984527-7",
    firstName: "Joel",
    lastName: "Paredes",
    province: "Santiago",
    municipality: "Santiago de los Caballeros",
    districtMunicipal: "",
    phone: "809-555-2212",
    whatsapp: "809-555-2212",
    email: "joel.paredes@radc28.do",
  },
  {
    cedula: "031-2041857-1",
    firstName: "Kenia",
    lastName: "Martinez",
    province: "La Altagracia",
    municipality: "Higuey",
    districtMunicipal: "",
    phone: "829-555-7890",
    whatsapp: "829-555-7890",
    email: "kenia.martinez@radc28.do",
  },
  {
    cedula: "028-1639425-5",
    firstName: "Raul",
    lastName: "Mieses",
    province: "San Cristóbal",
    municipality: "San Cristobal",
    districtMunicipal: "",
    phone: "849-555-1442",
    whatsapp: "849-555-1442",
    email: "raul.mieses@radc28.do",
  },
  {
    cedula: "012-2097348-3",
    firstName: "Yolanda",
    lastName: "Berroa",
    province: "La Vega",
    municipality: "La Vega",
    districtMunicipal: "",
    phone: "809-555-4998",
    whatsapp: "809-555-4998",
    email: "yolanda.berroa@radc28.do",
  },
];

const DEMO_IDENTITY_POOL = [
  ["Adriana", "Cabrera"],
  ["Luis", "Morillo"],
  ["Paola", "Guzman"],
  ["Erick", "Santana"],
  ["Diana", "Peralta"],
  ["Mario", "Castillo"],
  ["Karina", "Matos"],
  ["Jorge", "Pichardo"],
  ["Laura", "Sanchez"],
  ["Victor", "Abreu"],
  ["Natalia", "Reyes"],
  ["Omar", "Tejada"],
  ["Cecilia", "de Leon"],
  ["Manuel", "Bautista"],
  ["Rosa", "Valerio"],
  ["Hector", "Campusano"],
  ["Tania", "Mesa"],
  ["Julio", "Frias"],
  ["Pamela", "Solano"],
  ["Richard", "Nunez"],
  ["Lorena", "Melo"],
  ["Gabriel", "Sosa"],
  ["Elisa", "Marte"],
  ["Samuel", "Polanco"],
  ["Noelia", "Rosado"],
  ["Cristian", "Mendez"],
  ["Yessenia", "Toribio"],
  ["Kelvin", "Diaz"],
  ["Maribel", "Pena"],
  ["Andres", "Familia"],
  ["Bianca", "Herrera"],
  ["Ramon", "Rosario"],
];

const DEMO_SKILL_SETS = [
  ["Comentarios estrategicos", "Moderacion y sentimiento", "Sondeos y votaciones"],
  ["Compartir y amplificar", "Monitoreo temprano", "Video corto"],
  ["Creacion de contenido", "Diseño grafico", "Compartir y amplificar"],
  ["Sondeos y votaciones", "Comentarios estrategicos", "Monitoreo temprano"],
];

function buildProvinceDemoCluster({
  province,
  municipality,
  count,
  cedulaSeed,
  identityOffset = 0,
  provincialCoordinator,
  regionalCoordinator,
  macroCoordinator,
  leadRole = "Coordinador municipal",
}) {
  return Array.from({ length: count }, (_, index) => {
    const [firstName, lastName] =
      DEMO_IDENTITY_POOL[(identityOffset + index) % DEMO_IDENTITY_POOL.length];
    const fullName = `${firstName} ${lastName}`;
    const handle = buildDemoHandle(firstName, lastName, identityOffset + index);
    const isLead = index === 0;

    return createDemoRecord({
      cedula: formatDemoCedula(cedulaSeed + index),
      firstName,
      lastName,
      sex: index % 2 === 0 ? "Femenino" : "Masculino",
      province,
      municipality,
      role: isLead ? leadRole : index % 5 === 0 ? "Escuadra de sondeos" : "Activista",
      status: isLead ? "Coordinando estructura" : "Activo",
      tookInduction: true,
      c28Registered: true,
      responseWindow: index % 3 === 0 ? "5 min" : "15 min",
      availability: index % 4 === 0 ? "24/7" : index % 2 === 0 ? "Tarde" : "Noche",
      pollSquad: true,
      skills: DEMO_SKILL_SETS[index % DEMO_SKILL_SETS.length],
      provincialCoordinator,
      regionalCoordinator,
      macroCoordinator,
      notes: `Nodo demo de alta disponibilidad para cobertura intensiva en ${municipality}.`,
      networks: buildDemoNetworks(handle, fullName, index),
    });
  });
}

const DEMO_MUNICIPALITY_OVERRIDES = {
  Azua: "Azua de Compostela",
  Bahoruco: "Neiba",
  Dajabón: "Dajabon",
  "Distrito Nacional": "Distrito Nacional",
  Duarte: "San Francisco de Macoris",
  "Elías Piña": "Comendador",
  "El Seibo": "Santa Cruz de El Seibo",
  "Hato Mayor": "Hato Mayor del Rey",
  "Hermanas Mirabal": "Salcedo",
  "La Altagracia": "Higuey",
  "La Romana": "La Romana",
  "María Trinidad Sánchez": "Nagua",
  "Monseñor Nouel": "Bonao",
  "Monte Cristi": "San Fernando de Monte Cristi",
  "Monte Plata": "Monte Plata",
  Pedernales: "Pedernales",
  Peravia: "Bani",
  "Puerto Plata": "San Felipe de Puerto Plata",
  Samaná: "Santa Barbara de Samana",
  "San Cristóbal": "San Cristobal",
  "San José de Ocoa": "San Jose de Ocoa",
  "San Juan": "San Juan de la Maguana",
  "San Pedro de Macorís": "San Pedro de Macoris",
  "Sánchez Ramírez": "Cotui",
  Santiago: "Santiago de los Caballeros",
  "Santiago Rodríguez": "San Ignacio de Sabaneta",
  "Santo Domingo": "Santo Domingo Este",
  Valverde: "Mao",
};

const DEMO_REGIONAL_COORDINATORS = {
  Norte: ["Sandra Estrella", "Victor Marte", "Lorena Taveras", "Miguel Ventura"],
  Sureste: ["Ernesto Cuevas", "Marcos de la Cruz", "Iris Del Rosario", "Lina Mella"],
  Suroeste: ["Nidia Fortuna", "Ruth Feliz", "Julissa Mora", "Rafael Lagares"],
  Exterior: ["Paola Ventura", "Ramon Frias", "Karla Veloz"],
};

const DEMO_MACRO_COORDINATORS = {
  Norte: ["Victor Ureña", "Rosa Paulino"],
  Sureste: ["Diana Montero", "Carlos de Leon"],
  Suroeste: ["Rafael Lagares", "Gina Santana"],
  Exterior: ["Paola Ventura", "Karla Veloz"],
};

const PRESET_DEMO_CLUSTER_CONFIG = [
  {
    province: "Distrito Nacional",
    municipality: "Distrito Nacional",
    count: 10,
    cedulaSeed: 70000000000,
    identityOffset: 0,
    provincialCoordinator: "Lina Mella",
    regionalCoordinator: "Ernesto Cuevas",
    macroCoordinator: "Diana Montero",
  },
  {
    province: "La Altagracia",
    municipality: "Higuey",
    count: 16,
    cedulaSeed: 71000000000,
    identityOffset: 7,
    provincialCoordinator: "Luisana Perez",
    regionalCoordinator: "Marcos de la Cruz",
    macroCoordinator: "Diana Montero",
  },
  {
    province: "La Vega",
    municipality: "La Vega",
    count: 16,
    cedulaSeed: 72000000000,
    identityOffset: 15,
    provincialCoordinator: "Miguel de la Rosa",
    regionalCoordinator: "Sandra Estrella",
    macroCoordinator: "Victor Ureña",
  },
  {
    province: "San Pedro de Macorís",
    municipality: "San Pedro de Macoris",
    count: 16,
    cedulaSeed: 73000000000,
    identityOffset: 21,
    provincialCoordinator: "Iris Del Rosario",
    regionalCoordinator: "Marcos de la Cruz",
    macroCoordinator: "Diana Montero",
  },
  {
    province: "Santiago",
    municipality: "Santiago de los Caballeros",
    count: 24,
    cedulaSeed: 74000000000,
    identityOffset: 4,
    provincialCoordinator: "Joel Paredes",
    regionalCoordinator: "Sandra Estrella",
    macroCoordinator: "Victor Ureña",
    leadRole: "Coordinador provincial",
  },
];

const DEMO_DISABLED_PROVINCES = new Set(["Monseñor Nouel"]);

function demoMunicipalityForProvince(province) {
  return DEMO_MUNICIPALITY_OVERRIDES[province] || province;
}

function buildDemoCoordinatorProfile(plan, index) {
  const [firstName, lastName] =
    DEMO_IDENTITY_POOL[(index * 3) % DEMO_IDENTITY_POOL.length];
  const regionalPool = DEMO_REGIONAL_COORDINATORS[plan.macroRegion] || DEMO_REGIONAL_COORDINATORS.Sureste;
  const macroPool = DEMO_MACRO_COORDINATORS[plan.macroRegion] || DEMO_MACRO_COORDINATORS.Sureste;

  return {
    provincialCoordinator: `${firstName} ${lastName}`,
    regionalCoordinator: regionalPool[index % regionalPool.length],
    macroCoordinator: macroPool[index % macroPool.length],
  };
}

function buildProvinceDemoCoverage() {
  const presetCoverage = PRESET_DEMO_CLUSTER_CONFIG.flatMap((config) => buildProvinceDemoCluster(config));
  const coveredProvinces = new Set(PRESET_DEMO_CLUSTER_CONFIG.map((config) => config.province));
  let cedulaSeed = 75000000000;
  let identityOffset = 28;

  const generatedCoverage = PROVINCE_BLUEPRINTS
    .filter((plan) => !coveredProvinces.has(plan.province))
    .filter((plan) => !DEMO_DISABLED_PROVINCES.has(plan.province))
    .flatMap((plan, index) => {
      const coordinators = buildDemoCoordinatorProfile(plan, index);
      const count = Math.max(7, plan.plannedCells * 2 + 1 + (plan.unitGoal === 20 ? 2 : 0));

      const cluster = buildProvinceDemoCluster({
        province: plan.province,
        municipality: demoMunicipalityForProvince(plan.province),
        count,
        cedulaSeed,
        identityOffset,
        provincialCoordinator: coordinators.provincialCoordinator,
        regionalCoordinator: coordinators.regionalCoordinator,
        macroCoordinator: coordinators.macroCoordinator,
        leadRole: "Coordinador provincial",
      });

      cedulaSeed += 100000000;
      identityOffset += 5;
      return cluster;
    });

  return [...presetCoverage, ...generatedCoverage];
}

function buildDemoHandle(firstName, lastName, seed) {
  return `${sanitizeDemoToken(firstName)}${sanitizeDemoToken(lastName)}${seed + 1}`;
}

function sanitizeDemoToken(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

function formatDemoCedula(serial) {
  const digits = String(serial).replace(/\D/g, "").padStart(11, "0").slice(-11);
  return `${digits.slice(0, 3)}-${digits.slice(3, 10)}-${digits.slice(10)}`;
}

function buildDemoNetworks(handle, fullName, index) {
  const lift = index * 80;
  const youtubeActive = index % 3 !== 1;

  return {
    x: network(`@${handle}`, 1800 + lift, true),
    instagram: network(`@${handle}rd`, 2800 + lift, true),
    facebook: network(fullName, 2000 + lift, true),
    tiktok: network(`@${handle}c28`, 2300 + lift, true),
    youtube: network(youtubeActive ? `@${handle}tv` : "", youtubeActive ? 700 + Math.round(lift * 0.45) : 0, youtubeActive),
    threads: network(`@${handle}`, 950 + Math.round(lift * 0.6), true),
  };
}

const DEMO_RECORDS = [
  createDemoRecord({
    cedula: "001-1738456-2",
    firstName: "Alba",
    lastName: "Rosario",
    province: "Santo Domingo",
    municipality: "Santo Domingo Este",
    role: "Coordinador municipal",
    status: "Coordinando estructura",
    tookInduction: true,
    c28Registered: true,
    responseWindow: "5 min",
    availability: "24/7",
    pollSquad: true,
    skills: ["Comentarios estrategicos", "Moderacion y sentimiento", "Sondeos y votaciones"],
    provincialCoordinator: "Marta Valdez",
    regionalCoordinator: "Ernesto Cuevas",
    macroCoordinator: "Diana Montero",
    notes: "Coordina la activacion temprana y los grupos de WhatsApp del municipio.",
    networks: {
      x: network("@albarad", 4300, true),
      instagram: network("@albaradc28", 9200, true),
      facebook: network("Alba Rosario", 5200, true),
      tiktok: network("@albarad", 6100, true),
      youtube: network("", 0, false),
      threads: network("@albarad", 1200, true),
    },
  }),
  createDemoRecord({
    cedula: "002-1984527-7",
    firstName: "Joel",
    lastName: "Paredes",
    province: "Santiago",
    municipality: "Santiago de los Caballeros",
    role: "Coordinador provincial",
    status: "Coordinando estructura",
    tookInduction: true,
    c28Registered: true,
    responseWindow: "15 min",
    availability: "Noche",
    pollSquad: true,
    skills: ["Comentarios estrategicos", "Compartir y amplificar", "Monitoreo temprano"],
    provincialCoordinator: "Joel Paredes",
    regionalCoordinator: "Sandra Estrella",
    macroCoordinator: "Victor Ureña",
    notes: "Conecta con nodos juveniles y equipos universitarios.",
    networks: {
      x: network("@joelp_rad", 7800, true),
      instagram: network("@joelrad", 6800, true),
      facebook: network("Joel Paredes", 4100, true),
      tiktok: network("@joelparedes", 3900, true),
      youtube: network("@joelp", 900, true),
      threads: network("@joelp_rad", 1500, true),
    },
  }),
  createDemoRecord({
    cedula: "031-2041857-1",
    firstName: "Kenia",
    lastName: "Martinez",
    province: "La Altagracia",
    municipality: "Higuey",
    role: "Activista",
    status: "Activo",
    tookInduction: true,
    c28Registered: true,
    responseWindow: "15 min",
    availability: "Tarde",
    pollSquad: true,
    skills: ["Compartir y amplificar", "Sondeos y votaciones", "Video corto"],
    provincialCoordinator: "Luisana Perez",
    regionalCoordinator: "Marcos de la Cruz",
    macroCoordinator: "Diana Montero",
    notes: "Muy fuerte en TikTok y sondeos tematicos.",
    networks: {
      x: network("@keniamc28", 1500, true),
      instagram: network("@keniamc28", 8700, true),
      facebook: network("Kenia Martinez", 2600, true),
      tiktok: network("@kenia.higuey", 11200, true),
      youtube: network("", 0, false),
      threads: network("@keniamc28", 740, true),
    },
  }),
  createDemoRecord({
    cedula: "028-1639425-5",
    firstName: "Raul",
    lastName: "Mieses",
    province: "San Cristóbal",
    municipality: "San Cristobal",
    role: "Coordinador provincial",
    status: "Activo",
    tookInduction: true,
    c28Registered: false,
    responseWindow: "30 min",
    availability: "Mañana",
    pollSquad: false,
    skills: ["Creacion de contenido", "Diseño grafico", "Compartir y amplificar"],
    provincialCoordinator: "Raul Mieses",
    regionalCoordinator: "Nidia Fortuna",
    macroCoordinator: "Rafael Lagares",
    notes: "Lidera contenidos visuales y piezas de respuesta.",
    networks: {
      x: network("@raulmieses", 2200, true),
      instagram: network("@miesesvisual", 5400, true),
      facebook: network("Raul Mieses", 6900, true),
      tiktok: network("@miesesvisual", 2400, true),
      youtube: network("@miesesstudio", 1100, true),
      threads: network("@miesesvisual", 400, true),
    },
  }),
  createDemoRecord({
    cedula: "012-2097348-3",
    firstName: "Yolanda",
    lastName: "Berroa",
    province: "La Vega",
    municipality: "La Vega",
    role: "Activista",
    status: "Activo",
    tookInduction: true,
    c28Registered: true,
    responseWindow: "5 min",
    availability: "24/7",
    pollSquad: true,
    skills: ["Moderacion y sentimiento", "Comentarios estrategicos", "Monitoreo temprano"],
    provincialCoordinator: "Miguel de la Rosa",
    regionalCoordinator: "Sandra Estrella",
    macroCoordinator: "Victor Ureña",
    notes: "Excelente perfil de contencion de crisis y respuesta temprana.",
    networks: {
      x: network("@yberroa", 3800, true),
      instagram: network("@yberroa", 2100, true),
      facebook: network("Yolanda Berroa", 3300, true),
      tiktok: network("", 0, false),
      youtube: network("", 0, false),
      threads: network("@yberroa", 350, true),
    },
  }),
  createDemoRecord({
    cedula: "402-1183745-0",
    firstName: "David",
    lastName: "Natera",
    province: "San Pedro de Macorís",
    municipality: "San Pedro de Macoris",
    role: "Escuadra de sondeos",
    status: "Activo",
    tookInduction: true,
    c28Registered: true,
    responseWindow: "15 min",
    availability: "Noche",
    pollSquad: true,
    skills: ["Sondeos y votaciones", "Compartir y amplificar"],
    provincialCoordinator: "Iris Del Rosario",
    regionalCoordinator: "Marcos de la Cruz",
    macroCoordinator: "Diana Montero",
    notes: "Activa sondeos sectoriales y comparte evidencia de votacion.",
    networks: {
      x: network("@davidnatera", 1700, true),
      instagram: network("@davidnatera", 3900, true),
      facebook: network("David Natera", 2600, true),
      tiktok: network("@nateraactiva", 1800, true),
      youtube: network("", 0, false),
      threads: network("", 0, false),
    },
  }),
  createDemoRecord({
    cedula: "047-1104736-6",
    firstName: "Marisol",
    lastName: "Cuevas",
    province: "Barahona",
    municipality: "Barahona",
    role: "Coordinador municipal",
    status: "En induccion",
    tookInduction: false,
    c28Registered: false,
    responseWindow: "1 hora",
    availability: "Tarde",
    pollSquad: false,
    skills: ["Compartir y amplificar", "Creacion de contenido"],
    provincialCoordinator: "Ruth Feliz",
    regionalCoordinator: "Nidia Fortuna",
    macroCoordinator: "Rafael Lagares",
    notes: "Estructura en formacion, buen potencial para microvideo.",
    networks: {
      x: network("", 0, false),
      instagram: network("@marisolbarahona", 2100, true),
      facebook: network("Marisol Cuevas", 4400, true),
      tiktok: network("@marisolbarahona", 1600, true),
      youtube: network("", 0, false),
      threads: network("", 0, false),
    },
  }),
  createDemoRecord({
    cedula: "054-1773049-2",
    firstName: "Sonia",
    lastName: "Acosta",
    province: "Dajabón",
    municipality: "Dajabon",
    role: "Activista",
    status: "Pendiente de activacion",
    tookInduction: false,
    c28Registered: false,
    responseWindow: "2 horas+",
    availability: "Mañana",
    pollSquad: false,
    skills: ["Compartir y amplificar"],
    provincialCoordinator: "Julissa Mora",
    regionalCoordinator: "Victor Ureña",
    macroCoordinator: "Victor Ureña",
    notes: "Pendiente de induccion y alta formal en C28.",
    networks: {
      x: network("@soniacosta", 900, true),
      instagram: network("@soniacosta", 1200, true),
      facebook: network("Sonia Acosta", 1800, true),
      tiktok: network("", 0, false),
      youtube: network("", 0, false),
      threads: network("", 0, false),
    },
  }),
  createDemoRecord({
    cedula: "001-1127754-2",
    firstName: "Esteban",
    lastName: "Franco",
    province: "Distrito Nacional",
    municipality: "Distrito Nacional",
    role: "Apoyo de contenidos",
    status: "Activo",
    tookInduction: true,
    c28Registered: true,
    responseWindow: "5 min",
    availability: "24/7",
    pollSquad: true,
    skills: ["Creacion de contenido", "Diseño grafico", "Monitoreo temprano"],
    provincialCoordinator: "Lina Mella",
    regionalCoordinator: "Ernesto Cuevas",
    macroCoordinator: "Diana Montero",
    notes: "Produce piezas express para activaciones y respuestas coordinadas.",
    networks: {
      x: network("@estebanc28", 6200, true),
      instagram: network("@estebanvisual", 9700, true),
      facebook: network("Esteban Franco", 2100, true),
      tiktok: network("@estebanvisual", 4500, true),
      youtube: network("@estebanvisual", 1300, true),
      threads: network("@estebanc28", 990, true),
    },
  }),
  createDemoRecord({
    cedula: "001-1339061-4",
    firstName: "Nadia",
    lastName: "Tineo",
    province: "Monte Plata",
    municipality: "Yamasa",
    role: "Activista",
    status: "Activo",
    tookInduction: true,
    c28Registered: false,
    responseWindow: "30 min",
    availability: "Tarde",
    pollSquad: false,
    skills: ["Comentarios estrategicos", "Compartir y amplificar"],
    provincialCoordinator: "Iris Del Rosario",
    regionalCoordinator: "Marcos de la Cruz",
    macroCoordinator: "Diana Montero",
    notes: "Apoya desde estructuras comunitarias y enlaces rurales.",
    networks: {
      x: network("@nadiatineo", 980, true),
      instagram: network("@nadiatineo", 2400, true),
      facebook: network("Nadia Tineo", 2900, true),
      tiktok: network("", 0, false),
      youtube: network("", 0, false),
      threads: network("", 0, false),
    },
  }),
  ...buildProvinceDemoCoverage(),
];

const DEMO_CEDULA_SET = new Set(DEMO_RECORDS.map((record) => record.cedula));

const state = loadState();

const nodes = {
  appShell: document.querySelector(".app-shell"),
  contentShell: document.querySelector(".content-shell"),
  mainLayout: document.querySelector(".main-layout"),
  dashboardView: document.querySelector("#dashboard"),
  sidebarNav: document.querySelector("#sidebarNav"),
  sidebarToggle: document.querySelector("#sidebarToggle"),
  sidebarCollapse: document.querySelector("#sidebarCollapse"),
  sidebarBackdrop: document.querySelector("#sidebarBackdrop"),
  moduleEyebrow: document.querySelector("#moduleEyebrow"),
  moduleTitle: document.querySelector("#moduleTitle"),
  moduleSummary: document.querySelector("#moduleSummary"),
  moduleContextPill: document.querySelector("#moduleContextPill"),
  heroSignals: document.querySelector("#heroSignals"),
  heroReach: document.querySelector("#heroReach"),
  heroResponse: document.querySelector("#heroResponse"),
  metricGrid: document.querySelector("#metricGrid"),
  pulseList: document.querySelector("#pulseList"),
  funnelGrid: document.querySelector("#funnelGrid"),
  provinceSummaryTable: document.querySelector("#provinceSummaryTable"),
  rdMap: document.querySelector("#rdMap"),
  mapStatus: document.querySelector("#mapStatus"),
  provinceDetail: document.querySelector("#provinceDetail"),
  activistForm: document.querySelector("#activistForm"),
  recordId: document.querySelector("#recordId"),
  cedulaInput: document.querySelector("#cedulaInput"),
  autofillStatus: document.querySelector("#autofillStatus"),
  territoryScopeInput: document.querySelector("#territoryScopeInput"),
  provinceField: document.querySelector("#provinceField"),
  exteriorSectionField: document.querySelector("#exteriorSectionField"),
  districtField: document.querySelector("#districtField"),
  exteriorDistrictField: document.querySelector("#exteriorDistrictField"),
  territoryNameLabel: document.querySelector("#territoryNameLabel"),
  districtFieldLabel: document.querySelector("#districtFieldLabel"),
  provCoordinatorLabel: document.querySelector("#provCoordinatorLabel"),
  regionalCoordinatorLabel: document.querySelector("#regionalCoordinatorLabel"),
  macroCoordinatorLabel: document.querySelector("#macroCoordinatorLabel"),
  provinceInput: document.querySelector("#provinceInput"),
  exteriorSectionInput: document.querySelector("#exteriorSectionInput"),
  exteriorDistrictInput: document.querySelector("#exteriorDistrictInput"),
  regionInput: document.querySelector("#regionInput"),
  macroRegionInput: document.querySelector("#macroRegionInput"),
  adminRoleSection: document.querySelector("#adminRoleSection"),
  roleInput: document.querySelector("#roleInput"),
  statusInput: document.querySelector("#statusInput"),
  ageRangeInput: document.querySelector("#ageRangeInput"),
  sexInput: document.querySelector("#sexInput"),
  responseWindowInput: document.querySelector("#responseWindowInput"),
  availabilityInput: document.querySelector("#availabilityInput"),
  networkFields: document.querySelector("#networkFields"),
  skillsPicker: document.querySelector("#skillsPicker"),
  provinceConfigTable: document.querySelector("#provinceConfigTable"),
  recordTableBody: document.querySelector("#recordTableBody"),
  recordCount: document.querySelector("#recordCount"),
  databaseStatus: document.querySelector("#databaseStatus"),
  searchInput: document.querySelector("#searchInput"),
  filterProvince: document.querySelector("#filterProvince"),
  filterRole: document.querySelector("#filterRole"),
  filterStatus: document.querySelector("#filterStatus"),
  clearFormBtn: document.querySelector("#clearFormBtn"),
  restoreDemoBtn: document.querySelector("#restoreDemoBtn"),
  exportCsvBtn: document.querySelector("#exportCsvBtn"),
  exportJsonBtn: document.querySelector("#exportJsonBtn"),
  exportTerritorialBtn: document.querySelector("#exportTerritorialBtn"),
  toastStack: document.querySelector("#toastStack"),
  appViews: [...document.querySelectorAll(".app-view")],
  dashboardHero: document.querySelector("#dashboard .hero"),
  heroPhoto: document.querySelector(".hero-photo"),
};

let mapModel = null;
let dashboardScrollGuardTimer = null;
let dashboardScrollGuardActive = false;

bootstrap();

function bootstrap() {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  renderStaticOptions();
  attachEvents();
  handleViewportChange();
  refreshAll();
  mountProvinceMap();
  activateView(window.location.hash || DEFAULT_VIEW_HASH);
  scheduleActiveViewReset();
}

function refreshAll() {
  syncProvinceDerivedFields();
  renderMetrics();
  renderPulse();
  renderFunnel();
  renderProvinceSummary();
  renderProvinceConfig();
  renderFilters();
  renderTable();
  updateHeroSignals();
  paintMap();
}

function renderStaticOptions() {
  populateSelect(nodes.statusInput, STATUS_OPTIONS);
  populateSelect(nodes.roleInput, ROLE_OPTIONS);
  populateSelect(nodes.ageRangeInput, AGE_RANGE_OPTIONS, true);
  populateSelect(nodes.sexInput, SEX_OPTIONS, true);
  populateSelect(nodes.responseWindowInput, RESPONSE_WINDOWS);
  populateSelect(nodes.availabilityInput, AVAILABILITY_OPTIONS);
  populateSelect(
    nodes.provinceInput,
    state.provincePlans.map((plan) => plan.province)
  );
  populateSelect(
    nodes.exteriorSectionInput,
    state.exteriorPlans.map((plan) => plan.seccional),
    true
  );
  renderSkillChips();
  renderNetworkCards();
  clearForm();
}

function attachEvents() {
  nodes.sidebarToggle.addEventListener("click", () => setSidebarOpen(true));
  nodes.sidebarBackdrop.addEventListener("click", () => setSidebarOpen(false));
  nodes.sidebarCollapse.addEventListener("click", toggleSidebarCollapsed);
  window.addEventListener("resize", handleViewportChange);
  window.addEventListener("hashchange", () => activateView(window.location.hash || DEFAULT_VIEW_HASH));
  window.addEventListener("load", scheduleActiveViewReset);
  window.addEventListener("pageshow", scheduleActiveViewReset);

  if (nodes.heroPhoto) {
    nodes.heroPhoto.addEventListener("load", scheduleDashboardHeroReset);
    if (nodes.heroPhoto.complete) {
      scheduleDashboardHeroReset();
    }
  }

  if (nodes.dashboardView) {
    nodes.dashboardView.addEventListener("scroll", handleDashboardGuardedScroll, { passive: true });
    ["wheel", "touchstart", "pointerdown", "keydown"].forEach((eventName) => {
      nodes.dashboardView.addEventListener(eventName, releaseDashboardScrollGuard, { passive: true });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      event.preventDefault();
      activateView(hash, { updateHash: true });
      if (link.classList.contains("side-link") && isMobileViewport()) {
        setSidebarOpen(false);
      }
    });
  });

  nodes.territoryScopeInput.addEventListener("change", handleTerritoryScopeChange);
  nodes.provinceInput.addEventListener("change", syncLocationFieldsFromProvince);
  nodes.exteriorSectionInput.addEventListener("change", syncLocationFieldsFromProvince);
  nodes.activistForm.addEventListener("submit", handleRecordSubmit);
  nodes.cedulaInput.addEventListener("blur", tryAutofillByCedula);
  nodes.cedulaInput.addEventListener("input", formatCedulaInput);
  nodes.clearFormBtn.addEventListener("click", () => {
    clearForm();
    toast("Formulario listo para un nuevo registro.", "success");
  });
  nodes.restoreDemoBtn.addEventListener("click", restoreDemoData);
  nodes.exportCsvBtn.addEventListener("click", exportRecordsCsv);
  nodes.exportJsonBtn.addEventListener("click", exportRecordsJson);
  nodes.exportTerritorialBtn.addEventListener("click", exportProvinceSummaryCsv);

  [nodes.searchInput, nodes.filterProvince, nodes.filterRole, nodes.filterStatus].forEach((input) => {
    input.addEventListener("input", renderTable);
    input.addEventListener("change", renderTable);
  });
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 860px)").matches;
}

function handleViewportChange() {
  if (!isMobileViewport()) {
    setSidebarOpen(false);
  }
}

function setSidebarOpen(open) {
  nodes.appShell.classList.toggle("sidebar-open", open && isMobileViewport());
  nodes.sidebarToggle.setAttribute("aria-expanded", String(open && isMobileViewport()));
}

function toggleSidebarCollapsed() {
  if (isMobileViewport()) {
    setSidebarOpen(false);
    return;
  }

  const collapsed = !nodes.appShell.classList.contains("sidebar-collapsed");
  nodes.appShell.classList.toggle("sidebar-collapsed", collapsed);
  nodes.sidebarCollapse.setAttribute("aria-expanded", String(!collapsed));
}

function setActiveNav(hash) {
  document.querySelectorAll(".side-link").forEach((link) => {
    link.classList.toggle("is-current", link.getAttribute("href") === hash);
  });
}

function currentTerritoryScope() {
  return nodes.territoryScopeInput.value || DOMESTIC_SCOPE;
}

function handleTerritoryScopeChange() {
  syncTerritoryScopeUI();
  syncLocationFieldsFromProvince();
}

function syncTerritoryScopeUI() {
  const isExterior = currentTerritoryScope() === EXTERIOR_SCOPE;
  nodes.provinceField.classList.toggle("hidden", isExterior);
  nodes.exteriorSectionField.classList.toggle("hidden", !isExterior);
  nodes.districtField.classList.toggle("hidden", isExterior);
  nodes.exteriorDistrictField.classList.toggle("hidden", !isExterior);
  nodes.territoryNameLabel.textContent = isExterior ? "Provincia" : "Provincia";
  nodes.districtFieldLabel.textContent = isExterior ? "Distrito Municipal" : "Distrito Municipal";
  nodes.provCoordinatorLabel.textContent = isExterior ? "Responsable seccional" : "Coordinador provincial";
  nodes.regionalCoordinatorLabel.textContent = isExterior ? "Coordinador de circunscripcion" : "Coordinador regional";
  nodes.macroCoordinatorLabel.textContent = isExterior ? "Enlace de exterior" : "Coordinador macroregional";
}

function activateView(hash, options = {}) {
  const requestedHash = normalizeHash(hash || DEFAULT_VIEW_HASH);
  if (options.updateHash && window.location.hash !== requestedHash) {
    window.location.hash = requestedHash;
    return;
  }

  const activeView = resolveViewElement(requestedHash);
  if (!activeView) return;

  nodes.appViews.forEach((view) => {
    const isActive = view === activeView;
    view.classList.toggle("is-active", isActive);
    view.hidden = !isActive;
  });

  setActiveNav(`#${activeView.id}`);
  syncModuleChrome(activeView);
  resetViewPosition(activeView, requestedHash);
}

function resolveViewElement(hash) {
  const normalizedHash = normalizeHash(hash);
  const targetId = normalizedHash.slice(1);
  const directMatch = targetId ? document.getElementById(targetId) : null;

  if (directMatch?.classList.contains("app-view")) {
    return directMatch;
  }

  const nestedMatch = directMatch?.closest(".app-view");
  if (nestedMatch) {
    return nestedMatch;
  }

  return document.querySelector(DEFAULT_VIEW_HASH);
}

function normalizeHash(hash) {
  if (!hash) return DEFAULT_VIEW_HASH;
  return hash.startsWith("#") ? hash : `#${hash}`;
}

function syncModuleChrome(view) {
  const isDashboardView = view.id === "dashboard";
  nodes.contentShell.classList.toggle("dashboard-mode", isDashboardView);
  nodes.moduleEyebrow.textContent = view.dataset.moduleEyebrow || "Centro de operaciones";
  nodes.moduleTitle.textContent = view.dataset.moduleTitle || "Plataforma nacional de activismo digital";
  nodes.moduleSummary.textContent =
    view.dataset.moduleSummary || "Selecciona un modulo para trabajar en una vista independiente.";
  nodes.moduleContextPill.textContent = view.dataset.modulePill || "Modulo activo";
}

function resetViewPosition(activeView, requestedHash) {
  const targetId = normalizeHash(requestedHash).slice(1);
  const targetNode = targetId ? document.getElementById(targetId) : null;

  window.requestAnimationFrame(() => {
    if (targetNode && targetNode !== activeView && activeView.contains(targetNode)) {
      targetNode.scrollIntoView({ block: "start" });
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  });
}

function scheduleActiveViewReset() {
  window.requestAnimationFrame(() => {
    const activeView = document.querySelector(".app-view.is-active");
    if (!activeView) return;

    resetViewPosition(activeView, `#${activeView.id}`);
  });
}

function scheduleDashboardHeroReset() {
  armDashboardScrollGuard();
  window.requestAnimationFrame(() => {
    forceDashboardHeroIntoView();
    window.requestAnimationFrame(() => forceDashboardHeroIntoView());
  });
}

function forceDashboardHeroIntoView() {
  const activeView = document.querySelector("#dashboard.app-view.is-active");
  if (!activeView || !nodes.dashboardHero) return;

  window.scrollTo({ top: 0, behavior: "auto" });
  nodes.mainLayout?.scrollTo({ top: 0, behavior: "auto" });
  activeView.scrollTo({ top: 0, behavior: "auto" });
  nodes.dashboardHero.scrollIntoView({ block: "start", inline: "nearest" });
}

function armDashboardScrollGuard() {
  if (!nodes.dashboardView) return;

  dashboardScrollGuardActive = true;
  window.clearTimeout(dashboardScrollGuardTimer);
  dashboardScrollGuardTimer = window.setTimeout(() => {
    dashboardScrollGuardActive = false;
  }, 1800);
}

function releaseDashboardScrollGuard() {
  dashboardScrollGuardActive = false;
  window.clearTimeout(dashboardScrollGuardTimer);
}

function handleDashboardGuardedScroll() {
  if (!dashboardScrollGuardActive || !nodes.dashboardView?.classList.contains("is-active")) {
    return;
  }

  if (nodes.dashboardView.scrollTop <= 0) {
    return;
  }

  nodes.dashboardView.scrollTop = 0;
}

function handleRecordSubmit(event) {
  event.preventDefault();
  const payload = collectFormData();
  if (!payload.cedula || !payload.firstName || !payload.lastName || !getRecordTerritoryName(payload)) {
    toast("Completa cedula, nombre, apellido y el territorio o seccional antes de guardar.", "warning");
    return;
  }

  const existingIndex = state.records.findIndex((record) => record.id === payload.id);
  const duplicateCedulaIndex = state.records.findIndex(
    (record) => record.cedula === payload.cedula && record.id !== payload.id
  );

  if (duplicateCedulaIndex >= 0) {
    toast("Esa cedula ya existe en la base. Se cargó el registro para edición.", "warning");
    loadRecordIntoForm(state.records[duplicateCedulaIndex]);
    return;
  }

  if (existingIndex >= 0) {
    state.records[existingIndex] = payload;
    toast("Registro actualizado en la base RAD-C28.", "success");
  } else {
    state.records.unshift(payload);
    toast("Nuevo activista guardado correctamente.", "success");
  }

  mergeRecordCoordinators(payload);
  saveState();
  refreshAll();
  clearForm();
}

function collectFormData() {
  const id = nodes.recordId.value || crypto.randomUUID();
  const existingRecord = findExistingRecord(id);
  const territoryScope = currentTerritoryScope();
  const isExterior = territoryScope === EXTERIOR_SCOPE;
  const provincePlan = getProvincePlan(nodes.provinceInput.value);
  const exteriorPlan = getExteriorPlan(valueOf("exteriorSectionInput"));
  const skills = [...document.querySelectorAll(".skill-chip input:checked")].map((input) => input.value);
  const networks = Object.fromEntries(
    NETWORK_CONFIG.map((networkItem) => {
      const prefix = networkItem.key;
      return [
        prefix,
        {
          handle: valueOf(`${prefix}Handle`),
          followers: numberValueOf(`${prefix}Followers`),
          active: checkedOf(`${prefix}Active`),
        },
      ];
    })
  );

  return {
    id,
    cedula: normalizeCedula(nodes.cedulaInput.value),
    firstName: valueOf("firstNameInput"),
    lastName: valueOf("lastNameInput"),
    phone: valueOf("phoneInput"),
    whatsapp: valueOf("whatsappInput"),
    email: valueOf("emailInput"),
    ageRange: valueOf("ageRangeInput"),
    sex: valueOf("sexInput"),
    territoryScope,
    status: valueOf("statusInput"),
    province: isExterior ? "" : nodes.provinceInput.value,
    exteriorSection: isExterior ? valueOf("exteriorSectionInput") : "",
    exteriorCircunscription: isExterior ? valueOf("exteriorDistrictInput") : "",
    municipality: valueOf("municipalityInput"),
    districtMunicipal: isExterior ? "" : valueOf("districtInput"),
    region: isExterior ? exteriorPlan?.zone || valueOf("regionInput") : provincePlan?.region || valueOf("regionInput"),
    macroRegion: isExterior
      ? exteriorPlan?.macroRegion || valueOf("macroRegionInput")
      : provincePlan?.macroRegion || valueOf("macroRegionInput"),
    role: existingRecord ? valueOf("roleInput") || existingRecord.role || ROLE_OPTIONS[0] : ROLE_OPTIONS[0],
    provincialCoordinator: valueOf("provCoordinatorInput"),
    regionalCoordinator: valueOf("regionalCoordinatorInput"),
    macroCoordinator: valueOf("macroCoordinatorInput"),
    tookInduction: checkedOf("inductionInput"),
    inductionDate: valueOf("inductionDateInput"),
    c28Registered: checkedOf("c28Input"),
    responseWindow: valueOf("responseWindowInput"),
    availability: valueOf("availabilityInput"),
    pollSquad: checkedOf("pollSquadInput"),
    skills,
    networks,
    notes: valueOf("notesInput"),
    createdAt: existingRecord?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function getRecordTerritoryScope(record) {
  return record.territoryScope || DOMESTIC_SCOPE;
}

function getRecordTerritoryName(record) {
  return getRecordTerritoryScope(record) === EXTERIOR_SCOPE
    ? record.exteriorSection || ""
    : record.province || "";
}

function getRecordTerritorySubtitle(record) {
  if (getRecordTerritoryScope(record) === EXTERIOR_SCOPE) {
    return record.exteriorCircunscription || record.municipality || "Exterior";
  }
  return record.municipality || "Sin municipio";
}

function renderMetrics() {
  const metrics = computeDashboardMetrics();
  const cards = [
    {
      label: "Registros totales",
      value: metrics.totalRecords,
      caption: "registros en la base local",
      trend: `${metrics.activeRecords} activos | ${metrics.pendingRecords} pendientes`,
    },
    {
      label: "Alcance potencial",
      value: formatCompact(metrics.totalReach),
      caption: "seguidores acumulados en redes activas",
      trend: `${metrics.multiNetworkPercent}% con 3 redes o mas`,
    },
    {
      label: "Induccion",
      value: `${metrics.inductionRate}%`,
      caption: "de la base ya tomo el taller",
      trend: `${metrics.inductedCount} activistas listos`,
    },
    {
      label: "Inscripcion C28",
      value: `${metrics.c28Rate}%`,
      caption: "ya estan registrados en la plataforma madre",
      trend: `${metrics.c28Count} altas confirmadas`,
    },
    {
      type: "sex-balance",
      label: "Participacion por sexo",
      maleCount: metrics.maleCount,
      femaleCount: metrics.femaleCount,
      maleRate: metrics.maleRate,
      femaleRate: metrics.femaleRate,
      caption: metrics.identifiedSexCount
        ? metrics.identifiedSexCount === 1
          ? "1 registro con sexo definido"
          : `${metrics.identifiedSexCount} registros con sexo definido`
        : "Aun no hay registros con sexo definido",
      trend: metrics.unspecifiedSexCount
        ? metrics.unspecifiedSexCount === 1
          ? "1 registro sin especificar"
          : `${metrics.unspecifiedSexCount} registros sin especificar`
        : "Base completa identificada",
    },
    {
      label: "Provincias en verde",
      value: metrics.greenProvinces,
      caption: "territorios con avance solido",
      trend: `${metrics.yellowProvinces} amarillas | ${metrics.redProvinces} rojas`,
    },
  ];

  nodes.metricGrid.innerHTML = cards
    .map(
      (card) =>
        card.type === "sex-balance"
          ? `
              <article class="metric-card metric-card-sex">
                <p class="eyebrow">${card.label}</p>
                <div class="metric-sex-row">
                  <div class="metric-sex-chip metric-sex-chip-male">
                    <span>Hombres</span>
                    <strong>${card.maleRate}%</strong>
                    <small>${card.maleCount}</small>
                  </div>
                  <div class="metric-sex-chip metric-sex-chip-female">
                    <span>Mujeres</span>
                    <strong>${card.femaleRate}%</strong>
                    <small>${card.femaleCount}</small>
                  </div>
                </div>
                <div class="metric-sex-bar" aria-hidden="true">
                  <span class="metric-sex-fill metric-sex-fill-male" style="width: ${card.maleRate}%"></span>
                  <span class="metric-sex-fill metric-sex-fill-female" style="width: ${card.femaleRate}%"></span>
                </div>
                <div class="metric-caption-card">${card.caption}</div>
                <div class="metric-trend">${card.trend}</div>
              </article>
            `
          : `
              <article class="metric-card">
                <p class="eyebrow">${card.label}</p>
                <strong>${card.value}</strong>
                <span>${card.caption}</span>
                <div class="metric-trend">${card.trend}</div>
              </article>
            `
    )
    .join("");
}

function updateHeroSignals() {
  const metrics = computeDashboardMetrics();
  const signals = [
    {
      label: "Cobertura territorial",
      value: `${metrics.coveredProvinces}/${state.provincePlans.length}`,
      caption: "provincias con al menos un nodo activo",
    },
    {
      label: "Sentimiento y contencion",
      value: `${metrics.sentimentSquadRate}%`,
      caption: "con capacidad de moderacion o comentarios estrategicos",
    },
    {
      label: "Listos en 15 min",
      value: `${metrics.rapidResponseCount}`,
      caption: "para activar temprano desde grupos y cascadas",
    },
  ];

  nodes.heroSignals.innerHTML = signals
    .map(
      (signal) => `
        <div class="signal-card">
          <p class="eyebrow">${signal.label}</p>
          <strong>${signal.value}</strong>
          <span>${signal.caption}</span>
        </div>
      `
    )
    .join("");

  nodes.heroReach.textContent = formatCompact(metrics.totalReach);
  nodes.heroResponse.textContent = `${metrics.rapidResponseRate}%`;
}

function renderPulse() {
  const pulse = buildPulseMetrics();
  nodes.pulseList.innerHTML = pulse
    .map(
      (item) => `
        <div class="pulse-item">
          <div class="pulse-title-row">
            <strong>${item.label}</strong>
            <span>${item.value}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-value" style="width:${item.value}%"></div>
          </div>
          <small class="pulse-caption">${item.caption}</small>
        </div>
      `
    )
    .join("");
}

function renderFunnel() {
  const metrics = computeDashboardMetrics();
  const items = [
    { label: "Base captada", value: metrics.totalRecords, percent: 100, caption: "total de registros en la plataforma" },
    { label: "Induccion completada", value: metrics.inductedCount, percent: metrics.inductionRate, caption: "ya conocen dinamica y protocolo de activacion" },
    { label: "Inscritos en C28", value: metrics.c28Count, percent: metrics.c28Rate, caption: "alineados con la plataforma madre del proyecto" },
    { label: "Respuesta en 15 min", value: metrics.rapidResponseCount, percent: metrics.rapidResponseRate, caption: "aptos para respuesta temprana" },
    { label: "Escuadra de sondeos", value: metrics.pollSquadCount, percent: metrics.pollSquadRate, caption: "disponibles para votaciones y sondeos digitales" },
  ];

  nodes.funnelGrid.innerHTML = items
    .map(
      (item) => `
        <article class="funnel-card">
          <div class="ring" style="--ring-fill:${item.percent * 3.6}deg">
            <span>${item.percent}%</span>
          </div>
          <div>
            <strong>${item.label}</strong>
            <div>${item.value}</div>
            <small>${item.caption}</small>
          </div>
        </article>
      `
    )
    .join("");
}

function renderProvinceSummary() {
  const summaries = buildProvinceSummaries().sort((a, b) => b.score - a.score);
  nodes.provinceSummaryTable.innerHTML = [
    `
      <div class="summary-row">
        <strong>Provincia</strong>
        <strong>Puntaje</strong>
        <strong>Base minima</strong>
        <strong>Base</strong>
        <strong>Alcance</strong>
        <strong>Estado</strong>
      </div>
    `,
    ...summaries.map(
      (item) => `
        <button class="summary-row province-summary-trigger" data-province="${item.province}">
          <div>
            <strong>${item.province}</strong>
            <span class="table-muted">${item.region} | ${item.macroRegion}</span>
          </div>
          <div>${item.score}%</div>
          <div>${item.targetActivists}</div>
          <div>${item.activists}</div>
          <div>${formatCompact(item.totalFollowers)}</div>
          <div><span class="score-chip ${statusClass(item.status)}">${item.status}</span></div>
        </button>
      `
    ),
  ].join("");

  document.querySelectorAll(".province-summary-trigger").forEach((button) => {
    button.addEventListener("click", () => selectProvince(button.dataset.province));
  });
}

function renderProvinceConfig() {
  const provinceMarkup = buildProvincePlannerMarkup();
  const exteriorMarkup = buildExteriorPlannerMarkup();

  nodes.provinceConfigTable.innerHTML = `
    <div class="planner-national-card">
      <div>
        <p class="eyebrow eyebrow-bright">Coordinacion nacional</p>
        <h4>Comando central de la RAD-C28</h4>
        <p>Responsables nacionales para la direccion general, la operacion digital, los contenidos y los sondeos.</p>
      </div>

      <div class="planner-national-grid">
        <div class="planner-national-field">
          <label>
            Coordinador nacional general
            <input
              value="${escapeHtml(state.nationalCoordination.nationalCoordinator || "")}"
              data-national-input="nationalCoordinator"
            />
          </label>
        </div>
        <div class="planner-national-field">
          <label>
            Subcoordinador nacional
            <input
              value="${escapeHtml(state.nationalCoordination.deputyNationalCoordinator || "")}"
              data-national-input="deputyNationalCoordinator"
            />
          </label>
        </div>
        <div class="planner-national-field">
          <label>
            Responsable de operaciones digitales
            <input
              value="${escapeHtml(state.nationalCoordination.operationsCoordinator || "")}"
              data-national-input="operationsCoordinator"
            />
          </label>
        </div>
        <div class="planner-national-field">
          <label>
            Responsable de contenidos
            <input
              value="${escapeHtml(state.nationalCoordination.contentCoordinator || "")}"
              data-national-input="contentCoordinator"
            />
          </label>
        </div>
        <div class="planner-national-field">
          <label>
            Responsable de sondeos
            <input
              value="${escapeHtml(state.nationalCoordination.pollsCoordinator || "")}"
              data-national-input="pollsCoordinator"
            />
          </label>
        </div>
      </div>
    </div>

    <div class="planner-role-guide">
      <strong>Como leer esta matriz:</strong>
      <span><b>Base minima</b>: es la cantidad objetivo para operar; si la superas, la estructura no cambia.</span>
      <span><b>Responsable provincial o seccional</b>: dirige la red en su territorio.</span>
      <span><b>Coordinador regional o de circunscripcion</b>: acompaña varias demarcaciones dentro de su sistema.</span>
      <span><b>Enlace macroregional o de exterior</b>: articula la estrategia del bloque completo.</span>
    </div>

    <div class="planner-board-stack">
      ${exteriorMarkup}
      ${provinceMarkup}
    </div>
  `;

  nodes.provinceConfigTable.querySelectorAll("[data-plan-input]").forEach((input) => {
    input.addEventListener("change", handleProvincePlanChange);
  });

  nodes.provinceConfigTable.querySelectorAll("[data-exterior-plan-input]").forEach((input) => {
    input.addEventListener("change", handleExteriorPlanChange);
  });

  nodes.provinceConfigTable.querySelectorAll("[data-national-input]").forEach((input) => {
    input.addEventListener("change", handleNationalCoordinationChange);
  });
}

function buildProvincePlannerMarkup() {
  const groupedPlans = state.provincePlans.reduce((groups, plan) => {
    const key = plan.macroRegion;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(plan);
    return groups;
  }, new Map());

  const groupMarkup = [...groupedPlans.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "es"))
    .map(([macroRegion, plans], index) => {
      const planCards = plans.map((plan) => ({
        plan,
        summary: getProvinceSummary(plan.province),
      }));
      const groupTarget = planCards.reduce((sum, item) => sum + item.summary.targetActivists, 0);
      const groupCurrent = planCards.reduce((sum, item) => sum + item.summary.activists, 0);
      const groupReach = planCards.reduce((sum, item) => sum + item.summary.totalFollowers, 0);
      const groupAverageScore = Math.round(
        planCards.reduce((sum, item) => sum + item.summary.score, 0) / Math.max(planCards.length, 1)
      );
      const groupReady = planCards.reduce((sum, item) => sum + item.summary.rapidResponse, 0);
      const groupCoverage = clamp(percentage(groupCurrent, groupTarget));

      return `
        <details class="planner-group" ${index === 0 ? "open" : ""}>
          <summary class="planner-group-summary">
            <div class="planner-group-summary-row">
              <div class="planner-group-head">
                <div>
                  <p class="eyebrow">${macroRegion}</p>
                  <h4>Macroregion ${macroRegion}</h4>
                </div>
                <div class="planner-group-meta">${groupCurrent}/${groupTarget} activistas sobre base minima</div>
              </div>
              <span class="planner-group-icon" aria-hidden="true">v</span>
            </div>

            <div class="planner-group-chip-row">
              <span class="planner-group-chip">${planCards.length} provincias</span>
              <span class="planner-group-chip">${groupCoverage}% cobertura</span>
              <span class="planner-group-chip">${formatCompact(groupReach)} alcance</span>
              <span class="planner-group-chip">${groupAverageScore}% avance promedio</span>
            </div>
          </summary>

          <div class="planner-group-body">
            <div class="planner-macro-metrics">
              <div class="planner-macro-stat">
                <span>Provincias activas</span>
                <strong>${planCards.length}</strong>
              </div>
              <div class="planner-macro-stat">
                <span>Base actual</span>
                <strong>${groupCurrent}/${groupTarget}</strong>
              </div>
              <div class="planner-macro-stat">
                <span>Alcance conjunto</span>
                <strong>${formatCompact(groupReach)}</strong>
              </div>
              <div class="planner-macro-stat">
                <span>Listos en 15 min</span>
                <strong>${groupReady}</strong>
              </div>
            </div>

            <div class="planner-group-grid">
              ${planCards
                .map(({ plan, summary }) => `
                    <article class="planner-card">
                      <div class="planner-card-head">
                        <div>
                          <h5>${plan.province}</h5>
                          <p>${plan.region} | ${plan.macroRegion}</p>
                        </div>
                        <span class="score-chip ${statusClass(summary.status)}">${summary.status}</span>
                      </div>

                      <div class="planner-goal-grid">
                        <div class="planner-input">
                          <label>
                            Municipios o DM a cubrir
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value="${plan.plannedCells}"
                              data-plan-input="plannedCells"
                              data-province="${plan.province}"
                            />
                          </label>
                        </div>
                        <div class="planner-input">
                          <label>
                            Activistas por territorio
                            <input
                              type="number"
                              min="5"
                              step="5"
                              value="${plan.unitGoal}"
                              data-plan-input="unitGoal"
                              data-province="${plan.province}"
                            />
                          </label>
                        </div>
                        <div class="planner-inline-stat">
                          <span>Base minima provincial</span>
                          <strong>${summary.targetActivists}</strong>
                        </div>
                      </div>

                      <div class="planner-goal-grid">
                        <div class="planner-inline-stat">
                          <span>Activistas registrados</span>
                          <strong>${summary.activists}</strong>
                        </div>
                        <div class="planner-inline-stat">
                          <span>Alcance</span>
                          <strong>${formatCompact(summary.totalFollowers)}</strong>
                        </div>
                        <div class="planner-inline-stat">
                          <span>Avance</span>
                          <strong>${summary.score}%</strong>
                        </div>
                      </div>

                      <div class="planner-coordinator-grid">
                        <div class="planner-input">
                          <label>
                            Responsable provincial
                            <input
                              value="${escapeHtml(plan.provincialCoordinator || "")}"
                              data-plan-input="provincialCoordinator"
                              data-province="${plan.province}"
                            />
                          </label>
                        </div>
                        <div class="planner-input">
                          <label>
                            Supervisor regional
                            <input
                              value="${escapeHtml(plan.regionalCoordinator || "")}"
                              data-plan-input="regionalCoordinator"
                              data-province="${plan.province}"
                            />
                          </label>
                        </div>
                        <div class="planner-input">
                          <label>
                            Enlace macroregional
                            <input
                              value="${escapeHtml(plan.macroCoordinator || "")}"
                              data-plan-input="macroCoordinator"
                              data-province="${plan.province}"
                            />
                          </label>
                        </div>
                      </div>
                    </article>
                  `)
                .join("")}
            </div>
          </div>
        </details>
      `;
    })
    .join("");

  return `
    <section class="planner-subboard">
      <div class="planner-subboard-head">
        <div>
          <p class="eyebrow">Republica Dominicana</p>
          <h4>Bloque provincial</h4>
        </div>
        <span class="planner-group-chip">${state.provincePlans.length} provincias</span>
      </div>
      <div class="planner-board">${groupMarkup}</div>
    </section>
  `;
}

function buildExteriorPlannerMarkup() {
  const groupedPlans = state.exteriorPlans.reduce((groups, plan) => {
    const key = plan.zone;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(plan);
    return groups;
  }, new Map());

  const groupMarkup = [...groupedPlans.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "es"))
    .map(([zone, plans], index) => {
      const planCards = plans.map((plan) => ({
        plan,
        summary: getExteriorSummary(plan.seccional),
      }));
      const groupTarget = planCards.reduce((sum, item) => sum + item.summary.targetActivists, 0);
      const groupCurrent = planCards.reduce((sum, item) => sum + item.summary.activists, 0);
      const groupReach = planCards.reduce((sum, item) => sum + item.summary.totalFollowers, 0);
      const groupAverageScore = Math.round(
        planCards.reduce((sum, item) => sum + item.summary.score, 0) / Math.max(planCards.length, 1)
      );
      const groupCoverage = clamp(percentage(groupCurrent, groupTarget));
      const groupCircunscriptions = planCards.reduce(
        (sum, item) => sum + (item.plan.circunscriptionCount || 0),
        0
      );

      return `
        <details class="planner-group" ${index === 0 ? "open" : ""}>
          <summary class="planner-group-summary">
            <div class="planner-group-summary-row">
              <div class="planner-group-head">
                <div>
                  <p class="eyebrow">${zone}</p>
                  <h4>Exterior ${zone}</h4>
                </div>
                <div class="planner-group-meta">${groupCurrent}/${groupTarget} activistas sobre base minima</div>
              </div>
              <span class="planner-group-icon" aria-hidden="true">v</span>
            </div>

            <div class="planner-group-chip-row">
              <span class="planner-group-chip">${planCards.length} seccionales</span>
              <span class="planner-group-chip">${groupCircunscriptions} circunscripciones</span>
              <span class="planner-group-chip">${groupCoverage}% cobertura</span>
              <span class="planner-group-chip">${groupAverageScore}% avance promedio</span>
            </div>
          </summary>

          <div class="planner-group-body">
            <div class="planner-macro-metrics">
              <div class="planner-macro-stat">
                <span>Seccionales activas</span>
                <strong>${planCards.length}</strong>
              </div>
              <div class="planner-macro-stat">
                <span>Base actual</span>
                <strong>${groupCurrent}/${groupTarget}</strong>
              </div>
              <div class="planner-macro-stat">
                <span>Alcance conjunto</span>
                <strong>${formatCompact(groupReach)}</strong>
              </div>
              <div class="planner-macro-stat">
                <span>Circunscripciones</span>
                <strong>${groupCircunscriptions}</strong>
              </div>
            </div>

            <div class="planner-group-grid">
              ${planCards
                .map(({ plan, summary }) => `
                    <article class="planner-card">
                      <div class="planner-card-head">
                        <div>
                          <h5>${plan.seccional}</h5>
                          <p>${plan.zone} | ${plan.macroRegion}</p>
                        </div>
                        <span class="score-chip ${statusClass(summary.status)}">${summary.status}</span>
                      </div>

                      <div class="planner-goal-grid">
                        <div class="planner-input">
                          <label>
                            Circunscripciones activas
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value="${plan.circunscriptionCount}"
                              data-exterior-plan-input="circunscriptionCount"
                              data-seccional="${plan.seccional}"
                            />
                          </label>
                        </div>
                        <div class="planner-inline-stat">
                          <span>Directiva seccional</span>
                          <strong>${plan.sectionalDirectiveGoal}</strong>
                        </div>
                        <div class="planner-inline-stat">
                          <span>Base minima total</span>
                          <strong>${summary.targetActivists}</strong>
                        </div>
                      </div>

                      <div class="planner-goal-grid">
                        <div class="planner-inline-stat">
                          <span>Activistas registrados</span>
                          <strong>${summary.activists}</strong>
                        </div>
                        <div class="planner-inline-stat">
                          <span>Alcance</span>
                          <strong>${formatCompact(summary.totalFollowers)}</strong>
                        </div>
                        <div class="planner-inline-stat">
                          <span>Avance</span>
                          <strong>${summary.score}%</strong>
                        </div>
                      </div>

                      <div class="planner-coordinator-grid">
                        <div class="planner-input">
                          <label>
                            Responsable seccional
                            <input
                              value="${escapeHtml(plan.provincialCoordinator || "")}"
                              data-exterior-plan-input="provincialCoordinator"
                              data-seccional="${plan.seccional}"
                            />
                          </label>
                        </div>
                        <div class="planner-input">
                          <label>
                            Coordinador de circunscripcion
                            <input
                              value="${escapeHtml(plan.regionalCoordinator || "")}"
                              data-exterior-plan-input="regionalCoordinator"
                              data-seccional="${plan.seccional}"
                            />
                          </label>
                        </div>
                        <div class="planner-input">
                          <label>
                            Enlace de exterior
                            <input
                              value="${escapeHtml(plan.macroCoordinator || "")}"
                              data-exterior-plan-input="macroCoordinator"
                              data-seccional="${plan.seccional}"
                            />
                          </label>
                        </div>
                      </div>
                    </article>
                  `)
                .join("")}
            </div>
          </div>
        </details>
      `;
    })
    .join("");

  return `
    <section class="planner-subboard">
      <div class="planner-subboard-head">
        <div>
          <p class="eyebrow">Seccionales del exterior</p>
          <h4>Bloque internacional</h4>
        </div>
        <span class="planner-group-chip">${state.exteriorPlans.length} seccionales</span>
      </div>
      <div class="planner-board">${groupMarkup}</div>
    </section>
  `;
}

function renderFilters() {
  populateSelect(
    nodes.filterProvince,
    [
      "Todas",
      ...state.provincePlans.map((plan) => plan.province),
      ...state.exteriorPlans.map((plan) => plan.seccional),
    ],
    false
  );
  populateSelect(nodes.filterRole, ["Todos", ...ROLE_OPTIONS], false);
  populateSelect(nodes.filterStatus, ["Todos", ...STATUS_OPTIONS], false);
}

function renderTable() {
  const filtered = filterRecords();
  nodes.recordCount.textContent = `${filtered.length} registros`;
  nodes.databaseStatus.textContent = filtered.length
    ? "La tabla refleja los filtros activos."
    : "No hay registros que coincidan con la busqueda actual.";

  if (!filtered.length) {
    nodes.recordTableBody.innerHTML = `
      <tr>
        <td colspan="9" class="table-muted">No hay registros disponibles para estos filtros.</td>
      </tr>
    `;
    return;
  }

  nodes.recordTableBody.innerHTML = filtered
    .map((record) => {
      const reach = totalFollowers(record.networks);
      return `
        <tr>
          <td class="record-name">
            <strong>${record.firstName} ${record.lastName}</strong>
            <span>${record.cedula}</span>
          </td>
          <td>
            <strong>${getRecordTerritoryName(record)}</strong>
            <span class="table-muted">${getRecordTerritorySubtitle(record)}</span>
          </td>
          <td>${record.role}</td>
          <td>${record.status}</td>
          <td>${formatCompact(reach)}</td>
          <td>${record.tookInduction ? "Si" : "No"}</td>
          <td>${record.c28Registered ? "Si" : "No"}</td>
          <td>${record.responseWindow}</td>
          <td>
            <div class="row-actions">
              <button class="ghost-button" type="button" data-edit-record="${record.id}">Editar</button>
              <button class="danger-button" type="button" data-delete-record="${record.id}">Eliminar</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  nodes.recordTableBody.querySelectorAll("[data-edit-record]").forEach((button) => {
    button.addEventListener("click", () => {
      const record = state.records.find((item) => item.id === button.dataset.editRecord);
      if (record) {
        loadRecordIntoForm(record);
        window.location.hash = "#registro";
      }
    });
  });

  nodes.recordTableBody.querySelectorAll("[data-delete-record]").forEach((button) => {
    button.addEventListener("click", () => deleteRecord(button.dataset.deleteRecord));
  });
}

function handleProvincePlanChange(event) {
  const province = event.target.dataset.province;
  const field = event.target.dataset.planInput;
  const plan = getProvincePlan(province);
  if (!plan) return;

  const value = field === "plannedCells" || field === "unitGoal" ? Number(event.target.value || 0) : event.target.value.trim();
  plan[field] = value;
  saveState();
  refreshAll();
}

function handleExteriorPlanChange(event) {
  const seccional = event.target.dataset.seccional;
  const field = event.target.dataset.exteriorPlanInput;
  const plan = getExteriorPlan(seccional);
  if (!plan) return;

  const value = field === "circunscriptionCount" ? Number(event.target.value || 0) : event.target.value.trim();
  plan[field] = value;
  saveState();
  refreshAll();
}

function handleNationalCoordinationChange(event) {
  const field = event.target.dataset.nationalInput;
  if (!field) return;
  state.nationalCoordination[field] = event.target.value.trim();
  saveState();
}

function tryAutofillByCedula() {
  const cedula = normalizeCedula(nodes.cedulaInput.value);
  if (!cedula || cedula.length !== 13) {
    nodes.autofillStatus.textContent = "Cedula sin validar";
    return;
  }

  const existing = state.records.find((record) => record.cedula === cedula);
  if (existing) {
    loadRecordIntoForm(existing);
    nodes.autofillStatus.textContent = "Cedula encontrada en la base";
    toast("Se cargó el registro existente para edición.", "success");
    return;
  }

  const directory = DIRECTORY_SEED.find((record) => record.cedula === cedula);
  if (!directory) {
    nodes.autofillStatus.textContent = "Sin coincidencias locales";
    toast("No hubo coincidencias en el directorio local. Puedes completar manualmente.", "warning");
    return;
  }

  loadDirectoryIntoForm(directory);
  nodes.autofillStatus.textContent = "Datos autocompletados";
  toast("Datos personales cargados desde el directorio local.", "success");
}

function formatCedulaInput() {
  const raw = nodes.cedulaInput.value.replace(/\D/g, "").slice(0, 11);
  const chunks = [raw.slice(0, 3), raw.slice(3, 10), raw.slice(10, 11)].filter(Boolean);
  nodes.cedulaInput.value = chunks.join("-");
}

function syncLocationFieldsFromProvince() {
  if (currentTerritoryScope() === EXTERIOR_SCOPE) {
    const plan = getExteriorPlan(nodes.exteriorSectionInput.value);
    nodes.regionInput.value = plan?.zone || "";
    nodes.macroRegionInput.value = plan?.macroRegion || "Exterior";
    return;
  }

  const plan = getProvincePlan(nodes.provinceInput.value);
  nodes.regionInput.value = plan?.region || "";
  nodes.macroRegionInput.value = plan?.macroRegion || "";
}

function syncProvinceDerivedFields() {
  state.records = state.records.map((record) => {
    if (getRecordTerritoryScope(record) === EXTERIOR_SCOPE) {
      const plan = getExteriorPlan(record.exteriorSection);
      return {
        ...record,
        region: plan?.zone || record.region || "",
        macroRegion: plan?.macroRegion || record.macroRegion || "Exterior",
      };
    }

    const plan = getProvincePlan(record.province);
    return {
      ...record,
      region: plan?.region || record.region || "",
      macroRegion: plan?.macroRegion || record.macroRegion || "",
    };
  });
  saveState();
}

function loadRecordIntoForm(record) {
  nodes.recordId.value = record.id;
  setValue("territoryScopeInput", getRecordTerritoryScope(record));
  syncTerritoryScopeUI();
  syncAdministrativeRoleUI(true);
  nodes.cedulaInput.value = record.cedula;
  setValue("firstNameInput", record.firstName);
  setValue("lastNameInput", record.lastName);
  setValue("phoneInput", record.phone);
  setValue("whatsappInput", record.whatsapp);
  setValue("emailInput", record.email);
  setValue("ageRangeInput", record.ageRange);
  setValue("sexInput", record.sex);
  setValue("statusInput", record.status);
  setValue("provinceInput", record.province);
  setValue("exteriorSectionInput", record.exteriorSection || "");
  setValue("exteriorDistrictInput", record.exteriorCircunscription || "");
  syncLocationFieldsFromProvince();
  setValue("municipalityInput", record.municipality);
  setValue("districtInput", record.districtMunicipal);
  setValue("roleInput", record.role);
  setValue("provCoordinatorInput", record.provincialCoordinator);
  setValue("regionalCoordinatorInput", record.regionalCoordinator);
  setValue("macroCoordinatorInput", record.macroCoordinator);
  setChecked("inductionInput", record.tookInduction);
  setValue("inductionDateInput", record.inductionDate);
  setChecked("c28Input", record.c28Registered);
  setValue("responseWindowInput", record.responseWindow);
  setValue("availabilityInput", record.availability);
  setChecked("pollSquadInput", record.pollSquad);
  setValue("notesInput", record.notes);

  document.querySelectorAll(".skill-chip input").forEach((input) => {
    input.checked = record.skills.includes(input.value);
  });

  NETWORK_CONFIG.forEach((networkItem) => {
    const networkState = record.networks?.[networkItem.key] || network("", 0, false);
    setValue(`${networkItem.key}Handle`, networkState.handle);
    setValue(`${networkItem.key}Followers`, networkState.followers);
    setChecked(`${networkItem.key}Active`, networkState.active);
  });
}

function loadDirectoryIntoForm(directory) {
  nodes.recordId.value = "";
  setValue("territoryScopeInput", DOMESTIC_SCOPE);
  syncTerritoryScopeUI();
  syncAdministrativeRoleUI(false);
  setValue("firstNameInput", directory.firstName);
  setValue("lastNameInput", directory.lastName);
  setValue("phoneInput", directory.phone || "");
  setValue("whatsappInput", directory.whatsapp || "");
  setValue("emailInput", directory.email || "");
  setValue("provinceInput", directory.province);
  setValue("exteriorSectionInput", "");
  setValue("exteriorDistrictInput", "");
  setValue("municipalityInput", directory.municipality || "");
  setValue("districtInput", directory.districtMunicipal || "");
  syncLocationFieldsFromProvince();
}

function clearForm() {
  nodes.activistForm.reset();
  nodes.recordId.value = "";
  nodes.cedulaInput.value = "";
  setValue("territoryScopeInput", DOMESTIC_SCOPE);
  syncTerritoryScopeUI();
  syncAdministrativeRoleUI(false);
  nodes.autofillStatus.textContent = "Cedula sin validar";
  setValue("statusInput", STATUS_OPTIONS[0]);
  setValue("responseWindowInput", RESPONSE_WINDOWS[1]);
  setValue("availabilityInput", AVAILABILITY_OPTIONS[0]);
  setValue("ageRangeInput", "");
  setValue("sexInput", "");
  setValue("provinceInput", state.provincePlans[0]?.province || "");
  setValue("exteriorSectionInput", "");
  setValue("exteriorDistrictInput", "");
  syncLocationFieldsFromProvince();
  document.querySelectorAll(".skill-chip input").forEach((input) => {
    input.checked = false;
  });
}

function syncAdministrativeRoleUI(isEditingExisting) {
  nodes.adminRoleSection.classList.toggle("hidden", !isEditingExisting);
  setValue("roleInput", ROLE_OPTIONS[0]);
}

function restoreDemoData() {
  state.records = structuredClone(DEMO_RECORDS);
  state.provincePlans = buildDefaultProvincePlans();
  state.exteriorPlans = buildDefaultExteriorPlans();
  state.nationalCoordination = structuredClone(DEFAULT_NATIONAL_COORDINATION);
  mergeRecordCoordinatorsIntoPlans();
  saveState();
  refreshAll();
  clearForm();
  toast(`La demo base de RAD-C28 fue restaurada con ${state.records.length} activistas.`, "success");
}

function deleteRecord(recordId) {
  const record = state.records.find((item) => item.id === recordId);
  if (!record) return;

  const confirmed = window.confirm(`¿Eliminar a ${record.firstName} ${record.lastName} de la base local?`);
  if (!confirmed) return;

  state.records = state.records.filter((item) => item.id !== recordId);
  saveState();
  refreshAll();
  toast("Registro eliminado de la base local.", "warning");
}

function filterRecords() {
  const query = nodes.searchInput.value.trim().toLowerCase();
  const province = nodes.filterProvince.value;
  const role = nodes.filterRole.value;
  const status = nodes.filterStatus.value;

  return [...state.records]
    .filter((record) => (province && province !== "Todas" ? getRecordTerritoryName(record) === province : true))
    .filter((record) => (role && role !== "Todos" ? record.role === role : true))
    .filter((record) => (status && status !== "Todos" ? record.status === status : true))
    .filter((record) => {
      if (!query) return true;
      const searchable = [
        record.firstName,
        record.lastName,
        record.cedula,
        record.province,
        record.exteriorSection,
        record.exteriorCircunscription,
        record.municipality,
        record.sex,
        record.ageRange,
        record.provincialCoordinator,
        record.regionalCoordinator,
        record.macroCoordinator,
      ]
        .join(" ")
        .toLowerCase();
      return searchable.includes(query);
    })
    .sort((a, b) => new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf());
}

function computeDashboardMetrics() {
  const totalRecords = state.records.length;
  const activeRecords = state.records.filter((record) => record.status !== "Pendiente de activacion").length;
  const pendingRecords = state.records.filter((record) => record.status === "Pendiente de activacion").length;
  const totalReach = state.records.reduce((sum, record) => sum + totalFollowers(record.networks), 0);
  const inductedCount = state.records.filter((record) => record.tookInduction).length;
  const c28Count = state.records.filter((record) => record.c28Registered).length;
  const pollSquadCount = state.records.filter((record) => record.pollSquad).length;
  const rapidResponseCount = state.records.filter((record) => ["5 min", "15 min"].includes(record.responseWindow)).length;
  const multiNetworkCount = state.records.filter((record) => activeNetworkCount(record.networks) >= 3).length;
  const sentimentSquadCount = state.records.filter((record) =>
    record.skills.some((skill) => ["Moderacion y sentimiento", "Comentarios estrategicos"].includes(skill))
  ).length;
  const maleCount = state.records.filter((record) => normalizeSex(record.sex) === "masculino").length;
  const femaleCount = state.records.filter((record) => normalizeSex(record.sex) === "femenino").length;
  const identifiedSexCount = maleCount + femaleCount;
  const unspecifiedSexCount = Math.max(totalRecords - identifiedSexCount, 0);
  const provinceSummaries = buildProvinceSummaries();
  const greenProvinces = provinceSummaries.filter((item) => item.status === "Verde").length;
  const yellowProvinces = provinceSummaries.filter((item) => item.status === "Amarillo").length;
  const redProvinces = provinceSummaries.filter((item) => item.status === "Rojo").length;
  const coveredProvinces = provinceSummaries.filter((item) => item.activists > 0).length;

  return {
    totalRecords,
    activeRecords,
    pendingRecords,
    totalReach,
    inductedCount,
    c28Count,
    pollSquadCount,
    rapidResponseCount,
    multiNetworkCount,
    sentimentSquadCount,
    maleCount,
    femaleCount,
    identifiedSexCount,
    unspecifiedSexCount,
    greenProvinces,
    yellowProvinces,
    redProvinces,
    coveredProvinces,
    inductionRate: percentage(inductedCount, totalRecords),
    c28Rate: percentage(c28Count, totalRecords),
    pollSquadRate: percentage(pollSquadCount, totalRecords),
    rapidResponseRate: percentage(rapidResponseCount, totalRecords),
    multiNetworkPercent: percentage(multiNetworkCount, totalRecords),
    sentimentSquadRate: percentage(sentimentSquadCount, totalRecords),
    maleRate: percentage(maleCount, identifiedSexCount),
    femaleRate: percentage(femaleCount, identifiedSexCount),
  };
}

function buildPulseMetrics() {
  const metrics = computeDashboardMetrics();
  const summaries = buildProvinceSummaries();
  const averageProvinceScore = summaries.length
    ? Math.round(summaries.reduce((sum, item) => sum + item.score, 0) / summaries.length)
    : 0;
  const territorialReadiness = percentage(
    summaries.filter((item) => item.score >= 60).length,
    summaries.length
  );
  const reachEfficiency = clamp(Math.round(metrics.multiNetworkPercent * 0.45 + metrics.rapidResponseRate * 0.35 + Math.min(100, metrics.totalReach / 1800) * 0.2));
  const sentimentShield = clamp(Math.round(metrics.sentimentSquadRate * 0.5 + metrics.inductionRate * 0.25 + metrics.rapidResponseRate * 0.25));
  const pollPressure = clamp(Math.round(metrics.pollSquadRate * 0.55 + metrics.c28Rate * 0.2 + metrics.rapidResponseRate * 0.25));

  return [
    {
      label: "Presence Score Proxy",
      value: averageProvinceScore,
      caption: "Combina cobertura de base, coordinacion y activistas respecto a metas provinciales.",
    },
    {
      label: "Share of Voice Readiness",
      value: reachEfficiency,
      caption: "Considera cuantas cuentas activas tenemos, cuantas operan en multiples redes y la velocidad de respuesta.",
    },
    {
      label: "Sentimiento y contencion",
      value: sentimentShield,
      caption: "Mide la capacidad de comentar, moderar, responder y amortiguar narrativas adversas.",
    },
    {
      label: "Operacion de sondeos",
      value: pollPressure,
      caption: "Refleja la cantidad de perfiles disponibles para votar, compartir y reforzar sondeos digitales.",
    },
    {
      label: "Cobertura territorial operativa",
      value: territorialReadiness,
      caption: "Provincias con semaforo amarillo o verde sobre el total nacional.",
    },
  ];
}

function buildProvinceSummaries() {
  return state.provincePlans.map((plan) => getProvinceSummary(plan.province));
}

function buildExteriorSummaries() {
  return state.exteriorPlans.map((plan) => getExteriorSummary(plan.seccional));
}

function getProvinceSummary(province) {
  const plan = getProvincePlan(province);
  const records = state.records.filter(
    (record) => getRecordTerritoryScope(record) !== EXTERIOR_SCOPE && record.province === province
  );
  return buildStructureSummary({
    territory: province,
    region: plan?.region || "",
    macroRegion: plan?.macroRegion || "",
    targetActivists: (plan?.provincialGoal || 20) + (plan?.plannedCells || 0) * (plan?.unitGoal || 10),
    records,
    plan,
  });
}

function getExteriorSummary(seccional) {
  const plan = getExteriorPlan(seccional);
  const records = state.records.filter(
    (record) => getRecordTerritoryScope(record) === EXTERIOR_SCOPE && record.exteriorSection === seccional
  );
  return buildStructureSummary({
    territory: seccional,
    region: plan?.zone || "",
    macroRegion: plan?.macroRegion || "Exterior",
    targetActivists: (plan?.sectionalDirectiveGoal || 20) + (plan?.circunscriptionCount || 0) * (plan?.circunscriptionGoal || 20),
    records,
    plan,
  });
}

function buildStructureSummary({ territory, region, macroRegion, targetActivists, records, plan }) {
  const activists = records.length;
  const induced = records.filter((record) => record.tookInduction).length;
  const c28 = records.filter((record) => record.c28Registered).length;
  const rapidResponse = records.filter((record) => ["5 min", "15 min"].includes(record.responseWindow)).length;
  const pollSquad = records.filter((record) => record.pollSquad).length;
  const totalFollowersValue = records.reduce((sum, record) => sum + totalFollowers(record.networks), 0);
  const coordinatorNames = [
    plan?.provincialCoordinator,
    plan?.regionalCoordinator,
    plan?.macroCoordinator,
    ...records
      .filter((record) => record.role.includes("Coordinador"))
      .map((record) => `${record.firstName} ${record.lastName}`),
  ].filter(Boolean);

  const coverageScore = clamp(Math.round((activists / Math.max(targetActivists, 1)) * 100));
  const inductionScore = percentage(induced, activists);
  const c28Score = percentage(c28, activists);
  const responseScore = percentage(rapidResponse, activists);
  const pollScore = percentage(pollSquad, activists);
  const structureScore = clamp(Math.round((new Set(coordinatorNames).size / 3) * 100));
  const reachScore = clamp(Math.round((totalFollowersValue / Math.max(targetActivists * 1500, 1)) * 100));
  const score = clamp(
    Math.round(
      coverageScore * 0.34 +
        inductionScore * 0.14 +
        c28Score * 0.14 +
        responseScore * 0.14 +
        pollScore * 0.1 +
        structureScore * 0.08 +
        reachScore * 0.06
    )
  );

  return {
    province: territory,
    region,
    macroRegion,
    targetActivists,
    activists,
    induced,
    c28,
    rapidResponse,
    pollSquad,
    totalFollowers: totalFollowersValue,
    score,
    structureScore,
    coverageScore,
    inductionScore,
    c28Score,
    responseScore,
    pollScore,
    reachScore,
    status: score >= 75 ? "Verde" : score >= 45 ? "Amarillo" : "Rojo",
    coordinators: {
      provincial: plan?.provincialCoordinator || "Por asignar",
      regional: plan?.regionalCoordinator || "Por asignar",
      macro: plan?.macroCoordinator || "Por asignar",
    },
  };
}

async function mountProvinceMap() {
  try {
    const response = await fetch("./rd-provinces.geojson");
    const featureCollection = await response.json();
    mapModel = buildMapModel(featureCollection);
    nodes.rdMap.innerHTML = "";
    nodes.rdMap.appendChild(mapModel.svg);
    nodes.mapStatus.textContent = `${mapModel.provinceLayers.size} provincias sincronizadas`;
    paintMap();
    selectProvince(state.provincePlans[0]?.province || "Distrito Nacional", false);
  } catch (error) {
    nodes.mapStatus.textContent = "No se pudo cargar el mapa";
    nodes.rdMap.innerHTML = `
      <div class="province-card">
        <h4>Mapa no disponible</h4>
        <p>Si abriste el archivo directamente, ejecuta <code>node server.js</code> en esta carpeta y entra por navegador a <code>http://127.0.0.1:4173</code>.</p>
      </div>
    `;
    console.error(error);
  }
}

function buildMapModel(featureCollection) {
  const provinceLookup = new Map(
    state.provincePlans.map((plan) => [normalizeProvinceLabel(plan.province), plan.province])
  );
  Object.entries(MAP_PROVINCE_ALIASES).forEach(([alias, province]) => {
    provinceLookup.set(alias, province);
  });

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Mapa territorial de Republica Dominicana por provincia");

  const provinces = (featureCollection.features || [])
    .map((feature) => {
      const rawName = feature.properties?.province_name || feature.properties?.name || "";
      const province = provinceLookup.get(normalizeProvinceLabel(rawName));
      return province ? { feature, province } : null;
    })
    .filter(Boolean);

  const projection = buildMapProjection(provinces.map((item) => item.feature.geometry));
  const baseLayer = document.createElementNS(svg.namespaceURI, "g");
  const labelLayer = document.createElementNS(svg.namespaceURI, "g");
  baseLayer.setAttribute("class", "map-province-layer");
  labelLayer.setAttribute("class", "map-label-layer");

  const provinceLayers = new Map();

  provinces.forEach(({ feature, province }) => {
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", geometryToPath(feature.geometry, projection));
    path.setAttribute("class", "province-shape");
    path.setAttribute("stroke", "rgba(255,255,255,0.96)");
    path.setAttribute("stroke-width", "1.15");
    path.dataset.province = province;
    path.setAttribute("tabindex", "0");
    baseLayer.appendChild(path);

    const label = createProvinceLabel(svg, province, feature.geometry, projection);
    labelLayer.appendChild(label.group);

    [path, label.badge, label.text].forEach((node) => {
      node.style.cursor = "pointer";
      node.addEventListener("mouseenter", () => selectProvince(province, false));
      node.addEventListener("click", () => selectProvince(province, true));
      node.addEventListener("focus", () => selectProvince(province, false));
      node.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectProvince(province, true);
        }
      });
    });

    provinceLayers.set(province, {
      path,
      badge: label.badge,
      text: label.text,
    });
  });

  svg.append(baseLayer, labelLayer);
  return { svg, provinceLayers };
}

function paintMap() {
  if (!mapModel) return;
  mapModel.provinceLayers.forEach((group, province) => {
    const summary = getProvinceSummary(province);
    group.path.setAttribute("fill", provinceColor(summary.status));
    group.path.setAttribute("fill-opacity", "0.92");
    group.badge.setAttribute("fill", provinceColor(summary.status));
    group.badge.setAttribute("fill-opacity", "0.9");
    group.text.setAttribute("fill", "#ffffff");
  });
}

function selectProvince(province, sticky = true) {
  if (!mapModel) return;
  const summary = getProvinceSummary(province);
  mapModel.provinceLayers.forEach((group, provinceName) => {
    group.path.classList.toggle("is-active", provinceName === province);
    group.badge.classList.toggle("is-active", provinceName === province);
    group.text.classList.toggle("is-active", provinceName === province);
  });

  nodes.provinceDetail.innerHTML = `
    <p class="eyebrow">${summary.region} | ${summary.macroRegion}</p>
    <h4>${province}</h4>
    <p>
      Puntaje operativo de <strong>${summary.score}%</strong>. La meta provincial se calcula con base
      fija de 20 activistas, mas las celdas territoriales planificadas en esta provincia.
    </p>

    <div class="province-stat-grid">
      <div class="province-stat">
        <span>Base actual</span>
        <strong>${summary.activists}/${summary.targetActivists}</strong>
      </div>
      <div class="province-stat">
        <span>Alcance</span>
        <strong>${formatCompact(summary.totalFollowers)}</strong>
      </div>
      <div class="province-stat">
        <span>Induccion</span>
        <strong>${summary.inductionScore}%</strong>
      </div>
      <div class="province-stat">
        <span>Respuesta 15 min</span>
        <strong>${summary.responseScore}%</strong>
      </div>
      <div class="province-stat">
        <span>Cobertura C28</span>
        <strong>${summary.c28Score}%</strong>
      </div>
      <div class="province-stat">
        <span>Sondeos activos</span>
        <strong>${summary.pollScore}%</strong>
      </div>
    </div>

    <div class="info-stack">
      <div class="info-item">
        <strong>Coordinador provincial</strong>
        <span>${summary.coordinators.provincial}</span>
      </div>
      <div class="info-item">
        <strong>Coordinador regional</strong>
        <span>${summary.coordinators.regional}</span>
      </div>
      <div class="info-item">
        <strong>Coordinador macroregional</strong>
        <span>${summary.coordinators.macro}</span>
      </div>
    </div>
  `;

  if (sticky && !isMobileViewport()) {
    nodes.provinceDetail.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function renderSkillChips() {
  nodes.skillsPicker.innerHTML = SKILL_OPTIONS.map(
    (skill) => `
      <label class="skill-chip">
        <input type="checkbox" value="${skill}" />
        <span>${skill}</span>
      </label>
    `
  ).join("");
}

function renderNetworkCards() {
  nodes.networkFields.innerHTML = NETWORK_CONFIG.map(
    (networkItem) => `
      <article class="network-card">
        <div class="network-head">
          <strong>${networkItem.label}</strong>
          <label class="toggle-field">
            <input id="${networkItem.key}Active" type="checkbox" />
            <span>Activa</span>
          </label>
        </div>
        <div class="network-meta">
          <label>
            Usuario o handle
            <input id="${networkItem.key}Handle" placeholder="@cuenta" />
          </label>
          <label>
            Seguidores
            <input id="${networkItem.key}Followers" type="number" min="0" step="1" value="0" />
          </label>
        </div>
      </article>
    `
  ).join("");
}

function exportRecordsCsv() {
  const rows = state.records.map((record) => ({
    cedula: record.cedula,
    nombre: `${record.firstName} ${record.lastName}`,
    territorio_tipo: getRecordTerritoryScope(record) === EXTERIOR_SCOPE ? "Seccional exterior" : "Provincia",
    territorio: getRecordTerritoryName(record),
    provincia: record.province,
    seccional_exterior: record.exteriorSection || "",
    circunscripcion_exterior: record.exteriorCircunscription || "",
    municipio: record.municipality,
    rol: record.role,
    estado: record.status,
    sexo: record.sex || "",
    rango_edad: record.ageRange || "",
    region: record.region,
    macroregion: record.macroRegion,
    induccion: record.tookInduction ? "Si" : "No",
    fecha_induccion: record.inductionDate || "",
    c28: record.c28Registered ? "Si" : "No",
    respuesta: record.responseWindow,
    sondeos: record.pollSquad ? "Si" : "No",
    skills: record.skills.join(" | "),
    alcance_total: totalFollowers(record.networks),
    coordinador_provincial: record.provincialCoordinator,
    coordinador_regional: record.regionalCoordinator,
    coordinador_macroregional: record.macroCoordinator,
    notas: record.notes || "",
  }));

  downloadFile(toCsv(rows), "rad-c28-base.csv", "text/csv;charset=utf-8");
  toast("CSV de la base descargado.", "success");
}

function exportRecordsJson() {
  downloadFile(
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        records: state.records,
        provincePlans: state.provincePlans,
        exteriorPlans: state.exteriorPlans,
      },
      null,
      2
    ),
    "rad-c28-base.json",
    "application/json"
  );
  toast("JSON de la base descargado.", "success");
}

function exportProvinceSummaryCsv() {
  const rows = [
    ...buildProvinceSummaries().map((summary) => ({
      tipo_estructura: "Provincia",
      territorio: summary.province,
      region: summary.region,
      macroregion: summary.macroRegion,
      estado: summary.status,
      puntaje: summary.score,
      meta_activistas: summary.targetActivists,
      activistas_actuales: summary.activists,
      induccion_pct: summary.inductionScore,
      c28_pct: summary.c28Score,
      respuesta_pct: summary.responseScore,
      sondeos_pct: summary.pollScore,
      alcance_total: summary.totalFollowers,
      coordinador_principal: summary.coordinators.provincial,
      coordinador_secundario: summary.coordinators.regional,
      coordinador_estrategico: summary.coordinators.macro,
    })),
    ...buildExteriorSummaries().map((summary) => ({
      tipo_estructura: "Seccional exterior",
      territorio: summary.province,
      region: summary.region,
      macroregion: summary.macroRegion,
      estado: summary.status,
      puntaje: summary.score,
      meta_activistas: summary.targetActivists,
      activistas_actuales: summary.activists,
      induccion_pct: summary.inductionScore,
      c28_pct: summary.c28Score,
      respuesta_pct: summary.responseScore,
      sondeos_pct: summary.pollScore,
      alcance_total: summary.totalFollowers,
      coordinador_principal: summary.coordinators.provincial,
      coordinador_secundario: summary.coordinators.regional,
      coordinador_estrategico: summary.coordinators.macro,
    })),
  ];

  downloadFile(toCsv(rows), "rad-c28-resumen-estructural.csv", "text/csv;charset=utf-8");
  toast("Resumen estructural descargado.", "success");
}

function mergeRecordCoordinators(record) {
  const plan =
    getRecordTerritoryScope(record) === EXTERIOR_SCOPE
      ? getExteriorPlan(record.exteriorSection)
      : getProvincePlan(record.province);
  if (!plan) return;

  if (record.provincialCoordinator) {
    plan.provincialCoordinator = record.provincialCoordinator;
  }
  if (record.regionalCoordinator) {
    plan.regionalCoordinator = record.regionalCoordinator;
  }
  if (record.macroCoordinator) {
    plan.macroCoordinator = record.macroCoordinator;
  }
}

function mergeRecordCoordinatorsIntoPlans() {
  state.records.forEach((record) => mergeRecordCoordinators(record));
}

function loadState() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const freshState = {
      nationalCoordination: structuredClone(DEFAULT_NATIONAL_COORDINATION),
      provincePlans: buildDefaultProvincePlans(),
      exteriorPlans: buildDefaultExteriorPlans(),
      records: structuredClone(DEMO_RECORDS),
    };
    mergeRecordCoordinatorsIntoPlanList(freshState);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(freshState));
    return freshState;
  }

  const parsed = JSON.parse(saved);
  parsed.nationalCoordination = {
    ...DEFAULT_NATIONAL_COORDINATION,
    ...(parsed.nationalCoordination || {}),
  };
  parsed.provincePlans = PROVINCE_BLUEPRINTS.map((baseItem) => {
    const existing = parsed.provincePlans?.find((plan) => plan.province === baseItem.province) || {};
    return {
      ...baseItem,
      provincialGoal: 20,
      provincialCoordinator: existing.provincialCoordinator || "",
      regionalCoordinator: existing.regionalCoordinator || "",
      macroCoordinator: existing.macroCoordinator || "",
      plannedCells: Number(existing.plannedCells ?? baseItem.plannedCells),
      unitGoal: Number(existing.unitGoal ?? baseItem.unitGoal),
    };
  });
  parsed.exteriorPlans = EXTERIOR_BLUEPRINTS.map((baseItem) => {
    const existing = parsed.exteriorPlans?.find((plan) => plan.seccional === baseItem.seccional) || {};
    return {
      ...baseItem,
      sectionalDirectiveGoal: 20,
      circunscriptionGoal: 20,
      provincialCoordinator: existing.provincialCoordinator || "",
      regionalCoordinator: existing.regionalCoordinator || "",
      macroCoordinator: existing.macroCoordinator || "",
      circunscriptionCount: Number(existing.circunscriptionCount ?? baseItem.circunscriptionCount),
    };
  });
  parsed.records = parsed.records || [];

  const provincePurge = purgeRecordsByProvince(parsed.records, [...DEMO_DISABLED_PROVINCES]);
  if (provincePurge.changed) {
    parsed.records = provincePurge.records;
  }

  const mergedDemoRecords = mergeMissingDemoRecords(parsed.records);
  if (mergedDemoRecords) {
    parsed.records = mergedDemoRecords;
  }

  if (provincePurge.changed || mergedDemoRecords) {
    mergeRecordCoordinatorsIntoPlanList(parsed);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  }

  return parsed;
}

function saveState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function mergeRecordCoordinatorsIntoPlanList(snapshot) {
  snapshot.records.forEach((record) => {
    const plan =
      getRecordTerritoryScope(record) === EXTERIOR_SCOPE
        ? snapshot.exteriorPlans?.find((item) => item.seccional === record.exteriorSection)
        : snapshot.provincePlans.find((item) => item.province === record.province);
    if (!plan) return;
    if (record.provincialCoordinator) plan.provincialCoordinator = record.provincialCoordinator;
    if (record.regionalCoordinator) plan.regionalCoordinator = record.regionalCoordinator;
    if (record.macroCoordinator) plan.macroCoordinator = record.macroCoordinator;
  });
}

function mergeMissingDemoRecords(records) {
  if (!Array.isArray(records) || !records.length) {
    return null;
  }

  const demoMatches = records.filter((record) => DEMO_CEDULA_SET.has(record.cedula)).length;
  if (!demoMatches) {
    return null;
  }

  const existingCedulas = new Set(records.map((record) => record.cedula));
  const missingRecords = DEMO_RECORDS.filter((record) => !existingCedulas.has(record.cedula));
  if (!missingRecords.length) {
    return null;
  }

  return [...records, ...structuredClone(missingRecords)];
}

function purgeRecordsByProvince(records, provinces) {
  if (!Array.isArray(records) || !records.length || !Array.isArray(provinces) || !provinces.length) {
    return { changed: false, records };
  }

  const blocked = new Set(provinces);
  const filtered = records.filter((record) => !blocked.has(record.province));
  return {
    changed: filtered.length !== records.length,
    records: filtered,
  };
}

function findExistingRecord(id) {
  return state.records.find((record) => record.id === id);
}

function getProvincePlan(province) {
  return state.provincePlans.find((plan) => plan.province === province);
}

function getExteriorPlan(seccional) {
  return state.exteriorPlans.find((plan) => plan.seccional === seccional);
}

function totalFollowers(networks) {
  return Object.values(networks || {}).reduce((sum, item) => sum + Number(item.followers || 0), 0);
}

function activeNetworkCount(networks) {
  return Object.values(networks || {}).filter((item) => item.active && Number(item.followers || 0) > 0).length;
}

function network(handle, followers, active) {
  return { handle, followers, active };
}

function createDemoRecord(input) {
  const plan = PROVINCE_BLUEPRINTS.find((item) => item.province === input.province);
  const exteriorPlan = EXTERIOR_BLUEPRINTS.find((item) => item.seccional === input.exteriorSection);
  const isExterior = (input.territoryScope || DOMESTIC_SCOPE) === EXTERIOR_SCOPE;
  return {
    id: crypto.randomUUID(),
    phone: input.phone || "",
    whatsapp: input.whatsapp || "",
    email: input.email || `${input.firstName}.${input.lastName}`.replace(/\s+/g, ".").toLowerCase() + "@radc28.do",
    ageRange: input.ageRange || "25-34",
    sex: input.sex || "",
    districtMunicipal: input.districtMunicipal || "",
    territoryScope: input.territoryScope || DOMESTIC_SCOPE,
    exteriorSection: input.exteriorSection || "",
    exteriorCircunscription: input.exteriorCircunscription || "",
    region: isExterior ? exteriorPlan?.zone || input.region || "" : plan?.region || "",
    macroRegion: isExterior ? exteriorPlan?.macroRegion || input.macroRegion || "Exterior" : plan?.macroRegion || "",
    inductionDate: input.tookInduction ? "2026-05-12" : "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...input,
  };
}

function provinceColor(status) {
  if (status === "Verde") return "rgba(34, 149, 106, 0.88)";
  if (status === "Amarillo") return "rgba(229, 163, 33, 0.88)";
  return "rgba(212, 75, 75, 0.88)";
}

function statusClass(status) {
  if (status === "Verde") return "chip-green";
  if (status === "Amarillo") return "chip-yellow";
  return "chip-red";
}

function populateSelect(selectNode, values, includeEmpty = false) {
  const currentValue = selectNode.value;
  selectNode.innerHTML = [
    includeEmpty ? `<option value=""></option>` : "",
    ...values.map((value) => `<option value="${value}">${value}</option>`),
  ].join("");
  if (values.includes(currentValue)) {
    selectNode.value = currentValue;
  }
}

function valueOf(id) {
  return document.getElementById(id).value.trim();
}

function numberValueOf(id) {
  return Number(document.getElementById(id).value || 0);
}

function checkedOf(id) {
  return document.getElementById(id).checked;
}

function setValue(id, value) {
  document.getElementById(id).value = value ?? "";
}

function setChecked(id, value) {
  document.getElementById(id).checked = Boolean(value);
}

function normalizeCedula(value) {
  const raw = value.replace(/\D/g, "").slice(0, 11);
  const chunks = [raw.slice(0, 3), raw.slice(3, 10), raw.slice(10, 11)].filter(Boolean);
  return chunks.join("-");
}

function normalizeProvinceLabel(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z]/g, "")
    .toLowerCase();
}

function normalizeSex(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatCompact(value) {
  return new Intl.NumberFormat("es-DO", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

function percentage(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [headers.join(","), ...rows.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\n");
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function toast(message, kind = "success") {
  const node = document.createElement("div");
  node.className = `toast ${kind}`;
  node.textContent = message;
  nodes.toastStack.appendChild(node);
  window.setTimeout(() => {
    node.remove();
  }, 3200);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildMapProjection(geometries) {
  const points = geometries.flatMap((geometry) => collectGeometryPoints(geometry));
  const bounds = points.reduce(
    (accumulator, [lon, lat]) => ({
      minLon: Math.min(accumulator.minLon, lon),
      maxLon: Math.max(accumulator.maxLon, lon),
      minLat: Math.min(accumulator.minLat, lat),
      maxLat: Math.max(accumulator.maxLat, lat),
    }),
    {
      minLon: Number.POSITIVE_INFINITY,
      maxLon: Number.NEGATIVE_INFINITY,
      minLat: Number.POSITIVE_INFINITY,
      maxLat: Number.NEGATIVE_INFINITY,
    }
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
        .map((ring) =>
          ring
            .map((point, index) => {
              const projected = projection(point);
              return `${index === 0 ? "M" : "L"} ${projected.x.toFixed(2)} ${projected.y.toFixed(2)}`;
            })
            .join(" ") + " Z"
        )
        .join(" ")
    )
    .join(" ");
}

function collectGeometryPoints(geometry) {
  const polygons = geometry.type === "MultiPolygon" ? geometry.coordinates : [geometry.coordinates];
  return polygons.flatMap((polygon) => polygon.flatMap((ring) => ring));
}

function createProvinceLabel(svg, province, geometry, projection) {
  const labelPoint = getGeometryLabelPoint(geometry, projection, province);
  const override = MAP_LABEL_OVERRIDES[province] || {};
  const label = override.label || province;
  const fontSize = override.fontSize || (label.length > 12 ? 8.6 : 9.2);
  const width = Math.max(36, label.length * fontSize * 0.56 + 16);
  const height = fontSize + 10;

  const group = document.createElementNS(svg.namespaceURI, "g");
  group.dataset.province = province;

  const badge = document.createElementNS(svg.namespaceURI, "rect");
  badge.setAttribute("x", String(labelPoint.x - width / 2));
  badge.setAttribute("y", String(labelPoint.y - height / 2));
  badge.setAttribute("width", String(width));
  badge.setAttribute("height", String(height));
  badge.setAttribute("rx", "7");
  badge.setAttribute("ry", "7");
  badge.classList.add("province-label-badge");
  badge.dataset.province = province;

  const text = document.createElementNS(svg.namespaceURI, "text");
  text.setAttribute("x", String(labelPoint.x));
  text.setAttribute("y", String(labelPoint.y + 0.5));
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("font-size", String(fontSize));
  text.setAttribute("font-family", "Aptos, Segoe UI, sans-serif");
  text.classList.add("province-label-text");
  text.dataset.province = province;
  text.textContent = label;

  group.append(badge, text);
  return { group, badge, text };
}

function getGeometryLabelPoint(geometry, projection, province) {
  const points = collectGeometryPoints(geometry).map((point) => projection(point));
  const bounds = points.reduce(
    (accumulator, point) => ({
      minX: Math.min(accumulator.minX, point.x),
      maxX: Math.max(accumulator.maxX, point.x),
      minY: Math.min(accumulator.minY, point.y),
      maxY: Math.max(accumulator.maxY, point.y),
      sumX: accumulator.sumX + point.x,
      sumY: accumulator.sumY + point.y,
      count: accumulator.count + 1,
    }),
    {
      minX: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
      sumX: 0,
      sumY: 0,
      count: 0,
    }
  );

  const averageX = bounds.count ? bounds.sumX / bounds.count : (bounds.minX + bounds.maxX) / 2;
  const averageY = bounds.count ? bounds.sumY / bounds.count : (bounds.minY + bounds.maxY) / 2;
  const centerX = (averageX + (bounds.minX + bounds.maxX) / 2) / 2;
  const centerY = (averageY + (bounds.minY + bounds.maxY) / 2) / 2;
  const override = MAP_LABEL_OVERRIDES[province] || {};

  return {
    x: centerX + (override.dx || 0),
    y: centerY + (override.dy || 0),
  };
}
