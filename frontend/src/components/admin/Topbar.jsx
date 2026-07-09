import { Bell, Search, Bot, Server, Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function Topbar({
  user,
  botOnline = false,
  serverOnline = true,
}) {
  const [dark, setDark] = useState(true);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950 px-6 flex items-center justify-between">

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search staff, applications..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="flex items-center gap-4">

        {/* Discord */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
          <Bot
            size={18}
            className={botOnline ? "text-green-400" : "text-red-400"}
          />

          <span className="text-sm text-slate-300">
            {botOnline ? "Bot Online" : "Bot Offline"}
          </span>
        </div>

        {/* Server */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
          <Server
            size={18}
            className={serverOnline ? "text-green-400" : "text-red-400"}
          />

          <span className="text-sm text-slate-300">
            {serverOnline ? "Server Online" : "Server Offline"}
          </span>
        </div>

        {/* Theme */}
        <button
          onClick={() => setDark(!dark)}
          className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center hover:border-cyan-500"
        >
          {dark ? (
            <Sun size={18} className="text-yellow-400" />
          ) : (
            <Moon size={18} className="text-slate-300" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center hover:border-cyan-500">
          <Bell size={18} className="text-white" />

          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-2">
          <img
            src={
              user?.avatar ||
              "https://ui-avatars.com/api/?name=Admin&background=06b6d4&color=fff"
            }
            alt="avatar"
            className="w-10 h-10 rounded-full border border-cyan-500"
          />

          <div className="hidden sm:block">
            <h3 className="text-sm font-semibold text-white">
              {user?.name || "Administrator"}
            </h3>

            <p className="text-xs text-slate-400">
              {user?.role || "Admin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
