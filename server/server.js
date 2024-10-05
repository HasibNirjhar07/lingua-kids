
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');

//app.use(cors());
app.use(cors({
    origin: 'http://localhost:3001', // Your Next.js frontend URL
    credentials: true, // Allow credentials to be sent
}));
app.use(express.json());
app.use('/auth', authRoutes); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Test route to check the database connection
app.get('/users', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM users'); // Example query
      console.log('Database is working fine');
      res.json(result.rows); // Send the result back to the client
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Database query error' });
    }
  });

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
    }
);