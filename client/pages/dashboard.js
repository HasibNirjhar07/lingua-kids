import React, { useEffect, useState } from "react";
import {
  FaHeadphones,
  FaBookOpen,
  FaPlay,
  FaMicrophone,
  FaStar,
  FaTrophy,
  FaBell,
  FaGem,
  FaUser,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import NotificationPanel from "@/components/NotificationPanel";
import Achievements from "@/components/Achievments";
import DailyStreak from "@/components/DailyStreak";
import LearningJourney from "@/components/LearningJourney";
import Leaderboard from "@/components/Leaderboard";

const Dashboard = () => {
  const [user, setUser] = useState({
    id: null,
    name: "Danish Colt",
    username: "danish_colt",
    email: "danish@example.com",
    points: 90,
    notifications: 5,
  });

  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  
  const [progressData, setProgressData] = useState({
    listening: 0,
    reading: 0,
    learnWords: 0,
    speaking: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/dashboard", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          // Make sure the user data includes the id field
          setUser(prev => ({
            ...prev,
            ...data.user,
            id: data.user.id || prev.id  // Ensure id is set
          }));
          fetchFavoriteGames(token);
        } else {
          setError(data.error);
          router.push("/login");
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to fetch user data");
      }
    };

    const fetchFavoriteGames = async (token) => {
      try {
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
      } catch (err) {
        console.error("Error fetching games:", err);
      }
    };

    fetchUserInfo();
  }, [router]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressData({
        listening: 60,
        reading: 45,
        learnWords: 80,
        speaking: 20,
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Simulating data fetch
    setTimeout(() => {
      setGames([
        { id: 1, name: "Vocabulary Quest", progress: 75 },
        { id: 2, name: "Grammar Challenge", progress: 60 },
        { id: 3, name: "Listening Master", progress: 40 },
      ]);
    }, 1000);
  }, []);

  const progressVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      rotate: [0, 10, -10, 0],
      transition: {
        delay: i * 0.3,
        duration: 1.2,
        ease: "easeInOut",
      },
    }),
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <Sidebar />
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {/* Header */}
        <Header
          user={user}
          showNotifications={showNotifications}
          toggleNotifications={toggleNotifications}
        />
        <NotificationPanel
          show={showNotifications}
          notifications={[
            "You've completed a new lesson!",
            "Daily streak bonus: +5 points",
            "New vocabulary quiz available",
          ]}
        />

        {/* Progress Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Listening */}
          <motion.div
            className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 relative"
            whileHover={{ scale: 1.05, rotate: -3 }}
          >
            <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Beginner</div>
            <FaHeadphones className="text-white text-6xl mb-4 animate-bounce" />
            <h2 className="text-3xl font-bold text-white mb-2">Listening</h2>
            <p className="text-white text-xl mb-4">785 Words</p>
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={progressVariants}
              className="w-24 h-24 mx-auto mb-6"
            >
              <CircularProgressbar
                value={progressData.listening}
                text={`${progressData.listening}%`}
                styles={buildStyles({
                  pathTransitionDuration: 2,
                  pathColor: "#fbbf24",
                  textColor: "#fff",
                  trailColor: "#fff5cc",
                })}
              />
            </motion.div>
            <motion.button
              onClick={() => router.push("/Listening/listeningfrontpage")}
              className="mt-6 bg-white text-yellow-500 px-6 py-3 rounded-full text-xl font-bold hover:bg-yellow-500 hover:text-white transition duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Start
            </motion.button>
          </motion.div>

          {/* Reading */}
          <motion.div
            className="bg-gradient-to-br from-pink-400 to-pink-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 relative"
            whileHover={{ scale: 1.05, rotate: 3 }}
          >
            <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Beginner</div>
            <FaBookOpen className="text-white text-6xl mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold text-white mb-2">Reading</h2>
            <p className="text-white text-xl mb-4">10 Passages</p>
            <motion.div
              initial="hidden"
              animate="visible"
              custom={1}
              variants={progressVariants}
              className="w-24 h-24 mx-auto mb-6"
            >
              <CircularProgressbar
                value={progressData.reading}
                text={`${progressData.reading}%`}
                styles={buildStyles({
                  pathTransitionDuration: 2,
                  pathColor: "#ec4899",
                  textColor: "#fff",
                  trailColor: "#ffebef",
                })}
              />
            </motion.div>
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
            className="bg-gradient-to-br from-blue-400 to-blue-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 relative"
            whileHover={{ scale: 1.05, rotate: -3 }}
          >
            <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Beginner
            </div>
            <FaPlay className="text-white text-6xl mb-4 animate-spin" />
            <h2 className="text-3xl font-bold text-white mb-2">Writing</h2>
            <p className="text-white text-xl mb-4">17 Words</p>
            <motion.div
              initial="hidden"
              animate="visible"
              custom={2}
              variants={progressVariants}
              className="w-24 h-24 mx-auto mb-6"
            >
              <CircularProgressbar
                value={progressData.learnWords}
                text={`${progressData.learnWords}%`}
                styles={buildStyles({
                  pathTransitionDuration: 2,
                  pathColor: "#3b82f6",
                  textColor: "#fff",
                  trailColor: "#e0f2fe",
                })}
              />
            </motion.div>
            <motion.button
              className="mt-6 bg-white text-blue-500 px-6 py-3 rounded-full text-xl font-bold hover:bg-blue-500 hover:text-white transition duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push('/Writing/writingfrontpage')}
            >
              Start
            </motion.button>
          </motion.div>

          {/* Speaking */}
          <motion.div
            className="bg-gradient-to-br from-green-500 to-green-300 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 relative"
            whileHover={{ scale: 1.05, rotate: -3 }}
          >
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Beginner</div>
            <FaMicrophone
              className="text-white text-6xl mb-4"
              style={{
                filter: "drop-shadow(0px 0px 10px yellow)",
                animation: "glow 1.5s infinite alternate",
              }}
            />
            <h2 className="text-3xl font-bold text-white mb-2">
              Practice Speaking
            </h2>
            <p className="text-white text-xl mb-4">10 Sentences</p>
            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={progressVariants}
              className="w-24 h-24 mx-auto mb-6"
            >
              <CircularProgressbar
                value={progressData.speaking}
                text={`${progressData.speaking}%`}
                styles={buildStyles({
                  pathTransitionDuration: 2,
                  pathColor: "#10b981",
                  textColor: "#fff",
                  trailColor: "#d1fae5",
                })}
              />
            </motion.div>
            <motion.button
              onClick={() => router.push("/Speaking/speakingfrontpage")}
              className="mt-6 bg-white text-green-600 px-6 py-3 rounded-full text-xl font-bold hover:bg-green-500 hover:text-white transition duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Start Speaking
            </motion.button>
          </motion.div>
        </div>
        
        {/* Achievements and Daily Streak */}
        <div className="space-y-8">
          {/* Achievements and Daily Streak */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Achievements />
            <DailyStreak />
          </div>

          {/* Learning Journey */}
          <div>
            <LearningJourney games={games} />
          </div>

          {/* Leaderboard - Pass the complete user object */}
          <div>
            <Leaderboard user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.hideNavbar = true;
export default Dashboard;