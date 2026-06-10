"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const CURRENCIES = ["AED", "SAR", "QAR", "KWD", "BHD", "OMR", "USD"];

export function CreateOrgForm({ name }: { name: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.rpc("create_organization", {
      org_name: String(form.get("org_name")),
      org_city: String(form.get("org_city") || ""),
      org_currency: String(form.get("org_currency")),
    });
    if (error) {
      setError(error.message);
      setPending(false);
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Set up your company</h1>
          <p className="text-sm text-muted">Welcome{name ? ", " + name : ""}.</p>
        </div>
      </div>
      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Company name</label>
          <input name="org_name" required placeholder="e.g. Labalo Transport"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">City</label>
            <input name="org_city" placeholder="Dubai"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Currency</label>
            <select name="org_currency" defaultValue="AED"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" disabled={pending}
          className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2">
          {pending && <Loader2 className="w-4 h-4 animate-spin" />}
          {pending ? "Creating..." : "Create company"}
        </button>
      </form>
    </>
  );
}
