const config = require("../config");
const sql = require("mssql");

async function setTokenFAD(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const FAD = await connection
            .request()
			.input('access_token', sql.NVarChar, data.access_token)
			.input('token_type', sql.NVarChar, data.token_type)
			.input('refresh_token', sql.NVarChar, data.refresh_token)
			.input('expires_in', sql.INT, data.expires_in)
			.input('scope', sql.NVarChar, data.scope)
			.input('jti', sql.NVarChar, data.jti)
			.input('creado', sql.NVarChar, data.fecha)
			.input('modificado', sql.NVarChar, data.fecha)
            .execute("sp_FAD_token")
            .then((dbData) => {
				const rowsAffected = dbData.rowsAffected;
                if (rowsAffected > 0) {
                    return { seted: true };
                } else {
                    return { seted: false };
                }
            });

        connection.close();
        return FAD;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function getToken() {
	try {
        const connection = await new sql.ConnectionPool(config).connect();
        const FAD = await connection
			.request()
            .execute("sp_FAD_token_obtener")
            .then((dbData) => {
				const recordset = dbData.recordset;
                if (recordset[0]) {
                    return recordset[0].token;
                } else {
                    throw { error: true, message: 'no se encontro el token en base de datos'}
                }
            });

        connection.close();
        return FAD;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function guardarRequisicion(requisicion, data) {
	try {
        const connection = await new sql.ConnectionPool(config).connect();
        const FAD = await connection
			.request()
			.input("idHR", sql.Int, data.idHR)
			.input("requisitionId", sql.VarChar, requisicion.requisitionId)
			.input("IdContratoDesarrollo", sql.Int, data.IdContratoDesarrollo)
			.input("Usr_add", sql.NVarChar, data.usuario)
            .execute("sp_FAD_guardar_requisición")
            .then((dbData) => {
				const rowsAffected = dbData.recordset;
                if (rowsAffected) {
                    return { created: true };
                } else {
                    throw { error: true, message: 'no se guardo la información de la requisición'}
                }
            });

        connection.close();
        return FAD;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    setTokenFAD,
	getToken,
	guardarRequisicion
};
