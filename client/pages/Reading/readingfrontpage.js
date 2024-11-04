import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaClock, FaQuestionCircle, FaArrowLeft, FaPlay, FaMagic, FaGlasses, FaLightbulb } from 'react-icons/fa';

const ReadingFrontPage = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const router = useRouter();
  const tips = [
    "Take your time to understand each sentence.",
    "Pay attention to context clues for better comprehension.",
    "Visualize the story elements to enhance engagement.",
    "Reflect on the main ideas after completing each section."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/reading/random', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const passage = await response.json();
        console.log('Fetched random passage:', passage);
        router.push(`/Reading/${passage.passage_id}`);
      } else {
        console.error('Failed to fetch a random passage', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching passage:', error);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-row min-h-screen bg-gradient-to-r from-yellow-100 via-pink-100 to-blue-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Title and Intro */}
          <motion.div 
            className="bg-white rounded-lg shadow-lg mb-8 p-8 border-l-8 border-blue-500"
            whileHover={{ boxShadow: "0 6px 8px -2px rgba(0, 0, 0, 0.2)", y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-4xl font-extrabold text-purple-700 flex items-center mb-6">
              <FaBook className="mr-3 text-yellow-400 animate-bounce" size={40} />
              Reading Fun Time!
            </h1>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed font-semibold">
              Get ready to explore an exciting passage that will make your imagination fly!
            </p>
            <h2 className="text-xl font-bold text-indigo-600 mb-4">What you'll do:</h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Read an engaging story full of adventure</li>
              <li>Find hidden clues and exciting ideas</li>
              <li>Answer fun questions about the story</li>
              <li>Beat the clock and complete the exercise!</li>
            </ul>
          </motion.div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: FaClock, title: "Time Limit", value: "15 mins", color: "text-green-500" },
              { icon: FaQuestionCircle, title: "Questions", value: "15 total", color: "text-blue-500" },
              { icon: FaGlasses, title: "Difficulty", value: "Adjustable", color: "text-pink-500" }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center border-t-4 border-blue-400"
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <item.icon className={`${item.color} mb-3 animate-spin`} size={32} />
                <p className="text-sm font-medium text-gray-500">{item.title}</p>
                <p className="text-xl font-bold text-gray-800">{item.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Tip Section */}
          <motion.div 
            className="bg-white rounded-lg shadow-lg mb-8 p-6 border-r-8 border-yellow-500"
            whileHover={{ boxShadow: "0 6px 8px -2px rgba(0, 0, 0, 0.2)", y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-blue-600 mb-4">Reading Tips</h2>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTip}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-gray-700 text-lg font-semibold"
              >
                {tips[currentTip]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Buttons */}
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
              className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Reading <FaPlay className="ml-2 animate-pulse" size={18} />
            </motion.button>
          </div>

          {/* Footer Icons */}
          <motion.div
            className="mt-12 flex justify-center space-x-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { icon: FaMagic, color: "text-purple-500", text: "Magic Words" },
              { icon: FaGlasses, color: "text-blue-500", text: "Story Detective" },
              { icon: FaLightbulb, color: "text-yellow-500", text: "Idea Master" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5, scale: 1.05 }} 
                className="text-center bg-white p-4 rounded-lg shadow-lg"
              >
                <item.icon size={32} className={`${item.color} mx-auto mb-2`} />
                <p className="text-sm font-semibold text-gray-700">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

ReadingFrontPage.hideNavbar = true;

export default ReadingFrontPage;
