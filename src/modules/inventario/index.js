const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/inventario" });
const db = require("../../database/inventario/");
const fs = require('fs');

router.post("/GetInventario", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.GetAllInventario(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetDetInventario", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.GetDetalleInv(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;