/**
 *  config.js
 *  @version: 1.0.0
 *  @author: FIBRAX
 *  @description: Configuración del MiddleWare para conexiones a Base de datos
 */

let config;

if (process.env.NODE_ENV === "production") {
    config = {
        server: "fibrax.database.windows.net",
        port: 1433,
        database: "Fibrax",
        user: "fibrax1",
        password: "_F1bR@x2021_#fx",
        connectionTimeout: 300000,
        requestTimeout: 300000,
        stream: true,
        encrypt: true,
        packetSize: 65536
    };
} else {
    config = {
        server: "fibrax.database.windows.net",
        port: 1433,
        database: "Fibrax_Test",
        user: "fibrax1",
        password: "_F1bR@x2021_#fx",
        connectionTimeout: 300000,
        requestTimeout: 300000,
        stream: true,
        encrypt: true,
        packetSize: 65536
    };
}

module.exports = config;