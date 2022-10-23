const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/reclutamiento" });
const db = require("../../database/reclutamiento");
const { enviar } = require("../../validar");
const fs = require('fs');
const Request = require('superagent');

router.post("/reclutamiento", koaBody({ multipart: true }), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.sp_loginPrueba(data);
        
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

//Cambio 28/06/21
router.get("/personas", koaBody({ multipart: true }), async function(context) {
    try {
        context.body = await db.obtenerColaboradores();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/personas_activas", koaBody({ multipart: true }), async function(context) {
    try {
        context.body = await db.ListarAsesoresActivos();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/socios_comerciales", koaBody({ multipart: true }), async function(context) {
    try {
        context.body = await db.obtenerSociosComerciales();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/inversionistas_lider/:scom", koaBody({ multipart: true }), async function(context) {
    try {
        context.body = await db.obtenerInversionistasLider(context.params.scom);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/inversionistas_senior/:lider", koaBody({ multipart: true }), async function(context) {
    try {
        context.body = await db.obtenerInversionistasSenior(context.params.lider);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/listarasesores", koaBody({ multipart: true }), async function(context) {
    try {
        context.body = await db.listarAsesores();
    } catch (error) {
        context.body = { error: true, message: error.message };

    }
});

router.get("/inversionistas_jr/:senior", koaBody({ multipart: true }), async function(context) {
    try {
        context.body = await db.obtenerInversionistasJunior(context.params.senior);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.get("/inversionistas_closer/:scom", koaBody({ multipart: true }), async function(context) {
    try {
        context.body = await db.obtenerCloser(context.params.scom);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});
router.post("/insertar_simple", koaBody({ multipart: true }), async function(context) {
    try {
        let data = context.request.body;
        let result = await db.insertarPersonaSimple(data);
        if (data['isnew'] === true && result.inserted === true) {
            await enviar({
                    path: 'BienvenidaAsesor',
                    data: result.persona[0]
                }, 'Bienvenida a la webapp',
                result.persona[0].Email
            );
        }

        context.body = result;
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/actualizar_datos_generales_persona", koaBody({ multipart: true }), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.insertarDatosGenerales(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/actualizar_datos_persona", koaBody({ multipart: true }), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.Actualizar_Persona_reclutamiento(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});


router.post("/actualizar_datos_bancarios_persona", koaBody({ multipart: true }), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.insertarDatosBancarios(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

router.post("/actualizar_datos_bancarios", koaBody({ multipart: true }), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.ActualizarDatosBancarios(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

router.post("/actualizar_documentos_persona", koaBody({ multipart: true }), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.insertarDocumentosSimples(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

router.post("/actualizar_estatus_email_enviado", koaBody({ multipart: true }), async function(context) {
    try {
        let data = context.request.body;
        context.body = await db.actualizarEstatusEnvioEmail(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

//ENDPOINTS PARA PARTE DEL CRM
router.get("/obtener_persona_crm/:id", koaBody({ multipart: true }), async function(context) {
    try {
        let data = context.params.id;
        context.body = await db.obtenerDatosPersonaId(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

router.get("/cumples", koaBody({ multipart: true }), async function(context) {
    try {
        context.body = await db.obtenerCumpleanos();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})

router.post("/actualizar_status_documentos", koaBody({ multipart: true }), async function(context) {
    try {
        let datos = context.request.body.files;
        let user = context.request.body.user;
        const sendEmail = context.request.body.notify;
        let array = Object.keys(datos);
        let errorExists = false;

        //Actualizar status documentos
        array.forEach(async(element) => {
            if (datos[element]) {
                if (datos[element].EstatusGeneral === 2) {
                    errorExists = true;
                }
                datos[element].IdPersona = user.IdPersona;
                await db.updateArchivoSP(datos[element]);
            }
        });

        // Enviar correo
        if (sendEmail) {
            if (errorExists) {
                await enviar({ path: 'ReportarDocumentosR', data: { nombre: user.Nombre + ' ' + user.Apellido_P } }, 'Algunos documentos no son correctos', user.Email);
            } else {
                await enviar({ path: 'SuccessDocumentosR', data: { nombre: user.Nombre + ' ' + user.Apellido_P } }, 'Tus datos han sido verificados', user.Email);
            }
        }

        context.body = { updated: true };

    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})
router.post("/obtenerCumplesFiltrados", koaBody({ multipart: true }), async function(context) {
    const data = context.request.body;
    try {
        context.body = await db.obtenerCumplesFiltrados(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})
router.get("/actualizar_edades", koaBody({ multipart: true }), async function(context) {
    try {
        context.body = await db.ActualizarEdades();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})
router.post("/organigrama_socio_comercial", koaBody({ multipart: true }), async function(context) {
    const data = context.request.body;
    try {
        context.body = await db.OrganigramaSocioComercial(data);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
})
router.post("/reporte_global", koaBody(), async function(context) {
    try {
        const data = context.request.body;
        let html = fs.readFileSync(__dirname + '/reporte_global.html', 'utf-8');
        html = html.replace('{fecha}', data.fecha);
        html = html.replace('{registros.activos}', data.activos);
        html = html.replace('{registros.inactivos}', data.proceso);
        html = html.replace('{registros.inversionista}', data.baja);
        await Request.post('https://fibraxinversiones.mx/api/storage/generar_recibo.php')
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

router.post("/recuperar_contrasena", koaBody({ multipart: true }), async function(context) {
    try {
        let data = context.request.body;
        let result = await db.verificarEmail(data);
        if (result.Email !== undefined) {
            await enviar({
                    path: 'recuperarclaveasesor',
                    data: result
                }, 'Recuperar contraseña',
                result.Email
            );
            context.body = { message: 'Correo de recuperación enviado' };
        } else {
            context.body = { message: 'El usuario no existe', error: true };
        }
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/asesores/:scom/:lider", koaBody({ multipart: true }), async function(context) {
    try {
        context.body = await db.obtenerAsesores(context.params.scom, context.params.lider);
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.get("/personasfxcoins", koaBody({ multipart: true }), async function(context) {
    try {
       
        context.body = await db.ListarPersonasFxcoins();
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});


module.exports = router;