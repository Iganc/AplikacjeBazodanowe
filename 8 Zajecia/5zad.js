const knex = require('./conf.js');

async function srednia(){
    try{
        const maleCountWJob = await knex('person')
            .where({gender: "m"})
            .whereNotNull('job_position_id')
            .count('* as count');

        const maleCountWoJob = await knex('person')
            .where({gender: "m"})
            .whereNull('job_position_id')
            .count('* as count');

        const femaleCountWJob = await knex('person')
            .where({gender: "k"})
            .whereNotNull('job_position_id')
            .count('* as count');

        const femaleCountWoJob = await knex('person')
            .where({gender: "k"})
            .whereNull('job_position_id')
            .count('* as count');

        console.log("Kobiety z pracą: ", femaleCountWJob[0].count, "Bez pracy: ", femaleCountWoJob[0].count);
        console.log("Mezczyzni z praca: ", maleCountWJob[0].count, "Bez pracy: ", maleCountWoJob[0].count);

        const najwiekszeZarobkiM = await knex('person')
            .join('job_position', 'person.job_position_id', 'job_position.id')
            .where({gender: "m"})
            .orderBy('job_position.salary', 'desc')
            .select('person.first_name', 'person.last_name', 'job_position.salary')
            .first();

        const najwiekszeZarobkiK = await knex('person')
            .join('job_position', 'person.job_position_id', 'job_position.id')
            .where({gender: "k"})
            .orderBy('job_position.salary', 'desc')
            .select('person.first_name', 'person.last_name', 'job_position.salary')
            .first();

        const najmniejszeZarobkiM = await knex('person')
            .join('job_position', 'person.job_position_id', 'job_position.id')
            .where({gender: "m"})
            .orderBy('job_position.salary', 'asc')
            .select('person.first_name', 'person.last_name', 'job_position.salary')
            .first();

        const najmniejszeZarobkiK = await knex('person')
            .join('job_position', 'person.job_position_id', 'job_position.id')
            .where({gender: "k"})
            .orderBy('job_position.salary', 'asc')
            .select('person.first_name', 'person.last_name', 'job_position.salary')
            .first();

        console.log("Najwieksze u mezczyzn: ", najwiekszeZarobkiM?.salary, "Najmniejsze: ", najmniejszeZarobkiM?.salary);
        console.log("Najwieksze u kobiet: ", najwiekszeZarobkiK?.salary, "Najmniejsze: ", najmniejszeZarobkiK?.salary);

        const avgSalaryMen = await knex('person')
            .join('job_position', 'person.job_position_id', 'job_position.id')
            .where({gender: "m"})
            .whereNotNull('job_position_id')
            .avg('job_position.salary as average')
            .first();

        const avgSalaryWomen = await knex('person')
            .join('job_position', 'person.job_position_id', 'job_position.id')
            .where({gender: "k"})
            .whereNotNull('job_position_id')
            .avg('job_position.salary as average')
            .first();

        console.log("Średnie zarobki mężczyzn:", avgSalaryMen ? avgSalaryMen.average : 'Brak danych');
        console.log("Średnie zarobki kobiet:", avgSalaryWomen ? avgSalaryWomen.average : 'Brak danych');
    }
    catch (error){
        console.log("error: ", error);
    }
    finally {
        await knex.destroy();
    }
}

srednia();