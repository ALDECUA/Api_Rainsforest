const config = require("../config");
const sql = require("mssql");

async function obtenerDatosDesarrollos() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const regimen = await connection
      .request()
      .execute("WA_contenidoDesarrollos")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          if (recordset.length > 0) {
            return recordset;
          } else {
            return { empty: true, message: "No hay régimenes" };
          }
        } else {
          return { error: true, message: "Error Interno" };
        }
      });
    connection.close();
    return regimen;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function obtenerDatosDesarrollosHR() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const regimen = await connection
      .request()
      .execute("HR_LotesObtener")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          if (recordset.length > 0) {
            return recordset;
          } else {
            return { empty: true, message: "No hay régimenes" };
          }
        } else {
          return { error: true, message: "Error Interno" };
        }
      });
    connection.close();
    return regimen;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function sp_listarPaises() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const paises = await connection
      .request()
      .execute("sp_listarPaises")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          if (recordset.length > 0) {
            return recordset;
          } else {
            return { empty: true, message: "No hay paises" };
          }
        } else {
          return { error: true, message: "Error Interno" };
        }
      });
    connection.close();
    return paises;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function ObtenerTodosDocumentos(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .input("IdDesarrollo", sql.Int, id)
      .execute("WA_ObtenerTodosDocumentos")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function VerificarIP(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IP", sql.NVARCHAR(50), data.IP)
      .input("URL", sql.NVARCHAR(50), data.URL)
      .input("IdStatus", sql.Int, data.IdStatus)
      .input("Agente", sql.NVARCHAR(200), data.Agente)
      .execute("FX_Aceptar")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return recordset[0];
        } else {
          return {
            error: true,
            message: "Algo salio mal",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function ObtenerDocumentosFiltrados(data) {
  try {
    console.log(data);
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .input("IdDesarrollo", sql.Int, data.IdDesarrollo)
      .input("IdEtapa", sql.Int, data.IdEtapa)
      .input("Carpeta", sql.NVarChar(60), data.Carpeta)
      .input("Status", sql.Int, data.Status)
      .execute("WA_DocumentosFiltrados")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function ObtenerDocumentosFiltradosLegal(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .input("IdDesarrollo", sql.Int, data.IdDesarrollo)
      .input("IdEtapa", sql.Int, data.IdEtapa)
      .input("Carpeta", sql.NVarChar, data.Carpeta)
      .execute("WA_DocumentosFiltradosLegal")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function eliminarArchivo(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .input("IdArchivo", sql.Int, data.IdArchivo)
      .execute("WA_EliminarArchivo")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset[0];
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function ModificarNombre(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .input("IdArchivo", sql.Int, data.IdArchivo)
      .input("NewNombre", sql.NVarChar(150), data.NewNombre)
      .execute("WA_ModificarNombre")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset[0];
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function eliminarArchivoLegal(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .input("IdArchivo", sql.Int, data.IdArchivo)
      .execute("WA_EliminarArchivoLegal")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset[0];
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function editarArchivo(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    console.log('data---');
    console.log(data);
    const lista = await connection
      .request()
      .input("IdArchivoDrive", sql.Int, data.IdArchivoDrive)
      .input("Documento", sql.NVarChar(150), data.Document)
      .input("Titulo", sql.NVarChar(150), data.Titulo)
      .input("IdArchivo", sql.NVarChar(150), data.IdArchivo)
      .input("Img_Archivo", sql.NVarChar(150), data.Img_Archivo)
      .execute("WA_EditarArchivoDrive")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset[0];
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function editarArchivoLegal(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .input("IdArchivo", sql.Int, data.IdArchivo)
      .input("Img_Archivo", sql.NVarChar, data.Img_Archivo)
      .execute("WA_EditarArchivoDriveLegal")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset[0];
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function sp_listarEstados() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const paises = await connection
      .request()
      .execute("CAT_EstadosObtener")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          if (recordset.length > 0) {
            return recordset;
          } else {
            return { empty: true, message: "No hay estados" };
          }
        } else {
          return { error: true, message: "Error Interno" };
        }
      });
    connection.close();
    return paises;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function ObtenerCotizacion(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .input("IdCotizacion", sql.Int, id)
      .execute("WA_InfoCotizacion")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          if (recordset[0]) {
            return recordset[0];
          } else {
            return { error: true, message: "No existe ID" };
          }
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function ContratosEquipo(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .input("IdPersona", sql.Int, id)
      .execute("WA_Equipo")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          if (recordset[0]) {
            return recordset;
          } else {
            return { error: true, message: "Sin equipo" };
          }
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function Asignaciones(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .input("IdPersona", sql.Int, id)
      .execute("WA_ObtenerAsignaciones")
      .then(async (dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return { PorAsignar: recordset[0], A:recordset[1], B:recordset[2], Top: recordset[3]} 
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function AsignarHR(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .input("Id", sql.Int, data.Id)
      .input("IdStatus", sql.Int, data.IdStatus)
      .input("IdPersona",sql.Int, data.IdUsuario)
      .execute("WA_AsignarLado")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return {Updated: 1, Top: recordset} ;
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
module.exports = {
  obtenerDatosDesarrollos,
  obtenerDatosDesarrollosHR,
  sp_listarPaises,
  ObtenerTodosDocumentos,
  ObtenerDocumentosFiltrados,
  VerificarIP,
  eliminarArchivo,
  editarArchivo,
  sp_listarEstados,
  ObtenerDocumentosFiltradosLegal,
  eliminarArchivoLegal,
  editarArchivoLegal,
  ModificarNombre,
  ObtenerCotizacion,
  ContratosEquipo,
  Asignaciones,
  AsignarHR
};
