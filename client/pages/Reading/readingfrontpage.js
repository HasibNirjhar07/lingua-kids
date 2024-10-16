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
    <div className="flex min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Sidebar />
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        >
          <h1 className="text-4xl font-bold text-purple-600 mb-6 text-center">
            <FaBook className="inline-block mr-2 text-yellow-500" />
            Reading Adventure Time!
          </h1>
          {showInstructions && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-purple-500 mb-4">
                Your Magical Quest Awaits!
              </h2>
              <ul className="space-y-6 mb-8">
                <motion.li 
                  className="flex items-start bg-yellow-100 p-4 rounded-xl shadow-md"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaBook className="text-3xl mr-4 text-purple-500" />
                  <span className="text-lg">Embark on an epic journey through a fantastical story!</span>
                </motion.li>
                <motion.li 
                  className="flex items-start bg-green-100 p-4 rounded-xl shadow-md"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaRocket className="text-3xl mr-4 text-blue-500" />
                  <span className="text-lg">Special words will glow like magic stars to guide you!</span>
                </motion.li>
                <motion.li 
                  className="flex items-start bg-blue-100 p-4 rounded-xl shadow-md"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaQuestionCircle className="text-3xl mr-4 text-green-500" />
                  <span className="text-lg">Conquer 15 thrilling challenges about your adventure!</span>
                </motion.li>
                <motion.li 
                  className="flex items-start bg-red-100 p-4 rounded-xl shadow-md"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaClock className="text-3xl mr-4 text-red-500" />
                  <span className="text-lg">Race against the mystical clock to save the day!</span>
                </motion.li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transition duration-300 text-xl shadow-lg"
                onClick={handleStart}
              >
                <FaRocket className="inline-block mr-2" />
                Blast Off to Adventure!
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold py-3 px-4 rounded-full hover:from-gray-500 hover:to-gray-600 transition duration-300 shadow-md"
                onClick={handleBackToDashboard}
              >
                <FaArrowLeft className="inline-block mr-2" />
                Return to Your Quest Hub
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

ReadingManualPage.hideNavbar = true;

export default ReadingManualPage;
