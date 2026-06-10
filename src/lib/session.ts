import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Membership } from "@/lib/types";

// Resolve current user + profile + primary membership. Use in server components.
export async function getSessionContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: memberships } = await supabase
    .from("org_members")
    .select("org_id, role, organizations(*)")
    .order("created_at", { ascending: true });

  return {
    userId: user.id,
    email: user.email ?? "",
    profile: profile as Profile | null,
    memberships: (memberships ?? []) as unknown as Membership[],
  };
}

export async function requireContext() {
  const ctx = await getSessionContext();
  if (!ctx) redirect("/login");
  return ctx;
}
