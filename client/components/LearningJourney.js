import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const LearningJourney = ({ games }) => (
  <motion.div className="bg-white p-8 rounded-2xl shadow-lg" whileHover={{ scale: 1.02 }}>
    <h2 className="text-3xl font-bold mb-6 text-indigo-600">Your Learning Journey</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {games.map((game) => (
        <motion.div key={game.id} className="bg-indigo-100 p-6 rounded-xl" whileHover={{ scale: 1.05 }}>
          <h3 className="text-xl font-bold mb-4">{game.name}</h3>
          <CircularProgressbar
            value={game.progress}
            text={`${game.progress}%`}
            styles={buildStyles({
              textColor: "#4F46E5",
              pathColor: "#4F46E5",
              trailColor: "#E0E7FF",
            })}
          />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default LearningJourney;
