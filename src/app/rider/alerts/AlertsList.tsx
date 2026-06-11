"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell } from "lucide-react";

interface N { id: string; title: string; body: string; type: string; read: boolean; created_at: string; }

export function AlertsList({ userId, initial }: { userId: string; initial: N[] }) {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<N[]>(initial);

  useEffect(() => {
    const unread = initial.filter((n) => !n.read).map((n) => n.id);
    if (unread.length) supabase.from("notifications").update({ read: true }).in("id", unread).then(() => {});
    const channel = supabase.channel("notif-" + userId)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: "user_id=eq." + userId }, (payload) => {
        setItems((prev) => [payload.new as N, ...prev]);
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, userId, initial]);

  if (items.length === 0) return <p className="text-muted text-sm text-center pt-12">No alerts yet.</p>;
  return (
    <ul className="space-y-2">
      {items.map((n) => (
        <li key={n.id} className="rounded-2xl bg-surface p-4 flex gap-3">
          <div className="pill w-9 h-9 bg-primary text-primary-on flex items-center justify-center shrink-0"><Bell className="w-4 h-4" /></div>
          <div className="min-w-0">
            <p className="font-medium text-sm">{n.title}</p>
            {n.body && <p className="text-sm text-muted">{n.body}</p>}
            <p className="text-xs text-meta mt-0.5">{new Date(n.created_at).toLocaleString()}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}