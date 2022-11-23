const config = require("../config");
const sql = require("mssql");

async function listarLotes() {
  try { 
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .execute("FX_ReporteLotes")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return recordset;
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
async function EliminarColumna(a) {
  try { 
   
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("NameColumna", sql.NVarChar(), a)
      .execute("CRM_EliminarColumna")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return recordset;
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
async function InsertarColumna(a) {
  try { 
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("NameColumna", sql.NVarChar(), a)
      .execute("CRM_InsertarColumna")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return recordset;
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
async function ObtenerNiveles() {
  try { 
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .execute("CRM_ObtenerComisiones")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return recordset;
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

async function ObtenerComisiones(data) {
  try { 
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("Mes", sql.Int, data.Mes)
      .input("Opcion", sql.Int, data.Opcion)
      .input("IdSC", sql.Int, data.IdSC || null)
      .execute("CRM_ObtenerComisiones2")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
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

async function volumenHR(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("FechaInicio", sql.Date, data.FechaInicio || null)
      .input("FechaFinal", sql.Date, data.FechaFinal || null)
      .input("IdDesarrollo", sql.Int, data.IdDesarrollo || null)
      .execute("FX_VolumenDinero")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
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
async function InsertarComisiones(data) {
  try {
   
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("Venta", sql.VarChar(100), data.Venta || null)
      .input("Fx", sql.VarChar(), data.Fx || null)
      .input("Ecoins", sql.Float, data.Ecoins || null)
      .input("Interes", sql.Float, data.Interes || null)
      .input("Opcion", sql.Int, data.Opcion )
      .input("AcDe", sql.Int, data.AcDe || 0)
      .input("iduser", sql.Int, data.iduser )
      .input("iduserCO", sql.NVarChar(100), data.iduser )
      .input("Nivel", sql.NVarChar(200), data.Nivel || null)
      .input("Id", sql.Int, data.Id )
      .input("IdCO", sql.NVarChar(100), data.Id )
      .execute("CRM_EditarComisiones")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
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


async function InsertarNuevoNivel(data) {
  try {
  
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("NivelNuevo", sql.NVarChar(150), data.NivelNuevo )
      .input("iduser", sql.Int, data.iduser )
      .execute("CRM_InsertarNuevoNivel")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
         
          return recordset;
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
async function ReportesCotizaciones() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .execute("CRM_ObtenerCotizaciones")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
      
          return recordset;
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

async function obtenerparqueid(data) {
  try {
    let dosresultados;
    const result = await config.query('SELECT * FROM parquereserva AS PR  JOIN parques AS P ON PR.ParkeName = P.Nombre JOIN reserva AS R ON R.IdReserva = PR.IdReserva JOIN personas AS PE ON PE.IdPersonas = R.IdPersonas  WHERE P.IdParque = ? order by PR.Total DESC;',[data]);

    const datos = await config.query('SELECT DISTINCT Tour FROM parquereserva PR JOIN parques P ON PR.ParkeName = P.Nombre WHERE P.IdParque = ?;',[data]);

    if (JSON.parse(JSON.stringify(result[0]))) {
      
       dosresultados = {
        datosparques : JSON.parse(JSON.stringify(result[0])),
        parques : JSON.parse(JSON.stringify(datos[0]))
      }

      return dosresultados;
    } else {
      return {
        error: true,
        message: "Error, no se encontraron los registros",
      };
    }


  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function parquesrainfores() {
  try {
    const result = await config.query('SELECT Nombre,IdParque FROM parques WHERE Status = 1');

    if (JSON.parse(JSON.stringify(result[0]))) {
      
      return JSON.parse(JSON.stringify(result[0]));
    } else {
      return {
        error: true,
        message: "Error, no se encontraron los registros",
      };
    }


  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function ReportesCotizacionesCRM() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .execute("CRM_ChartReportesCotizacion")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset[0];
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

async function reporteHR() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .execute("HR_ReporteGeneral")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
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

async function reporteFiltradoHR(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const desarrollo = await connection
      .request()
      .input("IdTipoPago", sql.Int, data.IdTipoPago || null)
      .input("FechaInicio", sql.Date, data.FechaInicio || null)
      .input("FechaFinal", sql.Date, data.FechaFinal || null)
      .input("IdStatus", sql.Int, data.IdStatus || null)
      .input("Desarrollo", sql.Int, data.Desarrollo || null)
      .input("Etapa", sql.Int, data.Etapa || null)
      .execute("HR_ReporteFiltrado")
      .then((dbData) => {
        const recordset = dbData.recordset;

        if (recordset[0]) {
          return recordset;
        } else {
          return {
            error: true,
            message: "Busqueda sin resultados",
          };
        }
      });

    connection.close();
    return desarrollo;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function reporteHRfiltro(data) {

  try {
    const connection =  await new sql.ConnectionPool(config).connect();
    const result = await connection
    .request()
    .input("FechaInicio", sql.Date, data.FechaInicio || null)
    .input("FechaFin", sql.Date, data.FechaFinal || null)
    .input("IdSC", sql.Int, data.idsc || null)
    .execute("FX_ReporteHR")
    .then((dbData) =>{

      const recordset = dbData.recordset;

      if (recordset) {
        return { hr: recordset}
      }else{
        return {
          error: true,
          message: "No Hay datos",
        };
      }

    });

    connection.close();
    return result;
    
  } catch (error) {
    return { error: true, message: error.message };
  }
  
}

async function calculoOver(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("FechaInicio", sql.Date, data.FechaInicio || null)
      .input("FechaFinal", sql.Date, data.FechaFinal || null)
      .input("IdSC", sql.Int, data.IdSC || null)
      .execute("FX_CalculoOver")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return recordset;
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
async function reporteECE() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .execute("FX_InvReporteECE")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return recordset;
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
async function hrsTANA() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .execute("CRM_RP_Hrs")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return recordset;
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
async function reporteEncuestas() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .execute("CRM_ReporteEncuestas")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return recordset;
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
async function reporteInv(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdSexo", sql.Int, data.IdSexo || null)
      .input("IdEstadoCivil", sql.Int, data.IdEstadoCivil || null)
      .input("IdDesarrollo", sql.Int, data.IdDesarrollo || null)
      .input("IdEtapa", sql.Int, data.IdEtapa || null)
      .input("Mensualidades", sql.Int, data.Mensualidades || null)
      .input("IdMetodoPago", sql.Int, data.IdMetodoPago || null)
      .input("IdTipoPago", sql.Int, data.IdTipoPago || null)
      .execute("FX_ReporteInv")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return { inversionistas : recordset};
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
async function reporteInvSimple(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("Email", sql.NVarChar, data.Email || null)
      .input("Num_Tel", sql.NVarChar, data.Num_Tel || null)
      .input("Num_Cel", sql.NVarChar, data.Num_Cel || null)
      .execute("FX_ReporteInvSimple")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return  recordset;
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
async function reporteSexo() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .execute("FX_ReporteSexo")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return recordset;
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
async function obtenerReferidosInversionista(IdInversionista) {
  try {
      const connection = await new sql.ConnectionPool(config).connect();
      const referidos = await connection
          .request()
          .input('IdInversionista', sql.Int, IdInversionista)
          .execute("FX_ReferidosInversionistaID")
          .then((dbData) => {
              const recordset = dbData.recordset;

              if (recordset) {
                  return { referidos: recordset };
              } else {
                  return {
                      error: true,
                      message: "No se pudieron actualizar los datos de empresa.",
                  };
              }
          });

      connection.close();
      return referidos;
  } catch (error) {
      return { error: true, message: error.message };
  }
}
async function reporteAsesoresSimple() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .execute("FX_ReporteAsesoresSimple")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return recordset;
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
async function reporteInvConRef() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .execute("FX_ReporteInvConRef")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return recordset;
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



module.exports = {
  listarLotes,
  volumenHR,
  reporteHR,
  reporteFiltradoHR,
  calculoOver,
  reporteECE,
  hrsTANA,
  reporteInv,
  reporteInvSimple,
  reporteSexo,
  obtenerReferidosInversionista,
  reporteAsesoresSimple,
  reporteHRfiltro,
  reporteInvConRef,
  ReportesCotizaciones,
  ReportesCotizacionesCRM,
  ObtenerNiveles,
  ObtenerComisiones,
  InsertarComisiones,
  InsertarNuevoNivel,
  InsertarColumna,
  EliminarColumna,
  reporteEncuestas,
  parquesrainfores,
  obtenerparqueid
};
