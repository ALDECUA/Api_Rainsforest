/**
 *  index.js
 *  @version: 1.0.0
 *  @author: DWIT MÉXICO -
 *  @description: Funciones asyncronas para las peticiones a bases de datos /almacen
 */

const config = require("../config");
const sql = require("mssql");

async function updateInfoSucursal(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const updated = await connection
            .request()
            .input("p_IdAlmacen", sql.Int, data.IdAlmacen)
            .input("p_Nombre", sql.NVarChar, data.Nombre)
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("Sp_UpdateSucursal")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0].valor == 0) {
                    return { insert: true, message: 'Almacén creado correctamente' };
                } else {
                    if (recordset[0].valor == 1) {
                        return { updated: true, message: 'Almacén actualizado correctamente' };
                    } else {
                        if (recordset[0].valor == 2) {
                            return { limite: true, message: 'Llego al límite de almacenes permitidos en su paquete' };
                        } else {
                            return {
                                error: true,
                                message: "No se puede actualizar el almacén",
                            };
                        }
                    }
                }
            });
        connection.close();
        return updated;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_InfoAlmacen(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("p_IdAlmacen", sql.Int, data.IdAlmacen)
            .execute("sp_GetAlmacenByID")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            almacen: recordset[0],
                        };
                    } else {
                        return { empty: true, message: "No existe el almacén" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_GetAllAlmacen(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetAllAlmacenes")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            almacen: recordset,
                        };
                    } else {
                        return { empty: true, message: "No hay almacenes" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function deleteAlmacen(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const eddited = await connection
            .request()
            .input('p_idAlmacen', sql.Int, data.IdAlmacen)
            .execute('sp_DeleteSucursales')
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0].Valor == 1) {
                    return { delete: true };
                } else {
                    return { error: true, message: "Imposible Eliminar: Verifique Stock Disponible en Almacén" };
                }
            });
        connection.close();
        return eddited;
    } catch (error) {
        return { error: true, message: error.message };
    }
}


module.exports = {
    updateInfoSucursal,
    sp_GetAllAlmacen,
    sp_InfoAlmacen,
    deleteAlmacen
};