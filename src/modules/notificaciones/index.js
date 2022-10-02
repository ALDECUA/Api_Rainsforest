const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/notificaciones" });
const db = require("../../database/notificaciones/");

router.post("/GetNotificaciones", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_GetAllNotificaciones(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetAllNotificaciones", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_GetNotificaciones(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});


router.post("/UpdateNotificacion", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_UpdateStatus(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});


module.exports = router;