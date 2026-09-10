import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Banknote,
    Check,
    CreditCard,
    Trash2,
    WalletCards,
} from 'lucide-react';

const money = (value) => `${Number(value || 0).toFixed(2)} SAR`;

export default function Edit({
    date,
    record = null,
    summary = {},
}) {
    const form = useForm({
        record_date: date,
        physical_cash: Number(summary.physicalCash || 0),
        physical_shabaka: Number(summary.physicalShabaka || 0),
        physical_others: Number(summary.physicalOthers || 0),
        notes: summary.notes || '',
    });

    const cash = Number(form.data.physical_cash || 0);
    const shabaka = Number(form.data.physical_shabaka || 0);
    const others = Number(form.data.physical_others || 0);

    const totalPhysical = cash + shabaka + others;
    const totalSales = Number(summary.totalSales || 0);
    const expenses = Number(summary.expenses || 0);

    const displayDate = new Date(
        `${date}T00:00:00`
    ).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const submit = (e) => {
        e.preventDefault();

        if (!record?.id) return;

        form.put(
            route('daily-cash-records.update', record.id),
            {
                preserveScroll: false,
            }
        );
    };

    const cancel = () => {
        router.get(
            route('daily-cash-records.index'),
            { date },
            {
                preserveState: false,
                preserveScroll: false,
            }
        );
    };

    const deleteRecord = () => {
        if (!record?.id) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete the daily cash record for ${displayDate}?\n\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        router.delete(
            route('daily-cash-records.destroy', record.id),
            {
                preserveScroll: false,
            }
        );
    };

    return (
        <AppLayout title="Edit Daily Record">
            <Head title="Edit Daily Record | Pharmexa" />

            <div className="min-h-full bg-slate-50/60 pb-10">
                <div className="mx-auto max-w-3xl">

                    {/* BACK */}
                    <button
                        type="button"
                        onClick={cancel}
                        className="mb-4 inline-flex items-center gap-2 text-xs font-black text-slate-500 transition hover:text-teal-700"
                    >
                        <ArrowLeft size={15} />
                        Back to Daily Cash Register
                    </button>

                    {/* CARD */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* HEADER */}
                        <div className="bg-gradient-to-r from-teal-700 to-cyan-500 px-6 py-6 text-white">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                                    <WalletCards size={22} />
                                </div>

                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/70">
                                        Daily Operations
                                    </p>

                                    <h1 className="text-2xl font-black">
                                        Edit Daily Record
                                    </h1>

                                    <p className="mt-1 text-xs font-medium text-white/80">
                                        {displayDate}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit}>
                            <div className="p-6">

                                {/* DATE */}
                                <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center justify-between gap-4">

                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                                                Register Date
                                            </p>

                                            <p className="mt-1 text-sm font-black text-slate-900">
                                                {displayDate}
                                            </p>
                                        </div>

                                        <input
                                            type="date"
                                            value={form.data.record_date}
                                            onChange={(e) =>
                                                form.setData(
                                                    'record_date',
                                                    e.target.value
                                                )
                                            }
                                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-teal-500"
                                        />
                                    </div>
                                </div>

                                {/* SALES */}
                                <div className="mb-6 rounded-xl border border-teal-100 bg-teal-50/60 p-4">
                                    <div className="flex items-center justify-between gap-4">

                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-teal-600">
                                                Today's Total Sales
                                            </p>

                                            <p className="mt-1 text-2xl font-black text-slate-900">
                                                {money(totalSales)}
                                            </p>

                                            <p className="mt-1 text-[10px] text-slate-500">
                                                Cash {money(summary.cashSales)}
                                                {' • '}
                                                Shabaka {money(summary.shabakaSales)}
                                                {' • '}
                                                Other {money(summary.otherSales)}
                                            </p>
                                        </div>

                                        <div className="hidden rounded-xl bg-white px-4 py-3 text-right shadow-sm sm:block">
                                            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                                Expenses
                                            </p>

                                            <p className="mt-1 text-sm font-black text-red-600">
                                                {money(expenses)}
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                {/* ERROR */}
                                {Object.keys(form.errors).length > 0 && (
                                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
                                        Please enter all three physical payment amounts correctly.
                                    </div>
                                )}

                                {/* PHYSICAL COUNT */}
                                <div className="mb-5">
                                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                                        Physical Count
                                    </p>

                                    <h2 className="mt-1 text-lg font-black text-slate-900">
                                        Update today's payments
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Change only the amounts you physically counted.
                                    </p>
                                </div>

                                <div className="space-y-4">

                                    {/* CASH */}
                                    <label className="block">
                                        <span className="flex items-center gap-2 text-xs font-black text-slate-700">
                                            <Banknote
                                                size={15}
                                                className="text-emerald-600"
                                            />
                                            Physical Cash
                                        </span>

                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                inputMode="decimal"
                                                autoFocus
                                                value={form.data.physical_cash}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'physical_cash',
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 pr-16 text-lg font-black text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                                            />

                                            <span className="absolute right-4 top-6 text-xs font-black text-slate-400">
                                                SAR
                                            </span>
                                        </div>

                                        {form.errors.physical_cash && (
                                            <p className="mt-1 text-xs font-bold text-red-600">
                                                {form.errors.physical_cash}
                                            </p>
                                        )}
                                    </label>

                                    {/* SHABAKA */}
                                    <label className="block">
                                        <span className="flex items-center gap-2 text-xs font-black text-slate-700">
                                            <CreditCard
                                                size={15}
                                                className="text-blue-600"
                                            />
                                            Physical Shabaka / Mada
                                        </span>

                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                inputMode="decimal"
                                                value={form.data.physical_shabaka}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'physical_shabaka',
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 pr-16 text-lg font-black text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                                            />

                                            <span className="absolute right-4 top-6 text-xs font-black text-slate-400">
                                                SAR
                                            </span>
                                        </div>

                                        {form.errors.physical_shabaka && (
                                            <p className="mt-1 text-xs font-bold text-red-600">
                                                {form.errors.physical_shabaka}
                                            </p>
                                        )}
                                    </label>

                                    {/* OTHER */}
                                    <label className="block">
                                        <span className="flex items-center gap-2 text-xs font-black text-slate-700">
                                            <WalletCards
                                                size={15}
                                                className="text-violet-600"
                                            />
                                            Other Payments
                                        </span>

                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                inputMode="decimal"
                                                value={form.data.physical_others}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'physical_others',
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 pr-16 text-lg font-black text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                                            />

                                            <span className="absolute right-4 top-6 text-xs font-black text-slate-400">
                                                SAR
                                            </span>
                                        </div>

                                        {form.errors.physical_others && (
                                            <p className="mt-1 text-xs font-bold text-red-600">
                                                {form.errors.physical_others}
                                            </p>
                                        )}
                                    </label>
                                </div>

                                {/* NOTES */}
                                <div className="mt-6">
                                    <label className="block">
                                        <span className="text-xs font-black text-slate-700">
                                            Notes
                                        </span>

                                        <textarea
                                            rows={4}
                                            value={form.data.notes}
                                            onChange={(e) =>
                                                form.setData(
                                                    'notes',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Add any notes about today's cash register..."
                                            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                                        />

                                        {form.errors.notes && (
                                            <p className="mt-1 text-xs font-bold text-red-600">
                                                {form.errors.notes}
                                            </p>
                                        )}
                                    </label>
                                </div>

                                {/* TOTAL */}
                                <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                            Total Physical Payments
                                        </p>

                                        <p className="mt-1 text-lg font-black text-slate-900">
                                            {money(totalPhysical)}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                            Today Total Sales
                                        </p>

                                        <p className="mt-1 text-lg font-black text-teal-700">
                                            {money(totalSales)}
                                        </p>
                                    </div>
                                </div>

                                {/* BUTTONS */}
                                <div className="mt-6 flex flex-col gap-3">

                                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={cancel}
                                            disabled={form.processing}
                                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-black text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={form.processing || !record?.id}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-xs font-black text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Check size={16} />
                                            {form.processing
                                                ? 'Saving...'
                                                : 'Update Daily Record'}
                                        </button>
                                    </div>

                                    {/* DELETE */}
                                    {record?.id && (
                                        <div className="mt-2 flex justify-end border-t border-slate-100 pt-4">
                                            <button
                                                type="button"
                                                onClick={deleteRecord}
                                                disabled={form.processing}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-xs font-black text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <Trash2 size={15} />
                                                Delete Daily Record
                                            </button>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}