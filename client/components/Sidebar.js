"use client";

import React, { useState } from "react";
import { FaHome, FaBook, FaChartLine, FaCog, FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

const AnimatedProgressBar = ({ value, size = "large" }) => {
  const circumference = 2 * Math.PI * 45;
  const progress = ((100 - value) / 100) * circumference;

  const sizeClass = size === "small" ? "w-16 h-16" : "w-40 h-40";
  const strokeWidth = size === "small" ? 8 : 10;
  const textSize = size === "small" ? "text-xl" : "text-4xl";
  const starSize = size === "small" ? 0.75 : 0.9;

  return (
    <div className={`relative ${sizeClass}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#FFD700"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference,
          }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        {[0, 1, 2, 3].map((index) => (
          <motion.path
            key={index}
            d="M10 0l3.09 6.26L20 7.27l-5 4.87 1.18 6.88L10 15.4l-6.18 3.62L5 12.14 0 7.27l6.91-1.01L10 0z"
            fill="#FFD700"
            initial={{ scale: 0, x: 40, y: 40 }}
            animate={{
              scale: starSize,
              x: 50 + 35 * Math.cos((index * Math.PI) / 2),
              y: 50 + 35 * Math.sin((index * Math.PI) / 2),
            }}
            transition={{
              delay: 1 + index * 0.2,
              duration: 0.5,
              type: "spring",
            }}
          />
        ))}
      </svg>
      <motion.div
        className={`absolute inset-0 flex items-center justify-center ${textSize} font-bold text-yellow-300`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 10 }}
      >
        {value}%
      </motion.div>
    </div>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const menuItems = [
    { name: "Home", icon: FaHome, href: "/dashboard" },
    { name: "Training", icon: FaBook },
    { name: "Progress", icon: FaChartLine },
    { name: "Settings", icon: FaCog },
  ];

  return (
    <div className="relative">
      {/* Sidebar for Desktop */}
      <motion.div
        className={`bg-gradient-to-b from-indigo-600 to-purple-700 h-screen flex flex-col items-center rounded-r-3xl shadow-lg fixed lg:relative z-10 transition-transform transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        animate={{ width: isCollapsed ? 80 : 288 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.button
          className="absolute top-4 right-4 text-white z-10 lg:hidden"
          onClick={toggleMobileMenu}
          whileHover={{ scale: 1.2, rotate: 15 }}
          whileTap={{ scale: 0.9, rotate: -15 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <FaBars className="text-3xl" />
        </motion.button>

        <motion.button
          className="absolute top-4 right-4 text-white z-10 hidden lg:block"
          onClick={toggleSidebar}
          whileHover={{ scale: 1.2, rotate: 15 }}
          whileTap={{ scale: 0.9, rotate: -15 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <FaBars className="text-3xl" />
        </motion.button>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              className="mb-12 text-center w-full p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-yellow-300 text-4xl font-bold tracking-wide font-comic">
                LinguaKids
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <nav
          className={`flex flex-col ${
            isCollapsed ? "h-full justify-center space-y-12" : "space-y-6 w-full px-6"
          }`}
        >
          {menuItems.map((item, index) => (
            <motion.a
              key={index}
              className={`text-white flex items-center transition duration-200 text-xl cursor-pointer ${
                isCollapsed ? "justify-center" : ""
              }`}
              whileHover={{ scale: 1.1, color: "#FFEB3B", backgroundColor: "#4c51bf", borderRadius: "12px" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="flex items-center"
                animate={{ width: isCollapsed ? "auto" : "100%" }}
              >
                <item.icon className={`text-2xl ${isCollapsed ? "mx-auto" : "mr-3"}`} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.a>
          ))}
        </nav>

        <div className={`mt-auto w-full ${isCollapsed ? "pb-6" : "px-6 pb-6"}`}>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.button
                onClick={handleLogout}
                className="mb-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold w-full transition-transform transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                Logout
              </motion.button>
            )}
          </AnimatePresence>
          <motion.div
            className="flex flex-col items-center"
            animate={{ scale: isCollapsed ? 0.6 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatedProgressBar value={70} size={isCollapsed ? "small" : "large"} />
            {!isCollapsed && (
              <motion.p
                className="mt-4 text-xl text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Today's Progress
              </motion.p>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Sidebar Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 text-indigo z-20"
        onClick={toggleMobileMenu}
      >
        <FaBars className="text-3xl" />
      </button>
    </div>
  );
};

export default Sidebar;
