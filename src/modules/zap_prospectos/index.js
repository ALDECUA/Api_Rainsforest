const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/zap_prospectos" });
const db = require("../../database/zap_prospectos");

//lista los prospectos
router.get("/prospectos", koaBody(), async function(context) {
    try {
        context.body = await db.listarprospectos();
    } catch (error) {
        context.body = { error: true, message: error.message };

    }
})

//lista los socios comerciales
router.get("/SociosComerciales", koaBody(), async function(context) {
    try {
        context.body = await db.listarSC();
    } catch (error) {
        context.body = { error: true, message: error.message };

    }
})

//lista el formilario
router.post("/formulario/", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.listaFormulario(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

//lista los menus
router.get("/menus", koaBody(), async function(context) {
    try {
        context.body = await db.datamenu();
    } catch (error) {
        context.body = { error: true, message: error.message };

    }
})

//obtiene los prospectos
router.get("/ObtenerProspectos", koaBody(), async function(context) {
    try {
        context.body = await db.prospectos();
    } catch (error) {
        context.body = { error: true, message: error.message };

    }
})

router.get("/ObtenerMensajePost", koaBody(), async function(context) {
    try {
        context.body = await db.ObtenerMensajePost();
    } catch (error) {
        context.body = { error: true, message: error.message };

    }
})

router.post("/ObtenerAsigandos", koaBody(), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.Asigandos(data);
    } catch (error) {
        context.body = { error: true, message: error.message };

    }
})

router.get("/ProspectoId/:id", koaBody(), async function (context){
    try {
      let id = context.params.id;
      context.body = await db.ObtenerProspecto(id);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
})

//ver sistema, se le envia parametro para ver lista de mensajes o listra de pasos, se podria moficiar y agregar mas cosas si se desea
router.post("/ListarSistema", koaBody(), async function (context){
    try {
      let data = context.request.body;
      context.body = await db.ListarSistema(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
})
//Traer los hrs con leads
router.post("/LeadsHrs", koaBody(), async function (context){
    try {
      let data = context.request.body;
      context.body = await db.LeadsHrs(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
})
//Verificar los mensajes
router.post("/VerifiMsj", koaBody(), async function (context){
    try {
      let data = context.request.body;
      context.body = await db.VerifiMsj(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
})


//INSERTS
//asigna el lead
router.post("/AsignarProspectos", koaBody(), async function (context){
    try {
      let data = context.request.body;
      context.body = await db.AsingarLead(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  })
router.post("/Reasignacion", koaBody(), async function (context){
    try {
      let data = context.request.body;
      context.body = await db.ReasignarLead(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  })
//grupos
router.post("/insertgrupos/", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.insertargrupos(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})
//Pasos
router.post("/insertarPasos/", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.insertarpasos(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})
//Mensajes
router.post("/insertarMensaje/", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.insertarmensaje(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})
//Insertar mensaje o post
router.post("/insertarMensajePost/", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.insertarMensajePost(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})
//Update pasos
router.post("/UpdatePasos/", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.updatepasos(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})
//Update Mensajes
router.post("/UpdateMensajes/", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.updatemensajes(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

//Update Zona
router.post("/UpdateZona/", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.updatezona(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

//Asignar paso de lead
router.post("/AsignarPaso/", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.asignarpaso(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

//Saltas pasos hr
router.post("/SaltarPaso/", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.Saltwarpaso(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

//Asignar 
router.post("/UpdateName/", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        context.body = await db.updateName(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})



module.exports = router;