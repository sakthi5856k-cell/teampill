import React from "react";
import {
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export default function RuleCard({
  title,
  icon: Icon,
  points = [],
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-2xl">

      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

      {/* Top Line */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500" />

      <div className="relative p-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">

          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">

            {Icon && (
              <Icon className="h-7 w-7 text-primary" />
            )}

          </div>

          <div>

            <h2 className="font-display text-2xl font-bold">
              {title}
            </h2>

            <p className="text-xs uppercase tracking-[0.25em] text-primary mt-1">
              EMS PROTOCOL
            </p>

          </div>

        </div>

        {/* Divider */}
        <div className="mb-5 h-px bg-border" />

        {/* Rules */}
        <div className="space-y-4">

          {points.map((point, index) => (

            <div
              key={index}
              className="flex items-start gap-3"
            >

              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
              />

              <div className="flex-1">

                <p className="leading-7 text-muted-foreground">

                  {point}

                </p>

              </div>

            </div>

          ))}

        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-5">

          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Official EMS Rule
          </span>

          <ChevronRight className="h-5 w-5 text-primary transition-transform duration-300 group-hover:translate-x-1" />

        </div>

      </div>

    </div>
  );
}
