const express = require('express');
const router = express.Router();
const { getPassageWithQuestions, submitUserAnswers, getRandomPassage , getReadingProgress , getReadingHistory , getLeaderboard , getUserStreak} = require('../controllers/readingTestController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/streak', authMiddleware, getUserStreak);
// Route to get a passage and its related questions
router.get('/passage/:passageId',authMiddleware, getPassageWithQuestions);

// Route to submit user answers
router.post('/submit', authMiddleware, submitUserAnswers);

// Route to get a random passage
router.get('/random', authMiddleware, getRandomPassage);

// New route for getting reading progress
router.get('/progress', authMiddleware, getReadingProgress);

// New route for fetching reading history
router.get('/history', authMiddleware, getReadingHistory);

router.get("/:type", getLeaderboard);




module.exports = router;