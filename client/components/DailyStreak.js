import { motion, useAnimation, useInView } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useRef, useState } from "react";

const DailyStreak = () => {
  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    const fetchStreak = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:3000/reading/streak", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch streak data");
        }

        const data = await response.json();
        setStreak(data.streak);
        // Calculate progress as a percentage (max 100%)
        // Assuming a 30-day goal is 100%
        const calculatedProgress = Math.min((data.streak / 30) * 100, 100);
        setProgress(calculatedProgress);
      } catch (err) {
        console.error("Error fetching streak:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className="bg-white p-8 rounded-2xl shadow-lg"
    >
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Daily Streak</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-700"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">
          {error}. Please try again later.
        </div>
      ) : (
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="text-6xl font-bold text-purple-800 mb-2">
              {streak}
            </div>
            <div className="text-xl text-gray-600">Days</div>
          </div>
          
          <div className="w-28 h-28">
            <CircularProgressbar
              value={progress}
              text={`${streak} days`}
              styles={buildStyles({
                pathColor: 
                  streak >= 30 ? "#10B981" :
                  streak >= 20 ? "#3B82F6" :
                  streak >= 10 ? "#8B5CF6" :
                  "#EC4899",
                textColor: "#6B46C1",
                trailColor: "#F3F4F6",
                textSize: "12px",
                pathTransitionDuration: 1.5,
              })}
            />
          </div>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <motion.div
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {streak >= 30 ? (
            "Amazing consistency! You're a language learning master!"
          ) : streak >= 20 ? (
            "Great job! You're building a strong learning habit!"
          ) : streak >= 10 ? (
            "Nice work! Keep the momentum going!"
          ) : streak >= 5 ? (
            "Good start! Try to maintain your streak!"
          ) : (
            "Start building your language learning streak today!"
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DailyStreak;