import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      router.push('/login'); // Redirect to login after successful signup
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-500 to-blue-500">
      <motion.div
        className="w-full max-w-md flex flex-col items-center justify-center p-8 mx-auto"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold text-white mb-4">Sign Up</h1>
        <p className="text-white mb-8 text-center">
          Join us to start your journey! Create your account now.
        </p>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4 font-semibold">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full bg-gradient-to-br from-purple-100 to-blue-100">
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
            Sign Up
          </button>
          <p className="text-center text-sm mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Log In
            </a>
          </p>
        </form>
      </motion.div>

      {/* Right Side Image */}
      <motion.div
        className="w-1/2 flex items-center justify-center hidden md:flex"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="—Pngtree—cartoon start school season flying_5765912.gif" // Replace with the path to your image
          alt="Illustration"
          className="max-w-lg h-auto" // Set max width for the image
        />
      </motion.div>
    </div>
  );
};

export default Signup;
