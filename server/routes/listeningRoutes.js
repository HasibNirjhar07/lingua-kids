const express = require('express');
const router = express.Router();
const listeningController = require('../controllers/listeningController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to fetch listening passage
router.get('/:passageId', listeningController.getListeningPassage);

// Route to submit answers
router.post('/submit', authMiddleware , listeningController.submitListeningAnswers);

module.exports = router;
