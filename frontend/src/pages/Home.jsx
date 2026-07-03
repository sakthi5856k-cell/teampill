import { motion } from "framer-motion";
import {
  ArrowRight,
  HeartPulse,
  Shield,
  Users,
  MessageCircle,
  Ambulance,
  Stethoscope,
  Activity,
} from "lucide-react";
import CountUp from "react-countup";
import React, { useState } from "react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">

      {/* Aurora */}
      <div className="absolute inset-0">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-cyan-500/20 blur-[180px]" />

        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-fuchsia-500/20 blur-[180px]" />

      </div>

      {/* Grid */}

      <div className="absolute inset-0 bg-grid opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left */}

        <motion.div
          initial={{ opacity:0,y:50 }}
          animate={{ opacity:1,y:0 }}
          transition={{ duration:.8 }}
        >

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2">

            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>

            <span className="text-cyan-300 font-semibold">

              SERVER ONLINE

            </span>

          </div>

          <h1 className="mt-8 text-6xl md:text-7xl font-black leading-tight">

            We Carry

            <span className="gradient-text block">

              The Cross.

            </span>

          </h1>

          <p className="mt-6 text-xl text-muted-foreground max-w-xl">

            Official EMS CORE RP Emergency Medical
            Services.

            Protect.
            Respond.
            Save Lives.

          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <button className="rounded-xl bg-primary px-8 py-4 font-semibold flex items-center gap-2 hover:scale-105 transition">

              Join EMS

              <ArrowRight size={18}/>

            </button>

            <button className="rounded-xl border border-border px-8 py-4 hover:border-primary">

              View Rules

            </button>

          </div>

        </motion.div>

        {/* Right */}

        <motion.div

          initial={{ opacity:0,x:80 }}

          animate={{ opacity:1,x:0 }}

          transition={{ duration:1 }}

        >

          <div className="rounded-3xl border border-primary/20 bg-card/70 backdrop-blur-xl p-8">

            <div className="grid grid-cols-2 gap-6">

              <div className="rounded-xl bg-background/60 p-6">

                <Users className="text-cyan-400"/>

                <h2 className="mt-4 text-4xl font-bold">

                  128

                </h2>

                <p className="text-muted-foreground">

                  Active Staff

                </p>

              </div>

              <div className="rounded-xl bg-background/60 p-6">

                <HeartPulse className="text-red-400"/>

                <h2 className="mt-4 text-4xl font-bold">

                  5,420

                </h2>

                <p className="text-muted-foreground">

                  Lives Saved

                </p>

              </div>

              <div className="rounded-xl bg-background/60 p-6">

                <Shield className="text-emerald-400"/>

                <h2 className="mt-4 text-4xl font-bold">

                  24/7

                </h2>

                <p className="text-muted-foreground">

                  Response

                </p>

              </div>

              <div className="rounded-xl bg-background/60 p-6">

                <HeartPulse className="text-fuchsia-400"/>

                <h2 className="mt-4 text-4xl font-bold">

                  99%

                </h2>

                <p className="text-muted-foreground">

                  Success

                </p>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>

  );
}
