import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Timer from "../../components/timer";
import {
  FaMicrophone,
  FaStopCircle,
  FaPlayCircle,
  FaPaperPlane,
  FaTimes,
  FaStar,
  FaCloud,
  FaRocket,
} from "react-icons/fa";
import Modal from "../../components/Modal";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";

const AzureSpeechAssessment = () => {
  const [subscriptionKey, setSubscriptionKey] = useState(
    process.env.NEXT_PUBLIC_AZURE_SUBSCRIPTION_KEY
  );
  const [region, setRegion] = useState("centralindia");
  const [language, setLanguage] = useState("en-us");
  const [referenceText, setReferenceText] = useState("Good Night");
  const [contentId, setContentId] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState("Not recording");
  const [results, setResults] = useState(
    "Results will appear here after processing."
  );
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timerDuration, setTimerDuration] = useState(60); // 60 seconds
  const [text, setText] = useState("");
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Fetch a random prompt when the page loads
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/speaking/random", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch prompt");
        }

        const data = await response.json();
        setReferenceText(data.content);
        setContentId(data.content_id);
      } catch (error) {
        console.error("Error fetching prompt:", error);
        alert("Unable to load prompt. Please try again later.");
        router.push("/dashboard");
      }
    };

    fetchPrompt();
  }, [router]);

  useEffect(() => {
    setIsRecording(false);
  }, []);

  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      // Reset previous recording data
      setAudioUrl(null);
      setResults("Results will appear here after processing.");
      setIsRecording(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current);
        const blob2 = new Blob(audioChunksRef.current, { type: "audio/wav" });
        console.log("blob", blob2);
        const url = URL.createObjectURL(blob2);
        setAudioUrl(url);
        console.log("url", url);
        console.log("audio", audioUrl);
        azureApi(blob2);
        setIsRecording(false);
        setRecordedAudio(blob2);
      };

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingStatus("Recording... Speak now!");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setRecordingStatus(`Error: ${error.message}`);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingStatus("Processing audio...");
    }
  };

  function convertToWav(blob) {
    return new Promise((resolve) => {
      const fileReader = new FileReader();

      fileReader.onloadend = () => {
        const arrayBuffer = fileReader.result;
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();

        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          // Convert to 16kHz mono PCM
          const sampleRate = 16000;
          const numberOfChannels = 1;
          const length =
            audioBuffer.length * (sampleRate / audioBuffer.sampleRate);
          const offlineContext = new OfflineAudioContext(
            numberOfChannels,
            length,
            sampleRate
          );

          const source = offlineContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(offlineContext.destination);
          source.start(0);

          offlineContext.startRendering().then((renderedBuffer) => {
            // Create WAV file
            const wavData = createWaveFileData(renderedBuffer);
            const wavBlob = new Blob([wavData], { type: "audio/wav" });
            resolve(wavBlob);
          });
        });
      };

      fileReader.readAsArrayBuffer(blob);
    });
  }

  function createWaveFileData(audioBuffer) {
    const numChannels = 1; // Mono
    const sampleRate = audioBuffer.sampleRate;
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;

    const samples = audioBuffer.getChannelData(0);
    const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
    const view = new DataView(buffer);

    // Write WAV header
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + samples.length * bytesPerSample, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, "data");
    view.setUint32(40, samples.length * bytesPerSample, true);

    // Write PCM samples
    const offset = 44;
    for (let i = 0; i < samples.length; i++) {
      const sample = Math.max(-1, Math.min(1, samples[i]));
      const int16Sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset + i * bytesPerSample, int16Sample, true);
    }

    return buffer;
  }

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  async function azureApi(blob) {
    if (!subscriptionKey) {
      statusElement.textContent =
        "Error: Please enter your Azure subscription key";
      return;
    }

    try {
      // Convert to proper format
      const wavBlob = await convertToWav(blob);

      // Create pronunciation assessment parameters
      const pronAssessmentParamsJson = JSON.stringify({
        ReferenceText: referenceText,
        GradingSystem: "HundredMark",
        Dimension: "Comprehensive",
        EnableMiscue: true,
        EnableProsodyAssessment: true,
      });

      const pronAssessmentParams = btoa(pronAssessmentParamsJson);
      const sessionID = generateUUID();

      // Create request URL
      const url = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${language}&format=detailed&X-ConnectionId=${sessionID}`;

      //statusElement.textContent = "Sending to Azure Speech API...";

      // Send request
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json;text/xml",
          "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          "Pronunciation-Assessment": pronAssessmentParams,
        },
        body: wavBlob,
      });

      if (response.ok) {
        const result = await response.json();

        const nBest = result.NBest?.[0] || {};
        const extractedScores = {
          AccuracyScore: nBest.AccuracyScore || 0,
          FluencyScore: nBest.FluencyScore || 0,
          ProsodyScore: nBest.ProsodyScore || 0,
          CompletenessScore: nBest.CompletenessScore || 0,
          PronScore: nBest.PronScore || 0,
        };

        console.log("contentId", contentId);
        // Convert scores object to an array before sending
        const scoresArray = Object.values(extractedScores);

        // Send extracted scores to backend
        await fetch("http://localhost:3000/speaking/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ contentId, scores: scoresArray }),
        });

        console.log("Azure API response:", result);
        const resultText = JSON.stringify(result, null, 2);
        setResults(extractedScores);
      } else {
        const errorText = await response.text();
        console.log(errorText);
      }
    } catch (error) {
      console.error("Error sending to Azure:", error);
    }
  }

  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

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
    <div className="min-h-screen flex bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 relative overflow-hidden">
      {/* Sidebar */}
      {/* <Sidebar className="w-64 h-screen bg-gray-800 text-white p-4" /> */}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        {/* Static background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Stars */}
          {[...Array(30)].map((_, i) => (
            <FaStar
              key={`star-${i}`}
              className="text-yellow-300 absolute animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`,
              }}
            />
          ))}
          {/* Clouds */}
          {[...Array(8)].map((_, i) => (
            <FaCloud
              key={`cloud-${i}`}
              className="text-white absolute animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 70 + 30}px`,
              }}
            />
          ))}
          <FaRocket
            className="text-red-500 absolute animate-rocket"
            style={{ fontSize: "60px", left: "80%", top: "10%" }}
          />
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
            <Timer
              duration={timerDuration}
              onTimeUp={() => setIsRecording(false)}
              isRunning={isRecording}
            />
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
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
              {referenceText}
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
                  onClick={startRecording}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-full text-xl font-bold flex items-center shadow-lg"
                >
                  <FaMicrophone className="mr-2" onClick={startRecording} />{" "}
                  Start Your Magic!
                </motion.button>
              )}
              {isRecording && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={stopRecording}
                  className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold flex items-center shadow-lg"
                >
                  <FaStopCircle className="mr-2" /> Finish Your Spell!
                </motion.button>
              )}

              {recordedAudio && audioUrl && (
                <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Audio Preview
                  </h3>
                  <audio
                    controls
                    src={audioUrl}
                    className="w-full mt-2 rounded-lg"
                  />
                </div>
              )}

              {recordedAudio && results && (
                <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Assessment Results
                  </h3>
                  <div className="mt-4 space-y-2 text-gray-700">
                    <p>
                      <strong>Accuracy Score:</strong> {results.AccuracyScore}
                    </p>
                    <p>
                      <strong>Fluency Score:</strong> {results.FluencyScore}
                    </p>
                    <p>
                      <strong>Prosody Score:</strong> {results.ProsodyScore}
                    </p>
                    <p>
                      <strong>Completeness Score:</strong>{" "}
                      {results.CompletenessScore}
                    </p>
                    <p>
                      <strong>Pronunciation Score:</strong> {results.PronScore}
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <motion.div whileHover={{ scale: 1.1 }} className="text-center">
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
                  <p className="text-xl mb-8 text-blue-700">
                    Your magical words have been sent to the cloud castle!
                  </p>
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

AzureSpeechAssessment.hideNavbar = true;

export default AzureSpeechAssessment;
