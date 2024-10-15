import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Timer from '../../components/timer';
import confetti from 'canvas-confetti';
import { FaBook, FaQuestion, FaCheckCircle, FaTimesCircle, FaPaperPlane, FaStar, FaTrophy, FaClock } from 'react-icons/fa';
import Modal from '../../components/Modal'; // Import custom Modal component

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
        setIsTimerRunning(false);  // Stop the timer
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
                setSuccessMessage('Great job! Your answers have been submitted successfully!');
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });

                // Show modal after submission
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
        router.push('/dashboard');  // Redirect to dashboard
    };

    if (!passage) return (
        <div className="flex items-center justify-center h-screen">
            <FaBook className="animate-spin text-6xl text-blue-500" />
            <p className="ml-4 text-2xl">Loading your adventure...</p>
        </div>
    );

    return (
        <div className="p-8 bg-gradient-to-r from-purple-100 to-pink-100 min-h-screen">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8 animate-fadeIn">
                <h1 className="text-4xl font-bold text-purple-600 mb-4 flex items-center">
                    <FaBook className="mr-2" />
                    {passage.title}
                </h1>
                <Timer duration={600} onTimeUp={handleTimeUp} isRunning={isTimerRunning} />
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <p className="text-lg leading-relaxed">{passage.content}</p>
                </div>

                {questions.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-3xl font-semibold text-blue-600 mb-4 flex items-center">
                            <FaQuestion className="mr-2" />
                            Quest Time!
                        </h2>
                        <ul className="space-y-6">
                            {questions.map((question) => (
                                <li key={question.id} className="bg-blue-50 p-4 rounded-lg animate-bounceIn">
                                    <p className="font-medium text-xl mb-2 flex items-center">
                                        <FaStar className="mr-2 text-yellow-400" />
                                        {question.text}
                                    </p>
                                    <ul className="space-y-2">
                                        {['1', '2'].map((optionId) => (
                                            <li key={optionId} className="ml-4">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`question-${question.id}`}
                                                        value={optionId}
                                                        checked={selectedAnswers[question.id] === optionId}
                                                        onChange={() => handleOptionChange(question.id, optionId)}
                                                        className="form-radio text-purple-600 h-5 w-5"
                                                    />
                                                    <span className="text-lg flex items-center">
                                                        {selectedAnswers[question.id] === optionId ? (
                                                            <FaCheckCircle className="mr-2 text-green-500" />
                                                        ) : (
                                                            <FaTimesCircle className="mr-2 text-gray-300" />
                                                        )}
                                                        {question.options[parseInt(optionId) - 1]?.text}
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
                    className="mt-8 bg-green-500 text-white px-6 py-3 rounded-full text-xl font-bold shadow-lg hover:bg-green-600 transform hover:scale-105 transition duration-200 ease-in-out flex items-center justify-center"
                    disabled={isTimeUp || !isTimerRunning}
                >
                    <FaPaperPlane className="mr-2" />
                    {isTimeUp ? "Time's up!" : "Submit Your Quest"}
                </button>

                {successMessage && (
                    <div className="mt-4 text-green-600 font-bold text-xl animate-bounce flex items-center justify-center">
                        <FaCheckCircle className="mr-2" />
                        {successMessage}
                    </div>
                )}
            </div>

            {/* Custom Modal */}
            <Modal isOpen={showModal} onClose={handleCloseModal}>
                <div className="text-center">
                    <h2 className="text-3xl font-semibold mb-4">Quest Results</h2>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex items-center">
                            <FaTrophy className="text-yellow-400 text-4xl mr-2" />
                            <span className="text-2xl font-bold">
                                {correctAnswers} out of {questions.length} correct
                            </span>
                        </div>
                        <div className="flex items-center">
                            <FaClock className="text-blue-500 text-4xl mr-2" />
                            <span className="text-2xl font-bold">
                                Time taken: {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
                            </span>
                        </div>
                    </div>
                    <button 
                        className="mt-6 bg-red-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-600 transition"
                        onClick={handleCloseModal}
                    >
                        Close and Go to Dashboard
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default PassagePage;
