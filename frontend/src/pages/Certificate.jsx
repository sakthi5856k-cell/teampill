import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { Cross, Printer } from "lucide-react";

const TYPE_TITLE = {
  training: "Certificate of Training",
  promotion: "Certificate of Promotion",
  appreciation: "Certificate of Appreciation",
};

export default function Certificate() {
  const { certId } = useParams();
  const [c, setC] = useState(null);
  useEffect(() => { api.get(`/certificates/${certId}`).then((r) => setC(r.data)); }, [certId]);
  if (!c) return <div className="p-16 text-center text-muted-foreground">Loading…</div>;

  return (
    <div className="bg-background min-h-screen py-10 px-4" data-testid="certificate-page">
      <div className="max-w-4xl mx-auto flex justify-end no-print">
        <button onClick={() => window.print()} data-testid="cert-print"
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-sm font-medium">
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      <div className="print-area max-w-4xl mx-auto mt-6 bg-white border-8 border-double border-secondary p-10 sm:p-16" data-testid="cert-canvas">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary text-white flex items-center justify-center">
              <Cross className="w-7 h-7" strokeWidth={2.8} />
            </div>
            <div>
              <div className="font-display text-2xl text-secondary leading-none">TEAM PILLBOX</div>
              <div className="text-[10px] font-mono tracking-[0.3em] text-muted-foreground uppercase mt-1">Emergency Medical Services</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary">Cert No.</div>
            <div className="font-mono text-secondary">{c.cert_number}</div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="text-[11px] font-mono tracking-[0.4em] uppercase text-primary">This is to certify that</div>
          <h1 className="font-display text-5xl sm:text-6xl mt-4 text-secondary leading-tight">{c.recipient_name}</h1>
          <div className="mt-2 text-sm font-mono tracking-[0.3em] uppercase text-muted-foreground">{c.rank}</div>

          <div className="mt-10">
            <div className="text-[11px] font-mono tracking-[0.4em] uppercase text-muted-foreground">has been awarded the</div>
            <h2 className="font-display text-3xl sm:text-4xl text-primary mt-3">{TYPE_TITLE[c.cert_type] || c.cert_type}</h2>
          </div>

          <p className="mt-8 max-w-2xl mx-auto text-base leading-relaxed text-foreground/80">{c.description}</p>
        </div>

        <div className="mt-16 flex items-end justify-between">
          <div>
            <div className="font-display text-xl text-secondary" style={{ fontStyle: "italic" }}>~ {c.issued_by.split(",")[0]} ~</div>
            <div className="border-t border-secondary mt-1 w-56" />
            <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground mt-1">{c.issued_by}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground">Date of Issue</div>
            <div className="font-display text-lg text-secondary mt-1">{c.issue_date}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
