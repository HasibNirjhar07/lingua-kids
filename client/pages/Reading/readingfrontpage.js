import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaRocket, FaClock, FaQuestionCircle, FaArrowLeft, FaPlay, FaMagic, FaGlasses, FaLightbulb } from 'react-icons/fa';

const ReadingManualPage = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const router = useRouter();
  const tips = [
    "Take your time to understand each sentence!",
    "Look out for glowing words - they're important!",
    "Try to visualize the story in your mind.",
    "Have fun and enjoy the adventure!"
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
        router.push(`/Reading/${passage.id}`);
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
    <div className="flex flex-row min-h-screen bg-gradient-to-br from-purple-400 to-pink-500">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-3xl p-8 max-w-3xl mx-auto text-center relative overflow-hidden"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-2 bg-rainbow-gradient"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          <motion.h1
            className="text-4xl font-bold text-purple-600 mb-6 flex items-center justify-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FaBook className="mr-2 text-yellow-500" size={36} />
            Reading Adventure Time!
          </motion.h1>

          <motion.p
            className="text-gray-600 mb-8 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Embark on an epic journey through a fantastical story! 🚀
          </motion.p>

          <motion.div
            className="bg-purple-100 p-4 rounded-xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-purple-700 mb-2">How to Play:</h2>
            <ul className="text-left text-purple-600 list-disc list-inside">
              <li>Read through an exciting passage</li>
              <li>Watch for glowing words - they're magical clues!</li>
              <li>Answer questions about your adventure</li>
              <li>Complete the quest before time runs out</li>
            </ul>
          </motion.div>

          <div className="flex justify-center space-x-12 mb-8">
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
            >
              <p className="text-sm text-purple-500 font-semibold">TIME FOR QUEST</p>
              <div className="flex items-center justify-center text-2xl font-bold text-purple-700">
                <FaClock className="mr-2 text-green-500" />
                15 minutes
              </div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
            >
              <p className="text-sm text-purple-500 font-semibold">CHALLENGES</p>
              <div className="flex items-center justify-center text-2xl font-bold text-purple-700">
                <FaQuestionCircle className="mr-2 text-pink-500" />
                15
              </div>
            </motion.div>
          </div>

          <motion.div
            className="bg-yellow-100 p-4 rounded-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <h3 className="text-lg font-semibold text-yellow-700 mb-2">Magical Tips:</h3>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTip}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-yellow-600"
              >
                {tips[currentTip]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <div className="flex justify-between w-full mt-6">
            <motion.button
              className="bg-gray-200 text-gray-700 py-3 px-6 rounded-full hover:bg-gray-300 transition flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackToDashboard}
            >
              <FaArrowLeft className="mr-2" /> Return to Quest Hub
            </motion.button>
            <motion.button
              className="bg-gradient-to-r from-purple-400 to-pink-500 text-white py-3 px-8 rounded-full transition flex items-center"
              onClick={handleStart}
              whileHover={{ scale: 1.05, boxShadow: '0px 0px 8px rgb(168, 85, 247)' }}
              whileTap={{ scale: 0.95 }}
            >
              Start Adventure <FaPlay className="ml-2" />
            </motion.button>
          </div>

          <motion.div
            className="mt-8 flex justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <FaMagic size={24} className="text-purple-500 mx-auto" />
              <p className="text-sm text-gray-600">Magical Words</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <FaGlasses size={24} className="text-blue-500 mx-auto" />
              <p className="text-sm text-gray-600">Engaging Stories</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <FaLightbulb size={24} className="text-yellow-500 mx-auto" />
              <p className="text-sm text-gray-600">Boost Comprehension</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        .bg-rainbow-gradient {
          background: linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff);
        }
      `}</style>
    </div>
  );
};

ReadingManualPage.hideNavbar = true;

export default ReadingManualPage;