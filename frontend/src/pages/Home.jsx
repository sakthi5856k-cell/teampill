import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { Cross, ArrowRight, ShieldPlus, Radio, Activity, Users, Calendar } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1619025873875-59dfdd2bbbd6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwzfHxhbWJ1bGFuY2V8ZW58MHx8fHwxNzgyNTMzODA3fDA&ixlib=rb-4.1.0&q=85";

export default function Home() {
  const [settings, setSettings] = useState({ server_status_label: "Server Online", server_status_online: true });
  const [stats, setStats] = useState({ staff: 0, applications: 0, gallery: 0 });
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    api.get("/settings").then((r) => setSettings(r.data)).catch(() => {});
    api.get("/staff").then((r) => setStats((s) => ({ ...s, staff: r.data.length }))).catch(() => {});
    api.get("/gallery").then((r) => setStats((s) => ({ ...s, gallery: r.data.length }))).catch(() => {});
    api.get("/announcements").then((r) => setLatest(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const tickerWords = ["// DISPATCH READY", "// CODE 3", "// BLS / ALS", "// 24/7 RESPONSE", "// HEAVY RESCUE", "// AIR-MED STANDBY"];

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border" data-testid="hero-section">
        <img src={HERO_IMG} alt="ambulance" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-white">
          <div className="flex items-center gap-4 mb-6">
            <img src="/logo.png" alt="EMS Core RP Pill Box" className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_0_20px_rgba(31,167,184,0.4)]" data-testid="hero-logo" />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-sm backdrop-blur-sm" data-testid="hero-badge">
              <span className={`w-2 h-2 rounded-full ${settings.server_status_online ? "bg-green-400 dot-live" : "bg-red-400"}`}></span>
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase">{settings.server_status_label}</span>
            </div>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold mt-6 leading-[0.95] max-w-4xl" data-testid="hero-headline">
            We carry <span className="gradient-text">the cross.</span><br />
            You carry on <span className="italic font-medium">living.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg text-white/80 leading-relaxed" data-testid="hero-subtitle">
            Team Pillbox is the EMS arm of the city — paramedics, doctors, nurses, and interns
            who train hard so you never have to wait.
          </p>

          <div className="mt-10 flex flex-wrap gap-3" data-testid="hero-cta-row">
            <Link
              to="/apply"
              data-testid="join-ems-button"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-sm font-medium hover:bg-primary/85 transition-colors"
            >
              <ShieldPlus className="w-4 h-4" /> Join EMS
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={settings.discord_invite || "#"}
              target="_blank" rel="noreferrer"
              data-testid="discord-button"
              className="inline-flex items-center gap-2 bg-[#5865F2] text-white px-6 py-3.5 rounded-sm font-medium hover:bg-[#4752c4] transition-colors"
            >
              <Radio className="w-4 h-4" /> Join Discord
            </a>
            <Link
              to="/staff"
              data-testid="meet-team-button"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3.5 rounded-sm font-medium hover:bg-white/10 transition-colors"
            >
              Meet the Team
            </Link>
          </div>

          {/* Live stat strip */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4" data-testid="hero-stats">
            {[
              { icon: Users, k: "Active Staff", v: stats.staff },
              { icon: Activity, k: "Avg Response", v: "3:42" },
              { icon: Calendar, k: "Calls/Month", v: "1,284" },
              { icon: Cross, k: "Lives Saved", v: "9,210" },
            ].map((s, i) => (
              <div key={i} className="border border-white/15 bg-white/5 px-4 py-3 rounded-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/60">
                  <s.icon className="w-3 h-3" /> {s.k}
                </div>
                <div className="font-display text-2xl mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee ticker */}
        <div className="relative bg-[#0F172A] text-white border-t border-white/10 overflow-hidden">
          <div className="flex whitespace-nowrap ticker-track py-3">
            {Array.from({ length: 2 }).flatMap((_, j) =>
              tickerWords.map((w, i) => (
                <span key={`${j}-${i}`} className="px-8 font-mono text-xs tracking-[0.3em] text-white/70">
                  {w}
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Divisions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24" data-testid="divisions-section">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary">// 01 — STRUCTURE</div>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold mt-2">The Chain of Command.</h2>
          </div>
          <Link to="/staff" className="text-sm font-medium text-foreground hover:text-primary inline-flex items-center gap-1" data-testid="view-all-staff-link">
            View full directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { t: "Executive", n: "01" }, { t: "HOD", n: "02" }, { t: "Doctors", n: "03" },
            { t: "Nurses", n: "04" }, { t: "EMT", n: "05" }, { t: "Interns", n: "06" },
          ].map((d) => (
            <Link
              to={`/staff?rank=${encodeURIComponent(d.t === "Executive" ? "Executive Management" : d.t === "Doctors" ? "Doctor" : d.t === "Nurses" ? "Nurse" : d.t)}`}
              key={d.t} data-testid={`division-card-${d.t.toLowerCase()}`}
              className="lift border border-border bg-card p-5 rounded-sm flex flex-col gap-6 group">
              <span className="text-[10px] font-mono text-muted-foreground">UNIT {d.n}</span>
              <span className="font-display text-2xl group-hover:text-primary transition-colors">{d.t}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest announcements */}
      <section className="border-t border-border bg-card/30" data-testid="latest-news-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary">// 02 — DISPATCH BOARD</div>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold mt-2">Latest from the bay.</h2>
            </div>
            <Link to="/announcements" className="text-sm font-medium hover:text-primary inline-flex items-center gap-1" data-testid="view-all-announcements-link">
              All announcements <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {latest.length === 0 && <div className="text-muted-foreground col-span-3 text-sm">No announcements yet.</div>}
            {latest.map((a) => (
              <article key={a.id} data-testid={`home-announcement-${a.id}`} className="border border-border bg-background p-6 rounded-sm hover:border-primary transition-colors">
                <span className="inline-block text-[10px] font-mono tracking-[0.25em] uppercase text-primary mb-3">{a.category}</span>
                <h3 className="font-display text-2xl leading-tight">{a.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-4">{a.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
