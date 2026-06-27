import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Cross, Menu, X, LogOut } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/staff", label: "Staff" },
  { to: "/gallery", label: "Gallery" },
  { to: "/announcements", label: "Announcements" },
  { to: "/apply", label: "Apply" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 group" data-testid="logo-link">
          <div className="w-9 h-9 bg-primary text-white flex items-center justify-center rounded-sm pulse-cross">
            <Cross className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <div className="font-display text-xl font-semibold tracking-tight text-secondary">TEAM PILLBOX</div>
            <div className="text-[10px] tracking-[0.25em] text-muted-foreground font-mono">EMERGENCY MEDICAL SERVICES</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-${l.label.toLowerCase()}-link`}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                  isActive ? "text-primary" : "text-secondary hover:text-primary"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {user && user.role === "admin" ? (
            <>
              <NavLink to="/admin" data-testid="nav-admin-link"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-sm ${isActive ? "text-primary" : "text-secondary hover:text-primary"}`
                }>
                Admin
              </NavLink>
              <button
                data-testid="logout-button"
                onClick={async () => { await logout(); nav("/"); }}
                className="ml-2 inline-flex items-center gap-1.5 text-sm px-3 py-2 border border-border rounded-sm hover:border-primary hover:text-primary"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" data-testid="nav-login-link"
              className="ml-2 text-sm px-3 py-2 border border-border rounded-sm hover:border-primary hover:text-primary">
              Staff Login
            </Link>
          )}
        </nav>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} data-testid="mobile-menu-toggle">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}
                data-testid={`mobile-nav-${l.label.toLowerCase()}-link`}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium ${isActive ? "text-primary" : "text-secondary"}`}>
                {l.label}
              </NavLink>
            ))}
            {user && user.role === "admin" ? (
              <NavLink to="/admin" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium text-secondary">Admin</NavLink>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium text-secondary">Staff Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
