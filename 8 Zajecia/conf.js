
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./mydb.db"
    },
    useNullAsDefault: true
});

module.exports = knex;
