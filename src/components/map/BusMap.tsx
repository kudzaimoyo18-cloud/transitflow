"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  kind: "bus" | "stop" | "home";
}

const COLORS: Record<MapPoint["kind"], string> = {
  bus: "#2563eb",
  stop: "#64748b",
  home: "#f97316",
};

function iconFor(p: MapPoint) {
  const size = p.kind === "bus" ? 28 : 16;
  const ring = p.kind === "bus" ? "box-shadow:0 0 0 4px rgba(37,99,235,.25);" : "";
  return L.divIcon({
    className: "",
    html:
      '<div style="width:' + size + "px;height:" + size + "px;border-radius:50%;background:" +
      COLORS[p.kind] + ";border:2px solid #fff;" + ring +
      'display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700">' +
      (p.kind === "bus" ? "\u{1F68C}" : "") + "</div>",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function BusMap({ points, className }: { points: MapPoint[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, { zoomControl: true, attributionControl: false }).setView([25.2048, 55.2708], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const latlngs: L.LatLngExpression[] = [];
    points.forEach((p) => {
      if (p.lat == null || p.lng == null) return;
      L.marker([p.lat, p.lng], { icon: iconFor(p) }).bindTooltip(p.label).addTo(layer);
      latlngs.push([p.lat, p.lng]);
    });
    if (latlngs.length === 1) map.setView(latlngs[0], 14);
    else if (latlngs.length > 1) map.fitBounds(L.latLngBounds(latlngs).pad(0.2));
  }, [points]);

  return <div ref={ref} className={className ?? "w-full h-full"} style={{ minHeight: 320 }} />;
}
