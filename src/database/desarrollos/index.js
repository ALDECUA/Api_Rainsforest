const config = require("../config");
const sql = require("mssql");
const fs = require('fs');

async function obtenerdesarrolloslotes() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const desarrollos = await connection
            .request()
            .execute("DES_ObtenerLotesTodo")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return recordset;
                } else {
                    return {
                        error: true,
                        message: "",
                    };
                }
            });

        connection.close();
        return desarrollos;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function FiltrarLotes(data) {
    try {
       
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("IdDesarrollo", sql.Int(), data.IdDesarrollo || null)
            .input("IdFase", sql.Int(), data.IdFase || null)
            .execute("DES_ObtenerLotesTodoFiltrar")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                
                    return recordset
                } else {
                    return {
                        error: true,
                        message: "No se pudieron actualizar los datos de empresa.",
                    };
                }
            });

        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function obtenerDesarrollos(idEmpresa) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const desarrollos = await connection
            .request()
            .input('IdEmpresaDes', sql.Int, idEmpresa)
            .execute("DES_Desarrollos_obtener")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset) {
                    return { desarrollos: recordset };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron actualizar los datos de empresa.",
                    };
                }
            });

        connection.close();
        return desarrollos;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerDesarrollosById(id) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const desarrollos = await connection
            .request()
            .input("IdDesarrollo", sql.Int, id)
            .execute("DES_Desarrollos_obtener_id")
            .then((dbData) => {

                const recordset = dbData.recordset;

                if (recordset) {
                    return { desarrollos: recordset };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron actualizar los datos de empresa.",
                    };
                }
            });

        connection.close();
        return desarrollos;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function editarDesarrollo(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const empresa = await connection
            .request()
            .input("IdDesarrollo", sql.Int, data.IdDesarrollo)
            .input("Desarrollo", sql.NVarChar, data.Desarrollo)
            .input("Empresa", sql.Int, data.IdEmpresa)
            .input("IdContrato", sql.Int, data.IdContrato)
            .input("IdContratoDesarrollo", sql.Int, data.IdContratoDesarrollo)
            .execute("DES_Desarrollos_editar")
            .then((dbData) => {
                const rowsAffected = dbData.rowsAffected;
                if (rowsAffected[0] > 0) {
                    return { updated: true };
                } else {
                    return {
                        error: true,
                        message: "No se actualizaron los datos del desarrollo.",
                    };
                }
            });

        connection.close();
        return empresa;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function crearDesarrollo(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const desarrollo = await connection
            .request()
            .input("Desarrollo", sql.NVarChar, data.Desarrollo)
            .input("Empresa", sql.Int, data.IdEmpresa)
            .input("IdContrato", sql.Int, data.IdContrato)
            .execute("DES_Desarrollos_crear")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset[0]) {
                    return { insert: true, record: recordset[0] };
                } else {
                    return {
                        error: true,
                        message: "No se creo el desarrollo.",
                    };
                }
            });

        connection.close();
        return desarrollo;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function apartarLote(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const desarrollo = await connection
            .request()
            .input("Id", sql.Int, data)
            .execute("DES_ApartarLote")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0]) {
                    return { apartado: true, record: recordset[0] };
                } else {
                    return {
                        error: true,
                        message: "No se aparto lote",
                    };
                }
            });

        connection.close();
        return desarrollo;
    } catch (error) {
        return { error: true, message: error.message };
    }
}


