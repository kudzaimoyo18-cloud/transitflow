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
    <section id="how-it-works" className="py-20 lg:py-28 bg-primary text-primary-on">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Up and running in three steps
          </h2>
          <p className="text-lg opacity-60">From spreadsheets and cash to a paid, tracked, modern service - in an afternoon.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div key={step.step}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl overflow-hidden bg-primary-on/5 border border-primary-on/10">
              <div className="h-48 overflow-hidden">
                <Image src={step.image} alt={step.alt} width={600} height={300} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="font-display text-sm font-bold opacity-40 mb-2">{step.step}</div>
                <h3 className="font-display text-xl font-bold mb-2.5">{step.title}</h3>
                <p className="text-sm opacity-60 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}