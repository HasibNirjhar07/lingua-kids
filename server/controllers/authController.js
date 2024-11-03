// controllers/authController.js
const pool = require('../db');
const jwt = require('jsonwebtoken');

// Handle signup form submission
const signupUser = async (req, res) => {
    const { username, password } = req.body;

    // Simple validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide all fields' });
    }

    try {
        // Check if the user already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Insert the user into the database with plain-text password
        const newUser = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING username',
            [username, password]
        );

        res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
    } catch (error) {
        console.error('Error inserting user:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Handle login form submission
// controllers/authController.js
// controllers/authController.js

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Validate user input
    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide all fields' });
    }

    try {
        // Find user in the database
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Compare plain-text passwords (since we're not hashing)
        if (password !== user.password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {username: user.username},
            'randomsecret', // Secret should be stored securely
            { expiresIn: '2d' }
        );

        res.status(200).json({ token, message: 'Logged in successfully' });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};



// controllers/authController.js

const getUserInfo = async (req, res) => {
    try {
        const username = req.user.username; // From decoded token
        const userResult = await pool.query('SELECT username FROM users WHERE username = $1', [username]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error getting user info:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addFavoriteGame = async (req, res) => {
    const { name } = req.body; // Get game name from request body
    const username = req.username; // Assuming userInfo is set in authMiddleware

    if (!name) {
        return res.status(400).json({ error: 'Game name is required' });
    }

    try {
        // Insert the game into the database
        const newGame = await pool.query(
            'INSERT INTO games (username, name) VALUES ($1, $2) RETURNING *',
            [username, name]
        );

        return res.status(201).json({ game: newGame.rows[0] }); // Respond with the new game
    } catch (error) {
        console.error('Error adding favorite game:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get user's favorite games
const getFavoriteGames = async (req, res) => {
    const username = req.username; // Get user ID from decoded token

    try {
        // Query the database for the user's favorite games
        const gamesResult = await pool.query('SELECT * FROM games WHERE username = $1', [username]);
        const games = gamesResult.rows;

        return res.status(200).json({ games }); // Send games back to frontend
    } catch (error) {
        console.error('Error fetching favorite games:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    signupUser,
    loginUser,
    getUserInfo,
    getFavoriteGames,
    addFavoriteGame,
};
