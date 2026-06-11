"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Bus, Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    if (error) {
      setError(error.message);
      setPending(false);
      return;
    }
    router.replace(params.get("from") || "/onboarding");
    router.refresh();
  }

  return (
    <>
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
          <Bus className="w-5 h-5 text-primary-on" />
        </div>
        <span className="font-display text-xl font-bold tracking-tight">
          Transit<span className="text-foreground">Flow</span>
        </span>
      </div>

      <div className="space-y-2 mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">Welcome back</h2>
        <p className="text-muted">Sign in to continue.</p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-danger-soft border border-danger/20 text-danger text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className="relative">
            <input id="password" name="password" type={showPassword ? "text" : "password"}
              autoComplete="current-password" required placeholder="Enter your password"
              className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background pr-11 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={pending}
          className="w-full py-2.5 pill bg-primary hover:bg-primary-dark text-primary-on font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {pending && <Loader2 className="w-4 h-4 animate-spin" />}
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-foreground underline font-medium hover:underline">Create one</Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-muted text-sm">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
