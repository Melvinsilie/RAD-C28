function percentage(part, total) {
  return total ? Math.round((part / total) * 100) : 0;
}

function clamp(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

function activeFollowers(networks) {
  return Object.values(networks || {}).reduce(
    (total, network) =>
      total + (network.active ? Math.max(0, Number(network.followers) || 0) : 0),
    0
  );
}

function buildNationalReach(records) {
  return records.reduce(
    (total, record) => total + activeFollowers(record.networks),
    0
  );
}

function buildSexSummary(records) {
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

function buildProvinceProgress(provincePlans, records) {
  return provincePlans.map((plan) => {
    const territoryRecords = records.filter(
      (record) => record.territoryScope === "provincia" && record.province === plan.province
    );
    const activists = territoryRecords.length;
    const targetActivists =
      Number(plan.provincialGoal || 20) +
      Number(plan.plannedCells || 0) * Number(plan.unitGoal || 10);
    const coverageScore = clamp(
      Math.round((activists / Math.max(targetActivists, 1)) * 100)
    );
    const inductionScore = percentage(
      territoryRecords.filter((record) => record.tookInduction).length,
      activists
    );
    const c28Score = percentage(
      territoryRecords.filter((record) => record.c28Registered).length,
      activists
    );
    const responseScore = percentage(
      territoryRecords.filter((record) =>
        ["5 min", "15 min"].includes(record.responseWindow)
      ).length,
      activists
    );
    const pollScore = percentage(
      territoryRecords.filter((record) => record.pollSquad).length,
      activists
    );
    const coordinatorCount = [
      plan.provincialCoordinator,
      plan.regionalCoordinator,
      plan.macroCoordinator,
    ].filter(Boolean).length;
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
      province: plan.province,
      region: plan.region,
      macroRegion: plan.macroRegion,
      targetActivists,
      activists,
      totalFollowers: territoryRecords.reduce(
        (total, record) => total + activeFollowers(record.networks),
        0
      ),
      coverageScore,
      inductionScore,
      c28Score,
      responseScore,
      pollScore,
      score,
      status: score >= 75 ? "Verde" : score >= 45 ? "Amarillo" : "Rojo",
    };
  });
}

module.exports = { buildNationalReach, buildProvinceProgress, buildSexSummary };
