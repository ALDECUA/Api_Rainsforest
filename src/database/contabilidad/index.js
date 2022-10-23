const config = require("../config");
const sql = require("mssql");
const fs = require("fs");

async function PersonasComisiones(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresa = await connection
      .request()
      .input("FechaInicio", sql.Date, data.FechaInicio)
      .input("FechaFin", sql.Date, data.FechaFin)
      .execute("FX_AsesoresComision")
      .then((dbData) => {
        const recordset = dbData.recordset;

        if (recordset) {
          return { personas: recordset };
        } else {
          return {
            error: true,
            message: "No se creo el contrato.",
          };
        }
      });

    connection.close();
    return empresa;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function Volumen(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresa = await connection
      .request()
      .input("FechaInicio", sql.Date, data.FechaInicio)
      .input("FechaFin", sql.Date, data.FechaFin)
      .input("Elegir", sql.Int, data.Elegir)
      .execute("CRM_Volumen")
      .then((dbData) => {
        const recordset = dbData.recordset;

        if (recordset) {
          return { personas: recordset };
        } else {
          return {
            error: true,
            message: "No se creo el contrato.",
          };
        }
      });

    connection.close();
    return empresa;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function ObtenerTeamLider(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresa = await connection
      .request()
      .input("FechaInicio", sql.Date, data.FechaInicio)
      .input("FechaFin", sql.Date, data.FechaFin)
      .input("IdPersona", sql.Int, data.IdPersona || null)
      .input("Asesor", sql.Int, data.IdPersona || null)
      .input("Seleccion", sql.Int, data.Seleccion)
      .execute("CRM_ObtenerTeamLider")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          for (let i = 0; i < 3; i++) {
            if (recordset[i] == undefined) {
              recordset[i] = { Foto: "noone.png" };
            }
          }
          return { personas: recordset };
        } else {
          return {
            error: true,
            message: "No se encontró fecha.",
          };
        }
      });

    connection.close();
    return empresa;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function PersonaComisiones(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresa = await connection
      .request()
      .input("FechaInicio", sql.Date, data.FechaInicio)
      .input("FechaFinal", sql.Date, data.FechaFin)
      .input("IdPersona", sql.Int, data.IdPersona)
      .execute("FX_CalcularComision")
      .then((dbData) => {
        const recordset = dbData.recordset;

        if (recordset) {
          return { hrs: recordset };
        } else {
          return {
            error: true,
            message: "No se creo el contrato.",
          };
        }
      });

    connection.close();
    return empresa;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function SubirExcel(data) {
  try {
  
    if (data.email === "undefined" || data.phone_number === "undefined") {
      return {
        error: true,
        message: "No se ejecutó ningun movimiento.",
      };
    }
    const connection = await new sql.ConnectionPool(config).connect();
    const empresa = await connection
      .request()
      .input("IdForm", sql.NVarChar(100), data.id)
      .input("Tiempo", sql.Date, data.created_time)
      .input("Ad_Id", sql.NVarChar(100), data.ad_id)
      .input("Ad_name", sql.NVarChar(150), data.ad_name)
      .input("Adset_Id", sql.NVarChar(100), data.adset_id)
      .input("Adset_name", sql.NVarChar(100), data.adset_name)
      .input("Campaing_Id", sql.NVarChar(100), data.campaign_id)
      .input("Campaign_name", sql.NVarChar(100), data.campaign_name)
      .input("Form_Id", sql.NVarChar(100), data.form_id)
      .input("Form_name", sql.NVarChar(100), data.form_name)
      .input("Is_organic", sql.NVarChar(100), data.is_organic)
      .input("Plataforma", sql.NVarChar(20), data.platform)
      .input("Fullname", sql.NVarChar(50), data.full_name)
      .input("Telefono", sql.NVarChar(100), data.phone_number)
      .input("Email", sql.NVarChar(255), data.email)
      .execute("CRM_SubirExcelLead")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          
          return recordset;
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
async function Movimientos_CC(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresa = await connection
      .request()
      .input("IdMovimiento", sql.Int, data.IdMovimiento)
      .input("Descripcion", sql.NVarChar(sql.MAX), data.Descripcion)
      .input("TipoMovimiento", sql.Int, data.TipoMovimiento)
      .input("Cantidad", sql.Float, data.Cantidad)
      .input("IdUsuario", sql.Int, data.IdUsuario)
      .input("Img_Comprobante", sql.NVarChar(500), data.Img_Comprobante)
      .input("Divisa", sql.NVarChar(4), data.Divisa)
      .input("Fecha", sql.Date, data.Fecha)
      .input("Tipo", sql.Int, data.Egreso)
      .input("Antes", sql.Float, data.Antes)
      .execute("CRM_MovimientosCC")
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
async function obtenerMovimientosCC(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("Fecha", sql.Date, data.FechaInicio)
      .input("FechaFin", sql.Date, data.FechaFin)
      .execute("CRM_ObtenerMovimientosCC")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return {
            movimientos: recordset[0],
            movimientosUSD: recordset[1],
            saldo: recordset[2][0].Saldo,
            saldoUSD: recordset[3][0].Saldo,
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

async function EliminarMovimiento(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdMovimiento", sql.Int, id)
      .execute("CRM_CC_Eliminar")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { Deleted: true };
        } else {
          return {
            error: true,
            message: "Error, no se elimino el movimiento",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function ObtenerLotesInv(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, id)
      .execute("CC_LotesInv")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return {Persona: recordset[0][0], Lotes: recordset[1]};
        } else {
          return {
            error: true,
            message: "Error, no se elimino el movimiento",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function RegistrarPago(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const hrr = await connection
      .request()
      .input("IdPago", sql.Int, data.IdPago)
      .input("IdHR", sql.Int, data.IdHR)
      .input("IdTipoPago", sql.Int, data.IdTipoPago)
      .input("Referencia", sql.NVarChar(100), data.Referencia || null)
      .input("Importe", sql.Float, data.Importe)
      .input("IdStatus", sql.Int, data.IdStatus)
      .input("FechaPago", sql.Date, data.FechaPago)
      .input("Usr", sql.NVarChar(100), data.Usr || null)
      .input("Comprobante", sql.NVarChar(100), data.Img_Comprobante || null)
      .input("IdConcepto", sql.Int, data.IdConcepto || null)
      .execute("HR_RegistrarPago")
      .then(async (dbData) => {
        const recordset = dbData.recordsets;
        if (recordset[0]) {
          return {  result:recordset[0][0], pagos:recordset[1], lotes: recordset[2] };
        } else {
          return {
            error: true,
            message: "No se registro el pago.",
          };
        }
      });
    connection.close();
    return hrr;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function InsertarArray(arreglo = []) {
  let i = 0;
  for (const movimiento of arreglo) {
    await Movimientos_CC(movimiento);
    i++;
  }
  if (i == arreglo.length) {
    return { exito: 1 };
  }
}

async function InsertarArrayPagos(arreglo = []) {
  let i = 0;
  let res;
  for (const movimiento of arreglo) {
    console.log(movimiento)
    res = await RegistrarPago(movimiento);
    i++;
    console.log(res)
  }
  console.log('ya')
  if (i == arreglo.length) {
    return res;
  }
}

async function InsertarArrayLead(arreglo = []) {
  let i = 0;
  for (const movimiento of arreglo) {
    await SubirExcel(movimiento);
    i++;
  }
  if (i == arreglo.length) {
    return { exito: 1 };
  }
}

module.exports = {
  InsertarArrayLead,
  PersonasComisiones,
  PersonaComisiones,
  Movimientos_CC,
  SubirExcel,
  obtenerMovimientosCC,
  InsertarArray,
  Volumen,
  ObtenerTeamLider,
  EliminarMovimiento,
  InsertarArrayPagos,
  ObtenerLotesInv,
  RegistrarPago
};
