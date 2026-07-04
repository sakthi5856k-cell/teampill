import { motion } from "framer-motion";
import { MessageCircle, Users, ArrowRight } from "lucide-react";

export default function DiscordSection() {
  return (
    <section className="relative py-24">

      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:.6 }}
          className="rounded-[32px] overflow-hidden border border-primary/20 bg-card/60 backdrop-blur-xl"
        >

          <div className="grid lg:grid-cols-2">

            {/* Left */}

            <div className="p-10 lg:p-14">

              <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-background/40 px-4 py-2">

                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>

                <span className="text-sm">

                  Discord Community Online

                </span>

              </div>

              <h2 className="mt-8 text-5xl font-black">

                Join Our

                <span className="gradient-text block">

                  Discord Server

                </span>

              </h2>

              <p className="mt-6 text-lg leading-8 text-muted-foreground">

                Connect with EMS staff, receive announcements,
                participate in trainings and stay updated with
                the EMS CORE RP community.

              </p>

              <a
                href="https://discord.gg/YOURINVITE"
                target="_blank"
                rel="noreferrer"
                className="mt-10 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white transition hover:scale-105"
              >
                Join Discord

                <ArrowRight size={18}/>
              </a>

            </div>

            {/* Right */}

            <div className="flex items-center justify-center p-10">

              <div className="w-full max-w-sm rounded-3xl border border-primary/20 bg-background/60 p-8">

                <div className="flex items-center justify-between">

                  <MessageCircle
                    size={34}
                    className="text-cyan-400"
                  />

                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-green-400 text-sm">

                    ONLINE

                  </span>

                </div>

                <h3 className="mt-8 text-3xl font-bold">

                  EMS CORE RP

                </h3>

                <p className="mt-3 text-muted-foreground">

                  Official Discord Community

                </p>

                <div className="mt-8 flex items-center gap-3">

                  <Users className="text-primary"/>

                  <span>

                    1,500+ Members

                  </span>

                </div>

                <div className="mt-10 h-2 rounded-full bg-border overflow-hidden">

                  <motion.div
                    initial={{ width:0 }}
                    whileInView={{ width:"78%" }}
                    viewport={{ once:true }}
                    transition={{ duration:1.5 }}
                    className="h-full bg-primary"
                  />

                </div>

                <p className="mt-3 text-sm text-muted-foreground">

                  Community Activity

                </p>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}
