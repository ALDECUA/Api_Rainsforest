const config = require("../config");
const sql = require("mssql");
const { json, text } = require("body-parser");

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
async function InsertarInteresadoCOP(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const persona = await connection
      .request()
      .input("Nombre", sql.NVarChar(100), data.Nombre)
      .input("Apellidos", sql.NVarChar(100), data.Apellidos)
      .input("Email", sql.NVarChar(254), data.Email)
      .input("Telefono", sql.NVarChar(16), data.Telefono)
      .input("Mensaje", sql.NVarChar(4000), data.Mensaje)
      .input("Origen", sql.NVarChar(50), data.Origen)
      .execute("COP_InsertarFormulario")
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
async function calculadoraInteres(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    console.log(data);
    const result = await connection
      .request()
      .input("InversionInicial", sql.Float, data.InversionInicial || null)
      .input("MesesInversion", sql.Int, data.MesesInversion || null)
      .input("Intereses", sql.Float, data.Intereses || null)
      .execute("FX_CalculadoraDeInteres")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        console.log(recordset);
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
async function FX_EjecutarVariosSP() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const edades = await connection
      .request()
      .execute("FX_EjecutarVariosSP")
      .then(async (dbData) => {
        const recordset = dbData.recordsets;
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
async function calculadoraCOP(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    console.log(data);
    const result = await connection
      .request()
      .input("AnosInversion", sql.Int, data.AnosInversion)
      /* .input("Plusvalia", sql.Float, data.Plusvalia)
        .input("Renta", sql.Float, data.Renta) */
      .input("Inversion", sql.Float, data.Inversion)
      .input("Rentabilidad", sql.Float, data.Rentabilidad)
      .execute("COP_Calculadora2")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        console.log(recordset);
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
async function CrearInvitado(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    console.log(data);
    const result = await connection
      .request()
      .input("Nombre", sql.NVarChar(500), data.Nombre)
      .input("NombreS", sql.NVarChar(100), data.NombreS || null)
      .input("ApellidoP", sql.NVarChar(100), data.ApellidoP)
      .input("ApellidoM", sql.NVarChar(100), data.ApellidoM || null)
      .input("Residente", sql.TinyInt, data.Residente)
      .input("Ciudad", sql.NVarChar(100), data.Ciudad)
      .input("Estado", sql.NVarChar(100), data.Estado)
      .input("Cp", sql.NVarChar(100), data.Cp)
      .input("Regalo", sql.TinyInt, data.Regalo)
      .input("Regaloc", sql.NVarChar(100), data.Regaloc || null)
      .input("IdInvito", sql.Int, data.IdInvito)
      .input("Locacion", sql.NVarChar(100), data.Locacion)
      .execute("SV_CrearInvitado")
      .then((dbData) => {
        const recordset = dbData.recordset[0];
        console.log(recordset);
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

async function obtenerTickets() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .execute("COP_Tickets")
      .then((dbData) => {
        const recordset = dbData.recordsets;

        if (recordset) {
          return { info: recordset[2], promos: recordset[1] };
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
async function obtenerInvitados() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .execute("SV_ObtenerInvitados")
      .then((dbData) => {
        const recordset = dbData.recordsets;

        if (recordset) {
          return { invitados: recordset[0], encuestas: recordset[1] };
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
async function EditarInvitado(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    console.log(data);
    const result = await connection
      .request()
      .input("Apellido_M", sql.NVarChar(100), data.Apellido_M || null)
      .input("Apellido_P", sql.NVarChar(100), data.Apellido_P)
      .input("CP", sql.NVarChar(100), data.CP)
      .input("Ciudad", sql.NVarChar(100), data.Ciudad)
      .input("CiudadActual", sql.NVarChar(100), data.CiudadActual)
      .input("ConsentimientoDuracion", sql.TinyInt, data.ConsentimientoDuracion)
      .input("Estado", sql.NVarChar(100), data.Estado)
      .input("EstadoActual", sql.NVarChar(100), data.EstadoActual)
      .input("Fch_Nacimiento", sql.Date, data.Fch_Nacimiento)
      .input("Fch_Registro", sql.Date, data.Fch_Registro)
      .input("Hijos", sql.Int, data.Hijos || 0)
      .input("IdEstadoCivil", sql.TinyInt, data.IdEstadoCivil)
      .input("IdPersona", sql.Int, data.IdPersona)
      .input("Ingreso", sql.NVarChar(100), data.Ingreso)
      .input("InversionTierra", sql.TinyInt, data.InversionTierra)
      .input(
        "InversionTierraLugar",
        sql.NVarChar(100),
        data.InversionTierraLugar
      )
      .input("Nombre", sql.NVarChar(100), data.Nombre)
      .input("Nombre_S", sql.NVarChar(100), data.Nombre_S || null)
      .input("Ocupacion", sql.NVarChar(100), data.Ocupacion)
      .input("RFC", sql.NVarChar(100), data.RFC)
      .input("Regalo_bool", sql.TinyInt, data.Regalo_bool)
      .input("Regalo_txt", sql.NVarChar(100), data.Regalo_txt || null)
      .input("Residente_bool", sql.TinyInt, data.Residente_bool)
      .input("Tarjeta", sql.NVarChar(100), data.Tarjeta)
      .input("celular", sql.NVarChar(100), data.celular)
      .input("colonia", sql.NVarChar(100), data.colonia)
      .input("email", sql.NVarChar(100), data.email)
      .input("telefono", sql.NVarChar(100), data.telefono)
      .input("IdSeg", sql.Int, data.Seg)
      .input("Comentarios", sql.NVarChar(500), data.comentarios)
      .execute("SV_EditarInvitado")
      .then((dbData) => {
        const recordset = dbData.recordset[0];
        console.log(recordset);
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
async function insertarSurvey(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    console.log(data);
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona)
      .input("R1", sql.NVarChar(10000), data.R1)
      .input("R2", sql.NVarChar(10000), data.R2)
      .input("R3", sql.NVarChar(10000), data.R3)
      .input("R4", sql.NVarChar(10000), data.R4)
      .input("R5", sql.NVarChar(10000), data.R5)
      .input("R6", sql.NVarChar(10000), data.R6)
      .input("R7", sql.NVarChar(10000), data.R7)
      .input("R8", sql.NVarChar(10000), data.R8)
      .input("R9", sql.NVarChar(10000), data.R9)
      .input("R10", sql.NVarChar(10000), data.R10)
      .input("R11", sql.NVarChar(10000), data.R11)
      .input("R12", sql.NVarChar(10000), data.R12)
      .input("R13", sql.NVarChar(10000), data.R13)
      .input("R14", sql.NVarChar(10000), data.R14)
      .input("R15", sql.NVarChar(10000), data.R15)
      .input("R16", sql.NVarChar(10000), data.R16)
      .input("R17", sql.NVarChar(10000), data.R17)
      .input("R18", sql.NVarChar(10000), data.R18)
      .input("R19", sql.NVarChar(10000), data.R19)
      .input("R20", sql.NVarChar(10000), data.R20)
      .input("R21", sql.NVarChar(10000), data.R21)
      .input("R22", sql.NVarChar(10000), data.R22)
      .input("R23", sql.NVarChar(10000), data.R23)
      .input("R24", sql.NVarChar(10000), data.R24)
      .input("R25", sql.NVarChar(10000), data.R25)
      .input("R26", sql.NVarChar(10000), data.R26)
      .input("Seguimiento", sql.Int, data.Seg)
      .execute("SV_InsertarSurvey")
      .then((dbData) => {
        const recordset = dbData.recordset[0];
        console.log(recordset);
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
async function getSurvey(IdPersona) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .input("IdPersona", sql.Int, IdPersona)
      .execute("SV_VerSurvey")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { respuestas: recordset };
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
async function calcularFraxiones(Gastos) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .input("Gastos", sql.Float, Gastos)
      .execute("COP_CalcularFraxiones")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { respuestas: recordset };
        } else {
          return {
            error: true,
            message: "No se pudieron obtener los datos de fraxiones",
          };
        }
      });

    connection.close();
    return empresas;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function getInvitado(IdPersona) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .input("IdPersona", sql.Int, IdPersona)
      .execute("SV_InfoInvitado")
      .then((dbData) => {
        const recordset = dbData.recordset[0];
        if (recordset) {
          return { invitado: recordset };
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
async function insertarHRInvitado(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona)
      .input("IdInvitado", sql.Int, data.IdInvitado)
      .execute("SV_RegistrarHR")
      .then((dbData) => {
        const recordset = dbData.recordset[0];
        if (recordset) {
          return { recordset };
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
async function obtenerInvitadores() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .execute("SV_ObtenerInvitadores")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { personas: recordset };
        } else {
          return {
            error: true,
            message: "No se pudieron obtener los datos de los invitadores",
          };
        }
      });

    connection.close();
    return empresas;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function obtenerLocacion() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .execute("SV_ObtenerLoc")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { loc: recordset };
        } else {
          return {
            error: true,
            message: "No se pudieron obtener las locaciones",
          };
        }
      });

    connection.close();
    return empresas;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function obtenerDocumentos() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .execute("FX_DocumentosDrive")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          for (let i = 0; i < 3; i++) {
            if (recordset[2][i] == undefined) {
              recordset[2][i] = { Foto: "noone.png" };
            }
          }
          return {
            archivos: recordset[0],
            notificaciones: recordset[1],
            TopAsesores: recordset[2],
          };
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

async function pagoslead(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const pagos = await connection
      .request()
      .input("Email", sql.NVarChar(250), data.Email)
      .input("Telefono", sql.NVarChar(50), data.Telefono)
      .input("Nombre", sql.NVarChar(150), data.Nombre)
      .input("Lote", sql.Text, data.Concepto)
      .input("IdDesarrollo", sql.Int, data.IdDesarrollo)
      .execute("TRF_Agregardatos")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se logro ingresar el lead",
          };
        }
      });
    connection.close();
    return pagos;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function infoCotizador(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const pagos = await connection
      .request()
      .input("IdAsesor", sql.Int, data.IdAsesor)
      .input("Email", sql.NVarChar(250), data.Email)
      .input("Interesado", sql.NVarChar(80), data.Interesado)
      .input("Telefono", sql.NVarChar(50), data.Telefono)
      .input("IdStatus", sql.Int, data.Estatus)
      .input("Lotes_Informacion", sql.Text, data.LotesInformacion)
      .input("IdLote_Interesado", sql.Text, data.loteInteresado)
      .input("Link", sql.Text, data.pdf)
      .execute("WA_InsertarInfCotizador")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se guardo cotizador",
          };
        }
      });
    connection.close();
    return pagos;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function obtenerNumero() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .execute("FX_NumeroSC")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { numero: recordset[0].Telefono };
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
async function tupatrimonioenelcaribe(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .input("Nombre", sql.NVarChar(250), data.nombre)
      .input("Email", sql.NVarChar(250), data.email)
      .input("Telefono", sql.NVarChar(250), data.telefono)
      .input("Respuesta_1", sql.NVarChar(250), data.cantidad)
      .execute("Informes_caribe")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (!recordset[0].Error) {
          return { res: true, mensaje: recordset };
        } else {
          return {
            error: true,
            message: "No ingreso todos los datos",
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
  InsertarInteresadoCOP,
  calculadoraInteres,
  FX_EjecutarVariosSP,
  calculadoraCOP,
  obtenerTickets,
  CrearInvitado,
  obtenerInvitados,
  EditarInvitado,
  insertarSurvey,
  getSurvey,
  calcularFraxiones,
  getInvitado,
  insertarHRInvitado,
  obtenerInvitadores,
  obtenerLocacion,
  obtenerDocumentos,
  pagoslead,
  obtenerNumero,
  tupatrimonioenelcaribe,
  infoCotizador,
};
