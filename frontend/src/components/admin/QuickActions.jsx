import { Link } from "react-router-dom";
import {
  UserPlus,
  Inbox,
  IdCard,
  Award,
  Megaphone,
  Settings,
} from "lucide-react";

const actions = [
  {
    title: "Add Staff",
    icon: UserPlus,
    link: "/admin?tab=staff",
    color: "bg-cyan-600",
  },
  {
    title: "Applications",
    icon: Inbox,
    link: "/admin?tab=applications",
    color: "bg-orange-600",
  },
  {
    title: "Generate ID",
    icon: IdCard,
    link: "/admin?tab=idcards",
    color: "bg-indigo-600",
  },
  {
    title: "Certificate",
    icon: Award,
    link: "/admin?tab=certificates",
    color: "bg-green-600",
  },
  {
    title: "Announcement",
    icon: Megaphone,
    link: "/admin?tab=announcements",
    color: "bg-purple-600",
  },
  {
    title: "Settings",
    icon: Settings,
    link: "/admin?tab=settings",
    color: "bg-slate-700",
  },
];

export default function QuickActions() {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <h2 className="text-xl font-semibold text-white mb-5">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((item) => (
          <Link
            key={item.title}
            to={item.link}
            className={`${item.color} rounded-xl p-5 text-white hover:scale-105 transition-all duration-200`}
          >
            <item.icon size={28} />

            <p className="mt-4 font-medium">
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
