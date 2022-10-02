const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/empresa" });
const db = require("../../database/empresa/");
const fs = require('fs');

router.post("/actualizar", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.updateInfoEmpresa(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetEmpresa", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_InfoEmpresa(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/ActualizarPaquete", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.ActualizarPaquete(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});


router.post("/GetPaquete", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        db.loadPaquete(data);
        let paquete = fs.readFileSync('./src/database/empresa/paquete.json', 'utf-8');
        if (paquete) {
            paquete = JSON.parse(paquete);
            if (Array.isArray(paquete)) {
                paquete = paquete.filter(m => m.IdEstado == 0);
            }
            context.body = { paquete }
        } else {
            context.body = { empty: true, message: 'No se pudo leer archivo de origen de modulos' };
        }
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});


module.exports = router;