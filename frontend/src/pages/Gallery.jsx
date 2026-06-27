import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { X } from "lucide-react";

const CATS = [
  { k: "all", label: "All" },
  { k: "hospital", label: "Hospital" },
  { k: "event", label: "Events" },
  { k: "training", label: "Training" },
];

export default function Gallery() {
  const [cat, setCat] = useState("all");
  const [items, setItems] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get("/gallery", { params: cat === "all" ? {} : { category: cat } }).then((r) => setItems(r.data));
  }, [cat]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="gallery-page">
      <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary">// ARCHIVE</div>
      <h1 className="font-display text-5xl sm:text-6xl font-semibold mt-2 text-secondary">Gallery</h1>
      <p className="text-muted-foreground mt-3 max-w-xl">Moments from the bay, the field, and the training ground.</p>

      <div className="mt-8 flex flex-wrap gap-2" data-testid="gallery-category-filter">
        {CATS.map((c) => (
          <button
            key={c.k}
            data-testid={`gallery-cat-${c.k}`}
            onClick={() => setCat(c.k)}
            className={`px-4 py-1.5 text-xs font-mono tracking-[0.18em] uppercase border rounded-sm transition-colors ${
              cat === c.k ? "bg-secondary text-white border-secondary" : "bg-white text-secondary border-border hover:border-primary hover:text-primary"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setLightbox(it)}
            data-testid={`gallery-item-${it.id}`}
            className="group relative aspect-square overflow-hidden rounded-sm border border-border bg-secondary"
          >
            <img src={it.image_url} alt={it.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/70 transition-colors flex items-end p-3">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary">{it.category}</div>
                <div className="text-white font-display text-base mt-0.5 text-left">{it.title}</div>
              </div>
            </div>
          </button>
        ))}
        {items.length === 0 && <div className="col-span-full text-center text-muted-foreground py-16" data-testid="gallery-empty">No photos yet.</div>}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 lightbox-backdrop flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          data-testid="lightbox"
        >
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-white" data-testid="lightbox-close">
            <X className="w-7 h-7" />
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.image_url} alt={lightbox.title} className="w-full max-h-[80vh] object-contain" />
            <div className="text-center mt-4 text-white">
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary">{lightbox.category}</div>
              <div className="font-display text-2xl mt-1">{lightbox.title}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
