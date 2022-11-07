const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/users" });
const db = require("../../database/users/");
const moment = require('moment-timezone');


router.post("/pwd_imversionistas", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.updateInversionistaPassword(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;