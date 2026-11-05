
"use client";

import {
  type MembershipPlan,
  type MembershipPlanPayload,
} from "@/types/membership";

import {
  createMembershipPlan,
  getMembershipPlans,
  gerMembershipErrorMessage,
} from "@/services/membership.services";
import { useState } from "react";
import { useEffect } from "react";
import { purchaseMembership } from "@/services/membership.services";
import { useCallback } from "react";
import { getPublicMembershipPlans } from "@/services/membership.services";
import { useRouter } from "next/navigation";

export default function MembershipsPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
const [purchasingId, setPurchasingId] = useState<string | null>(null);

const handlePurchase = async (plan: MembershipPlan) => {
  const confirmed = window.confirm(
    `Apakah kamu yakin ingin membeli paket ${plan.name}?`
  );

  if (!confirmed) return;

  try {
    setPurchasingId(plan.id);

    const result = await purchaseMembership(plan.id);

    // Simpan seluruh detail pembelian
    sessionStorage.setItem(
      "pendingMembershipPurchase",
      JSON.stringify(result)
    );

    // Simpan ID untuk kebutuhan submit bukti pembayaran nanti
    sessionStorage.setItem(
      "pendingMembershipId",
      result.membership.id
    );

    sessionStorage.setItem(
      "pendingMembershipTransactionId",
      result.transaction.id
    );

    router.push("/membership-payment");
  } catch (err) {
    alert(
      gerMembershipErrorMessage(
        err,
        "Gagal membeli membership."
      )
    );
  } finally {
    setPurchasingId(null);
  }
};

  const loadPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const result = await getPublicMembershipPlans();
      setPlans(result);
    } catch (err) {
      setError(
        gerMembershipErrorMessage(
          err,
          "Gagal mengambil daftar membership."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
        <button
            onClick={() => router.push("/")}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition"
            >
            ← Back to Dashboard
        </button>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            CourtKita Membership
          </p>

          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Pilih Membership Kamu
          </h1>

          <p className="mt-3 text-gray-600">
            Nikmati pengalaman olahraga dengan paket membership
            yang sesuai kebutuhanmu.
          </p>
        </div>

        {isLoading && (
          <div className="py-16 text-center text-gray-500">
            Memuat paket membership...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
            <p className="text-red-600">{error}</p>

            <button
              onClick={loadPlans}
              className="mt-4 rounded-lg bg-primary px-5 py-2 text-white"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!isLoading && !error && plans.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Belum Ada Membership
            </h2>

            <p className="mt-2 text-gray-500">
              Saat ini belum ada paket membership yang tersedia.
            </p>
          </div>
        )}

        {!isLoading && !error && plans.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {plan.name}
                  </h2>

                  <p className="mt-2 min-h-12 text-sm text-gray-500">
                    {plan.description || "Membership untuk aktivitas olahraga kamu."}
                  </p>
                </div>

                <div className="my-6">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(plan.price)}
                  </p>
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-5 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Jumlah sesi</span>
                    <span className="font-semibold text-gray-900">
                      {plan.sessionCount} sesi
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Masa berlaku</span>
                    <span className="font-semibold text-gray-900">
                      {plan.durationDays} hari
                    </span>
                  </div>
                </div>

                <button
                onClick={() => handlePurchase(plan)}
                disabled={purchasingId !== null}
                className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                {purchasingId === plan.id
                    ? "Memproses..."
                    : "Pilih Paket"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
