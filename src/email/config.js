const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: '',
    host: 'pan.boxsecured.com', // hostname
    secure: true, // use SSL
    port: 465,
    auth: {
        user: 'noreply@beflippio.com',
        pass: 'Beflippio2020'
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter;