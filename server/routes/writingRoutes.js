const express = require('express');
const router = express.Router();
const {getRandomPrompt, submitWritingScore, analyzeUserWriting ,getWritingProgress, getWritingHistory } = require('../controllers/writingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to get a random writing prompt
router.get('/random', authMiddleware, getRandomPrompt);

// Route to analyze user writing
router.post('/analyze', authMiddleware, analyzeUserWriting);

// Route to submit a writing score
router.post('/submit', authMiddleware, submitWritingScore);

// Route to get writing progress
router.get('/progress', authMiddleware, getWritingProgress);

// Route to fetch writing history
router.get('/history', authMiddleware, getWritingHistory);


module.exports = router;
