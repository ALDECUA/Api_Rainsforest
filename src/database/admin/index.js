/**
 *  index.js
 *  @version: 1.0.0
 *  @author: DWIT MÉXICO -
 *  @description: Funciones asyncronas para las peticiones a bases de datos /admin
 */

const config = require("../config");
const sql = require("mssql");

async function getInfoArqueo(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const updated = await connection
      .request()
      .input("fecha", sql.Date, data.fecha)
      .execute("CRM_ArqueoDia")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        return { Pesos: recordset[0][0], Dolares: recordset[1][0] };
      });
    connection.close();
    return updated;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function AgregarPago(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const updated = await connection
      .request()
      .input("IdBanco", sql.Int, data.IdBanco)
      .input("NombreBanco", sql.NVarChar(255), data.Nombre)
      .input("Divisa", sql.NVarChar(4), data.Divisa)
      .input("Inicial", sql.Float, data.Inicial)
      .input("IdUsuario", sql.Int, data.IdUsuario)
      .execute("ADM_AgregarBanco")
      .then((dbData) => {
        const recordset = dbData.recordset;
        return { Bancos: recordset, Inserted: true };
      });
    connection.close();
    return updated;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function ObtenerBancos() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const updated = await connection
      .request()
      .execute("ADM_ObtenerBancos")
      .then((dbData) => {
        const recordset = dbData.recordset;
        return { Bancos: recordset };
      });
    connection.close();
    return updated;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function obtenerMovimientosBanco(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("Fecha", sql.Date, data.FechaInicio)
      .input("FechaFin", sql.Date, data.FechaFin)
      .input("IdBanco", sql.Int, data.IdBanco)
      .execute("ADM_InfoBanco")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return {
            movimientos: recordset[0],
            banco: recordset[1][0],
          };
        } else {
          return {
            error: true,
            message: "Error, no se encontraron los registros",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function Movimientos_CG(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresa = await connection
      .request()
      .input("IdMovimiento", sql.Int, data.IdMovimiento)
      .input("Descripcion", sql.NVarChar(sql.MAX), data.Descripcion)
      .input("TipoMovimiento", sql.Int, data.TipoMovimiento)
      .input("Cantidad", sql.Float, data.Cantidad)
      .input("IdUsuario", sql.Int, data.IdUsuario)
      .input("IdStatus", sql.Int, data.IdStatus)
      .input("Img_Comprobante", sql.NVarChar(500), data.Img_Comprobante)
      .input("IdBanco", sql.Int, data.IdBanco)
      .input("Fecha", sql.Date, data.Fecha)
      .input("Tipo", sql.Int, data.Egreso)
      .input("Antes", sql.Float, data.Antes)
      .execute("CRM_MovimientosCG")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset[0];
        } else {
          return {
            error: true,
            message: "No se ejecutó ningun movimiento.",
          };
        }
      });

    connection.close();
    return empresa;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function Array(arreglo = []) {
  let i = 0;
  for (const movimiento of arreglo) {
    await Movimientos_CG(movimiento);
    i++;
  }
  if (i == arreglo.length) {
    return { exito: 1 };
  }
}
async function AgregarArqueo(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const updated = await connection
      .request()
      .input("IdUsuario", sql.Int, data.IdUsuario)
      .input("Detalles", sql.NVarChar(sql.MAX), data.Detalles)
      .input("Divisa", sql.NVarChar(3), data.Divisa)
      .input("Diferencia", sql.Float, data.Diferencia)
      .input("Total", sql.Float, data.Total)
      .execute("CRM_GuardarArqueo")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { Inserted: true };
        }
      });
    connection.close();
    return updated;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function GetArqueosMes(Mes) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const updated = await connection
      .request()
      .input("Mes", sql.Int, Mes)
      .execute("CRM_ArqueosMes")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return { MXN: recordset[0], USD: recordset[1]};
        }
      });
    connection.close();
    return updated;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

module.exports = {
  getInfoArqueo,
  AgregarPago,
  ObtenerBancos,
  obtenerMovimientosBanco,
  Movimientos_CG,
  Array,
  AgregarArqueo,
  GetArqueosMes
};
