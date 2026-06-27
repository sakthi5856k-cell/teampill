import React, { useState } from "react";
import { api, formatApiError } from "../lib/api";
import { Search } from "lucide-react";

const STATUS_COLOR = {
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  approved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  rejected: "text-red-400 bg-red-400/10 border-red-400/30",
};

export default function Status() {
  const [ref, setRef] = useState("");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = async (e) => {
    e.preventDefault();
    setErr(""); setData(null); setLoading(true);
    try {
      const { data } = await api.get(`/applications/lookup/${ref.trim().toUpperCase()}`);
      setData(data);
    } catch (e) {
      setErr(formatApiError(e.response?.data?.detail) || "Not found");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16" data-testid="status-page">
      <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-primary">// APPLICATION STATUS</div>
      <h1 className="font-display text-5xl font-semibold mt-2">Check Your Status</h1>
      <p className="text-muted-foreground mt-3">Enter the reference number we DM'd to you on Discord.</p>

      <form onSubmit={lookup} className="mt-8 flex gap-3" data-testid="status-form">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input data-testid="status-ref-input" value={ref} onChange={(e)=>setRef(e.target.value)}
            placeholder="PB-AP-XXXXXX" className="w-full pl-9 pr-3 py-3 bg-input border border-border rounded-sm focus:ring-2 focus:ring-primary outline-none font-mono" />
        </div>
        <button data-testid="status-lookup" disabled={loading || !ref}
          className="px-5 py-3 bg-primary text-white rounded-sm font-medium disabled:opacity-60">
          {loading ? "Checking…" : "Look up"}
        </button>
      </form>

      {err && <div className="mt-6 text-sm text-red-400" data-testid="status-error">{err}</div>}

      {data && (
        <div className="mt-8 border border-border bg-card/60 p-6 rounded-sm" data-testid="status-result">
          <div className="flex items-center justify-between">
            <div className="font-mono text-primary">{data.ref_number}</div>
            <span className={`text-[10px] font-mono uppercase tracking-[0.25em] px-2 py-1 border rounded-sm ${STATUS_COLOR[data.status] || ""}`}>
              {data.status}
            </span>
          </div>
          <div className="mt-3 font-display text-2xl">{data.full_name}</div>
          <div className="text-sm text-muted-foreground">{data.desired_role} · Submitted {new Date(data.created_at).toLocaleString()}</div>
          {data.decision_note && (
            <div className="mt-4 text-sm border-t border-border pt-4">
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Note from Command</div>
              <p className="mt-1">{data.decision_note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
