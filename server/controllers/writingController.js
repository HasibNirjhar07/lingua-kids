const pool = require('../db');
const { evaluateEssay } = require("./analyzeWriting");

// Fetch a random prompt for the user
const getRandomPrompt = async (req, res) => {
    const username = req.user.username;

    try {
        // Fetch user's difficulty level
        const userDifficultyResult = await pool.query(
            'SELECT difficulty FROM users WHERE username = $1',
            [username]
        );

        const userDifficulty = userDifficultyResult.rows[0]?.difficulty;

        if (!userDifficulty) {
            return res.status(400).json({ error: 'User difficulty level not found' });
        }

        // First priority: Fetch a prompt the user hasn’t received yet
        const unseenPromptsResult = await pool.query(
            `SELECT wp.prompt_id, wp.prompt 
             FROM Writing_Prompt wp
             LEFT JOIN Writing_Progress progress 
             ON wp.prompt_id = progress.prompt_id AND progress.username = $1
             WHERE wp.difficulty = $2 AND progress.prompt_id IS NULL
             ORDER BY RANDOM() LIMIT 1`,
            [username, userDifficulty]
        );

        let prompt = unseenPromptsResult.rows[0];

        // Second priority: Fetch prompts with score < 60
        if (!prompt) {
            const lowScorePromptsResult = await pool.query(
                `SELECT wp.prompt_id, wp.prompt 
                 FROM Writing_Prompt wp
                 LEFT JOIN Writing_Progress progress 
                 ON wp.prompt_id = progress.prompt_id AND progress.username = $1
                 WHERE wp.difficulty = $2 AND (progress.score IS NULL OR progress.score < 60)
                 ORDER BY RANDOM() LIMIT 1`,
                [username, userDifficulty]
            );

            prompt = lowScorePromptsResult.rows[0];
        }

        // Third priority: Fetch prompts with score < 80
        if (!prompt) {
            const fallbackPromptsResult = await pool.query(
                `SELECT wp.prompt_id, wp.prompt 
                 FROM Writing_Prompt wp
                 LEFT JOIN Writing_Progress progress 
                 ON wp.prompt_id = progress.prompt_id AND progress.username = $1
                 WHERE wp.difficulty = $2 AND (progress.score IS NULL OR progress.score < 80)
                 ORDER BY RANDOM() LIMIT 1`,
                [username, userDifficulty]
            );

            prompt = fallbackPromptsResult.rows[0];
        }

        // If no prompts are left, return a congratulatory message
        if (!prompt) {
            return res.status(200).json({
                message: "Congratulations, you've completed all the writing challenges! To level up, complete other challenges.",
            });
        }

        res.status(200).json(prompt);
    } catch (error) {
        console.error('Error fetching random prompt:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const analyzeUserWriting = async (req, res) => {
    const { text } = req.body;
  
    if (!text) {
      return res.status(400).json({ error: "No text provided for analysis." });
    }
  
    try {
      // Analyze the text
      const analysisResult = await evaluateEssay(text);

      console.log('Analysis result:', analysisResult);
  
      res.status(200).json({
        cumulativeScore: analysisResult.cumulativeScore,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

// Submit user's writing score
const submitWritingScore = async (req, res) => {
    const { promptId, score } = req.body;
    const username = req.user.username;

    try {
        // Fetch existing progress for the prompt
        const existingProgressResult = await pool.query(
            'SELECT score FROM Writing_Progress WHERE username = $1 AND prompt_id = $2',
            [username, promptId]
        );

        const existingScore = existingProgressResult.rows[0]?.score;

        // Only update if the new score is better
        if (!existingScore || score > existingScore) {
            await pool.query(
                `INSERT INTO Writing_Progress (username, prompt_id, score, timestamp)
                 VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                 ON CONFLICT (username, prompt_id)
                 DO UPDATE SET score = $3, timestamp = CURRENT_TIMESTAMP`,
                [username, promptId, score]
            );
        }

        res.status(200).json({ message: 'Score submitted successfully' });
    } catch (error) {
        console.error('Error submitting writing score:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch writing progress
const getWritingProgress = async (req, res) => {
    const username = req.user.username;

    try {
        // Fetch the total number of prompts
        const totalPromptsResult = await pool.query(
            'SELECT COUNT(*) AS total FROM Writing_Prompt WHERE difficulty = (SELECT difficulty FROM users WHERE username = $1)',
            [username]
        );

        const totalPrompts = parseInt(totalPromptsResult.rows[0]?.total || 0, 10);

        // Fetch the number of completed prompts with score >= 80
        const completedPromptsResult = await pool.query(
            `SELECT COUNT(*) AS completed 
             FROM Writing_Progress progress
             JOIN Writing_Prompt wp ON progress.prompt_id = wp.prompt_id
             WHERE progress.username = $1 AND progress.score >= 80`,
            [username]
        );

        const completedPrompts = parseInt(completedPromptsResult.rows[0]?.completed || 0, 10);

        const progress = totalPrompts > 0 ? (completedPrompts / totalPrompts) * 100 : 0;

        res.status(200).json({ progress });
    } catch (error) {
        console.error('Error fetching writing progress:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch the last three writing activities for the user
const getWritingHistory = async (req, res) => {
    const username = req.user.username;

    try {
        // Fetch the last three prompts the user has attempted
        const historyResult = await pool.query(
            `SELECT wp.prompt_id, wp.prompt, progress.score, progress.timestamp
             FROM Writing_Progress progress
             JOIN Writing_Prompt wp ON progress.prompt_id = wp.prompt_id
             WHERE progress.username = $1
             ORDER BY progress.timestamp DESC LIMIT 3`,
            [username]
        );

        const history = historyResult.rows.map(row => ({
            promptId: row.prompt_id,
            prompt: row.prompt,
            score: row.score,
            timestamp: row.timestamp.toLocaleString(),
        }));

        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching writing history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getRandomPrompt,
    submitWritingScore,
    analyzeUserWriting,
    getWritingProgress,
    getWritingHistory,
};
