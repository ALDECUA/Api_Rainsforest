const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/desarrollos" });
const db = require("../../database/desarrollos");
const fs = require('fs');


router.get("/obtenerdesarrolloslotes", koaBody(), async function (context) {
    try {
        const id = context.params.body;
        context.body = await db.obtenerdesarrolloslotes();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/:idEmpresa", koaBody(), async function (context) {
    try {
        let data = context.params.idEmpresa;
        context.body = await db.obtenerDesarrollos(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/by/:id", koaBody(), async function (context) {
    try {
        const id = context.params.id;
        context.body = await db.obtenerDesarrollosById(id);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/editar", koaBody({ multipart: true }), async function (context) {
    try {
        const data = context.request.body;
        context.body = await db.editarDesarrollo(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/FiltrarLotes", koaBody(), async function (context) {
    try {
        const data = context.request.body;
        context.body = await db.FiltrarLotes(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/crear", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.crearDesarrollo(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/apartar_lotes", koaBody(), async function (context) {
    try {
        let lotes = context.request.body.lotes;
        for (let x = 0; x < lotes.length; x++) {
            let data = lotes[x];
            context.body = await db.apartarLote(data);
        }
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/subir_archivo", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.subirArchivoDesarrollo(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/subir_archivolegal", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.subirArchivoLegal(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/insertar_log_drive", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.insertarLogDrive(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;
