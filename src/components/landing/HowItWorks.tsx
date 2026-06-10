"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Register your fleet",
    description:
      "Add your vehicles, drivers, and company details. Set up your organization in minutes.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
    alt: "White cargo truck on road",
  },
  {
    step: "02",
    title: "Manage bookings & trips",
    description:
      "Create bookings, assign drivers and vehicles, track trips end-to-end with live status updates.",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80",
    alt: "Logistics dashboard on laptop",
  },
  {
    step: "03",
    title: "Get paid, grow revenue",
    description:
      "Automated invoicing, payment tracking, and analytics to maximize fleet utilization and profit.",
    image: "https://images.unsplash.com/photo-1554260570-e9689a3418b8?w=600&q=80",
    alt: "Trucks at loading dock",
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
          <p className="text-lg text-muted">
            No complicated setup. No training needed. Start managing your transport
            operations today.
          </p>
        </div>

        <div className="space-y-16 lg:space-y-24">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`grid lg:grid-cols-2 gap-10 items-center ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="text-5xl font-black text-primary/10 mb-4">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted leading-relaxed max-w-md">
                  {step.description}
                </p>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    width={600}
                    height={400}
                    className="w-full h-64 lg:h-80 object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
