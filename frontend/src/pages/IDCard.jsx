import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { QRCodeSVG } from "qrcode.react";
import { Cross, Printer, ArrowLeft } from "lucide-react";

export default function IDCard() {
  const { staffId } = useParams();
  const [s, setS] = useState(null);

  useEffect(() => { api.get(`/staff/${staffId}`).then((r) => setS(r.data)); }, [staffId]);
  if (!s) return <div className="p-16 text-center text-muted-foreground">Loading…</div>;

  const qrPayload = JSON.stringify({
    org: "Team Pillbox",
    id: s.employee_id,
    name: s.name,
    rank: s.rank,
    badge: s.badge_number,
    verify: `${window.location.origin}/staff?rank=${encodeURIComponent(s.rank)}`,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12" data-testid="idcard-page">
      <div className="flex items-center justify-between no-print">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-primary" data-testid="idcard-back">
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Link>
        <button onClick={() => window.print()} data-testid="idcard-print"
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-sm font-medium hover:bg-[#d62828]">
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      <div className="print-area mt-8 flex justify-center">
        <div className="w-[340px] bg-white border-2 border-secondary rounded-sm overflow-hidden shadow-lg" data-testid="idcard-canvas">
          <div className="bg-primary text-white px-4 py-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-primary flex items-center justify-center rounded-sm">
              <Cross className="w-5 h-5" strokeWidth={2.8} />
            </div>
            <div>
              <div className="font-display text-base leading-none">TEAM PILLBOX</div>
              <div className="text-[9px] font-mono tracking-[0.25em] uppercase mt-0.5">Emergency Medical Services</div>
            </div>
          </div>

          <div className="p-4">
            <div className="aspect-[3/4] bg-gray-100 border border-border overflow-hidden">
              <img src={s.photo_url || "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=600"} alt={s.name} className="w-full h-full object-cover" />
            </div>

            <div className="mt-3">
              <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-primary">Name</div>
              <div className="font-display text-lg text-secondary leading-tight">{s.name}</div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Rank</div>
                <div className="font-medium text-secondary">{s.rank}</div>
              </div>
              <div>
                <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Department</div>
                <div className="font-medium text-secondary">{s.department}</div>
              </div>
              <div>
                <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Employee ID</div>
                <div className="font-mono text-secondary">{s.employee_id}</div>
              </div>
              <div>
                <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Badge</div>
                <div className="font-mono text-secondary">{s.badge_number}</div>
              </div>
            </div>

            <div className="mt-3 flex items-end justify-between">
              <div className="text-[8px] font-mono uppercase tracking-[0.25em] text-muted-foreground leading-tight">
                Authorized<br />Personnel<br />Only
              </div>
              <div className="bg-white p-1 border border-border" data-testid="idcard-qr">
                <QRCodeSVG value={qrPayload} size={72} level="M" includeMargin={false} />
              </div>
            </div>
          </div>

          <div className="stripe-warning h-2" />
        </div>
      </div>
    </div>
  );
}
