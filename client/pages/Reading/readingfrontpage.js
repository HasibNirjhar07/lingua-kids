import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/router';
import { FaBook, FaRocket, FaClock, FaQuestionCircle, FaArrowLeft } from 'react-icons/fa';

const ReadingManualPage = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const router = useRouter();

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
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-6 md:p-6 max-w-4xl mx-auto shadow-2xl"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4 text-center">
            <FaBook className="inline-block mr-2 text-yellow-500" />
            Reading Adventure Time!
          </h1>
          {showInstructions && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg md:text-xl font-semibold text-purple-500 mb-4">
                Your Magical Quest Awaits!
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <motion.li 
                  className="flex items-start bg-yellow-100 p-3 md:p-4 rounded-xl shadow-md"
                  whileHover={{ scale: 1.03 }}
                >
                  <FaBook className="text-2xl md:text-3xl mr-2 md:mr-4 text-purple-500 flex-shrink-0" />
                  <span className="text-sm md:text-lg">Embark on an epic journey through a fantastical story!</span>
                </motion.li>
                <motion.li 
                  className="flex items-start bg-green-100 p-3 md:p-4 rounded-xl shadow-md"
                  whileHover={{ scale: 1.03 }}
                >
                  <FaRocket className="text-2xl md:text-3xl mr-2 md:mr-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm md:text-lg">Special words will glow like magic stars to guide you!</span>
                </motion.li>
                <motion.li 
                  className="flex items-start bg-blue-100 p-3 md:p-4 rounded-xl shadow-md"
                  whileHover={{ scale: 1.03 }}
                >
                  <FaQuestionCircle className="text-2xl md:text-3xl mr-2 md:mr-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm md:text-lg">Conquer 15 thrilling challenges about your adventure!</span>
                </motion.li>
                <motion.li 
                  className="flex items-start bg-red-100 p-3 md:p-4 rounded-xl shadow-md"
                  whileHover={{ scale: 1.03 }}
                >
                  <FaClock className="text-2xl md:text-3xl mr-2 md:mr-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm md:text-lg">Race against the mystical clock to save the day!</span>
                </motion.li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 md:mt-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 md:py-4 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transition duration-300 text-base md:text-lg shadow-lg flex items-center justify-center"
                  onClick={handleStart}
                >
                  <FaRocket className="mr-2" />
                  Blast Off to Adventure!
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold py-3 md:py-4 px-6 rounded-full hover:from-gray-500 hover:to-gray-600 transition duration-300 shadow-md flex items-center justify-center"
                  onClick={handleBackToDashboard}
                >
                  <FaArrowLeft className="mr-2" />
                  Return to Your Quest Hub
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

ReadingManualPage.hideNavbar = true;

export default ReadingManualPage;
