import { motion } from "framer-motion";
import { FaStar, FaTrophy } from "react-icons/fa";

const Achievements = () => (
  <motion.div className="bg-white p-8 rounded-2xl shadow-lg" whileHover={{ scale: 1.02 }}>
    <h2 className="text-3xl font-bold mb-6 text-indigo-600">Achievements</h2>
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <FaStar className="text-yellow-400 text-4xl mr-4" />
        <div>
          <p className="text-2xl font-bold">10 Stars Earned</p>
          <p className="text-gray-600">Keep up the great work!</p>
        </div>
      </div>
      <FaTrophy className="text-indigo-400 text-6xl" />
    </div>
  </motion.div>
);

export default Achievements;
