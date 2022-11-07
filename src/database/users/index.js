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

    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
   

    updateInversionistaPassword
};