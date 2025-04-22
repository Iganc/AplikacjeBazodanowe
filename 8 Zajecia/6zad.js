const knex = require('./conf.js');

async function srednia(){
    try{
        const avgSalary = await knex('person')
            .join('job_position', 'person.job_position_id', 'job_position.id')
            .whereNotNull('job_position_id')
            .avg('job_position.salary as average')
            .first();


        const res = await knex('person')
            .join('job_position', 'person.job_position_id', 'job_position.id')
            .join('address', 'person.address_id', 'address.id')
            .where('job_position.salary', '>',  avgSalary.average)
            .whereNotNull('job_position_id')
            .where('address.locality', "Gdańsk")
            .select('person.first_name', 'person.last_name', 'birth_date');


        console.log("People in Gdańsk with above-average salary:", res);

    }
    catch (error){
        console.log("error: ", error);
    }
    finally {
        await knex.destroy();
    }
}

srednia();