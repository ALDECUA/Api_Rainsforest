const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/referidos" });
const db = require("../../database/referidos/");
const { enviarJM } = require("../../validar");

router.post("/insertar", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    context.body = await db.insertarReferidos(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/obtener_por_asesor/:id", koaBody(), async function (context) {
  try {
    let data = context.params.id;
    context.body = await db.obtnerReferidosAsesor(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/crearReferido", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    let res = await db.referidopromotores(data);
  
    await enviarJM(
      {
        path: "NotificarReferidoAsesor",
        data: {
          Nombre: res.Nombre,
          idpersona: res.Nombre_dos,
          Nombre_S: res.Nombre_S,
          Apellido_P: res.Apellido_P,
          Apellido_M: res.Apellido_M,
          Num_Cel: res.Num_Tel,
          Email: res.Email,
        },
      },
      "Nuevo referido",
      res.EMAIL_DOS
    );
    context.body = {inserted: true}
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get("/:id", koaBody(), async function (context) {
  try {
    let data = context.params.id;
    context.body = await db.obtenerReferido(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/referido/:id", koaBody(), async function (context) {
  try {
    let data = context.params.id;
    context.body = await db.referidobyId(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/actualizarreferido", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    context.body = await db.ActualizarReferido(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

module.exports = router;
