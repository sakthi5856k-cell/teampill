import React, { useState } from "react";
import {
  ClipboardList,
  ShieldAlert,
  Hash,
  GraduationCap,
  Search,
  Shield,
  HeartPulse,
  Users,
  Activity,
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
    tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section className="min-h-screen bg-background text-foreground">

      {/* HERO */}
      <div className="relative overflow-hidden border-b border-border">

        <div className="absolute inset-0 bg-grid opacity-20"></div>

        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-primary/10 blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">

          <div className="text-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary font-semibold">

              <Shield className="w-4 h-4" />

              EMS CORE RP

            </div>

            <h1 className="mt-8 text-6xl font-display font-bold leading-tight">

              Protocols

              <span className="block gradient-text">
                & Guidelines
              </span>

            </h1>

            <p className="mt-6 text-muted-foreground text-lg max-w-3xl mx-auto">

              Official EMS Rules, Operational Standards,
              Medical Procedures and Internal Staff Policies.

            </p>

          </div>

          {/* Statistics */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">

            <div className="bg-card border border-border rounded-xl p-6 text-center lift">

              <Shield className="mx-auto text-primary w-10 h-10 mb-3" />

              <h2 className="text-3xl font-bold">50+</h2>

              <p className="text-muted-foreground mt-2">
                Rules
              </p>

            </div>

            <div className="bg-card border border-border rounded-xl p-6 text-center lift">

              <HeartPulse className="mx-auto text-primary w-10 h-10 mb-3" />

              <h2 className="text-3xl font-bold">24/7</h2>

              <p className="text-muted-foreground mt-2">
                Emergency Service
              </p>

            </div>

            <div className="bg-card border border-border rounded-xl p-6 text-center lift">

              <Users className="mx-auto text-primary w-10 h-10 mb-3" />

              <h2 className="text-3xl font-bold">4</h2>

              <p className="text-muted-foreground mt-2">
                Rule Categories
              </p>

            </div>

            <div className="bg-card border border-border rounded-xl p-6 text-center lift">

              <Activity className="mx-auto text-primary w-10 h-10 mb-3" />

              <h2 className="text-3xl font-bold">
                {currentTab.data.length}
              </h2>

              <p className="text-muted-foreground mt-2">
                Active Section
              </p>

            </div>

          </div>

          {/* Search */}

          <div className="max-w-xl mx-auto mt-14 relative">

            <Search className="absolute left-4 top-4 text-muted-foreground w-5 h-5" />

            <input
              type="text"
              placeholder="Search rules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border focus:outline-none focus:border-primary"
            />

          </div>

        </div>

      </div>

      {/* Sticky Tabs */}

      <div className="sticky top-16 z-20 bg-background/90 backdrop-blur border-b border-border">

        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-center gap-4">

          {tabs.map((tab) => {

            const Icon = tab.icon;

            return (

              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all ${
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

      </div>

      {/* Rule Cards will be added in Part 2 */}

      <div className="max-w-7xl mx-auto px-6 py-12">

      </div>

    </section>
  );
}
