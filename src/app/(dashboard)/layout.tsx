import { redirect } from "next/navigation";
import { requireContext } from "@/lib/session";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireContext();
  const staff = ctx.memberships.find((m) => m.role === "org_owner" || m.role === "org_staff");
  if (!staff) {
    const rider = ctx.memberships.find((m) => m.role === "rider");
    redirect(rider ? "/rider" : "/onboarding");
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar userName={ctx.profile?.full_name || ctx.email} orgName={staff!.organizations.name} />
      <main className="flex-1 flex flex-col min-w-0">{children}</main>
    </div>
  );
}
