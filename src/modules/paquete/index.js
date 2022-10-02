const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/paquete" });
const db = require("../../database/paquete/");


router.get("/GetPaquete", koaBody(), async function(context) {
    try {
        context.body = await db.sp_GetAllPaquetes();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;