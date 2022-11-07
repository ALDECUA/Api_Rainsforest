/**
 *  index.js
 *  @version: 1.0.0
 *  @author: Dwit México -
 *  @description: Incorporación de todas las rutas de la aplicación
 */

const index = require("./default");
const auth = require("../auth/index");
const users = require("./users/index");
const login = require("./login");
const crm_usuarios = require('./crm_usuarios');
const estadisticas = require('./estadisticas');
const crm_reportes = require('./crm_reportes');
const admin = require('./admin')


module.exports = {
    modules: [
        index.routes(),
        login.routes(),
        users.routes(),
        estadisticas.routes(),
        crm_usuarios.routes(),
        crm_reportes.routes(),
        admin.routes(),
    ]
};