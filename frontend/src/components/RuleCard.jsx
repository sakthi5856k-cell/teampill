import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function RuleCard({
  title,
  icon: Icon,
  points = [],
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-xl">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          {Icon && <Icon className="w-6 h-6 text-primary" />}
        </div>

        <div>
          <h2 className="text-xl font-bold font-display">
            {title}
          </h2>

          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            EMS Protocol
          </p>
        </div>
      </div>

      {/* Rule List */}
      <ul className="space-y-3">
        {points.map((point, index) => (
          <li
            key={index}
            className="flex items-start gap-3"
          >
            <CheckCircle2
              className="text-emerald-400 mt-1 shrink-0"
              size={18}
            />

            <span className="text-muted-foreground leading-7">
              {point}
            </span>
          </li>
        ))}
      </ul>

    </div>
  );
}
