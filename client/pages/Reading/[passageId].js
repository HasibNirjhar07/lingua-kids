import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Timer from '../../components/timer';
import confetti from 'canvas-confetti';
import { FaBook, FaQuestion, FaCheckCircle, FaTimesCircle, FaPaperPlane, FaStar, FaTrophy, FaClock, FaRocket, FaDragon } from 'react-icons/fa';
import Modal from '../../components/Modal';

const PassagePage = () => {
    const router = useRouter();
    const { passageId } = router.query;
    const [passage, setPassage] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0);
    const [startTime, setStartTime] = useState(null);
    

    useEffect(() => {
        if (passageId) {
            const fetchPassage = async () => {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/reading/passage/${passageId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPassage(data.passage);
                    setQuestions(data.questions);
                    setStartTime(Date.now());
                } else {
                    const errorData = await response.json();
                    console.error('Failed to fetch passage:', errorData);
                }
            };
            fetchPassage();
        }
    }, [passageId]);

    const handleOptionChange = (questionId, optionId) => {
        setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmitAnswers = async () => {
        setIsTimerRunning(false);
        const endTime = Date.now();
        const timeTakenInSeconds = Math.floor((endTime - startTime) / 1000);
        setTimeTaken(timeTakenInSeconds);

        const userId = localStorage.getItem('userId');
        const answers = questions.map(question => ({
            questionId: question.id,
            selectedOptionId: selectedAnswers[question.id] || null,
        }));

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/reading/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, passageId, answers }),
            });

            if (response.ok) {
                const result = await response.json();
                setCorrectAnswers(result.correctAnswers);
                setSuccessMessage('Woohoo! You did it, young adventurer!');
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                setShowModal(true);
            } else {
                const errorData = await response.json();
                console.error('Failed to submit answers:', errorData);
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
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

    if (!passage) return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            <FaDragon className="animate-bounce text-8xl text-yellow-300 mb-4" />
            <p className="text-3xl font-bold text-white">Summoning your magical quest...</p>
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
                {questions.length > 0 && (
    <div className="mt-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-4 flex items-center">
            <FaQuestion className="mr-2 text-green-500" />
            Magic Quiz Time!
        </h2>
        <ul className="space-y-6">
            {questions.map((question, index) => (
                <li key={question.id} className="bg-gradient-to-r from-green-200 to-blue-200 p-6 rounded-2xl animate-bounceIn shadow-lg">
                    <p className="font-bold text-2xl mb-4 flex items-center text-purple-700">
                        <FaStar className="mr-2 text-yellow-400" />
                        Question {index + 1}: {question.text}
                    </p>
                    <ul className="space-y-4">
                        {question.options.map((option, optionIndex) => (
                            <li key={option.id} className="ml-4">
                                <label className="flex items-center space-x-3 cursor-pointer bg-white p-3 rounded-xl hover:bg-blue-100 transition duration-200">
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={option.id}
                                        checked={selectedAnswers[question.id] === option.id}
                                        onChange={() => handleOptionChange(question.id, option.id)}
                                        className="form-radio text-purple-600 h-6 w-6"
                                    />
                                    <span className="text-xl flex items-center font-semibold">
                                        {selectedAnswers[question.id] === option.id ? (
                                            <FaCheckCircle className="mr-2 text-green-500" />
                                        ) : (
                                            <FaTimesCircle className="mr-2 text-gray-300" />
                                        )}
                                        {option.text}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    </div>
)}


         

                <button 
                    onClick={handleSubmitAnswers} 
                    className="mt-8 bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-full text-2xl font-bold shadow-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition duration-200 ease-in-out flex items-center justify-center"
                    disabled={isTimeUp || !isTimerRunning}
                >
                    <FaRocket className="mr-3 animate-pulse" />
                    {isTimeUp ? "Time's up, brave hero!" : "Launch Your Answers!"}
                </button>

                {successMessage && (
                    <div className="mt-6 text-green-600 font-bold text-2xl animate-bounce flex items-center justify-center bg-green-100 p-4 rounded-full">
                        <FaCheckCircle className="mr-3 text-3xl" />
                        {successMessage}
                    </div>
                )}
            </div>

            <Modal isOpen={showModal} onClose={handleCloseModal}>
                <div className="text-center bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 p-8 rounded-3xl">
                    <h2 className="text-4xl font-bold mb-6 text-purple-800">Your Magical Results!</h2>
                    <div className="flex flex-col items-center space-y-6">
                        <div className="flex items-center bg-white p-4 rounded-full shadow-lg">
                            <FaTrophy className="text-yellow-500 text-5xl mr-4" />
                            <span className="text-3xl font-bold text-purple-700">
                                {correctAnswers} out of {questions.length} correct
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

PassagePage.hideNavbar = true;

export default PassagePage;