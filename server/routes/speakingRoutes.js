const express = require("express");
const router = express.Router();
const {
  getRandomSpeakingContent,
  submitSpeakingScore,
  getSpeakingProgress,
  getSpeakingHistory,
} = require("../controllers/speakingController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route to get a random speaking prompt
router.get("/random", authMiddleware, getRandomSpeakingContent);

// Route to submit a speaking score
router.post("/submit", authMiddleware, submitSpeakingScore);

// Route to get speaking progress
router.get("/progress", authMiddleware, getSpeakingProgress);

// Route to fetch speaking history
router.get("/history", authMiddleware, getSpeakingHistory);

module.exports = router;
