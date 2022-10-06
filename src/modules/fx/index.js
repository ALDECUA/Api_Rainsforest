const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/fx" });
const db = require("../../database/fx/");
const { enviar, enviarj, enviarJM, enviarxcaliburJM } = require("../../validar");
const fs = require("fs");
const Request = require("superagent");
const Dominio = 'https://greenpark.mx/'

router.post("/insertar", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    context.body = await db.InsertarInteresadoAviation(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/insertarCOP", koaBody(), async function (context) {
  try {
    let data = context.request.body;
    let destinatario = 'contacto@fibraxinversiones.mx';
    context.body = await db.InsertarInteresadoCOP(data);
    console.log(data.Origen);
    console.log(data);

    if (data.Origen === 'fxinversiones') {
      await enviar(
        {
          path: "fxinversiones",
          data: { Nombre: data.Nombre, Apellidos: data.Apellidos, Correo: data.Email, Telefono: data.Telefono, Mensaje: data.Mensaje },
        },
        "¡Gracias por comunicarte con nostros!",
        destinatario
      );


    }

  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/calculadoraInteres", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.calculadoraInteres(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get(
  "/FX_EjecutarVariosSP",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      context.body = await db.FX_EjecutarVariosSP();
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);
router.post("/calculadoraCOP", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.calculadoraCOP(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get(
  "/getTickets",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      context.body = await db.obtenerTickets();
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);
router.post("/insertarInvitado", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.CrearInvitado(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get(
  "/Invitados",
  koaBody({ multipart: true }),
  async function (context) {
    try {
      context.body = await db.obtenerInvitados();
    } catch (error) {
      context.body = { error: true, message: error.message };
    }
  }
);
router.post("/editarInvitado", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.EditarInvitado(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/insertarSurvey", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.insertarSurvey(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get("/survey/:IdPersona", koaBody(), async function (context) {
  try {
    let IdPersona = context.params.IdPersona;
    context.body = await db.getSurvey(IdPersona);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get("/calcularFraxiones/:Gastos", koaBody(), async function (context) {
  try {
    let Gastos = context.params.Gastos;
    context.body = await db.calcularFraxiones(Gastos);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.get("/invitado/:IdPersona", koaBody(), async function (context) {
  try {
    let IdPersona = context.params.IdPersona;
    context.body = await db.getInvitado(IdPersona);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/invitado_hr", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    context.body = await db.insertarHRInvitado(data);
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/invitadores", koaBody(), async function (context) {
  try {
    context.body = await db.obtenerInvitadores();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/locacion", koaBody(), async function (context) {
  try {
    context.body = await db.obtenerLocacion();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.get("/archivos", koaBody(), async function (context) {
  try {
    context.body = await db.obtenerDocumentos();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/comisiones", koaBody(), async function (context) {

  try {

    const data = context.request.body;

  
    if (data.tipo === 1) {
      
      let html = fs.readFileSync(__dirname + "/tablacomisiones.html", "utf-8");
      html = html.replace("{tablauno}", data.tablauno);
      html = html.replace("{tablados}", data.tablados);
      html = html.replace("{tablatres}", data.tablatres);
      await Request.post(Dominio+"api/storage/crearpdf_comisiones.php")
      .set("Content-type", "application/json")
      .set("Accept", "application/json")
      .send({ documento: html })
      .buffer(true)
      .then((res) => {
        context.body = res.body;
        context.type = res.type;
        data.pdf= res.text;
      })
      .catch((error) => {
        console.log(error);
      });

    }else{

      let html = fs.readFileSync(__dirname + "/tablacomisionedos.html", "utf-8");
      html = html.replace("{tablauno}", data.tablauno);
      html = html.replace("{tablatres}", data.tablatres);
      await Request.post(Dominio+"api/storage/crearpdf_comisiones.php")
      .set("Content-type", "application/json")
      .set("Accept", "application/json")
      .send({ documento: html })
      .buffer(true)
      .then((res) => {
        context.body = res.body;
        context.type = res.type;
        data.pdf= res.text;
      })
      .catch((error) => {
        console.log(error);
      });
    }
    
      context.body = [{result:true,documento: data.pdf}];

  } catch (error) {
    context.body = { error: true, message: error.message };
  }

});


router.post("/cotizador", koaBody(), async function (context) {
  try {
    const data = context.request.body;

    /*  context.body = await db.insertarHRInvitado(data); */
    let html = fs.readFileSync(__dirname + "/Cotizador.html", "utf-8");
    html = html.replace("{html}", data.html);
    html = html.replace("{fecha}", data.Fecha);
    html = html.replace("{telefono}", data.Telefono);
    html = html.replace("{email}", data.Email);
    html = html.replace("{interesado}", data.Interesado);

    html = html.replace("{asesor}", data.Asesor);
    await Request.post(Dominio+"api/storage/crearpdf.php")
      .set("Content-type", "application/json")
      .set("Accept", "application/json")
      .send({ documento: html })
      .buffer(true)
      .then((res) => {
        context.body = res.body;
        context.type = res.type;
        data.pdf = res.text;
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(data.EmailA, data.Email_IL, data.Email_SCom, data.Email_IS)
    await enviarJM(
      {
        path: "Cotizador",
        data: {
          html: data.html,
          fecha: data.Fecha,
          telefono: data.Telefono,
          email: data.Email,
          interesado: data.Interesado,
          asesor: data.Asesor,
          pdf: data.pdf,
          baner: data.primero
        },
      },
      "Cotización",
      data.Email,
      /* data.Email */

      [data.EmailA, data.Email_IL, data.Email_SCom, data.Email_IS]
    );
    let guardar = await db.infoCotizador(data);
    console.log(data.pdf)
    context.body = [{ documento: data.pdf }];
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/ficha", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    let guardar = await db.pagoslead(data);
    let html = fs.readFileSync(__dirname + "/ficha.html", "utf-8");
    html = html.replace("{concepto}", data.Concepto);
    html = html.replace("{monto}", data.Monto);
    html = html.replace("{nombre}", data.Nombre);
    html = html.replace("{telefono}", data.Telefono);
    html = html.replace("{email}", data.Email);
    await Request.post("https://villamaryucatan.mx/api/crearpdf.php")
      .set("Content-type", "application/json")
      .set("Accept", "application/json")
      .send({ documento: html })
      .buffer(true)
      .then((res) => {
        context.body = res.body;
        context.type = res.type;
        data.pdf = res.text;
      })
      .catch((error) => {
        console.log(error);
      });
    await enviarJM(
      {
        path: "FichaPago",
        data: {
          nombre: data.Nombre,
          telefono: data.Telefono,
          email: data.Email,
          concepto: data.Concepto,
          monto: data.Monto,
          pdf: data.pdf
        },
      },
      "Ficha de Pago Villamar",
      data.Email,
      []
    );


    context.body = [{ documento: data.pdf }]
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

router.post("/fichados", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    let img = '';
    let guardartitle = '';
    let codigo = '';
    let apiName = '';
    let dataInfo = {};



    switch (data.IdDesarrollo) {
      case '1'://Bonarea

        break;

      case '3'://Zazil-ha

        break;

      case '4'://Koomuna

        break;

      case '5'://Via palmar
        img = 'https://www.viapalmar.mx/cotizador-legacy/images/header.png';
        guardartitle = 'Via Palmar';
        apiName = "https://www.viapalmar.mx/api/crearpdf.php";

        dataInfo.nombrebanco = 'R&E DISTRIBUCIONES SA DE CV';
        dataInfo.banco = 'BANCA AFIRME S.A.';
        dataInfo.cuenta = '11581005972';
        dataInfo.clave = '062691115810059729';
        dataInfo.rfc = '-';
        dataInfo.swiftcode = 'AFIRMXMTXXX';
        dataInfo.referencia = 'GA-VP';
        dataInfo.nombre = data.Nombre;
        dataInfo.telefono = data.Telefono;
        dataInfo.email = data.Email;
        dataInfo.concepto = data.Concepto;
        dataInfo.monto = data.Monto;
        dataInfo.headerimg = img;
        dataInfo.web = 'https://www.viapalmar.mx';
        break;

      case '7'://Horizontes

        break;

      case '8'://Mantra
        img = 'https://mantratulum.mx/cotizador-legacy/images/header.png';
        guardartitle = 'Mantra';
        apiName = "https://mantratulum.mx/api/crearpdf.php";

        dataInfo.nombrebanco = 'SERVICIOS SHAMIL DE LA PENINSULA S.A DE C.V';
        dataInfo.banco = 'AFIRME';
        dataInfo.cuenta = '011581006820';
        dataInfo.clave = '062691115810068202';
        dataInfo.rfc = 'SSP1709112S6';
        dataInfo.swiftcode = 'AFIRMXMTXXX';
        dataInfo.referencia = 'GA-MT';
        dataInfo.nombre = data.Nombre;
        dataInfo.telefono = data.Telefono;
        dataInfo.email = data.Email;
        dataInfo.concepto = data.Concepto;
        dataInfo.monto = data.Monto;
        dataInfo.headerimg = img;
        dataInfo.web = 'https://mantratulum.mx';


        break;

      case '10'://Villamar
        img = 'https://villamaryucatan.mx/cotizador/images/header.png';
        guardartitle = 'Villamar';
        apiName = "https://villamaryucatan.mx/api/crearpdf.php";

        dataInfo.nombrebanco = 'DESARROLLADORES KHIDMA S.A DE C.V';
        dataInfo.banco = 'BANCO AZTECA S.A. INSTITUCIÓN DE BANCA MULTIPLE';
        dataInfo.cuenta = '01720130494440';
        dataInfo.clave = '127180001304944402';
        dataInfo.rfc = '-';
        dataInfo.swiftcode = '-';
        dataInfo.referencia = 'GA-VM';
        dataInfo.nombre = data.Nombre;
        dataInfo.telefono = data.Telefono;
        dataInfo.email = data.Email;
        dataInfo.concepto = data.Concepto;
        dataInfo.monto = data.Monto;
        dataInfo.headerimg = img;
        dataInfo.web = 'https://villamaryucatan.mx';

        break;

      case '11'://Kunal
        img = 'https://kunal.mx/cotizador-legacy/images/header.png';
        guardartitle = 'Kunal';
        apiName = "https://kunal.mx/api/crearpdf.php";

        dataInfo.nombrebanco = 'R&E DISTRIBUCIONES SA DE CV';
        dataInfo.banco = 'BANCA AFIRME S.A DE C.V';
        dataInfo.cuenta = '011581005972';
        dataInfo.clave = '062691115810059729';
        dataInfo.rfc = 'RDI180315AY8';
        dataInfo.swiftcode = 'AFIRMXMTXXX';
        dataInfo.referencia = 'GA-KN';
        dataInfo.nombre = data.Nombre;
        dataInfo.telefono = data.Telefono;
        dataInfo.email = data.Email;
        dataInfo.concepto = data.Concepto;
        dataInfo.monto = data.Monto;
        dataInfo.headerimg = img;
        dataInfo.web = 'https://kunal.mx';
        break;

      case '12'://Copropiedad

        break;

      case '13'://Gran MAntra
        img = 'https://mantratulum.mx/cotizador-legacy/images/header.png';
        guardartitle = 'Gran Mantra';
        apiName = "https://mantratulum.mx/api/crearpdf.php";

        dataInfo.nombrebanco = 'SERVICIOS SHAMIL DE LA PENINSULA S.A DE C.V';
        dataInfo.banco = 'AFIRME';
        dataInfo.cuenta = '011581006820';
        dataInfo.clave = '062691115810068202';
        dataInfo.rfc = 'SSP1709112S6';
        dataInfo.swiftcode = 'AFIRMXMTXXX';
        dataInfo.referencia = 'GA-MT';
        dataInfo.nombre = data.Nombre;
        dataInfo.telefono = data.Telefono;
        dataInfo.email = data.Email;
        dataInfo.concepto = data.Concepto;
        dataInfo.monto = data.Monto;
        dataInfo.headerimg = img;
        dataInfo.web = 'https://mantratulum.mx';

        break;

      default:

        /* img = 'https://villamaryucatan.mx/cotizador/images/header.png';
        guardartitle = 'Villamar';
        codigo = 'GA-VM' */

        break;


    }

    console.log(dataInfo);



    // await db.pagoslead(data);
    let html = fs.readFileSync(__dirname + "/fichados.html", "utf-8");
    html = html.replace("{concepto}", data.Concepto);
    html = html.replace("{monto}", data.Monto);
    html = html.replace("{nombre}", data.Nombre);
    html = html.replace("{telefono}", data.Telefono);
    html = html.replace("{email}", data.Email);

    html = html.replace("{nombrebanco}", dataInfo.nombrebanco);
    html = html.replace("{banco}", dataInfo.banco);
    html = html.replace("{cuenta}", dataInfo.cuenta);
    html = html.replace("{clabe}", dataInfo.clave);
    html = html.replace("{rfc}", dataInfo.rfc);
    html = html.replace("{swiftcode}", dataInfo.swiftcode);
    html = html.replace("{referencia}", dataInfo.referencia);
    html = html.replace("{headerimg}", img);



    await Request.post(apiName)
      .set("Content-type", "application/json")
      .set("Accept", "application/json")
      .send({ documento: html })
      .buffer(true)
      .then((res) => {
        context.body = res.body;
        context.type = res.type;
        dataInfo.pdf = res.text;
      })
      .catch((error) => {
        console.log(error);
      });

    await enviarJM(
      {
        path: "FichaPagoT",
        data: dataInfo,
      },
      "Ficha de Pago " + guardartitle,
      data.Email,
      []
    );

    console.log(data);


    context.body = [{ documento: data.pdf }]
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});


router.get("/numero", koaBody(), async function (context) {
  try {
    context.body = await db.obtenerNumero();
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/tupatrimonioenelcaribe", koaBody(), async function (context) {
  try {
    const data = context.request.body;
    let res = await db.tupatrimonioenelcaribe(data);
    if (!res.error) {
      console.log(res);
      await enviarJM(
        {
          path: "patrimoniodelcaribe",
          data: {
            Nombre: data.nombre,
            Telefono: data.telefono,
            Correo: data.email,
            IdInformes: res.mensaje[0].IdInformes
          },
        },
        "Recordatorio Registro",
        data.email,
        []
      );
      context.body = res;
    } else {
      context.body = { error: true, message: 'correo existente' }
    }
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});
router.post("/xcaliburJM", koaBody(), async function (context) {
  try {
    console.log('entro');
    const data = context.request.body;
    datados = JSON.parse(data);
    if (data) {
      await enviarxcaliburJM(
        {
          path: "xcaliburemail",
          data: {
            Nombre: datados.nombre,
            Puesto: datados.puesto,
            Correo: datados.email,
            Local: datados.localisacion,
            Mensaje: datados.mensaje,
            Cv: datados.cv
          },
        },
        "Recordatorio Registro",
        /* data.email, */'apply@xcairsolutions.com'
      );
      context.body = true;
    } else {
      context.body = false;
    }
  } catch (error) {
    context.body = { error: true, message: error.message };
  }
});

module.exports = router;
