import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  HeartPulse,
  Ambulance,
  Activity,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">

      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Aurora */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
        }}
        className="absolute -top-52 left-1/2 -translate-x-1/2 h-[850px] w-[850px] rounded-full bg-cyan-500/20 blur-[170px]"
      />

      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.12, 0.25, 0.12],
        }}
        transition={{
          repeat: Infinity,
          duration: 14,
        }}
        className="absolute bottom-0 right-0 h-[650px] w-[650px] rounded-full bg-fuchsia-600/20 blur-[170px]"
      />

      {/* Floating Icons */}

      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute right-16 top-28 hidden xl:block"
      >
        <Ambulance size={90} className="text-cyan-400/20" />
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
        className="absolute bottom-24 left-12 hidden xl:block"
      >
        <HeartPulse size={70} className="text-red-400/20" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .8 }}
          >

            <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-card/60 px-5 py-2 backdrop-blur-xl">

              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>

              <span className="text-sm font-semibold">

                EMS CORE RP ONLINE

              </span>

            </div>

            <h1 className="mt-10 text-5xl font-black leading-tight md:text-7xl">

              We Carry

              <span className="block gradient-text">

                The Cross.

              </span>

            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">

              Professional Emergency Medical Services
              dedicated to protecting the citizens of
              EMS CORE RP through high-quality roleplay.

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
                className="rounded-xl border border-border bg-card/50 px-8 py-4 backdrop-blur hover:border-primary transition"
              >
                View Rules
              </Link>

            </div>

            {/* Features */}

            <div className="mt-14 grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl border border-primary/20 bg-card/50 p-5 backdrop-blur">

                <Shield className="mb-3 text-cyan-400" />

                <p className="text-sm text-muted-foreground">

                  Professional

                </p>

              </div>

              <div className="rounded-xl border border-primary/20 bg-card/50 p-5 backdrop-blur">

                <HeartPulse className="mb-3 text-red-400" />

                <p className="text-sm text-muted-foreground">

                  Medical RP

                </p>

              </div>

              <div className="rounded-xl border border-primary/20 bg-card/50 p-5 backdrop-blur">

                <Activity className="mb-3 text-fuchsia-400" />

                <p className="text-sm text-muted-foreground">

                  Active 24/7

                </p>

              </div>

            </div>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >

            <div className="rounded-3xl border border-primary/20 bg-card/60 p-8 backdrop-blur-xl shadow-2xl">

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-bold">

                  EMS Dashboard

                </h2>

                <Ambulance className="text-cyan-400" />

              </div>

              <div className="mt-8 grid grid-cols-2 gap-5">

                <div className="rounded-2xl border border-border bg-background/50 p-6">

                  <h3 className="text-4xl font-bold">128</h3>

                  <p className="mt-2 text-muted-foreground">

                    Active Staff

                  </p>

                </div>

                <div className="rounded-2xl border border-border bg-background/50 p-6">

                  <h3 className="text-4xl font-bold">5,842</h3>

                  <p className="mt-2 text-muted-foreground">

                    Emergency Calls

                  </p>

                </div>

                <div className="rounded-2xl border border-border bg-background/50 p-6">

                  <h3 className="text-4xl font-bold">9,315</h3>

                  <p className="mt-2 text-muted-foreground">

                    Lives Saved

                  </p>

                </div>

                <div className="rounded-2xl border border-border bg-background/50 p-6">

                  <h3 className="text-4xl font-bold text-primary">

                    99%

                  </h3>

                  <p className="mt-2 text-muted-foreground">

                    Success Rate

                  </p>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}
