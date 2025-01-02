const fs = require('fs');
const { HfInference } = require('@huggingface/inference');
const pool = require('../db');

// Hugging Face query function
async function query(filename) {
    const data = fs.readFileSync(filename); // Read the audio file
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/wav2vec2-base-960h",
        {
            headers: {
                Authorization: `Bearer ${process.env.HF_API_KEY}`, // Replace with your actual Hugging Face API key
                "Content-Type": "application/json",
            },
            method: "POST",
            body: data, // Send the audio file data
        }
    );
    const result = await response.json(); // Parse and return the JSON response
    return result;
}

// processAudio function
const processAudio = async (req, res) => {
    const userId = req.user.username; // Extract user ID from JWT token
    const { passageId, filePath } = req.body; // Assuming filePath is provided in the request body

    try {
        // Call the Hugging Face query function
        const result = await query(filePath);

        // Check if the response contains an error
        if (result.error) {
            console.error('Error from Hugging Face API:', result.error);
            return res.status(500).json({ error: 'Hugging Face API error: ' + result.error });
        }

        // Send the transcription result to the user
        res.status(200).json({ transcription: result.text });
    } catch (error) {
        console.error('Error processing audio:', error);

        // Handle errors
        res.status(500).json({ error: 'Failed to process audio' });
    }
};

/**
 * Fetch speech transcription progress for the user.
 */
const getSpeechProgress = async (req, res) => {
    const userId = req.user.username;

    try {
        // Fetch user's completed speech transcriptions
        const progressResult = await pool.query(
            'SELECT passage_id FROM speech_transcriptions WHERE username = $1',
            [userId]
        );

        // Fetch the total number of passages for the user's difficulty level
        const totalPassagesResult = await pool.query(
            'SELECT COUNT(*) AS count FROM passages WHERE difficulty = (SELECT difficulty FROM users WHERE username = $1)',
            [userId]
        );

        const completedPassages = progressResult.rows.length;
        const totalPassages = parseInt(totalPassagesResult.rows[0].count, 10);

        // Calculate progress percentage
        const progressPercentage = totalPassages > 0 ? (completedPassages / totalPassages) * 100 : 0;

        res.status(200).json({ progressPercentage });
    } catch (error) {
        console.error('Error fetching speech progress:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Fetch the last three speech exercises for the user.
 */
const getSpeechHistory = async (req, res) => {
    const userId = req.user.username;

    try {
        // Fetch the last three speech transcriptions
        const historyResult = await pool.query(
            'SELECT passage_id, transcription, timestamp FROM speech_transcriptions WHERE username = $1 ORDER BY timestamp DESC LIMIT 3',
            [userId]
        );

        const speechHistory = historyResult.rows.map(row => ({
            passageId: row.passage_id,
            transcription: row.transcription,
            timestamp: row.timestamp.toLocaleString(), // Format timestamp as needed
        }));

        res.status(200).json(speechHistory);
    } catch (error) {
        console.error('Error fetching speech history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    processAudio,
    getSpeechProgress,
    getSpeechHistory
};
