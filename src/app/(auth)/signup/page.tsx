"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bus, Building2, User, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "rider" | "org_owner";

export default function SignupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("rider");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: String(form.get("full_name")),
          phone: String(form.get("phone") || ""),
          role: mode,
        },
      },
    });
    if (error) {
      setError(error.message);
      setPending(false);
      return;
    }
    // New users are auto-confirmed via DB trigger; if signUp did not return a
    // session (email-confirmation flow), sign in immediately so onboarding works.
    if (!data.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        setPending(false);
        return;
      }
    }
    router.replace("/onboarding");
    router.refresh();
  }

  return (
    <>
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
          <Bus className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">
          Transit<span className="text-primary">Flow</span>
        </span>
      </div>

      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-bold">Create your account</h2>
        <p className="text-muted">Choose how you will use TransitFlow.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button type="button" onClick={() => setMode("rider")}
          className={"flex flex-col items-start gap-1 p-3 rounded-lg border text-left transition-colors " + (mode === "rider" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}>
          <User className="w-5 h-5 text-primary" />
          <span className="font-medium text-sm">I&apos;m a rider</span>
          <span className="text-xs text-muted">Pay & track my bus</span>
        </button>
        <button type="button" onClick={() => setMode("org_owner")}
          className={"flex flex-col items-start gap-1 p-3 rounded-lg border text-left transition-colors " + (mode === "org_owner" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}>
          <Building2 className="w-5 h-5 text-primary" />
          <span className="font-medium text-sm">Transport company</span>
          <span className="text-xs text-muted">Manage buses & riders</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="full_name" className="text-sm font-medium">Full name</label>
          <input id="full_name" name="full_name" required placeholder="Your name"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-sm font-medium">Phone</label>
          <input id="phone" name="phone" placeholder="+971 5x xxx xxxx"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input id="password" name="password" type="password" required minLength={6} placeholder="At least 6 characters"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <button type="submit" disabled={pending}
          className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {pending && <Loader2 className="w-4 h-4 animate-spin" />}
          {pending ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
      </p>
    </>
  );
}
