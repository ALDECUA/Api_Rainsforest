const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/fxcoins" });
const db = require("../../database/fxcoins/");
const fs = require('fs');
const Request = require('superagent');
const { enviar } = require("../../validar");

router.get("/productos", koaBody(), async function(context) {
    try {
        context.body = await db.obtenerProductosActivos();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/producto/:id", koaBody(), async function(context) {
    try {
        const id = context.params.id;
        context.body = await db.obtenerProducto(id);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/productos_categoria/:id", koaBody(), async function(context) {
    try {
        const id = context.params.id;
        context.body = await db.obtenerProductosCategoria(id);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/producto/guardar", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.insertarProducto(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/producto/editar", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.FC_ActualizarProductoFxCoin(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/obtener_productos_fx", koaBody(), async function(context) {
    try {
        context.body = await db.FC_ObtenerProductosFx();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/FC_ActualizarProductoFxCoin", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.FC_ActualizarProductoFxCoin(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/asignarFxCoins", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.FC_AsignarFxCoins(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/validar_codigo", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.ValidarCodigo(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/redimir_codigo", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        const res = await db.CanjearCodigo(data); //{ error: false } //a
        if (res.error !== true) {
            const datos = {...res[0][0], ...res[1][0] };
            console.log(datos);

            if (data.Recompensa === 1) {
                datos['Recompensa'] = 'Mensualidad de villamar para el lote seleccionado';
            } else if (data.Recompensa === 2) {
                datos['Recompensa'] = '2% del valor del lote seleccionado en FXCOINS';
            }

            await enviar({
                path: 'CanjearCodigo',
                data: datos
            }, 'Solicitud para canjear codigo de recomensa', 'agarcia@fibrax.mx', ['vmartin@fibrax.mx', 'fxcoins@fibrax.mx']);
        }

        context.body = res;
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/categorias", koaBody(), async function(context) {
    try {
        context.body = await db.StockCategorias();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/obtener_rankingfxc", koaBody(), async function(context) {
    try {
        context.body = await db.FC_Ranking();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/generar_recibo", koaBody(), async function(context) {

    try {
        let html = fs.readFileSync(__dirname + '/recibo.html', 'utf-8');
        console.log(html);

        html = html.replace('{nombrecliente}', 'Victor');
        html = html.replace('{cantidadtotal}', '100');
        html = html.replace('{comentarios}', 'Mi comentario');
        html = html.replace('{numeropedido}', '345');
        html = html.replace('{fechapedido}', '2 de noviembre 2021');
        html = html.replace('{totalentexto}', 'cien pesos');
        html = html.replace('{totalfinal}', '100');
        html = html.replace('{fecharedimido}', 'hoy');
        html = html.replace('{codigoproducto}', 'YWsd');
        html = html.replace('{descripcion}', 'Iphone');
        html = html.replace('{cantidad}', '1');
        html = html.replace('{precioproducto}', '100');

        await Request.post(Dominio+'api/storage/generar_recibo.php')
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
router.post("/reporte_coins", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        let html = fs.readFileSync(__dirname + '/reporte_fxcoins.html', 'utf-8');
        html = html.replace('{registros}', data.fxcoins);
        console.log(html);
        await Request.post(Dominio+'api/storage/generar_recibo.php')
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
router.get("/reporte_fxc", koaBody(), async function(context) {
    try {
        context.body = await db.FC_Reporte();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/reporte_global", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        let html = fs.readFileSync(__dirname + '/reporte_global.html', 'utf-8');
        html = html.replace('{fecha}', data.fecha);
        html = html.replace('{registros.activos}', data.activos);
        html = html.replace('{registros.inactivos}', data.inactivos);
        html = html.replace('{registros.inversionista}', data.inversionistas);
        console.log(html);
        await Request.post('https://greenpark.mx/api/storage/generar_recibo.php')
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
router.post("/reciboCustom", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        console.log(data);
        let html = fs.readFileSync(__dirname + '/reciboCustom.html', 'utf-8');
        html = html.replace('{tituloCat}', data.tituloCat);
        html = html.replace('{nombre}', data.nombre);
        html = html.replace('{cantidad}', data.cantidad);
        html = html.replace('{cantidadtexto}', data.cantTxt);
        html = html.replace('{totalCantidad}', data.totalCant);
        html = html.replace('{totalFinal}', data.totalFinal);
        html = html.replace('{nota}', data.nota);
        html = html.replace('{items}', data.items);
        html = html.replace('{itemrow}', data.itemrows);
        html = html.replace('{pedido}', data.pedido);
        html = html.replace('{fecha}', data.fecha);
        html = html.replace('{comentarios}', data.comentarios);

        console.log(data.email);
        await Request.post('https://greenpark.mx/api/storage/generate_mail_pdf.php')
            .set('Content-type', 'application/json')
            .set('Accept', 'application/json')
            .send({ documento: html, cliente: data.email })
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
router.post("/numeroTexto", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.ConvertirATexto(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }

});


module.exports = router;