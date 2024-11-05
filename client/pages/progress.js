import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Clock, Medal, Trophy, Star } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

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
        <svg width="200" height="200" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
const ExerciseItem = ({ title, score, timestamp, color }) => (
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
      <div className="text-lg font-bold text-gray-800">{score}/100</div>
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
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [readingProgress, setReadingProgress] = useState(0); // State for reading progress
  const [readingHistory, setReadingHistory] = useState([]); // State for reading history

  const predefinedExercises = {
    writing: [
      { title: "Essay Writing", score: 88, timestamp: "Today, 1:20 PM" },
      { title: "Grammar Exercise", score: 95, timestamp: "Yesterday, 3:45 PM" },
    ],
    speaking: [
      { title: "Pronunciation Test", score: 82, timestamp: "Today, 11:30 AM" },
      { title: "Conversation Practice", score: 90, timestamp: "Yesterday, 2:00 PM" },
    ],
    listening: [
      { title: "Audio Comprehension", score: 87, timestamp: "Today, 10:15 AM" },
      { title: "Dialogue Analysis", score: 93, timestamp: "Yesterday, 5:30 PM" },
    ],
  };

  const activeTimeData = [
    { day: 'Mon', minutes: 45 },
    { day: 'Tue', minutes: 60 },
    { day: 'Wed', minutes: 30 },
    { day: 'Thu', minutes: 75 },
    { day: 'Fri', minutes: 50 },
    { day: 'Sat', minutes: 40 },
    { day: 'Sun', minutes: 55 },
  ];

  // Fetch reading progress and history from the backend
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token'); // Assuming you're using tokens for authentication

      // Fetch reading progress
      try {
        const progressResponse = await fetch('http://localhost:3000/reading/progress', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setReadingProgress(progressData.readingProgress); // Set the fetched reading progress
        } else {
          console.error('Failed to fetch reading progress:', progressResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching reading progress:', error);
      }

      // Fetch reading history
      try {
        const historyResponse = await fetch('http://localhost:3000/reading/history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setReadingHistory(historyData); // Set the fetched reading history
        } else {
          console.error('Failed to fetch reading history:', historyResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching reading history:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar />
      <div className="w-full mx-auto ml-6 mr-6 my-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Language Learning Progress</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skill Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-md"
          >
            <h3 className="text-gray-600 font-medium mb-4 text-lg">Skill Progress</h3>
            <SkillProgress skill="Reading" progress={readingProgress} color="bg-blue-500" />
            <SkillProgress skill="Writing" progress={85} color="bg-green-500" />
            <SkillProgress skill="Speaking" progress={65} color="bg-yellow-500" />
            <SkillProgress skill="Listening" progress={80} color="bg-purple-500" />
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
            <h3 className="text-gray-600 font-medium mb-4 text-lg">Exercise History</h3>
            <div className="flex space-x-4 mb-4 border-b">
              <button 
                onClick={() => setSelectedSkill('all')}
                className={`pb-2 ${selectedSkill === 'all' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedSkill('reading')}
                className={`pb-2 capitalize ${selectedSkill === 'reading' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              >
                Reading
              </button>
              <button
                onClick={() => setSelectedSkill('writing')}
                className={`pb-2 capitalize ${selectedSkill === 'writing' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              >
                Writing
              </button>
              <button
                onClick={() => setSelectedSkill('speaking')}
                className={`pb-2 capitalize ${selectedSkill === 'speaking' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              >
                Speaking
              </button>
              <button
                onClick={() => setSelectedSkill('listening')}
                className={`pb-2 capitalize ${selectedSkill === 'listening' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              >
                Listening
              </button>
            </div>
            
            <div className="space-y-2">
              {/* Show reading history for 'reading' skill and predefined exercises for others */}
              {(selectedSkill === 'all' ? readingHistory : 
                selectedSkill === 'reading' ? readingHistory :
                selectedSkill === 'writing' ? predefinedExercises.writing :
                selectedSkill === 'speaking' ? predefinedExercises.speaking :
                predefinedExercises.listening
              ).map((exercise, index) => (
                <ExerciseItem
                  key={index}
                  title={exercise.passageId || exercise.title} // Use passageId or title based on the exercise type
                  score={exercise.score}
                  timestamp={exercise.timestamp}
                  color="bg-blue-500" // Modify color logic if needed
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
              <h3 className="text-gray-600 font-medium mb-4 text-lg">Active Time</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={activeTimeData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Line 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#6366f1' }}
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
              <h3 className="text-gray-600 font-medium mb-4 text-lg">Earned Badges</h3>
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
