const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/admin" });
const db = require("../../database/admin/");


router.post("/info_arqueo", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.getInfoArqueo(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});


module.exports = router;