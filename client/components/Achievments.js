import { motion } from "framer-motion";
import { FaStar, FaTrophy } from "react-icons/fa";

const Achievements = () => (
  <motion.div
    className="bg-white p-8 rounded-2xl shadow-lg"
    whileHover={{ scale: 1.02 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-3xl font-bold mb-6 text-indigo-600">Achievements</h2>
    <div className="flex justify-between items-center">
      <motion.div
        className="flex items-center"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <FaStar className="text-yellow-400 text-4xl mr-4" />
        </motion.div>
        <div>
          <motion.p
            className="text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            10 Stars Earned
          </motion.p>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Keep up the great work!
          </motion.p>
        </div>
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <FaTrophy className="text-indigo-400 text-6xl" />
      </motion.div>
    </div>
  </motion.div>
);

export default Achievements;