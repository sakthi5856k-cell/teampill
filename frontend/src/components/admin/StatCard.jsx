import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "from-cyan-500 to-blue-500",
  change = "+0%",
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl bg-gradient-to-r ${color} p-[1px]`}
    >
      <div className="bg-slate-900 rounded-2xl p-6">

        <div className="flex justify-between items-start">

          <div>
            <p className="text-slate-400 text-sm">
              {title}
            </p>

            <h2 className="text-4xl font-bold text-white mt-2">
              {value}
            </h2>

            <div className="flex items-center gap-1 mt-4">
              <TrendingUp size={16} className="text-green-400" />

              <span className="text-green-400 text-sm">
                {change}
              </span>
            </div>
          </div>

          <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center">
            <Icon size={28} className="text-cyan-400" />
          </div>

        </div>

      </div>
    </motion.div>
  );
}
