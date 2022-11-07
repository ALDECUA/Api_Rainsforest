/**
 *  index.js
 *  @version: 1.0.0
 *  @author: Dwit México -
 *  @description: Incorporación de todas las rutas de la aplicación
 */

const index = require("./default");
const auth = require("../auth/index");
const users = require("./users/index");
const pais = require("./pais/index");
const modulos = require("./modulos/index");
const roles = require("./Roles/index");
/* const producto 			=	require("./productos/index");*/
const movimiento = require("./movimiento/index");
const resumenes = require("./resumenes/index");
const notificaciones = require("./notificaciones/index");
const paquete = require("./paquete/index");
const regimen = require("./regimen/index");
const unidades = require("./unidades/index");
const transformaciones = require("./transformaciones/index");
const login = require("./login");
const lotes = require('./lotes');
const estadisticas = require('./estadisticas');
const referidos = require('./referidos');
const webapp = require('./webapp');
const rd = require('./rd');
const pedidos = require('./pedidos');
const crm_usuarios = require('./crm_usuarios');
const villamar = require('./villamar');
const crm_reportes = require('./crm_reportes');
const admin = require('./admin')
const zapprospectos = require('./zap_prospectos');
//Cambio 28/06/21
const reclutamiento = require('./reclutamiento');

module.exports = {
    modules: [
        index.routes(),
        login.routes(),
        unidades.routes(),
        lotes.routes(),
        reclutamiento.routes(),
        users.routes(),
        estadisticas.routes(),
        referidos.routes(),
        webapp.routes(),
        pedidos.routes(),
        rd.routes(),
        crm_usuarios.routes(),
        villamar.routes(),
        crm_reportes.routes(),
        admin.routes(),
        zapprospectos.routes()
    ]
};