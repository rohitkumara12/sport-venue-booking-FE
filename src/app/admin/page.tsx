
"use client";

import { GetProfile } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Search,
  Settings2,
  Users,
  X,
} from "lucide-react";

type UserProfile = {
  email: string;
  role: "USER" | "ADMIN";
};

type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

type Booking = {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string;
  time: string;
  amount: string;
  status: BookingStatus;
};

const bookings: Booking[] = [
  {
    id: "BK-1042",
    customer: "Andi Pratama",
    email: "andi@example.com",
    venue: "Badminton Court A",
    date: "27 Oct 2026",
    time: "09:00–10:00",
    amount: "Rp 120.000",
    status: "Confirmed",
  },
  {
    id: "BK-1043",
    customer: "Budi Santoso",
    email: "budi@example.com",
    venue: "Futsal Court 1",
    date: "27 Oct 2026",
    time: "10:00–11:00",
    amount: "Rp 250.000",
    status: "Pending",
  },
  {
    id: "BK-1044",
    customer: "Citra Amelia",
    email: "citra@example.com",
    venue: "Badminton Court B",
    date: "27 Oct 2026",
    time: "13:00–14:00",
    amount: "Rp 120.000",
    status: "Confirmed",
  },
  {
    id: "BK-1045",
    customer: "Dimas Saputra",
    email: "dimas@example.com",
    venue: "Basketball Court",
    date: "28 Oct 2026",
    time: "15:00–16:00",
    amount: "Rp 200.000",
    status: "Cancelled",
  },
  {
    id: "BK-1046",
    customer: "Nadia Putri",
    email: "nadia@example.com",
    venue: "Futsal Court 1",
    date: "28 Oct 2026",
    time: "16:00–17:00",
    amount: "Rp 250.000",
    status: "Pending",
  },
];

