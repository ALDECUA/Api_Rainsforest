const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/pedidos" });
const db = require("../../database/pedidos/");
const { enviar, enviarJM } = require("../../validar");
const fs = require("fs");
const Request = require("superagent");

router.get("/listar", koaBody(), async function (context) {
  try {
    context.body = await db.obtenerPedidos();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/pedido/:IdPedido", koaBody(), async function (context) {
  try {
    context.body = await db.obtenerPedidoById(context.params.IdPedido);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/top", koaBody(), async function (context) {
  try {
    context.body = await db.topVentas();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/status", koaBody(), async function (context) {
  try {
    context.body = await db.getByStatus();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/last", koaBody(), async function (context) {
  try {
    context.body = await db.lastPedidos();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/estadisticas", koaBody(), async function (context) {
  try {
    context.body = await db.estadisticasCategoria();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/crear", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    const res = await db.crearPedido(data);
    await enviarJM(
        {
          path: "PedidoCreado",
          data: {
            nombre: res.datos.Nombre,
            producto: res.datos.producto,
          },
        },
        "Solicitud Creada",
          res.datos.Email,       
      );
        context.body = res;
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/updatestatus", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    const res = await db.updateStatus(data);

    if (data.IdStatus + "" === "3") {
      await enviar(
        {
          path: "PedidoRechazado",
          data: { nombre: data.nombre, producto: data.producto },
        },
        "Tu pedido fue rechazado",
        data.Email,
        []
      );
    } else if (data.IdStatus + "" === "1") {
      await enviar(
        {
          path: "PedidoAprobado",
          data: { nombre: data.nombre, producto: data.producto },
        },
        "Tu pedido fue aprobado",
        data.Email,
        [],
        [
          {
            filename: "recibo_producto_fxcoins.pdf",
            path: `https://crm-fx.herokuapp.com/pedidos/generar_recibo/${data.IdPedido}/${data.IdPersona}`,
          },
        ]
      );
    }

    context.body = res;
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/pedidos_persona", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.ObtenerPedidosPersona(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get(
  "/generar_recibo/:pedido/:persona",
  koaBody(),
  async function (context) {
    try {
      const data = await db.ObtenerPedidosParaRecibo({
        IdPedido: context.params.pedido,
        IdPersona: context.params.persona,
      });

      if (data.error === true) {
        context.body = data;
      }

      console.log(data.Categoria);

      let html = null;
      if (data.Categoria === 1) {
        html = fs.readFileSync(__dirname + "/reciboMensualidad.html", "utf-8");
      } else if (data.IdProducto === 19) {
        html = fs.readFileSync(__dirname + "/reciboEfectivo.html", "utf-8");
      } else {
        html = fs.readFileSync(__dirname + "/recibo.html", "utf-8");
      }

      console.log(html);

      html = html.replace("{nombrecliente}", data.Nombre);
      html = html.replace("{cantidadtotal}", data.Precio_Final);
      html = html.replace("{comentarios}", "Ninguno");
      html = html.replace("{numeropedido}", data.NoPedido);
      html = html.replace("{fechapedido}", data.FechaActual);
      html = html.replace("{totalentexto}", data.PrecioTexto);
      html = html.replace("{totalfinal}", data.Precio_Final);
      html = html.replace("{fecharedimido}", data.FechaPedido);
      html = html.replace("{codigoproducto}", data.Codigo);
      html = html.replace("{descripcion}", data.NombreProducto);
      html = html.replace("{cantidad}", "1");
      html = html.replace("{precioproducto}", data.Precio_Final);
      html = html.replace("{nota}", data.Nota);
      html = html.replace("{desarrollo}", data.Desarrollo);
      html = html.replace("{etapa}", data.Fase);
      html = html.replace("{lote}", data.Lote);

      await Request.post(
        "https://greenpark.mx/api/storage/generar_recibo.php"
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
  }
);

module.exports = router;
