const express = require('express');
const knex = require('knex');
const path = require('path');
const axios = require('axios');
const ejs = require('ejs');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: path.join(__dirname, 'lab9')
    },
    useNullAsDefault: true
});

app.post('/CREATE', async (req, res) => {
    const { name, lastName, gen, brth, pesel, id } = req.body;

    try {
        const ids = await db('person')
            .insert({
                id: id,
                first_name: name,
                last_name: lastName,
                gender: gen,
                birth_date: brth,
                pesel: pesel,
            });
        res.json({ success: true, id: ids[0], message: 'Person created successfully' });
    } catch (error) {
        res.status(501).json({ success: false, error: error.message });
    }
});

app.get('/READ/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const person = await db('person').where({ id }).first();
        if (person) {
            res.json({ success: true, data: person, message: 'Data fetched successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Person not found' });
        }
    } catch (error) {
        res.status(502).json({ success: false, error: error.message });
    }
});

app.put('/UPDATE/:id', async (req, res) => {
    const id = req.params.id;
    const { firstName } = req.body;

    try {
        const updatedCount = await db('person').where({ id }).update({
            first_name: firstName
        });

        if (updatedCount > 0) {
            res.json({
                success: true,
                updated: updatedCount,
                message: 'Name updated successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Person not found'
            });
        }
    } catch (error) {
        res.status(503).json({
            success: false,
            error: error.message
        });
    }
});

app.delete('/DELETE/:id', async (req, res)=>{
    const id = req.params.id;

    try{
        db('person').where({ id:id }).del();
    } catch (error) {
        res.status(504).json({
            success: false,
            error: error.message
        });
    }
})

app.get('/SEARCH', async (req, res) => {
    const { firstName, lastName } = req.query;

    try {
        const query = db('person');

        if (firstName) {
            query.where('first_name', 'like', `%${firstName}%`);
        }

        if (lastName) {
            query.where('last_name', 'like', `%${lastName}%`);
        }

        const results = await query;

        res.json({
            success: true,
            count: results.length,
            data: results,
            message: 'Search completed successfully'
        });
    } catch (error) {
        res.status(505).json({
            success: false,
            error: error.message
        });
    }
});


app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);

    try {
        const createResponse = await axios.post('http://localhost:3000/CREATE', {
            firstName: 'Test',
            lastName: 'User',
            gender: 'm',
            birthDate: '1990-01-01',
            pesel: '90010112345',
            addressId: null,
            jobPositionId: null
        });

        console.log('Create success:', createResponse.data);

        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const readResponse = await axios.get(`http://localhost:3000/READ/96`);
            console.log('Read success:', readResponse.data);

            const updateResponse = await axios.put(`http://localhost:3000/UPDATE/96`, {
                firstName: 'ZAKODOWANE'
            });
            console.log('Update success:', updateResponse.data);

            const verifyResponse = await axios.get(`http://localhost:3000/READ/96`);
            console.log('Verify update:', verifyResponse.data);

        } catch (readError) {
            console.error('Read error:', readError.response?.data || readError.message);
            console.error('Attempted to read ID:', 96);
        }

        try {
            const deletePerson = await axios.delete(`http://localhost:3000/DELETE/1`);
            console.log('delete success:', deletePerson.data);
        } catch (deletePerson) {
            console.error('Delete error:', deletePerson.response?.data || deletePerson.message);
            console.error('Attempted to delete person by ID:', 1);
        }

        try {
            const searchResponse = await axios.get('http://localhost:3000/SEARCH', {
                params: { firstName: 'Ignacy', lastName: 'Mroz' }
            });
            console.log('Search results:', searchResponse.data);
        } catch (searchError) {
            console.error('Search error:', searchError.response?.data || searchError.message);
        }

    } catch (createError) {
        console.error('Create error:', createError.response?.data || createError.message);
    }
});