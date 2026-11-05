"use client";

import { getAdminBookings } from "@/services/booking.service";
import { AdminBooking } from "@/types/booking"
import { useEffect, useState } from "react";

export default function AdminBookingsPage() {
    const [bookings,setBookings] = useState<AdminBooking[]>([]);
    const [isloading,setIsloading] = useState(true);
    const[error,setError] = useState("");

    useEffect(()=> {
        async function fetchBookings(){
            try {
                const data = await getAdminBookings();
                setBookings(data);
            } catch(err) {
                console.error("Failed to fetch admin Bookings :",err);
                setError("Gagal mengambil data booking.");
            } finally {
                setIsloading(false);
            }
        }
        fetchBookings()
    },[]);
    const formatDate = (date : string) => 
        new Date(date).toLocaleString("id-ID",{
            day : "2-digit",
            month: "short",
            year: "numeric",
        });
    const formatTime = (date : string) => 
        new Date(date).toLocaleString("id-ID",{
            hour: "2-digit",
            minute: "2-digit"
        });
    const formatPrice = (price : number) => 
        new Intl.NumberFormat("id-ID",{
            style: "currency",
            currency: "IDR",
            maximumFractionDigits : 0,
        }).format(price)

    const statusStyle: Record<string, string>= {
        PENDING : "bg-yellow-100 text-yellow-700",
        CONFIRMED: "bg-blue-100 text-blue-700",
        CANCELLED: "bg-red-100 text-red-700",
        COMPLETED: "bg-green-100 text-green-700",
        EXPIRED : "bg-gray-100 text-gray-700",
    };

    if (isloading) {
        return <p className="text-gray-500">Memuat data booking...</p>;
    }
    if (error) {
        return <p className="text-red-500">{error}</p>
    }

    return (
         <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Booking Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Kelola dan pantau seluruh booking customer.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-sm text-gray-500">Total Booking</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">
          {bookings.length}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Court</th>
              <th className="px-5 py-4">Schedule</th>
              <th className="px-5 py-4">Total Price</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  Belum ada data booking.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">
                      {booking.customer.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.customer.email}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">
                      {booking.court.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.court.sportType ?? "-"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p>{formatDate(booking.startTime)}</p>
                    <p className="text-xs text-gray-500">
                      {formatTime(booking.startTime)} -{" "}
                      {formatTime(booking.endTime)}
                    </p>
                  </td>

                  <td className="px-5 py-4 font-medium text-gray-900">
                    {formatPrice(booking.totalPrice)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        statusStyle[booking.status] ??
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    )
}