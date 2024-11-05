const express = require('express');
const router = express.Router();
const { getPassageWithQuestions, submitUserAnswers, getRandomPassage } = require('../controllers/readingTestController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to get a passage and its related questions
router.get('/passage/:passageId',authMiddleware, getPassageWithQuestions);

// Route to submit user answers
router.post('/submit', authMiddleware, submitUserAnswers);

// Route to get a random passage
router.get('/random', authMiddleware, getRandomPassage);

module.exports = router;