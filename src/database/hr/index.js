const config = require("../config");
const sql = require("mssql");

async function insertarPersona(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const persona = await connection
      .request()
      .input("Nombre", sql.NVarChar(100), data.Nombre)
      .input("Nombre_S", sql.NVarChar(100), data.Nombre_S || null)
      .input("Apellido_P", sql.NVarChar(100), data.Apellido_P || " ")
      .input("Apellido_M", sql.NVarChar(100), data.Apellido_M || " ")
      .input("Num_Cel", sql.NVarChar(30), data.Num_Tel || data.celular)
      .input("WhatssApp", sql.NVarChar(25), data.WhatssApp || data.WhatsApp)
      .input("Email", sql.NVarChar(255), data.Email || data.email)
      .input("Direccion", sql.NVarChar(100), data.Direccion)
      .input("Estado", sql.NVarChar(100), data.Estado)
      .input("Ciudad", sql.NVarChar(100), data.Ciudad)
      .input("Fch_Nacimiento", sql.Date, data.Fch_Nacimiento)
      .input("Lugar_Nacimiento", sql.NVarChar(60), data.Lugar_Nacimiento)
      .input("IdEstadoCivil", sql.Int, data.IdEstadoCivil)
      .input("Ocupacion", sql.NVarChar(60), data.Ocupacion)
      .input("Edad", sql.Int, data.Edad)
      .input("IdSexo", sql.Int, data.IdSexo)
      .input("IdRegimen", sql.Int, data.IdRegimen)
      .execute("HR_InsertarPersonaDelHr")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return { insert: true, record: recordset[0] };
        } else {
          return {
            error: true,
            message: "No se inserto la persona",
          };
        }
      });
    connection.close();
    return persona;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function insertarHr(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const hrr = await connection
      .request()
      /* Datos agente */
      .input("IdOrigen", sql.Int, data.IdOrigen || 4)
      .input("IdPlaza", sql.Int, data.IdPlaza || 2)
      .input("IdCloser", sql.Int, data.IdCerrador || null)

      /* Datos del lote */
      .input("IdPersona", sql.Int, data.IdPersona)
      .input("IdAsesor", sql.Int, data.IdAsesor)
      .input("IdDesarrollo", sql.Int, data.IdDesarrollo)
      .input("IdLote", sql.Int, data.IdLote)
      .input("Precio_M2", sql.Int, data.Precio_M2)
      .input("M2", sql.Int, data.M2)
      .input("Precio_Total", sql.Float, data.Precio_Total)
      .input("Forma_Compra", sql.Int, data.Forma_Compra)
      .input("IdMetodoPago", sql.Int, data.IdMetodoPago)
      .input("Enganche", sql.Float, data.Enganche || 0)
      .input("Mensualidades", sql.Int, data.Mensualidades || 0)
      .input("Fecha_Enganche", sql.Date, data.Fecha_Enganche || null)
      .input("Img_Comprobante", sql.VarChar, data.Img_Comprobante || null)

      /* Organigrama */
      .input("IdAsociado", sql.Int, data.IdAsociado || null)
      .input("IdTeamLider", sql.Int, data.IdTeamLider || null)
      .input("UserExists", sql.Int, data.UserExists || 0)

      .input("Observaciones", sql.NVarChar, data.Observaciones || null)
      .input("IdReferido", sql.Int, data.IdReferido || null)
      .input("Usuario", sql.Int, data.Usr || null)
      .input("IdPromotor", sql.Int, data.IdPromotor || null)
      .input("referido", sql.Int, data.referido || 0)
      .input("Cotizacion",sql.Int, data.Cotizacion || null)
      .input("Campana",sql.Int, data.IdCampana || null)
      .execute("HR_InsertarRegistroHr")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return { insert: true, record: recordset[0] };
        } else {
          return {
            error: true,
            message: "No se insertaron los documentos.",
          };
        }
      });
    connection.close();
    return hrr;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function insertarDocumentos(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const docs = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona)
      .input("ActaNacimiento", sql.NVarChar(100), data.ActaNacimiento)
      .input("CURP", sql.NVarChar(100), data.CURP)
      .input(
        "ComprobanteDomicilio",
        sql.NVarChar(100),
        data.ComprobanteDomicilio
      )
      .input("INE_F", sql.NVarChar(100), data.INE_F)
      .input("INE_R", sql.NVarChar(100), data.INE_R)
      .input("ComprobantePago", sql.NVarChar(100), data.ComprobantePago)
      .input("ActaMatrimonio", sql.NVarChar(100), data.ActaMatrimonio)
      .input("FechaComprobante", sql.Date, data.FechaComprobante)
      .input("Notas", sql.NVarChar(255), data.Notas || "Sin observación")
      .execute("HR_InsertarDocumentosHr")
      .then(async (dbData) => {
        //
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return { insert: true, record: recordset };
        } else {
          return {
            error: true,
            message: "No se insertaron los documentos.",
          };
        }
      });

    connection.close();
    return docs;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function insertarBonoRed(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const bono = await connection
      .request()
      .input("IdHr", sql.Int, data.IdHr)
      .input("IdOrigen", sql.Int, data.IdOrigen || 4)
      .input("Correo", sql.NVarChar(255), data.Correo)
      .input("Fch_Nacimiento", sql.Date, data.Fch_Nacimiento)
      .input("Nombre_Beneficiario", sql.NVarChar(100), data.Nombre_Beneficiario)
      .input("PrcFxCoins", sql.Int, data.PrcFxCoins)
      .input("ECoins", sql.Int, data.ECoins || 0)
      .execute("HR_InsertarBonoRed")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return { insert: true, record: recordset[0] };
        } else {
          return {
            error: true,
            message: "No se insertó el bono",
          };
        }
      });
    connection.close();
    return bono;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function getPersonas(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const records = await connection
      .request()
      .input("REGISTRO", sql.Int, data)
      .execute("HR_ListarRegistros")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset[0]) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron registros",
          };
        }
      });
    connection.close();
    return records;
  } catch (error) {
    return { error: true, message: error.message }; //
  }
}
async function getCampana() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const records = await connection
      .request()
      .execute("WA_ObtenerCampanas")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
      
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron registros",
          };
        }
      });
    connection.close();
    return records;
  } catch (error) {
    return { error: true, message: error.message }; //
  }
}
async function getPersonasInv() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const records = await connection
      .request()
      .execute("I_ListaSimpleAsesores")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron registros",
          };
        }
      });
    connection.close();
    return records;
  } catch (error) {
    return { error: true, message: error.message }; //
  }
}
async function getHrDatos(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdHr", sql.Int, data.IdHr)
      .input("IdPersona", sql.Int, data.IdPersona)
      .input("IdLote", sql.Int, data.IdLote)
      .execute("HR_ObtenerInformacion")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset[0]) {
          return {
            datos: recordset[0][0],
            archivos: recordset[1][0],
            lotes: recordset[2],
            pago: recordset[3][0],
          };
        } else {
          return {
            error: true,
            message: "No se encontraron registros",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function cambiarStatusHr(data) {
  
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const statusHr = await connection
      .request()
      .input("Registro_Aceptado", sql.Int, data.Registro_Aceptado)
      .input("IdHR", sql.Int, data.IdHR)
      .input("User", sql.NVarChar, data.User)
      .execute("HR_ActualizarRegistro")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return { updated: true };
        } else {
          return {
            error: true,
            message: "No se actualizó el status del HR",
          };
        }
      });
    connection.close();
    return statusHr;
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
async function actualizarDatosGeneralesHR(data) {
  try {
  
    const connection = await new sql.ConnectionPool(config).connect();
    const update = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona || null)
      .input("Nombre", sql.NVarChar(60), data.Nombre || null)
      .input("Nombre_S", sql.NVarChar(60), data.Nombre_S || null)
      .input("Apellido_P", sql.NVarChar(60), data.Apellido_P)
      .input("Apellido_M", sql.NVarChar(60), data.Apellido_M)
      .input("Email", sql.NVarChar(100), data.Email)
      .input("Num_Cel", sql.NVarChar(30), data.Num_Cel)
      .input("Direccion", sql.NVarChar(150), data.Direccion)
      .input("Estado", sql.NVarChar(60), data.Estado)
      .input("Ciudad", sql.NVarChar(60), data.Ciudad)
      .input("Fch_Nacimiento", sql.Date, data.Fch_Nacimiento)
      .input("Lugar_Nacimiento", sql.NVarChar(60), data.Lugar_Nacimiento)
      .input("IdEstadoCivil", sql.Int, data.IdEstadoCivil)
      .input("Ocupacion", sql.NVarChar(60), data.Ocupacion)
      .input("Edad", sql.SmallInt, data.Edad)
      .input("IdSexo", sql.Int, data.IdSexo)
      .input("IdRegimen", sql.Int, data.IdRegimen)
      .input("EstatusGeneral", sql.NVarChar(60), data.EstatusGeneral)
      .input(
        "EstadoNacimiento",
        sql.NVarChar(60),
        data.EstadoNacimiento || null
      )
      .input("PaisNacimiento", sql.NVarChar(60), data.PaisNacimiento || null)
      .input("CodigoPostal", sql.NVarChar(60), data.CodigoPostal || null)
      .input(
        "TipoIdentificacion",
        sql.NVarChar(60),
        data.TipoIdentificacion || null
      )
      .input("Identificacion", sql.NVarChar(60), data.Identificacion || null)
      .input("Nacionalidad", sql.NVarChar(60), data.Nacionalidad || null)
      .input("Predio", sql.NVarChar(60), data.Predio || null)
      .input("CURP", sql.NVarChar(30), data.CURP || "")
      .input("RFC", sql.NVarChar(30), data.RFC || "")
      .input("Colonia", sql.NVarChar(100), data.Colonia || "")
      .input("NoInterior", sql.NVarChar(30), data.NoInterior || "")
      .input("NoExterior", sql.NVarChar(30), data.NoExterior || "")
      .input("Calle", sql.NVarChar(30), data.Calle || "")
      .input("CodigoPais", sql.NVarChar(6), data.CodigoPais || "")
      .input("User", sql.NVarChar(50), data.usr_upd)
      .input("Verificador", sql.Int, data.usr_add)
      .input("IdHR", sql.Int , data.IdHR)
      .execute("HR_ActualizarDatosGeneralesInversionista")
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

async function actualizarBonoRed(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const update = await connection
      .request()
      .input("IdBonoRed", sql.Int, data.IdBonoRed || null)
      .input("IdOrigen", sql.Int, data.IdOrigen || null)
      .input("Correo", sql.NVarChar(255), data.Correo || null)
      .input("Fch_Nacimiento", sql.Date, data.Fch_Nacimiento)
      .input("Nombre_Beneficiario", sql.NVarChar(100), data.Nombre_Beneficiario)
      .input("PrcFxCoins", sql.Decimal(12, 2), data.PrcFxCoins)
      .input("ECoins", sql.Decimal(12, 2), data.ECoins)
      .execute("HR_ActualizarBonoRed")
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

async function actualizarLoteHr(data) {

  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const update = await connection
      .request()
      .input("IdHR", sql.Int, data.IdHR || null)
      .input("IdLote", sql.Int, data.IdLote || null)
      .input("IdDesarrollo", sql.Int, data.IdDesarrollo || null)
      .input("PrecioM2", sql.Float, data.PrecioM2)
      .input("PrecioFinal", sql.Float, data.PrecioFinal)
      .input("MontoEnganche", sql.Float, data.MontoEnganche || 0)
      .input("FormaCompra", sql.Int, data.FormaCompra)
      .input("MesesFinanciamiento", sql.Int, data.MesesFinanciamiento)
      .input("IdLoteOld", sql.Int, data.IdLoteOld || null)
      .input("FechaCompra", sql.Date, data.FechaCompra || null)
      .input("User", sql.NVarChar, data.User || null)
      .execute("HR_ActualizarLoteHR")
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

async function crearInversionista(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona || null)
      .input("Email", sql.NVarChar(255), data.Email)
      .input("Password", sql.NVarChar(10), data.password)
      .execute("HR_UpdateClave")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return recordset[0];
        } else {
          return {
            error: true,
            message: "No se genero la clave",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function crearInversionistaHR(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona || null)
      .input("Email", sql.NVarChar(255), data.Email)
      .input("Password", sql.NVarChar(10), data.password)
      .execute("HR_UpdateClaveInv")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return recordset[0];
        } else {
          return {
            error: true,
            message: "No se genero la clave",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function getSoloDocumentos(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, id)
      .execute("HR_ObtenerSoloDocumentos")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return recordset[0];
        } else {
          return {
            error: true,
            message: "No se encontraron documentos",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function obtenerOrganigrama(IdSCom) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdSCom", sql.Int, IdSCom)
      .execute("HR_ObtenerOrganigramaPorSC")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron asesores",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function agendarLLamada(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("Fch_Cita", sql.Date, data.Fch_Cita)
      .input("Hora_Cita", sql.NVarChar(50), data.Hora_Cita)
      .input("IdPersona", sql.Int, data.IdPersona)
      .execute("HR_AgendarCita")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return recordset[0];
        } else {
          return {
            error: true,
            message: "No se agendo la llamada",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function obtenerCitas(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, data)
      .execute("HR_ObtenerCitas")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron las citas",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function obtenerLotesCliente(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, data)
      .execute("HR_LotesDelInversionista")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron las citas",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function obtenerLotesClienteSurvey(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, data)
      .execute("HR_Invitado")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron las citas",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function registroCobranza() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .execute("HR_CobranzaRegistros")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron las citas",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function getTipoPagos() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const records = await connection
      .request()
      .execute("HR_TiposPago")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron registros",
          };
        }
      });
    connection.close();
    return records;
  } catch (error) {
    return { error: true, message: error.message }; //
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
      .input("Comprobante", sql.NVarChar(100), data.ComprobantePago || null)
      .input("IdConcepto", sql.Int, data.IdConcepto)
      .execute("HR_RegistrarPago")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return { insert: true, record: recordset[0] };
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

async function eliminarHR(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdHR", sql.Int, data.IdHR)
      .input("IdPersona", sql.Int, data.IdPersona)
      .execute("HR_EliminarRegistro")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return recordset[0];
        } else {
          return {
            error: true,
            message: "No se encontraron las citas",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function finalizarRegistroInversionista(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona)
      .execute("HR_RegistroFinalizado")
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

async function VerificarDatos(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPago", sql.Int, data.IdPago)
      .input("IdStatus", sql.Int, data.IdStatus)
      .input("IdHR", sql.Int, data.IdHR)
      .execute("HR_VerificarPago")
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

async function InversionistasDeAsesor(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdAsesor", sql.Int, id)
      .execute("HR_InversionistasDelAsesor")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron inversionistas",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function reporteHRCompletado(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona)
      .execute("HR_ReportesHRInversionista")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return recordset;
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

async function obtenerCarteraDeClientes(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, id)
      .execute("HR_CarteraDeClientes")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
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

async function NumeroMensualidades(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdHr", sql.Int, data.IdHr)
      .execute("HR_ObtenerMensualidades")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
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

async function InsertarReferidos(data) {
  try {
   
    if(data.datosmontos){
      data.datosmontos = JSON.stringify(data.datosmontos);
    }
    const connection = await new sql.ConnectionPool(config).connect();
    const insert = await connection
      .request()
      /* Inversionistas */
      .input("IdInversionista", sql.Int, data.IdInversionista )
      .input("IdAsesor", sql.Int, data.IdAsesor )
      .input("Email", sql.NVarChar(255), data.Email )
      .input("Nombre_Completo", sql.NVarChar(500), data.Nombre_Completo )
      .input("Contacto", sql.NVarChar(50), data.Contacto )
      .input("WhatssApp", sql.NVarChar(50), data.WhatssApp )
      .input("Comentario", sql.NVarChar(500), data.Comentario )
      .input("datosmontos", sql.Text, data.datosmontos )
      .input("Relacioninversionista", sql.Text, data.Relacioninversionista )
      .input("ocupacion", sql.Text, data.ocupacion )

/* Asesores */
/*
      .input("IdreferidoA", sql.Int, data.IdReferido || null)
      .input("IdAsesor1", sql.Int, data.IdPersona || null)
      .input("Nombre", sql.NVarChar(500), data.Nombre || null)
      .input("Nombre_S", sql.NVarChar(50), data.SegundoNombre|| null)
      .input("Apellido_P", sql.NVarChar(50), data.Apellido_P || null)
      .input("Apellido_M", sql.NVarChar(50), data.Apellido_M || null )
      .input("Num_Tel", sql.NVarChar(25), data.Celular || null)
      .input("EmailA", sql.NVarChar(255), data.Email || null)
      .input("Contactos", sql.NVarChar, data.Contactos || null)
      .input("IdAsesor2", sql.Int, data.IdAsesor2 || null)
      .input("ComentarioA", sql.Text, data.ComentarioA || null)
      */
/* Identificador */
      /*.input("Origenes", sql.Int, data.Origenes )*/
      .execute("FX_InsertarReferidos")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
      
          return recordset[0];
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

async function ObtenerReferidosDelInversionista(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, id)
      .execute("FX_ReferidosDelInversionista")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
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
async function ObtenerLlamadas() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const records = await connection
      .request()
      .execute("CRM_ObtenerCitas")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron registros",
          };
        }
      });
    connection.close();
    return records;
  } catch (error) {
    return { error: true, message: error.message }; //
  }
}
async function CambiarStatusCita(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const insert = await connection
      .request()
      .input("IdCita", sql.Int, data.IdCita)
      .input("IdStatus", sql.Int, data.IdStatus)
      .input("Nota", sql.NVarChar(), data.Nota || null)
      .input("User", sql.NVarChar(), data.User)
      .execute("CRM_ActualizarCitas")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset[0];
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
async function DesbloquearTerreno(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdHR", sql.Int, id)
      .execute("HR_DesbloquearLote")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset[0];
        } else {
          return { error: true, message: "Error interno" };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function getPasosHR() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const records = await connection
      .request()
      .execute("HR_ObtenerFases")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron registros",
          };
        }
      });
    connection.close();
    return records;
  } catch (error) {
    return { error: true, message: error.message }; //
  }
}
async function HR_presistema(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdHR", sql.Int, id)
      .execute("HR_PreSistema")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {

          return recordset[0];
        } else {
          return { error: true, message: "Error interno" };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function getAccesos(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const records = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona)
      .input("Email", sql.NVarChar, data.Email || null)
      .execute("SP_ObtenerAccesoUsuario")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset[0];
        } else {
          return {
            error: true,
            message: "No se encontraron registros",
          };
        }
      });
    connection.close();
    return records;
  } catch (error) {
    return { error: true, message: error.message }; //
  }
}

