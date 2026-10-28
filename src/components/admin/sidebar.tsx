
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPinned,
  Users,
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Venues", href: "/admin/venues", icon: MapPinned },
  { label: "Memberships", href: "/admin/memberships", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-gray-200 bg-white px-4 py-6">
      <Link href="/admin" className="mb-10 px-3 text-2xl font-bold text-blue-600">
        CourtKita
      </Link>

      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
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
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 pt-4">
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
