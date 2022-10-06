const config = require("../config");
const sql = require("mssql");
const fs = require('fs');

async function obtenerContratos(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contratos = await connection
            .request()
            .execute("DES_Contratos_obtener")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset) {
                    return { contratos: recordset };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron obtener los datos.",
                    };
                }
            });

        connection.close();
        return contratos;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerContratoslegal(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contratos = await connection
            .request()
            .execute("DES_Contratos_obtener_legal")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset) {
                    return { contratos: recordset };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron obtener los datos.",
                    };
                }
            });

        connection.close();
        return contratos;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerContratosById(id) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .input("IdContrato", sql.Int, id)
            .execute("DES_Contratos_obtener_id")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset[0]) {
                    return { contrato: recordset[0] };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron obtener los datos del contrato.",
                    };
                }
            });

        connection.close();
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerContratosStatus(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contratos = await connection
            .request()
            .execute("SP_HR_ContratosPendientes")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset) {
                    return { contratos: recordset };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron obtener los datos.",
                    };
                }
            });

        connection.close();
        return contratos;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerDocumentoDigital(idHR) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .input("IdHR", sql.Int, idHR)
            .execute("sp_GenerarContrato")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0]) {
                    return recordset[0];
                } else {
                    return {
                        error: true,
                        message: "No se pudieron obtener los datos.",
                    };
                }
            });

        connection.close();
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function editarContrato(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const empresa = await connection
            .request()
            .input("IdContrato", sql.Int, data.IdContrato)
            .input("Nombre", sql.NVarChar, data.Nombre)
            .input("Machote", sql.NVarChar, data.Machote)
            .input("Clausula3", sql.Text, data.Clausula3)
            .input("Clausula4", sql.Text, data.Clausula4)
            .input("Clausula5", sql.Text, data.Clausula5)
            .input("Activo", sql.Int, data.Activo)
            .input("user_upd", sql.NVarChar, data.user_upd)
            .input("Titulo", sql.NVarChar, data.Titulo || null)
            .execute("DES_Contratos_editar")
            .then((dbData) => {
                const rowsAffected = dbData.rowsAffected;

                if (rowsAffected[0] > 0) {
                    return { updated: true };
                } else {
                    return {
                        error: true,
                        message: "No se actualizaron los datos del contrato.",
                    };
                }
            });

        connection.close();
        return empresa;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function editarContratolegal(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const empresa = await connection
            .request()
            .input("IdContrato", sql.Int, data.IdContrato)
            .input("Nombre", sql.NVarChar, data.Nombre)
            .input("Machote", sql.Text, data.Machote)
            .input("Clausula3", sql.Text, data.Clausula3 || null)
            .input("Clausula4", sql.Text, data.Clausula4 || null)
            .input("Clausula5", sql.Text, data.Clausula5 || null)
            .input("Activo", sql.Int, data.Activo || null)
            .input("user_upd", sql.NVarChar, data.user_upd)
            .input("Titulo", sql.NVarChar, data.Titulo || null)
            .execute("DES_Contratos_editar_legal")
            .then((dbData) => {
                const rowsAffected = dbData.rowsAffected;
                if (rowsAffected[0] > 0) {
                    return { updated: true };
                } else {
                    return {
                        error: true,
                        message: "No se actualizaron los datos del contrato.",
                    };
                }
            });

        connection.close();
        return empresa;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function crearContrato(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .input("Nombre", sql.NVarChar, data.Nombre)
            .input("Machote", sql.NVarChar, data.Machote || null)
            .input("Clausula3", sql.Text, data.Clausula3|| null)
            .input("Clausula4", sql.Text, data.Clausula4|| null)
            .input("Clausula5", sql.Text, data.Clausula5|| null)
            .input("Activo", sql.Int, data.Activo|| null)
            .input("user_add", sql.Int, data.user_add|| null)
            .execute("DES_Contratos_crear")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset[0]) {
                    return { insert: true, record: recordset[0] };
                } else {
                    return {
                        error: true,
                        message: "No se creo el contrato.",
                    };
                }
            });

        connection.close();
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function crearContratolegal(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .input("Nombre", sql.NVarChar, data.Nombre)
            .input("Machote", sql.Text, data.Machote || null)
            .input("Clausula3", sql.Text, data.Clausula3 || null)
            .input("Clausula4", sql.Text, data.Clausula4 || null)
            .input("Clausula5", sql.Text, data.Clausula5 || null)
            .input("Activo", sql.Int, data.Activo || 1)
            .input("user_add", sql.Int, data.user_add || null)
            .execute("DES_Contratos_crearlegal")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset[0]) {
                    return { insert: true, record: recordset[0] };
                } else {
                    return {
                        error: true,
                        message: "No se creo el contrato.",
                    };
                }
            });

        connection.close();
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerMachote(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .input("IdMachote", sql.NVarChar, data.id)
            .execute("SP_ObtenerContratos")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset[0]) {
                    return recordset[0];
                }
            });

        connection.close();
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function setContratoFirmado(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .input("IdRequi", sql.NVarChar, data.id)
            .execute("Contratos_Status_Firmar")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return { updated: true };
                }
            });

        connection.close();
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerContratosPendientes() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .execute("SP_ContratosPendientesPorFIrmar")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset) {
                    return recordset;
                }
            });

        connection.close();
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function reenviarYResetearContrato(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .input('IdContrato', sql.Int, data.IdContrato)
            .execute("HR_ReenviarContrato")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset) {
                    return recordset[0];
                } else {
                    return {
                        error: true,
                        message: "No se reenvió el contrato",
                    };
                }
            });

        connection.close();
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function crearCeldaParaContrato(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .input('NombreCelda', sql.NVarChar, data.NombreCelda)
            .input('Identificador', sql.NVarChar, data.Identificador)
            .input('TipoCelda', sql.Int, data.TipoCelda)
            .input('IdContrato', sql.Int, data.IdContrato)
            .execute("DES_CrearCeldaContrato")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return recordset[0];
                } else {
                    return {
                        error: true,
                        message: "No se reenvió el contrato",
                    };
                }
            });

        connection.close();
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerCeldasDeContrato(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .input('IdContrato', sql.Int, data)
            .execute("DES_ObtenerCeldasPorContrato")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset) {
                    return recordset;
                } else {
                    return {
                        error: true,
                        message: "No registros",
                    };
                }
            });

        connection.close();
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}


