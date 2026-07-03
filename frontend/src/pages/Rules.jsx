import React, { useState } from "react";
import {
  ClipboardList,
  ShieldAlert,
  Hash,
  GraduationCap,
} from "lucide-react";

import RuleCard from "../components/RuleCard";

import {
  generalGuidelines,
  disciplinaryRules,
  tenCodes,
  gradeProtocols,
} from "../data/rulesData";

const tabs = [
  {
    id: "general",
    title: "General Guidelines",
    icon: ClipboardList,
  },
  {
    id: "disciplinary",
    title: "Disciplinary",
    icon: ShieldAlert,
  },
  {
    id: "codes",
    title: "10 Codes",
    icon: Hash,
  },
  {
    id: "grades",
    title: "Grade Protocols",
    icon: GraduationCap,
  },
];

export default function Rules() {
  const [activeTab, setActiveTab] = useState("general");

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return generalGuidelines || [];

      case "disciplinary":
        return disciplinaryRules || [];

      case "codes":
        return tenCodes || [];

      case "grades":
        return gradeProtocols || [];

      default:
        return [];
    }
  };

  const rules = renderContent();

  return (
    <section className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center">
          <h1 className="font-display text-5xl font-bold">
            Protocols & Guidelines
          </h1>

          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Official standards and operational procedures for EMSCORE RP Pill Box.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-lg"
                    : "bg-card border border-border hover:border-primary"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.title}
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rules.map((rule, index) => (
            <RuleCard
              key={index}
              title={rule.title}
              icon={rule.icon}
              points={rule.points}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
