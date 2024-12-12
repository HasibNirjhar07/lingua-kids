// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   FaHome,
//   FaBook,
//   FaChartLine,
//   FaCog,
//   FaPlay,
//   FaHeadphones,
//   FaBookOpen,
//   FaStar,
//   FaTrophy,
//   FaMicrophone,
// } from "react-icons/fa";
// import { useRouter } from "next/router";
// import Sidebar from "@/components/Sidebar";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";

// const Dashboard = () => {
//   const [user, setUser] = useState({
//     name: "Danish Colt",
//     email: "danish@example.com",
//     points: 90,
//     notifications: 5,
//   });
//   const [games, setGames] = useState([]);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     const fetchUserInfo = async () => {
//       const response = await fetch("http://localhost:3000/auth/dashboard", {
//         method: "GET",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setUser(data.user);
//         fetchFavoriteGames(token);
//       } else {
//         setError(data.error);
//         router.push("/login");
//       }
//     };

//     const fetchFavoriteGames = async (token) => {
//       const response = await fetch("http://localhost:3000/auth/games", {
//         method: "GET",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setGames(data.games);
//       } else {
//         console.error(data.error);
//       }
//     };

//     fetchUserInfo();
//   }, [router]);

//   const handleAddGame = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem("token");
//     const response = await fetch("http://localhost:3000/auth/games", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name: newGame }),
//     });

//     const data = await response.json();
//     if (response.ok) {
//       setGames([...games, data.game]);
//       setNewGame("");
//     } else {
//       setError(data.error);
//     }
//   };

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   useEffect(() => {
//     // Simulating data fetch
//     setTimeout(() => {
//       setGames([
//         { id: 1, name: "Vocabulary Quest", progress: 75 },
//         { id: 2, name: "Grammar Challenge", progress: 60 },
//         { id: 3, name: "Listening Master", progress: 40 },
//       ]);
//     }, 1000);
//   }, []);

//   const ProgressCard = ({ title, icon: Icon, progress, color, onClick }) => (
//     <motion.div
//       className={`bg-gradient-to-br from-${color}-400 to-${color}-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300`}
//       whileHover={{ scale: 1.05, rotate: Math.random() > 0.5 ? 3 : -3 }}
//     >
//       <Icon className="text-white text-6xl mb-4" />
//       <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
//       <div className="w-24 h-24 mx-auto mb-4">
//         <CircularProgressbar
//           value={progress}
//           text={`${progress}%`}
//           styles={buildStyles({
//             textColor: "white",
//             pathColor: "white",
//             trailColor: `rgba(255,255,255,0.3)`,
//           })}
//         />
//       </div>
//       <motion.button
//         onClick={onClick}
//         className={`mt-6 bg-white text-${color}-500 px-6 py-3 rounded-full text-xl font-bold hover:bg-${color}-500 hover:text-blue-400 transition duration-300`}
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//       >
//         Start
//       </motion.button>
//     </motion.div>
//   );

//   return (
//     <div className="flex min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
//       <Sidebar />
//       <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="flex flex-col lg:flex-row justify-between items-center mb-10"
//         >
//           <h1 className="text-3xl lg:text-4xl font-bold text-white font-comic mb-4 lg:mb-0">
//             Welcome back, {user.email}!
//           </h1>
//           <div className="flex items-center text-lg space-x-6 bg-white bg-opacity-20 rounded-full px-6 py-3">
//             <motion.div
//               whileHover={{ scale: 1.2 }}
//               className="text-yellow-300 cursor-pointer"
//             >
//               🔔 {user.notifications}
//             </motion.div>
//             <motion.div
//               whileHover={{ scale: 1.2 }}
//               className="text-yellow-300 cursor-pointer"
//             >
//               💎 {user.points}
//             </motion.div>
//             <div className="text-white">{user.email}</div>
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
//           <ProgressCard
//             title="Listening"
//             icon={FaHeadphones}
//             progress={75}
//             color="yellow"
//             onClick={() => console.log("Listening clicked")}
//           />
//           <ProgressCard
//             title="Reading"
//             icon={FaBookOpen}
//             progress={60}
//             color="pink"
//             onClick={() => router.push("/Reading/readingfrontpage")}
//           />
//           <ProgressCard
//             title="Writing"
//             icon={FaPlay}
//             progress={40}
//             color="blue"
//             onClick={() => console.log("Learn Words clicked")}
//           />
//           <ProgressCard
//             title="Speaking"
//             icon={FaMicrophone}
//             progress={85}
//             color="green"
//             onClick={() => router.push("/Speaking/speakingfrontpage")}
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
//           <motion.div
//             className="bg-white p-8 rounded-2xl shadow-lg"
//             whileHover={{ scale: 1.02 }}
//           >
//             <h2 className="text-3xl font-bold mb-6 text-indigo-600">Achievements</h2>
//             <div className="flex justify-between items-center">
//               <div className="flex items-center">
//                 <FaStar className="text-yellow-400 text-4xl mr-4" />
//                 <div>
//                   <p className="text-2xl font-bold">10 Stars Earned</p>
//                   <p className="text-gray-600">Keep up the great work!</p>
//                 </div>
//               </div>
//               <FaTrophy className="text-indigo-400 text-6xl" />
//             </div>
//           </motion.div>

//           <motion.div
//             className="bg-white p-8 rounded-2xl shadow-lg"
//             whileHover={{ scale: 1.02 }}
//           >
//             <h2 className="text-3xl font-bold mb-6 text-indigo-600">Daily Streak</h2>
//             <div className="flex justify-between items-center">
//               <div className="text-center">
//                 <p className="font-bold text-5xl text-indigo-600">7</p>
//                 <p className="text-gray-500 text-xl">Days</p>
//               </div>
//               <div className="w-64">
//                 <CircularProgressbar
//                   value={70}
//                   text={`${70}%`}
//                   styles={buildStyles({
//                     textColor: "#4F46E5",
//                     pathColor: "#4F46E5",
//                     trailColor: "#E0E7FF",
//                   })}
//                 />
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         <motion.div
//           className="bg-white p-8 rounded-2xl shadow-lg"
//           whileHover={{ scale: 1.02 }}
//         >
//           <h2 className="text-3xl font-bold mb-6 text-indigo-600">Your Learning Journey</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {games.map((game) => (
//               <div key={game.id} className="bg-indigo-100 p-6 rounded-xl">
//                 <h3 className="text-xl font-bold mb-4">{game.name}</h3>
//                 <CircularProgressbar
//                   value={game.progress}
//                   text={`${game.progress}%`}
//                   styles={buildStyles({
//                     textColor: "#4F46E5",
//                     pathColor: "#4F46E5",
//                     trailColor: "#E0E7FF",
//                   })}
//                 />
//               </div>
//             ))}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// Dashboard.hideNavbar = true;

// export default Dashboard;

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
    name: "Danish Colt",
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

          {/* Leaderboard */}
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
