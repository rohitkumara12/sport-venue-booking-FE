"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Clock3, MapPin, Search } from "lucide-react";
import { useAuth } from "@/context/auth.context";

type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

type Booking = {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string;
  time: string;
  amount: number;
  status: BookingStatus;
};

const bookings: Booking[] = [
  {
    id: "BK-1042",
    customer: "Andi Pratama",
    email: "andi@email.com",
    venue: "Badminton Court A",
    date: "27 Oct 2026",
    time: "09:00 - 10:00",
    amount: 100000,
    status: "Confirmed",
  },
  {
    id: "BK-1043",
    customer: "Budi Santoso",
    email: "budi@email.com",
    venue: "Futsal Court 1",
    date: "27 Oct 2026",
    time: "10:00 - 11:00",
    amount: 250000,
    status: "Pending",
  },
  {
    id: "BK-1044",
    customer: "Citra Lestari",
    email: "citra@email.com",
    venue: "Basketball Court",
    date: "27 Oct 2026",
    time: "13:00 - 14:00",
    amount: 200000,
    status: "Confirmed",
  },
  {
    id: "BK-1045",
    customer: "Dimas Saputra",
    email: "dimas@email.com",
    venue: "Badminton Court B",
    date: "28 Oct 2026",
    time: "15:00 - 16:00",
    amount: 100000,
    status: "Cancelled",
  },
  {
    id: "BK-1046",
    customer: "Eka Putri",
    email: "eka@email.com",
    venue: "Futsal Court 1",
    date: "28 Oct 2026",
    time: "16:00 - 17:00",
    amount: 250000,
    status: "Pending",
  },
];

const venues = [
  { name: "Badminton Court A", category: "Badminton", location: "Jakarta", status: "Active" },
  { name: "Badminton Court B", category: "Badminton", location: "Jakarta", status: "Active" },
  { name: "Futsal Court 1", category: "Futsal", location: "Jakarta", status: "Active" },
  { name: "Basketball Court", category: "Basketball", location: "Jakarta", status: "Active" },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [activeTab, setActiveTab] = useState<"Bookings" | "Venues">("Bookings");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch = [
        booking.id,
        booking.customer,
        booking.venue,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All statuses" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Overview / Operations
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Welcome back, {user?.name ?? "Admin"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor your venue activities and manage operations.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <Clock3 size={17} className="text-emerald-600" />
          <span>Operations Overview</span>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Bookings
          </p>
          <div className="mt-3 flex items-end justify-between">
            <h2 className="text-3xl font-bold text-slate-900">12</h2>
            <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Today
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Active Venues
          </p>
          <div className="mt-3 flex items-end justify-between">
            <h2 className="text-3xl font-bold text-slate-900">04</h2>
            <MapPin size={22} className="text-emerald-600" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Pending Review
          </p>
          <div className="mt-3 flex items-end justify-between">
            <h2 className="text-3xl font-bold text-slate-900">
              {pendingCount.toString().padStart(2, "0")}
            </h2>
            <span className="rounded-lg bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Requires attention
            </span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Manage Operations
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View and manage your bookings and venues.
            </p>
          </div>

          <div className="flex rounded-lg bg-slate-100 p-1">
            {(["Bookings", "Venues"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "Bookings" ? (
          <>
            {/* Search and filter */}
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search booking ID, customer, or venue..."
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-600 outline-none focus:border-emerald-500 sm:w-48"
                >
                  <option>All statuses</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* Booking table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Booking ID</th>
                    <th className="px-5 py-4 font-semibold">Customer</th>
                    <th className="px-5 py-4 font-semibold">Venue</th>
                    <th className="px-5 py-4 font-semibold">Schedule</th>
                    <th className="px-5 py-4 font-semibold">Amount</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4 font-semibold text-emerald-700">
                          {booking.id}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-900">
                            {booking.customer}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {booking.email}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {booking.venue}
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-slate-700">{booking.date}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {booking.time}
                          </p>
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-700">
                          {formatCurrency(booking.amount)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              booking.status === "Confirmed"
                                ? "bg-emerald-50 text-emerald-700"
                                : booking.status === "Pending"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-red-50 text-red-600"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* Venue list */
          <div className="divide-y divide-slate-100">
            {venues.map((venue) => (
              <div
                key={venue.name}
                className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {venue.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {venue.category} · {venue.location}
                    </p>
                  </div>
                </div>

                <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {venue.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-center text-xs text-slate-400">
        CourtKita Administration · Dashboard data is currently for display
        purposes.
      </p>
    </div>
  );
}