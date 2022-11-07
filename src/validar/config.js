const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.mx', // hostname
    secure: false, // use SSL
    port: 587,
    auth: {
        user: 'notificaciones@gmail.com',
        pass: 'r2y=O{FvXMA={g'
    },
    encoding: 'UTF-8'
});

module.exports = transporter;