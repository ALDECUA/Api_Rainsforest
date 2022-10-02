const config = require("../database/config");
const sql = require("mssql");

function genOfferCode() {
    return 'FX' + Math.random().toString(36).slice(2).toUpperCase();
}

async function putCode(code, referido) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .input("Codigo", sql.VarChar, code)
            .input("IdReferido", sql.Int, referido)
            .execute("FX_SetCodigoReferido")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0]) {
                    return recordset[0];
                } else {
                    return {
                        error: true,
                        message: "No se creo el código",
                    };
                }
            });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
}


module.exports = {
    genOfferCode,
    putCode
}