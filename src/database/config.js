/**
 *  config.js
 *  @version: 1.0.0
 *  @author: FIBRAX
 *  @description: Configuración del MiddleWare para conexiones a Base de datos
 */

let config;


    config = {
        server: "mysql-rainsforest.alwaysdata.net",
        port: 1433,
        database: "rainsforest_db",
        user: "282952_rainfores",
        password: "aldecua+-154",
        connectionTimeout: 300000,
        requestTimeout: 300000,
        stream: true,
        encrypt: true,
        packetSize: 65536
    };


module.exports = config;