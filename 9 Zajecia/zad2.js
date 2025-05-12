const express = require('express');
const knex = require('knex');
const path = require('path');
const axios = require('axios');
const ejs = require('ejs');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname);

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: path.join(__dirname, 'lab9')
    },
    useNullAsDefault: true
});

app.get('/CREATE', (req, res) => {
    res.render('CREATE');
});

app.get('/READ', (req, res) => {
    res.render('READ');
});

app.get('/UPDATE', (req, res) => {
    res.render('UPDATE');
});

app.get('/DELETE', (req, res) => {
    res.render('DELETE');
});

app.get('/SEARCH', async (req, res) => {
    if (Object.keys(req.query).length === 0) {
        return res.render('SEARCH');
    }

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

app.get('/', (req, res) => {
    res.send(`
        <h1>Person Management</h1>
        <ul>
            <li><a href="/CREATE">Create Person</a></li>
            <li><a href="/READ">Read Person</a></li>
            <li><a href="/UPDATE">Update Person</a></li>
            <li><a href="/DELETE">Delete Person</a></li>
            <li><a href="/SEARCH">Search People</a></li>
        </ul>
    `);
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

app.delete('/DELETE/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deleted = await db('person').where({ id: id }).del();

        if (deleted) {
            res.json({ success: true, message: 'Person deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Person not found' });
        }
    } catch (error) {
        res.status(504).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
});