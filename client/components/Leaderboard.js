import { motion } from "framer-motion";

const Leaderboard = ({ user }) => (
  <motion.div className="bg-white p-8 rounded-2xl shadow-lg mt-12" whileHover={{ scale: 1.02 }}>
    <h2 className="text-3xl font-bold mb-6 text-indigo-600">Leaderboard</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-indigo-200">
            <th className="p-3 text-lg font-semibold text-gray-700">Rank</th>
            <th className="p-3 text-lg font-semibold text-gray-700">User</th>
            <th className="p-3 text-lg font-semibold text-gray-700">Points</th>
          </tr>
        </thead>
        <tbody>
          {[
            { rank: 1, name: "John Doe", points: 1200 },
            { rank: 2, name: "Jane Smith", points: 1150 },
            { rank: 3, name: "Bob Johnson", points: 1100 },
            { rank: 4, name: user.name, points: user.points },
          ].map((entry, index) => (
            <motion.tr
              key={entry.rank}
              className={`border-b transition-colors duration-200 ease-in-out ${entry.name === user.name ? "bg-yellow-200" : "hover:bg-indigo-50"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <td className="p-3 font-medium text-gray-800">{entry.rank}</td>
              <td className="p-3 font-medium text-gray-800">{entry.name}</td>
              <td className="p-3 font-medium text-gray-800">{entry.points}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export default Leaderboard;
motion.tr
