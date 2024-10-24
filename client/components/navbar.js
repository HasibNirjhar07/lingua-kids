import { motion } from "framer-motion";
import {
  FaBook,
  FaTree,
  FaRocket,
  FaPencilAlt,
  FaSearch,
} from "react-icons/fa";

const Navbar = () => {
  const handleScrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
            { text: "Features", icon: FaTree, id: "features" },
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

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Search for fun!"
            className="bg-white/50 rounded-full py-2 px-4 pr-10 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-900 placeholder-indigo-700"
          />
          <FaSearch className="absolute right-3 top-3 text-indigo-700" />
        </motion.div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
