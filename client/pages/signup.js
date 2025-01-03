import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaRocket, FaStar, FaMoon, FaSun } from 'react-icons/fa';

const Signup = () => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      router.push('/login'); // Redirect to login after successful signup
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-300 to-blue-400">
      <motion.div
        className="w-full max-w-md flex flex-col items-center justify-center p-8 mx-auto"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold text-indigo-800 mb-4 font-comic">Join the Adventure!</h1>
        <p className="text-indigo-700 mb-8 text-center font-comic">
          Create your magical account and start your journey!
        </p>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4 font-semibold font-comic">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-lg w-full bg-gradient-to-br from-pink-100 to-blue-100 border-4 border-indigo-400">
          <div className="mb-4 relative">
            <FaEnvelope className="absolute top-3 left-3 text-indigo-400" size={20} />
            <input
              type="username"
              placeholder="Your Magical username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              required
              className="w-full p-3 pl-10 border-2 border-indigo-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200 placeholder-indigo-400 font-comic text-indigo-700"
              aria-label="username"
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
  className="group w-full text-white p-3 rounded-full shadow-md font-comic text-lg font-bold flex items-center justify-center overflow-hidden relative hover:shadow-lg transition-shadow duration-200 transform hover:scale-[1.02] hover:brightness-[1.1]"
  style={{
    background: `linear-gradient(
      90deg,
      #f6b73c 0%,
      #f18271 20%,
      #f97316 40%,
      #f6b73c 60%,
      #f18271 80%,
      #f97316 100%
    )`,
    backgroundSize: '200% 100%',
    animation: 'gradientMove 3s linear infinite'
  }}
>
  <FaRocket className="mr-2 group-hover:-translate-y-0.5 transition-transform" />
  Start Your Adventure!
  <style>
    {`
      @keyframes gradientMove {
        0% {
          background-position: 0% 50%;
        }
        100% {
          background-position: 200% 50%;
        }
      }
      .hover\\:brightness-\\[1\\.1\\]:hover {
        filter: brightness(1.1);
      }
    `}
  </style>
</button>

          <p className="text-center text-indigo-600 mt-4 font-comic">
            Already on the journey?{' '}
            <a href="/login" className="text-yellow-600 hover:underline font-bold">
              Log In Here
            </a>
          </p>
        </form>
      </motion.div>

      {/* Right Side Image */}
      <motion.div
        className="w-1/2 flex items-center justify-center hidden md:flex relative"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="—Pngtree—cartoon start school season flying_5765912.gif"
          alt="Illustration"
          className="max-w-lg h-auto"
        />
        <motion.div
          className="absolute top-10 right-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <FaSun className="text-yellow-400" size={48} />
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-10"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FaMoon className="text-indigo-400" size={36} />
        </motion.div>
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

export default Signup;