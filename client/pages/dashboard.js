import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaBook,
  FaChartLine,
  FaCog,
  FaPlay,
  FaHeadphones,
  FaBookOpen,
  FaStar,
  FaTrophy,
  FaMicrophone,
} from "react-icons/fa";
import { motion } from "framer-motion";

import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";

import "react-circular-progressbar/dist/styles.css";

 


import ReadingManualPage from "./Reading/readingfrontpage";

const Dashboard = () => {
  const [user, setUser] = useState({
    name: "Danish Colt",
    points: 90,
    notifications: 5,
  });
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserInfo = async () => {
      const response = await fetch("http://localhost:3000/auth/dashboard", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        fetchFavoriteGames(token);
      } else {
        setError(data.error);
        router.push("/login");
      }
    };

    const fetchFavoriteGames = async (token) => {
      const response = await fetch("http://localhost:3000/auth/games", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setGames(data.games);
      } else {
        console.error(data.error);
      }
    };

    fetchUserInfo();
  }, [router]);

  const handleAddGame = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/auth/games", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newGame }),
    });

    const data = await response.json();
    if (response.ok) {
      setGames([...games, data.game]);
      setNewGame("");
    } else {
      setError(data.error);
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

 



  return (
    <div className="flex min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl lg:text-3xl font-bold text-white font-comic mb-4 lg:mb-0">
            Hi {user.email}!
          </h1>
          <div className="flex items-center text-lg space-x-6 bg-white bg-opacity-20 rounded-full px-6 py-3">
            <div className="text-yellow-300">🔔 {user.notifications}</div>
            <div className="text-yellow-300">💎 {user.points}</div>
            <div className="text-white">{user.name}</div>
          </div>
        </div>

        {/* Today's Plan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {/* Listening */}
          <motion.div
            className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
            whileHover={{ scale: 1.05, rotate: -3 }}
          >
            <FaHeadphones className="text-white text-6xl mb-4 animate-bounce" />
            <h2 className="text-3xl font-bold text-white mb-2">Listening</h2>
            <p className="text-white text-xl">785 Words</p>
            <motion.button
              className="mt-6 bg-white text-yellow-500 px-6 py-3 rounded-full text-xl font-bold hover:bg-yellow-500 hover:text-white transition duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Start
            </motion.button>
          </motion.div>

          {/* Reading */}
          <motion.div

            className="bg-gradient-to-br from-pink-400 to-pink-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
            whileHover={{ scale: 1.05, rotate: 3 }}
          >
            <FaBookOpen className="text-white text-6xl mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold text-white mb-2">Reading</h2>
            <p className="text-white text-xl">1290 Characters</p>
            <motion.button

              onClick={() => router.push("/Reading/readingfrontpage")}
              className="mt-6 bg-white text-pink-500 px-6 py-3 rounded-full text-xl font-bold hover:bg-pink-500 hover:text-white transition duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Start
            </motion.button>
          </motion.div>

          {/* Learn Words */}
          <motion.div
            className="bg-gradient-to-br from-blue-400 to-blue-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
            whileHover={{ scale: 1.05, rotate: -3 }}
          >
            <FaPlay className="text-white text-6xl mb-4 animate-spin" />
            <h2 className="text-3xl font-bold text-white mb-2">Learn Words</h2>
            <p className="text-white text-xl">17 Words</p>
            <motion.button
              className="mt-6 bg-white text-blue-500 px-6 py-3 rounded-full text-xl font-bold hover:bg-blue-500 hover:text-white transition duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Start
            </motion.button>
          </motion.div>

          {/* Speaking */}
          <motion.div
  className="bg-gradient-to-br from-green-500 to-green-300 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
  whileHover={{ scale: 1.05, rotate: -3 }}
>
  <div className="relative">
    {/* Green "volume" background effect */}
    <motion.div
   
    />
    
    {/* Microphone with glow effect */}
    <FaMicrophone
      className="relative z-10 text-white text-6xl mb-4"
      style={{
        filter: "drop-shadow(0px 0px 10px yellow)",
        animation: "glow 1.5s infinite alternate",
      }}
    />
  </div>
  
  <h2 className="text-3xl font-bold text-white mb-2">Practice Speaking</h2>
  <p className="text-white text-xl">10 Phrases</p>
  
  <motion.button
    className="mt-6 bg-white text-green-600 px-6 py-3 rounded-full text-xl font-bold hover:bg-green-500 hover:text-white transition duration-300"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    Start Speaking
  </motion.button>
</motion.div>

        </div>

        {/* Achievements Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
          <motion.div
            className="bg-gradient-to-br from-green-400 to-green-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <FaStar className="text-yellow-300 text-6xl mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Achievements</h2>
            <p className="text-white text-xl">10 Stars Earned!</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-orange-400 to-orange-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
            whileHover={{ scale: 1.05, rotate: -5 }}
          >
            <FaTrophy className="text-yellow-300 text-6xl mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Badges</h2>
            <p className="text-white text-xl">5 Badges Unlocked!</p>
          </motion.div>
        </div>

        {/* Progress & Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress */}
          <motion.div
            className="p-8 bg-white rounded-2xl shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-indigo-600">
              Progress
            </h2>
            <div className="flex space-x-6">
              <div className="bg-indigo-100 p-6 rounded-xl text-center flex-1">
                <FaPlay className="text-indigo-500 text-5xl mx-auto mb-2" />
                <p className="font-semibold text-xl">Game Badge</p>
              </div>
              <div className="bg-indigo-100 p-6 rounded-xl text-center flex-1">
                <FaBook className="text-indigo-500 text-5xl mx-auto mb-2" />
                <p className="font-semibold text-xl">Reading Badge</p>
              </div>
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            className="p-8 bg-white rounded-2xl shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-indigo-600">
              Statistics
            </h2>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="font-bold text-3xl text-indigo-600">40 min</p>
                <p className="text-gray-500 text-xl">Tuesday</p>
              </div>
              <div className="w-3 h-40 bg-indigo-400 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

Dashboard.hideNavbar = true;

export default Dashboard;
