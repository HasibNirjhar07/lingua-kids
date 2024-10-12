import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/router';

const ReadingManualPage = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const router = useRouter();

  const handleStart = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      const response = await fetch('http://localhost:3000/reading/random', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const passage = await response.json();
        // Navigate to the reading page with the fetched passage id
        router.push(`/Reading/${passage.id}`); // Assuming passage has an id property
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
    <div className="flex min-h-screen bg-purple-600">
      <Sidebar />
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg"
        >
          <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
            Reading Adventure Time!
          </h1>
          {showInstructions ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-purple-500 mb-4">
                Here's Your Mission:
              </h2>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start">
                  <span className="text-2xl mr-2">📚</span>
                  <span>You'll get a super cool story to read!</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-2">🌟</span>
                  <span>Some tricky words will be in yellow to help you out.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-2">❓</span>
                  <span>After reading, you'll answer 15 fun questions about the story.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-2">⏱️</span>
                  <span>It's a race against time! Finish everything before the clock runs out.</span>
                </li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-purple-500 text-white font-bold py-3 px-4 rounded-full hover:bg-purple-600 transition duration-300"
                onClick={handleStart}
              >
                Start Your Adventure!
              </motion.button>
              {/* Back to Dashboard Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 w-full bg-gray-500 text-white font-bold py-3 px-4 rounded-full hover:bg-gray-600 transition duration-300"
                onClick={handleBackToDashboard}
              >
                Back to Dashboard
              </motion.button>
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
};

ReadingManualPage.hideNavbar = true;

export default ReadingManualPage;
