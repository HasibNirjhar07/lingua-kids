const pool = require('../db');
const jwt = require('jsonwebtoken');
const { use } = require('../routes/auth');

const getListeningPassage = async (req, res) => {
    const { passageId } = req.params;

    try {
        // Fetch the passage details (content or audio_url, depending on what exists)
        const passageQuery = `
            SELECT title, content, audio_url, difficulty
            FROM Passages
            WHERE passage_id = $1;
        `;
        const passageResult = await pool.query(passageQuery, [passageId]);

        if (passageResult.rows.length === 0) {
            return res.status(404).json({ message: 'Passage not found' });
        }

        const passage = passageResult.rows[0];

        // Fetch fill-in-the-blank questions related to this passage
        const questionsQuery = `
            SELECT question_id, question_text, correct_answer
            FROM FillInTheBlanksQuestions
            WHERE passage_id = $1;
        `;
        const questionsResult = await pool.query(questionsQuery, [passageId]);

        // Prepare the response
        res.json({
            passageId,
            title: passage.title,
            content: passage.content,
            audioUrl: passage.audio_url,
            difficulty: passage.difficulty,
            questions: questionsResult.rows, // List of fill-in-the-blank questions
        });
    } catch (error) {
        console.error('Error fetching listening passage:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const submitListeningAnswers = async (req, res) => {
    const { passageId, answers } = req.body;
    const username = req.user.username;


    try {
        // Calculate the score by comparing answers
        let score = 0;
        for (let answer of answers) {
            const { questionId, userAnswer } = answer;

            // Fetch correct answer for the question
            const questionQuery = `
                SELECT correct_answer
                FROM FillInTheBlanksQuestions
                WHERE question_id = $1;
            `;
            const questionResult = await pool.query(questionQuery, [questionId]);

            if (questionResult.rows.length > 0) {
                const correctAnswer = questionResult.rows[0].correct_answer;
                // If the user's answer matches the correct answer
                if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
                    score++;
                }
            }
        }

        // Save the progress with the user's score
        const insertProgressQuery = `
            INSERT INTO Passage_Listening_Progress (username, passage_id, score)
            VALUES ($1, $2, $3)
            RETURNING progress_id;
        `;
        const progressResult = await pool.query(insertProgressQuery, [username, passageId, score]);

        // Return the progress ID along with the score
        res.json({
            message: 'Answers submitted successfully',
            score,
            progressId: progressResult.rows[0].progress_id,
        });
    } catch (error) {
        console.error('Error submitting listening answers:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to calculate listening progress
const getListeningProgress = async (req, res) => {
    const userId = req.user.username;

    try {
        // Fetch all passages the user has attempted in listening
        const progressResult = await pool.query(
            'SELECT score FROM passage_listening_progress WHERE username = $1',
            [userId]
        );

        // Fetch the total number of passages
        const totalPassagesResult = await pool.query(
            'SELECT COUNT(*) AS count FROM passages WHERE difficulty = $1',
            ['Beginner'] // Adjust difficulty level if needed
        );
        const totalPassages = parseInt(totalPassagesResult.rows[0].count, 10);

        if (totalPassages === 0) {
            return res.status(404).json({ error: 'No passages available' });
        }

        const passageValue = 100 / totalPassages; // Value of each passage

        // Calculate total score based on user's attempts
        const totalScore = progressResult.rows.reduce((acc, row) => {
            const score = row.score;

            if (score <= 20) {
                return acc + (passageValue * 20 / 100);
            } else if (score <= 40) {
                return acc + (passageValue * 40 / 100);
            } else if (score <= 60) {
                return acc + (passageValue * 60 / 100);
            } else if (score <= 80) {
                return acc + (passageValue * 80 / 100);
            } else {
                return acc + (passageValue * 100 / 100);
            }
        }, 0);

        // Calculate overall listening progress percentage
        const listeningProgress = Math.min(totalScore, 100);

        res.status(200).json({ listeningProgress });
    } catch (error) {
        console.error('Error fetching listening progress:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const getListeningistory = async (req, res) => {
    const userId = req.user.username;

    try {
        // Fetch the last three passages the user has attempted
        const historyResult = await pool.query(
            'SELECT passage_id, score, timestamp FROM passage_listening_progress WHERE username = $1 ORDER BY timestamp DESC LIMIT 3',
            [userId]
        );

        const readingHistory = historyResult.rows.map(row => ({
            passageId: row.passage_id,
            score: row.score,
            timestamp: row.timestamp.toLocaleString(), // Format timestamp as needed
        }));

        res.status(200).json(readingHistory);
    } catch (error) {
        console.error('Error fetching reading history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports = { getListeningPassage, submitListeningAnswers, getListeningProgress , getListeningistory}; ;