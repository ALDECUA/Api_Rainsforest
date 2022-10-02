/**
 *  index.js
 *  @version: 1.0.0
 *  @author: DWIT MÉXICO -
 *  @description: Funciones asyncronas para las peticiones a bases de datos /paises
 */

const config = require("../config");
const sql = require("mssql");

async function sp_GetAllPaquetes() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const paquetes = await connection
            .request()
            .execute("sp_GetAllPaquetes")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            paquetes: recordset,
                        };
                    } else {
                        return { empty: true, message: "No hay paquetes dados de alta" };
                    }
                } else {
                    return { error: true, message: "Error interno" };
                }
            });
        connection.close();
        return paquetes;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    sp_GetAllPaquetes
};