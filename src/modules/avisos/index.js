const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/avisos" });
const db = require("../../database/avisos/");
const { request } = require("express");

router.post("/nueva_promo", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.PromoNueva(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/promo", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.ModificarPromo(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/promos", koaBody(), async function(context) {
    try {
        context.body = await db.Promos();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/AvisosCorp/:asesordaraviso", koaBody(), async function(context) {
    try {
        let a = context.params.asesordaraviso;
        context.body = await db.AvisosCorp(a);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/InsertarAvisoIdpersona/:asesordaraviso", koaBody(), async function(context) {
    try {
        let a = context.params.asesordaraviso;
        context.body = await db.InsertarAvisoIdpersona(a);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/notificacionsend", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.notificacionsend(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/notificacionimg", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.notificacionimg(data);
        
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/notificacionagenda", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.notificacionagenda(data);
        
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/getnotificaciones", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.getnotificaciones(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/eliminarmensaje", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.eliminarmensaje(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/notificacionjuego", koaBody(), async function (context) {
    try {
      const data = context.request.body;
      let res = await db.notificacionporhora(data);
        return 1;

    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  });
  router.post("/idnotifiacion", koaBody(), async function (context) {
    try {
      let data = context.request.body;
      context.body = await db.notificacionwebapp(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  });
  router.post("/insertararray", koaBody(), async function (context) {
    try {
      let data = context.request.body;
      context.body = await db.insertararray(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  });
module.exports = router;