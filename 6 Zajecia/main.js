const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const axios = require('axios').default;
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const colors = ['red', 'green', 'blue', 'yellow'];
const activeGames = new Map();
const archivedGames = new Map();

function calculateHints(guess, secretCode) {
    const secret = [...secretCode];
    const attempt = [...guess];
    let black = 0, white = 0;

    for (let i = 0; i < 4; i++) {
        if (attempt[i] === secret[i]) {
            black++;
            secret[i] = null;
            attempt[i] = null;
        }
    }

    for (let i = 0; i < 4; i++) {
        if (attempt[i] === null) continue;

        const foundIndex = secret.findIndex(color => color === attempt[i]);
        if (foundIndex > -1) {
            white++;
            secret[foundIndex] = null;
        }
    }

    return { black, white };
}

function generateSecretCode() {
    return [...colors].sort(() => Math.random() - 0.5).slice(0, 4);
}
function generateUUID() {
    return 'game' + Math.floor(Math.random() * 10000);
}



app.get('/', (req, res) => {
    res.redirect('/home.html');
});

app.post('/new-game', (req, res) => {
    const gameUUID = req.body?.uuid || generateUUID();
    const secretCode = generateSecretCode();

    activeGames.set(gameUUID, {
        secretCode,
        attempts: 0,
        maxAttempts: 10,
        moveHistory: [],
        hintHistory: []
    });
    
    if (!archivedGames.has(gameUUID)) {
        archivedGames.set(gameUUID, {
            uuid: gameUUID,
            secretCode: secretCode
        });
    }
    
    const isAjax = req.xhr || req.headers.accept.indexOf('json') > -1;
    
    if (isAjax) {
        res.json({
            uuid: gameUUID,
            secretCode: secretCode
        });
    } else {
        res.redirect(`/game.html?uuid=${gameUUID}&secretCode=${secretCode.join(',')}`);
    }
});
app.post('/submit-guess', (req, res) => {
    const { uuid, guess } = req.body;
    const game = activeGames.get(uuid);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    const hints = calculateHints(guess, game.secretCode);

    game.attempts++;
    const gameOver = game.attempts >= game.maxAttempts || hints.black === 4;

    game.moveHistory.push(guess);
    game.hintHistory.push(hints);

    game.lastMoveResults = {
        black: hints.black,
        white: hints.white,
        attempts: game.attempts,
        gameOver: gameOver,
        won: hints.black === 4
    };

    if (hints.black === 4) {
        game.won = true;
    }

    res.json(game.lastMoveResults);
});

app.get('/archived-games', (req, res)=>{
    const uuid = req.query.uuid;
    const game = archivedGames.get(uuid);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    res.json(game);
})

app.get('/liczba-odgadniec', (req, res) => {
    const { uuid } = req.query;

    if (!uuid) {
        return res.status(400).json({ error: 'Missing game UUID' });
    }

    const game = activeGames.get(uuid);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    const remainingMoves = game.maxAttempts - game.attempts;

    res.json({
        remainingMoves,
        totalAttempts: game.maxAttempts,
        currentAttempts: game.attempts
    });
});

app.get('/secret-code', (req, res) => {
    const { uuid } = req.query;

    if (!uuid) {
        return res.status(400).json({ error: 'Missing game UUID' });
    }

    const game = activeGames.get(uuid);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    return res.json({ secretCode: game.secretCode });

});

app.get('/last-move-results', (req, res) => {
    const { uuid } = req.query;

    if (!uuid) {
        return res.status(400).json({ error: 'Missing game UUID' });
    }

    const game = activeGames.get(uuid);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    if (!game.lastMoveResults) {
        return res.status(404).json({ error: 'No moves made yet' });
    }

    return res.json(game.lastMoveResults);
});
app.get('/move-history', (req, res) => {
    const { uuid } = req.query;

    if (!uuid) {
        return res.status(400).json({ error: 'Missing game UUID' });
    }

    const game = activeGames.get(uuid);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    return res.json({ moves: game.moveHistory || [] });
});

app.get('/hint-history', (req, res) => {
    const { uuid } = req.query;

    if (!uuid) {
        return res.status(400).json({ error: 'Missing game UUID' });
    }

    const game = activeGames.get(uuid);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    return res.json({ hints: game.hintHistory || [] });
});

app.get('/make-guess/:uuid', (req, res) => {
    const { uuid } = req.params;
    const { color1, color2, color3, color4 } = req.query;

    if (!uuid) {
        return res.status(400).json({ error: 'Missing game UUID' });
    }

    if (!color1 || !color2 || !color3 || !color4) {
        return res.status(400).json({ error: 'All four colors must be provided' });
    }

    const game = activeGames.get(uuid);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    const guess = [color1, color2, color3, color4];

    const hints = calculateHints(guess, game.secretCode);

    game.attempts++;
    const gameOver = game.attempts >= game.maxAttempts || hints.black === 4;

    game.moveHistory.push(guess);
    game.hintHistory.push(hints);

    game.lastMoveResults = {
        black: hints.black,
        white: hints.white,
        attempts: game.attempts,
        gameOver: gameOver,
        won: hints.black === 4
    };

    if (hints.black === 4) {
        game.won = true;
    }

    res.json(game.lastMoveResults);
});

app.put('/change-move/:uuid', (req, res) => {
    const { uuid } = req.params;
    const { color1, color2, color3, color4 } = req.query;

    if (!uuid) {
        return res.status(400).json({ error: 'Missing game UUID' });
    }

    if (!color1 || !color2 || !color3 || !color4) {
        return res.status(400).json({ error: 'Missing required color parameters' });
    }

    const game = activeGames.get(uuid);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    if (!game.moveHistory || game.moveHistory.length === 0) {
        return res.status(400).json({ error: 'No moves to change' });
    }

    const moveIndex = game.moveHistory.length - 1;

    const newGuess = [color1, color2, color3, color4];
    game.moveHistory[moveIndex] = newGuess;

    const hints = calculateHints(newGuess, game.secretCode);
    game.hintHistory[moveIndex] = hints;

    game.lastMoveResults = {
        black: hints.black,
        white: hints.white,
        attempts: game.attempts,
        gameOver: game.attempts >= game.maxAttempts || hints.black === 4,
        won: hints.black === 4
    };

    if (hints.black === 4) {
        game.won = true;
    }

    return res.json({
        message: 'Last move updated successfully',
        newGuess,
        hints
    });
});

app.delete('/delete-game/:uuid', (req, res) => {
    const { uuid } = req.params;

    if (!uuid) {
        return res.status(400).json({ error: 'Missing game UUID' });
    }

    const gameExists = activeGames.has(uuid);

    if (!gameExists) {
        return res.status(404).json({ error: 'Game not found' });
    }

    activeGames.delete(uuid);

    return res.json({
        message: 'Game deleted successfully',
        uuid
    });
});

app.listen(port, () => console.log(`server running on: http://localhost:${port}`));
