import { motion } from 'framer-motion';

function StatCard({ icon, label, value, tone }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`glass panel rounded-2xl p-5 ${tone}`}
    >
      <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-teal-500/20 via-cyan-500/20 to-orange-500/20 p-2 text-cyan-700 dark:text-cyan-300">{icon}</div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </motion.div>
  );
}

export default StatCard;
