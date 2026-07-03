import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  MessageCircle,
  Activity,
  Stethoscope,
} from "lucide-react";
import {
  ArrowRight,
  HeartPulse,
  Ambulance,
  Users,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">

      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Aurora */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.18, 0.35, 0.18],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
        }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-cyan-500 blur-[180px]"
      />

      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.12, 0.28, 0.12],
        }}
        transition={{
          repeat: Infinity,
          duration: 15,
        }}
        className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full bg-fuchsia-600 blur-[180px]"
      />

      {/* Floating Ambulance */}

      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
        }}
        className="absolute right-20 top-32 hidden xl:block"
      >
        <Ambulance
          size={90}
          className="text-cyan-400/20"
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}

          <motion.div
            initial={{ opacity:0,y:40 }}
            animate={{ opacity:1,y:0 }}
            transition={{ duration:.8 }}
          >

            <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-card/60 backdrop-blur-xl px-5 py-2">

              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>

              <span className="text-sm font-semibold">

                EMS CORE RP ONLINE

              </span>

            </div>

            <h1 className="mt-8 text-5xl md:text-7xl font-black leading-tight">

              We Carry

              <span className="block gradient-text">

                The Cross.

              </span>

            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-8">

              Official Emergency Medical Services of
              EMS CORE RP.

              Professional roleplay,
              emergency response,
              medical excellence.

            </p>

            <div className="mt-10 flex flex-wrap gap-5">

              <button className="group rounded-xl bg-primary px-8 py-4 font-semibold hover:scale-105 transition">

                <span className="flex items-center gap-2">

                  Join EMS

                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition"
                  />

                </span>

              </button>

              <button className="rounded-xl border border-border bg-card/40 backdrop-blur px-8 py-4 hover:border-primary transition">

                View Rules

              </button>

            </div>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity:0,x:60 }}
            animate={{ opacity:1,x:0 }}
            transition={{ duration:1 }}
          >

            <div className="rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-xl p-8">

              <div className="grid grid-cols-2 gap-6">

                <div className="rounded-2xl bg-background/60 border border-border p-6">

                  <Users className="text-cyan-400"/>

                  <h2 className="mt-5 text-4xl font-bold">

                    128

                  </h2>

                  <p className="text-muted-foreground mt-2">

                    Active Staff

                  </p>

                </div>

                <div className="rounded-2xl bg-background/60 border border-border p-6">

                  <HeartPulse className="text-red-400"/>

                  <h2 className="mt-5 text-4xl font-bold">

                    5420

                  </h2>

                  <p className="text-muted-foreground mt-2">

                    Lives Saved

                  </p>

                </div>

                <div className="rounded-2xl bg-background/60 border border-border p-6">

                  <Ambulance className="text-emerald-400"/>

                  <h2 className="mt-5 text-4xl font-bold">

                    24/7

                  </h2>

                  <p className="text-muted-foreground mt-2">

                    Response

                  </p>

                </div>

                <div className="rounded-2xl bg-background/60 border border-border p-6">

                  <HeartPulse className="text-fuchsia-400"/>

                  <h2 className="mt-5 text-4xl font-bold">

                    99%

                  </h2>

                  <p className="text-muted-foreground mt-2">

                    Success

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
