const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/empresas" });
const db = require("../../database/empresas");
const fs = require('fs');
const { verifyToken } = require("../../helpers/middlewares");

router.get("/", koaBody(), verifyToken, async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.obtenerEmpresas(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/legal", koaBody(), verifyToken, async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.obtenerEmpresaslegal(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/:id", koaBody(), async function(context) {
    try {
		const id = context.params.id;
        context.body = await db.obtenerEmpresaById(id);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/editar", koaBody({multipart: true}), async function(context) {
    try {
		const data = context.request.body;
        context.body = await db.editarEmpresa(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/editarlegal", koaBody({multipart: true}), async function(context) {
    try {
		const data = context.request.body;
        context.body = await db.editarEmpresalegal(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/crear", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.crearEmpresa(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/crearlegal", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.crearEmpresalegal(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;