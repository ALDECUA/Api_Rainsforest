/**
 *  index.js
 *  @version: 1.0.0
 *  @author: Dwit México -
 *  @description: Incorporación de todas las rutas de la aplicación
 */

const index = require("./default");
const auth = require("../auth/index");
const users = require("./users/index");
const empresa = require("./empresa/index");
const almacen = require("./almacen/index");
const pais = require("./pais/index");
const modulos = require("./modulos/index");
const roles = require("./Roles/index");
/* const producto 			=	require("./productos/index");*/
const movimiento = require("./movimiento/index");
const inventario = require("./inventario/index");
const resumenes = require("./resumenes/index");
const notificaciones = require("./notificaciones/index");
const paquete = require("./paquete/index");
const regimen = require("./regimen/index");
const unidades = require("./unidades/index");
const transformaciones = require("./transformaciones/index");
const complementos = require('./complementos');
const login = require("./login");
const desarrollos = require("./desarrollos");
const fases = require("./fases");
const lotes = require('./lotes');
const empresas = require('./empresas');
const contratos = require('./contratos');
const estadisticas = require('./estadisticas');
const referidos = require('./referidos');
const webapp = require('./webapp');
const fxcoins = require('./fxcoins');
const hr = require('./hr');
const fx = require('./fx');
const rd = require('./rd');
const pedidos = require('./pedidos');
const crm_usuarios = require('./crm_usuarios');
const villamar = require('./villamar');
const crm_reportes = require('./crm_reportes');
const gateway = require('./gateway');
const contabilidad= require('./contabilidad');
const avisos = require('./avisos');
const grupos = require('./grupos');
const admin = require('./admin')
const mailsend = require('./emails');
const zapprospectos = require('./zap_prospectos');

//Cambio 28/06/21
const reclutamiento = require('./reclutamiento');

module.exports = {
    modules: [
        index.routes(),
        login.routes(),
        unidades.routes(),
        desarrollos.routes(),
        fases.routes(),
        lotes.routes(),
        empresas.routes(),
        contratos.routes(),
        reclutamiento.routes(),
        users.routes(),
        estadisticas.routes(),
        referidos.routes(),
        webapp.routes(),
        fxcoins.routes(),
        pedidos.routes(),
        hr.routes(),
        fx.routes(),
        rd.routes(),
        crm_usuarios.routes(),
        villamar.routes(),
        crm_reportes.routes(),
        gateway.routes(),
        contabilidad.routes(),
        avisos.routes(),
        grupos.routes(),
        admin.routes(),
        mailsend.routes(),
        zapprospectos.routes()
    ]
};