import React, { useState, useEffect } from 'react';
import { FaApple, FaStar, FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const typewriterTexts = [
  "Start Learning Today!",
  "Grow with Knowledge",
  "Achieve Your Dreams",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-700 text-white overflow-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-4 flex justify-between items-center"
      >
        <motion.div whileHover={{ scale: 1.1 }} className="text-2xl font-bold">
          LinguaKids
        </motion.div>
        <div className="hidden md:flex space-x-8">
          {['Home', 'Join us', 'Our service', 'Contact us'].map((item, index) => (
            <motion.a
              key={item}
              href="#"
              className="hover:text-indigo-200"
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {item}
            </motion.a>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Search"
            className="bg-indigo-400/50 rounded-full py-2 px-4 pr-10 w-64 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <FaSearch className="absolute right-3 top-3 text-white/70" />
        </motion.div>
      </motion.nav>

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
            className="mb-8 text-6xl h-8" // Set a fixed height
          >
            {currentText}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold mb-4"
          >
            Welcome Back To School!
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-6"
          >
            2023 Students
          </motion.h2>
          {/* Typewriter effect in a separate div */}
         
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRegisterClick}
            className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-full hover:bg-yellow-600 transition duration-300"
          >
            Register Now
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
            alt="Students"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </main>

      {/* Footer Icon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-6 right-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <FaStar className="text-yellow-300 text-5xl" />
        </motion.div>
      </motion.div>
    </div>
  );
}
