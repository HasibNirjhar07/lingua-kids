import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Timer from '../../components/timer';
import { FaMicrophone, FaStopCircle, FaPlayCircle, FaPaperPlane, FaTimes, FaStar, FaCloud, FaRocket } from 'react-icons/fa';
import Modal from '../../components/Modal';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';

const RecordPage = () => {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timerDuration, setTimerDuration] = useState(60); // 60 seconds
  const [text, setText] = useState('');
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    setIsRecording(false);
    setRecordedAudio(null);
  }, []);

  const handleStartRecording = () => {
    setIsRecording(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      console.log(transcript);
      console.log('event', event);
    }

    recognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
      setIsRecording(false); // Reset recording state
    }

    recognitionRef.current = recognition;
    recognition.start();

    // Start audio recording using MediaRecorder
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedAudio(event.data);
        }
      };
      mediaRecorder.start();
    });

    recognition.onend = () => {
      handleStopRecording();
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop the MediaRecorder
    }
  };

  const handlePlayRecording = () => {
    if (recordedAudio) {
      const audioUrl = URL.createObjectURL(recordedAudio);
      const audio = new Audio(audioUrl);
      audio.play();
    }
    
    return (
      <div>
        <h1>Record Page</h1>
        <p>{text}</p>
        <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
          {isRecording ? <FaStopCircle /> : <FaMicrophone />} {isRecording ? 'Stop' : 'Start'} Recording
        </button>
        {recordedAudio && <button onClick={handlePlayRecording}><FaPlayCircle /> Play Recording</button>}
      </div>
    );
  };

  const handleSubmit = () => {
    setShowModal(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleQuit = () => {
    router.push('/dashboard');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 relative overflow-hidden">
      {/* Sidebar */}
      {/* <Sidebar className="w-64 h-screen bg-gray-800 text-white p-4" /> */}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        {/* Static background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Stars */}
          {[...Array(30)].map((_, i) => (
            <FaStar key={`star-${i}`} className="text-yellow-300 absolute animate-twinkle" style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }} />
          ))}
          {/* Clouds */}
          {[...Array(8)].map((_, i) => (
            <FaCloud key={`cloud-${i}`} className="text-white absolute animate-float" style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 70 + 30}px`,
            }} />
          ))}
          <FaRocket className="text-red-500 absolute animate-rocket" style={{ fontSize: '60px', left: '80%', top: '10%' }} />
        </div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-8 relative z-10"
        >
          <motion.h1 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-4xl font-bold text-purple-600 mb-6 flex items-center justify-center"
          >
            <FaMicrophone className="mr-2 text-yellow-500" />
            Speak Like a Star!
          </motion.h1>

          <div className="mb-6">
            <Timer duration={timerDuration} onTimeUp={() => setIsRecording(false)} isRunning={isRecording} />
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl border-4 border-yellow-300 shadow-inner p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold text-purple-700 mb-4 text-center">
              Can you say this super cool sentence?
            </h2>
            <motion.p 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2 }}
              className="text-xl text-blue-700 text-center font-medium"
            >
              "Math is like a magical adventure with numbers and puzzles!" <br />
              Spoken Text: {text}
            </motion.p>
          </motion.div>

          <div className="flex justify-center space-x-4 mb-8">
            <AnimatePresence>
              {!isRecording && !recordedAudio && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleStartRecording}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-full text-xl font-bold flex items-center shadow-lg"
                >
                  <FaMicrophone className="mr-2" onClick = {handleStartRecording}/> Start Your Magic!
                </motion.button>
              )}
              {isRecording && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleStopRecording}
                  className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold flex items-center shadow-lg"
                >
                  <FaStopCircle className="mr-2" /> Finish Your Spell!
                </motion.button>
              )}
              {recordedAudio && (
                <>
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePlayRecording}
                    className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-8 py-4 rounded-full text-xl font-bold flex items-center shadow-lg"
                  >
                    <FaPlayCircle className="mr-2" /> Hear Your Magic!
                  </motion.button>
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full text-xl font-bold flex items-center shadow-lg"
                  >
                    <FaPaperPlane className="mr-2" /> Send Your Magic!
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </div>

          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="text-center"
          >
            <button
              onClick={handleQuit}
              className="text-purple-500 hover:text-purple-700 font-medium text-lg flex items-center justify-center mx-auto"
            >
              <FaTimes className="mr-2" /> Exit Adventure
            </button>
          </motion.div>

          <AnimatePresence>
            {showModal && (
              <Modal isOpen={showModal} onClose={handleCloseModal}>
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 p-8 rounded-3xl"
                >
                  <motion.h2 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-4xl font-bold mb-6 text-purple-800"
                  >
                    Wow! You're a Superstar!
                  </motion.h2>
                  <p className="text-xl mb-8 text-blue-700">Your magical words have been sent to the cloud castle!</p>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-gradient-to-r from-pink-400 to-red-500 text-white px-6 py-3 rounded-full text-xl font-bold shadow-lg"
                    onClick={handleCloseModal}
                  >
                    Back to Your Magic Map!
                  </motion.button>
                </motion.div>
              </Modal>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

RecordPage.hideNavbar = true;

export default RecordPage;
