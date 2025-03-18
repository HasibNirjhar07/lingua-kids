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
    if (existingScore) {
        // Update the existing row
        await pool.query(
            `UPDATE Writing_Progress 
             SET score = $1, timestamp = CURRENT_TIMESTAMP 
             WHERE username = $2 AND prompt_id = $3`,
            [score, username, promptId]
        );
    } else {
        // Insert a new row
        await pool.query(
            `INSERT INTO Writing_Progress (username, prompt_id, score, timestamp)
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
            [username, promptId, score]
        );
    }
}


        res.status(200).json({ message: 'Score submitted successfully' });
    } catch (error) {
        console.error('Error submitting writing score:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch writing progress
const getWritingProgress = async (req, res) => {
    const userId = req.user.username;

    try {
        // Fetch all writing prompts the user has attempted
        const progressResult = await pool.query(
            "SELECT score FROM writing_progress WHERE username = $1",
            [userId]
        );

        // Fetch the total number of writing prompts
        const totalPromptsResult = await pool.query(
            "SELECT COUNT(*) AS count FROM writing_prompt WHERE difficulty = $1",
            ["Beginner"] // Adjust difficulty level as needed
        );

        const totalPrompts = parseInt(totalPromptsResult.rows[0].count, 10); // Convert to integer

        if (totalPrompts === 0) {
            return res.status(404).json({ error: "No writing prompts available" });
        }

        const promptValue = 100 / totalPrompts; // Calculate the value of each prompt

        // Calculate total score based on user's attempts
        const totalScore = progressResult.rows.reduce((acc, row) => {
            const score = row.score;

            // Determine the contribution based on the score ranges
            if (score <= 20) {
                return acc + (promptValue * 20 / 100); // Score 0-20 contributes 20%
            } else if (score <= 40) {
                return acc + (promptValue * 40 / 100); // Score 21-40 contributes 40%
            } else if (score <= 60) {
                return acc + (promptValue * 60 / 100); // Score 41-60 contributes 60%
            } else if (score <= 80) {
                return acc + (promptValue * 80 / 100); // Score 61-80 contributes 80%
            } else {
                return acc + (promptValue * 100 / 100); // Score 81-100 contributes 100%
            }
        }, 0);

        // Calculate overall writing progress percentage
        const writingProgress = Math.min(totalScore, 100); // Ensure progress does not exceed 100%

        res.status(200).json({ writingProgress });
    } catch (error) {
        console.error("Error fetching writing progress:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Fetch the last three writing activities for the user
// Fetch the last three writing exercises for the user
const getWritingHistory = async (req, res) => {
    const userId = req.user.username;

    try {
        // Fetch the last three writing exercises the user has attempted
        const historyResult = await pool.query(
            'SELECT prompt_id, score, timestamp FROM writing_progress WHERE username = $1 ORDER BY timestamp DESC LIMIT 3',
            [userId]
        );

        const writingHistory = historyResult.rows.map(row => ({
            promptId: row.prompt_id,
            score: row.score,
            timestamp: row.timestamp.toLocaleString(), // Format timestamp as needed
        }));

        res.status(200).json(writingHistory);
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
