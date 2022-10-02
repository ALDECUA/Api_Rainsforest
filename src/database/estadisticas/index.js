const config = require("../config");
const sql = require("mssql");

async function obtenerEstadisticas() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const data = await connection
      .request()
      .execute("HR_ContarNivelesPersonas")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          if (recordset.length > 0) {
            return { data: recordset[0] };
          } else {
            return { empty: true, message: "Error" };
          }
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function obtenerPersonasSC(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const data = await connection
      .request()
      .input("IdSCom", sql.Int, id)
      .execute("RH_ReporteSC")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          if (recordset.length > 0) {
            return { personas: recordset };
          } else {
            return { empty: true, message: "Error" };
          }
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function obtenerUltimosRegistros() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const data = await connection
      .request()
      .execute("HR_UltimosRegistrosPersonas")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          if (recordset.length > 0) {
            return { data: recordset };
          } else {
            return { empty: true, message: "Error" };
          }
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function ObtenerReclutas() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const data = await connection
      .request()
      .execute("RH_ReporteReclutas")
      .then(async (dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return { data: recordset[0], socios: recordset[1] };
        } else {
          return { error: true, message: "error de longitud del arreglo" };
        }
      });
    return data;
  } catch (error) {
    return { error: true, message: "error interno" };
  }
}

module.exports = {
  obtenerEstadisticas,
  obtenerUltimosRegistros,
  ObtenerReclutas,
  obtenerPersonasSC,
};
