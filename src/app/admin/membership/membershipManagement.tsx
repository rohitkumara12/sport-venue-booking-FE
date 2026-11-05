
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, RefreshCw, Users, X } from "lucide-react";

import { formatRupiah } from "@/lib/format";
import { getMembershipPlans,gerMembershipErrorMessage } from "@/services/membership.services";
import {  type MembershipPlan, type MembershipPlanPayload } from "@/types/membership";
import { createMembershipPlan } from "@/services/membership.services";

const initialForm: MembershipPlanPayload = {
    name: "",
    description:"",
    price : 0,
    sessionCount: 1,
    durationDays: 30,
}
export default function MembershipManagement() {
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<MembershipPlanPayload>(initialForm);
    const [filter, setFilter] = useState<"ACTIVE" | "INACTIVE"> ("ACTIVE");


    const loadPlans = useCallback(async () => {
        setLoading(true);

        try {
            const result = await getMembershipPlans();
            setPlans(result);
        } catch (err) {
            toast.error(
                gerMembershipErrorMessage(err, "Membership gagal dimuat")
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPlans();
    }, [loadPlans]);

    function updateField<K extends keyof MembershipPlanPayload> (
        field : K,
        value: MembershipPlanPayload[K]
    ) {
        setForm((current) => ({
            ...current,
            [field] : value,
        }));
    }

    async function handleCreate(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        if (
            !form.name.trim() || 
            form.price <= 0 ||
            form.sessionCount < 1 ||
            form.durationDays < 1
        ) {
            toast.error("Periksa kembali data membership.");
            return 
        }
          setSaving(true);
          try {
            await createMembershipPlan ({
                ...form,
                name : form.name.trim(),
                description : form.description?.trim() || undefined,
            });

            toast.success("Membership berhasil ditambahkan.");
            setForm(initialForm);
            setShowForm(false);
            await loadPlans();
          } catch(err) {
            toast.error (
                gerMembershipErrorMessage(err,"Membership gagal ditambahkan")
            );
        } finally {
            setSaving(false)
          }
    }
    const filteredPlans = plans.filter((plan) =>
    filter === "ACTIVE" ? plan.isActive : !plan.isActive
);
return (
        <section>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="font-display text-xl font-bold text-foreground">
                        Membership Plans
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                        Kelola paket membership venue.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={loadPlans}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold hover:bg-surface disabled:opacity-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
                    >
                        <Plus size={16} />
                        Tambah Paket
                    </button>
                </div>
            </div>
            <div className="mb-5 flex gap-2">
                <button type="button"
                onClick={()=> setFilter("ACTIVE")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    filter === "ACTIVE" ? "bg-primary text-white"
                    : "border border-line bg-white text-foreground"
                }`}
                >
                    Aktif 
                </button>

                        <button
                type="button"
                onClick={() => setFilter("INACTIVE")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    filter === "INACTIVE"
                        ? "bg-primary text-white"
                        : "border border-line bg-white text-foreground"
                }`}
            >
                Nonaktif
            </button>
            </div>

            {showForm && (
                <form
                    onSubmit={handleCreate}
                    className="mb-8 space-y-4 rounded-2xl border border-line bg-surface p-5"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-bold">
                            Tambah Membership
                        </h3>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            disabled={saving}
                            aria-label="Tutup form"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold">
                            Nama Paket
                        </label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            placeholder="Contoh: Membership Gold"
                            className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold">
                            Deskripsi
                        </label>
                        <textarea
                            value={form.description ?? ""}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="Deskripsi paket membership"
                            rows={3}
                            className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-primary"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-sm font-semibold">
                                Harga (Rp)
                            </label>
                            <input
                                required
                                type="number"
                                min="1"
                                value={form.price || ""}
                                onChange={(e) => updateField("price", Number(e.target.value))}
                                placeholder="600000"
                                className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold">
                                Jumlah Sesi
                            </label>
                            <input
                                required
                                type="number"
                                min="1"
                                step="1"
                                value={form.sessionCount}
                                onChange={(e) => updateField("sessionCount", Number(e.target.value))}
                                className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold">
                                Masa Berlaku (Hari)
                            </label>
                            <input
                                required
                                type="number"
                                min="1"
                                step="1"
                                value={form.durationDays}
                                onChange={(e) => updateField("durationDays", Number(e.target.value))}
                                className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            disabled={saving}
                            className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {saving && <Loader2 size={16} className="animate-spin" />}
                            Simpan Paket
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-48 animate-pulse rounded-2xl bg-line"
                        />
                    ))}
                </div>
            ) : filteredPlans.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
                    <Users size={36} className="mx-auto mb-3 text-muted" />
                    <p className="font-semibold text-foreground">
                        {filter === "ACTIVE"
                            ? "Belum ada membership aktif"
                            : "Belum ada membership nonaktif"}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                        Tambahkan paket membership pertama.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPlans.map((plan) => (
                        <article
                            key={plan.id}
                            className="rounded-2xl border border-line bg-surface p-5"
                        >
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <h3 className="font-display text-lg font-bold text-primary">
                                    {plan.name}
                                </h3>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                                        plan.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-500"
                                    }`}
                                >
                                    {plan.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <p className="min-h-10 text-sm text-muted">
                                {plan.description || "Tidak ada deskripsi"}
                            </p>

                            <p className="mt-4 text-2xl font-extrabold text-foreground">
                                {formatRupiah(Number(plan.price))}
                            </p>

                            <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm">
                                <span className="text-muted">Jumlah sesi</span>
                                <span className="font-semibold">
                                    {plan.sessionCount} sesi
                                </span>
                            </div>

                            <div className="mt-2 flex justify-between text-sm">
                                <span className="text-muted">Masa berlaku</span>
                                <span className="font-semibold">
                                    {plan.durationDays} hari
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
