const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/login" });
const db = require("../../database/login");
const jwt = require("jsonwebtoken");
const { verifyToken, JwtVerify } = require("../../helpers/middlewares");

router.post("/logout", koaBody({ multipart: true }), verifyToken, async function (context) {
    jwt.ki
});

router.post("/login", koaBody({ multipart: true }), async function (context) {
    try {
        //console.log('multipart');


        if (context.request.ip.substr(0, 7) == "::ffff:") {
            context.request.ip = context.request.ip.substr(7);
        }

        context.request.body.IP = context.request.ip;

        let data = context.request.body;

        let user = await db.sp_loginPrueba(data);


        if (user.persona.error !== 1) {
            token = await generateJwt(user.persona);
            
            context.body = {
                ...user,
                token
            }
        } else {
            
            context.body = user;
        }

        
        //console.log('DATOS FRONT', data);
    } catch (error) {
      
        context.body = { error: true, message: error.message };
    }
});



/* router.post("/login_inversionista", koaBody({ multipart: true }), async function (context) {
    try {
        //console.log('multipart');
        if (context.request.ip.substr(0, 7) == "::ffff:") {
            context.request.ip = context.request.ip.substr(7);
        }

        context.request.body.IP = context.request.ip;

        let data = context.request.body;

        let user = await db.loginInversionista(data);


        if (user.persona.error !== 1) {
            token = await generateJwt(user.persona);
            
            context.body = {
                ...user,
                token
            }
        } else {
            context.body = user;
        }
       
        //console.log('DATOS FRONT', data);
    } catch (error) {
        
        context.body = { error: true, message: error.message };
    }
}); */

router.post("/login_inversionista", koaBody({ multipart: true }), async function (context) {
    try {
        //console.log('multipart');
        let data = context.request.body;

        let user = await db.loginCrm(data);
        
        console.log(user)
        if (user.IdUsuario) {
            token = await generateJwt(user);
            context.body = {
                persona: user,
                token
            }

        } else {
            context.body = user;
        }
        //context.body = user;

    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});


router.post('/crm_me', koaBody({ multipart: true }), verifyToken, async function (context) {
    try {

        const bearerHeader = context.get('Authorization');
        const bearerToken = bearerHeader.split(" ")[1];
        context.request.body.token = bearerToken;
        const loggedUser = await JwtVerify(bearerToken);
        context.request.body.IdUsuario = loggedUser.IdUsuario;

        let data = context.request.body;
        let user = await db.getUserDataCRM(data);
        context.body = user;
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

router.post('/webapp_me', koaBody(), async function (context) {
    try {
        
       /*  const bearerHeader = context.get('Authorization');
        const bearerToken = bearerHeader.split(" ")[1];
        context.request.body.token = bearerToken;
        const loggedUser = await JwtVerify(bearerToken);
        context.request.body.IdPersona = loggedUser.IdPersona;
         
        let data = context.request.body;
        console.log(data); */
        let data = context.request.body;
        let user = await db.getUserWebApp(data);
        context.body = user;
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post('/info_inversionistas', koaBody({ multipart: true }), verifyToken, async function (context) {
    try {

        const bearerHeader = context.get('Authorization');
        const bearerToken = bearerHeader.split(" ")[1];
        context.request.body.token = bearerToken;
        const loggedUser = await JwtVerify(bearerToken);
        context.request.body.IdPersona = loggedUser.IdPersona;
       

        let data = context.request.body;
        let user = await db.getInversionista(data);
        context.body = user;
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

router.get("/historico_drive", koaBody(), async function (context) {
    try {
      context.body = await db.getHistoricoDrive();
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  });


function generateJwt(user) {

    return new Promise(function (resolve, reject) {
        jwt.sign(user, 'secretKey', { expiresIn: '86400s' }, async (err, token) => {
            resolve(token);
        });

    });
}
router.post("/pwa", koaBody({ multipart: true }), async function (context) {
    try {
        let data = context.request.body;
        context.body = await db.guardarEnviar(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/dashboard/:id", koaBody(), async function (context) {
    try {
      const data = context.params.id;
      context.body = await db.getDashboard(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
});

router.get("/webapp_me/:id", koaBody(), async function (context) {
    try {
      const data = { IdPersona: context.params.id};
      let user = await db.getUserWebApp(data);
      context.body = user;
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
});
module.exports = router;