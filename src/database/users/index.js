/**
 *  index.js
 *  @version: 1.0.0
 *  @author: DWIT MÉXICO -
 *  @description: Funciones asyncronas para las peticiones a bases de datos /user
 */

const config = require("../config");
const sql = require("mssql");
var jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const email = require('../../email');
const validar = require('../../validar');
const host = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : 'http://admin.beflippio.com';
let Usuario = require('./user');

async function Registrar(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("p_Nombre", sql.NVarChar(100), data.Nombre)
            .input("p_Usuario", sql.NVarChar(100), data.Usuario)
            .input("p_Password", sql.NVarChar(50), data.Password)
            .input("p_idEmpresa", sql.Int, data.IdEmpresa)
            .input("p_NombreEmpresa", sql.NVarChar, data.NombreEmpresa)
            .input("p_RFC", sql.NVarChar, data.RFC)
            .input("p_Paquete", sql.NVarChar, data.IdPaquete)
            .input("p_IdRegimen", sql.Int, data.IdRegimen)
            .input("p_Telefono", sql.NVarChar, data.Telefono)
            .execute("sp_Registro")
            .then(async (dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                  
                    if (recordset[0].Valor == 1) {
                        return { user: recordset, message: 'Empresa registrada correctamente' };
                    } else {
                        return { error: true, message: "Ya existe el usuario" };
                    }
                } else {
                    return { error: true, message: "Ya existe el usuario" };
                }
            });
        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function RegistrarFacebook(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("p_email", sql.NVarChar(100), data.email)
            .input("p_name", sql.NVarChar(100), data.name)
            .input("p_id", sql.NVarChar(50), data.id)
            .input("p_NombreEmpresa", sql.NVarChar(100), data.NombreEmpresa)
            .input("p_RFC", sql.NVarChar, data.RFC)
            .input("p_Paquete", sql.NVarChar, data.IdPaquete)
            .input("p_IdRegimen", sql.Int, data.IdRegimen)
            .input("p_tipo", sql.NVarChar(5), data.tipo)
            .input("p_Telefono", sql.NVarChar, data.Telefono)
            .execute("sp_RegistroFacebook")
            .then(async (dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset[0].Valor == 1) {
                        //return { user: recordset };
                        return { user: recordset, message: 'Empresa registrada correctamente' };
                    } else {
                        return { error: true, message: "Ya existe el usuario" };
                    }
                } else {
                    return { error: true, message: "Ya existe el usuario" };
                }
            });
        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function login(data) {
    try {
        const Users = new Usuario();
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("p_Usuario", sql.NVarChar(100), data.User)
            .input("p_Password", sql.NVarChar(50), data.Password)
            .execute("sp_Login")
            .then(async (dbData) => {
                Users.setTable(dbData.recordset);
                if (Users) {
                    if (Users.tabla.length > 0) {
                        return {
                            user: Users.tabla[0]
                        };
                    } else {
                        return { empty: true, message: "El usuario o contraseña es incorrecta." };
                    }
                } else {
                    return { error: true, message: "Error Interno." };
                }
            });
        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function loginFacebook(data) {
    try {
        const Users = new Usuario();
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("email", sql.NVarChar, data.email)
            .input("name", sql.NVarChar, data.name)
            .input("p_tipo", sql.NVarChar(5), data.tipo)
            .execute("sp_LoginFacebook")
            .then(async (dbData) => {
                Users.setTable(dbData.recordset);
                if (Users) {
                    if (Users.tabla.length > 0) {
                        return {
                            user: Users.tabla[0]
                        };
                    } else {
                        return { empty: true, message: "No existe el usuario" };
                    }
                } else {
                    return { empty: true, message: "No existe el usuario" };
                }
            });
        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}


async function validateMail(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const validate = await connection
            .request()
            .input('p_email', sql.NVarChar, data.email)
            .execute('sp_ValidateUsersMail')
            .then(async dbData => {
                if (dbData.recordset.length > 0) {
                    var token = jwt.sign({ id: dbData.recordset[0].IdUsuario }, 'password');
                    const info = {
                        id: dbData.recordset[0].IdUsuario,
                        token: token,
                        fecha_caducidad: moment().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss')
                    };
                    const options = {
                        path: 'recover',
                        data: {
                            nombre: dbData.recordset[0].nombre,
                            url: `${host}/recover/${token}`
                        }
                    }
                    const sended = await email.enviar(options, 'Recuperar Contraseña', data.email);
                    if (sended.indexOf('OK') !== -1) {
                        return { data: true, info: info, message: 'Te hemos enviado un correo para restaurar tu contraseña.' };
                    } else {
                        return { data: true, info: info, message: 'Tuvimos un problema para enviar el mail, por favor inténtalo de nuevo.' };
                    }
                } else {
                    return { error: true, message: 'El correo proporcionado no coincide con nuestra base de datos.' }
                }
            });
        await connection.close();
        return validate;
    } catch (error) {
       
        return { error: true, message: error.message };
    }
}

async function updateUserPassword(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const updated = await connection
            .request()
            .input("IdUsuario", sql.Int, data.IdUsuario)
            .input("Pwd", sql.NVarChar(30), data.Pwd)
            .input("NPwd", sql.NVarChar(30), data.NPwd)
            .execute("Usuario_CambiarPwd")
            .then((dbData) => {
                if (dbData.rowsAffected[0] > 0) {
                    return { updated: true, message: 'Password actualizada correctamente' };
                } else {
                    return {
                        error: true,
                        message: "No se pudo actualizar la contraseña",
                    };
                }
            });
        connection.close();
        return updated;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function checkOldPass(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const pass = await connection
            .request()
            .input("p_idusuario", sql.Int, data.id)
            .input("p_password", sql.NVarChar, data.oldPass)
            .query("SELECT IdUsuario FROM Usuarios WHERE idusuario=@p_idusuario AND password=@p_password")
            .then(dbData => {
                if (dbData.recordset.length > 0) {
                    return { check: true }
                } else {
                    return { check: false }
                }
            })
        await connection.close();
        return pass;
    } catch (error) {
        
        return { error: true, message: error.message }
    }
}


async function AddUsuario(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("p_IdUsuario", sql.Int, data.IdUsuario)
            .input("p_Nombre", sql.NVarChar(100), data.Nombre)
            .input("p_Usuario", sql.NVarChar(100), data.Usuario)
            .input("p_Password", sql.NVarChar(50), data.Password)
            .input("p_IdRol", sql.Int, data.IdRol)
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .input("p_Img", sql.NVarChar(200), data.Img)
            .execute("sp_AddUsuario")
            .then(async (dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset[0].Valor == 0) {
                        return { inserted: true, message: 'Usuario registrado' }
                    } else {
                        if (recordset[0].Valor == 1) {
                            return { updated: true, message: 'Usuario actualizado correctamente' };
                        } else {
                            if (recordset[0].Valor == 2) {
                                return { limite: true, message: 'Llego al límite de usuarios permitidos en su paquete' };
                            } else {
                                return { error: true, message: "Ya existe el usuario" };
                            }
                        }
                    }
                } else {
                    return { error: true, message: "Ya existe el usuario" };
                }
            });
        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function getUsers(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_Usuarios_Get")
            .then(async (dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { user: recordset };
                    } else {
                        return { empty: true, message: "Sin usuarios" };
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

async function deleteUsers(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const eddited = await connection
            .request()
            .input('p_idUsuario', sql.Int, data.IdUsuario)
            .execute('sp_DeleteUsuarios')
            .then((dbData) => {
                if (dbData.rowsAffected[0] > 0) {
                    return { delete: true };
                } else {
                    return { error: true, message: "No fue posible borrar" };
                }
            });
        connection.close();
        return eddited;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function CatalogoUsuarios(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const producto = await connection
            .request()
            .input("p_Descripcion", sql.NVarChar(100), data.Descripcion)
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_CatalogoUsuario")
            .then(async (dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { producto: recordset };
                    } else {
                        return { empty: true, message: "No existe ningun usuario" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return producto;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function PerfilUsuario(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const users = await connection
            .request()
            .input("p_IdUsuario", sql.Int, data.IdUsuario)
            .execute("sp_PerfilUsuario")
            .then(async (dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { users: recordset[0] };
                    } else {
                        return { empty: true, message: "No Existe el Usuario" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return users;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function MailValidate(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const validate = await connection
            .request()
            .input('p_email', sql.NVarChar, data.email)
            .input('p_IdEmpresa', sql.Int, data.IdEmpresa)
            .execute('sp_ValidateRegistro')
            .then(async dbData => {
                if (dbData.recordset.length > 0) {
                    var token = jwt.sign({ id: dbData.recordset[0].IdUsuario }, 'usuario');
                    const info = {
                        id: dbData.recordset[0].IdUsuario,
                        token: token,
                        fecha_caducidad: moment().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss')
                    };
                    const options = {
                        path: 'recover',
                        data: {
                            nombre: dbData.recordset[0].nombre,
                            url: `${host}/validar/${token}`
                        }
                    }
                    const sended = await validar.enviar(options, 'Validar Correo', data.email);
                    if (sended.indexOf('OK') !== -1) {
                        return { data: true, info: info, message: 'Te hemos enviado un correo para validar su correo.' };
                    } else {
                        return { data: true, info: info, message: 'Tuvimos un problema para enviar el email, por favor inténtalo de nuevo.' };
                    }
                } else {
                    return { error: true, message: 'El correo proporcionado no coincide con nuestra base de datos.' }
                }
            });
        await connection.close();
        return validate;
    } catch (error) {
      
        return { error: true, message: error.message };
    }
}

async function UpdateStatusUsers(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const eddited = await connection
            .request()
            .input('p_IdUsuario', sql.Int, data.IdUsuario)
            .execute('sp_ActualizarStatusUsuario')
            .then((dbData) => {
                if (dbData.rowsAffected[0] > 0) {
                    return { update: true };
                } else {
                    return { error: true, message: "No fue posible actualizar el usuario" };
                }
            });
        connection.close();
        return eddited;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function updateFotoUsuario(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const eddited = await connection
            .request()
            .input('IdUsuario', sql.Int, data.IdUsuario)
            .input('Foto', sql.VarChar(100), data.Foto)
            .execute('CRM_CambiarFotoPerfilUsuario')
            .then((dbData) => {
              
                if (dbData.rowsAffected[0] > 0) {
                    return dbData.recordset[0];
                } else {
                    return { error: true, message: "No fue posible actualizar el usuario" };
                }
            });
        connection.close();
        return eddited;

    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function updateFotoUsuario2(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const eddited = await connection
            .request()
            .input('IdPersona', sql.Int, data.IdPersona)
            .input('Foto', sql.NVarChar(100), data.Foto)
            .execute('WA_SubirFotoPerfilPersona')
            .then((dbData) => {
               
                if (dbData.recordset) {
                    return { updated: true };
                } else {
                    return { error: true, message: "No fue posible actualizar el usuario" };
                }
            });
        connection.close();
        return eddited;

    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function updateFotoPortada(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const eddited = await connection
            .request()
            .input('IdPersona', sql.Int, data.IdPersona)
            .input('Foto', sql.NVarChar(100), data.Foto)
            .execute('WA_SubirFotoPortadaPersona')
            .then((dbData) => {
               
                if (dbData.recordset) {
                    return { updated: true };
                } else {
                    return { error: true, message: "No fue posible actualizar el usuario" };
                }
            });
        connection.close();
        return eddited;

    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function uploadDocumento(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const uploaded = await connection.request()
            .input("IdPersona", sql.Int, data.IdPersona)
            .input("IdTipoArchivo", sql.Int, data.IdTipoArchivo)
            .input("Img_Archivo", sql.NVarChar(255), data.Img_Archivo)
            .execute("HR_InsertarArchivoPorId")
            .then((dbData) => {
               
                if (dbData.recordset) {
                    return { uploaded: true };
                } else {
                    return { error: true, message: "No fue posible guardar el archivo" };
                }
            });

        connection.close();
        return uploaded;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function updateInversionistaPassword(data) {
    try {
        const updated = await config.query('UPDATE userr set Pwd = ? where IdUsuario = ?;',[data.Pwd, data.IdUsuario]);
        
        if (updated) {
            return { updated: true, message: 'Password actualizada correctamente' };
        } else {
            return {
                error: true,
                message: "No se pudo actualizar la contraseña",
            };
        }


        // UPDATE Personas set Password = @Pwd where IdPersona = @IdInversionista;
       /*  const connection = await new sql.ConnectionPool(config).connect();
        const updated = await connection
            .request()
            .input("IdInversionista", sql.Int, data.IdUsuario)
            .input("Pwd", sql.NVarChar(30), data.Pwd)
            .execute("Inversionistas_pwd")
            .then((dbData) => {
                if (dbData.rowsAffected[0] > 0) {
                    return { updated: true, message: 'Password actualizada correctamente' };
                } else {
                    return {
                        error: true,
                        message: "No se pudo actualizar la contraseña",
                    };
                }
            });
        connection.close();
        return updated; */
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    Registrar,
    RegistrarFacebook,
    login,
    loginFacebook,
    updateUserPassword,
    validateMail,
    checkOldPass,
    AddUsuario,
    getUsers,
    deleteUsers,
    CatalogoUsuarios,
    PerfilUsuario,
    MailValidate,
    UpdateStatusUsers,
    updateFotoUsuario,
    updateFotoUsuario2,
    uploadDocumento,
    updateFotoPortada,
    updateInversionistaPassword
};