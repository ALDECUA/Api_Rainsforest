const config = require("../config");
const sql = require("mssql");

async function LoadRegimen() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const regimen = await connection
            .request()
            .execute("sp_GetRegimen")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            regimen: recordset,
                        };
                    } else {
                        return { empty: true, message: "No hay régimenes" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return regimen;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    LoadRegimen
};