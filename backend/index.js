const express = require('express');
// const speechRoutes = require('./routes/speechRoutes');
// const grammarRoutes = require('./routes/grammarRoutes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// API routes
// app.use('/api/speech', speechRoutes);
// app.use('/api/grammar', grammarRoutes);

db.connect(); // Connect to the database

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
