
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPinned,
  Users,
  CalendarDays,
  Receipt,
  LogOut,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Venues", href: "/admin/venues", icon: MapPinned },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { label: "Memberships", href: "/admin/membership", icon: Users },
  { label: "Transactions", href: "/admin/transactions", icon: Receipt },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-[#123c2b] px-4 py-6 text-white">
      <Link
        href="/admin"
        className="mb-10 flex items-center gap-3 px-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9f36a] text-[#123c2b] font-bold">
          C
        </div>
        <div>
          <p className="text-xl font-bold">CourtKita</p>
          <p className="text-[10px] tracking-[0.2em] text-white/60">
            ADMINISTRATION
          </p>
        </div>
      </Link>

      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/50">
        Menu utama
      </p>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                active
                  ? "bg-[#c9f36a] text-[#123c2b]"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/15 pt-4">
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-200 transition hover:bg-white/10"
        >
          <LogOut size={20} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
