"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Truck, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { signup, type AuthState } from "@/actions/auth";

const roles = [
  {
    value: "FLEET_OWNER",
    label: "Fleet Owner",
    description: "Manage vehicles, drivers, and operations",
  },
  {
    value: "DRIVER",
    label: "Driver",
    description: "Accept trips and track deliveries",
  },
  {
    value: "COMMISSION_AGENT",
    label: "Commission Agent",
    description: "Broker loads and earn commissions",
  },
  {
    value: "CUSTOMER",
    label: "Customer / Shipper",
    description: "Book shipments and track cargo",
  },
];

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    signup,
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("FLEET_OWNER");

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
        <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
        <p className="text-muted">
          Start your 14-day free trial. No credit card required.
        </p>
      </div>

      {state.error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="John Doe"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          {state.fieldErrors?.name && (
            <p className="text-red-500 text-xs mt-1">
              {state.fieldErrors.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Work Email
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
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="Min. 8 characters"
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">I am a...</label>
          <input type="hidden" name="role" value={selectedRole} />
          <div className="grid grid-cols-2 gap-2">
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setSelectedRole(role.value)}
                className={`text-left p-3 rounded-lg border-2 transition-all ${
                  selectedRole === role.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted/50"
                }`}
              >
                <div className="text-sm font-medium text-foreground">
                  {role.label}
                </div>
                <div className="text-xs text-muted mt-0.5">
                  {role.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedRole === "FLEET_OWNER" && (
          <div className="space-y-1.5">
            <label htmlFor="organizationName" className="text-sm font-medium text-foreground">
              Company Name
            </label>
            <input
              id="organizationName"
              name="organizationName"
              type="text"
              placeholder="Your Transport Co."
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? "Creating account..." : "Create account"}
        </button>

        <p className="text-xs text-muted text-center">
          By creating an account, you agree to our{" "}
          <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>{" "}
          and{" "}
          <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
