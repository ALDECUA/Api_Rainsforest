const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/crm_reportes" });
const db = require("../../database/crm_reportes");
const { enviar } = require("../../validar");
const fs = require('fs');
const Request = require('superagent');
const { set } = require("../../validar/config");



router.get("/lotes", koaBody(), async function(context) {
    try {
        context.body = await db.listarLotes();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/ObtenerNiveles", koaBody(), async function(context) {
    try {
        context.body = await db.ObtenerNiveles();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/EliminarColumna/:i", koaBody(), async function(context) {
    try {
        let a = context.params.i;
        context.body = await db.EliminarColumna(a);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/InsertarColumna/:i", koaBody(), async function(context) {
    try {
        let a = context.params.i;
        context.body = await db.InsertarColumna(a);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/volumenHR", koaBody(), async function(context) {
    const data = context.request.body;
    try {
        context.body = await db.volumenHR(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/InsertarComisiones", koaBody(), async function(context) {
    const data = context.request.body;
    try {
        context.body = await db.InsertarComisiones(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/InsertarNuevoNivel", koaBody(), async function(context) {
    const data = context.request.body;
    try {
        context.body = await db.InsertarNuevoNivel(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/reporteHR", koaBody(), async function(context) {
    try {
        context.body = await db.reporteHR();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/ReportesCotizaciones", koaBody(), async function(context) {
    try {
        context.body = await db.ReportesCotizaciones();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/ReportesCotizaciones/CRM", koaBody(), async function(context) {
    try {
        context.body = await db.ReportesCotizacionesCRM();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});


router.post("/reporteFiltradoHR", koaBody({ multipart: true }), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.reporteFiltradoHR(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/reporteHRfiltro", koaBody({ multipart: true }), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.reporteHRfiltro(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/calculoOver", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.calculoOver(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/imprimir_reporte", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        let html = fs.readFileSync(__dirname + '/reporte.html', 'utf-8');
        html = html.replace('{registros}', data.registros);
        html = html.replace('{reporte}', data.reporte);
        html = html.replace('{detalles}', data.detalles);
        html = html.replace('{campos_tabla}', data.campos_tabla);
       
        await Request.post('https://fibraxinversiones.mx/api/storage/generar_recibo.php')
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
router.post("/reporteEstadisticas", koaBody(), async function(context) {
    try {
        /* hola hola */
        const data = context.request.body;
        let html = fs.readFileSync(__dirname + '/' + data.urllink, 'utf-8');
        html = html.replace('{tituloreporte}', data.tituloreporte);
        html = html.replace('{titulo}', data.titulo);
        html = html.replace('{nota}', data.nota);
        html = html.replace('{depto}', data.depto);
        html = html.replace('{fecha}', data.fecha);
        html = html.replace('{finalidad}', data.finalidad);
        html = html.replace('{cabeceras}', data.cabeceras);
        html = html.replace('{registros}', data.registros);
     
        await Request.post('https://fibraxinversiones.mx/api/storage/generar_recibo.php')
            .set('Content-type', 'application/json')
            .set('Accept', 'application/json')
            .send({ documento: html })
            .buffer(true)
            .then(res => {
                context.body = res.body;
                context.type = res.type;
            }).catch(error => {
                console.log(error);
            })

    } catch (error) {
        context.body = { error: true, message: error.message };
    }

});
router.get("/reporteECE", koaBody(), async function(context) {
    try {
        context.body = await db.reporteECE();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/hrsTANA", koaBody(), async function(context) {
    try {
        context.body = await db.hrsTANA();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})
router.get("/reporteEncuestas", koaBody(), async function(context) {
    try {
        context.body = await db.reporteEncuestas();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})
router.post("/reporteInv", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.reporteInv(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})
router.post("/reporteInvSimple", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.reporteInvSimple(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})
router.get("/reporteSexo", koaBody(), async function(context) {
    try {
        context.body = await db.reporteSexo();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})
router.get("/referidosInversionista/:IdInversionista", koaBody(), async function(context) {
    try {
        let data = context.params.IdInversionista;
        context.body = await db.obtenerReferidosInversionista(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/reporteAsesoresSimple", koaBody(), async function(context) {
    try {
        context.body = await db.reporteAsesoresSimple();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/reporteInvConRef", koaBody(), async function(context) {
    try {
        context.body = await db.reporteInvConRef();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;