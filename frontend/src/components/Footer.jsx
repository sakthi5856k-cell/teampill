import React from "react";
import { Link } from "react-router-dom";
import { Cross } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white mt-24" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-sm">
              <Cross className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display text-xl font-semibold">TEAM PILLBOX</div>
              <div className="text-[10px] tracking-[0.25em] text-white/60 font-mono">EMERGENCY MEDICAL SERVICES</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70 max-w-md leading-relaxed">
            A roleplay EMS organization built on discipline, training, and community.
            We respond. We train. We carry the cross.
          </p>
        </div>

        <div>
          <div className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase mb-3">Navigate</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/staff" className="hover:text-primary">Staff Directory</Link></li>
            <li><Link to="/gallery" className="hover:text-primary">Gallery</Link></li>
            <li><Link to="/announcements" className="hover:text-primary">Announcements</Link></li>
            <li><Link to="/apply" className="hover:text-primary">EMS Application</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase mb-3">Operations</div>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary">Discord</a></li>
            <li><Link to="/login" className="hover:text-primary">Staff Login</Link></li>
            <li className="text-white/50">© {new Date().getFullYear()} Team Pillbox</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center text-[11px] font-mono text-white/40">
          <span>UNIT 01 // STATUS: OPERATIONAL</span>
          <span>v1.0 — BUILT FOR FIRST RESPONDERS</span>
        </div>
      </div>
    </footer>
  );
}
