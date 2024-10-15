const pool = require('../db');
const jwt = require('jsonwebtoken');
const { use } = require('../routes/auth');

// Fetch a passage with related questions and options
const getPassageWithQuestions = async (req, res) => {
    const { passageId } = req.params;
    const userId = req.user.id;

    try {
        // Check if user has already completed the passage
        const passageReadResult = await pool.query(
            'SELECT * FROM passage_read WHERE passage_id = $1 AND user_id = $2',
            [passageId, userId]
        );
        if (passageReadResult.rows.length > 0) {
            return res.status(400).json({ error: 'Passage already completed' });
        }

        // Fetch the passage from the database
        const passageResult = await pool.query('SELECT * FROM passages WHERE id = $1', [passageId]);
        const passage = passageResult.rows[0];
        if (!passage) {
            return res.status(404).json({ error: 'Passage not found' });
        }

        // Fetch related questions and options
        const questionsResult = await pool.query(
            `SELECT q.id AS question_id, q.question_text, o.id AS option_id, o.option_text
             FROM questions q
             JOIN options o ON o.question_id = q.id
             WHERE q.passage_id = $1`,
            [passageId]
        );

        // Organize questions and options
        const questions = questionsResult.rows.reduce((acc, row) => {
            const question = acc.find(q => q.id === row.question_id);
            if (question) {
                question.options.push({ id: row.option_id, text: row.option_text });
            } else {
                acc.push({
                    id: row.question_id,
                    text: row.question_text,
                    options: [{ id: row.option_id, text: row.option_text }]
                });
            }
            return acc;
        }, []);

        res.status(200).json({ passage, questions });
    } catch (error) {
        console.error('Error fetching passage and questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Submit user's answers and calculate score
const submitUserAnswers = async (req, res) => {
    const { passageId, answers } = req.body;
    const userId = req.user.id;

    try {
        let score = 0;

        // Check if the user already completed this passage
        const passageReadResult = await pool.query(
            'SELECT * FROM passage_read WHERE passage_id = $1 AND user_id = $2',
            [passageId, userId]
        );
        if (passageReadResult.rows.length > 0) {
            return res.status(400).json({ error: 'Passage already completed' });
        }

        // Process the answers and calculate the score
        for (const answer of answers) {
            const { questionId, selectedOptionId } = answer;

            // Fetch the correct option for the question
            const correctAnswerResult = await pool.query(
                'SELECT correct_option_id FROM questions WHERE id = $1',
                [questionId]
            );
            const correctOptionId = correctAnswerResult.rows[0].correct_option_id;

            // Check if the answer is correct
            const isCorrect = selectedOptionId.toString() === correctOptionId.toString();
            if (isCorrect) {
                score++;
            }

            // Insert the user's answer into the database
            await pool.query(
                'INSERT INTO user_answers (user_id, question_id, selected_option_id, is_correct) VALUES ($1, $2, $3, $4)',
                [userId, questionId, selectedOptionId, isCorrect]
            );
        }

        // Mark the passage as read for this user
        await pool.query(
            'INSERT INTO passage_read (user_id, passage_id) VALUES ($1, $2)',
            [userId, passageId]
        );

        // Return the score to the user
        res.status(200).json({ score, totalQuestions: answers.length });
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Fetch random passage for user
const getRandomPassage = async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch a random passage that the user hasn't read
        const result = await pool.query(
            `SELECT * FROM passages 
             WHERE id NOT IN (SELECT passage_id FROM passage_read WHERE user_id = $1)
             ORDER BY RANDOM() LIMIT 1`,
            [userId]
        );

        const passage = result.rows[0];
        if (!passage) {
            return res.status(404).json({ error: 'No unread passages available' });
        }

        res.status(200).json(passage);
    } catch (error) {
        console.error('Error fetching random passage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    getPassageWithQuestions,
    submitUserAnswers,
    getRandomPassage
};
