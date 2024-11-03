import { motion, useAnimation, useInView } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useRef, useState } from "react";

const DailyStreak = () => {
  const [progress, setProgress] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      // Trigger animations and set progress when in view
      setProgress(70);
      controls.start({ opacity: 1, y: 0 });
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      className="bg-white p-8 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-indigo-600">Daily Streak</h2>
      <div className="flex justify-between items-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -20 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.p
            className="font-bold text-5xl text-indigo-600"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            7
          </motion.p>
          <p className="text-gray-500 text-xl">Days</p>
        </motion.div>
        <motion.div
          className="w-64 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-pulse"></div>
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              textColor: "#4F46E5",
              pathColor: "#4F46E5",
              trailColor: "#E0E7FF",
            })}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DailyStreak;