const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        port: process.env.PORT
    }
});

module.exports = knex;