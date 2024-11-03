import { AnimatePresence, motion } from 'framer-motion';
import {
  FaBook,
  FaTree,
  FaRocket,
  FaPencilAlt,
  FaSearch,
  FaUser,
} from "react-icons/fa";

import { useRouter } from "next/router";
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const handleScrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const router = useRouter();
  const pathname = usePathname();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <div className="bg-gradient-to-tl from-yellow-300 via-green-400 to-blue-500 overflow-hidden font-comic">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-4 flex justify-between items-center"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="text-3xl font-bold text-indigo-900"
        >
          <FaBook className="inline-block mr-2" />
          LinguaKids
        </motion.div>
        <div className="hidden md:flex space-x-8">
          {[
            { text: "Features" , icon: FaTree, id: "features" },
            { text: "Testimonials", icon: FaRocket, id: "testimonials" },
            { text: "Fun Facts", icon: FaPencilAlt, id: "fun-facts" },
          ].map((item, index) => (
            <motion.a
              key={item.text}
              onClick={() => handleScrollToSection(item.id)}
              className="hover:underline text-white flex items-center cursor-pointer"
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <item.icon className="mr-2" />
              {item.text}
            </motion.a>
          ))}
        </div>
        <AnimatePresence>
      {pathname !== '/login' && pathname !== '/signup' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(101, 31, 255, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoginClick}
            className="relative text-white font-bold py-1 px-4 rounded-full shadow-lg flex items-center gap-3 overflow-hidden border-2 border-white/20"
            style={{
              background: `linear-gradient(
                90deg,
                rgba(101, 31, 255, 1) 0%,
                rgba(66, 99, 235, 1) 20%,
                rgba(45, 135, 255, 1) 40%,
                rgba(101, 31, 255, 1) 60%,
                rgba(66, 99, 235, 1) 80%,
                rgba(45, 135, 255, 1) 100%
              )`,
              backgroundSize: '200% 100%',
              animation: 'gradientMove 3s linear infinite'
            }}
          >
            <motion.div
              animate={{ 
                y: [0, -2, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="bg-white/30 p-2 rounded-full"
            >
              <FaUser className="text-lg" />
            </motion.div>
            <span className="text-lg tracking-wide">Login</span>
            <style>
              {`
                @keyframes gradientMove {
                  0% {
                    background-position: 0% 50%;
                  }
                  100% {
                    background-position: 200% 50%;
                  }
                }
              `}
            </style>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
    
      </motion.nav>
    </div>
  );
};

export default Navbar;
