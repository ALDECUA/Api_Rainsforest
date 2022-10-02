const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/grupos" });
const db = require("../../database/grupos/");

router.post("/insertar", koaBody(), async function (context) {
    try {
        let data = context.request.body
        context.body = await db.nuevo_grupo(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/busqueda", koaBody(), async function (context) {
    try {
        let data = context.request.body
        context.body = await db.busqueda(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/publicacion", koaBody(), async function (context) {
    try {
        let data = context.request.body
        context.body = await db.publicacion(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/publicaciones", koaBody(), async function (context) {
    try {
        let data = context.request.body
        context.body = await db.publicaciones(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/like", koaBody(), async function (context) {
    try {
        let data = context.request.body
        context.body = await db.like(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
module.exports = router;