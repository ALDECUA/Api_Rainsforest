const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/unidades" });
const db = require("../../database/unidades/");


router.get("/GetUnidades", koaBody(), async function(context) {
    try {
        context.body = await db.sp_GetAllUnidades();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/paises", koaBody(), async function(context) {
    try {
        context.body = await db.sp_listarPaises();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;