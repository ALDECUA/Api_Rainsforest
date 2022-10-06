const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/fases" });
const db = require("../../database/fases");
const fs = require('fs');

router.get("/:idDesarrollo", koaBody(), async function(context) {
    try {
        let data = context.params.idDesarrollo;
        context.body = await db.obtenerFases(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/by/:id", koaBody(), async function(context) {
    try {
        let data = context.params.id;
        context.body = await db.obtenerFasesById(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/editar", koaBody({multipart: true}), async function(context) {
    try {
		const data = context.request.body;
        context.body = await db.editarFase(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/crear", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        console.log(data);
        context.body = await db.crearFase(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;