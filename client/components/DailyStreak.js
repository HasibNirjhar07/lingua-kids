import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DailyStreak = () => (
  <motion.div className="bg-white p-8 rounded-2xl shadow-lg" whileHover={{ scale: 1.02 }}>
    <h2 className="text-3xl font-bold mb-6 text-indigo-600">Daily Streak</h2>
    <div className="flex justify-between items-center">
      <div className="text-center">
        <p className="font-bold text-5xl text-indigo-600">7</p>
        <p className="text-gray-500 text-xl">Days</p>
      </div>
      <div className="w-64">
        <CircularProgressbar
          value={70}
          text={`${70}%`}
          styles={buildStyles({
            textColor: "#4F46E5",
            pathColor: "#4F46E5",
            trailColor: "#E0E7FF",
          })}
        />
      </div>
    </div>
  </motion.div>
);

export default DailyStreak;
