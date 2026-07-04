import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, HeartPulse } from "lucide-react";

export default function FooterCTA() {
  return (
    <section className="relative py-24 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-cyan-500/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .7 }}
          className="rounded-[36px] border border-primary/20 bg-card/70 backdrop-blur-xl p-12 text-center shadow-2xl"
        >

          <HeartPulse
            size={70}
            className="mx-auto text-primary mb-8"
          />

          <h2 className="text-5xl font-black">

            Ready To Save Lives?

          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">

            Become part of the EMS CORE RP medical team.
            Work alongside experienced doctors, paramedics,
            and emergency responders.

          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">

            <Link
              to="/apply"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white transition hover:scale-105"
            >
              Apply Now

              <ArrowRight size={18} />

            </Link>

            <Link
              to="/rules"
              className="rounded-xl border border-border px-8 py-4 hover:border-primary transition"
            >
              Read Rules
            </Link>

          </div>

        </motion.div>

      </div>

    </section>
  );
}
