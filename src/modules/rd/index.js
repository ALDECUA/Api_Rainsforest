const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/rd" });
const db = require("../../database/rd/");

router.post("/insertar", koaBody(), async function (context) {
    try {
        let data = context.request.body
        context.body = await db.InsertarInteresadoAviation(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/getTickets", koaBody({ multipart: true }), async function (context) {
    try {
        context.body = await db.obtenerTickets();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

module.exports = router;