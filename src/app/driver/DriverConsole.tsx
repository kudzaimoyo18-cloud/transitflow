"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Bus, Play, Square, MapPin, Users, LogOut, Radio, CheckCircle2 } from "lucide-react";

interface Stop { id: string; name: string; position: number; }
interface Route { id: string; name: string; origin: string; destination: string; bus_id: string | null; buses: { label: string } | null; stops: Stop[]; }
interface ActiveTrip { id: string; route_id: string; status: string; routes: { name: string; stops: Stop[] } | null; }

const PING_MS = 8000;

export function DriverConsole({ orgId, driverName, routes, activeTrip }: { orgId: string; driverName: string; routes: Route[]; activeTrip: ActiveTrip | null }) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [trip, setTrip] = useState<ActiveTrip | null>(activeTrip);
  const [selectedRoute, setSelectedRoute] = useState<string>(routes[0]?.id ?? "");
  const [streaming, setStreaming] = useState(false);
  const [lastPing, setLastPing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const watchRef = useRef<number | null>(null);
  const lastSentRef = useRef<number>(0);

  const stops = trip?.routes?.stops ?? routes.find((r) => r.id === trip?.route_id)?.stops ?? [];

  useEffect(() => {
    return () => { if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current); };
  }, []);

  function startStreaming(tripId: string) {
    if (!("geolocation" in navigator)) { alert("This device has no GPS."); return; }
    setStreaming(true);
    watchRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const now = Date.now();
        if (now - lastSentRef.current < PING_MS) return;
        lastSentRef.current = now;
        await supabase.from("trip_locations").insert({
          trip_id: tripId, lat: pos.coords.latitude, lng: pos.coords.longitude,
          speed: pos.coords.speed ?? null, heading: pos.coords.heading ?? null,
        });
        setLastPing(new Date().toLocaleTimeString());
      },
      (err) => { alert("GPS error: " + err.message); setStreaming(false); },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );
  }
  function stopStreaming() {
    if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = null;
    setStreaming(false);
  }

  async function startTrip() {
    const route = routes.find((r) => r.id === selectedRoute);
    if (!route) return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("trips").insert({
      org_id: orgId, route_id: route.id, bus_id: route.bus_id, driver_id: user!.id, status: "in_progress",
    }).select("id, route_id, status, routes(name, stops(id, name, position))").single();
    setBusy(false);
    if (error) { alert(error.message); return; }
    const t = data as unknown as ActiveTrip;
    setTrip(t);
    await event("departed", null, route.id, t.id);
    startStreaming(t.id);
  }

  async function event(type: string, stopId: string | null, routeId?: string, tripIdOverride?: string) {
    const tripId = tripIdOverride ?? trip?.id;
    if (!tripId) return;
    await supabase.from("trip_events").insert({ trip_id: tripId, org_id: orgId, type, stop_id: stopId });
    const rid = routeId ?? trip!.route_id;
    const labels: Record<string, string> = {
      departed: "Your bus has departed", arrived_stop: "Your bus has arrived at a stop",
      picked_up: "Passengers picked up", dropped_off: "Passengers dropped off", completed: "Trip completed",
    };
    await supabase.rpc("notify_route_riders", { p_route_id: rid, p_title: labels[type] ?? "Trip update", p_body: "", p_type: "trip" });
  }

  async function endTrip() {
    if (!trip) return;
    setBusy(true);
    await supabase.from("trips").update({ status: "completed", ended_at: new Date().toISOString() }).eq("id", trip.id);
    await event("completed", null);
    setBusy(false);
    stopStreaming();
    setTrip(null);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2"><Bus className="w-5 h-5 text-primary" /><span className="font-bold">Driver</span></div>
        <form action="/auth/signout" method="POST"><button className="text-white/60 hover:text-white"><LogOut className="w-4 h-4" /></button></form>
      </header>

      <div className="flex-1 p-4 space-y-4">
        <p className="text-white/60 text-sm">Hi {driverName}</p>

        {!trip ? (
          <div className="space-y-4">
            <label className="text-sm font-medium">Select route</label>
            <select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white">
              {routes.length === 0 && <option>No routes available</option>}
              {routes.map((r) => <option key={r.id} value={r.id} className="text-black">{r.name} {r.buses?.label ? "(" + r.buses.label + ")" : ""}</option>)}
            </select>
            <button onClick={startTrip} disabled={busy || !selectedRoute} className="w-full py-4 rounded-xl bg-primary font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50">
              <Play className="w-5 h-5" /> Start trip
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <p className="font-semibold">{trip.routes?.name}</p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <Radio className={"w-4 h-4 " + (streaming ? "text-emerald-400 animate-pulse" : "text-white/40")} />
                {streaming ? "Broadcasting live location" : "Location off"}
                {lastPing && <span className="text-white/40 ml-auto">last {lastPing}</span>}
              </div>
              <div className="mt-3">
                {streaming ? (
                  <button onClick={stopStreaming} className="text-sm text-amber-400">Pause sharing</button>
                ) : (
                  <button onClick={() => startStreaming(trip.id)} className="text-sm text-emerald-400">Resume sharing</button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => event("picked_up", null)} className="py-4 rounded-xl bg-white/10 border border-white/15 flex flex-col items-center gap-1"><Users className="w-5 h-5" /><span className="text-sm">Picked up</span></button>
              <button onClick={() => event("dropped_off", null)} className="py-4 rounded-xl bg-white/10 border border-white/15 flex flex-col items-center gap-1"><CheckCircle2 className="w-5 h-5" /><span className="text-sm">Dropped off</span></button>
            </div>

            {stops.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-white/70">Arrived at stop</p>
                <div className="grid grid-cols-2 gap-2">
                  {[...stops].sort((a, b) => a.position - b.position).map((s) => (
                    <button key={s.id} onClick={() => event("arrived_stop", s.id)} className="py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm flex items-center gap-1.5 px-3"><MapPin className="w-4 h-4 text-primary" />{s.name}</button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={endTrip} disabled={busy} className="w-full py-4 rounded-xl bg-red-500/90 font-bold flex items-center justify-center gap-2 disabled:opacity-50">
              <Square className="w-5 h-5" /> End trip
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
