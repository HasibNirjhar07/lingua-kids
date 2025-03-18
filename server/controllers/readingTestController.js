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

        // Return the score percentage and number of correct answers to the user
        res.status(200).json({ scorePercentage, correctAnswers: correctAnswersCount, totalQuestions });
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
        // Fetch a random passage with the user's difficulty level that the user hasn't read yet
        const result = await pool.query(
            `SELECT * FROM passages
             WHERE difficulty = (SELECT difficulty FROM users WHERE username = $1)
             ORDER BY RANDOM() LIMIT 1`,
            [username]
        );

        const passage = result.rows[0];

        if (!passage) {
            return res.status(404).json({ error: 'No unread passages available for your difficulty level' });
        }

        res.status(200).json(passage);
    } catch (error) {
        console.error('Error fetching random passage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to calculate reading progress
const getReadingProgress = async (req, res) => {
    const userId = req.user.username;

    try {
        // Fetch all passages the user has attempted
        const progressResult = await pool.query(
            'SELECT score FROM passage_reading_progress WHERE username = $1',
            [userId]
        );
        console.log(progressResult);

        // Fetch the total number of passages
        const totalPassagesResult = await pool.query(
            'SELECT COUNT(*) AS count FROM passages WHERE difficulty = $1',
            ['Beginner'] // Pass the difficulty level as a parameter
        );
        const totalPassages = parseInt(totalPassagesResult.rows[0].count, 10); // Convert to integer

        if (totalPassages === 0) {
            return res.status(404).json({ error: 'No passages available' });
        }

        const passageValue = 100 / totalPassages; // Calculate the value of each passage
        // Calculate total score based on user's attempts
        const totalScore = progressResult.rows.reduce((acc, row) => {
            const score = row.score;

            // Determine the contribution based on the score ranges
            if (score <= 20) {
                return acc + (passageValue * 20/100); // Score 0-20 contributes 20%
            } else if (score <= 40) {
                return acc + (passageValue * 40/100); // Score 21-40 contributes 40%
            } else if (score <= 60) {
                return acc + (passageValue * 60/100); // Score 41-60 contributes 60%
            } else if (score <= 80) {
                return acc + (passageValue * 80/100); // Score 61-80 contributes 80%
            } else {
                return acc + (passageValue * 100/100); // Score 81-100 contributes 100%
            }
        }, 0);

        // Calculate overall reading progress percentage
        const readingProgress = Math.min(totalScore, 100); // Ensure progress does not exceed 100%

        res.status(200).json({ readingProgress });
    } catch (error) {
        console.error('Error fetching reading progress:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch the last three reading exercises for the user
const getReadingHistory = async (req, res) => {
    const userId = req.user.username;

    try {
        // Fetch the last three passages the user has attempted
        const historyResult = await pool.query(
            'SELECT passage_id, score, timestamp FROM passage_reading_progress WHERE username = $1 ORDER BY timestamp DESC LIMIT 3',
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

const getLeaderboard = async (req, res) => {
    const { type } = req.params;
    const table = type === "listening" ? "passage_listening_progress" : "passage_reading_progress";
    
    try {
      let query;
      
      if (type === "listening") {
        // For listening: score is already the raw number of correct answers
        query = `
          SELECT 
            u.username, 
            COUNT(p.passage_id) AS passages_attempted, 
            SUM(p.score) AS total_score, 
            (SUM(p.score) * 1.0) / (COUNT(p.passage_id) * 5) AS accuracy, 
            (COUNT(p.passage_id) * 10) + ((SUM(p.score) * 1.0) / (COUNT(p.passage_id) * 5) * 90) AS final_score 
          FROM ${table} p 
          JOIN users u ON p.username = u.username 
          GROUP BY u.username 
          ORDER BY final_score DESC 
          LIMIT 10
        `;
      } else {
        // For reading: convert percentage score back to raw number first
        // If score is stored as percentage (0-100%), we multiply by 5 and divide by 100 to get raw score
        query = `
          SELECT 
            u.username, 
            COUNT(p.passage_id) AS passages_attempted, 
            SUM(p.score * 5 / 100) AS total_score, 
            (SUM(p.score * 5 / 100) * 1.0) / (COUNT(p.passage_id) * 5) AS accuracy, 
            (COUNT(p.passage_id) * 10) + ((SUM(p.score * 5 / 100) * 1.0) / (COUNT(p.passage_id) * 5) * 90) AS final_score 
          FROM ${table} p 
          JOIN users u ON p.username = u.username 
          GROUP BY u.username 
          ORDER BY final_score DESC 
          LIMIT 10
        `;
      }
      
      const { rows } = await pool.query(query);
      res.json({ leaderboard: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  };



module.exports = {
    getPassageWithQuestions,
    submitUserAnswers,
    getRandomPassage,
    getReadingProgress,
    getReadingHistory, 
    getLeaderboard
};
