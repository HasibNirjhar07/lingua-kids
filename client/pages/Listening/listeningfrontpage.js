import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeadphones, FaClock, FaQuestionCircle, FaArrowLeft, FaPlay, FaVolumeUp, FaMicrophone } from 'react-icons/fa';

const ListeningFrontPage = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const router = useRouter();
  const tips = [
    "Listen carefully and focus on the details.",
    "Note key points that might be asked in questions.",
    "Avoid distractions and stay focused on the passage.",
    "Recheck your answers if time permits."
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
        router.push(`/Listening/${passage.passage_id}`);
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
    <div className="flex flex-row min-h-screen bg-gradient-to-br from-teal-200 via-pink-200 to-purple-200">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Title and Intro */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl mb-6 p-6 border-l-4 border-pink-500"
            whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-3xl font-semibold text-purple-800 flex items-center mb-4">
              <FaHeadphones className="mr-2 text-pink-500 animate-bounce" size={28} />
              Listening Exercise
            </h1>
            <p className="text-purple-600 mb-4">
              Welcome to the listening exercise! A passage will be played, and you need to answer questions based on what you hear.
            </p>
            <h2 className="text-xl font-semibold text-pink-700 mb-2">Instructions:</h2>
            <ul className="list-disc list-inside text-purple-600 mb-4">
              <li>Click the play button to listen to the passage.</li>
              <li>Answer the questions within the given time.</li>
              <li>Ensure your volume is set appropriately for listening.</li>
              <li>Recheck your answers before submitting.</li>
            </ul>
          </motion.div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[{
                icon: FaClock,
                title: "Time Limit",
                value: "3 minutes",
                color: "bg-pink-100 border-pink-500"
              },
              {
                icon: FaQuestionCircle,
                title: "Total Questions",
                value: "10",
                color: "bg-teal-100 border-teal-500"
              },
              {
                icon: FaVolumeUp,
                title: "Audio Length",
                value: "Short",
                color: "bg-purple-100 border-purple-500"
              }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className={`rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center ${item.color} border-l-4`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <item.icon className="text-purple-600 mb-2 animate-pulse" size={24} />
                <p className="text-sm font-medium text-purple-700">{item.title}</p>
                <p className="text-xl font-bold text-purple-800">{item.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Tip Section */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl mb-6 p-6 border-l-4 border-teal-500"
            whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-teal-800 mb-4">Helpful Tips</h2>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTip}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-teal-600"
              >
                {tips[currentTip]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Buttons */}
          <div className="flex justify-between">
            <motion.button
              onClick={handleBackToDashboard}
              className="px-6 py-3 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 transition-colors flex items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft className="mr-2 animate-spin" size={18} /> Back to Dashboard
            </motion.button>
            <motion.button
              onClick={handleStart}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-2xl hover:from-teal-600 hover:to-purple-600 transition-colors flex items-center animate-bounce"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Begin Exercise <FaPlay className="ml-2" size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

ListeningFrontPage.hideNavbar = true;

export default ListeningFrontPage;
