import { motion } from "framer-motion";
import {
  Stethoscope,
  Ambulance,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";

const departments = [
  {
    title: "Medical Doctors",
    icon: Stethoscope,
    color: "text-cyan-400",
    desc: "Professional diagnosis and advanced medical treatment for all patients.",
  },
  {
    title: "Paramedics",
    icon: Ambulance,
    color: "text-emerald-400",
    desc: "Rapid emergency response, patient transport and lifesaving support.",
  },
  {
    title: "Trauma Unit",
    icon: HeartPulse,
    color: "text-red-400",
    desc: "Critical care specialists handling severe emergency situations.",
  },
  {
    title: "EMS Command",
    icon: ShieldCheck,
    color: "text-fuchsia-400",
    desc: "Leadership team coordinating operations and emergency response.",
  },
];

export default function DepartmentSection() {
  return (
    <section className="relative py-24">

      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity:0,y:30 }}
          whileInView={{ opacity:1,y:0 }}
          viewport={{ once:true }}
          transition={{ duration:.6 }}
          className="text-center"
        >
          <h2 className="text-4xl font-black">

            EMS Departments

          </h2>

          <p className="mt-4 text-muted-foreground">

            Dedicated divisions working together to save lives.

          </p>

        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {departments.map((dept,index)=>{

            const Icon = dept.icon;

            return(

              <motion.div
                key={index}
                initial={{ opacity:0,y:40 }}
                whileInView={{ opacity:1,y:0 }}
                viewport={{ once:true }}
                transition={{
                  delay:index*.15,
                  duration:.5
                }}
                whileHover={{
                  y:-10,
                  scale:1.03
                }}
                className="group rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-xl p-8 transition-all"
              >

                <div className={`inline-flex rounded-2xl bg-background/60 p-4 ${dept.color}`}>

                  <Icon size={36}/>

                </div>

                <h3 className="mt-8 text-2xl font-bold">

                  {dept.title}

                </h3>

                <p className="mt-4 text-muted-foreground leading-7">

                  {dept.desc}

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

            )

          })}

        </div>

      </div>

    </section>
  );
}
