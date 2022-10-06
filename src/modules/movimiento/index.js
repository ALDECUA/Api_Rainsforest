const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/movimiento" });
const db = require("../../database/movimiento/");
const socket = require("../../socket");

router.post("/GetMovimiento", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_GetAllMovimiento(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/AddMovimiento", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_AddMovimiento(data);

        if (context.body.insert) {
            console.log('Entré aquí');
            socket.emit("newNotification", {notification: true});
        }
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetPendienteTransito", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_GetPendienteTransito(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetSalidasTransito", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_GetSalidasTransito(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/DeleteMovimiento", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_deleteMovimiento(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/Actualizar", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_ActualizarMov(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;