import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Clock, Medal, Trophy, Star } from "lucide-react";
import Sidebar from "@/components/Sidebar";

// Progress Bar Component
const SkillProgress = ({ skill, progress, color }) => (
  <div className="mb-6">
    <div className="flex justify-between text-sm text-gray-600 mb-2">
      <span className="font-semibold">{skill}</span>
      <span>{progress}%</span>
    </div>
    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className={`h-full ${color}`}
        transition={{ duration: 1 }}
      />
    </div>
  </div>
);

const PerformanceGauge = () => {
  const generateLines = () => {
    const lines = [];
    const numberOfLines = 30;
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    for (let i = 0; i < numberOfLines; i++) {
      const angle = (i * 180) / (numberOfLines - 1) - 90;
      const x1 = centerX + (radius - 15) * Math.cos((angle * Math.PI) / 180);
      const y1 = centerY + (radius - 15) * Math.sin((angle * Math.PI) / 180);
      const x2 = centerX + radius * Math.cos((angle * Math.PI) / 180);
      const y2 = centerY + radius * Math.sin((angle * Math.PI) / 180);

      lines.push(
        <motion.line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#FF9500"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        />
      );
    }
    return lines;
  };

  return (
    <motion.div
      className="w-full bg-white rounded-2xl p-6 shadow-md"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-gray-600 font-medium mb-4">Average Performance</h3>
      <div className="relative">
        <svg
          width="200"
          height="200"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          {generateLines()}
        </svg>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative text-center py-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold text-gray-800"
          >
            100
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 mt-1"
          >
            points
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Exercise Item Component with Timestamp
const ExerciseItem = ({ title, score, timestamp, color, isListening }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-2"
  >
    <div className="flex items-center space-x-3">
      <div className={`w-2 h-10 ${color} rounded-full`}></div>
      <div>
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-500">{timestamp}</p>
      </div>
    </div>
    <div className="text-right">
      <div className="text-lg font-bold text-gray-800">
        {isListening ? `${Math.round((score / 5) * 100)}/100` : `${score}/100`}
      </div>
    </div>
  </motion.div>
);

// Badge Component
const Badge = ({ icon: Icon, title, description, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`${color} p-4 rounded-xl text-white flex items-center space-x-3`}
  >
    <Icon size={24} />
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  </motion.div>
);

const LanguageProgress = () => {
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingHistory, setReadingHistory] = useState([]);
  const [listeningProgress, setListeningProgress] = useState(0);
  const [listeningHistory, setListeningHistory] = useState([]);
  const [writingProgress, setWritingProgress] = useState(0);
  const [writingHistory, setWritingHistory] = useState([]);
  const [speakingProgress, setSpeakingProgress] = useState(0);
  const [speakingHistory, setSpeakingHistory] = useState([]);

  const activeTimeData = [
    { day: "Mon", minutes: 45 },
    { day: "Tue", minutes: 60 },
    { day: "Wed", minutes: 30 },
    { day: "Thu", minutes: 75 },
    { day: "Fri", minutes: 50 },
    { day: "Sat", minutes: 40 },
    { day: "Sun", minutes: 55 },
  ];

  // Fetch reading, listening, writing, and speaking progress and history from the backend
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Assuming you're using tokens for authentication

      // Fetch reading progress
      try {
        const progressResponse = await fetch(
          "http://localhost:3000/reading/progress",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setReadingProgress(progressData.readingProgress);
        } else {
          console.error(
            "Failed to fetch reading progress:",
            progressResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching reading progress:", error);
      }

      // Fetch reading history
      try {
        const historyResponse = await fetch(
          "http://localhost:3000/reading/history",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setReadingHistory(historyData);
        } else {
          console.error(
            "Failed to fetch reading history:",
            historyResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching reading history:", error);
      }

      // Fetch listening progress
      try {
        const listeningResponse = await fetch(
          `http://localhost:3000/listening/progress`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (listeningResponse.ok) {
          const listeningData = await listeningResponse.json();
          setListeningProgress(listeningData.listeningProgress);
        } else {
          console.error(
            "Failed to fetch listening progress:",
            listeningResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching listening progress:", error);
      }

      // Fetch listening history
      try {
        const response = await fetch(
          "http://localhost:3000/listening/history",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const listeningHistoryData = await response.json();
          setListeningHistory(listeningHistoryData);
        } else {
          console.error(
            "Failed to fetch listening history:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching listening history:", error);
      }

      // Fetch writing progress
      try {
        const writingResponse = await fetch(
          "http://localhost:3000/writing/progress",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (writingResponse.ok) {
          const writingData = await writingResponse.json();
          setWritingProgress(writingData.writingProgress);
        } else {
          console.error(
            "Failed to fetch writing progress:",
            writingResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching writing progress:", error);
      }

      // Fetch writing history
      try {
        const writingHistoryResponse = await fetch(
          "http://localhost:3000/writing/history",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (writingHistoryResponse.ok) {
          const writingHistoryData = await writingHistoryResponse.json();
          setWritingHistory(writingHistoryData);
        } else {
          console.error(
            "Failed to fetch writing history:",
            writingHistoryResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching writing history:", error);
      }

      // Fetch speaking progress
      try {
        const speakingResponse = await fetch(
          "http://localhost:3000/speaking/progress",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (speakingResponse.ok) {
          const speakingData = await speakingResponse.json();
          setSpeakingProgress(speakingData.progress);
        } else {
          console.error(
            "Failed to fetch speaking progress:",
            speakingResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching speaking progress:", error);
      }

      // Fetch speaking history
      try {
        const speakingHistoryResponse = await fetch(
          "http://localhost:3000/speaking/history",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (speakingHistoryResponse.ok) {
          const speakingHistoryData = await speakingHistoryResponse.json();
          setSpeakingHistory(speakingHistoryData);
        } else {
          console.error(
            "Failed to fetch speaking history:",
            speakingHistoryResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching speaking history:", error);
      }
    };

    fetchData();
  }, []);

  // Function to determine which exercises to display based on selected skill
  const getExercisesToDisplay = () => {
    let exercises = [];
    
    switch (selectedSkill) {
      case "all":
        exercises = [
          ...readingHistory.map((item) => ({ ...item, type: "reading" })),
          ...listeningHistory.map((item) => ({ ...item, type: "listening" })),
          ...writingHistory.map((item) => ({ ...item, type: "writing" })),
          ...speakingHistory.map((item) => ({ ...item, type: "speaking" })),
        ];
        break;
      case "reading":
        exercises = readingHistory.map((item) => ({ ...item, type: "reading" }));
        break;
      case "writing":
        exercises = writingHistory.map((item) => ({ ...item, type: "writing" }));
        break;
      case "speaking":
        exercises = speakingHistory.map((item) => ({ ...item, type: "speaking" }));
        break;
      case "listening":
        exercises = listeningHistory.map((item) => ({ ...item, type: "listening" }));
        break;
      default:
        exercises = [];
    }
    
    // Sort exercises by timestamp from most recent to oldest
    return exercises.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB - dateA; // Sort in descending order (newest first)
    });
  };

  // Function to determine appropriate color based on exercise type
  const getExerciseColor = (exercise) => {
    if (exercise.type === "reading") return "bg-blue-500";
    if (exercise.type === "listening") return "bg-purple-500";
    if (exercise.type === "writing") return "bg-green-500";
    if (exercise.type === "speaking") return "bg-yellow-500";
    return "bg-blue-500"; // Default color
  };

  // Function to get the appropriate title for exercise items
  const getExerciseTitle = (exercise) => {
    if (exercise.type === "reading")
      return exercise.passageId || "Reading Exercise";
    if (exercise.type === "listening")
      return (
        `${exercise.passageId}` || "Listening Exercise"
      );
    if (exercise.type === "writing")
      return `${exercise.promptId}` || "Writing Exercise";
    if (exercise.type === "speaking")
      return exercise.title || exercise.contentId || "Speaking Exercise";
    return "Exercise";
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar />
      <div className="w-full mx-auto ml-6 mr-6 my-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Language Learning Progress
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skill Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-md"
          >
            <h3 className="text-gray-600 font-medium mb-4 text-lg">
              Skill Progress
            </h3>
            <SkillProgress
              skill="Reading"
              progress={readingProgress}
              color="bg-blue-500"
            />
            <SkillProgress
              skill="Writing"
              progress={writingProgress}
              color="bg-green-500"
            />
            <SkillProgress
              skill="Speaking"
              progress={speakingProgress}
              color="bg-yellow-500"
            />
            <SkillProgress
              skill="Listening"
              progress={listeningProgress}
              color="bg-purple-500"
            />
          </motion.div>

          {/* Average Performance */}
          <PerformanceGauge />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Module Scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-md"
          >
            <h3 className="text-gray-600 font-medium mb-4 text-lg">
              Exercise History
            </h3>
            <div className="flex space-x-4 mb-4 border-b">
              <button
                onClick={() => setSelectedSkill("all")}
                className={`pb-2 ${
                  selectedSkill === "all"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedSkill("reading")}
                className={`pb-2 capitalize ${
                  selectedSkill === "reading"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
              >
                Reading
              </button>
              <button
                onClick={() => setSelectedSkill("writing")}
                className={`pb-2 capitalize ${
                  selectedSkill === "writing"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
              >
                Writing
              </button>
              <button
                onClick={() => setSelectedSkill("speaking")}
                className={`pb-2 capitalize ${
                  selectedSkill === "speaking"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
              >
                Speaking
              </button>
              <button
                onClick={() => setSelectedSkill("listening")}
                className={`pb-2 capitalize ${
                  selectedSkill === "listening"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
              >
                Listening
              </button>
            </div>

            <div className="space-y-2">
              {getExercisesToDisplay().map((exercise, index) => (
                <ExerciseItem
                  key={index}
                  title={getExerciseTitle(exercise)}
                  score={exercise.score}
                  timestamp={exercise.timestamp}
                  color={getExerciseColor(exercise)}
                  isListening={exercise.type === "listening"}
                />
              ))}
            </div>
          </motion.div>

          <div className="space-y-6">
            {/* Active Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <h3 className="text-gray-600 font-medium mb-4 text-lg">
                Active Time
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={activeTimeData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Line
                    type="monotone"
                    dataKey="minutes"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#6366f1" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Earned Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <h3 className="text-gray-600 font-medium mb-4 text-lg">
                Earned Badges
              </h3>
              <div className="space-y-3">
                <Badge
                  icon={Trophy}
                  title="Grammar Master"
                  description="Completed 50 grammar exercises"
                  color="bg-yellow-500"
                />
                <Badge
                  icon={Star}
                  title="Vocabulary Expert"
                  description="Learned 500 new words"
                  color="bg-purple-500"
                />
                <Badge
                  icon={Medal}
                  title="Speaking Star"
                  description="Perfect pronunciation streak"
                  color="bg-blue-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

LanguageProgress.hideNavbar = true;

export default LanguageProgress;