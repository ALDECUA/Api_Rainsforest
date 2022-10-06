const config = require("../config");
const sql = require("mssql");
const fs = require('fs');

async function obtenerFases(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const fases = await connection
            .request()
            .input("IdDesarrollo", sql.Int, data)
            .execute("DES_Fases_obtener")
            .then((dbData) => {
				const recordset = dbData.recordset;

                if (recordset) {
                    return { fases: recordset };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron actualizar los datos de empresa.",
                    };
                }
            });

        connection.close();
        return fases;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerFasesById(id) {
	try {
        const connection = await new sql.ConnectionPool(config).connect();
        const fase = await connection
            .request()
			.input("IdFase", sql.Int, id)
            .execute("DES_Fases_obtener_id")
            .then((dbData) => {
				const recordset = dbData.recordset;

                if (recordset[0]) {
                    return { fase: recordset[0] };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron obtener los datos de la fase.",
                    };
                }
            });

        connection.close();
        return fase;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function editarFase(data) {
	try {
        const connection = await new sql.ConnectionPool(config).connect();
        const fase = await connection
            .request()
			.input("IdFase", sql.Int, data.id)
			.input("Fase", sql.NVarChar, data.fase)
            .input("Activo", sql.INT, data.activo)
            .input("Desarrollo", sql.INT, data.iddesarrollo)
            .execute("DES_Fases_editar")
            .then((dbData) => {
                
				const rowsAffected = dbData.rowsAffected;

                if (rowsAffected[0] > 0) {
                    return { updated: true };
                } else {
                    return {
                        error: true,
                        message: "No se actualizaron los datos de la fase.",
                    };
                }
            });

        connection.close();
        return fase;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function crearFase(data) {
	try {
        const connection = await new sql.ConnectionPool(config).connect();
        const fase = await connection
            .request()
			.input("Fase", sql.NVarChar, data.Fase || null)
			.input("Activo", sql.INT, data.Activo || 1 || null)
            .input("IdDesarrollo", sql.INT, data.IdDesarrollo || null)
            .execute("DES_Fases_crear")
            .then((dbData) => {
				const recordset = dbData.recordset;

                if (recordset[0]) {
                    return { insert: true, record: recordset[0] }
                } else {
                    return {
                        error: true,
                        message: "No se creo la fase.",
                    };
                }
            });

        connection.close();
        return fase;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    obtenerFases,
	obtenerFasesById,
	editarFase,
	crearFase
};