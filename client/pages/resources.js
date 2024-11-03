import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBookOpen, FaGamepad, FaPuzzlePiece, FaLanguage, 
  FaMusic, FaVideo, FaStar, FaTrophy, FaHeadphones,
  FaGlobeEurope, FaHeart, FaRocket 
} from 'react-icons/fa';

import Sidebar from '@/components/Sidebar';

const EnglishLearningPlatform = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentTip, setCurrentTip] = useState(0);

  // Function to pronounce a word
  const pronounceWord = (word) => {
    // Check if Text-to-Speech is supported
    if ('speechSynthesis' in window) {
      // Create a new speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(word);
      
      // Optional: Set specific speech properties
      utterance.lang = 'en-US';  // Set language to US English
      utterance.pitch = 1;        // 0 to 2, default is 1
      utterance.rate = 0.8;       // 0.1 to 10, default is 1

      // Speak the word
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-Speech is not supported in this browser.');
    }
  };

  const learningLevels = [
    {
      id: 'beginner',
      name: 'Beginner English',
      color: 'bg-blue-100',
      resources: [
        { 
          name: 'Alphabet Adventure', 
          type: 'reading',
          passages: [
            "A is for Apple, round and red. B is for Ball that bounces on my head.",
            "Hello! My name is Sam. I like to play with my dog Max.",
            "The sun is bright. The sky is blue. I love to play and learn something new!"
          ],
          pronunciation: [
            { word: 'Hello', phonetic: 'həˈloʊ' },
            { word: 'Apple', phonetic: 'ˈæp.əl' },
            { word: 'Dog', phonetic: 'dɔːɡ' }
          ]
        },
        { 
          name: 'Animal Friends', 
          type: 'listening',
          passages: [
            "I see a cat. The cat is white. It likes to play all day and night.",
            "My friend has a big dog. The dog can run and jump very high.",
            "Elephants are big and gray. They live far away where they play."
          ],
          pronunciation: [
            { word: 'Cat', phonetic: 'kæt' },
            { word: 'Dog', phonetic: 'dɔːɡ' },
            { word: 'Elephant', phonetic: 'ˈel.ɪ.fənt' }
          ]
        }
      ]
    },
    {
      id: 'intermediate',
      name: 'Intermediate English',
      color: 'bg-green-100',
      resources: [
        { 
          name: 'Story Time', 
          type: 'reading',
          passages: [
            "Once upon a time, there was a brave little girl who loved to explore. She had a magical backpack that could take her anywhere in the world.",
            "Jack and Emma were best friends. They loved solving puzzles and going on small adventures in their neighborhood.",
            "The old lighthouse stood tall on the rocky coast. Sailors used its bright light to find their way home."
          ],
          pronunciation: [
            { word: 'Adventure', phonetic: 'ədˈven.tʃər' },
            { word: 'Lighthouse', phonetic: 'ˈlaɪt.haʊs' },
            { word: 'Explore', phonetic: 'ɪkˈsplɔːr' }
          ]
        },
        { 
          name: 'Fun with Science', 
          type: 'listening',
          passages: [
            "Plants need sunlight and water to grow. They make their own food through a process called photosynthesis.",
            "The solar system is full of amazing planets. Earth is the only planet we know that has life.",
            "Volcanoes are like mountains that can shoot hot lava from their tops. They are powerful and exciting!"
          ],
          pronunciation: [
            { word: 'Photosynthesis', phonetic: 'foʊ.toʊˈsɪn.θə.sɪs' },
            { word: 'Volcano', phonetic: 'vɒlˈkeɪ.noʊ' },
            { word: 'Planet', phonetic: 'ˈplæn.ɪt' }
          ]
        }
      ]
    }
  ];

  const learningTips = [
    "Every word you learn is a new adventure!",
    "Practice makes perfect - have fun learning English!",
    "English is a superpower you can develop!",
    "Explore new worlds through language!",
    "Be brave and don't be afraid to make mistakes!"
  ];

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % learningTips.length);
    }, 5000);
    return () => clearInterval(tipTimer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-white to-blue-50">
      
      {/* Sidebar */}
      <div className="w-full lg:w-1/5">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full lg:w-4/5 bg-white rounded-none lg:rounded-3xl shadow-lg lg:shadow-2xl overflow-hidden"
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center">
            <FaRocket className="mr-4 text-yellow-300" />
            Kids English Learning Adventure
            <FaHeart className="ml-4 text-red-300" />
          </h1>
          <p className="text-xl">Learn, Play, and Master English!</p>
        </div>

        {/* Learning Tip Carousel */}
        <div className="bg-yellow-100 p-4 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTip}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-yellow-800 font-semibold"
            >
              🌈 Magic Learning Tip: {learningTips[currentTip]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Level Selection Grid */}
        <div className="p-6 grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {learningLevels.map((level) => (
            <motion.div 
              key={level.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedLevel(level)}
              className={`cursor-pointer ${level.color} p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-center`}
            >
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-2">{level.name}</h3>
              <p className="text-gray-600">Start Your English Journey!</p>
            </motion.div>
          ))}
        </div>

        {/* Selected Level Details */}
        {selectedLevel && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gray-50"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">
              📖 {selectedLevel.name} Resources
            </h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
              {selectedLevel.resources.map((resource) => (
                <motion.div
                  key={resource.name}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-2xl shadow-md"
                >
                  <h4 className="text-2xl font-semibold mb-4 text-center">{resource.name}</h4>
                  
                  <div className="mb-4">
                    <h5 className="text-xl font-bold mb-2">Reading Passages</h5>
                    {resource.passages.map((passage, index) => (
                      <p key={index} className="mb-2 text-gray-700 bg-gray-100 p-3 rounded">
                        {passage}
                      </p>
                    ))}
                  </div>

                  <div>
                    <h5 className="text-xl font-bold mb-2">Pronunciation Practice</h5>
                    {resource.pronunciation.map((item, index) => (
                      <div 
                        key={index} 
                        onClick={() => pronounceWord(item.word)}
                        className="flex justify-between items-center bg-blue-50 p-2 rounded mb-2 cursor-pointer hover:bg-blue-100 transition"
                      >
                        <span className="font-semibold">{item.word}</span>
                        <div className="flex items-center">
                          <span className="text-gray-600 italic mr-2">{item.phonetic}</span>
                          <FaHeadphones className="text-blue-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Additional Learning Section */}
        <div className="bg-green-50 p-8 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <FaGlobeEurope className="mr-3 text-green-600" /> English Learning Tips
            </h3>
            <ul className="space-y-2">
              <li>🎬 Watch English cartoons with subtitles</li>
              <li>🎵 Sing along to English children's songs</li>
              <li>📚 Read simple English storybooks</li>
              <li>🗣️ Practice speaking with family and friends</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <FaPuzzlePiece className="mr-3 text-blue-600" /> Fun Learning Games
            </h3>
            <ul className="space-y-2">
              <li>🧩 Word matching games</li>
              <li>🎲 Alphabet bingo</li>
              <li>🏆 Simple spelling quizzes</li>
              <li>🔤 Letter tracing activities</li>
            </ul>
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="bg-blue-100 p-6 text-center">
          <p className="text-2xl font-bold text-blue-800">
            🚀 Your English Adventure Begins Now! 🌈
          </p>
          <p className="mt-2 text-blue-600">
            Learn English, Dream Big, Explore Endlessly!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

EnglishLearningPlatform.hideNavbar = true;


export default EnglishLearningPlatform;