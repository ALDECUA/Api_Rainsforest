const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/resumenes" });
const db = require("../../database/resumenes/");
const fs = require('fs');


router.post("/ResumenTotal", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_Resumen_Totales(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/Reportes", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_Reportes(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/Consulta", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_GetConsulta(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;