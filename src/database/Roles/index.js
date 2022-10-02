/**
 *  index.js
 *  @version: 1.0.0
 *  @author: DWIT MÉXICO -
 *  @description: Funciones asyncronas para las peticiones a bases de datos /roles
 */

const config = require("../config");
const sql = require("mssql");
let Roles = require('./roles');
let Rol = require('./rol');

async function listaPerfiles(data) {
    try {
        const roles = new Roles();
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .input("p_idEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetAllRoles")
            .then(async(dbData) => {
                roles.setResult(dbData.recordset);
                if (roles) {
                    if (roles.lista.length > 0) {
                        return { result: roles.lista };
                    } else {
                        return { empty: true, message: 'No se pudieron obtener los roles.' };
                    }
                }
            });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
};


async function TablaPerfiles(data) {
    try {
        const roles = new Roles();
        const connection = await new sql.ConnectionPool(config).connect();
        const result = await connection
            .request()
            .input("p_idEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetAllTablaRoles")
            .then(async(dbData) => {
                roles.setTable(dbData.recordset);
                if (roles) {
                    if (roles.tabla.length > 0) {
                        return { result: roles.tabla };
                    } else {
                        return { empty: true, message: 'No se pudieron obtener los roles.' };
                    }
                }
            });
        connection.close();
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
};

async function ValidarPerfil(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const updated = await connection
            .request()
            .input("p_Nombre", sql.NVarChar, data.Rol)
            .input("p_IdEmpresa", sql.NVarChar, data.IdEmpresa)
            .execute("sp_ValidarRol")
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { empty: true, message: 'El nombre del perfil ya existe.' }
                    } else {
                        return { empty: false, message: 'El nombre del perfil no existe.' }
                    }
                }
            });
        connection.close();
        return updated;
    } catch (error) {
        return { error: true, message: error.message };
    }
};

async function CrearPerfil(data) {
    try {
        const rol = new Rol();
        rol.setData(data);
        let result = await this.ValidarPerfil(rol);
        if (result.empty == false) {
            const connection = await new sql.ConnectionPool(config).connect();
            const updated = await connection
                .request()
                .input("p_IdRol", sql.Int, rol.IdRol)
                .input("p_Rol", sql.NVarChar, rol.Rol)
                .input("p_IdEmpresa", sql.NVarChar, rol.IdEmpresa)
                .input("p_permisos", sql.NVarChar, rol.permisos)
                .execute("sp_AddRol")
                .then((dbData) => {
                    if (dbData.rowsAffected[0] > 0) {
                        return { inserted: true, message: 'Rol registrado correctamente' }
                    } else {
                        return { error: true, message: "El rol ya existe" };
                    }
                });
            connection.close();
            return updated;
        } else {
            return { error: true, message: "El rol ya existe" };
        }
    } catch (error) {
        return { error: true, message: error.message };
    }
};


async function EditarPerfil(data) {
    try {
        const rol = new Rol();
        rol.setData(data);
        const connection = await new sql.ConnectionPool(config).connect();
        const updated = await connection
            .request()
            .input("p_IdRol", sql.Int, rol.IdRol)
            .input("p_Rol", sql.NVarChar, rol.Rol)
            .input("p_IdEmpresa", sql.NVarChar, rol.IdEmpresa)
            .input("p_permisos", sql.NVarChar, rol.permisos)
            .execute("sp_AddRol")
            .then((dbData) => {
                if (dbData.rowsAffected[0] > 0) {
                    return { update: true, message: 'Rol actualizado correctamente' }
                } else {
                    return { error: true, message: "El rol ya existe" };
                }
            });
        connection.close();
        return updated;
    } catch (error) {
        return { error: true, message: error.message };
    }
};

async function deleteRol(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const eddited = await connection
            .request()
            .input('p_idRol', sql.Int, data.IdRol)
            .execute('sp_DeleteRoles')
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0].valor == 1) {
                    return { delete: true, message: 'Rol eliminado correctamente.' };
                } else {
                    if (recordset[0].valor == 0) {
                        return { delete: false, message: 'El rol de administrador no puede ser eliminado.' };
                    } else {
                        if (recordset[0].valor == 2) {
                            return { delete: false, message: 'Rol asignado a usuario.' };
                        } else {
                            return {
                                error: false,
                                message: "No se pudo actualizar el rol.",
                            };
                        }
                    }
                }
            });
        connection.close();
        return eddited;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    listaPerfiles,
    ValidarPerfil,
    CrearPerfil,
    TablaPerfiles,
    EditarPerfil,
    deleteRol
};