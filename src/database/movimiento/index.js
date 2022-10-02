const config = require("../config");
const sql = require("mssql");

async function sp_GetAllMovimiento(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input('p_IdEmpresa', sql.Int, data.IdEmpresa)
            .execute("sp_GetTipo")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            tipo: recordset,
                        };
                    } else {
                        return { empty: true, message: "No existen tipos de movimientos dados de alta" };
                    }
                } else {
                    return { error: true, message: "Error interno" };
                }
            });
        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_AddMovimiento(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input('pJson', sql.NVarChar, JSON.stringify(data.Json))
            .input('IdUsuario', sql.Int, data.IdUsuario)
            .execute("sp_AddMovimiento")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0].valor == 1) {
                    return { insert: true, message: 'Stock actualizado correctamente' };
                } else {
                    return {
                        error: true,
                        message: "No se pudo insertar el movimiento",
                    };
                }
            });
        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_GetPendienteTransito(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input('p_IdDestino', sql.NVarChar, data.Tipo)
            .execute("sp_GetPendienteTransito")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            tipo: recordset,
                        };
                    } else {
                        return { empty: true, message: "No hay datos" };
                    }
                } else {
                    return { error: true, message: "Error interno" };
                }
            });
        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_GetSalidasTransito(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input('p_IdOrigen', sql.NVarChar, data.Tipo)
            .execute("sp_GetSalidasTransito")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            tipo: recordset,
                        };
                    } else {
                        return { empty: true, message: "No hay datos" };
                    }
                } else {
                    return { error: true, message: "Error interno" };
                }
            });
        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_deleteMovimiento(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const eddited = await connection
            .request()
            .input('p_IdMov', sql.Int, data.IdMov)
            .input('p_IdUsuario',sql.Int,data.IdUsuario)
            .execute('sp_DeleteMovimiento')
            .then((dbData) => {
                if (dbData.rowsAffected[0] > 0) {
                    return { delete: true };
                } else {
                    return { error: true, message: "No fue posible borrar el movimiento" };
                }
            });
        connection.close();
        return eddited;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_ActualizarMov(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input('p_IdMov', sql.Int, JSON.stringify(data.IdMov))
            .input('p_Cantidad', sql.Decimal, data.Cantidad)
            .input('p_CantidadAnt', sql.Decimal, data.CantidadAnt)  
            .input('p_IdUsuario', sql.Int, JSON.stringify(data.IdUsuario))
            .execute("sp_ActualizarMovimiento")
            .then((dbData) => {
                if (dbData.rowsAffected[0] > 0) {
                    return { update: true };
                } else {
                    return { error: true, message: "No fue posible actualizar el movimiento" };
                }
            });
        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    sp_GetAllMovimiento,
    sp_AddMovimiento,
    sp_GetPendienteTransito,
    sp_GetSalidasTransito,
    sp_deleteMovimiento,
    sp_ActualizarMov
}