async function getInversionostas() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const records = await connection
      .request()
      .execute("R_ObtenerInversionistas")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron registros",
          };
        }
      });
    connection.close();
    return records;
  } catch (error) {
    return { error: true, message: error.message }; //
  }
}
async function crearInversionistaSimple(data) {
  try {
    const password = Math.random().toString(36).slice(5);
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona || null)
      .input("IdAsesor", sql.Int, data.IdAsesor || null)
      .input("SocioCom", sql.Int, data.SocioCom || null)
      .input("IdLider", sql.Int, data.IdLider || null)
      .input("Password", sql.NVarChar(10), password)
      .execute("HR_RegistroInversionistaSimple")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return recordset[0];
        } else {
          return {
            error: true,
            message: "No se genero la clave",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function DesarrolloPreciototal() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const records = await connection
      .request()
      .execute("INV_PrecioPorDesarrollo")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron registros",
          };
        }
      });
    connection.close();
    return records;
  } catch (error) {
    return { error: true, message: error.message }; //
  }
}

async function getInversionistasRegistradosPAGOS() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const records = await connection
      .request()
      .execute("CC_ListaDeInversionista")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron registros",
          };
        }
      });
    connection.close();
    return records;
  } catch (error) {
    return { error: true, message: error.message }; //
  }
}
async function getInversionistasRegistrados() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const records = await connection
      .request()
      .execute("HR_ObtenerRegistrosInversionistas")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset[0]) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontraron registros",
          };
        }
      });
    connection.close();
    return records;
  } catch (error) {
    return { error: true, message: error.message }; //
  }
}

