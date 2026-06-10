"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const truckImages = [
  {
    src: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&q=80",
    alt: "Fleet of trucks on highway at sunset",
  },
  {
    src: "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?w=500&q=80",
    alt: "Red semi-truck on open road",
  },
  {
    src: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=500&q=80",
    alt: "Cargo trucks at distribution center",
  },
  {
    src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=80",
    alt: "White delivery truck on highway",
  },
];

export function TruckShowcase() {
  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <h2 className="text-2xl font-bold text-center">
          Built for <span className="text-primary">every fleet size</span>
        </h2>
      </div>
      <div className="flex gap-6 animate-[scroll_30s_linear_infinite]">
        {[...truckImages, ...truckImages].map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="shrink-0 w-72 h-48 rounded-2xl overflow-hidden"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={500}
              height={300}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
