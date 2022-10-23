/**
 *  default.js
 *  @version: 1.0.0
 *  @author:  
 *  @description: Rutas y métodos para /
*/

const koaRouter = require("koa-router");
const router = new koaRouter();

router.get("/", async function (context) {
    context.body = "Rainforest api TEST";
});

router.get("/test", async function (context) {
    context.body = "Rainforest api";
});

module.exports = router;
