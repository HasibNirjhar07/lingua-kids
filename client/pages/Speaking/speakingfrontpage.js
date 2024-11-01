import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBookOpen, FaGamepad, FaPuzzlePiece, FaLanguage, 
  FaMusic, FaVideo, FaStar, FaTrophy, FaHeadphones 
} from 'react-icons/fa';

// Learning Content Components
const LearningModules = [
  {
    id: 'alphabet',
    title: 'Alphabet Adventure',
    description: 'Learn letters, sounds, and fun words!',
    icon: FaBookOpen,
    color: 'bg-blue-100',
    activities: [
      { name: 'Letter Matching', type: 'game' },
      { name: 'Phonics Practice', type: 'audio' },
      { name: 'Alphabet Song', type: 'music' }
    ]
  },
  {
    id: 'vocabulary',
    title: 'Word Wizards',
    description: 'Build your vocabulary with exciting themes!',
    icon: FaLanguage,
    color: 'bg-green-100',
    themes: [
      'Animals', 
      'Colors', 
      'Family', 
      'Food', 
      'Sports'
    ]
  },
  {
    id: 'grammar',
    title: 'Grammar Explorers',
    description: 'Learn grammar through fun stories!',
    icon: FaPuzzlePiece,
    color: 'bg-purple-100',
    levels: ['Beginner', 'Intermediate', 'Advanced']
  }
];

// Interactive Game Component
const InteractiveGame = ({ module }) => {
  const [score, setScore] = useState(0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-6 rounded-lg shadow-md ${module.color}`}
    >
      <div className="flex items-center mb-4">
        <module.icon className="mr-3 text-2xl" />
        <h2 className="text-2xl font-bold">{module.title}</h2>
      </div>
      <p className="text-gray-600 mb-4">{module.description}</p>
      
      {module.id === 'alphabet' && (
        <div className="grid grid-cols-5 gap-4">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((letter) => (
            <motion.button
              key={letter}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white p-4 rounded-lg shadow hover:bg-blue-200 transition"
            >
              {letter}
            </motion.button>
          ))}
        </div>
      )}
      
      {module.id === 'vocabulary' && (
        <div className="space-y-2">
          {module.themes.map((theme) => (
            <motion.div 
              key={theme}
              whileHover={{ x: 10 }}
              className="bg-white p-3 rounded-lg flex justify-between items-center"
            >
              <span>{theme} Vocabulary</span>
              <FaStar className="text-yellow-500" />
            </motion.div>
          ))}
        </div>
      )}
      
      {module.id === 'grammar' && (
        <div className="space-y-3">
          {module.levels.map((level) => (
            <motion.button
              key={level}
              whileHover={{ scale: 1.05 }}
              className="w-full bg-white p-4 rounded-lg flex justify-between items-center"
            >
              <span>{level} Grammar</span>
              <FaTrophy className="text-green-500" />
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Main Learning Platform Component
const KidsEnglishLearningPlatform = () => {
  const [activeModule, setActiveModule] = useState(null);
  const [dailyTips, setDailyTips] = useState([
    "Practice makes perfect! Try to learn 5 new words every day.",
    "Listen to English songs and try to sing along!",
    "Watch cartoons in English with subtitles.",
    "Play word games to make learning fun!"
  ]);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % dailyTips.length);
    }, 6000);
    return () => clearInterval(tipTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <h1 className="text-4xl font-bold mb-2">🌟 Kids English Learning Adventure 🌟</h1>
          <p className="text-xl">Fun, Interactive, and Engaging English Learning</p>
        </div>

        {/* Daily Learning Tip */}
        <div className="bg-yellow-100 p-4 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTip}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-yellow-800 font-semibold"
            >
              🌈 Daily Learning Tip: {dailyTips[currentTip]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Learning Modules Grid */}
        <div className="p-6 grid md:grid-cols-3 gap-6">
          {LearningModules.map((module) => (
            <motion.div 
              key={module.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveModule(module)}
              className={`cursor-pointer ${module.color} p-4 rounded-lg shadow-md hover:shadow-xl transition`}
            >
              <div className="flex items-center mb-2">
                <module.icon className="mr-3 text-2xl" />
                <h3 className="text-xl font-semibold">{module.title}</h3>
              </div>
              <p className="text-gray-600">{module.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Active Module Details */}
        {activeModule && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6"
          >
            <InteractiveGame module={activeModule} />
          </motion.div>
        )}

        {/* Additional Learning Resources */}
        <div className="bg-green-50 p-6 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <FaHeadphones className="mr-3 text-green-600" /> Audio Learning
            </h3>
            <ul className="space-y-2">
              <li>Pronunciation Practice</li>
              <li>Story Time Podcasts</li>
              <li>English Songs for Kids</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <FaVideo className="mr-3 text-blue-600" /> Video Lessons
            </h3>
            <ul className="space-y-2">
              <li>Animated Grammar Lessons</li>
              <li>Vocabulary Video Tutorials</li>
              <li>Interactive English Cartoons</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-6 text-center">
          <p>🌍 Learning English Can Be Fun! Keep Exploring! 🚀</p>
        </div>
      </motion.div>
    </div>
  );
};

export default KidsEnglishLearningPlatform;