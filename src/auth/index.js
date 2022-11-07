

const koaRouter = require("koa-router");
const router = new koaRouter();
const auth = require('./token');

router.get("/auth/:password", async function (context) {
    const data = context.params.password || '';
    const token = auth.getToken(data);
    context.body = token;
});

module.exports = router;