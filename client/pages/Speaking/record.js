import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Timer from '../../components/timer';
import { FaMicrophone, FaStopCircle, FaPlayCircle, FaPaperPlane, FaTimes, FaStar, FaCloud, FaRocket } from 'react-icons/fa';
import Modal from '../../components/Modal';
import confetti from 'canvas-confetti';

const RecordPage = () => {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timerDuration, setTimerDuration] = useState(60); // 60 seconds

  useEffect(() => {
    setIsRecording(false);
    setRecordedAudio(null);
  }, []);

  const handleStartRecording = () => {
    setIsRecording(true);
    // Implement actual recording logic here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordedAudio(new Blob()); // Placeholder, replace with actual recorded audio
  };

  const handlePlayRecording = () => {
    // Implement logic to play the recorded audio
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
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <FaStar key={`star-${i}`} className="text-yellow-300 absolute animate-twinkle" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 10}px`,
            animationDelay: `${Math.random() * 5}s`
          }} />
        ))}
        {[...Array(5)].map((_, i) => (
          <FaCloud key={`cloud-${i}`} className="text-white opacity-50 absolute animate-float" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 50 + 30}px`,
            animationDelay: `${Math.random() * 10}s`
          }} />
        ))}
        <FaRocket className="text-red-500 absolute animate-rocket" style={{
          fontSize: '40px',
          animationDuration: '15s',
          animationIterationCount: 'infinite'
        }} />
      </div>
      
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 animate-fadeIn relative z-10">
        <h1 className="text-4xl font-bold text-purple-600 mb-4 flex items-center justify-center">
          <FaMicrophone className="mr-2 text-yellow-500 animate-bounce" />
          Speak Like a Star!
        </h1>

        <div className="mb-6">
          <Timer duration={timerDuration} onTimeUp={() => setIsRecording(false)} isRunning={isRecording} />
        </div>

        <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl border-4 border-yellow-300 shadow-inner p-6 mb-8 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4 text-center">
            Can you say this super cool sentence?
          </h2>
          <p className="text-xl text-blue-700 text-center font-medium animate-pulse">
            "Math is like a magical adventure with numbers and puzzles!"
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          {!isRecording && !recordedAudio && (
            <button
              onClick={handleStartRecording}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full text-xl font-bold hover:from-green-500 hover:to-blue-600 transition transform hover:scale-110 hover:rotate-3 flex items-center shadow-lg"
            >
              <FaMicrophone className="mr-2 animate-pulse" /> Start Your Magic!
            </button>
          )}
          {isRecording && (
            <button
              onClick={handleStopRecording}
              className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-6 py-3 rounded-full text-xl font-bold hover:from-red-500 hover:to-pink-600 transition transform hover:scale-110 hover:rotate-3 flex items-center shadow-lg"
            >
              <FaStopCircle className="mr-2 animate-pulse" /> Finish Your Spell!
            </button>
          )}
          {recordedAudio && (
            <>
              <button
                onClick={handlePlayRecording}
                className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-6 py-3 rounded-full text-xl font-bold hover:from-purple-500 hover:to-indigo-600 transition transform hover:scale-110 hover:rotate-3 flex items-center shadow-lg"
              >
                <FaPlayCircle className="mr-2 animate-bounce" /> Hear Your Magic!
              </button>
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full text-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition transform hover:scale-110 hover:rotate-3 flex items-center shadow-lg"
              >
                <FaPaperPlane className="mr-2 animate-bounce" /> Send Your Magic!
              </button>
            </>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={handleQuit}
            className="text-purple-500 hover:text-purple-700 font-medium text-lg flex items-center justify-center mx-auto hover:scale-110 transition-transform duration-300"
          >
            <FaTimes className="mr-2" /> Exit Adventure
          </button>
        </div>

        <Modal isOpen={showModal} onClose={handleCloseModal}>
          <div className="text-center bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 p-8 rounded-3xl">
            <h2 className="text-4xl font-bold mb-6 text-purple-800 animate-bounce">Wow! You're a Superstar!</h2>
            <p className="text-xl mb-8 text-blue-700">Your magical words have been sent to the cloud castle!</p>
            <button 
              className="bg-gradient-to-r from-pink-400 to-red-500 text-white px-6 py-3 rounded-full text-xl font-bold hover:from-pink-500 hover:to-red-600 transition transform hover:scale-110 hover:rotate-3 shadow-lg"
              onClick={handleCloseModal}
            >
              Back to Your Magic Map!
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default RecordPage;