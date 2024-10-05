import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaSun, FaCloud, FaStar, FaEnvelope, FaLock, FaRocket } from 'react-icons/fa';

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
            localStorage.setItem('token', data.token);
            router.push('/dashboard');
        } else {
            setError(data.error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-yellow-300 to-blue-400 items-center justify-center relative overflow-hidden">
            <motion.div
                className="absolute top-10 left-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <FaSun className="text-yellow-500" size={64} />
            </motion.div>
            <motion.div
                className="absolute top-20 right-20"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <FaCloud className="text-white" size={48} />
            </motion.div>
            <motion.div
                className="absolute bottom-10 left-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <FaStar className="text-yellow-400" size={32} />
            </motion.div>
            
            <motion.div
                className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md bg-gradient-to-br from-pink-100 to-blue-100 border-4 border-indigo-400"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold text-center mb-4 text-indigo-600 font-comic">Welcome Back, Explorer!</h1>
                {error && <p className="text-red-500 text-sm text-center mb-4 font-semibold font-comic">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="mb-4 relative">
                        <FaEnvelope className="absolute top-3 left-3 text-indigo-400" size={20} />
                        <input
                            type="email"
                            placeholder="Your Magic Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 pl-10 border-2 border-indigo-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200 placeholder-indigo-400 font-comic text-indigo-700"
                            aria-label="Email"
                        />
                    </div>
                    <div className="mb-4 relative">
                        <FaLock className="absolute top-3 left-3 text-indigo-400" size={20} />
                        <input
                            type="password"
                            placeholder="Secret Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 pl-10 border-2 border-indigo-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200 placeholder-indigo-400 font-comic text-indigo-700"
                            aria-label="Password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 rounded-full shadow-md hover:from-yellow-500 hover:to-orange-600 transition duration-200 font-comic text-lg font-bold flex items-center justify-center"
                    >
                        <FaRocket className="mr-2" />
                        Blast Off!
                    </button>
                </form>
                <p className="text-center text-indigo-600 mt-4 font-comic">
                    New to our adventure?{' '}
                    <a href="/signup" className="text-yellow-600 hover:underline font-bold">
                        Join the Fun!
                    </a>
                </p>
            </motion.div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
                .font-comic {
                    font-family: 'Comic Neue', cursive;
                }
            `}</style>
        </div>
    );
};

export default Login;
