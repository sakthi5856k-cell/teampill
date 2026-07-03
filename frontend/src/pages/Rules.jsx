import React, { useState } from "react";
import {
  ClipboardList,
  ShieldAlert,
  Hash,
  GraduationCap,
  Search,
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
    data: generalGuidelines,
  },
  {
    id: "disciplinary",
    title: "Disciplinary",
    icon: ShieldAlert,
    data: disciplinaryRules,
  },
  {
    id: "codes",
    title: "10 Codes",
    icon: Hash,
    data: tenCodes,
  },
  {
    id: "grades",
    title: "Grade Protocols",
    icon: GraduationCap,
    data: gradeProtocols,
  },
];

export default function Rules() {
  const [activeTab, setActiveTab] = useState("general");
  const [search, setSearch] = useState("");

  const currentTab =
    tabs.find((tab) => tab.id === activeTab) || tabs[0];

  const filteredRules = currentTab.data.filter((rule) =>
    rule.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Hero */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
            EMS CORE RP
          </span>

          <h1 className="mt-5 text-5xl font-bold font-display">
            Protocols & Guidelines
          </h1>

          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Official EMS Rules, Operational Standards,
            Medical Protocols and Staff Guidelines.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-8">
          <Search
            className="absolute left-4 top-3.5 text-muted-foreground"
            size={18}
          />

          <input
            type="text"
            placeholder="Search rules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-lg flex items-center gap-2 transition ${
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

        {/* Rule Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredRules.map((rule, index) => (
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
