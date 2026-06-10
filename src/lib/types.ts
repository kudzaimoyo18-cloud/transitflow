export type UserRole = "platform_admin" | "org_owner" | "org_staff" | "driver" | "rider";
export type SubStatus = "active" | "due" | "overdue" | "cancelled";
export type PaymentStatus = "pending_confirmation" | "confirmed" | "rejected";
export type PaymentMethod = "stripe_link" | "ziina_link" | "cash" | "bank_transfer" | "other";
export type TripStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type ExpenseCategory = "fuel" | "maintenance" | "salaries" | "insurance" | "fines" | "other";

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  status: "pending" | "active" | "suspended";
  country: string;
  city: string | null;
  currency: string;
  contact_phone: string | null;
  stripe_payment_link: string | null;
  ziina_payment_link: string | null;
  invite_code: string;
}

export interface Membership {
  org_id: string;
  role: UserRole;
  organizations: Organization;
}
