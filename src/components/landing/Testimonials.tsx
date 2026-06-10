"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Ahmed Al-Rashid",
    role: "Fleet Owner, Gulf Logistics",
    quote:
      "TransitFlow replaced three different tools we were using. Now everything — bookings, drivers, payments — is in one place. Our efficiency jumped 40%.",
    rating: 5,
  },
  {
    name: "Sarah Ndlovu",
    role: "Operations Manager, TransAfrica Ltd",
    quote:
      "The trip tracking and driver management features are game changers. We can see exactly where every truck is and how every driver is performing.",
    rating: 5,
  },
  {
    name: "Raj Patel",
    role: "Commission Agent, Pacific Freight",
    quote:
      "The load board and bidding system made it so easy to connect shippers with transporters. My commissions have doubled since switching to TransitFlow.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Loved by <span className="text-primary">transport companies</span>
          </h2>
          <p className="text-lg text-muted">
            See what fleet owners, drivers, and agents say about TransitFlow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-border shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm text-muted leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
