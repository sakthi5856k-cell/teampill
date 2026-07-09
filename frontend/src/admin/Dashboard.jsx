import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Inbox,
  Image,
  Megaphone,
  Award,
  Bot,
  Activity,
} from "lucide-react";
import { api } from "../lib/api";
import StatCard from "../components/admin/StatCard";

const cards = [
  {
    key: "staff_count",
    title: "Active Staff",
    icon: Users,
    color: "from-cyan-500 to-blue-500",
  },
  {
    key: "applications_pending",
    title: "Pending Applications",
    icon: Inbox,
    color: "from-orange-500 to-red-500",
  },
  {
    key: "applications_total",
    title: "Total Applications",
    icon: UserCheck,
    color: "from-purple-500 to-pink-500",
  },
  {
    key: "gallery_count",
    title: "Gallery",
    icon: Image,
    color: "from-green-500 to-emerald-500",
  },
  {
    key: "announcements_count",
    title: "Announcements",
    icon: Megaphone,
    color: "from-yellow-500 to-orange-500",
  },
  {
    key: "certificates_count",
    title: "Certificates",
    icon: Award,
    color: "from-indigo-500 to-violet-500",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-1">
          Welcome back, Commander 👋
        </p>
      </div>

<div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
  {cards.map((card) => (
    <StatCard
      key={card.key}
      title={card.title}
      value={stats[card.key] ?? 0}
      icon={card.icon}
      color={card.color}
      change="+12%"
    />
  ))}
</div>

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h2 className="text-white text-xl font-semibold">
            Discord Status
          </h2>

          <div className="flex items-center gap-3 mt-5">

            <Bot className="text-green-400" />

            <div>
              <p className="text-white">
                Bot Online
              </p>

              <span className="text-slate-400 text-sm">
                Connected Successfully
              </span>
            </div>

          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h2 className="text-white text-xl font-semibold">
            Server Activity
          </h2>

          <div className="flex items-center gap-3 mt-5">

            <Activity className="text-cyan-400" />

            <div>
              <p className="text-white">
                Server Running
              </p>

              <span className="text-slate-400 text-sm">
                EMS System Healthy
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
