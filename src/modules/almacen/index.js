const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/almacen" });
const db = require("../../database/almacen/");


router.post("/actualizar", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.updateInfoSucursal(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetAlmacen", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_InfoAlmacen(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetAllAlmacenes", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_GetAllAlmacen(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/eliminar", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.deleteAlmacen(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;