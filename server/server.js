const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const db = require("./db");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const readingTestRoutes = require("./routes/readingTest");
const writingRoutes = require("./routes/writingRoutes");
const listeningRoutes = require("./routes/listeningRoutes");
const speakingRoutes = require("./routes/speakingRoutes");

//app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3001", // Your Next.js frontend URL
    credentials: true, // Allow credentials to be sent
  })
);
app.use(express.json()); // This is crucial for handling JSON requests
app.use(express.urlencoded({ extended: true })); // This is crucial for handling form data
app.use("/writing", writingRoutes);
app.use("/auth", authRoutes);
app.use("/reading", readingTestRoutes);
app.use("/speaking", speakingRoutes);
app.use("/listening", listeningRoutes);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Test route to check the database connection
app.get("/users", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users"); // Example query
    console.log("Database is working fine");
    res.json(result.rows); // Send the result back to the client
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Database query error" });
  }
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
