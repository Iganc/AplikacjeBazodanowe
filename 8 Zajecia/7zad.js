const knex = require('./conf.js');

async function increaseSalary(locality, amount) {
    try {
        const jobPositions = await knex('person')
            .join('address', 'person.address_id', 'address.id')
            .join('job_position', 'person.job_position_id', 'job_position.id')
            .where('address.locality', locality)
            .whereNotNull('job_position_id')
            .distinct('job_position.id');

        const jobPositionIds = jobPositions.map(jp => jp.id);

        if (jobPositionIds.length === 0) {
            console.log(`No job positions found with employees living in ${locality}`);
            return;
        }

        const updated = await knex('job_position')
            .whereIn('id', jobPositionIds)
            .increment('salary', amount);

        console.log(`Increased salary by ${amount} for ${updated} job positions where employees live in ${locality}`);

        const updatedPositions = await knex('job_position')
            .whereIn('id', jobPositionIds)
            .select('title', 'salary');

        console.log("Updated positions:", updatedPositions);
    }
    catch (error) {
        console.log("error: ", error);
    }
    finally {
        await knex.destroy();
    }
}

increaseSalary("Gdańsk", 500);