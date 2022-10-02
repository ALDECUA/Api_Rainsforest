const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/productos" });
const db = require("../../database/productos/");


router.post("/AddProducto", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.AddProducto(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetProducto", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.GetProducto(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetBusqueda", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.CatalogoProducto(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetAllProductos", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.GetAllProducto(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetProductos", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.GetProductos(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/eliminar", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.DeleteProducto(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetAllSubProductos", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.GetAllSubProducto(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetReporteProductos", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.GetReportProducto(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;