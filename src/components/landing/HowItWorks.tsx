"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Set up your routes & buses",
    description: "Add your buses, draw your routes and stops, set the monthly fare, and invite your drivers. Takes minutes, no training needed.",
    image: "https://images.unsplash.com/photo-1556122071-e404eaedb77f?w=600&q=80",
    alt: "Buses parked at depot",
  },
  {
    step: "02",
    title: "Riders join and pay",
    description: "Share one invite code. Riders install the app, pick their route and stop, and pay their monthly fare with card or Ziina. You confirm and they are active.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
    alt: "Commuter using phone",
  },
  {
    step: "03",
    title: "Drive, track and get paid",
    description: "Drivers stream the bus live and tap stop updates. Riders watch it arrive. You see who paid, who is overdue, and your profit on every route.",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80",
    alt: "City bus on route",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Up and running in <span className="text-primary">three steps</span>
          </h2>
          <p className="text-lg text-muted">From spreadsheets and cash to a paid, tracked, modern service - in an afternoon.</p>
        </div>
        <div className="space-y-16 lg:space-y-24">
          {steps.map((step, i) => (
            <motion.div key={step.step}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-10 items-center">
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="text-5xl font-black text-primary/10 mb-4">{step.step}</div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted leading-relaxed max-w-md">{step.description}</p>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <Image src={step.image} alt={step.alt} width={600} height={400} className="w-full h-64 lg:h-80 object-cover" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}