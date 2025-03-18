const express = require('express');
const router = express.Router();
const listeningController = require('../controllers/listeningController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/progress', authMiddleware, listeningController.getListeningProgress);
// New route for fetching reading history
router.get('/history', authMiddleware, listeningController.getListeningistory);
// Route to fetch listening passage
router.get('/:passageId', listeningController.getListeningPassage);
// Route to submit answers
router.post('/submit', authMiddleware , listeningController.submitListeningAnswers);



module.exports = router;
