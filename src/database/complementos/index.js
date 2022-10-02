const config 	=	require('../config');
const sql		=	require('mssql');

async function getComplementos(data) {
	try {
        const connection = await new sql.ConnectionPool(config).connect();
        const complementos = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_Complementos_ObtenerActivos")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset.length > 0) {
					let complementos = [], activos = [];

					dbData.recordset.forEach(comp => {
						if (comp.activo)
							activos.push(comp);
						else
							complementos.push(comp);
					});

					return { complementos, activos }
                } else {
					return { error: true, message: 'No se econtraron complementos' };
				}
            });
        connection.close();
        return complementos;
    } catch (error) {
        throw { error: true, message: error.message };
    }
}

async function activarComplemento(data) {
	try {
		const connection = await new sql.ConnectionPool(config).connect();
        const complementos = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
			.input("p_IdPaquete", sql.Int, data.IdPaquete)
			.input("p_IdUsuario", sql.Int, data.IdUsuario)
            .execute("sp_Complementos_ActivarComplemento")
            .then(async(dbData) => {
                const rowsAffected = dbData.rowsAffected;
                if (rowsAffected[0] > 0) {
					return { activado: true }
                } else {
					return { error: true, message: 'No se activo complemento' };
				}
            });
        connection.close();
        return complementos;
	} catch(error) {
		throw { error: true, message: error.message };
	}
}

async function cancelarComplemento(data) {
	try {
		const connection = await new sql.ConnectionPool(config).connect();
        const complementos = await connection
            .request()
            .input("p_IdComplemento", sql.Int, data.IdComplemento)
			.input("p_IdUsuario", sql.Int, data.IdUsuario)
            .execute("sp_Complementos_CancelarComplemento")
            .then(async(dbData) => {
                const rowsAffected = dbData.rowsAffected;
                if (rowsAffected[0] > 0) {
					return { cancelado: true }
                } else {
					return { error: true, message: 'No se activo complemento' };
				}
            });
        connection.close();
        return complementos;
	} catch(error) {
		throw { error: true, message: error.message };
	}
}

module.exports = {
	getComplementos,
	activarComplemento,
	cancelarComplemento
}
