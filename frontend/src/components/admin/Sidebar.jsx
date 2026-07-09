import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Inbox,
  CalendarDays,
  Clock3,
 Image,
  Megaphone,
  IdCard,
  Award,
  Bot,
  ClipboardList,
  Settings,
  LogOut,
} from "lucide-react";

const menus = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Staff", icon: Users, path: "/admin/staff" },
  { name: "Staff Profile", icon: UserCircle, path: "/admin/profile" },
  { name: "Applications", icon: Inbox, path: "/admin/applications" },
  { name: "Attendance", icon: CalendarDays, path: "/admin/attendance" },
  { name: "Duty Logs", icon: Clock3, path: "/admin/duty" },
  { name: "Gallery", icon: Image, path: "/admin/gallery" },
  { name: "Announcements", icon: Megaphone, path: "/admin/announcements" },
  { name: "ID Cards", icon: IdCard, path: "/admin/idcards" },
  { name: "Certificates", icon: Award, path: "/admin/certificates" },
  { name: "Discord", icon: Bot, path: "/admin/discord" },
  { name: "Audit Logs", icon: ClipboardList, path: "/admin/audit" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-cyan-400">
          Team Pillbox
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          EMS Management
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {menus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                isActive
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <menu.icon size={20} />
            <span>{menu.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl py-3">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
