const config = require("../config");
const sql = require("mssql");


async function mensualidades(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .input('saldolote', sql.Float, data.saldolote)
            .execute("FX_Villamar")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return recordset;
                } else {
                    return {
                        error: true,
                        message: "Error de conectividad"
                    };
                }
            });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function meses(saldolote) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();

        const lista = await connection.request()
            .input('saldolote', sql.Float, saldolote)
            .execute("FX_Villamar")
            .then(async (dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return recordset;
                } else {
                    return { error: true, message: "Error interno" };
                }
            });

        connection.close();
        return lista;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    mensualidades,
    meses
   
};