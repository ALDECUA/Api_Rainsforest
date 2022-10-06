const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/app" });
const db = require("../../database/app");


router.post("/inicio", koaBody({multipart: true}), async function(context) {
    try {
		console.log('multipart');
        let data = context.request.body;
        context.body = await db.sp_loginPrueba(data);
        console.log('DATOS FRONT', data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;