const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middlewares/authMiddleware');
const { processAudio, getSpeechProgress, getSpeechHistory } = require('../controllers/speechRecognition');

const router = express.Router();

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for processing audio
router.post('/process-audio', authMiddleware, upload.single('audio'), processAudio);

// Route for fetching speech transcription progress
router.get('/speech-progress', authMiddleware, getSpeechProgress);

// Route for fetching the last three speech exercises
router.get('/speech-history', authMiddleware, getSpeechHistory);

module.exports = router;
