import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const highlights = ["Riders pay in-app", "Live bus tracking", "Auto payment reminders"];

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden bg-background">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="hero-animate-left">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-7">
              Riders pay.
              <br />
              Buses tracked.
              <br />
              <span className="text-meta">You run the show.</span>
            </h1>

            <p className="text-lg text-muted max-w-lg mb-9 leading-relaxed">
              Give your passengers an app to pay their monthly fare, get pickup
              updates and watch the bus arrive live - while you see who paid,
              who is overdue, and what every bus costs to run.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-9">
              <Link href="/signup" className="pill inline-flex items-center justify-center gap-2 bg-primary text-primary-on font-semibold px-8 py-4 hover:bg-primary-dark transition-colors">
                Start your company <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="pill inline-flex items-center justify-center gap-2 bg-surface-2 text-foreground font-semibold px-8 py-4 hover:bg-surface transition-colors">
                I am a rider
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-muted">
                  <CheckCircle2 className="w-4 h-4 text-signal" />{item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative hero-animate-right">
            <div className="relative rounded-3xl overflow-hidden shadow-float">
              <Image src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900&q=80" alt="Commuter bus" width={900} height={600} className="w-full h-auto object-cover" priority />
              <div className="absolute bottom-4 left-4 pill bg-background/90 backdrop-blur px-3.5 py-2 flex items-center gap-2 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
                Bus 28 - live now
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}