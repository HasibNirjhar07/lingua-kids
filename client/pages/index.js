import React, { useState, useEffect } from 'react';
import { FaApple, FaStar, FaRocket, FaTree, FaBook, FaPencilAlt, FaGraduationCap } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const typewriterTexts = [
  "Learn and Have Fun!",
  "Improve Your English Skills!",
  "Engage with Interactive Exercises!",
];

const features = [
  { icon: <FaPencilAlt />, title: "Speaking Practice", description: "Describe scenarios and receive instant feedback." },
  { icon: <FaBook />, title: "Listening Comprehension", description: "Engaging audio content with interactive tasks." },
  { icon: <FaTree />, title: "Reading Engagement", description: "Colorful stories that captivate and educate." },
  { icon: <FaGraduationCap />, title: "Writing Improvement", description: "Real-time grammar suggestions and corrections." },
];

const testimonials = [
  { name: "Emily", feedback: "IELTSPlay makes learning fun and exciting!" },
  { name: "Michael", feedback: "I improved my English so much with this app!" },
  { name: "Sophia", feedback: "The interactive exercises are awesome!" },
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
            className="mb-8 text-5xl h-20 text-indigo-900 font-bold text-center"
          >
            {currentText}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-4 text-indigo-900 text-center"
          >
            Welcome to LinguaKids!
          </motion.h1>
       
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRegisterClick}
            className="bg-indigo-600 text-white font-bold py-3 px-8 mt-10 rounded-full hover:bg-indigo-700 transition duration-300 flex items-center mx-auto"
          >
            <FaRocket className="mr-2 " />
            Start Your Learning Adventure!
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
            className="mx-auto"
          />
          <div className="absolute right-6 flex space-x-4 mb-0">
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
                  className="text-5xl text-indigo-600"
                >
                  <Icon />
                </motion.div>
              </motion.div>
            ))}
          </div>

          
        </motion.div>
      </main>
      

      {/* Features Section */}
      <section id="features" className="bg-indigo-100 py-12">
        
        <div className="container mx-auto text-center">
          
          <h2 className="text-4xl font-bold mb-6 text-indigo-900">App Features</h2>
          
          <div className="flex flex-wrap justify-center">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="w-full md:w-1/4 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-indigo-600 text-5xl mb-4 text-center">{feature.icon}</div>
                  <h3 className="text-2xl font-semibold text-indigo-900 text-center">{feature.title}</h3>
                  <p className="text-indigo-800 text-center">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-gradient-to-br from-yellow-300 via-green-400 to-blue-500 text-white py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">What Our Learners Say</h2>
          <div className="flex flex-wrap justify-center">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="w-full md:w-1/3 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <blockquote className="border-l-4 border-white pl-4 mb-6 text-left">
                  <p className="italic">"{testimonial.feedback}"</p>
                  <footer className="mt-2 font-semibold">{testimonial.name}</footer>
                </blockquote>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Facts Section */}
      <section id="fun-facts" className="bg-indigo-100 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-indigo-900">Fun Facts</h2>
          <ul className="list-disc list-inside text-indigo-900 mx-auto max-w-md">
            <li>Engaging exercises that make learning enjoyable!</li>
            <li>Track your progress and see your improvement!</li>
            <li>Interactive audio-visual materials for every skill!</li>
          </ul>
        </div>
      </section>

      {/* Footer Icons */}

    </div>
  );
}
