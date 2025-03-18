const pool = require("../db");
const { analyzeSpeech } = require("./analyzeSpeech");

// Fetch a random speaking content for the user
const getRandomSpeakingContent = async (req, res) => {
  const username = req.user.username;

  try {
    // Fetch user's difficulty level
    const userDifficultyResult = await pool.query(
      "SELECT difficulty FROM users WHERE username = $1",
      [username]
    );

    const userDifficulty = userDifficultyResult.rows[0]?.difficulty;

    if (!userDifficulty) {
      return res.status(400).json({ error: "User difficulty level not found" });
    }

    // Fetch a content the user hasn’t attempted yet
    const unseenContentResult = await pool.query(
      `SELECT sc.content_id, sc.title, sc.content, sc.image_url 
             FROM Speaking_Content sc
             LEFT JOIN Speaking_Progress sp 
             ON sc.content_id = sp.content_id AND sp.username = $1
             WHERE sc.difficulty = $2 AND sp.content_id IS NULL
             ORDER BY RANDOM() LIMIT 1`,
      [username, userDifficulty]
    );

    let content = unseenContentResult.rows[0];

    // If no new content is found, fetch content with a score < 60
    if (!content) {
      const lowScoreContentResult = await pool.query(
        `SELECT sc.content_id, sc.title, sc.content, sc.image_url 
                 FROM Speaking_Content sc
                 LEFT JOIN Speaking_Progress sp 
                 ON sc.content_id = sp.content_id AND sp.username = $1
                 WHERE sc.difficulty = $2 AND (sp.score IS NULL OR sp.score < 60)
                 ORDER BY RANDOM() LIMIT 1`,
        [username, userDifficulty]
      );
      content = lowScoreContentResult.rows[0];
    }

    // If no content with low scores, fetch content with a score < 80
    if (!content) {
      const fallbackContentResult = await pool.query(
        `SELECT sc.content_id, sc.title, sc.content, sc.image_url 
                 FROM Speaking_Content sc
                 LEFT JOIN Speaking_Progress sp 
                 ON sc.content_id = sp.content_id AND sp.username = $1
                 WHERE sc.difficulty = $2 AND (sp.score IS NULL OR sp.score < 80)
                 ORDER BY RANDOM() LIMIT 1`,
        [username, userDifficulty]
      );
      content = fallbackContentResult.rows[0];
    }

    // If no content left, return a congratulatory message
    if (!content) {
      return res.status(200).json({
        message:
          "Congratulations, you've completed all speaking challenges! Try reviewing previous topics or practicing further.",
      });
    }

    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching speaking content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Analyze user speech input
const analyzeUserSpeech = async (req, res) => {
  const { scores } = req.body;

  if (!scores || !Array.isArray(scores) || scores.length === 0) {
    return res.status(400).json({ error: "No valid scores provided." });
  }

  try {
    // Calculate the final score as the average of multiple parameters
    const cumulativeScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    res.status(200).json({ cumulativeScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit user's speaking score
const submitSpeakingScore = async (req, res) => {
  const { contentId, score } = req.body;
  const username = req.user.username;

  try {
    // Fetch existing progress for the content
    const existingProgressResult = await pool.query(
      "SELECT score FROM Speaking_Progress WHERE username = $1 AND content_id = $2",
      [username, contentId]
    );

    const existingScore = existingProgressResult.rows[0]?.score;

    // Only update if the new score is better
    if (!existingScore || score > existingScore) {
      if (existingScore) {
        await pool.query(
          `UPDATE Speaking_Progress 
                     SET score = $1, timestamp = CURRENT_TIMESTAMP 
                     WHERE username = $2 AND content_id = $3`,
          [score, username, contentId]
        );
      } else {
        await pool.query(
          `INSERT INTO Speaking_Progress (username, content_id, score, timestamp)
                     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
          [username, contentId, score]
        );
      }
    }

    res.status(200).json({ message: "Score submitted successfully" });
  } catch (error) {
    console.error("Error submitting speaking score:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch speaking progress
const getSpeakingProgress = async (req, res) => {
  const username = req.user.username;

  try {
    const totalContentResult = await pool.query(
      "SELECT COUNT(*) AS total FROM Speaking_Content WHERE difficulty = (SELECT difficulty FROM users WHERE username = $1)",
      [username]
    );

    const totalContent = parseInt(totalContentResult.rows[0]?.total || 0, 10);

    const completedContentResult = await pool.query(
      `SELECT COUNT(*) AS completed 
             FROM Speaking_Progress sp
             JOIN Speaking_Content sc ON sp.content_id = sc.content_id
             WHERE sp.username = $1 AND sp.score >= 80`,
      [username]
    );

    const completedContent = parseInt(
      completedContentResult.rows[0]?.completed || 0,
      10
    );

    const progress =
      totalContent > 0 ? (completedContent / totalContent) * 100 : 0;

    res.status(200).json({ progress });
  } catch (error) {
    console.error("Error fetching speaking progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch last three speaking activities
const getSpeakingHistory = async (req, res) => {
  const username = req.user.username;

  try {
    const historyResult = await pool.query(
      `SELECT sc.content_id, sc.title, sp.score, sp.timestamp
             FROM Speaking_Progress sp
             JOIN Speaking_Content sc ON sp.content_id = sc.content_id
             WHERE sp.username = $1
             ORDER BY sp.timestamp DESC LIMIT 3`,
      [username]
    );

    const history = historyResult.rows.map((row) => ({
      contentId: row.content_id,
      title: row.title,
      score: row.score,
      timestamp: row.timestamp.toLocaleString(),
    }));

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching speaking history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getRandomSpeakingContent,
  analyzeUserSpeech,
  submitSpeakingScore,
  getSpeakingProgress,
  getSpeakingHistory,
};
