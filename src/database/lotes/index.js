const config = require("../config");
const sql = require("mssql");
const fs = require('fs');

async function obtenerLotes(data) {
  
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const lotes = await connection
            .request()
            .input("IdFase", sql.Int, data.idFase)
            .input("IdDesarrollo", sql.Int, data.idDesarrollo)
            .execute("DES_Lotes_obtener")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset) {
                    return { lotes: recordset };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron actualizar los datos de empresa.",
                    };
                }
            });

        connection.close();
        return lotes;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerLotesHR(data) {
   
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const lotes = await connection
            .request()
            .input("IdFase", sql.Int, data.idFase)
            .input("IdDesarrollo", sql.Int, data.idDesarrollo)
            .execute("HR_LotesObtener")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset) {
                    return { lotes: recordset };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron actualizar los datos de empresa.",
                    };
                }
            });

        connection.close();
        return lotes;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerLotesDisponibles(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const lotes = await connection
            .request()
            .input("IdFase", sql.Int, data.idFase)
            .input("IdDesarrollo", sql.Int, data.idDesarrollo)
            .execute("DES_LotesDisponibles")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset) {
                    return { lotes: recordset };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron actualizar los datos de empresa.",
                    };
                }
            });

        connection.close();
        return lotes;
    } catch (error) {
        return { error: true, message: error.message };
    }
}



async function obtenerLotesById(id) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const lote = await connection
            .request()
            .input("IdLote", sql.Int, id)
            .execute("DES_Lotes_obtener_id")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset[0]) {
                    return { lote: recordset[0] };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron obtener los datos del lote.",
                    };
                }
            });

        connection.close();
        return lote;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function editarLote(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const empresa = await connection
            .request()
            .input("IdLote", sql.Int, data.IdLote)
            .input("IdDesarrollo", sql.Int, data.IdDesarrollo)
            .input("IdFase", sql.Int, data.IdFase)
            .input("IdTipo", sql.Int, data.Id_Tipo)
            .input("Base", sql.Float, data.Base)
            .input("Altura", sql.Float, data.Altura)
            .input("m2", sql.Float, data.m2)
            .input("Precio_m2", sql.Float, data.Precio_m2)
            .input("Precio_Total", sql.Float, data.Precio_Total)
            .input("Clausula1", sql.NVarChar, data.Clausula1)
            .input("Clausula2", sql.NVarChar, data.Clausula2)
            .input("Notas", sql.NVarChar, data.Notas)
            .input("NumTablaje", sql.NVarChar, data.NumTablaje)
            .input("Nombre", sql.NVarChar, data.nombre)
            .input("Activo", sql.NVarChar, data.Activo)
            .execute("DES_Lotes_editar")
            .then((dbData) => {
            
                const rowsAffected = dbData.rowsAffected;

                try {

                    if (rowsAffected[0] > 0) {
                        return { updated: true };
                    } else {
                        return {
                            error: true,
                            message: "No se actualizaron los datos de Lotes.",
                        };
                    }

                } catch (error) {
              
                    return { error: true, message: error.message };
                }


            });

        connection.close();
        return empresa;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function crearLote(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const empresa = await connection
            .request()
            .input("IdDesarrollo", sql.Int, data.iddesarrollo)
            .input("IdFase", sql.Int, data.idfase)
            .input("IdTipo", sql.Int, data.idtipo || 1)
            .input("Base", sql.Int, data.base)
            .input("Altura", sql.Int, data.altura)
            .input("m2", sql.Int, data.m2)
            .input("Precio_m2", sql.Float, data.precio)
            .input("Precio_Total", sql.Float, data.preciototal)
            .input("Clausula1", sql.NVarChar, data.clausula1)
            .input("Clausula2", sql.NVarChar, data.clausula2)
            .input("NumTablaje", sql.NVarChar, data.numtablaje)
            .input("nombre", sql.NVarChar, data.nombre)
            .execute("DES_Lotes_crear")
            .then((dbData) => {

                const recordset = dbData.recordset;

                if (recordset[0]) {
                    return { insert: true, record: recordset[0] };
                } else {
                    return {
                        error: true,
                        message: "No se creo el lote.",
                    };
                }
            });

        connection.close();
        return empresa;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function crearLotesMasivos(data) {

    let lotes = [];

    try {
        for (let i = data.start; i < (data.cantidad + data.start); i++) {
            const connection = await new sql.ConnectionPool(config).connect();
            const lote = await connection
                .request()
                .input("IdDesarrollo", sql.Int, data.iddesarrollo)
                .input("IdFase", sql.Int, data.idfase)
                .input("IdTipo", sql.Int, data.idtipo || 1)
                .input("Base", sql.Int, data.base)
                .input("Altura", sql.Int, data.altura)
                .input("m2", sql.Int, data.m2)
                .input("Precio_m2", sql.Float, data.precio)
                .input("Precio_Total", sql.Float, data.preciototal)
                .input("Clausula1", sql.NVarChar, data.clausula1)
                .input("Clausula2", sql.NVarChar, data.clausula2)
                .input("NumTablaje", sql.NVarChar, data.numtablaje)
                .input("nombre", sql.NVarChar, i)
                .execute("DES_Lotes_crear")
                .then((dbData) => {

                    const recordset = dbData.recordset;

                    if (recordset[0]) {
                        return recordset[0];
                    } else {
                        return false;
                    }
                });

            if (lote != false) {
                lotes.push(lote);
            }

            connection.close();
        }


        return lotes;
    } catch (error) {
        return { error: true, message: error.message };
    }

}


async function preReservarLotes(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const empresa = await connection
            .request()
            .input("TransactionId", sql.VarChar, data.TransactionId)
            .input("Lotes", sql.VarChar, data.Lotes)
            .execute("SP_InsertarPagoPendiente")
            .then((dbData) => {

                const recordset = dbData.recordset;

                if (recordset[0]) {
                    return { insert: true, record: recordset[0] };
                } else {
                    return {
                        error: true,
                        message: "No se reservaron los lotes",
                    };
                }
            });

        connection.close();
        return empresa;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerPagoPendiente(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const empresa = await connection
            .request()
            .input("TransactionId", sql.VarChar, data.TransactionId)
            .execute("SP_ObtenerTransaccionPendiente")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0]) {
                    return recordset[0];
                } else {
                    return {
                        error: true,
                        message: "La transaccion ha expirado",
                    };
                }
            });

        connection.close();
        return empresa;
    } catch (error) {
        return { error: true, message: error.message };
    }
}


module.exports = {
    obtenerLotes,
    obtenerLotesHR,
    obtenerLotesById,
    editarLote,
    crearLote,
    crearLotesMasivos,
    obtenerLotesDisponibles,
    preReservarLotes,
    obtenerPagoPendiente
};