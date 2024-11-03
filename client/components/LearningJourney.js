import { motion, useAnimation, useInView } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useRef, useEffect, useState } from "react";

const LearningJourney = ({ games }) => {
  return (
    <motion.div
      className="bg-white p-8 rounded-2xl shadow-lg"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-3xl font-bold mb-6 text-indigo-600">Your Learning Journey</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) => (
          <LearningCard key={game.id} game={game} />
        ))}
      </div>
    </motion.div>
  );
};

const LearningCard = ({ game }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (inView) {
      // Animate the progress from 0 to the actual game progress
      let start = 0;
      const end = game.progress;
      const duration = 1; // seconds
      const increment = Math.ceil(end / (60 * duration)); // Update every 60ms

      const timer = setInterval(() => {
        if (start < end) {
          start += increment;
          setAnimatedProgress(Math.min(start, end)); // Ensure we don't exceed the end value
        } else {
          clearInterval(timer);
        }
      }, 60);

      controls.start({ opacity: 1, y: 0 });
      return () => clearInterval(timer);
    }
  }, [inView, controls, game.progress]);

  return (
    <motion.div
      ref={ref}
      className="bg-indigo-100 p-6 rounded-xl relative shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="text-xl font-bold mb-4">{game.name}</h3>
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-pulse"></div>
        <CircularProgressbar
          value={animatedProgress}
          text={`${animatedProgress}%`}
          styles={buildStyles({
            textColor: "#4F46E5",
            pathColor: "#4F46E5",
            trailColor: "#E0E7FF",
          })}
        />
      </motion.div>
    </motion.div>
  );
};

export default LearningJourney;