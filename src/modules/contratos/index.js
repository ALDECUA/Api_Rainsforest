const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/contratos" });
const db = require("../../database/contratos");
const db2 = require("../../database/contratos/FAD");
const fs = require('fs');
const Request = require('superagent');
const FAD = require('./FAD');
const Dominio = "https://greenpark.mx/";

FAD(router);

const desarrollosGeneradores = {
    8: 'generar_mantra.php',
    10: 'generar_villamar.php',
    11: 'generar.php',
};

router.get("/", koaBody(), async function (context) {
    try {
        let data = context.params.query;
        context.body = await db.obtenerContratos(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/contratos_legal", koaBody(), async function (context) {
    try {
        let data = context.params.query;
        context.body = await db.obtenerContratoslegal(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/:id", koaBody(), async function (context) {
    try {
        let data = context.params.id;
        context.body = await db.obtenerContratosById(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/obtener/pdf/:id", koaBody(), async function (context) {
    try {
        const pdf = await db.obtenerMachote(context.params);
        let endpoint = desarrollosGeneradores[pdf.IdDesarrollo];
        //http request
        await Request.get(Dominio+'pruebas_dwit/tcpdf/' + (endpoint !== undefined ? endpoint : 'generar2.php'))
            .set('Content-type', 'application/json')
            .set('Accept', 'application/json')
            .send({ documento: pdf.Machote })
            .buffer(true)
            .then(res => {
                context.body = res.body;
                context.type = res.type;
            });
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/status/contratos", koaBody(), async function (context) {
    try {
        context.body = await db.obtenerContratosStatus();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/obtener/documentodigital/:idHR", koaBody(), async function (context) {
    try {
        let idHR = context.params.idHR;
        const pdf = await db.obtenerDocumentoDigital(idHR);

        if (pdf.error === 1) {
            context.status = 401;
            context.body = { error: true, message: pdf.message };
            return;
        }

        await Request.post(Dominio+'pruebas_dwit/tcpdf/' + desarrollosGeneradores[pdf.IdDesarrollo])
            .set('Content-type', 'application/json')
            .set('Accept', 'application/json')
            .send(pdf)
            .buffer(true)
            .then(res => {
                context.body = res.body;
                context.type = res.type;
            }).catch(error => {
                context.body = { error: true, message: 'Error al generar el documento' };
            });
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/probar/pdf", koaBody(), async function (context) {
    try {
        const html = fs.readFileSync(__dirname + '/formato2.html', 'utf-8');
        await Request.post(Dominio+'pruebas_dwit/tcpdf/generar.php')
            .set('Content-type', 'application/json')
            .set('Accept', 'application/json')
            .send({ documento: html })
            .buffer(true)
            .then(res => {
                context.body = res.body;
                context.type = res.type;
            }).catch(error => {
                console.log(error);
            });
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/", koaBody(), async function (context) {
    try {
        let data = context.params.id;
        context.body = await db.obtenerContratosById(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/editar", koaBody({ multipart: true }), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.editarContrato(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/editar_legal", koaBody({ multipart: true }), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.editarContratolegal(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/crear", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.crearContrato(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/crearlegal", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.crearContratolegal(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/setfirmado", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.setContratoFirmado(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/reenviar/contrato", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.reenviarYResetearContrato(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/agregar/celda", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.crearCeldaParaContrato(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/obtener_celdas/:id", koaBody(), async function (context) {
    try {
        let data = context.params.id;
        context.body = await db.obtenerCeldasDeContrato(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/actualizar/celda", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.actualizarContenidoCelda(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/eliminar/celda", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.eliminarCeldaContrato(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/obtener_contrato_por_verificar/:idhr", koaBody(), async function (context) {
    try {
        let data = context.params.idhr;
        context.body = await db.obtenerContratoParaVerificar(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/verificar/clausula", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.aceptarClausulaContrato(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/verificar_contrato", koaBody(), async function (context) {

    try {
        let data = context.request.body;
        console.log(data);
        context.body = await db.verificar_contrato(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

router.post("/llenarcelda", koaBody(), async function (context) {

    try {
        let data = context.request.body;
        context.body = await db.llenarCelda(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})


module.exports = router;
