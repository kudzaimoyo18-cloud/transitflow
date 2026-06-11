import { redirect } from "next/navigation";
import { requireContext } from "@/lib/session";

export default async function DriverLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireContext();
  const member = ctx.memberships.find((m) => m.role === "driver" || m.role === "org_owner" || m.role === "org_staff");
  if (!member) redirect("/onboarding");
  return <div className="min-h-screen bg-black text-white max-w-md mx-auto">{children}</div>;
}