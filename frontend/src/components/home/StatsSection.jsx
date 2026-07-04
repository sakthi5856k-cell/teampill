import { motion } from "framer-motion";
import {
  Users,
  Ambulance,
  HeartPulse,
  Activity,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    title: "Active Staff",
    value: "128",
    color: "text-cyan-400",
  },
  {
    icon: Ambulance,
    title: "Emergency Calls",
    value: "5,842",
    color: "text-emerald-400",
  },
  {
    icon: HeartPulse,
    title: "Lives Saved",
    value: "9,315",
    color: "text-red-400",
  },
  {
    icon: Activity,
    title: "Success Rate",
    value: "99%",
    color: "text-fuchsia-400",
  },
];

export default function StatsSection() {
  return (
    <section className="relative py-24">

      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .7 }}
          className="text-center"
        >
          <h2 className="text-4xl font-black">

            Live EMS Statistics

          </h2>

          <p className="mt-4 text-muted-foreground">

            Real-time emergency medical service overview.

          </p>

        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.div
                key={index}
                initial={{ opacity:0, y:40 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{
                  delay:index*0.15,
                  duration:.5
                }}
                whileHover={{
                  y:-8,
                  scale:1.02
                }}
                className="group rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-xl p-8 transition-all"
              >

                <div className={`inline-flex rounded-2xl bg-background/60 p-4 ${item.color}`}>

                  <Icon size={34} />

                </div>

                <h3 className="mt-8 text-5xl font-black">

                  {item.value}

                </h3>

                <p className="mt-3 text-muted-foreground">

                  {item.title}

                </p>

                <div className="mt-8 h-1 rounded-full bg-border overflow-hidden">

                  <motion.div
                    initial={{ width:0 }}
                    whileInView={{ width:"100%" }}
                    viewport={{ once:true }}
                    transition={{
                      duration:1.2,
                      delay:index*.2
                    }}
                    className="h-full bg-primary"
                  />

                </div>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
}
