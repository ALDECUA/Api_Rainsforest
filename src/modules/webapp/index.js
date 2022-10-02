const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/webapp" });
const db = require("../../database/webapp/");

router.get("/desarrollos", koaBody(), async function (context) {
  try {
    context.body = await db.obtenerDatosDesarrollos();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/desarrolloshr", koaBody(), async function (context) {
  try {
    context.body = await db.obtenerDatosDesarrollosHR();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/paises", koaBody(), async function (context) {
  try {
    context.body = await db.sp_listarPaises();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get(
  "/obtener_documentos/:id",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      context.body = await db.ObtenerTodosDocumentos(context.params.id);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);
router.post("/validacion_ip", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.VerificarIP(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post(
  "/obtener_documentos_filtrados",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      const data = context.request.body;
      context.body = await db.ObtenerDocumentosFiltrados(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);

router.post(
  "/obtener_documentos_filtrados_legal",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      const data = context.request.body;
      context.body = await db.ObtenerDocumentosFiltradosLegal(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);

router.post(
  "/editar_archivo",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      const data = context.request.body;
      context.body = await db.editarArchivo(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);
router.post(
  "/editar_archivo_legal",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      const data = context.request.body;
      context.body = await db.editarArchivoLegal(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);

router.post(
  "/eliminar_archivo",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      const data = context.request.body;
      context.body = await db.eliminarArchivo(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);

router.post(
  "/modificar_nombre",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      const data = context.request.body;
      context.body = await db.ModificarNombre(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);
router.post(
  "/eliminar_archivo_legal",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      const data = context.request.body;
      context.body = await db.eliminarArchivoLegal(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);
router.get("/estados", koaBody(), async function (context) {
  try {
    context.body = await db.sp_listarEstados();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get(
  "/cotizacion/:id",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      context.body = await db.ObtenerCotizacion(context.params.id);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);
router.get(
  "/contratosequipo/:id",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      context.body = await db.ContratosEquipo(context.params.id);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);

router.get(
  "/asignaciones/:id",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      context.body = await db.Asignaciones(context.params.id);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);
router.post("/asignar", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.AsignarHR(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

module.exports = router;
