const config = require("../config");
const sql = require("mssql");
const fs = require('fs');

async function loadModulosFull() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .execute("sp_Menus_Get")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        fs.writeFileSync(`${__dirname}/modulos.json`, JSON.stringify(recordset));
                        return { modulos: recordset }
                    } else {
                        return { empty: true, message: "No se obtuvieron módulos." };
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

async function loadModulos(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_Menus_GetByIdEmpresa")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { modulos: recordset }
                    } else {
                        return { empty: true, message: "No se obtuvieron módulos." };
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

module.exports = {
    loadModulosFull,
    loadModulos
};