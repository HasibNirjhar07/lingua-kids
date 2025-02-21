import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Timer from '../../components/timer';
import confetti from 'canvas-confetti';
import { FaBook, FaHeadphones, FaCheckCircle, FaTimesCircle, FaClock, FaRocket, FaTrophy } from 'react-icons/fa';

import Modal from '../../components/Modal';

const ListeningPage = () => {
    const router = useRouter();
    const { passageId } = router.query;
    const [passage, setPassage] = useState(null);
    const [blanks, setBlanks] = useState([]);
    const [answers, setAnswers] = useState({});
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [audio, setAudio] = useState(null);

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
    
                    // Log the full data to understand its structure
                    console.log('Fetched data:', data);
    
                    // Check if passage exists and if it has questions
                    if (data && data.questions) {
                        setPassage(data);

                        // Map questions to blanks structure
                        const mappedBlanks = data.questions.map((question, index) => ({
                            text: question.question_text,
                            correctAnswer: question.correct_answer,
                            question_id: question.question_id,  // Make sure the question_id is present
                        }));

                        setBlanks(mappedBlanks); // Set the mapped blanks
                        setAudio(new Audio(data.audioUrl || '')); // Set the audio source (fallback if null)
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
            questionId: blanks[index].question_id,  // Assuming each blank has a `question_id`
            userAnswer: answers[index],
        }));

        const payload = {
            passageId,
            username: userId,
            answers: submissionAnswers,
        };

        try {
            // Send the answers to the backend
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
                setCorrectAnswers(result.score); // Assuming the backend returns a score
                setShowModal(true);
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                });
            } else {
                const errorData = await response.json();
                console.error('Failed to submit answers:', errorData);
                // Handle error if needed
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
            // Handle error if needed
        }
    };

    const handleTimeUp = () => {
        setIsTimeUp(true);
        handleSubmitAnswers();
    };

    const handleCloseModal = () => {
        setShowModal(false);
        router.push('/dashboard');
    };

    const handlePlayAudio = () => {
        if (passage && passage.content) {
            // Get the passage content
            const passageText = passage.content;
    
            // Use the SpeechSynthesis API to speak the passage text
            const speech = new SpeechSynthesisUtterance(passageText);
    
            // Set the language and voice properties (optional)
            speech.lang = 'en-US'; // You can set to another language if needed
            speech.volume = 1; // Volume (0 to 1)
            speech.rate = 1; // Speed of speech (0.1 to 10)
            speech.pitch = 1; // Pitch (0 to 2)
    
            // Speak the text
            window.speechSynthesis.speak(speech);
        }
    };

    if (!passage) return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            <FaHeadphones className="animate-bounce text-8xl text-yellow-300 mb-4" />
            <p className="text-3xl font-bold text-white">Preparing your listening quest...</p>
        </div>
    );

    return (
        <div className="p-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 min-h-screen">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 animate-fadeIn">
                <h1 className="text-4xl font-bold text-purple-600 mb-4 flex items-center">
                    <FaBook className="mr-2 text-yellow-500" />
                    {passage.title}
                </h1>
                <Timer duration={600} onTimeUp={handleTimeUp} isRunning={isTimerRunning} />
                <div className="mt-6 p-6 bg-yellow-100 rounded-2xl border-4 border-yellow-300 shadow-inner">
                    <p className="text-xl leading-relaxed">{passage.content}</p>
                </div>
                <button
                    className="mt-8 bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-full text-2xl font-bold shadow-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition duration-200 ease-in-out flex items-center justify-center"
                    onClick={handlePlayAudio}
                >
                    <FaHeadphones className="mr-3 animate-pulse" />
                    Play Listening Passage
                </button>

                <div className="mt-8">
                    <h2 className="text-3xl font-bold text-blue-600 mb-4 flex items-center">
                        <FaCheckCircle className="mr-2 text-green-500" />
                        Fill-in-the-Blanks!
                    </h2>
                    <div className="space-y-4">
                        {blanks.map((blank, index) => (
                            <div key={index} className="flex items-center space-x-4 mb-4">
                                <span className="font-semibold text-lg">{blank.text}</span>
                                <input
                                    type="text"
                                    value={answers[index] || ''}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    className="p-2 border rounded-lg w-full"
                                    disabled={isTimeUp || !isTimerRunning}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSubmitAnswers}
                    className="mt-8 bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-full text-2xl font-bold shadow-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition duration-200 ease-in-out flex items-center justify-center"
                    disabled={isTimeUp || !isTimerRunning}
                >
                    <FaRocket className="mr-3 animate-pulse" />
                    {isTimeUp ? "Time's up, brave hero!" : "Submit Answers!"}
                </button>
            </div>

            <Modal isOpen={showModal} onClose={handleCloseModal}>
                <div className="text-center bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 p-8 rounded-3xl">
                    <h2 className="text-4xl font-bold mb-6 text-purple-800">Your Magical Results!</h2>
                    <div className="flex flex-col items-center space-y-6">
                        <div className="flex items-center bg-white p-4 rounded-full shadow-lg">
                            <FaTrophy className="text-yellow-500 text-5xl mr-4" />
                            <span className="text-3xl font-bold text-purple-700">
                                {correctAnswers} out of {blanks.length} correct
                            </span>
                        </div>
                        <div className="flex items-center bg-white p-4 rounded-full shadow-lg">
                            <FaClock className="text-blue-500 text-5xl mr-4" />
                            <span className="text-3xl font-bold text-purple-700">
                                Time: {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
                            </span>
                        </div>
                    </div>
                    <button
                        className="mt-8 bg-gradient-to-r from-red-400 to-pink-500 text-white px-6 py-3 rounded-full text-xl font-bold hover:from-red-500 hover:to-pink-600 transition transform hover:scale-105"
                        onClick={handleCloseModal}
                    >
                        Back to Your Quest Map!
                    </button>
                </div>
            </Modal>
        </div>
    );
};

ListeningPage.hideNavbar = true;

export default ListeningPage;
