import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPen, FaClock, FaQuestionCircle, FaArrowLeft, FaPlay } from 'react-icons/fa';

const WritingFrontPage = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const router = useRouter();
  const tips = [
    "Plan your thoughts briefly before you start writing.",
    "Focus on clarity and coherence in your sentences.",
    "Keep your sentences grammatically correct and on topic.",
    "Manage your time wisely to complete your response within 3 minutes."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    router.push('/Writing/response');
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-row min-h-screen bg-gradient-to-br from-pink-300 via-white to-green-300">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg mb-6 p-6 border-l-8 border-rainbow"
            style={{
              borderImage: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
              borderImageSlice: 1
            }}
            whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-3xl font-semibold text-purple-800 flex items-center mb-4">
              <FaPen className="mr-2 text-orange-500 animate-pulse" size={28} />
              Writing Assessment
            </h1>
            <p className="text-green-700 mb-4">
              Welcome to the writing assessment! You will be given a prompt such as a word, picture, or question. Write at least 5-10 sentences about it within 3 minutes. This exercise evaluates your coherence, grammar, and creativity.
            </p>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Instructions:</h2>
            <ul className="list-disc list-inside text-red-600 mb-4">
              <li>You will see a word, picture, or question as a prompt.</li>
              <li>Write at least 5-10 sentences within 3 minutes.</li>
              <li>Focus on clarity, grammar, and staying on topic.</li>
              <li>Submit your response before the timer ends.</li>
            </ul>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[{
                icon: FaClock,
                title: "Time Limit",
                value: "3 minutes",
                color: "bg-white border-red-500"
              },
              {
                icon: FaQuestionCircle,
                title: "Prompt Type",
                value: "Word, Picture, or Question",
                color: "bg-white border-yellow-500"
              },
              {
                icon: FaPen,
                title: "Response Length",
                value: "5-10 sentences",
                color: "bg-white border-green-500"
              }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className={`rounded-lg shadow-md p-4 flex flex-col items-center justify-center ${item.color} border-l-4`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <item.icon className="text-purple-600 mb-2 animate-bounce" size={24} />
                <p className="text-sm font-medium text-blue-700">{item.title}</p>
                <p className="text-xl font-bold text-orange-800">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="bg-white rounded-lg shadow-lg mb-6 p-6 border-l-8 border-rainbow"
            style={{
              borderImage: 'linear-gradient(to right, green, blue, purple)',
              borderImageSlice: 1
            }}
            whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-pink-800 mb-4">Helpful Tips</h2>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTip}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-blue-600"
              >
                {tips[currentTip]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <div className="flex justify-between">
            <motion.button
              onClick={handleBackToDashboard}
              className="px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors flex items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft className="mr-2 animate-spin" size={18} /> Back to Dashboard
            </motion.button>
            <motion.button
              onClick={handleStart}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-md hover:from-green-600 hover:to-blue-600 transition-colors flex items-center animate-pulse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Writing <FaPlay className="ml-2" size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

WritingFrontPage.hideNavbar = true;

export default WritingFrontPage;