const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/emails" });
const { enviar, enviarj, enviarJM } = require("../../validar");
const { verifyToken } = require("../../helpers/middlewares");
const funs = require("../../helpers/methods");
const fs = require("fs");
const Request = require("superagent");
const { Router } = require("express");


router.post("/enviarKunal", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    let destinatario = 'contacto@fibraxinversiones.mx';
    //Enviar correo al solicitante
    await enviar(
      {
        path: "kunalmx",
        data: { Nombre: data.Nombre, Telefono: data.Telefono, Correo: data.Email },
      },
      "¡Nuevo contacto!",
      destinatario
    );
    context.body = { insert:true };
    
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/enviarVillamar", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    let destinatario = 'contacto@fibraxinversiones.mx';
    //Enviar correo al solicitante
    await enviar( 
      {
        path: "villamar",
        data: { Nombre: data.Nombre, Telefono: data.Telefono, Correo: data.Email, Mensaje: data.Mensaje },
      },
      "¡Nuevo contacto!",
      destinatario
    );
    context.body = { insert:true };
    
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});


router.post("/enviarViapalmar", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    let destinatario = 'contacto@fibraxinversiones.mx';
    //Enviar correo al solicitante
    await enviar( 
      {
        path: "viapalmar",
        data: { Nombre: data.Nombre, Telefono: data.Telefono, Correo: data.Email, Mensaje: data.Mensaje },
      },
      "¡Nuevo contacto!",
      destinatario
    );
    context.body = { insert:true };
    
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/enviarMantratulum", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    let destinatario = 'contacto@fibraxinversiones.mx';
    //Enviar correo al solicitante
    await enviar( 
      {
        path: "mantratulum",
        data: { Nombre: data.Nombre, Telefono: data.Telefono, Correo: data.Email, Mensaje: data.Mensaje },
      },
      "¡Nuevo contacto!",
      destinatario
    );
    context.body = { insert:true };
    
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/enviarKoomuna", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    let destinatario = 'contacto@fibraxinversiones.mx';
    //Enviar correo al solicitante
    await enviar( 
      {
        path: "koomuna",
        data: { Nombre: data.Nombre, Telefono: data.Telefono, WhatsApp: data.Whatsapp, Correo: data.Email, Mensaje: data.Mensaje },
      },
      "¡Nuevo contacto!",
      destinatario
    );
    context.body = { insert:true };
    
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});


  module.exports = router;
