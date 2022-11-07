

const { createPool } = require("mysql2/promise");

let config;

if (process.env.NODE_ENV === "production") {
    config = createPool({
        host: 'mysql-rainsforest.alwaysdata.net',
        user: '282952_rainfores',
        password: 'aldecua+-154',
        port: 3306,
        database: 'rainsforest_db'
    });
} else {
    config = createPool({
        host: 'mysql-rainsforest.alwaysdata.net',
        user: '282952_rainfores',
        password: 'aldecua+-154',
        port: 3306,
        database: 'rainsforest_db'
    });
}

module.exports = config;