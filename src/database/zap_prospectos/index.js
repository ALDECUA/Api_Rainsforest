const config = require("../config");
const sql = require("mssql");
const { NULL } = require("mysql2/lib/constants/types");
const { Notificaciones } = require("../../validar");

async function listarprospectos() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .execute("ZAP_Prospectos")
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

async function listarSC(){
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .execute("R_ListarSociosComerciales")
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

async function listaFormulario(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .input("menu", sql.NVarChar(50), data.menu)
            .input("opcion", sql.NVarChar(50), data.opcion)
            .execute("ZAP_Config_Formularios")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return recordset;
                } else {
                    return {
                        error: true,
                        message: "Error, no se encontraron registros",
                    };
                }
            });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function prospectos() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .execute("ZAP_ObtenerProspectos")
            .then((dbData) => {
                const recordsets = dbData.recordset;
                if (recordsets) {
                    return  recordsets ;
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

async function datamenu() {
    try {

        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .execute("ZAP_datamenusistem")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return { data: recordset };
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

async function AsingarLead(data){
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
        .request()
        .input("Idlead", sql.Int, data.Idlead)
        .input("IdAsignadoSC", sql.Int, data.IdAsignado)
        .input("IdStatusCrm", sql.Int, data.IdStatusCrm)
        .execute("ZAP_AsignarLead")
        .then(async(dbData) =>   {
            const recordset = dbData.recordset;
            if (recordset) {
                return  recordset[0] ;
            } else {
                return {
                    error: true,
                    message: "Error, no se pudo actualizar",
                };
            }
        });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function Asigandos(data) {

    try {
        const connection = await new sql.ConnectionPool(config).connect();F
        const result = await connection
            .request()
            .input('ValorFecha', sql.Int, data.ValorFecha)
            .input('Origen', sql.NVarChar(50), data.Origen)
            .input('Id', sql.Int, data.Id)
            .execute("ZAP_prospectosAsignados")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return  recordset ;
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

async function ReasignarLead(data) {
  
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .input('Scnuevo', sql.Int, data.scnuevo)
            .input('IdLead', sql.Int, data.IdLead)
            .input('IdAsignadoSC', sql.Int, data.IdAsignadoSC)
            .input('IdAsignadoIdLIder', sql.Int, data.IdAsignadoIdLIder)
            .input('IdAsingadoAsesor', sql.Int, data.IdAsingadoAsesor)
            .input('IdAsesor1', sql.Int, data.IdAsesor1)
            .input('IdAsesor2', sql.Int, data.IdAsesor2)
            .input('IdReferencia', sql.Int, data.IdReferencia)
            .input('Historial', sql.Text, data.Historial)
            .execute("Zap_Reasignacion")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return  recordset ;
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

async function ObtenerProspecto(id) {

    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .input('Id', sql.Int, id)
            .execute("ZAP_ObtenerLeadId")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
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

async function ListarSistema(opcion) {

    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .input('Tipo', sql.NVarChar(50), opcion)
            .execute("ZAP_ListarSistema")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
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

/* leads hrs */

async function LeadsHrs(data) {

    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .input('Vista', sql.NVarChar(10), data.vista)
            .input('IdAsesor', sql.INT, data.IdAsesor)
            .input('IdReferido', sql.INT, data.IdReferido)
            .execute("ZAP_LeadsHrs")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
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


//verifimsn VerifiMsj+

async function VerifiMsj(data) {

    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .input('IdPersona', sql.INT, data.IdPersona)
            .input('IdReceptor', sql.INT, data.IdReceptor)
            .input('IdConversacion', sql.NVarChar(50), data.IdConversacion)
            .execute("ZAP_Verify_Mensajes")
            .then(async(dbData) => {
                console.log(dbData);
                const recordset = dbData.recordset;
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

async function ObtenerMensajePost(data) {


    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .input('IdPersona', sql.Int, data.IdPersona)
            .input('Tipo', sql.NVarChar(50), data.tipo)
            .input('Obtener', sql.NVarChar(50), data.Obtener)
            .input('Nivel', sql.NVarChar(50), data.nivel)
            .execute("ZAP_ObtenerMensajePost")
            .then(async(dbData) => {
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

/*  */
async function BuzonMsj(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .input('Id', sql.Int, data.Id)
            .input('Nivel', sql.Int, data.Nivel)
            .input('Tipo', sql.NVarChar(50), data.Tipo)
            .execute("ZAP_BuzonMsjs")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
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

/* INSERTS */
async function insertargrupos(data) {
    try {
       
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            
            .input("grupos", sql.NVarChar(50), data.grupo)
            .input("status", sql.Int, data.status)
            .execute("ZAP_InsertarGrupos")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return { inserted: 1, message: recordset };
                } else {
                    return {
                        error: true,
                        message: "Error, no se encontraron registros",
                    };
                }
            });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function insertarpasos(data) {
    try {
       
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            
            .input("Pasos", sql.NVarChar(50), data.pasos)
            .input("User", sql.NVarChar(50), data.user)
            .execute("ZAP_AgregarPasos")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return { inserted: 1, message: recordset };
                } else {
                    return {
                        error: true,
                        message: "Error, no se encontraron registros",
                    };
                }
            });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
//Insertar mensajes
async function insertarmensaje(data) {
    try {
   
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            
            .input("Mensaje", sql.NVarChar(50), data.mensaje)
            .input("User", sql.NVarChar(50), data.user)
            .execute("ZAP_AgregarMensajes")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return { inserted: 1, message: recordset };
                } else {
                    return {
                        error: true,
                        message: "Error, no se encontraron registros",
                    };
                }
            });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

//insertarMensajePost
async function insertarMensajePost(data) {
    try {
   
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .input("IdPersona", sql.Int, data.IdPersona)
            .input("Mensaje", sql.Text, data.Mensaje)
            .input("Receptor", sql.Int, data.Receptor)
            .input("Tipo", sql.NVarChar(50), data.Tipo)
            .input("User", sql.NVarChar(50), data.User)
            .input("IdConversacion", sql.NVarChar(50), data.IdConversacion)
            .input("Whoiam", sql.Int, data.whoiam)
            .execute("ZAP_InsertarMensajePost")
            .then(async (dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    let imagenes = ['https://fibraxinversiones.mx/assets/img/Img-Notificaciones/Fibrax.jpg'];
                    for(let i = 0; i < recordset[1].length ;i++){
                    a = JSON.parse(recordset[1][i].llave);
                        let   URL = "https://fibraxinversiones.mx/asesores/app/inicio";
                        let  texto = data.Mensaje
                        let titulo = 'Nuevo mensaje';
                        await Notificaciones(a,texto,titulo,URL,imagenes);      
                    }
             
                    return { inserted: 1, message: recordset[0] };
                } else {
                    return {
                        error: true,
                        message: "Error, no se encontraron registros",
                    };
                }
            });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
//update 

async function updatepasos(data) {
    try {
       
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            
            .input("Nombre", sql.NVarChar(50), data.pasos)
            .input("User", sql.NVarChar(50), data.user)
            .input("IdPasos", sql.Int, data.id)
            .execute("ZAP_UpdatePasos")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return { updated: 1, message: recordset };
                } else {
                    return {
                        error: true,
                        message: "Error, no se encontraron registros",
                    };
                }
            });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
}


async function updatemensajes(data) {
    try {
    
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            
            .input("Nombre", sql.NVarChar(50), data.mensajes)
            .input("User", sql.NVarChar(50), data.user)
            .input("IdMensajes", sql.Int, data.id)
            .execute("ZAP_UpdateMensajes")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return { updated: 1, message: recordset };
                } else {
                    return {
                        error: true,
                        message: "Error, no se encontraron registros",
                    };
                }
            });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
}



async function updatezona(data) {
    try {
      
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            
            .input("Zona", sql.Int, data.zona)
            .input("IdReferido", sql.Int, data.id)
            .execute("ZAP_UpdateTempLead")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return { updated: 1, message: recordset };
                } else {
                    return {
                        error: true,
                        message: "Error, no se encontraron registros",
                    };
                }
            });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function updateName(data) {
    try {
    
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            
            .input("IdReferido", sql.Int, data.id)
            .input("IdReferencia", sql.Int, data.idReferencia || null)
            .input("Nombre", sql.NVarChar(60), data.nombre || null)
            .input("Nombre_S", sql.NVarChar(60), data.nombre_S || null)
            .input("Apellido_P", sql.NVarChar(60), data.apellido_P || null)
            .input("Apellido_M", sql.NVarChar(60), data.apellido_M || null)
            .input("Origen", sql.Int, data.origen)
            .execute("ZAP_UpdateName")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return { updated: 1, message: recordset };
                } else {
                    return {
                        error: true,
                        message: "Error, no se encontraron registros",
                    };
                }
            });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
}


async function asignarpaso(data) {
    try {
    
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            
            .input("IdReferido", sql.Int, data.id)
            .input("Paso", sql.Int, data.paso)
            .execute("ZAP_ActualizarPasosLead")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return { updated: 1, message: recordset };
                } else {
                    return {
                        error: true,
                        message: "Error, no se encontraron registros",
                    };
                }
            });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
}


async function Saltarpaso(data) {
    try {
       
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .input("Id", sql.Int, data.IdReferido)
            .execute("ZAP_SaltaPasos")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return { updated: 1, message: recordset };
                } else {
                    return {
                        error: true,
                        message: "Error, no se encontraron registros",
                    };
                }
            });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
}


//
async function UpdateInbox(data) {
    try {
        console.log(data);
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .input("IdConversacion", sql.NVarChar(50), data.IdConversacion)
            .input("Whoiam", sql.Int, data.Whoiam)
            .execute("ZAP_CheckBuzonUpdate")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return { updated: 1, message: recordset };
                } else {
                    return {
                        error: true,
                        message: "Error, no se encontraron registros",
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
    listarprospectos,
    listaFormulario,
    datamenu,
    insertargrupos,
    prospectos,
    listarSC,
    AsingarLead,
    Asigandos,
    ObtenerProspecto,
    ReasignarLead,
    insertarpasos,
    ListarSistema,
    updatepasos,
    insertarmensaje,
    updatemensajes,
    updatezona,
    asignarpaso,
    LeadsHrs,
    Saltarpaso,
    updateName,
    ObtenerMensajePost,
    VerifiMsj,
    insertarMensajePost,
    BuzonMsj,
    UpdateInbox
    
}