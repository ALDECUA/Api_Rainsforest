const config = require("../config");
const sql = require("mssql");

async function guardarSubscripcion(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const bono = await connection
            .request()
            .input("MontoFinal", sql.Float, data.MontoFinal)
            .input("MontoMensual", sql.Float, data.MontoMensual)
            .input("IdSub", sql.NVarChar, data.IdSub)
            .execute("InsertarStripeSubscripciones")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0]) {
                    return recordset[0];
                } else {
                    return {
                        error: true,
                        message: "No se insertó el bono",
                    };
                }
            });
        connection.close();
        return bono;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function subsporvencer() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const bono = await connection
            .request()
            .execute("ObtenerSubscripcionesPorVencer")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return recordset;
                } else {
                    return {
                        error: true,
                        message: "Algo salio mal",
                    };
                }
            });
        connection.close();
        return bono;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    guardarSubscripcion,
    subsporvencer
};
