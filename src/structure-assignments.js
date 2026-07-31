const TERRITORIAL_ROLE_FIELDS = new Map([
  ["Coordinador provincial", "provincialCoordinator"],
  ["Coordinador regional", "regionalCoordinator"],
  ["Coordinador macroregional", "macroCoordinator"],
]);

function fullName(record) {
  return `${record.firstName || ""} ${record.lastName || ""}`.trim();
}

function matchesPlan(record, plan, field, exterior) {
  if (field === "provincialCoordinator") {
    return exterior
      ? plan.seccional === record.exteriorSection
      : plan.province === record.province;
  }
  if (field === "regionalCoordinator") {
    return exterior
      ? plan.zone === record.region
      : plan.region === record.region;
  }
  return plan.macroRegion === record.macroRegion;
}

function applyRoleAssignments({
  provincePlans,
  exteriorPlans,
  municipalityCoordinators,
  records,
}) {
  const provinces = provincePlans.map((plan) => ({ ...plan }));
  const exterior = exteriorPlans.map((plan) => ({ ...plan }));
  const municipal = new Map(
    municipalityCoordinators.map((assignment) => [
      `${assignment.province}\u0000${assignment.municipality}`,
      { ...assignment },
    ])
  );

  [...records].reverse().forEach((record) => {
    const coordinatorName = fullName(record);
    if (!coordinatorName) return;

    if (
      record.role === "Coordinador municipal" &&
      record.territoryScope === "provincia" &&
      record.province &&
      record.municipality
    ) {
      municipal.set(`${record.province}\u0000${record.municipality}`, {
        province: record.province,
        municipality: record.municipality,
        coordinatorName,
        activistId: record.id,
        source: "role",
      });
    }

    const field = TERRITORIAL_ROLE_FIELDS.get(record.role);
    if (!field) return;
    const isExterior = record.territoryScope === "exterior";
    const plans = isExterior ? exterior : provinces;
    plans.forEach((plan) => {
      if (matchesPlan(record, plan, field, isExterior)) {
        plan[field] = coordinatorName;
        plan[`${field}ActivistId`] = record.id;
      }
    });
  });

  return {
    provincePlans: provinces,
    exteriorPlans: exterior,
    municipalityCoordinators: [...municipal.values()].sort((left, right) =>
      `${left.province}/${left.municipality}`.localeCompare(
        `${right.province}/${right.municipality}`,
        "es"
      )
    ),
  };
}

module.exports = { applyRoleAssignments };
