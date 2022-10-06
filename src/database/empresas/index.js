const config = require("../config");
const sql = require("mssql");
const fs = require('fs');

async function obtenerEmpresas(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const empresas = await connection
            .request()
            .execute("DES_Empresas_obtener")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset) {
                    return { empresas: recordset };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron obtener los datos de empresa.",
                    };
                }
            });

        connection.close();
        return empresas;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function obtenerEmpresaslegal(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const empresas = await connection
            .request()
            .execute("DES_Empresas_obtenerlegal")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset) {
                    return { empresas: recordset };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron obtener los datos de empresa.",
                    };
                }
            });

        connection.close();
        return empresas;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerEmpresaById(id) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const empresa = await connection
            .request()
            .input("IdEmpresaDes", sql.Int, id)
            .execute("DES_Empresas_obtener_id")
            .then((dbData) => {
                const recordset = dbData.recordset;

                if (recordset[0]) {
                    return { empresa: recordset[0] };
                } else {
                    return {
                        error: true,
                        message: "No se pudieron obtener los datos de empresa.",
                    };
                }
            });

        connection.close();
        return empresa;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function editarEmpresa(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const empresa = await connection
            .request()
            .input("IdEmpresaDes", sql.Int, data.IdEmpresaDes)
            .input("RazonSocial", sql.NVarChar, data.RazonSocial)
            .input("user_upd", sql.NVarChar, data.user_upd)
            .input("Mandatario", sql.NVarChar, data.Mandatario)
            .input("Apoderado", sql.NVarChar, data.Apoderado)
            .input("GeneralesApoderado", sql.Text, data.GeneralesApoderado)
            .execute("DES_Empresas_editar")
            .then((dbData) => {
                console.log(dbData.recordsets);
                const rowsAffected = dbData.rowsAffected;

                if (rowsAffected[0] > 0) {
                    return { updated: true };
                } else {
                    return {
                        error: true,
                        message: "No se actualizaron los datos de empresa.",
                    };
                }
            });

        connection.close();
        return empresa;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function editarEmpresalegal(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const empresa = await connection
            .request()
            .input("IdEmpresaDes", sql.Int, data.IdEmpresaDes)
            .input("RazonSocial", sql.NVarChar, data.RazonSocial)
            .input("user_upd", sql.NVarChar, data.user_upd)
            .input("Mandatario", sql.NVarChar, data.Mandatario)
            .input("Apoderado", sql.NVarChar, data.Apoderado)
            .input("GeneralesApoderado", sql.Text, data.GeneralesApoderado)
            .execute("DES_Empresas_editarlegal")
            .then((dbData) => {
                console.log(dbData.recordsets);
                const rowsAffected = dbData.rowsAffected;

                if (rowsAffected[0] > 0) {
                    return { updated: true };
                } else {
                    return {
                        error: true,
                        message: "No se actualizaron los datos de empresa.",
                    };
                }
            });

        connection.close();
        return empresa;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function crearEmpresa(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const empresa = await connection
            .request()
            .input("RazonSocial", sql.NVarChar, data.RazonSocial)
            .input("user_add", sql.NVarChar(50), data.usuario || null)
            .input("Mandatario", sql.NVarChar, data.Mandatario)
            .input("Apoderado", sql.NVarChar, data.Apoderado)
            .input("GeneralesApoderado", sql.Text, data.GeneralesApoderado)
            .execute("DES_Empresas_crear")
            .then((dbData) => {

                const rowsAffected = dbData.rowsAffected;

                if (rowsAffected[0] > 0) {
                    return {
                        created: true,
                        data: dbData.recordset[0]
                    };
                } else {
                    return {
                        error: true,
                        message: "No se creo la empresa.",
                    };
                }
            });

        connection.close();
        return empresa;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function crearEmpresalegal(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const empresa = await connection
            .request()
            .input("RazonSocial", sql.NVarChar, data.RazonSocial)
            .input("user_add", sql.NVarChar(50), data.usuario)
            .input("Mandatario", sql.NVarChar, data.Mandatario)
            .input("Apoderado", sql.NVarChar, data.Apoderado)
            .input("GeneralesApoderado", sql.Text, data.GeneralesApoderado)
            .execute("DES_Empresas_crearlegal")
            .then((dbData) => {

                const rowsAffected = dbData.rowsAffected;

                if (rowsAffected[0] > 0) {
                    return {
                        created: true,
                        data: dbData.recordset[0]
                    };
                } else {
                    return {
                        error: true,
                        message: "No se creo la empresa.",
                    };
                }
            });

        connection.close();
        return empresa;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    obtenerEmpresas,
    obtenerEmpresaById,
    editarEmpresa,
    crearEmpresa,
    obtenerEmpresaslegal,
    crearEmpresalegal,
    editarEmpresalegal
};