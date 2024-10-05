// routes/auth.js
const express = require('express');
const router = express.Router();
const { signupUser, loginUser , getUserInfo, addFavoriteGame, getFavoriteGames} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
// Handle signup form submission
router.post('/signup', signupUser);

// Handle login submission
router.post('/login', loginUser);

router.get('/dashboard', authMiddleware, getUserInfo);

// Add favorite game
router.post('/games', authMiddleware, addFavoriteGame); // Protected route

// Get favorite games
router.get('/games', authMiddleware, getFavoriteGames); // Protected route

module.exports = router;
