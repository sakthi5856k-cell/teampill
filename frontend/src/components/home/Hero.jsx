import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  HeartPulse,
  Ambulance,
  MessageCircle,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">

      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
        }}
        className="absolute -top-60 left-1/2 -translate-x-1/2 h-[900px] w-[900px] rounded-full bg-cyan-500/20 blur-[180px]"
      />

      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
        }}
        className="absolute bottom-0 right-0 h-[700px] w-[700px] rounded-full bg-fuchsia-600/20 blur-[180px]"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-20 px-6 lg:grid-cols-2">

        {/* LEFT */}

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
        >

          <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-card/60 px-5 py-2 backdrop-blur-xl">

            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />

            <span className="text-sm font-semibold">
              EMS CORE RP ONLINE
            </span>

          </div>

          <h1 className="mt-10 text-6xl font-black leading-tight lg:text-7xl">

            We Carry

            <span className="gradient-text block">

              The Cross.

            </span>

          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">

            Professional Emergency Medical Services for
            EMS CORE RP.

            Protect.

            Respond.

            Save Lives.

          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <Link
              to="/apply"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white transition hover:scale-105"
            >
              Join EMS

              <ArrowRight className="transition group-hover:translate-x-1" />
            </Link>

            <Link
              to="/rules"
              className="rounded-xl border border-border bg-card/40 px-8 py-4 backdrop-blur transition hover:border-primary"
            >
              View Rules
            </Link>

          </div>

          <div className="mt-14 flex flex-wrap gap-5">

            <div className="rounded-xl border border-primary/20 bg-card/50 px-5 py-4 backdrop-blur">

              <Shield className="mb-3 text-cyan-400" />

              <p className="text-sm text-muted-foreground">

                Professional Roleplay

              </p>

            </div>

            <div className="rounded-xl border border-primary/20 bg-card/50 px-5 py-4 backdrop-blur">

              <HeartPulse className="mb-3 text-red-400" />

              <p className="text-sm text-muted-foreground">

                Emergency Response

              </p>

            </div>

          </div>

        </motion.div>

        {/* RIGHT */}

        <motion.div
          initial={{ opacity:0,x:60 }}
          animate={{ opacity:1,x:0 }}
          transition={{ duration:1 }}
          className="flex items-center justify-center"
        >

          <div className="w-full max-w-lg rounded-[30px] border border-primary/20 bg-card/60 p-8 backdrop-blur-xl">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold">

                EMS Dashboard

              </h2>

              <Ambulance className="text-cyan-400" />

            </div>

            {/* Stats cards Part 2 */}

            <div className="mt-8 space-y-5">

              <div className="rounded-2xl border border-border bg-background/60 p-6">

                Active Staff

              </div>

              <div className="rounded-2xl border border-border bg-background/60 p-6">

                Emergency Calls

              </div>

              <div className="rounded-2xl border border-border bg-background/60 p-6">

                Lives Saved

              </div>

            </div>

            <div className="mt-8 rounded-2xl border border-primary/20 bg-background/60 p-6">

              <div className="flex items-center gap-3">

                <MessageCircle className="text-cyan-400" />

                <span className="font-semibold">

                  Discord Community

                </span>

              </div>

              <p className="mt-4 text-muted-foreground">

                Stay connected with EMS CORE RP.

              </p>

              <a
                href="https://discord.gg/YOURINVITE"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-white transition hover:scale-105"
              >
                Join Discord
              </a>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}
