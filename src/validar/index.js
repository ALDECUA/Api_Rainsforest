const email = require("./config");
const layout = require("./layout");

async function enviar(
  options,
  subject,
  customermail,
  copies = [],
  atachment = []
) {
  const layoutHtml = await layout.layoutHtml(
    options.path,
    options.data,
    options.subpath,
    options.subdata
  );
  /* Opciones de email  */
  const mailOptions = {
    from: "notificaciones@rainforest.com.mx", //Remitente
    to: customermail, //Destinatario
    cc: copies,
    // bcc: copiaoculta,						//Copia Oculta
    subject: subject, //Asunto
    html: layoutHtml,
    attachments: atachment,
    headers: {
      Organization: "rainforest",
      "MIME-Version": "1.0",
      "Content-type": "text/html",
      "X-Priority": "3",
      "Reply-To": customermail,
      "Return-Path": customermail,
      From: "notificaciones@rainforest.mx",
    },
  };

  /* Funcion que envia el email */
  const result = await email
    .sendMail(mailOptions)
    .then((info) => {
     
      return info.response;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });

  return 1;
}
async function enviarxcaliburJM(
  options,
  subject,
  customermail,
  copias = [],
  atachment = []
) {
  /*   let ncopias = [];
  for (let i = 0; i < copias.length; i++) {
    if (copias[i] != "null" && copias[i] != undefined && copias[i] != 0) {
      ncopias.push({ Email: copias[i] });
    }
  } */
  const mailjet = require("node-mailjet").connect(
    "5b4666372db929ce9b58c9abc5f62d72",
    "fab1920f0313b72652b758261f6a4e15"
  );
  const lay = await layout.layoutHtml(
    options.path,
    options.data,
    options.subpath,
    options.subdata
  );
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "notificaciones@xcaliburaircraftsolutions.com",
          Name: "Notificiaciones Xcalibur AirCraft Solution",
        },
        To: [
          {
            Email: customermail,
          },
        ],
        /*     cc: ncopias, */
        Subject: subject,
        HTMLPart: lay,
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
  return 1;
}

async function enviarJM(
  options,
  subject,
  customermail,
  copias = [],
  atachment = []
) {
  // if (process.env.NODE_ENV !== "production") {
  if (process.env.NODE_ENV === "production") {
    let ncopias = [];
    for (let i = 0; i < copias.length; i++) {
      if (copias[i] != "null" && copias[i] != undefined && copias[i] != 0) {
        ncopias.push({ Email: copias[i] });
      }
    }
    const mailjet = require("node-mailjet").connect(
      "5b4666372db929ce9b58c9abc5f62d72",
      "fab1920f0313b72652b758261f6a4e15"
    );
    const lay = await layout.layoutHtml(
      options.path,
      options.data,
      options.subpath,
      options.subdata
    );
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "notificaciones@rainforest.mx",
            Name: "Notificiaciones rainforest",
          },
          To: [
            {
              Email: customermail,
            },
          ],
          cc: ncopias,
          Subject: subject,
          HTMLPart: lay,
        },
      ],
    });
    return request
      .then((result) => {
        return result.body
      })
      .catch((err) => {
        return err;
      });
  } else {
    return 1;
  }
}

async function Notificaciones(keys, texto, titulo, url, imagenes) {
  const webpush = require("web-push");
  const express = require("express");
  const cors = require("cors");
  const bodyParser = require("body-parser");
  const app = express();
  const vapidKeys = {
    publicKey:
      "BBH4b0eYUzw_2QCJ1-1I_07bkn-RzdnZTxmbLvrgGeNLb0zdUdXkvdOv0P4zI6vSoZolcXUcteD23EqVyo0oSkE",
    privateKey: "7L0YtAi3I6BbtMpiBBcgpgXN8vds6vLXhbb_cWYQ_LE",
  };
  app.use(cors());
  app.use(bodyParser.json());
  webpush.setVapidDetails(
    "mailto:corportativo@rainforest.mx",
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
  const pushSubscription = {
    endpoint: keys.endpoint,
    keys: {
      auth: keys.keys.auth,
      p256dh: keys.keys.p256dh,
    },
  };
  const payload = {
    notification: {
      title: titulo,
      body: texto,
      badge: "💵",
      icon: "https://rainforest-dashboard.netlify.app/asesores/assets/icons/rainforest-app--logo1-modified.png",
      vibrate: [100, 50, 100],
      image: imagenes,
      actions: [
        {
          action: "bar",
          title: "Ir",
        },
      ],
      data: {
        onActionClick: {
          default: {
            operation: "openWindow",
            url: url,
          },
          bar: {
            operation: "navigateLastFocusedOrOpen",
            url: url,
          },
        },
      },
    },
  };
  webpush
    .sendNotification(pushSubscription, JSON.stringify(payload))
    .then((respuesta) => {
      console.log("Enviado !!");
    })
    .catch((err) => {
      console.log("Error", err);
    });
}

module.exports = { enviar, enviarJM, Notificaciones, enviarxcaliburJM };
