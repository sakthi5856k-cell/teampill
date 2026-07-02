import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src="/ems-logo.png" alt="logo" className="w-12 h-12 object-contain" />
            <div>
              <div className="font-display text-xl font-semibold">EMS CORE RP</div>
              <div className="text-[10px] tracking-[0.3em] text-primary font-mono">PILL BOX</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
            A roleplay EMS organization built on discipline, training, and community.
            We respond. We train. We carry the cross.
          </p>
        </div>
        <div>
          <div className="text-[11px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-3">Navigate</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/staff" className="hover:text-primary">Staff</Link></li>
            <li><Link to="/gallery" className="hover:text-primary">Gallery</Link></li>
            <li><Link to="/announcements" className="hover:text-primary">Announcements</Link></li>
            <li><Link to="/apply" className="hover:text-primary">Apply</Link></li>
            <li><Link to="/status" className="hover:text-primary">Check Status</Link></li>
            <li><Link to="/rules" className="hover:text-primary">Rules</Link></li
          </ul>
        </div>
        <div>
          <div className="text-[11px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-3">Ops</div>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary">Discord</a></li>
            <li><Link to="/login" className="hover:text-primary">Staff Login</Link></li>
            <li className="text-muted-foreground">© {new Date().getFullYear()} TEAM PILLBOX</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between text-[11px] font-mono text-muted-foreground">
          <span>UNIT 01 // OPERATIONAL</span>
          <span>v1.1 — BUILT FOR FIRST RESPONDERS</span>
        </div>
      </div>
    </footer>
  );
}
