/**
 *  server.js
 *  @version: 1.0.0
 *  @author: Dwit México -  
 *  @description: Punto de entrada de la aplicación
 * 	@process: 1
 */

 const webpush = require('web-push');
const express = require("express");
const http = require("http");
const koa = require("koa");
const app = new koa();
const cors = require("koa2-cors");
const bodyParser = require('body-parser');
require("./src/config/variables");
//require('dotenv').config();

// Cross - Origin Resource Sharing(CORS)


app.use(
    cors({
        origin: () => {
            if (process.env.NODE_ENV !== "production") {
                return "*";
            }
            return "*";
        }
    })
);

/**
 * 	Autentificación del peticiones al API
 */
// app.use(async(ctx, next) => {
//     await next();
//     const rt = ctx.response.get("X-Response-Time");
//     console.log(`${ctx.method} ${ctx.url} - ${rt}`);
//     console.log(`Status: ${ctx.status}`);
//     console.log(process.env.NODE_ENV ? process.env.NODE_ENV : "DEV");
// });

// app.use(async(context, next) => {

//     const { getDecode } = require('./src/auth/token');

//     function validateToken() {
//         try {
//             const path = context.path;
//             if (path.indexOf('auth') > 0) {
//                 return true;
//             }
//             const token = context.headers.beflippio_key;
//             let auth = getDecode(token);
//             if (auth) {
//                 if (auth === process.env.IDAPP) {
//                     return true;
//                 } else {
//                     return false;
//                 }
//             }
//             return false;
//         } catch (error) {
//             console.error(error.message);
//             return false;
//         }
//     }

//     if (validateToken()) {
//         await next();
//     } else {
//         context.status = 403;
//     }

//     const responseTime = context.response.get("X-Response-Time");
//     if (process.env.NODE_ENV !== 'production') {
//         console.log(`${context.method} ${context.url} - ${responseTime} - Response Status: ${context.status} 🔚`);
//     }
// });


/**
 * 	Calculo del Header "X-Response-Time"
 * 	Computar y asignar el Header "X-Response-Time" el calculo en 'ms' de peticiones
 */

app.use(async (context, next) => {
    const startTime = Date.now();
    await next();
    const ms = Date.now() - startTime;
    context.set("X-Response-Time", `${ms}ms`);
});


// Gestión de las rutas válidas de la aplicación

const { modules } = require("./src/modules");
modules.map(route => {
    app.use(route);
});

// 	Variables de entorno / 	HOST: String, PORT: Int

const HOST = process.env.HOST || "http://localhost";
const PORT = process.env.PORT || 8081;

const httpServer = http.createServer(app.callback());

//SOCKET
require('./src/socket').attach(httpServer);

/*const options = { cors: {origin: '*'}};
const io = require("socket.io")(httpServer, options);

io.on("connection", (socket) => {
    console.log(socket.id);

    socket.emit('hola', {});
});*/

/**
 * 	Ejecución del servidor.
 * 	Activa el evento "Listener" este método es llamado cuando un evento ocurre.
 */

httpServer.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log("Application in execution: 🔥", `${HOST}:${PORT}`);
    }
});

module.exports = {
    app
}