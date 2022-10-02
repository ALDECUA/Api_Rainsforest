const email = require('./config');
const layout = require('./layout');

async function enviar(options, subject, customermail) {
    const layoutHtml = await layout.layoutHtml(options.path, options.data, options.subpath, options.subdata);
    /* Opciones de email */
    const mailOptions = {
        from: 'Beflippio<noreply@beflippio.com>', //Remitente
        to: customermail, //Destinatario
        // bcc: copiaoculta,						//Copia Oculta 
        subject: subject, //Asunto
        html: layoutHtml, //Html
        attachments: options.attachments
    };

    /* Funcion que envia el email */
    const result = await email.sendMail(mailOptions)
        .then(info => {
            console.log(info.response);
            return info.response;
        })
        .catch(error => {
            console.log(error);
            return error;
        })

    return result;
}

module.exports = { enviar };