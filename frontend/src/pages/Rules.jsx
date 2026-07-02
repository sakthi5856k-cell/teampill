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
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {generalGuidelines.map((rule, index) => (
              <RuleCard
                key={index}
                title={rule.title}
                icon={rule.icon}
                points={rule.points}
              />
            ))}
          </div>
        );

      case "disciplinary":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {disciplinaryRules.map((rule, index) => (
              <RuleCard
                key={index}
                title={rule.title}
                icon={rule.icon}
                points={rule.points}
              />
            ))}
          </div>
        );

      case "codes":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tenCodes.map((rule, index) => (
              <RuleCard
                key={index}
                title={rule.title}
                icon={rule.icon}
                points={rule.points}
              />
            ))}
          </div>
        );

      case "grades":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {gradeProtocols.map((rule, index) => (
              <RuleCard
                key={index}
                title={rule.title}
                icon={rule.icon}
                points={rule.points}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="min-h-screen bg-background text-foreground">

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center">

          <h1 className="font-display text-5xl font-bold">
            Protocols & Guidelines
          </h1>

          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Official standards and operational procedures for
            EMSCORE RP Pill Box.
          </p>

        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">

          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-all duration-300
                  ${
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

        <div className="mt-12">
          {renderContent()}
        </div>

      </div>

    </section>
  );
}
