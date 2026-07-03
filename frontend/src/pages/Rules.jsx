import React, { useMemo, useState } from "react";
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
  { id: "general", title: "General Guidelines", icon: ClipboardList },
  { id: "disciplinary", title: "Disciplinary", icon: ShieldAlert },
  { id: "codes", title: "10 Codes", icon: Hash },
  { id: "grades", title: "Grade Protocols", icon: GraduationCap },
];

export default function Rules() {
  const [activeTab, setActiveTab] = useState("general");
  const [search, setSearch] = useState("");

  const data = useMemo(() => {
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
  }, [activeTab]);

  const filteredData = data.filter((item) =>
    (item.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">Protocols & Guidelines</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="border p-2 rounded w-full max-w-md mb-6"
      />

      <div className="flex flex-wrap gap-3 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded ${
                activeTab === tab.id ? "bg-blue-600 text-white" : "border"
              }`}
            >
              <Icon size={18} className="inline mr-2" />
              {tab.title}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredData.map((rule, index) => (
          <RuleCard
            key={index}
            title={rule.title}
            icon={rule.icon}
            points={rule.points || []}
          />
        ))}
      </div>
    </div>
  );
}
