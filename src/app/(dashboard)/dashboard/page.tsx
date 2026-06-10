import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import {
  CarFront,
  Users,
  Package,
  Route,
  Clock,
  CheckCircle2,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Total Vehicles",
    value: "0",
    icon: CarFront,
    color: "bg-blue-50 text-blue-600",
    href: "/dashboard/fleet",
  },
  {
    label: "Active Drivers",
    value: "0",
    icon: Users,
    color: "bg-green-50 text-green-600",
    href: "/dashboard/drivers",
  },
  {
    label: "Open Bookings",
    value: "0",
    icon: Package,
    color: "bg-orange-50 text-orange-600",
    href: "/dashboard/bookings",
  },
  {
    label: "Trips This Month",
    value: "0",
    icon: Route,
    color: "bg-purple-50 text-purple-600",
    href: "/dashboard/trips",
  },
  {
    label: "Revenue (MTD)",
    value: "$0",
    icon: DollarSign,
    color: "bg-emerald-50 text-emerald-600",
    href: "/dashboard/payments",
  },
];

const quickActions = [
  { label: "Add Vehicle", href: "/dashboard/fleet/new", icon: CarFront },
  { label: "Add Driver", href: "/dashboard/drivers/new", icon: Users },
  { label: "New Booking", href: "/dashboard/bookings/new", icon: Package },
  { label: "Post Load", href: "/dashboard/load-board/new", icon: Route },
];

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  const greeting = getGreeting();

  return (
    <>
      <Header
        title={`${greeting}, ${user.name.split(" ")[0]}`}
        subtitle="Here is what is happening with your fleet today."
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted mt-0.5">{stat.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-center group"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <action.icon className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">
                Recent Activity
              </h2>
              <Link
                href="/dashboard/notifications"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-muted" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">
                No activity yet
              </h3>
              <p className="text-sm text-muted max-w-xs">
                Start by adding vehicles and drivers to your fleet. Activity will appear here as you use TransitFlow.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Getting Started
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: 1,
                title: "Add your vehicles",
                description: "Register trucks, vans, and other vehicles in your fleet.",
                href: "/dashboard/fleet/new",
                done: false,
              },
              {
                step: 2,
                title: "Invite drivers",
                description: "Add drivers and assign them to vehicles.",
                href: "/dashboard/drivers/new",
                done: false,
              },
              {
                step: 3,
                title: "Create first booking",
                description: "Set up your first shipment booking.",
                href: "/dashboard/bookings/new",
                done: false,
              },
              {
                step: 4,
                title: "Configure payments",
                description: "Set up payment methods and invoicing.",
                href: "/dashboard/settings",
                done: false,
              },
            ].map((item) => (
              <Link
                key={item.step}
                href={item.href}
                className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <div className="shrink-0">
                  {item.done ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center text-xs font-bold text-muted">
                      {item.step}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {item.title}
                  </div>
                  <div className="text-xs text-muted mt-0.5">
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}