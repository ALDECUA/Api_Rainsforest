const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/modulos" });
const db = require("../../database/modulos/");
const fs = require('fs');

db.loadModulosFull();

router.post("/get", koaBody(), async function(context) {
    try { 
        let data = context.request.body;    
        let modulos = await db.loadModulos(data);
        if (modulos) {
            if (Array.isArray(modulos)) {
                modulos = modulos.filter(m => m.IdEstado == 1);
            }
            context.body = { ...modulos }
        } else {
            context.body = { empty: true, message: 'No se pudo leer archivo de origen de modulos' };
        }
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;