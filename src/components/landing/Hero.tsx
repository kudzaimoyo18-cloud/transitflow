import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const highlights = ["Riders pay in-app", "Live bus tracking", "Auto payment reminders"];

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-orange-50/40" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="hero-animate-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Your riders pay, track and ride.{" "}
              <span className="text-primary">You run the business.</span>
            </h1>

            <p className="text-lg text-muted max-w-lg mb-8 leading-relaxed">
              TransitFlow gives your passengers an app to pay their monthly fare,
              get pickup updates and watch the bus arrive live - while you see who
              paid, who is overdue, and what every bus costs to run.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium px-7 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25">
                Start your company <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-surface border border-border text-foreground font-medium px-7 py-3.5 rounded-xl transition-colors">
                I am a rider
              </Link>
            </div>

            <div className="flex flex-wrap gap-4">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-muted">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />{item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative hero-animate-right">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border">
              <Image src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900&q=80" alt="Commuter bus" width={900} height={600} className="w-full h-auto object-cover" priority />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
