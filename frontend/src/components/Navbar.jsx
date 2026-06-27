import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/staff", label: "Staff" },
  { to: "/gallery", label: "Gallery" },
  { to: "/announcements", label: "Announcements" },
  { to: "/apply", label: "Apply" },
  { to: "/status", label: "Status" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
          <img src="/logo.png" alt="Team Pillbox" className="w-10 h-10 object-contain" />
          <div className="leading-none">
            <div className="font-display text-lg font-semibold tracking-tight text-foreground">EMS CORE RP</div>
            <div className="text-[10px] tracking-[0.3em] text-primary font-mono">PILL BOX</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to} to={l.to} end={l.to === "/"}
              data-testid={`nav-${l.label.toLowerCase()}-link`}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                  isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}
            >
              {l.label}
            </NavLink>
          ))}
          {user && user.role === "admin" ? (
            <>
              <NavLink to="/admin" data-testid="nav-admin-link"
                className={({ isActive }) => `px-3 py-2 text-sm font-medium rounded-sm ${isActive ? "text-primary" : "text-foreground/80 hover:text-primary"}`}>
                Admin
              </NavLink>
              <button data-testid="logout-button"
                onClick={async () => { await logout(); nav("/"); }}
                className="ml-2 inline-flex items-center gap-1.5 text-sm px-3 py-2 border border-border rounded-sm hover:border-primary hover:text-primary">
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

        <button className="md:hidden p-2 text-foreground" onClick={() => setOpen(!open)} data-testid="mobile-menu-toggle">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}
                data-testid={`mobile-nav-${l.label.toLowerCase()}-link`}
                className={({ isActive }) => `px-3 py-2 text-sm font-medium ${isActive ? "text-primary" : "text-foreground/80"}`}>
                {l.label}
              </NavLink>
            ))}
            {user && user.role === "admin" ? (
              <NavLink to="/admin" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium text-foreground/80">Admin</NavLink>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium text-foreground/80">Staff Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
