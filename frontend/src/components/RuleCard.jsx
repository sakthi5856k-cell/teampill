import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function RuleCard({
  title,
  icon: Icon,
  points,
}) {
  return (
    <div
      className="
        bg-card
        border
        border-border
        rounded-xl
        p-6
        transition-all
        duration-300
        hover:border-primary
        hover:-translate-y-1
        hover:shadow-2xl
      "
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="
            h-12
            w-12
            rounded-lg
            bg-primary/10
            flex
            items-center
            justify-center
          "
        >
          <Icon className="w-6 h-6 text-primary" />
        </div>

        <h2 className="font-display text-xl font-semibold">
          {title}
        </h2>
      </div>

      <ul className="space-y-3">
        {points.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-3"
          >
            <CheckCircle2
              className="
                w-5
                h-5
                text-emerald-400
                mt-0.5
                shrink-0
              "
            />

            <span className="text-muted-foreground leading-7">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
