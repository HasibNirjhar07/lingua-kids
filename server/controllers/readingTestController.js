const pool = require('../db');
const jwt = require('jsonwebtoken');
const { use } = require('../routes/auth');

// Fetch a passage with related questions and options
const getPassageWithQuestions = async (req, res) => {
    const { passageId } = req.params; // Get passage ID from the URL parameter
    const userId = req.user.id; // Assuming you're using JWT for user authentication and storing user id in req.user

    try {
        // Fetch the passage from the database
        const passageResult = await pool.query('SELECT * FROM passages WHERE id = $1', [passageId]);
        const passage = passageResult.rows[0];

        if (!passage) {
            return res.status(404).json({ error: 'Passage not found or already read' });
        }

        // Fetch questions and options related to the passage
        const questionsResult = await pool.query(
            `SELECT q.id AS question_id, q.question_text, o.id AS option_id, o.option_text
             FROM questions q
             JOIN options o ON o.question_id = q.id
             WHERE q.passage_id = $1`,
            [passageId]
        );

        // Organize questions and options into a structured format
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

        // Send the passage and questions as a response
        res.status(200).json({ passage, questions });
    } catch (error) {
        console.error('Error fetching passage and questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Submit user's answers and calculate score
const submitUserAnswers = async (req, res) => {
    const { passageId, answers } = req.body; // Expect user ID, passage ID, and array of answers from the request body
    const userId = req.user.id;
    console.log(req.body , userId);
    try {
        let score = 0;

        // Loop through each submitted answer
        for (const answer of answers) {
            const { questionId, selectedOptionId } = answer;

            console.log(`Processing question ID: ${questionId}, Selected Option ID: ${selectedOptionId}`);

            // Get the correct answer for the question from the database
            const correctAnswerResult = await pool.query(
                'SELECT correct_option_id FROM questions WHERE id = $1',
                [questionId]
            );

            // Check if question exists
            if (correctAnswerResult.rowCount === 0) {
                console.warn(`Question not found: ${questionId}`);
                continue; // Skip if question does not exist
            }

            const correctOptionId = correctAnswerResult.rows[0].correct_option_id;

            // Log the correct answer
            console.log(`Question ID: ${questionId}, Correct Option ID: ${correctOptionId}`);

            // Check if the submitted answer is correct
            const isCorrect = selectedOptionId.toString() === correctOptionId.toString(); // Ensure type consistency
            if (isCorrect) {
                score++;
            }

            // Log the result
            console.log(`Is Correct: ${isCorrect}`);

            // Insert the user's answer into the user_answers table
            await pool.query(
                'INSERT INTO user_answers (user_id, question_id, selected_option_id, is_correct) VALUES ($1, $2, $3, $4)',
                [userId, questionId, selectedOptionId, isCorrect]
            );
        }

        // Mark the passage as read for this user
        await pool.query(
            'UPDATE passages SET user_id = $1, read = TRUE WHERE id = $2',
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
    const userId = req.user.id; // Assuming you're using JWT for user authentication and storing user id in req.user
    
    try {
        // Fetch a random passage that has not been read by the user
        const result = await pool.query(
            `SELECT * FROM passages 
             WHERE user_id IS NULL 
             OR user_id != $1 
             ORDER BY RANDOM() LIMIT 1`,
            [userId]
        );

        const passage = result.rows[0];

        if (!passage) {
              console.log('No unread passages available');
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
