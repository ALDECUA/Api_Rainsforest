const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/lotes" });
const db = require("../../database/lotes");
const fs = require('fs');
const { Router } = require("express");

router.get("/:idDesarrollo/:idLote", koaBody(), async function (context) {
    try {
        let data = { idDesarrollo: context.params.idDesarrollo, idFase: context.params.idLote };
        context.body = await db.obtenerLotes(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/hr/:idDesarrollo/:idLote", koaBody(), async function (context) {
    try {
        let data = { idDesarrollo: context.params.idDesarrollo, idFase: context.params.idLote };
        context.body = await db.obtenerLotesHR(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/disponibles/:idDesarrollo/:idLote", koaBody(), async function (context) {
    try {
        let data = { idDesarrollo: context.params.idDesarrollo, idFase: context.params.idLote };
        context.body = await db.obtenerLotesDisponibles(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/by/id/:id", koaBody(), async function (context) {
    try {
        let id = context.params.id;
        context.body = await db.obtenerLotesById(id);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/editar", koaBody({ multipart: true }), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.editarLote(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/crear", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.crearLote(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/crear_masivos", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.crearLotesMasivos(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

router.post("/insertar_pendientes", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.preReservarLotes(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

router.post("/consultar_pendiente", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.obtenerPagoPendiente(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

module.exports = router;
