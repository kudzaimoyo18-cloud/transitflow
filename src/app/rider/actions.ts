"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createSubscription(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("not authenticated");
  const route_id = String(formData.get("route_id"));

  const { data: route } = await supabase.from("routes").select("org_id, monthly_price").eq("id", route_id).single();
  if (!route) throw new Error("route not found");

  const { error } = await supabase.from("rider_subscriptions").insert({
    org_id: route.org_id,
    rider_id: user.id,
    route_id,
    pickup_stop_id: formData.get("pickup_stop_id") ? String(formData.get("pickup_stop_id")) : null,
    home_address: String(formData.get("home_address") || "") || null,
    home_lat: formData.get("home_lat") ? Number(formData.get("home_lat")) : null,
    home_lng: formData.get("home_lng") ? Number(formData.get("home_lng")) : null,
    monthly_price: route.monthly_price,
    status: "due",
    next_due_date: new Date().toISOString().slice(0, 10),
  });
  if (error) throw new Error(error.message);
  redirect("/rider");
}

export async function reportPayment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("not authenticated");
  const start = new Date();
  const end = new Date(start); end.setMonth(end.getMonth() + 1); end.setDate(end.getDate() - 1);
  const { error } = await supabase.from("payments").insert({
    org_id: String(formData.get("org_id")),
    subscription_id: String(formData.get("subscription_id")),
    rider_id: user.id,
    amount: Number(formData.get("amount")),
    currency: String(formData.get("currency") || "AED"),
    method: String(formData.get("method") || "other"),
    status: "pending_confirmation",
    period_start: start.toISOString().slice(0, 10),
    period_end: end.toISOString().slice(0, 10),
    reference: String(formData.get("reference") || "") || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/rider/pay");
  redirect("/rider/pay?reported=1");
}

export async function joinWithCode(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("join_org_with_code", {
    code: String(formData.get("code")).trim().toLowerCase(),
    join_role: "rider",
  });
  if (error) throw new Error(error.message);
  redirect("/rider/subscribe");
}
