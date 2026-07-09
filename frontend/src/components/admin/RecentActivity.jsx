import {
  UserPlus,
  Inbox,
  Megaphone,
  Award,
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "New staff joined",
    desc: "Dr. John was added to EMS.",
    time: "5 min ago",
    icon: UserPlus,
    color: "text-cyan-400",
  },
  {
    id: 2,
    title: "Application received",
    desc: "New EMT application submitted.",
    time: "20 min ago",
    icon: Inbox,
    color: "text-orange-400",
  },
  {
    id: 3,
    title: "Announcement posted",
    desc: "Weekly training announced.",
    time: "1 hour ago",
    icon: Megaphone,
    color: "text-yellow-400",
  },
  {
    id: 4,
    title: "Certificate generated",
    desc: "Training certificate issued.",
    time: "Today",
    icon: Award,
    color: "text-green-400",
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <h2 className="text-xl font-semibold text-white mb-5">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 border-b border-slate-800 pb-4 last:border-none"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              <item.icon className={item.color} size={20} />
            </div>

            <div className="flex-1">
              <h3 className="text-white font-medium">
                {item.title}
              </h3>

              <p className="text-sm text-slate-400">
                {item.desc}
              </p>
            </div>

            <span className="text-xs text-slate-500">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
