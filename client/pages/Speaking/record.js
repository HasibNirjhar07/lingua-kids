import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Timer from "../../components/timer";
import {
  FaMicrophone,
  FaStopCircle,
  FaPlayCircle,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";
import { GiSparkles, GiPartyPopper } from "react-icons/gi";
import Modal from "../../components/Modal";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

const RecordPage = () => {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timerDuration, setTimerDuration] = useState(60); // 60 seconds
  const [text, setText] = useState("");
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    setIsRecording(false);
    setRecordedAudio(null);
  }, []);

  const handleStartRecording = () => {
    setIsRecording(true);
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      console.log(transcript);
      console.log("event", event);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsRecording(false); // Reset recording state
    };

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
    };
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
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? <FaStopCircle /> : <FaMicrophone />}{" "}
          {isRecording ? "Stop" : "Start"} Recording
        </button>
        {recordedAudio && (
          <button onClick={handlePlayRecording}>
            <FaPlayCircle /> Play Recording
          </button>
        )}
      </div>
    );
  };

  const handleSubmit = () => {
    setShowModal(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleQuit = () => {
    router.push("/dashboard");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-purple-300 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <GiSparkles
              className="text-yellow-200"
              size={Math.random() * 20 + 10}
            />
          </motion.div>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-3xl w-full bg-white rounded-[40px] shadow-2xl p-8 relative"
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Let's Say Something Cool!
            </h1>
            <div className="text-lg text-gray-600 mt-2">
              Your Voice is Magic! ✨
            </div>
          </motion.div>

          {/* Timer */}
          <div className="mb-6">
            <Timer
              duration={timerDuration}
              onTimeUp={() => setIsRecording(false)}
              isRunning={isRecording}
            />
          </div>

          {/* Challenge Card */}
          <motion.div
            className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl border-4 border-purple-200 p-6 mb-8"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-center mb-4">
              <GiPartyPopper className="text-4xl text-purple-500 mr-2" />
              <h2 className="text-2xl font-bold text-purple-600">
                Your Challenge!
              </h2>
            </div>
            <motion.p
              className="text-xl text-center font-medium text-gray-700 p-4 bg-white/50 rounded-2xl"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              "Math is like a magical adventure with numbers and puzzles!"
            </motion.p>
            {text && (
              <div className="mt-4 p-4 bg-white/70 rounded-2xl">
                <p className="text-lg text-purple-600 font-medium">You said:</p>
                <p className="text-gray-700">{text}</p>
              </div>
            )}
          </motion.div>

          {/* Control Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <AnimatePresence mode="wait">
              {!isRecording && !recordedAudio && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={handleStartRecording}
                  className="bg-gradient-to-r from-green-400 to-teal-500 text-white px-8 py-4 rounded-full text-xl font-bold flex items-center shadow-lg"
                >
                  <FaMicrophone className="mr-2" /> Start Speaking!
                </motion.button>
              )}
              {isRecording && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={handleStopRecording}
                  className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold flex items-center shadow-lg animate-pulse"
                >
                  <FaStopCircle className="mr-2" /> Stop Recording
                </motion.button>
              )}
              {recordedAudio && (
                <>
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={handlePlayRecording}
                    className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-8 py-4 rounded-full text-xl font-bold flex items-center shadow-lg"
                  >
                    <FaPlayCircle className="mr-2" /> Listen Back!
                  </motion.button>
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full text-xl font-bold flex items-center shadow-lg"
                  >
                    <FaPaperPlane className="mr-2" /> Submit!
                  </motion.button>

                  {/* Exit Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={handleQuit}
                    className=" flex items-center px-6 py-2 text-purple-500 hover:text-purple-700 font-medium text-lg rounded-full border-2 border-purple-200 hover:border-purple-300 transition-colors"
                  >
                    <FaTimes className="mr-2" /> Exit Game
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <Modal isOpen={showModal} onClose={handleCloseModal}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-center bg-gradient-to-r from-green-100 to-blue-100 p-8 rounded-3xl"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-6xl mb-4 flex justify-center"
              >
                <GiPartyPopper className="text-yellow-500" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4 text-purple-600">
                Amazing Job! 🎉
              </h2>
              <p className="text-xl mb-6 text-gray-700">
                You're a speaking superstar!
              </p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full text-xl font-bold shadow-lg"
                onClick={handleCloseModal}
              >
                Play Again!
              </motion.button>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

RecordPage.hideNavbar = true;

export default RecordPage;
