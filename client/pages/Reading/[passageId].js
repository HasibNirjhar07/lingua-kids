import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const PassagePage = () => {
    const router = useRouter();
    const { passageId } = router.query; // Extract passageId from the router query
    const [passage, setPassage] = useState(null); // State to hold the fetched passage
    const [questions, setQuestions] = useState([]); // State to hold questions
    const [selectedAnswers, setSelectedAnswers] = useState({}); // State to hold selected answers
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    useEffect(() => {
        // Check if passageId is available before fetching data
        if (passageId) {
            const fetchPassage = async () => {
                console.log('Fetching passage with ID:', passageId); // Log for debugging
                const token = localStorage.getItem('token'); // Get the token from local storage

                const response = await fetch(`http://localhost:3000/reading/passage/${passageId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched passage data:', data); // Log the fetched data
                    setPassage(data.passage); // Set the passage data to state
                    setQuestions(data.questions); // Set the questions data to state
                } else {
                    const errorData = await response.json(); // Log the error response
                    console.error('Failed to fetch passage:', errorData);
                }
            };
            fetchPassage(); // Call the fetch function
        }
    }, [passageId]); // Run effect when passageId changes

    const handleOptionChange = (questionId, optionId) => {
        // Only allow optionId to be 1 or 2
        if (optionId === '1' || optionId === '2') {
            setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
        }
    };

    const handleSubmitAnswers = async () => {
        const userId = localStorage.getItem('userId'); // Assuming you have the userId stored in local storage
        const answers = questions.map(question => ({
            questionId: question.id,
            selectedOptionId: selectedAnswers[question.id] || null, // Get selected option or null if skipped
        }));

        try {
            const token = localStorage.getItem('token'); // Get the token from local storage
            const response = await fetch('http://localhost:3000/Reading/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, passageId, answers }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Submission successful:', result);
                setSuccessMessage('Your answers have been submitted successfully!'); // Set the success message
                setTimeout(() => {
                    router.push(`/Reading/${passageId}`); // Redirect to the same passage page after a delay
                }, 2000); // Redirect after 2 seconds
            } else {
                const errorData = await response.json();
                console.error('Failed to submit answers:', errorData);
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };

    if (!passage) return <p>Loading...</p>; // Show loading text while data is being fetched

    // Display the passage content when it's fetched
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">{passage.title}</h1> {/* Display passage title */}
            <p className="mt-4">{passage.content}</p> {/* Display passage content */}

            {/* Render questions if available */}
            {questions.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold">Questions:</h2>
                    <ul className="mt-4">
                        {questions.map((question) => (
                            <li key={question.id} className="mb-4">
                                <p className="font-medium">{question.text}</p> {/* Display question text */}
                                <ul>
                                    {/* Only render option 1 and option 2 */}
                                    <li className="ml-4">
                                        <label>
                                            <input
                                                type="radio"
                                                name={`question-${question.id}`} // Grouping for radio buttons
                                                value="1" // Option 1
                                                checked={selectedAnswers[question.id] === '1'}
                                                onChange={() => handleOptionChange(question.id, '1')}
                                            />
                                            {question.options[0]?.text} {/* Display first option */}
                                        </label>
                                    </li>
                                    <li className="ml-4">
                                        <label>
                                            <input
                                                type="radio"
                                                name={`question-${question.id}`} // Grouping for radio buttons
                                                value="2" // Option 2
                                                checked={selectedAnswers[question.id] === '2'}
                                                onChange={() => handleOptionChange(question.id, '2')}
                                            />
                                            {question.options[1]?.text} {/* Display second option */}
                                        </label>
                                    </li>
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button onClick={handleSubmitAnswers} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                Submit Answers
            </button>

            {/* Display success message if available */}
            {successMessage && (
                <div className="mt-4 text-green-600 font-bold">
                    {successMessage}
                </div>
            )}
        </div>
    );
};

export default PassagePage;
