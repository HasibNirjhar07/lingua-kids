
import { motion, AnimatePresence } from "framer-motion";

const NotificationPanel = ({ show, notifications }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-lg p-4 mb-6 shadow-lg">
          <h3 className="font-bold text-lg mb-2">Notifications</h3>
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>{notification}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
