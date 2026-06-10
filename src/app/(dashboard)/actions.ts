"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function sb() {
  return await createClient();
}

export async function createRoute(formData: FormData) {
  const supabase = await sb();
  const days = (formData.getAll("days") as string[]).map(Number);
  const { data: route, error } = await supabase.from("routes").insert({
    org_id: String(formData.get("org_id")),
    name: String(formData.get("name")),
    origin: String(formData.get("origin")),
    destination: String(formData.get("destination")),
    departure_time: String(formData.get("departure_time") || "07:00"),
    monthly_price: Number(formData.get("monthly_price") || 0),
    days_of_week: days.length ? days : [0, 1, 2, 3, 4],
    bus_id: formData.get("bus_id") ? String(formData.get("bus_id")) : null,
  }).select("id").single();
  if (error) throw new Error(error.message);

  const stops = String(formData.get("stops") || "").split("\n").map((s) => s.trim()).filter(Boolean);
  if (stops.length && route) {
    await supabase.from("stops").insert(stops.map((name, i) => ({ route_id: route.id, name, position: i, eta_offset_minutes: i * 5 })));
  }
  revalidatePath("/dashboard/routes");
}

export async function deleteRoute(formData: FormData) {
  const supabase = await sb();
  await supabase.from("routes").delete().eq("id", String(formData.get("id")));
  revalidatePath("/dashboard/routes");
}

export async function createBus(formData: FormData) {
  const supabase = await sb();
  const { error } = await supabase.from("buses").insert({
    org_id: String(formData.get("org_id")),
    label: String(formData.get("label")),
    plate_number: String(formData.get("plate_number") || "") || null,
    capacity: formData.get("capacity") ? Number(formData.get("capacity")) : null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/fleet");
}

export async function deleteBus(formData: FormData) {
  const supabase = await sb();
  await supabase.from("buses").delete().eq("id", String(formData.get("id")));
  revalidatePath("/dashboard/fleet");
}

export async function confirmPayment(formData: FormData) {
  const supabase = await sb();
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from("payments").update({
    status: "confirmed", confirmed_by: user?.id, confirmed_at: new Date().toISOString(),
  }).eq("id", String(formData.get("id")));
  revalidatePath("/dashboard/riders");
}

export async function rejectPayment(formData: FormData) {
  const supabase = await sb();
  await supabase.from("payments").update({ status: "rejected" }).eq("id", String(formData.get("id")));
  revalidatePath("/dashboard/riders");
}

export async function recordCashPayment(formData: FormData) {
  const supabase = await sb();
  const { data: { user } } = await supabase.auth.getUser();
  const start = new Date();
  const end = new Date(start); end.setMonth(end.getMonth() + 1); end.setDate(end.getDate() - 1);
  const { error } = await supabase.from("payments").insert({
    org_id: String(formData.get("org_id")),
    subscription_id: String(formData.get("subscription_id")),
    rider_id: String(formData.get("rider_id")),
    amount: Number(formData.get("amount")),
    currency: String(formData.get("currency") || "AED"),
    method: String(formData.get("method") || "cash"),
    status: "confirmed",
    period_start: start.toISOString().slice(0, 10),
    period_end: end.toISOString().slice(0, 10),
    confirmed_by: user?.id,
    confirmed_at: new Date().toISOString(),
    note: "Recorded by company",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/riders");
}

export async function createExpense(formData: FormData) {
  const supabase = await sb();
  const { error } = await supabase.from("expenses").insert({
    org_id: String(formData.get("org_id")),
    bus_id: formData.get("bus_id") ? String(formData.get("bus_id")) : null,
    category: String(formData.get("category") || "other"),
    amount: Number(formData.get("amount")),
    currency: String(formData.get("currency") || "AED"),
    description: String(formData.get("description") || "") || null,
    expense_date: String(formData.get("expense_date")) || new Date().toISOString().slice(0, 10),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/expenses");
}

export async function createAnnouncement(formData: FormData) {
  const supabase = await sb();
  const { data: { user } } = await supabase.auth.getUser();
  const org_id = String(formData.get("org_id"));
  const title = String(formData.get("title"));
  const body = String(formData.get("body") || "");
  await supabase.from("announcements").insert({ org_id, title, body, created_by: user?.id });
  // fan out a notification to every rider in the org
  const { data: riders } = await supabase.from("org_members").select("user_id").eq("org_id", org_id).eq("role", "rider");
  if (riders?.length) {
    await supabase.from("notifications").insert(
      riders.map((r) => ({ user_id: r.user_id, org_id, title, body, type: "announcement" }))
    );
  }
  revalidatePath("/dashboard/announcements");
}

export async function updateOrgSettings(formData: FormData) {
  const supabase = await sb();
  await supabase.from("organizations").update({
    contact_phone: String(formData.get("contact_phone") || "") || null,
    stripe_payment_link: String(formData.get("stripe_payment_link") || "") || null,
    ziina_payment_link: String(formData.get("ziina_payment_link") || "") || null,
    city: String(formData.get("city") || "") || null,
  }).eq("id", String(formData.get("org_id")));
  revalidatePath("/dashboard/settings");
}
