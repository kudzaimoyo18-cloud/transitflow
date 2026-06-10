"use client";

import { useState } from "react";
import { createSubscription } from "../actions";
import { Loader2 } from "lucide-react";

interface Route { id: string; name: string; origin: string; destination: string; monthly_price: number; departure_time: string; stops: { id: string; name: string }[]; }

export function SubscribeForm({ routes, currency }: { routes: Route[]; currency: string }) {
  const [selected, setSelected] = useState<string>("");
  const [pending, setPending] = useState(false);
  const route = routes.find((r) => r.id === selected);

  function money(n: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n || 0);
  }

  if (routes.length === 0) return <p className="text-muted text-sm">This company has no routes yet. Check back soon.</p>;

  return (
    <form action={(fd) => { setPending(true); return createSubscription(fd); }} className="space-y-4">
      <div className="space-y-2">
        {routes.map((r) => (
          <label key={r.id} className={"block rounded-xl border p-3 cursor-pointer " + (selected === r.id ? "border-primary bg-primary/5" : "border-border")}>
            <input type="radio" name="route_id" value={r.id} className="sr-only" onChange={() => setSelected(r.id)} required />
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-xs text-muted">{r.origin} to {r.destination} - departs {r.departure_time?.slice(0,5)}</p>
              </div>
              <p className="font-bold text-primary">{money(Number(r.monthly_price))}<span className="text-xs font-normal text-muted">/mo</span></p>
            </div>
          </label>
        ))}
      </div>

      {route && (
        <>
          {route.stops.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Pickup stop</label>
              <select name="pickup_stop_id" className="w-full px-3 py-2.5 rounded-lg border border-border text-sm">
                <option value="">Select your stop</option>
                {route.stops.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Home address</label>
            <input name="home_address" placeholder="Building / area where you live" className="w-full px-3 py-2.5 rounded-lg border border-border text-sm" />
            <p className="text-xs text-muted">Helps your company plan pickups near you.</p>
          </div>
        </>
      )}

      <button type="submit" disabled={!selected || pending} className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2">
        {pending && <Loader2 className="w-4 h-4 animate-spin" />}
        Subscribe
      </button>
    </form>
  );
}
