/**
 *  index.js
 *  @version: 1.0.0
 *  @author: DWIT MÉXICO -
 *  @description: Funciones asyncronas para las peticiones a bases de datos /empresa
 */

const config = require("../config");
const sql = require("mssql");
const fs = require('fs');

async function updateInfoEmpresa(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const updated = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .input("p_NombreComercial", sql.NVarChar, data.NombreComercial)
            .input("p_Nombre", sql.NVarChar, data.Nombre)
            .input("p_RFC", sql.NVarChar, data.RFC)
            .input("p_Direccion", sql.NVarChar, data.Direccion)
            .input("p_CP", sql.NVarChar, data.CP)
            .input("p_Municipio", sql.NVarChar, data.Municipio)
            .input("p_Estado", sql.NVarChar, data.Estado)
            .input("p_IdPais", sql.Int, data.IdPais)
            .input("p_Telefono", sql.NVarChar, data.Telefono)
            .input("p_Correo", sql.NVarChar, data.Correo)
            .input("p_Logo", sql.NVarChar, data.Logo)
            .input("p_IdRegimen",sql.Int,data.IdRegimen)
            .execute("Sp_UpdateEmpresa")
            .then((dbData) => {
                if (dbData.rowsAffected[0] > 0) {
                    return { updated: true, message: 'Datos de la empresa actualizado correctamente.' };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron actualizar los datos de empresa.",
                    };
                }
            });
        connection.close();
        return updated;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_InfoEmpresa(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetEmpresaByID")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            user: recordset[0],
                        };
                    } else {
                        return { empty: true, message: "No existe la empresa" };
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

async function ActualizarPaquete(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const updated = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .input("p_IdPaquete", sql.NVarChar, data.IdPaquete)
            .execute("sp_UpdatePaquete")
            .then((dbData) => {
                if (dbData.rowsAffected[0] > 0) {
                    return { updated: true, message: 'Paquete actualizado correctamente' };
                } else {
                    return {
                        error: true,
                        message: "No Se Pudo Actualizar El Paquete",
                    };
                }
            });
        connection.close();
        return updated;
    } catch (error) {
        return { error: true, message: error.message };
    }
}


async function loadPaquete(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const paquete = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetPaquete")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        fs.writeFileSync(`${__dirname}/paquete.json`, JSON.stringify(recordset));
                        return { paquete: recordset }
                    } else {
                        return { empty: true, message: "No se obtuvo su licencia." };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return paquete;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    updateInfoEmpresa,
    sp_InfoEmpresa,
    ActualizarPaquete,
    loadPaquete
};