const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/villamar" });
const db = require("../../database/villamar/");
const fs = require('fs');
const { enviar } = require("../../validar");

router.post("/cotizador", koaBody(), async function (context) {
    try {
        const data = context.request.body;
        context.body = await db.mensualidades(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/meses/:saldolote", koaBody({ multipart: true }), async function (context) {
    try {
        context.body = await db.meses(context.params.saldolote);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});



module.exports = router;