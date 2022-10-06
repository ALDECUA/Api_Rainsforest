const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/hr" });
const db = require("../../database/hr/");
const { enviar, enviarj, enviarJM } = require("../../validar");
const { verifyToken } = require("../../helpers/middlewares");
const funs = require("../../helpers/methods");
const fs = require("fs");
const Request = require("superagent");
const { Router } = require("express");

router.get("/personas", koaBody(), async function (context) {
  try {
    context.body = await db.getPersonas();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get("/getcampana", koaBody(), async function (context) {
  try {
    context.body = await db.getCampana();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get("/personasInv", koaBody(), async function (context) {
  try {
    context.body = await db.getPersonasInv();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/personas_registradasPAGOS", koaBody(), async function (context) {
  try {
    context.body = await db.getInversionistasRegistradosPAGOS();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/personas_registradas", koaBody(), async function (context) {
  try {
    context.body = await db.getInversionistasRegistrados();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});


router.post("/insertar_persona", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.insertarPersona(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/insertar_hr", koaBody(), async function (context) {
  try {
    const data = context.request.body;

    const res = await db.insertarHr(data);

    if (res.error !== true) {
      //Enviar notificacion al asesor
      await enviar(
        {
          path: "ProgresoHRNotificacion",
          data: { idhr: res.record.IdHR },
        },
        "Progreso del HR Prueba",
        res.record.EmailAsesor,
      );

      //Enviar notificacion al equipo de control de calidad
      await enviar(
        {
          path: "NotificarInicioHr",
          data: {
            url:
              process.env.CRM +
              "controlcalidad/editarhr/" +
              res.record.IdPersona +
              "/" +
              res.record.IdLote +
              "/" +
              res.record.IdHR,
          },
        },
        "Nueva hoja de registro en proceso",
       "agarcia@fibrax.mx" 
     
      );
            console.log(res.record.EmailSC);
      await enviarJM(
        {
          path: "NotificarInicioHrSC",
          data: {
            socio:res.record.Socio,
            asesor:res.record.NombreAsesor,
            inversionistaNombre:res.record.NombreInv,
            inversionistaEmail:res.record.Email,
            inversionistaTelefono: res.record.Num_Cel,
            inversionistaWhats:res.record.WhatssApp,
            lote:   res.record.lote,
            financiamiento:   res.record.Financiamiento,
            precio: res.record.Precio_Final   
          },
        },
        "Nueva hoja de registro",
          res.record.EmailSC,
          ['uointiveros@fibrax.mx']
      );

      //Generar codigo y enviar al inversionista en case de tener referido
      if (data.IdReferido) {
        const folio = funs.genOfferCode();
        console.log(folio, data.IdReferido);
        await funs.putCode(folio, data.IdReferido);
        await enviarJM(
          {
            path: "CodigoGenerado",
            data: { nombre: res.record.NombreReferidor, codigo: folio },
          },
          "Se genero un nuevo código por tu referido",
          res.record.EmailReferidor,
          ["uontiveros@fibrax.mx"]
        );
      }
    }

    context.body = res;
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/insertar_documentos", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.insertarDocumentos(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/insertar_bonored", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.insertarBonoRed(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/obtener_datos_hr", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.getHrDatos(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/actualizar_status_hr", koaBody(), async function (context) {
  try {
    funs.genOfferCode();

    const data = context.request.body;
    context.body = await db.cambiarStatusHr(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post(
  "/actualizar_status_documentos",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      let datos = context.request.body.files;
      let user = context.request.body.user;
      const sendEmail = context.request.body.notify;
      let array = Object.keys(datos);
      let errorExists = false;

      //Actualizar status documentos
      array.forEach(async (element) => {
        if (datos[element]) {
          if (datos[element].EstatusGeneral === 2) {
            errorExists = true;
          }

          await db.updateArchivoSP(datos[element]);
        }
      });
      console.log("enviar correo");

      // Enviar correo
      if (sendEmail) {
        if (errorExists) {
          await enviar(
            {
              path: "ReportarDocumentosHR",
              data: { nombre: user.Nombre + " " + user.Apellido_P },
            },
            "Algunos documentos no son correctos",
            user.Email
          );
        } else {
          await enviar(
            {
              path: "SuccessDocumentosHR",
              data: { nombre: user.Nombre + " " + user.Apellido_P },
            },
            "Tus datos han sido verificados",
            user.Email
          );
        }
      }

      context.body = { updated: true };
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);
router.post(
  "/actualizar_datos_generales_hr",
  koaBody(),
  async function (context) {
    try {
      const data = context.request.body;
      context.body = await db.actualizarDatosGeneralesHR(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);

router.post("/actualizar_lotes_del_hr", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.actualizarLoteHr(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/actualizar_bono_red", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.actualizarBonoRed(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/crear_inversionista", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    data.password =  Math.random().toString(36).slice(5);
    const res = await db.crearInversionista(data);

    //Enviar correo al nuevo inversionista
    await enviar(
      {
        path: "GenerarClave",
        data: { password: res.Password, user: res.Email, name: res.Nombre },
      },
      "Bienvenido al portal de inversionistas",
      res.Email
    );
    context.body = { updated: true };
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/crear_inversionistaHR", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    data.password =  Math.random().toString(36).slice(5);
    const res = await db.crearInversionistaHR(data);

    //Enviar correo al nuevo inversionista
    await enviarJM(
      {
        path: "GenerarClave",
        data: { password: res.Password, user: res.Email, name: res.Nombre },
      },
      "Bienvenido al portal de inversionistas",
      res.Email
    );
    context.body = { updated: true };
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/obtener_solo_documentos/:id", koaBody(), async function (context) {
  try {
    const data = context.params.id;
    context.body = await db.getSoloDocumentos(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/agendar", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.agendarLLamada(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/agendas/:id", koaBody(), async function (context) {
  try {
    const data = context.params.id;
    context.body = await db.obtenerCitas(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/lotes/:id", koaBody(), async function (context) {
  try {
    const data = context.params.id;
    context.body = await db.obtenerLotesCliente(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/slotes/:id", koaBody(), async function (context) {
  try {
    const data = context.params.id;
    context.body = await db.obtenerLotesClienteSurvey(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/obtenerOrganigrama/:IdSCom", koaBody(), async function (context) {
  try {
    const data = context.params.IdSCom;
    context.body = await db.obtenerOrganigrama(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/cobranza", koaBody(), async function (context) {
  try {
    context.body = await db.registroCobranza();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/recordar_pago", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    await enviar(
      { path: "RecordarPago", data: { name: data.Nombre } },
      "Recordatorio de contrato",
      data.Email
    );
    context.body = { sended: true };
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get("/tipo_pago", koaBody(), async function (context) {
  try {
    context.body = await db.getTipoPagos();
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

router.post("/eliminarhr", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.eliminarHR(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/finalizar_registro", koaBody(), async function (context) {
  try {
    const data = context.request.body;

    const res = await db.finalizarRegistroInversionista(data);

    let hrdatos = await db.reporteHRCompletado(data);


    if (hrdatos.error !== true) {
      hrdatos[0].forEach(async (elem) => {
        let merged = { ...elem, ...hrdatos[1][0], ...hrdatos[2][0] };
        let transformstr = JSON.stringify(merged);
        let replacing = transformstr.replace(/null/g, '""');
        let objectclared = JSON.parse(replacing);
        //Enviar Correo
        await enviar(
          {
            path: "ReporteHR",
            data: objectclared,
          },
          "Hoja de registro completada",
          "agarcia@fibrax.mx",
          ["vmartin@fibrax.mx", merged.EmailSC]
        );
      });
    }

    context.body = res;
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/verificar_pago", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.VerificarDatos(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/inversionistas_de/:id", koaBody(), async function (context) {
  try {
    const data = context.params.id;
    context.body = await db.InversionistasDeAsesor(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/carteraclientes/:id", koaBody(), async function (context) {
  try {
    const data = context.params.id;
    context.body = await db.obtenerCarteraDeClientes(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/imprimir_mensualidades", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.NumeroMensualidades(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/insertar_referido", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    const res = await db.InsertarReferidos(data);

  if(data.Origenes == 2){

    await enviarJM(
      {
        path: "NuevoReferido",
        data: {
          nameref: data.Nombre_Completo,
          emailref: data.Email,
          contactref: data.Contacto,
          whatsref: data.WhatssApp,
          comentarioref: data.Comentario,
          clientref: res.Inversionista,
          asesorref: res.asesor_n,
          ocupacion: data.ocupacion,
          relacion: data.Relacioninversionista,
          informacion: data.datosmontoshtml,
        },
      },
      "Nuevo Referido HR",
      res.Asesor, [res.scom]
    );
    await enviarJM(
      {
        path: "NuevoReferidoC",
        data: {
          nameref: data.Nombre_Completo,
          clientref: res.Inversionista,
          idref: res.IdReferido
        },
      },
      "Bienvenido a Fibrax",
      data.Email 
    );
     context.body = res;
  }else if(data.Origenes == 1){
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
  } 



  
   

  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get("/DesarrolloPreciototal", koaBody(), async function (context) {
  try {
    context.body = await db.DesarrolloPreciototal();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get(
  "/obtener_referidos_inversionista/:id",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      const data = context.params.id;
      context.body = await db.ObtenerReferidosDelInversionista(data);
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);

router.get(
  "/obtener_llamadas",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      context.body = await db.ObtenerLlamadas();
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);

router.post("/cambiar_status_cita", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.CambiarStatusCita(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});


router.get("/desbloquear_HR/:id", koaBody(), async function (context) {
  try {
    const data = context.params.id;
    context.body = await db.DesbloquearTerreno(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/getFasesHR", koaBody(), async function (context) {
  try {
    context.body = await db.getPasosHR();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/HR_PreSistema/:id", koaBody(), async function (context) {
  try {
    const data = context.params.id;
    context.body = await db.HR_presistema(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/enviar_datos_sms", koaBody(), async function (context) {
  try {
    const datos = context.request.body;

    const response = await db.getAccesos(datos);

    //console.log(response);
    if (response.error !== true) {
      await Request.post("https://api.mailjet.com/v4/sms-send")
        .set("Content-type", "application/json")
        .set("Authorization", "Bearer 3a8e608485bd4ca9a20d2c564c5a6412")
        .send({
          //Dejar esto desbordado para que salgan bien los mensajes
          Text: `Tus datos de acceso son: 
                  Usuario: ${response.Email} 
                  Contraseña: ${response.Password}
                  Enlace: https://greenpark.mx/inversionistas`,
          To: datos.Numero,
          From: "Fibrax Inversiones",
        })
        .then((res) => {
          context.body = res.body;
        })
        .catch((error) => {
          //console.log(error);
          // return { error: true, message: "Error en la API de Mailjet" };
          context.body = { error: true, message: "Error en la API de Mailjet - " + error.response.body.ErrorMessage };
        });
    }
    //context.body = { error: true };
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/getInversionistas", koaBody(), async function (context) {
  try {
    context.body = await db.getInversionostas();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/crear_inversionista_simple", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    const res = await db.crearInversionistaSimple(data);

    //Enviar correo al nuevo inversionista
    await enviarJM(
      {
        path: "GenerarClave",
        data: { password: res.Password, user: res.Email, name: res.Nombre },
      },
      "Bienvenido al portal de inversionistas",
      res.Email
    );
    context.body = { res };
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/mis_pagos/:id", koaBody(), async function (context) {
  try {
    const id = context.params.id;
    context.body = await db.getPagosPersona(id);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/getmiscotizaciones", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.getmiscotizaciones(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/nointeresado", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.nointeresado(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/concluirHR", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.finalizarProcesoHR(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/enviarContrato", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.enviarContrato(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get("/desreferido/:id", koaBody(), async function (context) {
  try {
    const data = context.params.id;
    context.body = await db.EliminarReferido(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/recuperar_clave_inversionista", koaBody({ multipart: true }), async function (context) {
  try {
    const data = context.request.body;
    const response = await db.getAccesos(data);

    if (response.error !== true) {
      await enviar(
        {
          path: "RecuperarContrasena",
          data: { clave: response.Password },
        },
        "Recuperar mi contraseña - Fibrax inversionistas",
        response.Email
      );

      context.body = { message: 'Correo enviado', success: true }
    } else {
      context.body = { message: 'Error al recuperar la contraseña', error: true }
    }

  } catch (error) {
    context.body = { error: true, message: error.message };
  }

})

router.post("/insertar_hr_inv_existente", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    const res = await db.agregarHrInversionista(data);

    if (res.record.error === 1) {
      context.body = { error: true, message: 'El lote ya se ha registrado con este usuario' };
    }

    context.body = res;
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/verificacion", koaBody(), async function (context) {

  try {
    context.body = await db.ObtenerVerificacion();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/organigrama_id/:id", koaBody(), async function (context) {
  try {
    const data = context.params.id;
    context.body = await db.organigramaID(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/VerificarEmail", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.VerificarEmail(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/limbo/:id", koaBody(), async function (context) {
  try {
    const data = context.params.id;
    context.body = await db.getLimbo(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/BuscarEmail", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.EmailSearch(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get("/encuestas", koaBody(), async function (context) {
  try {
    context.body = await db.getEncuestas();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/reagendar", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.Reagendar(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/encuesta", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.EditarEncuesta(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get("/hrsde/:id", koaBody(), async function (context) {
  try {
    const data = context.params.id;
    context.body = await db.HrsEquipo(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get("/getEncuestas", koaBody(), async function (context) {
  try {
    context.body = await db.obtenerEncuestas();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/guardarEncuesta", koaBody(), async function (context){
  try {
    const data = context.request.body;
    context.body = await db.GuardarRespuestas(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
})
router.post("/busquedaInv", koaBody(), async function (context){
  try {
    const data = context.request.body;
    context.body = await db.busquedaInv(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
})


module.exports = router;
