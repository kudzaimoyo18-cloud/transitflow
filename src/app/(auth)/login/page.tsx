"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Truck, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { login, type AuthState } from "@/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    login,
    {}
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">
          Transit<span className="text-primary">Flow</span>
        </span>
      </div>

      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
        <p className="text-muted">
          Sign in to your account to continue managing your fleet.
        </p>
      </div>

      {state.error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          {state.fieldErrors?.email && (
            <p className="text-red-500 text-xs mt-1">
              {state.fieldErrors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <button type="button" className="text-xs text-primary hover:underline">
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {state.fieldErrors?.password && (
            <p className="text-red-500 text-xs mt-1">
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          Start your free trial
        </Link>
      </p>
    </>
  );
}
