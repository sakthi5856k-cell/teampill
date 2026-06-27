import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { Search } from "lucide-react";

const RANKS = ["All", "Executive Management", "HOD", "Doctor", "Nurse", "EMT", "Intern"];

export default function Staff() {
  const [params, setParams] = useSearchParams();
  const [rank, setRank] = useState(params.get("rank") || "All");
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const p = {};
    if (rank !== "All") p.rank = rank;
    if (q) p.q = q;
    api.get("/staff", { params: p }).then((r) => setItems(r.data));
    const next = new URLSearchParams();
    if (rank !== "All") next.set("rank", rank);
    setParams(next, { replace: true });
  }, [rank, q]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="staff-page">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary">// PERSONNEL</div>
          <h1 className="font-display text-5xl sm:text-6xl font-semibold mt-2 text-secondary">Staff Directory</h1>
          <p className="text-muted-foreground mt-3 max-w-xl">Every roster member from Executive down to Intern. Searchable, filterable, ready.</p>
        </div>
        <div className="relative w-full sm:w-72" data-testid="staff-search-wrap">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            data-testid="staff-search-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name…"
            className="w-full pl-9 pr-3 py-2.5 border border-border rounded-sm bg-white focus:ring-2 focus:ring-primary outline-none text-sm"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2" data-testid="staff-rank-filter">
        {RANKS.map((r) => (
          <button
            key={r}
            data-testid={`rank-pill-${r.replace(/\s+/g, "-").toLowerCase()}`}
            onClick={() => setRank(r)}
            className={`px-4 py-1.5 text-xs font-mono tracking-[0.18em] uppercase border rounded-sm transition-colors ${
              rank === r ? "bg-secondary text-white border-secondary" : "bg-white text-secondary border-border hover:border-primary hover:text-primary"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground" data-testid="staff-empty">
            No staff match this filter.
          </div>
        )}
        {items.map((s) => (
          <article key={s.id} data-testid={`staff-card-${s.id}`} className="lift border border-border bg-white rounded-sm overflow-hidden flex">
            <div className="w-32 sm:w-36 shrink-0 bg-secondary/5">
              <img src={s.photo_url || "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=400"} alt={s.name} className="w-full h-full object-cover aspect-[3/4]" />
            </div>
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary">{s.rank}</div>
                <h3 className="font-display text-xl font-semibold text-secondary mt-1 leading-tight">{s.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{s.department}</p>
                {s.bio && <p className="text-sm mt-3 leading-relaxed line-clamp-3">{s.bio}</p>}
              </div>
              <div className="flex items-center justify-between mt-4 text-[10px] font-mono">
                <span className="text-muted-foreground">{s.employee_id}</span>
                <span className="text-secondary">{s.badge_number}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
