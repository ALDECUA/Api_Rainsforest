/**
 *  index.js
 *  @version: 1.0.0
 *  @author: Green Park
 *  @description: Rutas y métodos para /auth
 */

const koaRouter = require("koa-router");
const router = new koaRouter();
const auth = require('./token');

router.get("/auth/:password", async function (context) {
    const data = context.params.password || '';
    const token = auth.getToken(data);
    context.body = token;
});

module.exports = router;