const venues = [
  { name: "Badminton Court A", type: "Badminton", status: "Available" },
  { name: "Badminton Court B", type: "Badminton", status: "Available" },
  { name: "Futsal Court 1", type: "Futsal", status: "Occupied" },
  { name: "Basketball Court", type: "Basketball", status: "Available" },
];

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [activeTab, setActiveTab] = useState<"Bookings" | "Venues">(
    "Bookings"
  );

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      try {
        const result = await GetProfile();

        if (!active) return;

        if (result.data.role !== "ADMIN") {
          router.replace("/dashboard");
          return;
        }

        setUser(result.data);
      } catch {
        if (active) router.replace("/login");
      } finally {
        if (active) setLoading(false);
      }
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, [router]);

  const filteredBookings = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return bookings.filter((booking) => {
      const matchesSearch =
        booking.id.toLowerCase().includes(keyword) ||
        booking.customer.toLowerCase().includes(keyword) ||
        booking.venue.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All statuses" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f5]">
        <p className="text-sm text-stone-500">
          Memeriksa akses admin...
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f5] text-[#262d27]">
      {sidebarOpen && (
        <button
          aria-label="Tutup navigasi"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-[#e8e9e2] bg-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center gap-3 border-b border-[#e8e9e2] px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#245c43] text-sm font-bold text-white">
            C.
          </div>
          <div>
            <p className="text-[17px] font-bold tracking-tight">
              courtkita
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-stone-400">
              Venue operations
            </p>
          </div>
          <button
            className="ml-auto rounded-md p-1 text-stone-500 hover:bg-stone-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-400">
            Workspace
          </p>

          <nav className="space-y-1">
            <button
              onClick={() => {
                setActiveTab("Bookings");
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm ${
                activeTab === "Bookings"
                  ? "bg-[#edf3ed] font-semibold text-[#245c43]"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              <LayoutDashboard size={17} strokeWidth={1.8} />
              Overview
            </button>

            <button
              onClick={() => {
                setActiveTab("Bookings");
                setSidebarOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50"
            >
              <CalendarDays size={17} strokeWidth={1.8} />
              Bookings
            </button>

            <button
              onClick={() => {
                setActiveTab("Venues");
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm ${
                activeTab === "Venues"
                  ? "bg-[#edf3ed] font-semibold text-[#245c43]"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              <MapPin size={17} strokeWidth={1.8} />
              Venues
            </button>

            <button
              onClick={() => router.push("/admin/memberships")}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50"
            >
              <Users size={17} strokeWidth={1.8} />
              Members
            </button>
          </nav>

          <p className="mb-3 mt-9 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-400">
            Preferences
          </p>

          <button
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50"
            onClick={() => router.push("/admin/settings")}
          >
            <Settings2 size={17} strokeWidth={1.8} />
            Settings
          </button>
        </div>

        <div className="mt-auto border-t border-[#e8e9e2] p-4">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf3ed] text-sm font-semibold text-[#245c43]">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{user.email}</p>
              <p className="mt-1 text-[11px] text-stone-400">
                Administrator
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/login")}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-stone-500 hover:bg-stone-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="min-h-screen lg:pl-[248px]">
        <header className="flex h-[76px] items-center justify-between border-b border-[#e8e9e2] bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Buka navigasi"
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-2 hover:bg-stone-100 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-sm font-semibold">Operations</p>
              <p className="mt-0.5 hidden text-xs text-stone-400 sm:block">
                Manage your sports facility
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-[#e8e9e2] px-3 py-1.5 text-[11px] text-stone-500 sm:inline-flex">
              <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-[#4b8a62]" />
              Admin workspace
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#245c43] text-xs font-semibold text-white">
              {user.email.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] space-y-8 px-5 py-8 sm:px-8 sm:py-10">
          {/* Page heading */}
          <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#52765c]">
                Tuesday / Operations
              </p>
              <h1 className="text-[30px] font-semibold tracking-[-0.045em] text-[#252d26] sm:text-[36px]">
                {activeTab === "Bookings" ? "Bookings" : "Venue directory"}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500">
                {activeTab === "Bookings"
                  ? "A clear view of reservations, schedules and booking status."
                  : "Review the courts and facilities available in your venue."}
              </p>
            </div>

            <button
              onClick={() => setActiveTab("Venues")}
              className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-md bg-[#245c43] px-4 text-sm font-medium text-white transition hover:bg-[#194832] sm:self-auto"
            >
              <MapPin size={15} />
              Manage venues
            </button>
          </section>

          {/* Compact overview */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="border-l-2 border-[#245c43] bg-white px-5 py-4">
              <p className="text-xs text-stone-500">Bookings today</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-[28px] font-semibold tracking-tight">12</p>
                <span className="text-[11px] text-[#52765c]">8 confirmed</span>
              </div>
            </div>
            <div className="border-l-2 border-[#d8ded4] bg-white px-5 py-4">
              <p className="text-xs text-stone-500">Active venues</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-[28px] font-semibold tracking-tight">04</p>
                <span className="text-[11px] text-stone-400">2 court types</span>
              </div>
            </div>
            <div className="border-l-2 border-[#d8ded4] bg-white px-5 py-4">
              <p className="text-xs text-stone-500">Pending review</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-[28px] font-semibold tracking-tight">
                  {bookings.filter((b) => b.status === "Pending").length.toString().padStart(2, "0")}
                </p>
                <span className="text-[11px] text-amber-700">
                  Requires attention
                </span>
              </div>
            </div>
          </section>

          {/* Main data area */}
          <section className="border border-[#e6e7df] bg-white">
            <div className="flex flex-col justify-between gap-4 border-b border-[#e8e9e2] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
              <div>
                <h2 className="text-base font-semibold tracking-tight">
                  {activeTab === "Bookings" ? "All bookings" : "Venue directory"}
                </h2>
                <p className="mt-1 text-xs text-stone-500">
                  {activeTab === "Bookings"
                    ? `${filteredBookings.length} reservations shown`
                    : `${venues.length} venues in this example`}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {activeTab === "Bookings" && (
                  <>
                    <div className="flex h-9 items-center gap-2 border border-[#e6e7df] px-3 sm:w-[220px]">
                      <Search size={15} className="shrink-0 text-stone-400" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search bookings..."
                        className="w-full bg-transparent text-xs outline-none placeholder:text-stone-400"
                      />
                    </div>

                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-9 w-full appearance-none border border-[#e6e7df] bg-white pl-3 pr-8 text-xs text-stone-600 outline-none focus:border-[#245c43] sm:w-auto"
                      >
                        <option>All statuses</option>
                        <option>Confirmed</option>
                        <option>Pending</option>
                        <option>Cancelled</option>
                      </select>
                      <ChevronDown
                        size={13}
                        className="pointer-events-none absolute right-2.5 top-3 text-stone-400"
                      />
                    </div>
                  </>
                )}

                {activeTab === "Venues" && (
                  <button
                    onClick={() =>
                      window.alert("Form tambah venue akan dibuat pada tahap berikutnya.")
                    }
                    className="inline-flex h-9 items-center justify-center gap-2 bg-[#245c43] px-3 text-xs font-medium text-white hover:bg-[#194832]"
                  >
                    + Add venue
                  </button>
                )}
              </div>
            </div>

            {activeTab === "Bookings" ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left">
                  <thead>
                    <tr className="border-b border-[#e8e9e2] bg-[#fbfbf8]">
                      {[
                        "Booking",
                        "Customer",
                        "Venue",
                        "Schedule",
                        "Amount",
                        "Status",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-400 sm:px-6"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#efefe9]">
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="transition-colors hover:bg-[#fbfbf8]"
                      >
                        <td className="px-5 py-4 sm:px-6">
                          <p className="text-xs font-semibold text-[#303a31]">
                            {booking.id}
                          </p>
                          <p className="mt-1 text-[10px] text-stone-400">
                            {booking.date}
                          </p>
                        </td>
                        <td className="px-5 py-4 sm:px-6">
                          <p className="text-xs font-medium">
                            {booking.customer}
                          </p>
                          <p className="mt-1 text-[10px] text-stone-400">
                            {booking.email}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-xs text-stone-600 sm:px-6">
                          {booking.venue}
                        </td>
                        <td className="px-5 py-4 sm:px-6">
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-stone-600">
                            <Clock3 size={13} className="text-stone-400" />
                            {booking.time}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs font-medium sm:px-6">
                          {booking.amount}
                        </td>
                        <td className="px-5 py-4 sm:px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 whitespace-nowrap text-[10px] font-medium ${
                              booking.status === "Confirmed"
                                ? "text-[#39744c]"
                                : booking.status === "Pending"
                                  ? "text-[#9b722b]"
                                  : "text-stone-400"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                booking.status === "Confirmed"
                                  ? "bg-[#4b8a62]"
                                  : booking.status === "Pending"
                                    ? "bg-[#c99b45]"
                                    : "bg-stone-300"
                              }`}
                            />
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filteredBookings.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-sm text-stone-400"
                        >
                          No bookings match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="divide-y divide-[#efefe9]">
                {venues.map((venue, index) => (
                  <div
                    key={venue.name}
                    className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center bg-[#edf3ed] text-[#245c43]">
                        <MapPin size={17} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{venue.name}</p>
                        <p className="mt-1 text-xs text-stone-400">
                          {venue.type} · Venue {String(index + 1).padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs ${
                        venue.status === "Available"
                          ? "text-[#39744c]"
                          : "text-amber-700"
                      }`}
                    >
                      <span className="mr-2">●</span>
                      {venue.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2 border-t border-[#e8e9e2] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-[11px] text-stone-400">
                Demo data · Not connected to the database
              </p>
              <p className="text-[11px] text-stone-400">
                Signed in as {user.role}
              </p>
            </div>
          </section>

          <footer className="flex flex-col justify-between gap-2 pb-2 text-[10px] text-stone-400 sm:flex-row">
            <p>CourtKita · Venue operations</p>
            <p>Admin workspace</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
