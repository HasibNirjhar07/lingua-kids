import React, { useState, useEffect } from 'react';
import { FaApple, FaStar, FaSearch, FaRocket, FaTree, FaBook, FaPencilAlt, FaGraduationCap } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const typewriterTexts = [
  "Learn and Have Fun!",
  "Explore New Worlds!",
  "Make New Friends!",
];

export default function WelcomeBackPage() {
  const router = useRouter();
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      const currentString = typewriterTexts[textIndex];
      if (letterIndex < currentString.length) {
        setCurrentText((prev) => prev + currentString.charAt(letterIndex));
        setLetterIndex(letterIndex + 1);
      } else {
        setTimeout(() => {
          setCurrentText('');
          setLetterIndex(0);
          setTextIndex((prev) => (prev + 1) % typewriterTexts.length);
        }, 2000);
      }
    }, 100);

    return () => clearTimeout(typingTimeout);
  }, [letterIndex, textIndex]);

  const handleRegisterClick = () => {
    router.push('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-green-400 to-blue-500 text-indigo-900 overflow-hidden font-comic">
      {/* Navbar */}
  

      {/* Main content */}
      <main className="container mx-auto px-6 pt-20 pb-12 flex flex-col md:flex-row justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:w-1/2 mb-12 md:mb-0"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 text-6xl h-20 text-indigo-900 font-bold" // Increased height
          >
            {currentText}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold mb-4 text-indigo-900"
          >
            Welcome Back To School!
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-6 text-indigo-800"
          >
            2023 Adventurers
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRegisterClick}
            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition duration-300 flex items-center"
          >
            <FaRocket className="mr-2" />
            Start Your Adventure!
          </motion.button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:w-1/2 relative"
        >
          <motion.img
            src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjZzbGtnZ3ozd2NiZHhreHJ6b24yMjViNjN2ajl1a21jeGdzMXVoaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Ia6pcGj7fhE1Is3OFM/giphy.webp"
            alt="Happy Students"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            
          />
        </motion.div>
      </main>

      {/* Footer Icons */}
      <div className="absolute bottom-6 right-6 flex space-x-4">
        {[FaStar, FaApple, FaPencilAlt].map((Icon, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Icon className="text-indigo-900 text-4xl" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
        .font-comic {
          font-family: 'Comic Neue', cursive;
        }
      `}</style>
    </div>
  );
}