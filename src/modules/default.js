/**
 *  default.js
 *  @version: 1.0.0
 *  @author:  
 *  @description: Rutas y métodos para /
*/

const koaRouter = require("koa-router");
const router = new koaRouter();

router.get("/", async function (context) {
    context.body = "FIBRAX API TEST";
});

router.get("/test", async function (context) {
    context.body = "FIBRAX API";
});

module.exports = router;
