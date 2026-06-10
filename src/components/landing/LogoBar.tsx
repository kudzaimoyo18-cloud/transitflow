export function LogoBar() {
  const companies = [
    "Gulf Logistics",
    "TransAfrica Ltd",
    "Pacific Freight",
    "EuroHaul",
    "Sahara Transport",
    "Nordic Fleet Co",
  ];

  return (
    <section className="py-12 border-y border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted mb-8 font-medium uppercase tracking-wider">
          Trusted by transport companies worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {companies.map((name) => (
            <div
              key={name}
              className="text-lg font-bold text-foreground/20 hover:text-foreground/40 transition-colors"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
