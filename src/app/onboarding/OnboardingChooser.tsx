"use client";

import { useState } from "react";
import { User, Building2 } from "lucide-react";
import { CreateOrgForm } from "./CreateOrgForm";
import { JoinForm } from "./JoinForm";

type Path = "rider" | "company";

// Shown when the signed-in user has no membership yet and no committed role
// (e.g. Google sign-in, where no role was picked at signup).
export function OnboardingChooser({ name, initial }: { name: string; initial: Path }) {
  const [path, setPath] = useState<Path>(initial);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button type="button" onClick={() => setPath("rider")}
          className={"flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-colors " + (path === "rider" ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40")}>
          <User className="w-5 h-5 text-primary" />
          <span className="font-medium text-sm">I&apos;m a rider</span>
          <span className="text-xs text-muted">Join my transport company</span>
        </button>
        <button type="button" onClick={() => setPath("company")}
          className={"flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-colors " + (path === "company" ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40")}>
          <Building2 className="w-5 h-5 text-primary" />
          <span className="font-medium text-sm">Transport company</span>
          <span className="text-xs text-muted">Manage buses & riders</span>
        </button>
      </div>

      {path === "company" ? <CreateOrgForm name={name} /> : <JoinForm role="rider" />}
    </div>
  );
}