const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/dashboard" });
const db = require("../../database/estadisticas");
const fs = require('fs');

router.get("/info_estadisticas", koaBody(), async function (context) {
    try {
        context.body = await db.obtenerEstadisticas();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/reporte_sc/:id", koaBody(), async function (context) {
    const id = context.params.id;
    try {
        context.body = await db.obtenerPersonasSC(id);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/ultimos_registros_personas", koaBody(), async function (context) {
    try {
        context.body = await db.obtenerUltimosRegistros();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/reporte_reclutas", koaBody(), async function (context) {
    try {
        context.body = await db.ObtenerReclutas();
    } catch (error) {
        context.body = {error: true, message: error.message };
    }
});

module.exports = router;