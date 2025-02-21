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

module.exports = { getListeningPassage, submitListeningAnswers };