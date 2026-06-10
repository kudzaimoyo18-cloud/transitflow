import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar userName={user.name} />
      <main className="flex-1 flex flex-col min-w-0">{children}</main>
    </div>
  );
}
