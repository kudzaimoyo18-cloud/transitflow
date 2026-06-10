import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { JoinByCode } from "./JoinByCode";

export default async function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const ctx = await getSessionContext();
  const supabase = await createClient();
  const { data: org } = await supabase.from("organizations").select("name").eq("invite_code", code.toLowerCase()).maybeSingle();

  if (!ctx) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 text-center space-y-4">
          <h1 className="text-xl font-bold">Join {org?.name ?? "your transport company"}</h1>
          <p className="text-muted text-sm">Create a rider account to continue.</p>
          <Link href={"/signup?code=" + code} className="block w-full py-2.5 rounded-lg bg-primary text-white font-medium">Sign up</Link>
          <Link href={"/login"} className="block text-sm text-primary">I already have an account</Link>
        </div>
      </div>
    );
  }

  if (ctx.memberships.some((m) => m.role === "rider")) redirect("/rider");

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 text-center space-y-4">
        <h1 className="text-xl font-bold">Join {org?.name ?? "company"}</h1>
        <JoinByCode code={code} />
      </div>
    </div>
  );
}
