const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/regimen" });
const db = require("../../database/regimen/");


router.get("/GetRegimen", koaBody(), async function(context) {
    try {
        context.body = await db.LoadRegimen();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;