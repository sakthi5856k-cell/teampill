import { motion } from "framer-motion";
import { Calendar, Megaphone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const announcements = [
  {
    title: "EMS Recruitment Open",
    date: "July 2026",
    description:
      "Applications are now open for new EMS recruits. Join our professional medical team today.",
  },
  {
    title: "Medical SOP Updated",
    date: "June 2026",
    description:
      "All EMS staff must review the latest Standard Operating Procedures before duty.",
  },
  {
    title: "Training Session",
    date: "Weekly Event",
    description:
      "Mandatory EMS practical training every Saturday at Pillbox Medical Center.",
  },
];

export default function AnnouncementSection() {
  return (
    <section className="py-24 relative">

      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity:0,y:30 }}
          whileInView={{ opacity:1,y:0 }}
          viewport={{ once:true }}
          transition={{ duration:.6 }}
          className="text-center"
        >

          <h2 className="text-4xl font-black">

            Latest Announcements

          </h2>

          <p className="mt-4 text-muted-foreground">

            Stay updated with the latest EMS CORE RP news.

          </p>

        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">

          {announcements.map((item,index)=>(

            <motion.div
              key={index}
              initial={{ opacity:0,y:40 }}
              whileInView={{ opacity:1,y:0 }}
              viewport={{ once:true }}
              transition={{
                delay:index*.15
              }}
              whileHover={{
                y:-8
              }}
              className="rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-xl p-8"
            >

              <Megaphone className="text-primary"/>

              <h3 className="mt-6 text-2xl font-bold">

                {item.title}

              </h3>

              <div className="mt-4 flex items-center gap-2 text-primary">

                <Calendar size={16}/>

                {item.date}

              </div>

              <p className="mt-6 leading-7 text-muted-foreground">

                {item.description}

              </p>

            </motion.div>

          ))}

        </div>

        <div className="mt-14 text-center">

          <Link
            to="/announcements"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white transition hover:scale-105"
          >

            View All Announcements

            <ArrowRight size={18}/>

          </Link>

        </div>

      </div>

    </section>
  );
}
