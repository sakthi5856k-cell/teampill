import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

const CAT_LABEL = { update: "Update", event: "Event", recruitment: "Recruitment" };

export default function Announcements() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/announcements").then((r) => setItems(r.data)); }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="announcements-page">
      <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary">// BULLETIN BOARD</div>
      <h1 className="font-display text-5xl sm:text-6xl font-semibold mt-2 text-secondary">Announcements</h1>

      <div className="mt-10 divide-y divide-border border border-border bg-white rounded-sm">
        {items.length === 0 && <div className="p-8 text-center text-muted-foreground" data-testid="announcements-empty">Nothing to report.</div>}
        {items.map((a) => (
          <article key={a.id} className="p-6 lift" data-testid={`announcement-${a.id}`}>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase bg-primary text-white px-2 py-0.5">{CAT_LABEL[a.category] || a.category}</span>
              <span className="text-xs font-mono text-muted-foreground">{new Date(a.created_at).toLocaleString()}</span>
            </div>
            <h2 className="font-display text-2xl font-semibold mt-3 text-secondary">{a.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80 whitespace-pre-line">{a.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
