const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/users" });
const db = require("../../database/users/");
const moment = require('moment-timezone');

let arrayDatos = [];

router.post("/registro", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.Registrar(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/registrofacebook", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.RegistrarFacebook(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/login", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.login(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/loginfacebook", koaBody(), async function (context) {
    try {
        const data = context.request.body;
        context.body = await db.loginFacebook(data);
    } catch (error) {
     
        context.body = { error: true, message: error.message };
    }
});

router.post("/password", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.updateUserPassword(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/recover", koaBody(), async function (context) {
    try {
        const data = context.request.body;
        const validation = await db.validateMail(data);
        arrayDatos.push(validation.info);
        context.body = validation;
    
    } catch (error) {
        
        context.body = { error: true, message: error.message };
    }
});

router.post("/verificar", koaBody(), async function (context) {
    try {
        const data = context.request.body;
        const today = moment().format('YYYY-MM-DD HH:mm:ss');
        let info = arrayDatos.filter(item => item.token === data.id && today <= item.fecha_caducidad);
        context.body = { info };
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/altaUsuario", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.AddUsuario(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetUsuarios", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.getUsers(data);
        /*data.IdMenu
        data.permisos
        //checamos permiso lectura
        if (data.permios.lectura.find(l => l == data.IdMenu)) {
            console.log(data);
            context.body = await db.getUsers(data);
        } else {
            context.body = {error: true, message: 'no tiene permisos de lectura'};
        }*/
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/eliminar", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.deleteUsers(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetBusqueda", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.CatalogoUsuarios(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/GetPerfil", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.PerfilUsuario(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/validar", koaBody(), async function (context) {
    try {
        const data = context.request.body;
        const validation = await db.MailValidate(data);
        arrayDatos.push(validation.info);
        context.body = validation;
    
    } catch (error) {
       
        context.body = { error: true, message: error.message };
    }
});

router.post("/updatestatus", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.UpdateStatusUsers(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/updatefotostatus", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        
        context.body = await db.updateFotoUsuario(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/updatefotostatuswapp", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.updateFotoUsuario2(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/updateportada", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.updateFotoPortada(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/uploadfile", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.uploadDocumento(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/pwd_imversionistas", koaBody(), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.updateInversionistaPassword(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;