import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Timer from '../../components/timer';
import confetti from 'canvas-confetti';
import { 
  FaHeadphones, FaCheckCircle, FaPlay, FaPause, FaRocket, 
  FaTrophy, FaClock, FaWaveSquare, FaMagic, FaArrowRight,FaCheck
} from 'react-icons/fa';
import Modal from '../../components/Modal';

const ListeningPage = () => {
    const [passage, setPassage] = useState(null);
    const [blanks, setBlanks] = useState([]);
    const [answers, setAnswers] = useState({});
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const [showInstructions, setShowInstructions] = useState(true);
    const audioRef = useRef(null);
    const synthRef = useRef(null);
    const router = useRouter();
    const { passageId } = router.query;

    const [isPassageCompleted, setIsPassageCompleted] = useState(false);

    useEffect(() => {
        if (passageId) {
            const fetchPassage = async () => {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/listening/${passageId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.questions) {
                        setPassage(data);
                        const mappedBlanks = data.questions.map((question) => ({
                            text: question.question_text,
                            correctAnswer: question.correct_answer,
                            question_id: question.question_id,
                        }));
                        setBlanks(mappedBlanks);
                        
                        // Set up audio if available
                        if (data.audioUrl) {
                            audioRef.current = new Audio(data.audioUrl);
                            audioRef.current.addEventListener('ended', () => {
                                setIsPlaying(false);
                            });
                        }
                        setStartTime(Date.now());
                    } else {
                        console.error('Invalid passage data or missing questions array');
                    }
                } else {
                    const errorData = await response.json();
                    console.error('Failed to fetch passage:', errorData);
                }
            };
            fetchPassage();
        }
        
        // Cleanup function
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('ended', () => {});
            }
            if (synthRef.current) {
                window.speechSynthesis.cancel();
            }
        };
    }, [passageId]);
    
    const handleAnswerChange = (index, value) => {
        setAnswers(prev => ({ ...prev, [index]: value }));
    };

    const handleSubmitAnswers = async () => {
        setIsTimerRunning(false);
        const endTime = Date.now();
        const timeTakenInSeconds = Math.floor((endTime - startTime) / 1000);
        setTimeTaken(timeTakenInSeconds);

        const userId = localStorage.getItem('userId');
        const submissionAnswers = Object.keys(answers).map((index) => ({
            questionId: blanks[index].question_id,
            userAnswer: answers[index],
        }));

        const payload = {
            passageId,
            username: userId,
            answers: submissionAnswers,
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/listening/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                setCorrectAnswers(result.score);
                setShowModal(true);
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#FF3E9D', '#7E30E1', '#4DA6FF']
                });
            } else {
                const errorData = await response.json();
                console.error('Failed to submit answers:', errorData);
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        router.push('/dashboard');
    };

    const handlePlayPause = () => {
        if (isPassageCompleted) {
            return;
        }
    
        if (isPlaying) {
            if (audioRef.current) {
                audioRef.current.pause();
            } else if (window.speechSynthesis.speaking) {
                window.speechSynthesis.pause();
            }
            setIsPlaying(false);
        } else {
            if (audioRef.current) {
                audioRef.current.play();
                setIsPlaying(true);
            } else if (passage && passage.content) {
                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                    setIsPlaying(true);
                    return;
                }
    
                if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                }
    
                const speech = new SpeechSynthesisUtterance(passage.content);
                speech.lang = 'en-US';
                speech.rate = 1;
                speech.pitch = 1.2; // Slightly higher pitch for a feminine tone
    
                // Select a female voice
                const voices = window.speechSynthesis.getVoices();
                const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('Samantha') || voice.name.includes('Google UK English Female'));
    
                if (femaleVoice) {
                    speech.voice = femaleVoice;
                }
    
                speech.onend = () => {
                    setIsPlaying(false);
                    setIsPassageCompleted(true);
                };
    
                synthRef.current = speech;
                window.speechSynthesis.speak(speech);
                setIsPlaying(true);
            }
        }
    };
    
    
    // Update your handleTimeUp function
    const handleTimeUp = () => {
        // Stop any active audio or speech
        if (audioRef.current) {
            audioRef.current.pause();
        }
        
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        
        setIsPlaying(false);
        // Mark passage as completed when timer ends
        setIsPassageCompleted(true);
        
        // Any other logic you might have for when time is up
    };
    
    // Function to transform question text with embedded input fields
    const renderQuestionWithInput = (questionText, index) => {
        const parts = questionText.split('_______');
        
        if (parts.length !== 2) {
            return (
                <div className="mb-6 p-6 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                    <p className="text-lg text-gray-700 mb-3">{questionText}</p>
                    <div className="relative">
                        <input
                            type="text"
                            value={answers[index] || ''}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            disabled={isTimeUp || !isTimerRunning}
                            placeholder="Your answer here..."
                        />
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-b-lg transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                    </div>
                </div>
            );
        }
        
        return (
            <div className="mb-6 p-6 bg-white rounded-xl shadow-lg text-lg transition-all duration-300 hover:shadow-xl">
                <div className="flex flex-wrap items-center">
                    <span className="text-gray-700">{parts[0]}</span>
                    <div className="relative mx-2 my-1 group">
                        <input
                            type="text"
                            value={answers[index] || ''}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            className="px-4 py-2 border-b-2 border-purple-500 w-40 text-center focus:outline-none focus:ring-2 focus:ring-purple-400 rounded transition-all"
                            disabled={isTimeUp || !isTimerRunning}
                            placeholder="..."
                        />
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-b-lg transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                    </div>
                    <span className="text-gray-700">{parts[1]}</span>
                </div>
            </div>
        );
    };

    if (!passage) return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="relative">
                <FaHeadphones className="animate-bounce text-8xl text-white opacity-80 mb-6" />
                <div className="absolute inset-0 bg-white blur-xl opacity-20 rounded-full animate-pulse"></div>
            </div>
            <p className="text-4xl font-bold text-white drop-shadow-lg">Loading your audio adventure...</p>
            <div className="mt-8 w-64 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/80 rounded-full animate-loadingBar"></div>
            </div>
        </div>
    );

    return (
        <div className="p-6 md:p-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6 text-center">
                {passage.title || "Listening Adventure"}
            </h1>
            
            <div className="sticky top-4 z-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-8">
                <Timer duration={600} onTimeUp={handleTimeUp} isRunning={isTimerRunning} />
            </div>
            
            {/* Standard Floating Audio Player */}
            <div className="sticky top-28 z-10 mx-auto max-w-sm mb-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-gray-200 p-2">
                    <div className="flex items-center justify-between px-2">
                        <button
                            className={`flex items-center justify-center rounded-full w-10 h-10 transition ${
                                isPassageCompleted 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 active:scale-95'
                            }`}
                            onClick={handlePlayPause}
                            disabled={isPassageCompleted}
                        >
                            {isPlaying ? (
                                <FaPause className="text-white text-sm" />
                            ) : isPassageCompleted ? (
                                <FaCheck className="text-white text-sm" />
                            ) : (
                                <FaPlay className="text-white text-sm ml-0.5" />
                            )}
                        </button>
                        
                        <div className="flex items-center ml-3">
                            <div className={`w-2 h-2 rounded-full ${
                                isPlaying 
                                    ? 'bg-green-500 animate-pulse' 
                                    : isPassageCompleted 
                                        ? 'bg-blue-500' 
                                        : 'bg-gray-300'
                            } mr-2`}></div>
                            <span className="text-gray-700 text-sm font-medium mr-2">
                                {isPlaying 
                                    ? "Now Playing" 
                                    : isPassageCompleted 
                                        ? "Completed" 
                                        : "Ready"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-indigo-600 mb-6 flex items-center">
                        <FaCheckCircle className="mr-3 text-green-500" />
                        Complete the Challenge!
                    </h2>
                    
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/50 to-pink-200/50 rounded-3xl blur-xl -z-10"></div>
                        <div className="space-y-6 mt-6 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
                            {blanks.map((blank, index) => (
                                <div key={index} className="group transition transform hover:scale-102 hover:-translate-y-1">
                                    {renderQuestionWithInput(blank.text, index)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSubmitAnswers}
                    className="mt-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-5 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 flex items-center justify-center w-full"
                    disabled={isTimeUp || !isTimerRunning}
                >
                    <div className="relative">
                        <FaRocket className="mr-3 animate-pulse" />
                        <div className="absolute inset-0 bg-white blur-xl opacity-30 rounded-full animate-ping"></div>
                    </div>
                    {isTimeUp ? "Time's up!" : "Submit Your Answers"}
                </button>
            </div>

            <Modal isOpen={showModal} onClose={handleCloseModal}>
                <div className="text-center bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 p-8 rounded-3xl">
                    <div className="absolute inset-0 bg-white/20 rounded-3xl backdrop-blur-sm -z-10"></div>
                    <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
                        Your Epic Results!
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex flex-col items-center transform transition hover:scale-105">
                            <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                                <FaTrophy className="text-yellow-500 text-4xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-600 mb-1">Score</h3>
                            <p className="text-3xl font-bold text-indigo-700">
                                {correctAnswers} <span className="text-xl text-gray-500">/ {blanks.length}</span>
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                <div 
                                    className="bg-gradient-to-r from-indigo-500 to-pink-500 h-2 rounded-full" 
                                    style={{width: `${(correctAnswers / blanks.length) * 100}%`}}
                                ></div>
                            </div>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex flex-col items-center transform transition hover:scale-105">
                            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                <FaClock className="text-blue-500 text-4xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-600 mb-1">Time Taken</h3>
                            <p className="text-3xl font-bold text-indigo-700">
                                {Math.floor(timeTaken / 60)}
                                <span className="text-xl text-gray-500">m </span>
                                {timeTaken % 60}
                                <span className="text-xl text-gray-500">s</span>
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                {timeTaken < 300 ? "Impressive speed!" : "Take your time, accuracy matters!"}
                            </p>
                        </div>
                    </div>
                    
                    <button
                        className="mt-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
                        onClick={handleCloseModal}
                    >
                        Continue Your Journey
                    </button>
                </div>
            </Modal>
        </div>
    );
};

ListeningPage.hideNavbar = true;

export default ListeningPage;