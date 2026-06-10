import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/session";
import { createAnnouncement } from "../../actions";
import { Megaphone } from "lucide-react";

export default async function AnnouncementsPage() {
  const ctx = await requireContext();
  const org = ctx.memberships.find((m) => m.role === "org_owner" || m.role === "org_staff")!.organizations;
  const supabase = await createClient();
  const { data: items } = await supabase.from("announcements").select("id, title, body, created_at").eq("org_id", org.id).order("created_at", { ascending: false }).limit(50);

  return (
    <>
      <header className="px-6 py-4 border-b border-border bg-white"><h1 className="text-xl font-bold">Announcements</h1><p className="text-sm text-muted">Posts notify every rider instantly.</p></header>
      <div className="p-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {(items ?? []).length === 0 && <p className="text-muted text-sm">No announcements yet.</p>}
          {(items ?? []).map((a)=>(
            <div key={a.id} className="rounded-xl border border-border bg-white p-4">
              <p className="font-semibold flex items-center gap-2"><Megaphone className="w-4 h-4 text-primary" />{a.title}</p>
              <p className="text-sm text-muted mt-1 whitespace-pre-wrap">{a.body}</p>
              <p className="text-xs text-muted mt-2">{new Date(a.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <form action={createAnnouncement} className="rounded-xl border border-border bg-white p-4 space-y-3 h-fit">
          <h2 className="font-semibold">New announcement</h2>
          <input type="hidden" name="org_id" value={org.id} />
          <input name="title" required placeholder="Title (e.g. New route added)" className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
          <textarea name="body" rows={4} placeholder="Message to all riders" className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
          <button className="w-full py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-medium">Post &amp; notify riders</button>
        </form>
      </div>
    </>
  );
}
