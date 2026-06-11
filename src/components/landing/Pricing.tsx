"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Get your first route online",
    features: ["1 bus", "Up to 30 riders", "In-app fare payments", "Payment reminders", "Pickup & arrival alerts", "Email support"],
    cta: "Start free",
    popular: false,
  },
  {
    name: "Growth",
    price: "$19",
    period: "/bus/mo",
    description: "For companies running multiple buses",
    features: ["Unlimited riders", "Live bus tracking", "Cost tracking & accounting", "Revenue & profit dashboard", "Announcements", "Multiple drivers", "Priority support"],
    cta: "Start your company",
    popular: true,
  },
  {
    name: "Scale",
    price: "Custom",
    period: "",
    description: "For large operators & multiple depots",
    features: ["Everything in Growth", "Multiple depots", "Dedicated onboarding", "Custom payment integrations", "Account manager", "SLA"],
    cta: "Talk to us",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Pricing that scales with your fleet
          </h2>
          <p className="text-lg text-muted">Start free with one bus. Pay per bus as you grow. Riders always use the app for free.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl">
          {plans.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 ${plan.popular ? "bg-primary text-primary-on" : "bg-surface"}`}>
              {plan.popular && (
                <div className="pill absolute -top-3 left-8 bg-signal text-black text-xs font-bold px-4 py-1">Most popular</div>
              )}
              <h3 className="font-display text-lg font-bold mb-1">{plan.name}</h3>
              <p className={`text-sm mb-6 ${plan.popular ? "opacity-60" : "text-muted"}`}>{plan.description}</p>
              <div className="mb-7">
                <span className="font-display text-5xl font-bold">{plan.price}</span>
                <span className={`text-sm ${plan.popular ? "opacity-60" : "text-muted"}`}>{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-signal" />
                    <span className={plan.popular ? "opacity-80" : "text-muted"}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className={`pill block text-center font-semibold py-3.5 transition-colors ${plan.popular ? "bg-primary-on text-primary hover:opacity-90" : "bg-primary text-primary-on hover:bg-primary-dark"}`}>
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}