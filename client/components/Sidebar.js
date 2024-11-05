import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaBook,
  FaChartLine,
  FaCog,
  FaBars,
  FaSignOutAlt,
  FaGamepad,
  FaGift,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";
import useSound from "use-sound";

const AnimalIcon = ({ animal }) => {
  const animalEmojis = {
    lion: "🦁",
    elephant: "🐘",
    giraffe: "🦒",
    monkey: "🐵",
    fox: "🦊",
    penguin: "🐧",
  };

  return (
    <span className="text-4xl" role="img" aria-label={animal}>
      {animalEmojis[animal]}
    </span>
  );
};

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
  const [isSoundOn, setIsSoundOn] = useState(false);
  const router = useRouter();
  const { pathname } = router;

  const [play, { stop }] = useSound('/sounds/click.mp3', {
    loop: true,
    volume: 0.5,
  });

  useEffect(() => {
    const storedState = localStorage.getItem("sidebarCollapsed");
    if (storedState) {
      setIsCollapsed(JSON.parse(storedState));
    }

    if (isSoundOn) {
      play();
    }

    return () => stop();
  }, [play, stop, isSoundOn]);

  const toggleSidebar = () => {
    setIsCollapsed((prevState) => {
      const newState = !prevState;
      localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
      return newState;
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const storedSoundState = localStorage.getItem("soundState");
    if (storedSoundState) {
      setIsSoundOn(JSON.parse(storedSoundState)); // Retrieve saved sound state
    }
  
    if (isSoundOn) {
      play(); // Play sound if the state is "on"
    }
  
    return () => stop(); // Stop sound on cleanup
  }, [play, stop, isSoundOn]);
  
  const toggleSound = () => {
    setIsSoundOn((prevState) => {
      const newState = !prevState;
      localStorage.setItem("soundState", JSON.stringify(newState)); // Save sound state
      if (newState) {
        play(); // Play sound if turned on
      } else {
        stop(); // Stop sound if turned off
      }
      return newState;
    });
  };
  
  const menuItems = [
    { name: "Home", icon: "lion", link: "/dashboard" },
    { name: "Resources", icon: "elephant", link: "/resources" },
    { name: "Progress", icon: "giraffe", link: "/progress" },
    { name: "Rewards", icon: "fox", link: "/rewards" },
  ];

  const handleMenuClick = (link) => {
    router.push(link);
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  return (
    <div className="relative">
      <motion.div
        className={`bg-gradient-to-r from-cyan-500 to-indigo-600 min-h-screen flex flex-col items-center rounded-r-3xl shadow-lg fixed lg:relative z-10 transition-transform transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        animate={{ width: isCollapsed ? 80 : 288 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex justify-between items-center w-auto p-4">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                className="flex-grow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Image src="/logo (2).png" alt="LinguaKids" width={250} height={100} />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            className="text-white z-10"
            onClick={toggleSidebar}
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.9, rotate: -15 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <FaBars className="text-3xl" />
          </motion.button>
        </div>

        <nav
          className={`flex flex-col ${
            isCollapsed
              ? "h-full justify-center space-y-12"
              : "space-y-6 w-full px-6"
          }`}
        >
          {menuItems.map((item, index) => (
            <motion.a
              key={index}
              className={`text-white flex flex-auto items-center transition duration-200 text-xl cursor-pointer ${
                isCollapsed ? "justify-center" : ""
              } ${
                pathname === item.link ? "bg-indigo-300 rounded-lg p-2" : ""
              }`}
              whileHover={{
                scale: 1.1,
                color: "#FFEB3B",
                backgroundColor: "#4c51bf",
                borderRadius: "12px",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMenuClick(item.link)}
            >
              <motion.div
                className="flex items-center"
                animate={{ width: isCollapsed ? "auto" : "100%" }}
              >
                <AnimalIcon animal={item.icon} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      className="ml-3 font-bold"
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

        <div className={`mt-5 w-full ${isCollapsed ? "pb-6" : "px-6 pb-6"}`}>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.button
                onClick={handleLogout}
                className="mb-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold w-full transition-transform transform hover:scale-105 flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <FaSignOutAlt className="mr-2" /> Log-Out
              </motion.button>
            )}
          </AnimatePresence>
          <motion.div
            className="flex flex-col items-center"
            animate={{ scale: isCollapsed ? 0.6 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatedProgressBar
              value={70}
              size={isCollapsed ? "small" : "large"}
            />
            {!isCollapsed && (
              <motion.p
                className="mt-4 text-xl text-white font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Today's Progress
              </motion.p>
            )}
          </motion.div>
        </div>

        <motion.button
          onClick={toggleSound}
          className={`text-white ${isCollapsed ? 'mt-4' : 'mt-2'} transition-transform transform hover:scale-110`}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          {isSoundOn ? <FaVolumeUp size={24} /> : <FaVolumeMute size={24} />}
        </motion.button>
      </motion.div>

      <button
        className="lg:hidden fixed top-4 left-4 text-indigo z-20"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <FaBars className="text-3xl text-indigo-700" />
      </button>
    </div>
  );
};

export default Sidebar;