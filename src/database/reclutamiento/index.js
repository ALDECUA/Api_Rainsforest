const config = require("../config");
const sql = require("mssql");
var json2xls = require("json2xls");
var fs = require("fs");
const { json } = require("express");
const opn = require("opn");

async function obtenerSociosComerciales() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .execute("R_ListarSociosComerciales")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { personas: recordset };
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

async function obtenerInversionistasLider(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .input("IdSocioComercial", sql.Int, id || null)
      .execute("R_ListarInversionistasLider")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { personas: recordset };
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

async function obtenerInversionistasSenior(id) {
  try {
    id == 'null' ? id = 0 : null;
    const connection = await new sql.ConnectionPool(config).connect();
    const lista = await connection
      .request()
      .input("IdInversionistaLider", sql.Int, id || 0)
      .execute("R_ListarInversionistaSenior")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { personas: recordset };
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

async function listarAsesores() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .execute("ListarAsesores")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { asesores: recordset };
        } else {
          return { error: true, message: "Error" };
        }
      });

    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function obtenerInversionistasJunior(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .input("IdInversionistaSenior", sql.Int, id || null)
      .execute("R_ListarInversionistaJunior")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { personas: recordset };
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

async function obtenerCloser(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .input("IdSocioComercial", sql.Int, id || null)
      .execute("HR_Closer")
      .then(async (dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return { personas: recordset[0], promotores: recordset[1] };
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

async function sp_loginPrueba(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const login = await connection
      .request()
      .input("Correo", sql.VarChar(254), data.Correo || null)
      .input("Pwd", sql.VarChar(50), data.Pwd || null)
      .input("Nombre", sql.VarChar, data.Nombre || null)
      .input("Nombre_S", sql.VarChar, data.Nombre_S || null)
      .input("Apellido_P", sql.VarChar, data.Apellido_P || null)
      .input("Apellido_M", sql.VarChar, data.Apellido_M || null)
      .input("Sexo", sql.Int, data.Sexo || null)
      .input("Nacimeinto", sql.Date, data.Nacimiento || null)
      .input("Lugar_Nacimiento", sql.VarChar, data.Lugar_Nacimiento || null)
      .input("Num_Cel", sql.Int, data.Num_Cel || null)
      .execute("LoginApp")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          if (recordset.length > 0) {
            return recordset[0];
          } else {
            return { empty: true, message: "Error de credenciales" };
          }
        } else {
          return { error: true, message: "Error interno" };
        }
      });
    connection.close();
    return login;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function obtenerColaboradores() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const data = await connection
      .request()
      .execute("HR_Personas_obtener")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { personas: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

//PASO 1 Reclutamiento
async function insertarPersonaSimple(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const insert = await connection
      .request()
      .input("Nombre", sql.VarChar(150), data.Nombre || null)
      .input("Nombre_S", sql.VarChar(150), data.Nombre_S || "")
      .input("Apellido_Pat", sql.VarChar(150), data.Apellido_Pat || null)
      .input("Apellido_Mat", sql.VarChar(150), data.Apellido_Mat || "")
      .input("Sexo", sql.Int, data.Sexo || null)
      .input("Nacimiento", sql.DateTime, new Date(data.Nacimiento) || null)
      .input("IdNacionalidad", sql.Int, data.IdNacionalidad || null)
      .input("Num_Cel", sql.VarChar(50), data.Num_Cel || null)
      .input("Email", sql.VarChar(150), data.Email || null)
      .input("Password", sql.VarChar(50), data.Password || null)
      .input("Status", sql.TinyInt, data.Status || null)
      .input("Fecha", sql.DateTime, new Date(data.Fecha) || null)
      .input("Whats", sql.VarChar(100), data.Whats || null)
      .execute("HR_InsertarPersonaSimple")
      .then(async (dbData) => {
        //console.log(dbData);
        const recordset = dbData.recordset;
        if (recordset) {
          return { inserted: true, persona: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return insert;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

//PASO 2 Reclutamiento
async function insertarDatosGenerales(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const insert = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona || null)
      .input("IdSocio", sql.Int, 1)
      .input("EstadoCivil", sql.Int, data.EstadoCivil || null)
      .input("Hijos", sql.Int, data.Hijos || null)
      .input("Telefono", sql.VarChar(50), data.Telefono || null)
      .input("Celular", sql.VarChar(150), data.Celular || null)
      .input("Direccion", sql.VarChar(150), data.Direccion || null)
      .input("Nivel", sql.Int, data.Nivel || null)
      .input("Scom", sql.Int, data.Scom || null)
      .input("Lider", sql.Int, data.Lider || null)
      .input("Senior", sql.Int, data.Senior || null)
      .execute("R_ActualizarDatosGeneralesPersona")
      .then(async (dbData) => {
        //console.log(dbData);
        const recordset = dbData.recordset;
        if (recordset) {
          return { updated: true, persona: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return insert;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

//PASO 3 Reclutamiento
async function insertarDatosBancarios(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const insert = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona || null)
      .input("Titular", sql.VarChar(60), data.Titular || null)
      .input("Banco", sql.VarChar(60), data.Banco || null)
      .input("Clabe", sql.VarChar(80), data.Clabe || null)
      .input("Archivo", sql.VarChar(120), data.Archivo || null)
      .execute("R_ActualizarDatosBancariosPersona")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { updated: true, persona: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return insert;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

//PASO 4 Reclutamiento
async function insertarDocumentosSimples(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const insert = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona || null)
      .input("Selfie", sql.VarChar(100), data.Selfie || null)
      .input(
        "IdentificacionFrente",
        sql.VarChar(100),
        data.IdentificacionFrente || null
      )
      .input(
        "IdentificacionReverso",
        sql.VarChar(100),
        data.IdentificacionReverso || null
      )
      .input(
        "ComprobanteDomicilio",
        sql.VarChar(100),
        data.ComprobanteDomicilio || null
      )
      .input("CURP", sql.VarChar(100), data.Curp || data.CURP)
      .input("RFC", sql.VarChar(100), data.Rfc || data.RFC)
      .execute("R_CargarDocumentosGeneralesPersona")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { updated: true, archivos: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return insert;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function actualizarEstatusEnvioEmail(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const update = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona || null)
      .execute("R_ActualizarStatusEmailEnviado")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { updated: true };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return update;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

//#MODULO DEL CRM
async function obtenerDatosPersonaId(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const update = await connection
      .request()
      .input("IdPersona", sql.Int, id || null)
      .execute("ObtenerDatosPersonaPorId")
      .then(async (dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return { persona: recordset[0], archivos: recordset[1] };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return update;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function updateArchivoSP(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const update = await connection
      .request()
      .input("IdArchivo", sql.Int, data.IdArchivo || null)
      .input("EstatusGeneral", sql.Int, data.EstatusGeneral || null)
      .input("Notas", sql.VarChar(255), data.Notas || null)
      .input("IdPersona", sql.Int, data.IdPersona || null)
      .execute("HR_ActualizarArchivos")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { updated: true };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return update;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function obtenerCumpleanos() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const cumples = await connection
      .request()
      .execute("R_ObtenerCumpleanios")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { personas: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();

    return cumples;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function obtenerCumplesFiltrados(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const update = await connection
      .request()
      .input("Mes", sql.Int, data.Mes || null)
      .input("Nombre", sql.NVarChar(100), data.Nombre)
      .execute("RH_Filtrar_Cumpleanios")
      .then(async (dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
         
          var nombre_doc = data.Mes + ".xlsx";
          var xls = json2xls(recordset[0]);
          fs.writeFileSync(nombre_doc, xls, "binary");
          return recordset[0];
        } else {
          return { error: true, message: "Error interno" };
        }
      });
    connection.close();
    return update;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function Actualizar_Persona_reclutamiento(data) {
  try {

    const connection = await new sql.ConnectionPool(config).connect();
    const insert = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona || null)
      .input("IdNivel", sql.Int, data.IdNivel || null)
      .input("EstatusGeneral", sql.Int, data.EstatusGeneral || null)
      .input("Nombre", sql.VarChar(150), data.Nombre || null)
      .input("Nombre_S", sql.VarChar(70), data.Nombre_S || null)
      .input("Apellido_P", sql.VarChar(150), data.Apellido_P || null)
      .input("Apellido_M", sql.VarChar(150), data.Apellido_M || " ")
      .input("IdSexo", sql.Int, data.IdSexo || null)
      .input("IdEstadoCivil", sql.Int, data.IdEstadoCivil || null)
      .input("Edad", sql.Int, data.Edad || null)
      .input("Fch_Nacimiento", sql.Date, data.Fch_Nacimiento || null)
      .input("IdNacionalidad", sql.Int, data.IdNacionalidad || null)
      .input("N_Hijos", sql.Int, data.N_Hijos || null)
      .input("RFC", sql.VarChar(50), data.RFC || null)
      .input("CURP", sql.VarChar(50), data.CURP || null)
      .input("Email", sql.VarChar(150), data.Email || null)
      .input("Num_Cel", sql.VarChar(15), data.Num_Cel || null)
      .input("Num_Tel", sql.VarChar(15), data.Num_Tel || null)
      .input("Direccion", sql.VarChar(150), data.Direccion || null)
      .input("IdSCom", sql.Int, +data.IdSCom)
      .input("IdILider", sql.Int, +data.IdILider)
      .input("IdISenior", sql.Int, +data.IdISenior)
      .execute("R_ActualizarPersona")
      .then(async (dbData) => {
        //console.log(dbData);
        const recordset = dbData.recordset;
        if (recordset) {
          return { inserted: true, persona: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return insert;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function ActualizarDatosBancarios(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const insert = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona || null)
      .input("Titular_Banco", sql.VarChar(60), data.Titular_Banco || null)
      .input("Banco", sql.VarChar(60), data.Banco || null)
      .input("CLABE", sql.VarChar(80), data.CLABE || null)
      .input("SWIFT", sql.VarChar(120), data.SWIFT || null)
      .execute("R_ActualizarDatosBancarios2")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { updated: true, persona: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return insert;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function ActualizarEdades() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const edades = await connection
      .request()
      .execute("RH_ActualizarEdades")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { personas: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();

    return edades;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function OrganigramaSocioComercial(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const insert = await connection
      .request()
      .input("IdSocioCom", sql.Int, data.IdSocioCom)
      .execute("RH_Organigrama_SocioCom")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { personas: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return insert;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function verificarEmail(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const update = await connection
      .request()
      .input("Email", sql.NVarChar, data.Email || null)
      .execute("VerificarEmail")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset[0];
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return update;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function obtenerAsesores(Scom, Lider) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();

    const lista = await connection
      .request()
      .input("ILider", sql.Int, Lider)
      .input("Scom", sql.Int, Scom)
      .execute("R_ListarAsesoresLider")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { asesores: recordset };
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

async function OrganigramaSocioComercial(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const insert = await connection
      .request()
      .input("IdSocioCom", sql.Int, data.IdSocioCom)
      .execute("RH_Organigrama_SocioCom")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { personas: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return insert;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function ListarPersonasFxcoins() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const insert = await connection
      .request()
      .execute("SP_PersonasConFxCoins")
      .then(async (dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return { asesores: recordset[0], inversionistas: recordset[1] };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return insert;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function ListarAsesoresActivos() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const insert = await connection
      .request()
      .execute("RH_ObtenerActivos")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { personas: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });

    connection.close();
    return insert;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

module.exports = {
  sp_loginPrueba,
  obtenerColaboradores,
  insertarPersonaSimple,
  insertarDatosGenerales,
  obtenerSociosComerciales,
  obtenerInversionistasLider,
  obtenerInversionistasSenior,
  listarAsesores,
  obtenerInversionistasJunior,
  obtenerCloser,
  insertarDatosBancarios,
  insertarDocumentosSimples,
  actualizarEstatusEnvioEmail,
  obtenerDatosPersonaId,
  obtenerCumpleanos,
  updateArchivoSP,
  obtenerCumplesFiltrados,
  Actualizar_Persona_reclutamiento,
  ActualizarDatosBancarios,
  ActualizarEdades,
  OrganigramaSocioComercial,
  verificarEmail,
  obtenerAsesores,
  ListarPersonasFxcoins,
  ListarAsesoresActivos,
};
