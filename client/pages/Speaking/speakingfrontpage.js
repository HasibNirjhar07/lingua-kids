import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaClock, FaQuestionCircle, FaArrowLeft, FaPlay, FaVolumeUp, FaBookOpen, FaUsers } from 'react-icons/fa';

const SpeakingFrontPage = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const router = useRouter();
  const tips = [
    "Enunciate clearly and maintain a steady pace.",
    "Take deep breaths to manage nerves and maintain composure.",
    "Listen attentively to each question before responding.",
    "Approach the exercise with confidence and a positive attitude."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    router.push('/Speaking/record');
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-row min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            className="bg-white rounded-lg shadow-lg mb-6 p-6 border-l-4 border-pink-500"
            whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-3xl font-semibold text-indigo-800 flex items-center mb-4">
              <FaMicrophone className="mr-2 text-pink-500 animate-pulse" size={28} />
              Speaking Assessment
            </h1>
            <p className="text-indigo-600 mb-4">
              Welcome to the speaking assessment! You will be presented with a series of sentences to read aloud. This exercise is designed to evaluate your pronunciation, fluency, and overall speaking skills.
            </p>
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">Instructions:</h2>
            <ul className="list-disc list-inside text-indigo-600 mb-4">
              <li>You will be shown one sentence at a time</li>
              <li>Read each sentence aloud clearly when you're ready</li>
              <li>Ensure your microphone is functioning properly</li>
              <li>Complete each sentence within the allotted time</li>
            </ul>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[{
                icon: FaClock,
                title: "Time per Question",
                value: "20 seconds",
                color: "bg-green-100 border-green-500"
              },
              {
                icon: FaQuestionCircle,
                title: "Total Questions",
                value: "5",
                color: "bg-yellow-100 border-yellow-500"
              },
              {
                icon: FaUsers,
                title: "Difficulty Level",
                value: "Intermediate",
                color: "bg-pink-100 border-pink-500"
              }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className={`rounded-lg shadow-md p-4 flex flex-col items-center justify-center ${item.color} border-l-4`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <item.icon className="text-indigo-600 mb-2 animate-bounce" size={24} />
                <p className="text-sm font-medium text-indigo-700">{item.title}</p>
                <p className="text-xl font-bold text-indigo-800">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="bg-white rounded-lg shadow-lg mb-6 p-6 border-l-4 border-purple-500"
            whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-purple-800 mb-4">Helpful Tips</h2>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTip}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-purple-600"
              >
                {tips[currentTip]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <div className="flex justify-between">
          <motion.button
              onClick={handleBackToDashboard}
              className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft className="mr-2 animate-spin" size={18} /> Back to Dashboard
            </motion.button>
            <motion.button
              onClick={handleStart}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center animate-pulse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Begin Assessment <FaPlay className="ml-2" size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

SpeakingFrontPage.hideNavbar = true;

export default SpeakingFrontPage;
