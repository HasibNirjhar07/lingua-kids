import { useEffect, useState } from 'react';
import { FaHome, FaBook, FaChartLine, FaCog, FaPlay, FaHeadphones, FaBookOpen, FaStar, FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CircularProgress } from "@nextui-org/progress";

const Dashboard = () => {
  const [progress, setProgress] = useState(67); // Example progress
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState('');
  const [user, setUser] = useState({ name: 'Danish Colt', points: 90, notifications: 5 });

  useEffect(() => {
    // Fetch data if needed (games, user info, etc.)
  }, []);

  const handleAddGame = (e) => {
    e.preventDefault();
    setGames([...games, { id: games.length + 1, name: newGame }]);
    setNewGame('');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-200 to-yellow-300">
      {/* Sidebar */}
      <motion.div 
        className="bg-blue-500 w-64 p-6 flex flex-col items-start rounded-lg shadow-lg"
        initial={{ x: -200 }} 
        animate={{ x: 0 }} 
        transition={{ type: 'spring', stiffness: 50 }}
      >
        <div className="mb-12 text-center">
          <h1 className="text-white text-4xl font-bold tracking-wide font-fun">LinguaKids</h1>
        </div>
        <nav className="flex flex-col space-y-6">
          {['Home', 'Training', 'Progress', 'Settings'].map((item, index) => (
            <motion.a 
              key={index}
              whileHover={{ scale: 1.1, color: '#FFD700', rotate: 5 }} // Gold color on hover
              className="text-white flex items-center transition duration-200"
            >
              {item === 'Home' && <FaHome className="mr-3" />}
              {item === 'Training' && <FaBook className="mr-3" />}
              {item === 'Progress' && <FaChartLine className="mr-3" />}
              {item === 'Settings' && <FaCog className="mr-3" />}
              {item}
            </motion.a>
          ))}
        </nav>

        {/* Today's Progress */}
        <div className="mt-auto flex items-center flex-col text-white">
          <CircularProgress variant="determinate" value={progress} size={80} thickness={5} />
          <p className="mt-4">Today's Progress</p>
          <p className="text-lg font-bold">{progress}% of 100</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-blue-600 font-fun">Hi {user.name}!</h1>
          <div className="flex items-center text-lg space-x-4">
            <div className="text-blue-500">🔔 {user.notifications}</div>
            <div className="text-blue-500">💎 {user.points}</div>
            <div className="text-blue-500">{user.name}</div>
          </div>
        </div>

        {/* Today's Plan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {/* Listening */}
          <motion.div
            className="bg-yellow-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
            whileHover={{ scale: 1.05, rotate: -3 }}
          >
            <FaHeadphones className="text-white text-5xl mb-4 animate-bounce" />
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Listening</h2>
            <p className="text-white">785 Words</p>
            <button className="mt-4 bg-white text-yellow-500 px-4 py-2 rounded-full hover:bg-yellow-500 hover:text-white transition duration-300">Start</button>
          </motion.div>

          {/* Reading */}
          <motion.div
            className="bg-pink-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
            whileHover={{ scale: 1.05, rotate: 3 }}
          >
            <FaBookOpen className="text-white text-5xl mb-4 animate-pulse" />
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Reading</h2>
            <p className="text-white">1290 Characters</p>
            <button className="mt-4 bg-white text-pink-500 px-4 py-2 rounded-full hover:bg-pink-500 hover:text-white transition duration-300">Start</button>
          </motion.div>

          {/* Learn Words */}
          <motion.div
            className="bg-blue-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
            whileHover={{ scale: 1.05, rotate: -3 }}
          >
            <FaPlay className="text-white text-5xl mb-4 animate-spin" />
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Learn Words</h2>
            <p className="text-white">17 Words</p>
            <button className="mt-4 bg-white text-blue-500 px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition duration-300">Start</button>
          </motion.div>
        </div>

        {/* Achievements Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
          <motion.div
            className="bg-green-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <FaStar className="text-white text-5xl mb-4" />
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Achievements</h2>
            <p className="text-white">10 Stars Earned!</p>
          </motion.div>

          <motion.div
            className="bg-orange-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
            whileHover={{ scale: 1.05, rotate: -5 }}
          >
            <FaTrophy className="text-white text-5xl mb-4" />
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Badges</h2>
            <p className="text-white">5 Badges Unlocked!</p>
          </motion.div>
        </div>

        {/* Progress & Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Progress</h2>
            <div className="flex space-x-4">
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <FaPlay className="text-blue-500 text-4xl" />
                <p className="font-semibold">Game Badge</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <FaBook className="text-blue-500 text-4xl" />
                <p className="font-semibold">Reading Badge</p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Statistics</h2>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="font-bold text-lg">40 min</p>
                <p className="text-gray-500">Tuesday</p>
              </div>
              <div className="w-2 h-32 bg-blue-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
