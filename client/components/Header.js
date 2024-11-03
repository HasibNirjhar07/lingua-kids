// components/Header.jsx
import { FaBell, FaGem, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

const Header = ({ user, showNotifications, toggleNotifications }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col lg:flex-row justify-between items-center mb-10"
    >
      <h1 className="text-4xl lg:text-5xl font-bold text-white font-comic mb-4 lg:mb-0">
        Welcome back, {user.name}!
      </h1>
      <div className="flex items-center text-lg space-x-6 bg-white bg-opacity-20 rounded-full px-6 py-3">
        <motion.div whileHover={{ scale: 1.2 }} onClick={toggleNotifications} className="text-yellow-300 cursor-pointer relative">
          <FaBell size={24} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {user.notifications}
          </span>
        </motion.div>
        <motion.div whileHover={{ scale: 1.2 }} className="text-yellow-300 cursor-pointer flex items-center">
          <FaGem size={24} className="mr-2" />
          <span>{user.points}</span>
        </motion.div>
        <div className="text-white flex items-center">
          <FaUser size={24} className="mr-2" />
          <span>{user.email}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
