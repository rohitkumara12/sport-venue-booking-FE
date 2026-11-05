
import {
  CalendarDays,
  MapPinned,
  Users,
  Wallet,
  ArrowUpRight,
  Clock3,
} from "lucide-react";
import StatCard from "./statCard";

const stats = [
  {
    title: "Total Venues",
    value: "4",
    description: "Lapangan terdaftar",
    icon: MapPinned,
  },
  {
    title: "Bookings Today",
    value: "12",
    description: "Pemesanan hari ini",
    icon: CalendarDays,
  },
  {
    title: "Total Members",
    value: "128",
    description: "Member terdaftar",
    icon: Users,
  },
  {
    title: "Revenue",
    value: "Rp 2.450.000",
    description: "Data pendapatan dummy",
    icon: Wallet,
  },
];

const bookings = [
  {
    id: "BK-001",
    customer: "Andi Pratama",
    court: "Badminton Court A",
    time: "10:00–11:00",
    status: "Confirmed",
  },
  {
    id: "BK-002",
    customer: "Budi Santoso",
    court: "Futsal Court",
    time: "13:00–14:00",
    status: "Pending",
  },
  {
    id: "BK-003",
    customer: "Citra Amelia",
    court: "Badminton Court B",
    time: "15:00–16:00",
    status: "Confirmed",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      
      {/* Page Heading */}
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#123c2b]">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Pantau aktivitas dan performa venue CourtKita.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock3 size={16} />
          <span>Admin Dashboard</span>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </section>

      {/* Recent Bookings */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-[#123c2b]">
              Recent Bookings
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Ringkasan pemesanan terbaru.
            </p>
          </div>

          <ArrowUpRight className="text-[#123c2b]" size={20} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f7faf7] text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Booking ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Court</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="transition hover:bg-[#f7faf7]">
                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-[#123c2b]">
                    {booking.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                    {booking.customer}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                    {booking.court}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                    {booking.time}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        booking.status === "Confirmed"
                          ? "bg-[#c9f36a]/30 text-[#123c2b]"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
