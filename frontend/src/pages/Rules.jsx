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
  const [search, setSearch] = useState("");

  const getFilteredData = () => {
    let data = [];

    switch (activeTab) {
      case "general":
        data = generalGuidelines;
        break;

      case "disciplinary":
        data = disciplinaryRules;
        break;

      case "codes":
        data = tenCodes;
        break;

      case "grades":
        data = gradeProtocols;
        break;

      default:
        data = [];
    }

    return data.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredData = getFilteredData();

  return (
    <section className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center">
          <h1 className="text-5xl font-bold">
            Protocols & Guidelines
          </h1>

          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Official standards and operational procedures for EMSCORE RP Pill Box.
          </p>
        </div>

        {/* Search */}
        <div className="mt-8 flex justify-center">
          <input
            type="text"
            placeholder="Search rules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-card border border-border hover:border-primary"
                }`}
              >
                <Icon size={18} />
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.length > 0 ? (
            filteredData.map((rule, index) => (
              <RuleCard
                key={index}
                title={rule.title}
                icon={rule.icon}
                points={rule.points}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-10">
              No matching rules found.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
