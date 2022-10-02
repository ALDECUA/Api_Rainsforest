/**
 *  index.js
 *  @version: 1.0.0
 *  @author: DWIT MÉXICO -
 *  @description: Funciones asyncronas para las peticiones a bases de datos /resumen
 */

const config = require("../config");
const sql = require("mssql");

async function sp_Resumen_Totales(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const totales = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_Resumen_Totales")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            totales: recordset[0],
                        };
                    } else {
                        return { empty: true, message: "No hay información" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return totales;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_Reportes(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const reportes = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetReportes")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            reportes: recordset,
                        };
                    } else {
                        return { empty: true, message: "No hay reportes" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return reportes;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_GetConsulta(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const reporte = await connection
            .request()
            .input("p_desde", sql.DateTime2, data.desde)
            .input("p_hasta", sql.DateTime2, data.hasta)
            .input("p_IdBodega", sql.Int, data.IdBodega)
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute(data.Consulta)
            .then(async dbData => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            reports: recordset,
                            message: "Datos Obtenidos Correctamente"
                        };
                    } else {
                        return { empty: true, message: "No se encontró reporte" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return reporte;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    sp_Resumen_Totales,
    sp_Reportes,
    sp_GetConsulta
};