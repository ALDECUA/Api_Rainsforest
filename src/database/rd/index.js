const config = require("../config");
const sql = require("mssql");
const fs = require('fs');

async function InsertarInteresadoAviation(data) {
    try {
      const connection = await new sql.ConnectionPool(config).connect();
      const persona = await connection
        .request()
        .input("Nombre_Completo", sql.NVarChar(300), data.Nombre_Completo)
        .input("Email", sql.NVarChar(255), data.Email)
        .input("Num_Tel", sql.NVarChar(50), data.Num_Tel)
        .input("Direccion", sql.NVarChar(500), data.Direccion)
        .input("Asunto", sql.NVarChar(50), data.Asunto)
        .input("Mensaje", sql.NVarChar(4000), data.Mensaje)
        .input("Img_Archivo", sql.NVarChar(100), data.Img_Archivo)
        /* .input("Img_Passport", sql.NVarChar(100), data.Img_Passport)
              .input("Img_License", sql.NVarChar(100), data.Img_License) */
        .execute("FX_InsertarInteresadoAviation")
        .then(async (dbData) => {
          const recordset = dbData.recordset;
          if (recordset[0]) {
            return { insert: true, record: recordset[0] };
          } else {
            return {
              error: true,
              message: "Something went wrong",
            };
          }
        });
      connection.close();
      return persona;
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

async function obtenerTickets() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .execute("COP_Tickets")
      .then((dbData) => {
        const recordset = dbData.recordsets;

        if (recordset) {
          return { info: recordset[0], promos: recordset[1] };
        } else {
          return {
            error: true,
            message: "No se pudieron obtener los datos los tickets",
          };
        }
      });

    connection.close();
    return empresas;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

module.exports = {
    InsertarInteresadoAviation,
    obtenerTickets
  };
  