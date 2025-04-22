const knex = require('./conf.js');
const tableName = "person";

async function print() {
    try {
        const rows = await knex.select('*').from(tableName);

        console.table(rows);
    } catch (err) {
        console.error("Error:", err);
    }
    finally {
        knex.destroy();
    }
}

print();
