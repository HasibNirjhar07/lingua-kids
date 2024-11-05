const pool = require('../db');
const jwt = require('jsonwebtoken');
const { use } = require('../routes/auth');

const getPassageWithQuestions = async (req, res) => {
    const { passageId } = req.params;
    const userId = req.user.id;

    try {
        // Fetch the passage from the database
        const passageResult = await pool.query('SELECT * FROM passages WHERE passage_id = $1', [passageId]);
        const passage = passageResult.rows[0];
        if (!passage) {
            return res.status(404).json({ error: 'Passage not found' });
        }

        // Fetch related multiple-choice questions and their options
        const questionsResult = await pool.query(
            `SELECT question_id, question_text, opt1, opt2, opt3, opt4, correct_answer
             FROM mcqquestions
             WHERE passage_id = $1`,
            [passageId]
        );

        // Organize questions and options
        const questions = questionsResult.rows.map(row => ({
            id: row.question_id,
            text: row.question_text,
            options: [
                { id: 'opt1', text: row.opt1 },
                { id: 'opt2', text: row.opt2 },
                { id: 'opt3', text: row.opt3 },
                { id: 'opt4', text: row.opt4 }
            ],
            correctAnswer: row.correct_answer  // optional, exclude if answers shouldn’t be shared
        }));
        console.log(passage, questions);

        res.status(200).json({ passage, questions });
    } catch (error) {
        console.error('Error fetching passage and questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Submit user's answers and calculate score
const submitUserAnswers = async (req, res) => {
    const { passageId, answers } = req.body;
    const userId = req.user.username;

    try {
        // Check if the user has already completed this passage
        const passageReadResult = await pool.query(
            'SELECT * FROM passage_reading_progress WHERE passage_id = $1 AND username = $2',
            [passageId, userId]
        );
        if (passageReadResult.rows.length > 0) {
            return res.status(400).json({ error: 'Passage already completed' });
        }

        // Fetch all MCQ questions for the passage
        const questionsResult = await pool.query(
            'SELECT question_id, correct_answer FROM mcqquestions WHERE passage_id = $1',
            [passageId]
        );
        const totalQuestions = questionsResult.rows.length;

        // Calculate the score based on the user's answers
        let correctAnswersCount = 0;

        answers.forEach(answer => {
            const { questionId, selectedOptionId } = answer;

            // Find the correct answer for the current question
            const question = questionsResult.rows.find(q => q.question_id === questionId);
            if (question && selectedOptionId === question.correct_answer) {
                correctAnswersCount++;
            }
        });

        // Calculate the score as a percentage
        const scorePercentage = (correctAnswersCount / totalQuestions) * 100;

        // Save the user's progress in Passage_Reading_Progress
        await pool.query(
            'INSERT INTO passage_reading_progress (username, passage_id, score) VALUES ($1, $2, $3)',
            [userId, passageId, Math.round(scorePercentage)]
        );

        // Return the score percentage to the user
        res.status(200).json({ scorePercentage, totalQuestions });
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Fetch random passage for user
const getRandomPassage = async (req, res) => {
    const username = req.user.username;
    console.log(username);

    try {
        // Fetch a random passage that the user hasn't read
        const result = await pool.query(
            `SELECT * FROM passages
             WHERE difficulty = (SELECT difficulty FROM users WHERE username = $1)
             ORDER BY RANDOM() LIMIT 1`,
            [username]
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
