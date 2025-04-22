const knex = require('./conf.js');

async function del() {
    try{
        await knex('address').delete({locality: "Gdańsk"})
        await knex('job_position').delete({title: "Kierownik"})
    }
    catch (error){
        console.log("error: ", error);
    }
    finally {
        knex.destroy();
    }
}

del();