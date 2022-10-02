/**
 *  index.js
 *  @version: 1.0.0
 *  @author: DWIT MÉXICO -
 *  @description: Funciones asyncronas para las peticiones a bases de datos /Roles
 */

const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/Roles" });
const db = require("../../database/Roles/");


router.post("/lista", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.listaPerfiles(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/tabla", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.TablaPerfiles(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/crear", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.CrearPerfil(data);

    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/editar", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.EditarPerfil(data);

    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/eliminar", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.deleteRol(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;