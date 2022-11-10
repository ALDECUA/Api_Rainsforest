const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/crm_usuarios" });
const db = require("../../database/crm_usuarios");
const { enviar } = require("../../validar");

router.get("/listar_usuarios", koaBody(), async function (context) {
  try {
    context.body = await db.listarUsuarios();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get("/listar_tipousuarios", koaBody(), async function (context) {
  try {
    context.body = await db.listarTipoUsuario();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/listar_perfiles/:id", koaBody(), async function (context) {
  try {
    const id = context.params.id;
    context.body = await db.PerfilesObtenerPorId(id);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/crear_usuarios", koaBody(), async function (context) {
  try {
    let newpdw = Math.random().toString(36).slice(5);
    let data = context.request.body;
    let res = await db.CrearUsuario(data, newpdw);
    if (res.error != true) {
      await enviarJM(
        {
          path: "crearUsuario",
          data: { password: newpdw, nombre: data.Nombre, correo: data.Correo },
        },
        "Acceso rainforest",
        data.Correo
      );
    }
    context.body = res;
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/obtener_usuario_por_id", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    context.body = await db.ObetenerUsuarioPorId(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/editar_usuarios", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    context.body = await db.EditarUsuario(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/listar_perfiles", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    context.body = await db.listarPerfiles(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/crear_perfil", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    context.body = await db.CrearPerfil(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/obtener_perfil_por_id", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    context.body = await db.ObetenerPerfilPorId(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/editar_perfiles", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    context.body = await db.EditarPerfil(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get("/listar_menus", koaBody(), async function (context) {
  try {
    context.body = await db.listarMenus();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/menu_id", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    context.body = await db.listarMenusId(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/permisos_perfil", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    context.body = await db.EditarPermisos(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/enviar_correo", koaBody(), async function (context) {
  let newpdw = Math.random().toString(36).slice(5);
  let data = context.request.body;
  try {
    await enviar(
      {
        path: "crearUsuario",
        data: { password: newpdw, nombre: data.Nombre, correo: data.Correo },
      },
      "Acceso al CRM",
      data.Correo
    );
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

module.exports = router;
