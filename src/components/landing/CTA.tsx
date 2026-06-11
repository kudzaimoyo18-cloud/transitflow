import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary text-primary-on rounded-[2.5rem] p-12 lg:p-20 text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            Put your buses on the map.
          </h2>
          <p className="opacity-60 text-lg mb-10 max-w-xl mx-auto">
            Set up your first route free and give your riders a way to pay and track today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="pill inline-flex items-center justify-center gap-2 bg-primary-on text-primary font-semibold px-9 py-4 hover:opacity-90 transition-opacity">
              Start your company <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="pill inline-flex items-center justify-center gap-2 border border-primary-on/30 font-semibold px-9 py-4 hover:bg-primary-on/10 transition-colors">
              I am a rider
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}