"use client";

import { Bus, CreditCard, Bell, MapPin, Receipt, Megaphone, Users, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: CreditCard, title: "In-app fare payments", description: "Riders pay their monthly fare with your own Stripe or Ziina link. Money lands straight in your account.", color: "bg-blue-50 text-blue-600" },
  { icon: Bell, title: "Automatic payment reminders", description: "Riders get reminded before the due date, on the day, and when overdue - so you chase fewer people.", color: "bg-amber-50 text-amber-600" },
  { icon: MapPin, title: "Live bus tracking", description: "Drivers stream their location from their phone. Riders watch the bus approach their stop in real time.", color: "bg-green-50 text-green-600" },
  { icon: Megaphone, title: "Pickup & route updates", description: "Tap departed or arrived and every rider on the route is notified instantly. Post route changes in seconds.", color: "bg-purple-50 text-purple-600" },
  { icon: Users, title: "Rider directory", description: "See everyone on each route - who paid, who is overdue, their pickup stop and where they live.", color: "bg-cyan-50 text-cyan-600" },
  { icon: Receipt, title: "Cost tracking & accounting", description: "Log fuel, maintenance and other costs per bus. Know your real profit on every route, every month.", color: "bg-rose-50 text-rose-600" },
  { icon: BarChart3, title: "Revenue dashboard", description: "Collected this month, recurring revenue, overdue riders and profit - the numbers that matter, at a glance.", color: "bg-indigo-50 text-indigo-600" },
  { icon: Bus, title: "Your buses, your way", description: "Name each bus how your company does - Bus 28, VIP Coach - and assign it to routes and drivers.", color: "bg-orange-50 text-orange-600" },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything you need to run a <span className="text-primary">commuter service</span>
          </h2>
          <p className="text-lg text-muted">
            One platform for payments, reminders, tracking and accounting - and an app your riders actually want to use.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div key={feature.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group p-6 rounded-2xl border border-border bg-white hover:shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}