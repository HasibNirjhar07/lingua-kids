import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaUser, FaHeadphones, FaBookOpen, FaPen, FaMicrophone } from "react-icons/fa";

const Leaderboard = ({ user }) => {
  const [leaderboardType, setLeaderboardType] = useState("listening");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/reading/${leaderboardType}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const data = await response.json();
        setLeaderboardData(data.leaderboard);
        
        // Find user's rank
        const userPosition = data.leaderboard.findIndex(entry => entry.user_id === user.id);
        setUserRank(userPosition !== -1 ? userPosition + 1 : null);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [leaderboardType, user]);

  const renderLeaderboardIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="text-yellow-500 text-xl" />;
    if (rank === 2) return <FaTrophy className="text-gray-400 text-xl" />;
    if (rank === 3) return <FaTrophy className="text-amber-700 text-xl" />;
    return <span className="font-bold text-gray-600">{rank}</span>;
  };

  return (
    <motion.div 
      className="bg-white p-6 rounded-2xl shadow-lg mt-12"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-600">Leaderboard</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setLeaderboardType("listening")}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              leaderboardType === "listening"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FaHeadphones className="mr-2" /> Listening
          </button>
          <button
            onClick={() => setLeaderboardType("reading")}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              leaderboardType === "reading"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FaBookOpen className="mr-2" /> Reading
          </button>
          <button
            onClick={() => setLeaderboardType("writing")}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              leaderboardType === "writing"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FaPen className="mr-2" /> Writing
          </button>
          <button
            onClick={() => setLeaderboardType("speaking")}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              leaderboardType === "speaking"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FaMicrophone className="mr-2" /> Speaking
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-100 rounded-lg">
                <th className="p-3 text-lg font-semibold text-gray-700 rounded-l-lg">Rank</th>
                <th className="p-3 text-lg font-semibold text-gray-700">User</th>
                <th className="p-3 text-lg font-semibold text-gray-700">Attempts</th>
                <th className="p-3 text-lg font-semibold text-gray-700">Score</th>
                <th className="p-3 text-lg font-semibold text-gray-700 rounded-r-lg">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <motion.tr
                  key={entry.user_id}
                  className={`border-b transition-colors duration-200 ease-in-out ${
                    entry.user_id === user.id
                      ? "bg-yellow-100"
                      : "hover:bg-indigo-50"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="p-3 font-medium text-gray-800">
                    {renderLeaderboardIcon(index + 1)}
                  </td>
                  <td className="p-3 font-medium text-gray-800 flex items-center">
                    <FaUser className="mr-2 text-indigo-500" />
                    {entry.username}
                    {entry.user_id === user.id && (
                      <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-medium text-gray-800">{entry.passages_attempted}</td>
                  <td className="p-3 font-medium text-gray-800">{Math.round(entry.final_score)}</td>
                  <td className="p-3 font-medium text-gray-800">
                    {(entry.accuracy * 100).toFixed(1)}%
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {userRank === null && !loading && !error && (
        <div className="mt-4 p-4 bg-indigo-50 rounded-lg text-center">
          <p className="text-indigo-600">You haven't completed any {leaderboardType} exercises yet.</p>
          <button
            onClick={() => router.push(`/${leaderboardType}/${leaderboardType}frontpage`)}
            className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors"
          >
            Start {leaderboardType} now
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Leaderboard;