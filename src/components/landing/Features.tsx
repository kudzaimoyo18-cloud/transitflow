"use client";

import {
  Truck,
  Users,
  CalendarCheck,
  Route,
  CreditCard,
  Gavel,
  BarChart3,
  Gift,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Truck,
    title: "Fleet Management",
    description:
      "Track every vehicle — status, documents, maintenance schedules, and utilization rates in real time.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Users,
    title: "Driver Management",
    description:
      "Manage driver profiles, licenses, availability, and performance. Assign drivers to trips instantly.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: CalendarCheck,
    title: "Smart Bookings",
    description:
      "Create and manage transport bookings with automated vehicle and driver assignment workflows.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Route,
    title: "Trip Tracking",
    description:
      "End-to-end trip visibility with status updates, ETAs, route optimization, and proof of delivery.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: CreditCard,
    title: "Payments & Invoicing",
    description:
      "Generate invoices, track payments, manage settlements, and reconcile accounts effortlessly.",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    icon: Gavel,
    title: "Load Board & Bidding",
    description:
      "Shippers post loads, transporters bid competitively. Commission agents broker deals and earn.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Revenue dashboards, fleet utilization, driver performance, and trip analytics at a glance.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Gift,
    title: "Referral Program",
    description:
      "Grow your network with built-in referral tracking, unique codes, and automated commission payouts.",
    color: "bg-indigo-50 text-indigo-600",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything you need to run your{" "}
            <span className="text-primary">transport business</span>
          </h2>
          <p className="text-lg text-muted">
            One platform replaces spreadsheets, phone calls, and disconnected tools.
            Built for how transport companies actually work.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group p-6 rounded-2xl border border-border bg-white hover:shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}
              >
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
