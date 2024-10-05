import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token); // Store JWT in local storage
            router.push('/dashboard'); // Redirect to dashboard
        } else {
            setError(data.error); // Handle errors
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 items-center justify-center">
            <motion.div
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold text-center mb-4 text-purple-600">Login</h1>
                {error && <p className="text-red-500 text-sm text-center mb-4 font-semibold">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-500"
                            aria-label="Email"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-500"
                            aria-label="Password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-sm mt-4">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-blue-500 hover:underline">
                        Sign Up
                    </a>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
