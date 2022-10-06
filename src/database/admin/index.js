/**
 *  index.js
 *  @version: 1.0.0
 *  @author: DWIT MÉXICO -
 *  @description: Funciones asyncronas para las peticiones a bases de datos /admin
 */

const config = require("../config");
const sql = require("mssql");

async function getInfoArqueo(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const updated = await connection
            .request()
            .input("fecha",sql.Date, data.fecha)
            .execute("CRM_ArqueoDia")
            .then((dbData) => {
                const recordset = dbData.recordset;
                return recordset[0]
            });
        connection.close();
        return updated;
    } catch (error) {
        return { error: true, message: error.message };
    }
}



module.exports = {
    getInfoArqueo,
};