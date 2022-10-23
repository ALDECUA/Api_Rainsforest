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
router.post("/guardararqueo", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.AgregarArqueo(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/agregar_banco", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.AgregarPago(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/bancos", koaBody(), async function(context) {
    try {
        context.body = await db.ObtenerBancos();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/banco", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.obtenerMovimientosBanco(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/movimiento", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.Movimientos_CG(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/movimientos", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.Array(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/arqueos/:id", koaBody(), async function(context) {
    try {
        let mes = context.params.id;
        context.body = await db.GetArqueosMes(mes);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
module.exports = router;