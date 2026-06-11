import { redirect } from "next/navigation";
import { requireContext } from "@/lib/session";
import { BottomNav } from "@/components/rider/BottomNav";

export default async function RiderLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireContext();
  const rider = ctx.memberships.find((m) => m.role === "rider");
  const staff = ctx.memberships.find((m) => m.role === "org_owner" || m.role === "org_staff");
  if (!rider) redirect(staff ? "/dashboard" : "/onboarding");

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pb-20 relative border-x border-border">
      {children}
      <BottomNav />
    </div>
  );
}