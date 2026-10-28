
import {
  CalendarDays,
  MapPinned,
  Users,
  Wallet,
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
      <section>
        <h2 className="text-2xl font-bold text-gray-900">
          Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Berikut ringkasan aktivitas platform kamu.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Bookings
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Contoh daftar pemesanan lapangan.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
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
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                    {booking.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                    {booking.customer}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                    {booking.court}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                    {booking.time}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        booking.status === "Confirmed"
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
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
