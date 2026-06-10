import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-12 lg:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to streamline your transport operations?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Join 500+ transport companies already using TransitFlow.
              Start your free 14-day trial — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-medium px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
