"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ticket, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function JoinForm({ role }: { role: "rider" | "driver" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.rpc("join_org_with_code", {
      code: String(form.get("code")).trim().toLowerCase(),
      join_role: role,
    });
    if (error) {
      setError(error.message);
      setPending(false);
      return;
    }
    router.replace(role === "driver" ? "/driver" : "/rider");
    router.refresh();
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-surface-2 flex items-center justify-center">
          <Ticket className="w-6 h-6 text-foreground" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold">Join your transport company</h1>
          <p className="text-sm text-muted">Enter the invite code they gave you.</p>
        </div>
      </div>
      {error && <div className="mb-4 p-3 rounded-lg bg-danger-soft border border-danger/20 text-danger text-sm">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="code" required placeholder="e.g. 9f3a2b1c"
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-center tracking-widest font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        <button type="submit" disabled={pending}
          className="w-full py-2.5 pill bg-primary hover:bg-primary-dark text-primary-on font-medium disabled:opacity-60 flex items-center justify-center gap-2">
          {pending && <Loader2 className="w-4 h-4 animate-spin" />}
          {pending ? "Joining..." : "Join"}
        </button>
      </form>
    </>
  );
}
