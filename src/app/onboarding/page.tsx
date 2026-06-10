import { redirect } from "next/navigation";
import { requireContext } from "@/lib/session";
import { CreateOrgForm } from "./CreateOrgForm";
import { JoinForm } from "./JoinForm";

export default async function OnboardingPage() {
  const ctx = await requireContext();
  const role = ctx.profile?.role ?? "rider";

  if (role === "platform_admin") redirect("/dashboard");

  const staff = ctx.memberships.find((m) => m.role === "org_owner" || m.role === "org_staff");
  if (staff) redirect("/dashboard");
  const driver = ctx.memberships.find((m) => m.role === "driver");
  if (driver) redirect("/driver");
  const rider = ctx.memberships.find((m) => m.role === "rider");
  if (rider) redirect("/rider");

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-border shadow-sm p-8">
        {role === "org_owner" ? (
          <CreateOrgForm name={ctx.profile?.full_name ?? ""} />
        ) : (
          <JoinForm role={role === "driver" ? "driver" : "rider"} />
        )}
      </div>
    </div>
  );
}
