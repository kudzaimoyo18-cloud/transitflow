"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function JoinByCode({ code }: { code: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function join() {
    setPending(true); setError(null);
    const supabase = createClient();
    const { error } = await supabase.rpc("join_org_with_code", { code: code.toLowerCase(), join_role: "rider" });
    if (error) { setError(error.message); setPending(false); return; }
    router.replace("/rider/subscribe"); router.refresh();
  }
  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button onClick={join} disabled={pending} className="w-full py-2.5 pill bg-primary text-primary-on font-medium disabled:opacity-60 flex items-center justify-center gap-2">
        {pending && <Loader2 className="w-4 h-4 animate-spin" />} Join as rider
      </button>
    </div>
  );
}
