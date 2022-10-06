const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.mx', // hostname
    secure: false, // use SSL
    port: 587,
    auth: {
        user: 'notificaciones@greenpark.mx',
        pass: 'NotiGPI_2022'
    },
    encoding: 'UTF-8'
});

module.exports = transporter;