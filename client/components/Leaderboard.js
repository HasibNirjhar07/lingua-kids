import { motion } from "framer-motion";

const Leaderboard = ({ user }) => (
  <motion.div className="bg-white p-8 rounded-2xl shadow-lg mt-12" whileHover={{ scale: 1.02 }}>
    <h2 className="text-3xl font-bold mb-6 text-indigo-600">Leaderboard</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-indigo-100">
            <th className="p-3">Rank</th>
            <th className="p-3">User</th>
            <th className="p-3">Points</th>
          </tr>
        </thead>
        <tbody>
          {[
            { rank: 1, name: "John Doe", points: 1200 },
            { rank: 2, name: "Jane Smith", points: 1150 },
            { rank: 3, name: "Bob Johnson", points: 1100 },
            { rank: 4, name: user.email, points: user.points },
          ].map((entry) => (
            <motion.tr
              key={entry.rank}
              className={`border-b ${entry.name === user.name ? "bg-yellow-100" : ""}`}
              whileHover={{ scale: 1.02 }}
            >
              <td className="p-3">{entry.rank}</td>
              <td className="p-3">{entry.name}</td>
              <td className="p-3">{entry.points}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export default Leaderboard;
