"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import type { MapPoint } from "@/components/map/BusMap";

const BusMap = dynamic(() => import("@/components/map/BusMap").then((m) => m.BusMap), { ssr: false });

interface Props {
  routeId: string;
  stops: { id: string; name: string; lat: number | null; lng: number | null }[];
  home?: { lat: number | null; lng: number | null } | null;
}

export function RiderRouteMap({ routeId, stops, home }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [bus, setBus] = useState<MapPoint | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let tripId: string | null = null;
    async function load() {
      const { data: trip } = await supabase.from("trips").select("id, buses(label)").eq("route_id", routeId).eq("status", "in_progress").order("started_at", { ascending: false }).limit(1).maybeSingle();
      if (!trip) { setBus(null); setLive(false); return; }
      tripId = (trip as { id: string }).id;
      const label = (trip as unknown as { buses: { label: string } | null }).buses?.label ?? "Bus";
      const { data: loc } = await supabase.from("trip_locations").select("lat, lng").eq("trip_id", tripId).order("recorded_at", { ascending: false }).limit(1).maybeSingle();
      if (loc) { setBus({ id: "bus", lat: (loc as {lat:number}).lat, lng: (loc as {lng:number}).lng, kind: "bus", label }); setLive(true); }
    }
    load();
    const channel = supabase.channel("rider-route-" + routeId)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "trip_locations" }, (payload) => {
        const row = payload.new as { trip_id: string; lat: number; lng: number };
        if (tripId && row.trip_id === tripId) { setBus((b) => ({ id: "bus", lat: row.lat, lng: row.lng, kind: "bus", label: b?.label ?? "Bus" })); setLive(true); }
      }).subscribe();
    const interval = setInterval(load, 30000);
    return () => { supabase.removeChannel(channel); clearInterval(interval); };
  }, [routeId, supabase]);

  const points: MapPoint[] = [];
  stops.forEach((s) => { if (s.lat != null && s.lng != null) points.push({ id: s.id, lat: s.lat, lng: s.lng, kind: "stop", label: s.name }); });
  if (home?.lat != null && home?.lng != null) points.push({ id: "home", lat: home.lat, lng: home.lng, kind: "home", label: "Home" });
  if (bus) points.push(bus);

  return (
    <div className="relative">
      <div className="absolute top-3 right-3 z-[500] px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 border border-border shadow-sm flex items-center gap-1.5">
        <span className={"w-2 h-2 rounded-full " + (live ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
        {live ? "Bus is live" : "No bus running now"}
      </div>
      {points.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted text-sm bg-white">Map will show your bus once a trip starts.</div>
      ) : (
        <BusMap points={points} className="w-full h-[300px]" />
      )}
    </div>
  );
}
