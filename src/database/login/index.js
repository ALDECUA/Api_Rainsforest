/**
 *  index.js
 *  @version: 1.0.0
 *  @author: DWIT MÉXICO -
 *  @description: Funciones asyncronas para las peticiones a bases de datos /paises
 */
 const webpush = require('web-push');
 
 const cors = require('cors')
 const bodyParser = require('body-parser'); 
 const fs = require('fs');
 const path = require('path');
const config = require("../config");
const sql = require("mssql");

 
async function sp_loginPrueba(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const login = await connection
            .request()
            .input("Correo", sql.VarChar(254), data.Correo || null)
            .input("Pwd", sql.VarChar(50), data.Pwd || null)
            .input("IP", sql.VarChar(30), data.IP || null)
            .execute("LoginApp")
            .then(async (dbData) => {
                //console.log(dbData.recordsets);
                const recordset = dbData.recordsets;
                if (recordset) {
                    if (recordset.length > 0) {
                        return {
                            persona: recordset[0][0],
                            archivos: recordset[1],
                            Resultado: recordset[2]
                            
                        };
                    } else {
                        return { empty: true, message: "Error de credenciales" };
                    }
                } else {
                    return { error: true, message: "Error interno" };
                }
            });
        connection.close();
        return login;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function loginCrm(data) {
    try {
        
        if(data.IdPersona ){
         
            const login = await config.query('SELECT * FROM userr WHERE IdUsuario = ?  AND IdStatus = 1',[data.IdPersona]);
            const menus = await config.query('SELECT IdMenu ,Leer AS Lectura, Editar AS Edicion, Eliminar FROM perfilmenus WHERE IdPerfil = ?',[JSON.parse(JSON.stringify(login[0]))[0].IdPerfil]);
            if (login) {
                if (login.length > 0) {
                    let loginregresar = JSON.parse(JSON.stringify(login[0]))[0];
                    loginregresar.permisos = JSON.stringify({Menus: (JSON.parse(JSON.stringify(menus))[0])})
                    return loginregresar;
                } else {
                    return { empty: true, message: "Error de credenciales" };
                }
            } else {
                return { error: true, message: "Error interno" };
            }
        }else{

            const login = await config.query('SELECT * FROM userr WHERE Correo LIKE ? AND Pwd LIKE ? AND IdStatus = 1',[data.Correo,data.Pwd]);
            const menus = await config.query('SELECT IdMenu ,Leer AS Lectura, Editar AS Edicion, Eliminar FROM perfilmenus WHERE IdPerfil = ?',[JSON.parse(JSON.stringify(login[0]))[0].IdPerfil]);
            const Miembros = await config.query('SELECT COUNT(U.IdUsuario) AS Miembros FROM userr AS U LEFT JOIN perfiles AS P ON P.IdPerfil = U.IdPerfil  WHERE P.IdPerfil = ?',[JSON.parse(JSON.stringify(login[0]))[0].IdPerfil]);
            if (login) {
                if (login.length > 0) {                
                    let loginregresar = JSON.parse(JSON.stringify(login[0]))[0];
                    loginregresar.Miembros = JSON.parse(JSON.stringify(Miembros[0]))[0].Miembros;
                    loginregresar.permisos = JSON.stringify({Menus: (JSON.parse(JSON.stringify(menus))[0])})
                    return loginregresar;
                } else {
                    return { empty: true, message: "Error de credenciales" };
                }
            } else {
                return { error: true, message: "Error interno" };
            }
        }
        
       
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function loginInversionista(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
     
        const login = await connection
            .request()
            .input("Correo", sql.VarChar(254), data.Correo || null)
            .input("Pwd", sql.VarChar(50), data.Pwd || null)
            .input("IP", sql.VarChar(30), data.IP || null)
            .input("Id", sql.Int, data.IdPersona || 0)
            .execute("InversionistasLogin")
            .then(async (dbData) => {
           
                const recordset = dbData.recordsets;
                if (recordset) {
                    if (recordset.length > 0) {
                    
                        return {
                            persona: recordset[0][0],
                            archivos: recordset[1],
                            pagos: recordset[3],
                            inversiones: recordset[2]
                        };
                    } else {
                        return { empty: true, message: "Error de credenciales" };
                    }
                } else {
                    return { error: true, message: "Error interno" };
                }
            });
        connection.close();
        return login;
    } catch (error) {
        
        return { error: true, message: error.message };
    }
}

async function getUserDataCRM(data) {
    try {
        const login = await config.query('SELECT * FROM userr WHERE IdUsuario = ?  AND IdStatus = 1',[data.IdUsuario]);
        const menus = await config.query('SELECT IdMenu ,Leer AS Lectura, Editar AS Edicion, Eliminar FROM perfilmenus WHERE IdPerfil = ?',[JSON.parse(JSON.stringify(login[0]))[0].IdPerfil]);
        const Miembros = await config.query('SELECT COUNT(U.IdUsuario) AS Miembros FROM userr AS U LEFT JOIN perfiles AS P ON P.IdPerfil = U.IdPerfil  WHERE P.IdPerfil = ?',[JSON.parse(JSON.stringify(login[0]))[0].IdPerfil]);

        if (login) {
            if (login.length > 0) {
                let loginregresar = JSON.parse(JSON.stringify(login[0]))[0];
                loginregresar.Miembros = JSON.parse(JSON.stringify(Miembros[0]))[0].Miembros;
                loginregresar.permisos = JSON.stringify({Menus: (JSON.parse(JSON.stringify(menus))[0])})
                return loginregresar;
            } else {
                return { empty: true, message: "Error de credenciales" };
            }
        } else {
            return { error: true, message: "Error interno" };
        }


       /*  const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection.request()
            .input('IdUsuario', sql.Int, data.IdUsuario)
            .execute('CRM_me')
            .then(async (dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return recordset[0];
                    } else {
                        return { empty: true, message: "Error de credenciales" };
                    }
                } else {
                    return { error: true, message: "Error interno" };
                }
   
            })

        connection.close(); */
        return user;

    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function getHistoricoDrive() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection.request()
            .execute('sp_HistoricoDrive')
            .then(async (dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                        return recordset;
                } else {
                    return { error: true, message: "Error interno" };
                }
            })

        connection.close();
        return user;

    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function getUserWebApp(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection.request()
            .input('IdPersona', sql.Int, data.IdPersona)
            .execute('WebApp_Me')
            .then(async (dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    if (recordset.length > 0) {
                        return recordset[0][0];
                    } else {
                        return { empty: true, message: "Error de credenciales" };
                    }
                } else {
                    return { error: true, message: "Error interno" };
                }
            })

        connection.close();
        return user;

    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function getInversionista(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection.request()
            .input('IdPersona', sql.Int, data.IdPersona)
            .execute('Info_Inversionista')
            .then(async (dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    if (recordset.length > 0) {
                        return recordset[0][0];
                    } else {
                        return { empty: true, message: "Error de credenciales" };
                    }
                } else {
                    return { error: true, message: "Error interno" };
                }
            })

        connection.close();
        return user;

    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function guardarEnviar(data) {
    try{
            const connection = await new sql.ConnectionPool(config).connect();
            const user = await connection.request()
                .input('INoAS', sql.Int, data.Identificar)
                .input('IdPersona', sql.Int, data.IdPersona)
                .input('Ip', sql.VarChar(100), data.Ip)
                .input('llave2', sql.Text, data.llave2)
                .input('llave', sql.Text, data.llave)
                .input ('Estatus', sql.Int, data.Estatus)
                .execute('PWA_InsertionKeys')
                .then(async (dbData) => {
                    const recordset = dbData.recordsets;
                    if (recordset) {
                    
                    
                    } else {
                        return {
                          error: true,
                          message: "Algo salio mal",
                        };
                      }
                })
            connection.close();
            return user;
        } catch (error) {
            return { error: true, message: error.message };
        }
    
}

async function getDashboard(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection.request()
            .input('IdPersona', sql.Int, data)
            .execute('Inv_Dashboard')
            .then(async (dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    return { inversiones: recordset[0], pagos: recordset[1], siguiente: recordset[2][0]}
                } else {
                    return { error: true, message: "Error interno" };
                }
            })

        connection.close();
        return user;

    } catch (error) {
        return { error: true, message: error.message };
    }
}
module.exports = {
    sp_loginPrueba,
    loginCrm,
    getUserDataCRM,
    getUserWebApp,
    loginInversionista,
    getInversionista,
    getHistoricoDrive,
    guardarEnviar,
    getDashboard
};