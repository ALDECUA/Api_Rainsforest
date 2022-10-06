const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: '',
    host: 'pan.boxsecured.com', // hostname
    secure: true, // use SSL
    port: 465,
    auth: {
        user: 'notificaciones@greenpark.mx',
        pass: 'NotiGPI_2022'
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter;