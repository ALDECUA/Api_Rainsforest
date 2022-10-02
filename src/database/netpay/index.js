const config = require("../config");
const sql = require("mssql");

async function obtenerCliente(data) {
	try {
        const connection = await new sql.ConnectionPool(config).connect();
        const cuenta = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_NetPay_ObtenerCliente")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0]) {
					return recordset[0]
                }
            });
        connection.close();
        return cuenta;
    } catch (error) {
        throw { error: true, message: error.message };
    }
}

async function crearCliente(data) {
	try {
        const connection = await new sql.ConnectionPool(config).connect();
        const cliente = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
			.input("p_IdNetpay", sql.VarChar, data.IdNetpay)
			.input("p_IdUsuario", sql.Int, data.IdUsuario)
            .execute("sp_NetPay_CrearCliente")
            .then(async(dbData) => {
                const rowsAffected = dbData.rowsAffected;
                if (rowsAffected[0] > 0) {
                    return { creado: true };
                } else {
                    throw {
                        error: true,
                        message: "No se pudo registrar el cliente.",
                    };
                }
            });
        connection.close();
        return cliente;
    } catch (error) {
        throw { error: true, message: error.message };
    }
}

async function updateCliente(data) {
	try {
        const connection = await new sql.ConnectionPool(config).connect();
        const cliente = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
			.input("p_IdNetpay", sql.VarChar, data.IdNetpay)
			.input("p_IdUsuario", sql.Int, data.IdUsuario)
            .execute("sp_NetPay_UpdateCliente")
            .then(async(dbData) => {
                const rowsAffected = dbData.rowsAffected;
                if (rowsAffected[0] > 0) {
                    return { updated: true };
                } else {
                    throw {
                        error: true,
                        message: "No se pudo actualizar el cliente.",
                    };
                }
            });
        connection.close();
        return cliente;
    } catch (error) {
        throw { error: true, message: error.message };
    }
}

async function getInfoCuenta(data) {
	try {
        const connection = await new sql.ConnectionPool(config).connect();
        const cuenta = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_NetPay_InfoCuenta")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0]) {
					return recordset[0]
                } else {
                    return { empty: true, message: "No se encontro información de cuenta" };
                }
            });
        connection.close();
        return cuenta;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_GetAllNotificaciones(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const notificaciones = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetAllNotificaciones")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            notificaciones: recordset,
                        };
                    } else {
                        return { empty: true, message: "No hay notificaciones" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return notificaciones;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function getClienteCuenta(data) {
	try {
        const connection = await new sql.ConnectionPool(config).connect();
        const cuenta = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_NetPay_InfoCliente")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0]) {
					return recordset[0]
                } else {
                    return { empty: true, message: "No se encontro información del cliente" };
                }
            });
        connection.close();
        return cuenta;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function getPlanCuenta(data) {
	try {
        const connection = await new sql.ConnectionPool(config).connect();
        const cuenta = await connection
            .request()
            .input("p_idPaquete", sql.Int, data.idPaquete)
            .execute("sp_NetPay_InfoPlan")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0]) {
					return recordset[0]
                } else {
                    return { empty: true, message: "No se encontro información del plan" };
                }
            });
        connection.close();
        return cuenta;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function setSuscripcion(data) {
	try {
        const connection = await new sql.ConnectionPool(config).connect();
        const suscripcion = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
			.input("p_IdUsuario", sql.Int, data.IdUsuario)
			.input("p_IdNetPay", sql.VarChar, data.IdNetPay)
			.input("p_Tipo", sql.VarChar, data.Tipo)
			.input("p_IdPaquete", sql.Int, data.IdPaquete)
			.input("p_FechaFacturacion", sql.DateTime2, data.FechaFacturacion)
            .execute("sp_NetPay_CrearSuscripcion")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0]) {
					return recordset[0]
                } else {
                    throw { empty: true, message: "No se pudo registrar la suscripción" };
                }
            });
        connection.close();
        return suscripcion;
    } catch (error) {
        throw { error: true, message: error.message };
    }
}

async function getSuscripcion(data) {
	try {
        const connection = await new sql.ConnectionPool(config).connect();
        const suscripcion = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.idEmpresa)
            .execute("sp_NetPay_ObtenerSuscripcion")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0]) {
					return recordset[0]
                } else {
                    throw { empty: true, message: "No se obtuvo informacion de la suscripción" };
                }
            });
        connection.close();
        return suscripcion;
    } catch (error) {
        throw { error: true, message: error.message };
    }
}

async function cancelarSuscripcion(data) {
	try {
		const connection = await new sql.ConnectionPool(config).connect();
        const transacciones = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
			.input("p_IdUsuario", sql.Int, data.IdUsuario)
            .execute("sp_NetPay_CancelarSuscripcion")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0]) {
					return recordset[0]
                } else {
                    throw { empty: true, message: "No se pudo cancelar la suscripción" };
                }
            });
        connection.close();
        return transacciones;
	} catch(error) {
		throw error;
	}
}

async function getClienteTransacciones(data) {
	try {
		const connection = await new sql.ConnectionPool(config).connect();
        const suscripcion = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_NetPay_ClienteTransacciones")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0]) {
					return { pagos: recordset };
                } else {
                    return { empty: true, message: "Sin información de pagos." };
                }
            });
        connection.close();
        return suscripcion;
	} catch(error) {
		throw error;
	}
}

module.exports = {
	obtenerCliente,
	crearCliente,
	updateCliente,
	getInfoCuenta,
	getClienteCuenta,
	getPlanCuenta,
	setSuscripcion,
	getSuscripcion,
	cancelarSuscripcion,
	getClienteTransacciones
}