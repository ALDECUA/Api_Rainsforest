const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/pais" });
const db = require("../../database/pais/");


router.get("/GetPaises", koaBody(), async function(context) {
    try {
        context.body = await db.sp_GetAllPaises();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;