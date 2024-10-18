import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaClock, FaQuestionCircle, FaArrowLeft, FaPlay, FaVolumeUp, FaBookOpen, FaSmile } from 'react-icons/fa';

const SpeakingFrontPage = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const router = useRouter();
  const tips = [
    "Speak clearly and confidently!",
    "Take deep breaths to stay calm.",
    "Listen carefully to the questions.",
    "Have fun and do your best!"
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
    <div className="flex flex-row min-h-screen bg-gradient-to-br from-blue-400 to-green-500">
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
            className="text-4xl font-bold text-indigo-600 mb-6 flex items-center justify-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FaMicrophone className="mr-2 text-yellow-500" size={36} />
            Let's Speak!
          </motion.h1>

          <motion.p
            className="text-gray-600 mb-8 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Get ready to read fun sentences out loud! 🎉
          </motion.p>

          <motion.div
            className="bg-blue-100 p-4 rounded-xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-2">How to Play:</h2>
            <ul className="text-left text-blue-600 list-disc list-inside">
              <li>You'll see a sentence on the screen</li>
              <li>Read it out loud when you're ready</li>
              <li>Speak clearly into your microphone</li>
              <li>Try to finish before the timer runs out</li>
            </ul>
          </motion.div>

          <div className="flex justify-center space-x-12 mb-8">
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
            >
              <p className="text-sm text-indigo-500 font-semibold">TIME PER QUESTION</p>
              <div className="flex items-center justify-center text-2xl font-bold text-indigo-700">
                <FaClock className="mr-2 text-green-500" />
                20 seconds
              </div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
            >
              <p className="text-sm text-indigo-500 font-semibold">QUESTIONS</p>
              <div className="flex items-center justify-center text-2xl font-bold text-indigo-700">
                <FaQuestionCircle className="mr-2 text-pink-500" />
                5
              </div>
            </motion.div>
          </div>

          <motion.div
            className="bg-yellow-100 p-4 rounded-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <h3 className="text-lg font-semibold text-yellow-700 mb-2">Helpful Tips:</h3>
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
              <FaArrowLeft className="mr-2" /> Go Back
            </motion.button>
            <motion.button
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-8 rounded-full transition flex items-center"
              onClick={handleStart}
              whileHover={{ scale: 1.05, boxShadow: '0px 0px 8px rgb(59, 130, 246)' }}
              whileTap={{ scale: 0.95 }}
            >
              Start <FaPlay className="ml-2" />
            </motion.button>
          </div>

          <motion.div
            className="mt-8 flex justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <FaVolumeUp size={24} className="text-blue-500 mx-auto" />
              <p className="text-sm text-gray-600">Clear Audio</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <FaBookOpen size={24} className="text-green-500 mx-auto" />
              <p className="text-sm text-gray-600">Fun Sentences</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <FaSmile size={24} className="text-yellow-500 mx-auto" />
              <p className="text-sm text-gray-600">Enjoy Learning</p>
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

SpeakingFrontPage.hideNavbar = true;


export default SpeakingFrontPage;
