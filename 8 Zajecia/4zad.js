const knex = require('./conf.js');

async function pensja(){
    try{

        const salaryRes = await knex('job_position').select('salary').where({title: "Kierownik"})
        const salary = salaryRes[0].salary;
        const brutto = salary - (salary*0.23)
        console.log("Pensja brutto to: ", brutto);
    }
    catch (error){
        console.log("error: ", error);
    }
    finally {
        knex.destroy();
    }
}

pensja();