const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/transformaciones" });
const db = require("../../database/transformaciones/");

router.post("/AddTransformacion", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_AddTransformacion(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetTranformacion", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_GetTransformacion(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetCantidadEstimada", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_GetCantEstimada(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetAllTransformaciones", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.GetAllTransformaciones(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetProductosSub", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_GetProductosSub(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/EstadoTransformacion", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_TransformacionEstado(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;