async function actualizarContenidoCelda(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .input('IdCelda', sql.Int, data.IdCelda)
            .input('ContenidoCelda', sql.NVarChar, data.ContenidoCelda)
            .input('NombreCelda', sql.NVarChar, data.NombreCelda)
            .execute("DES_ActualizarCelda")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return recordset[0];
                } else {
                    return {
                        error: true,
                        message: "No registros",
                    };
                }
            });

        connection.close();
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function eliminarCeldaContrato(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .input('IdCelda', sql.Int, data.IdCelda)
            .execute("DES_EliminarCeldaContrato")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset) {
                    return recordset[0];
                } else {
                    return {
                        error: true,
                        message: "No registros",
                    };
                }
            });

        connection.close();
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerContratoParaVerificar(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .input('IDHR', sql.Int, data)
            .execute("HR_ContratosFragmentado")
            .then((dbData) => {
                const recordset = dbData.recordsets;

                if (recordset) {
                    return { contrato: recordset[0], celdas: recordset[1], aprobados: recordset[2] };
                } else {
                    return {
                        error: true,
                        message: "No hay registros",
                    };
                }
            });

        connection.close();
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function aceptarClausulaContrato(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .input('IdContrato', sql.Int, data.IdContrato)
            .input('IdCelda', sql.Int, data.IdCelda)
            .input('IdHR', sql.Int, data.IdHR)
            .input('Del', sql.Int, data.Del)
            .execute("SP_AceptarClausulaContrato")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset) {
                    return recordset[0];
                } else {
                    return {
                        error: true,
                        message: "Error al registrar",
                    };
                }
            });
        connection.close();
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function verificar_contrato(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .input('idcontrato', sql.Int, data.idcontrato)
            .input('statusContrato', sql.Int, data.statusContrato)
            .input('User', sql.NVarChar, data.User)
            .execute("CRM_verificar_contrato")
            .then((dbData) => {
                const recordset = dbData.recordset;
                console.log(recordset);
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
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function llenarCelda(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const contrato = await connection
            .request()
            .input('IdHR', sql.Int, data.IdHR)
            .input('IdCelda', sql.Int, data.IdCelda)
            .execute("SP_GenerarCelda")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return recordset[0];
                } else {
                    return {
                        error: true,
                        message: "Algo salio mal",
                    };
                }
            });
        connection.close();
        return contrato;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    obtenerContratos,
    obtenerContratosById,
    obtenerContratosStatus,
    obtenerDocumentoDigital,
    editarContrato,
    crearContrato,
    obtenerMachote,
    setContratoFirmado,
    obtenerContratosPendientes,
    reenviarYResetearContrato,
    obtenerContratoslegal,
    editarContratolegal,
    crearContratolegal,
    crearCeldaParaContrato,
    obtenerCeldasDeContrato,
    actualizarContenidoCelda,
    eliminarCeldaContrato,
    obtenerContratoParaVerificar,
    aceptarClausulaContrato,
    verificar_contrato,
    llenarCelda
}