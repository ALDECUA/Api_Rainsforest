const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/contabilidad" });
const db = require("../../database/contabilidad");
const { enviar, enviarj, enviarJM } = require("../../validar");
const fs = require("fs");
const Request = require("superagent");

router.post("/personas_comisiones", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    context.body = await db.PersonasComisiones(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/ObtenerTeamLider", koaBody(), async function (context) {
  try {
    let data = context.request.body;
  
    context.body = await db.ObtenerTeamLider(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/Volumen", koaBody(), async function (context) {
  try {
    let data = context.request.body;
   
    context.body = await db.Volumen(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/persona_comisiones", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    context.body = await db.PersonaComisiones(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/movimientos_cc", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    let result = await db.Movimientos_CC(data);
    if (result.Exito) {
      await enviarJM(
        {
          path: "NuevoMovimiento",
          data: {
            concepto: result.Descripcion,
            movimiento: result.TipoMovimiento,
            cantidad: result.Cantidad,
            usuario: result.Usuario,
            comprobante: result.Img_Comprobante,
          },
        },
        "Movimiento caja chica",
        "corporativo@fibrax.mx",
        
         ["cemsh50@hotmail.com", "alejandro.palomaresr@outlook.com"] 
      );
    }
    context.body = result;
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/movimientos", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    context.body = await db.obtenerMovimientosCC(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/reporte_movimientos", koaBody(), async function (context) {
  try {
    const data = context.request.body;
   
    let html = fs.readFileSync(
      __dirname + "/reporte_movimientos.html",
      "utf-8"
    );
    html = html.replace("{fecha}", data.fecha);
    html = html.replace("{registros}", data.movimientos);
    await Request.post(
      "https://fibraxinversiones.mx/api/storage/generar_recibo.php"
    )
      .set("Content-type", "application/json")
      .set("Accept", "application/json")
      .send({ documento: html })
      .buffer(true)
      .then((res) => {
        context.body = res.body;
        context.type = res.type;
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});


router.post("/excelLead", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    let result = await db.InsertarArrayLead(data);
 
    context.body = result;
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/excel", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    let result = await db.InsertarArray(data);
    if (result.exito) {
      /* await enviarJM(
        {
          path: "NuevoMovimiento",
          data: {
            concepto: result.Descripcion,
            movimiento: result.TipoMovimiento,
            cantidad: result.Cantidad,
            usuario: result.Usuario,
            comprobante: result.Img_Comprobante,
          },
        },
        "Movimiento caja chica",
        "corporativo@fibrax.mx",
        
         ["cemsh50@hotmail.com", "alejandro.palomaresr@outlook.com"] 
      ); */
    }
    context.body = result;
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/excelPagos", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    let result = await db.InsertarArrayPagos(data);
    context.body = result;
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/eliminarmov/:id", koaBody(), async function (context) {
  try {
    const data = context.params.id;
    context.body = await db.EliminarMovimiento(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get("/lotes/:id", koaBody(), async function (context) {
  try {
    const data = context.params.id;
    context.body = await db.ObtenerLotesInv(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/registrar_pago", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.RegistrarPago(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

module.exports = router;
