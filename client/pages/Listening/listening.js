import React, { useState, useEffect } from 'react';
import { FaHeadphones, FaPlay, FaPause, FaQuestion, FaCheckCircle, FaTimesCircle, FaClock, FaSlidersH } from 'react-icons/fa';
import Timer from '../../components/timer';
import Modal from '../../components/Modal';

const ListeningPage = () => {
    const [questions, setQuestions] = useState([
        {
            id: 1,
            text: 'What is the main topic of the passage?',
            options: [
                { id: 'a', text: 'Technology' },
                { id: 'b', text: 'Nature' },
                { id: 'c', text: 'History' },
            ],
        },
        {
            id: 2,
            text: 'What is the speaker’s opinion about the subject?',
            options: [
                { id: 'a', text: 'Positive' },
                { id: 'b', text: 'Neutral' },
                { id: 'c', text: 'Negative' },
            ],
        },
    ]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timeTaken, setTimeTaken] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [passageText, setPassageText] = useState(
        "This is an example of a listening passage that can be read aloud to users. It will help them understand how text-to-speech works."
    );
    const [speechSpeed, setSpeechSpeed] = useState(1); // Default speed (1.0)
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        const handleVoicesChanged = () => {
            setVoices(speechSynthesis.getVoices());
        };
        speechSynthesis.onvoiceschanged = handleVoicesChanged;
        handleVoicesChanged(); // Set voices immediately if available
        return () => {
            speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    const handlePlay = () => {
        if (!isPlaying) {
            setIsPlaying(true);
            setStartTime(Date.now());
            setIsTimerRunning(true);
            speakText(passageText, speechSpeed);
        }
    };

    const handlePause = () => {
        setIsPlaying(false);
        setIsTimerRunning(false);
        window.speechSynthesis.pause(); // Pause the speech synthesis
    };

    const speakText = (text, speed) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = speed; // Set the speech speed
        utterance.voice = voices[0] || null; // Set default voice if available
        utterance.onend = () => {
            setIsPlaying(false);
            handleTimeUp(); // Automatically trigger time up when speech ends
        };
        utterance.onerror = (event) => {
            console.error('SpeechSynthesis error:', event);
        };
        // Cancel any previous speech before starting new one
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    };

    const handleOptionChange = (questionId, optionId) => {
        setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmitAnswers = () => {
        setIsTimerRunning(false);
        const endTime = Date.now();
        const timeTakenInSeconds = Math.floor((endTime - startTime) / 1000);
        setTimeTaken(timeTakenInSeconds);

        // Simple answer check (mock result calculation)
        let correctCount = 0;
        questions.forEach((question) => {
            if (selectedAnswers[question.id] === 'a') {
                correctCount += 1;
            }
        });

        setCorrectAnswers(correctCount);
        setShowModal(true);
    };

    const handleTimeUp = () => {
        setIsTimeUp(true);
        handleSubmitAnswers();
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-indigo-600">
                        <FaHeadphones className="mr-2 text-blue-500" />
                        Listening Exercise
                    </h1>

                    {/* Play & Pause Button */}
                    <div className="flex items-center space-x-4">
                        {!isPlaying ? (
                            <button
                                onClick={handlePlay}
                                className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition"
                            >
                                <FaPlay className="mr-3" />
                                Play Passage
                            </button>
                        ) : (
                            <button
                                onClick={handlePause}
                                className="bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-red-700 transition"
                            >
                                <FaPause className="mr-3" />
                                Pause
                            </button>
                        )}

                        {/* Speech Speed Control */}
                        <div className="flex items-center space-x-2">
                            <FaSlidersH />
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={speechSpeed}
                                onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                                className="w-32"
                            />
                            <span>{speechSpeed.toFixed(1)}x</span>
                        </div>
                    </div>
                </div>

                <Timer duration={600} onTimeUp={handleTimeUp} isRunning={isTimerRunning} />

                {/* Questions visible from the start */}
                <div className="mb-8">
                    <h2 className="text-3xl font-semibold text-indigo-600 mb-4">
                        <FaQuestion className="inline-block mr-3 text-green-500" />
                        Answer the Questions
                    </h2>
                    <ul className="space-y-6">
                        {questions.map((question) => (
                            <li key={question.id} className="bg-blue-50 p-4 rounded-lg shadow-md">
                                <p className="font-semibold text-lg text-gray-800 mb-4">
                                    {question.text}
                                </p>
                                <ul className="space-y-4">
                                    {question.options.map((option) => (
                                        <li key={option.id} className="ml-4">
                                            <label className="flex items-center cursor-pointer bg-white p-3 rounded-lg shadow-sm hover:bg-blue-200 transition">
                                                <input
                                                    type="radio"
                                                    name={`question-${question.id}`}
                                                    value={option.id}
                                                    checked={selectedAnswers[question.id] === option.id}
                                                    onChange={() => handleOptionChange(question.id, option.id)}
                                                    className="form-radio text-indigo-600 h-5 w-5"
                                                />
                                                <span className="text-lg font-medium ml-2">
                                                    {selectedAnswers[question.id] === option.id ? (
                                                        <FaCheckCircle className="mr-2 text-green-500" />
                                                    ) : (
                                                        <FaTimesCircle className="mr-2 text-gray-400" />
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

                <div className="flex justify-center">
                    <button
                        onClick={handleSubmitAnswers}
                        className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-green-700 transition"
                        disabled={isTimeUp || !isPlaying}
                    >
                        {isTimeUp ? "Time's Up!" : "Submit Answers"}
                    </button>
                </div>

                <Modal isOpen={showModal} onClose={handleCloseModal}>
                    <div className="text-center bg-indigo-100 p-8 rounded-lg">
                        <h2 className="text-3xl font-bold mb-6 text-indigo-700">Your Results</h2>
                        <div className="flex flex-col items-center space-y-6">
                            <div className="flex items-center bg-white p-4 rounded-full shadow-md">
                                <FaClock className="text-green-500 text-4xl mr-4" />
                                <span className="text-xl font-semibold text-gray-800">
                                    Time Taken: {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
                                </span>
                            </div>
                            <div className="flex items-center bg-white p-4 rounded-full shadow-md">
                                <FaCheckCircle className="text-green-500 text-4xl mr-4" />
                                <span className="text-xl font-semibold text-gray-800">
                                    Correct Answers: {correctAnswers} / {questions.length}
                                </span>
                            </div>
                        </div>
                        <button
                            className="mt-6 bg-red-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition"
                            onClick={handleCloseModal}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

ListeningPage.hideNavbar = true;

export default ListeningPage;

