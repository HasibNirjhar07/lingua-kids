import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Timer from '../../components/timer';
import { FaPaperPlane, FaTimes, FaPenNib, FaRocket, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../components/Modal';
import axios from 'axios';
import confetti from 'canvas-confetti';

const WritingPage = () => {
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [timerDuration, setTimerDuration] = useState(180);
  const textareaRef = useRef(null);

  const handleTextareaHover = () => {
    if (textareaRef.current) {
      textareaRef.current.style.transform = 'scale(1.02)';
      textareaRef.current.style.transition = 'transform 0.3s ease';
    }
  };

  const handleTextareaBlur = () => {
    if (textareaRef.current) {
      textareaRef.current.style.transform = 'scale(1)';
    }
  };

  const handleSubmit = async () => {
    if (answer.trim().length > 0) {
      try {
        // Analyze user writing
        const response = await axios .post('/analyze', { text: answer });
        const scores = response.data.scores;

        // Calculate cumulative score
        const cumulativeScore = calculateCumulativeScore(scores);

        // Submit writing score
        await axios.post('/submit', { promptId: 'somePromptId', score: cumulativeScore }); // Replace 'somePromptId' with the actual prompt ID

        setEvaluationResult({ scores, cumulativeScore });
        setShowModal(true);

        // Celebrate with confetti
        confetti({
          particleCount: 300,
          spread: 120,
          origin: { y: 0.6 },
          colors: ['#ff6b6b', '#4ecdc4', '#feca57', '#ff9ff3', '#54a0ff', '#48dbfb'],
          shapes: ['star', 'circle'],
        });
      } catch (error) {
        console.error('Error analyzing text or submitting score:', error);
        alert('Something went wrong! Please try again.');
      }
    } else {
      alert('Oops! Write your amazing story first! 📝');
    }
  };

  const handleQuit = () => {
    const confirmQuit = window.confirm('Are you sure you want to quit your writing adventure? 🚀');
    if (confirmQuit) {
      router.push('/dashboard');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div className="absolute top-10 left-10 text-yellow-300" animate={{ rotate: [0, 360], scale: [0.7, 1, 0.7] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
          <FaStar size={40} />
        </motion.div>
        <motion.div className="absolute bottom-20 right-20 text-blue-300" animate={{ rotate: [0, -360], scale: [0.7, 1, 0.7] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}>
          <FaRocket size={50} />
        </motion.div>
      </div>

      <div className="max-w-4xl w-full space-y-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          className="bg-white shadow-2xl rounded-xl overflow-hidden border-4 border-indigo-200"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <motion.h1
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 flex items-center"
              >
                <FaPenNib className="mr-3 text-indigo-500 animate-bounce" /> Writing Adventure
              </motion.h1>
              <Timer
                duration={timerDuration}
                onTimeUp={() => handleSubmit()}
                isRunning={true}
              />
            </div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-indigo-500 p-4 mb-6"
            >
              <h2 className="text-xl font-semibold text-indigo-800 mb-2">
                Writing Prompt
              </h2>
              <p className="text-gray-700">
                "Describe a memorable journey you have had and explain why it was special to you."
              </p>
            </motion.div>

            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onMouseEnter={handleTextareaHover}
              onMouseLeave={handleTextareaBlur}
              onFocus={handleTextareaHover}
              on Blur={handleTextareaBlur}
              className="w-full min-h-[300px] p-4 border-2 border-dashed border-purple-200 rounded-lg 
              focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
              transition duration-200 bg-blue-50 hover:shadow-lg
              placeholder-purple-300"
              placeholder="Start your epic story here... 🚀✨"
            />

            <div className="flex justify-between items-center mt-6">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleQuit}
                className="text-purple-600 hover:text-purple-800 flex items-center 
                bg-purple-100 rounded-lg px-4 py-2 hover:bg-purple-200 transition"
              >
                <FaTimes className="mr-2" /> Exit Adventure
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 
                transition duration-300 flex items-center shadow-md group"
              >
                <FaPaperPlane className="mr-2 group-hover:animate-ping" /> Launch Story
              </motion.button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showModal && (
            <Modal isOpen={showModal} onClose={handleCloseModal}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-gradient-to-br from-indigo-300 to-purple-400 
                rounded-xl shadow-2xl p-8 max-w-md mx-auto text-center"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Evaluation Results 🎉
                  </h2>
                  {evaluationResult ? (
                    <>
                      <ul className="text-white text-left mb-4">
                        {evaluationResult.scores.map((score, index) => (
                          <li key={index}>
                            <strong>{score.label}:</strong> {score.score}
                          </li>
                        ))}
                      </ul>
                      <p className="text-lg text-white font-bold">
                        Cumulative Score: {evaluationResult.cumulativeScore} / 100
                      </p>
                    </>
                  ) : (
                    <p>Loading results...</p>
                  )}
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-full py-3 bg-white text-purple-600 
                  rounded-lg hover:bg-gray-100 transition duration-300"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

WritingPage.hideNavbar = true;

export default WritingPage;