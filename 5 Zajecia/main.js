const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const colors = ['red', 'green', 'blue', 'yellow'];
const activeGames = new Map();
const archivedGames = new Map();

function calculateHints(guess, secretCode) {
    // Create copies to avoid mutating original arrays
    const secret = [...secretCode];
    const attempt = [...guess];
    let black = 0, white = 0;

    // First pass - count blacks
    for (let i = 0; i < 4; i++) {
        if (attempt[i] === secret[i]) {
            black++;
            secret[i] = null;
            attempt[i] = null;
        }
    }

    // Second pass - count whites
    for (let i = 0; i < 4; i++) {
        if (attempt[i] === null) continue;

        const foundIndex = secret.findIndex(color => color === attempt[i]);
        if (foundIndex > -1) {
            white++;
            secret[foundIndex] = null; // Prevent reuse
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
async function startNewGame() {
    try {
        const response = await fetch('/new-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: generateUUID()
            })
        });

        const data = await response.json();
        // Redirect with UUID and secretCode from the server response
        window.location.href = `/game.html?uuid=${data.uuid}&secretCode=${data.secretCode}`;
    } catch (error) {
        console.error('Error starting new game:', error);
    }
}

app.get('/', (req, res) => {
    res.redirect('/home.html');
});

app.post('/new-game', (req, res) => {
    const gameUUID = req.body?.uuid || generateUUID();  // Fallback generation
    const secretCode = generateSecretCode();

    activeGames.set(gameUUID, {
        secretCode,
        attempts: 0,
        maxAttempts: 10,
        moveHistory: [],
        hintHistory: []
    });
    res.redirect(`/game.html?uuid=${gameUUID}&secretCode=${secretCode.join(',')}`);

    // res.json({
    //     uuid: gameUUID,
    //     secretCode: secretCode.join(',')
    // });

    if (!archivedGames.has(gameUUID)) {
        archivedGames.set(gameUUID, {
            uuid: gameUUID,
            secretCode: secretCode
        });
    }


});
app.post('/submit-guess', (req, res) => {
    const { uuid, guess } = req.body;
    const game = activeGames.get(uuid);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    // Calculate hints using your existing logic
    const hints = calculateHints(guess, game.secretCode);

    game.attempts++;
    const gameOver = game.attempts >= game.maxAttempts || hints.black === 4;

    game.moveHistory.push(guess);
    game.hintHistory.push(hints);

    // Store the last move results for later retrieval
    game.lastMoveResults = {
        black: hints.black,
        white: hints.white,
        attempts: game.attempts,
        gameOver: gameOver,
        won: hints.black === 4
    };

    // If game won, store that
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

// Add this endpoint to your main.js file
app.get('/liczba-odgadniec', (req, res) => {
    const { uuid } = req.query;

    if (!uuid) {
        return res.status(400).json({ error: 'Missing game UUID' });
    }

    const game = activeGames.get(uuid);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    // Calculate remaining moves
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

// Endpoint to retrieve hint history
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

    // Calculate hints
    const hints = calculateHints(guess, game.secretCode);

    game.attempts++;
    const gameOver = game.attempts >= game.maxAttempts || hints.black === 4;

    // Store in history
    game.moveHistory.push(guess);
    game.hintHistory.push(hints);

    // Store last move results
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
// Endpoint to change a previously made move
// Endpoint to change the last move (like ctrl+z)
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

    // Can only change the last move
    if (!game.moveHistory || game.moveHistory.length === 0) {
        return res.status(400).json({ error: 'No moves to change' });
    }

    // Get the index of the last move
    const moveIndex = game.moveHistory.length - 1;

    // Update the last move with new colors
    const newGuess = [color1, color2, color3, color4];
    game.moveHistory[moveIndex] = newGuess;

    // Recalculate hints for this move
    const hints = calculateHints(newGuess, game.secretCode);
    game.hintHistory[moveIndex] = hints;

    // Update the last move results
    game.lastMoveResults = {
        black: hints.black,
        white: hints.white,
        attempts: game.attempts,
        gameOver: game.attempts >= game.maxAttempts || hints.black === 4,
        won: hints.black === 4
    };

    // Update win status if this was the winning move
    if (hints.black === 4) {
        game.won = true;
    }

    return res.json({
        message: 'Last move updated successfully',
        newGuess,
        hints
    });
});

// Endpoint to delete a game
app.delete('/delete-game/:uuid', (req, res) => {
    const { uuid } = req.params;

    if (!uuid) {
        return res.status(400).json({ error: 'Missing game UUID' });
    }

    const gameExists = activeGames.has(uuid);

    if (!gameExists) {
        return res.status(404).json({ error: 'Game not found' });
    }

    // Delete the game from active games
    activeGames.delete(uuid);

    return res.json({
        message: 'Game deleted successfully',
        uuid
    });
});

app.listen(port, () => console.log(`server running on: http://localhost:${port}`));