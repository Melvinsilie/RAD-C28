function quoteIdentifier(value) {
  return `\`${String(value).replaceAll("`", "``")}\``;
}

function escapeSqlString(value) {
  return String(value).replace(/[\\'\0\b\t\n\r\x1a]/g, (character) => {
    const escapes = {
      "\0": "\\0",
      "\b": "\\b",
      "\t": "\\t",
      "\n": "\\n",
      "\r": "\\r",
      "\x1a": "\\Z",
      "'": "\\'",
      "\\": "\\\\",
    };
    return escapes[character];
  });
}

function formatDate(value) {
  return value.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "");
}

function sqlValue(value) {
  if (value === null || value === undefined) return "NULL";
  if (Buffer.isBuffer(value)) return `X'${value.toString("hex")}'`;
  if (value instanceof Date) return `'${formatDate(value)}'`;
  if (typeof value === "boolean") return value ? "1" : "0";
  if (typeof value === "number" || typeof value === "bigint") return String(value);
  if (typeof value === "object") {
    return `'${escapeSqlString(JSON.stringify(value))}'`;
  }
  return `'${escapeSqlString(value)}'`;
}

function buildInsertStatements(tableName, rows, chunkSize = 200) {
  if (!rows.length) return [];
  const columns = Object.keys(rows[0]);
  const quotedColumns = columns.map(quoteIdentifier).join(", ");
  const statements = [];
  for (let index = 0; index < rows.length; index += chunkSize) {
    const values = rows
      .slice(index, index + chunkSize)
      .map(
        (row) =>
          `(${columns.map((column) => sqlValue(row[column])).join(", ")})`
      )
      .join(",\n");
    statements.push(
      `INSERT INTO ${quoteIdentifier(tableName)} (${quotedColumns}) VALUES\n${values};`
    );
  }
  return statements;
}

function buildSqlBackup({ databaseName, generatedAt, tables }) {
  const lines = [
    "-- Respaldo completo de la base de datos RAD-C28",
    `-- Base: ${databaseName || "desconocida"}`,
    `-- Generado en UTC: ${generatedAt.toISOString()}`,
    "-- Contiene datos sensibles cifrados y credenciales con hash. Mantener protegido.",
    "-- Para recuperar campos cifrados se requiere la FIELD_ENCRYPTION_KEY original.",
    "",
    "SET NAMES utf8mb4;",
    "SET TIME_ZONE = '+00:00';",
    "SET FOREIGN_KEY_CHECKS = 0;",
    "SET UNIQUE_CHECKS = 0;",
    "",
  ];

  tables.forEach((table) => {
    lines.push(`DROP TABLE IF EXISTS ${quoteIdentifier(table.name)};`);
  });
  lines.push("");

  tables.forEach((table) => {
    lines.push(`-- Tabla ${quoteIdentifier(table.name)}`);
    lines.push(`${String(table.createStatement).replace(/;\s*$/, "")};`);
    lines.push(...buildInsertStatements(table.name, table.rows));
    lines.push("");
  });

  lines.push("SET UNIQUE_CHECKS = 1;");
  lines.push("SET FOREIGN_KEY_CHECKS = 1;");
  lines.push("");
  return lines.join("\n");
}

async function createDatabaseBackup(pool) {
  const connection = await pool.getConnection();
  try {
    await connection.query("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");
    await connection.query("START TRANSACTION WITH CONSISTENT SNAPSHOT");
    const [[databaseRow]] = await connection.query(
      "SELECT DATABASE() AS databaseName"
    );
    const [tableRows] = await connection.query(
      `SELECT TABLE_NAME AS tableName
       FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'
       ORDER BY TABLE_NAME`
    );
    const tables = [];
    let rowCount = 0;
    for (const { tableName } of tableRows) {
      const table = quoteIdentifier(tableName);
      const [createRows] = await connection.query(`SHOW CREATE TABLE ${table}`);
      const [rows] = await connection.query(`SELECT * FROM ${table}`);
      rowCount += rows.length;
      tables.push({
        name: tableName,
        createStatement: createRows[0]["Create Table"],
        rows,
      });
    }
    await connection.commit();
    return {
      sql: buildSqlBackup({
        databaseName: databaseRow.databaseName,
        generatedAt: new Date(),
        tables,
      }),
      tableCount: tables.length,
      rowCount,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  buildSqlBackup,
  createDatabaseBackup,
  escapeSqlString,
  quoteIdentifier,
  sqlValue,
};
