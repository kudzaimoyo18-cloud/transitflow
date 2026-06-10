"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import type { MapPoint } from "./BusMap";

const BusMap = dynamic(() => import("./BusMap").then((m) => m.BusMap), { ssr: false });

interface ActiveTrip { id: string; bus_label: string; route_name: string; }

export function FleetMap({ orgId }: { orgId: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [positions, setPositions] = useState<Record<string, MapPoint>>({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    let tripIds: string[] = [];
    const meta: Record<string, ActiveTrip> = {};

    async function load() {
      const { data: trips } = await supabase
        .from("trips")
        .select("id, buses(label), routes(name)")
        .eq("org_id", orgId)
        .eq("status", "in_progress");
      const t = (trips ?? []) as unknown as Array<{ id: string; buses: { label: string } | null; routes: { name: string } | null }>;
      tripIds = t.map((x) => x.id);
      setCount(tripIds.length);
      t.forEach((x) => { meta[x.id] = { id: x.id, bus_label: x.buses?.label ?? "Bus", route_name: x.routes?.name ?? "" }; });
      if (tripIds.length === 0) { setPositions({}); return; }

      const { data: locs } = await supabase
        .from("trip_locations")
        .select("trip_id, lat, lng, recorded_at")
        .in("trip_id", tripIds)
        .order("recorded_at", { ascending: false })
        .limit(200);
      const latest: Record<string, MapPoint> = {};
      (locs ?? []).forEach((l: { trip_id: string; lat: number; lng: number }) => {
        if (latest[l.trip_id]) return;
        const m = meta[l.trip_id];
        latest[l.trip_id] = { id: l.trip_id, lat: l.lat, lng: l.lng, kind: "bus", label: (m?.bus_label ?? "Bus") + " - " + (m?.route_name ?? "") };
      });
      setPositions(latest);
    }
    load();

    const channel = supabase
      .channel("fleet-" + orgId)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "trip_locations" }, (payload) => {
        const row = payload.new as { trip_id: string; lat: number; lng: number };
        if (!meta[row.trip_id]) return;
        const m = meta[row.trip_id];
        setPositions((prev) => ({ ...prev, [row.trip_id]: { id: row.trip_id, lat: row.lat, lng: row.lng, kind: "bus", label: m.bus_label + " - " + m.route_name } }));
      })
      .subscribe();

    const interval = setInterval(load, 30000);
    return () => { supabase.removeChannel(channel); clearInterval(interval); };
  }, [orgId, supabase]);

  const points = Object.values(positions);

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="font-semibold">Live fleet</h2>
        <span className="text-sm text-muted">{count} bus{count === 1 ? "" : "es"} running</span>
      </div>
      {points.length === 0 ? (
        <div className="h-[360px] flex items-center justify-center text-muted text-sm">No buses are currently on a trip.</div>
      ) : (
        <BusMap points={points} className="w-full h-[360px]" />
      )}
    </div>
  );
}
