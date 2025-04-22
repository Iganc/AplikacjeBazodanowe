const knex = require('./conf.js');

async function insert(){
    try{
        await knex('person').insert({id: 97, address_id: 97, job_position_id: 8, first_name: "Ignacy", last_name: "Mroz", gender: "m", birth_date: "01-08-2005", pesel: "178678678"});
        await knex('address').insert({id: 97, locality: "Gdańsk", street: "ulica", house_number: 0, apartment_number: 0, postal_code: "80-000"})
        await knex('job_position').insert({id: 8, title: "Programista", salary: 0})
    }
    catch (error){
        console.log("error: ", error);
    }
    finally {
        knex.destroy();
    }
}

insert();