const config = require("../config");
const sql = require("mssql");


async function sp_GetAllNotificaciones(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const notificaciones = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetAllNotificaciones")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            notificaciones: recordset,
                        };
                    } else {
                        return { empty: true, message: "No hay notificaciones" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return notificaciones;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_GetNotificaciones(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const notificaciones = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetNotificaciones")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            notificaciones: recordset,
                        };
                    } else {
                        return { empty: true, message: "No hay notificaciones" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return notificaciones;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_UpdateStatus(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const eddited = await connection
            .request()
            .input('p_IdNotificacion', sql.Int, data.IdNotificacion)
            .execute('sp_UpdateStatusNotificaciones')
            .then((dbData) => {
                if (dbData.rowsAffected[0] > 0) {
                    return { update: true };
                } else {
                    return { error: true, message: "No fue posible marcar como leído" };
                }
            });
        connection.close();
        return eddited;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    sp_GetAllNotificaciones,
    sp_GetNotificaciones,
    sp_UpdateStatus
};