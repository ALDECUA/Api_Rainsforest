/**
 *  index.js
 *  @version: 1.0.0
 *  @author: DWIT MÉXICO -
 *  @description: Funciones asyncronas para las peticiones a bases de datos /paises
 */

const config = require("../config");
const sql = require("mssql");

async function sp_GetAllPaises() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const paises = await connection
            .request()
            .execute("GetAllPaises")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            paises: recordset,
                        };
                    } else {
                        return { empty: true, message: "No hay países dados de alta" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return paises;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    sp_GetAllPaises
};