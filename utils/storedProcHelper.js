// utils/storedProcHelper.js
const sequelize = require("../config/connection");

async function callStoredProc(procName, params = []) {
  try {
    // Build the CALL statement with placeholders
    const placeholders = params.map(() => "?").join(", ");
    const sql = `CALL ${procName}(${placeholders});`;

    const [results] = await sequelize.query(sql, {
      replacements: params,
    });

    return results;
  } catch (err) {
    console.error(`Error executing stored procedure ${procName}:`, err);
    throw err;
  }
}

module.exports = { callStoredProc };
