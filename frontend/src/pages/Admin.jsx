import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

// Pages
import Dashboard from "../admin/Dashboard";
import Staff from "../admin/Staff";
import Applications from "../admin/Applications";
import Gallery from "../admin/Gallery";
import Announcements from "../admin/Announcements";
import Certificates from "../admin/Certificates";
import Settings from "../admin/Settings";
import Attendance from "../admin/Attendance";
import Discord from "../admin/Discord";
import AuditLogs from "../admin/AuditLogs";

export default function Admin() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="text-cyan-400 text-xl font-semibold animate-pulse">
          Loading Admin Panel...
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <Topbar
          user={user}
          botOnline={true}
          serverOnline={true}
        />

        {/* Page */}
        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .3 }}
          className="flex-1 overflow-y-auto p-6"
        >
          <Dashboard />

          {/* Later routing */}

          {/* <Staff /> */}

          {/* <Applications /> */}

          {/* <Attendance /> */}

          {/* <Discord /> */}

          {/* <Gallery /> */}

          {/* <Announcements /> */}

          {/* <Certificates /> */}

          {/* <AuditLogs /> */}

          {/* <Settings /> */}

        </motion.main>

      </div>

    </div>
  );
}