async function getPagosPersona(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const records = await connection
      .request()
      .input("IdPersona", sql.Int, id)
      .execute("HR_PagosPorInversionista")
      .then((dbData) => {
        /*      const recordset = dbData.recordsets; */
        const recordset = dbData.recordsets;
        if (recordset) {
          /*return recordset;  <---Cambio cuando se actualice web inversionistas */
          return { pagos: recordset[0], lotes: recordset[1]};
        } else {
          return {
            error: true,
            message: "No se encontraron registros",
          };
        }
      });
    connection.close();
    return records;
  } catch (error) {
    return { error: true, message: error.message }; //
  }
}
async function finalizarProcesoHR(data) {
  try {
   
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdHR", sql.Int, data.HR || null)
      .input("IdPersona", sql.NVarChar(100), data.Usuario || null)
      .execute("HR_MarcarProgresoFinalizado")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          
          for (let i = 0; i < recordset.length; i++) {
           
              let llave = JSON.parse(recordset[i].llave); 
           
              let URL = 'https://fibraxinversiones.mx/asesores/app/juego';
              let imagenes = ['https://fibraxinversiones.mx/assets/img/Img-Notificaciones/Fibrax.jpg'];
              const webpush = require('web-push');
              const express = require('express');
              const cors = require('cors')
              const bodyParser = require('body-parser');
              const app = express();
                  app.use(cors())
                  app.use(bodyParser.json())
              const vapidKeys = {
                  "publicKey": "BBH4b0eYUzw_2QCJ1-1I_07bkn-RzdnZTxmbLvrgGeNLb0zdUdXkvdOv0P4zI6vSoZolcXUcteD23EqVyo0oSkE",
                  "privateKey": "7L0YtAi3I6BbtMpiBBcgpgXN8vds6vLXhbb_cWYQ_LE"
              }
              
              webpush.setVapidDetails(
                  'mailto:corportativo@fibrax.mx',
                  vapidKeys.publicKey,
                  vapidKeys.privateKey
              );
                  const pushSubscription = {
                      endpoint:llave.endpoint,
                      keys: {
                          auth:llave.keys.auth,
                          p256dh:llave.keys.p256dh
                      }
                  };
                  const payload = {
                      "notification": {
                          "title": 'Tienes un nuevo HR',
                        /*   "body": recordset[0][i].Texto, */
                          "badge": "💵",
                          "icon": "https://fibraxinversiones.mx/asesores/assets/icons/Fibrax-app--logo1-modified.png",
                          "vibrate": [100, 50, 100],
                          "image": imagenes,
                          "actions": [   
                              {
                              "action": "bar",
                              "title": "Ir"
                              }
                          ],
                          "data": {
                              "onActionClick": {
                              "default": {
                                          "operation": "openWindow", 
                                          "url": URL
                                          },
                              "bar": {
                                  "operation": "navigateLastFocusedOrOpen",
                                  "url": URL
                                      }
                              }
                      }
                  }
              }
                  webpush.sendNotification(
                      pushSubscription,
                  JSON.stringify(payload))
                  .then(respuesta => {
                      console.log('Enviado !!');
                      if(i === 0) {
                        Cambionotifiacionjuego(recordset[0]);
                      }
                  }).catch(err => {
                          console.log('Error', err);
                  })  
                }       
          return recordset[0];
        } else {
          return {
            error: true,
            message: "No se finalizo el proceso",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function enviarContrato(data) {
  try {
    
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdHR", sql.Int, data.HR || null)
      .input("IdPersona", sql.NVarChar(100), data.Usuario || null)
      .execute("HR_ContratoEnviado")
      .then((dbData) => {
        const recordset = dbData.recordset;
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function contratoGenerado(data) {
  try {
    
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdHR", sql.Int, data.HR || null)
      .input("Persona", sql.NVarChar(100), data.Usuario || null)
      .execute("HR_ContratoGenerado")
      .then((dbData) => {
        const recordset = dbData.recordset;
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function Cambionotifiacionjuego(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdTLider", sql.Int, data.InvLider)
      .input("IdHr", sql.Int, data.IdHr)
      .execute("HR_CambioStatusJuego")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
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

async function EliminarReferido(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdReferido", sql.Int, id)
      .execute("FX_EliminarReferido")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
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

/* 
  Metodo para insertar un lote a un inversionista existente
 */
async function agregarHrInversionista(data) {
  try {

    const connection = await new sql.ConnectionPool(config).connect();
    const hrr = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona)
      .input("IdAsesor", sql.Int, data.IdAsesor)
      .input("IdDesarrollo", sql.Int, data.IdDesarrollo)
      .input("IdLote", sql.Int, data.IdLote)
      .input("Precio_M2", sql.Int, data.PrecioM2)
      .input("M2", sql.Int, data.M2)
      .input("Precio_Total", sql.Float, data.Precio_Final)
      .input("Forma_Compra", sql.Int, data.Forma_Compra)
      .input("IdMetodoPago", sql.Int, data.IdMetodoPago)
      .input("Enganche", sql.Float, data.Enganche || 0)
      .input("Mensualidades", sql.Int, data.Mensualidades || 0)
      .input("Fecha_Enganche", sql.Date, data.Fecha_Enganche)
      .input("IdAsociado", sql.Int, data.IdAsociado || null)
      .input("IdTeamLider", sql.Int, data.IdTeamLider || null)
      .input("Origen", sql.Int, data.Origen || null)
      .execute("HR_InsertarHrInversionistaExistente")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return { insert: true, record: recordset[0] };
        } else {
          return {
            error: true,
            message: "No se insertaron los documentos.",
          };
        }
      });
    connection.close();
    return hrr;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

/* usuariois verificacion */
async function ObtenerVerificacion() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const verifi = await connection

      .request()
      .execute("CRM_usuarios_verificacion")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { usuarios: recordset };
        } else {
          return { error: true, message: "NO se encontro usuario" };
        }
      });
    connection.close();
    return verifi;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function organigramaID(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, id)
      .execute("RH_OrganigramaPorID")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return recordset[0];
        } else {
          return {
            error: true,
            message: "No se encontraron documentos",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function VerificarEmail(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const verifi = await connection
      .request()
      .input("Correo", sql.NVarChar(200), data.email)
      .execute("HR_ValidarEmail")
      .then(async (dbData) => {
        const rrecordset = dbData.recordset[0];
        if (rrecordset) {
          return { rrecordset };
        } else {
          return { error: true, message: "NO se encontro usuario" };
        }
      });
    connection.close();
    return verifi;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function getLimbo(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, id)
      .execute("HR_CarteraLimbo")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return recordset[0];
        } else {
          return {
            error: true,
            message: "Sin registros",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function EmailSearch(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const verifi = await connection
      .request()
      .input("Email", sql.NVarChar(100), data.email)
      .execute("HR_EmailSearch")
      .then(async (dbData) => {
        const rrecordset = dbData.recordset[0];
        if (rrecordset) {
          return { rrecordset };
        } else {
          return { error: true, message: "NO se encontro usuario" };
        }
      });
    connection.close();
    return verifi;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function getmiscotizaciones(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdAsesor", sql.Int(), data.asesor)
      .execute("WA_ObtenerMisCotizaciones")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontros Asesor",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function nointeresado(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("Id", sql.Int(), data.id)
      .input("IdAsesor", sql.Int(), data.asesor)
      .execute("WA_EliminarCotizacion")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
        } else {
          return {
            error: true,
            message: "No se encontros Asesor",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function getEncuestas() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const records = await connection
      .request()
      .execute("HR_Encuestas")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset[0]) {
          return {personas: recordset[0], historico: recordset[1]};
        } else {
          return {
            error: true,
            message: "No se encontraron registros",
          };
        }
      });
    connection.close();
    return records;
  } catch (error) {
    return { error: true, message: error.message }; //
  }
}
async function Reagendar(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const verifi = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona)
      .input("Fecha", sql.Date, data.next)
      .execute("HR_ReagendarEncuesta")
      .then(async (dbData) => {
        const rrecordset = dbData.recordsets;
        if (rrecordset) {
          return { Updated:true, encuestas: rrecordset[1]};
        } else {
          return { error: true, message: "NO se encontro usuario" };
        }
      });
    connection.close();
    return verifi;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function EditarEncuesta(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const verifi = await connection
      .request()
      .input("IdEncuesta", sql.Int,  data.IdEncuesta || null)
      .input("Nombre", sql.NVarChar(200), data.NombreEncuesta || null)
      .input("Usuario", sql.NVarChar(100), data.usr || null)
      .input("IdStatus", sql.Int, data.IdStatus)
      .input("Estructura",  sql.NVarChar(sql.MAX), data.Estructura || null)
      .execute("HR_Encuesta")
      .then(async (dbData) => {
        const rrecordset = dbData.recordsets;
        if (rrecordset) {
          return { Updated:true, Mensaje: rrecordset[0][0].Mensaje, Encuestas: rrecordset[1]};
        } else {
          return { error: true, message: "Error" };
        }
      });
    connection.close();
    return verifi;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function HrsEquipo(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .input("IdPersona", sql.Int, id)
      .execute("WA_EquipoContratos")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return { proceso : recordset[0], terminados: recordset[1]};
        } else {
          return {
            error: true,
            message: "No se encontraron inversionistas",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function obtenerEncuestas() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const result = await connection
      .request()
      .execute("HR_ObtenerEncuestas")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          if(recordset[0])
          {
            return { encuestas: recordset};
          }else{
            return { empty: true, mensaje:'Sin registros' }
          }
          
        } else {
          return {
            error: true,
            mensaje: "No se encontraron las citas",
          };
        }
      });
    connection.close();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function GuardarRespuestas(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const bono = await connection
      .request()
      .input("IdEntrevista", sql.Int, data.IdEntrevista)
      .input("IdHr", sql.Int, data.IdHR)
      .input("TipoEntrevista", sql.Int, data.TipoEntrevista)
      .input("Respuestas", sql.NVarChar(sql.MAX), data.Respuesta)
      .input("Fecha", sql.Date, data.Fecha)
      .input("Usr", sql.Int, data.Usr)
      .input("IdPersona", sql.Int, data.IdPersona)
      .execute("HR_GuardarRespuestas")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return recordset[0];
        } else {
          return {
            error: true,
            message: "No se guardaron las respuestas",
          };
        }
      });
    connection.close();
    return bono;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function busquedaInv(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const bono = await connection
      .request()
      .input("nombre", sql.NVarChar(1000), data.Nombre)
      .execute("HR_BusquedaNombreInv")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return recordset;
        } else {
          return {
            empty: true,
            message: "No se encontro coincidencia",
          };
        }
      });
    connection.close();
    return bono;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function buscarhrname(data) {
  try {
    console.log(data)
    const connection = await new sql.ConnectionPool(config).connect();
    const bono = await connection
      .request()
      .input("nombre", sql.NVarChar(1000), data)
      .execute("HR_BuscarNombreHr")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return recordset;
        } else {
          return {
            empty: true,
            message: "No se encontro coincidencia",
          };
        }
      });
    connection.close();
    return bono;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

module.exports = {
  insertarPersona,
  insertarHr,
  insertarDocumentos,
  insertarBonoRed,
  getPersonas,
  getPersonasInv,
  getHrDatos,
  cambiarStatusHr,
  updateArchivoSP,
  actualizarDatosGeneralesHR,
  actualizarBonoRed,
  getSoloDocumentos,
  agendarLLamada,
  crearInversionista,
  obtenerCitas,
  obtenerLotesCliente,
  registroCobranza,
  getTipoPagos,
  RegistrarPago,
  eliminarHR,
  finalizarRegistroInversionista,
  VerificarDatos,
  InversionistasDeAsesor,
  reporteHRCompletado,
  obtenerCarteraDeClientes,
  NumeroMensualidades,
  InsertarReferidos,
  ObtenerReferidosDelInversionista,
  ObtenerLlamadas,
  CambiarStatusCita,
  actualizarLoteHr,
  DesbloquearTerreno,
  getPasosHR,
  getAccesos,
  HR_presistema,
  getInversionostas,
  crearInversionistaSimple,
  getInversionistasRegistrados,
  getPagosPersona,
  finalizarProcesoHR,
  EliminarReferido,
  agregarHrInversionista,
  ObtenerVerificacion,
  organigramaID,
  obtenerLotesClienteSurvey,
  VerificarEmail,
  getLimbo,
  EmailSearch,
  crearInversionistaHR,
  getmiscotizaciones,
  nointeresado,
  getEncuestas,
  Reagendar,
  EditarEncuesta,
  HrsEquipo,
  obtenerEncuestas,
  obtenerOrganigrama,
  Cambionotifiacionjuego,
  getCampana,
  GuardarRespuestas,
  busquedaInv,
  enviarContrato,
  contratoGenerado,
  DesarrolloPreciototal,
  getInversionistasRegistradosPAGOS,
  buscarhrname
};