async function subirArchivoDesarrollo(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const desarrollo = await connection
            .request()
            .input("IdDesarrollo", sql.Int, data.IdDesarrollo)
            .input("IdEtapa", sql.Int, data.IdEtapa)
            .input("Documento", sql.NVarChar, data.Documento)
            .input("Carpeta", sql.NVarChar, data.Carpeta)
            .input("Notas", sql.NVarChar, data.Notas)
            .input("Titulo", sql.NVarChar, data.Titulo)
            .execute("WA_SubirArchivoDrive")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset[0]) {
                    return { insert: true };
                } else {
                    return {
                        error: true,
                        message: "No se subio el archivo",
                    };
                }
            });

        connection.close();
        return desarrollo;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function subirArchivoLegal(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const desarrollo = await connection
            .request()
            .input("IdDesarrollo", sql.Int, data.IdDesarrollo || null)
            .input("IdEtapa", sql.Int, data.IdEtapa || null)
            .input("Documento", sql.NVarChar, data.Documento || null)
            .input("Carpeta", sql.NVarChar, data.Carpeta || null)
            .input("Notas", sql.NVarChar, data.Notas || null)
            .execute("WA_SubirArchivoDriveLegal")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset[0]) {
                    return { insert: true };
                } else {
                    return {
                        error: true,
                        message: "No se subio el archivo",
                    };
                }
            });

        connection.close();
        return desarrollo;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function insertarLogDrive(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const desarrollo = await connection
            .request()
            .input("IdPersona", sql.Int, data.IdPersona || null)
            .input("IdDesarrollo", sql.Int, data.IdDesarrollo || null)
            .input("Etapa", sql.NVarChar, data.Etapa || null)
            .input("Carpeta", sql.NVarChar, data.Carpeta || null)
            .execute("SP_InsertarLogDrive")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset[0]) {
                    return recordset[0];
                } else {
                    return {
                        error: true,
                        message: "No se subio el archivo",
                    };
                }
            });

        connection.close();
        return desarrollo;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function insertar_desarrolloWebapp(data) {
    try {
        console.log(data);
        const connection = await new sql.ConnectionPool(config).connect();
        const desarrollo = await connection
            .request()
            .input("IdD", sql.Int, data.sel)
            .input("NombreDesarrollo", sql.NVarChar(50), data.nombrePublico)
            .input("Eslogan", sql.NVarChar(120), data.eslogan || null)
            .input("Descripcion", sql.NVarChar(255), data.descripcion || null)
            .input("DescripcionBreve", sql.NVarChar(255), data.descripcionBreve || null)
            .input("FondoGrande", sql.NVarChar(255), data.fondoGrande || null)
            .input("LinkBackground", sql.NVarChar(255), data.linkBackground || null)
            .input("LinkLogo", sql.NVarChar(255), data.logoGrande || null)
            .input("LinkLogoMini", sql.NVarChar(255), data.logoChico || null)
            .input("ColorBotonA", sql.NVarChar(30), data.colorBtn || null)
            .input("LinkPresentacion", sql.NVarChar(255), data.linkPresentacion || null)
            .input("LinkLotificacion", sql.NVarChar(255), data.linkLotificacion || null)
            .input("LinkInstagram", sql.NVarChar(255), data.linkInstagram || null)
            .input("LinkFacebook", sql.NVarChar(255), data.linkFacebook || null)
            .input("SitioWeb", sql.NVarChar(255), data.linkSitioWeb || null)
            .input("EsNuevo", sql.Int, +data.esNuevo)
            .input("LinkGoogleMaps", sql.NVarChar(255), data.ubicacion)
            .input("HeaderCotizacion", sql.NVarChar(255), data.headerCotizacion || null)
            .execute("CRM_AgregarInfoDesarrollos")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0]) {
                    return recordset[0];
                } else {
                    return {
                        error: true,
                        message: "Error, información no actualizada",
                    };
                }
            });

        connection.close();
        return desarrollo;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtener_desarrolloWebappInfo(id) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const desarrollos = await connection
            .request()
            .input("IdDesarrollo", sql.Int, id)
            .execute("CRM_CargarDesarrollosInfo")
            .then((dbData) => {

                const recordset = dbData.recordset;

                if (recordset) {
                    return  recordset;
                } else {
                    return {
                        error: true,
                        message: "No se pudio obtener la informacion.",
                    };
                }
            });

        connection.close();
        return desarrollos;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    obtenerDesarrollos,
    obtenerDesarrollosById,
    editarDesarrollo,
    crearDesarrollo,
    apartarLote,
    subirArchivoDesarrollo,
    subirArchivoLegal,
    insertarLogDrive,
    obtenerdesarrolloslotes,
    FiltrarLotes,
    insertar_desarrolloWebapp,
    obtener_desarrolloWebappInfo
};