import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Banknote,
    CreditCard,
    WalletCards,
    Save,
} from 'lucide-react';

const money = (value) =>
    `${Number(value || 0).toFixed(2)} SAR`;

export default function Create({
    date,
    summary = {},
}) {
    const form = useForm({
        record_date: date || '',
        physical_cash: '',
        physical_shabaka: '',
        physical_others: '',
        notes: '',
    });

    const cash = Number(form.data.physical_cash || 0);
    const shabaka = Number(form.data.physical_shabaka || 0);
    const others = Number(form.data.physical_others || 0);

    const physicalTotal = cash + shabaka + others;

    const cashSales = Number(summary.cashSales || 0);
    const shabakaSales = Number(summary.shabakaSales || 0);
    const otherSales = Number(summary.otherSales || 0);

    const totalSales =
        Number(summary.totalSales || 0);

    const expenses = Number(summary.expenses || 0);

    const expectedCash =
        Number(summary.netCash || 0);

    const displayDate = date
        ? new Date(`${date}T00:00:00`).toLocaleDateString(
              'en-US',
              {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
              }
          )
        : '';

    const submit = (e) => {
        e.preventDefault();

        form.post(route('daily-cash-records.store'), {
            preserveScroll: false,
            onSuccess: () => {
                // Controller redirects automatically to the
                // Daily Cash Register after successful save.
            },
        });
    };

    const cancel = () => {
        router.get(
            route('daily-cash-records.index'),
            { date: form.data.record_date || date },
            {
                preserveState: false,
                preserveScroll: false,
            }
        );
    };

    return (
        <AppLayout title="Add Daily Record">
            <Head title="Add Daily Record | Pharmexa" />

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

                    {/* MAIN CARD */}
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
                                        Add Daily Record
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
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

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

                                    {form.errors.record_date && (
                                        <p className="mt-2 text-xs font-bold text-red-600">
                                            {form.errors.record_date}
                                        </p>
                                    )}
                                </div>

                                {/* SYSTEM SALES */}
                                <div className="mb-6 rounded-xl border border-teal-100 bg-teal-50/60 p-5">

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-teal-600">
                                                Today&apos;s Total Sales
                                            </p>

                                            <p className="mt-1 text-2xl font-black text-slate-900">
                                                {money(totalSales)}
                                            </p>

                                            <p className="mt-2 text-[10px] font-medium text-slate-500">
                                                Cash {money(cashSales)}
                                                {' • '}
                                                Shabaka {money(shabakaSales)}
                                                {' • '}
                                                Other {money(otherSales)}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
                                            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                                Expenses
                                            </p>

                                            <p className="mt-1 text-sm font-black text-red-600">
                                                {money(expenses)}
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                {/* PHYSICAL COLLECTION */}
                                <div className="mb-6">

                                    <div className="mb-4">
                                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-teal-600">
                                            Physical Collection
                                        </p>

                                        <h2 className="mt-1 text-lg font-black text-slate-900">
                                            Enter Today&apos;s Actual Amounts
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Enter only what you physically counted.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3">

                                        {/* CASH */}
                                        <MoneyInput
                                            label="Physical Cash"
                                            icon={<Banknote size={18} />}
                                            value={form.data.physical_cash}
                                            onChange={(value) =>
                                                form.setData(
                                                    'physical_cash',
                                                    value
                                                )
                                            }
                                            error={form.errors.physical_cash}
                                        />

                                        {/* SHABAKA */}
                                        <MoneyInput
                                            label="Physical Shabaka"
                                            icon={<CreditCard size={18} />}
                                            value={form.data.physical_shabaka}
                                            onChange={(value) =>
                                                form.setData(
                                                    'physical_shabaka',
                                                    value
                                                )
                                            }
                                            error={form.errors.physical_shabaka}
                                        />

                                        {/* OTHER */}
                                        <MoneyInput
                                            label="Physical Others"
                                            icon={<WalletCards size={18} />}
                                            value={form.data.physical_others}
                                            onChange={(value) =>
                                                form.setData(
                                                    'physical_others',
                                                    value
                                                )
                                            }
                                            error={form.errors.physical_others}
                                        />

                                    </div>
                                </div>

                                {/* TOTAL PHYSICAL */}
                                <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5">

                                    <div className="flex items-center justify-between gap-4">

                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                                                Physical Total
                                            </p>

                                            <p className="mt-1 text-xs font-medium text-slate-500">
                                                Cash + Shabaka + Others
                                            </p>
                                        </div>

                                        <p className="text-2xl font-black text-teal-700">
                                            {money(physicalTotal)}
                                        </p>

                                    </div>
                                </div>

                                {/* EXPECTED CASH */}
                                <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">

                                    <div className="flex items-center justify-between gap-4">

                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-600">
                                                Expected Cash
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Cash sales minus expenses
                                            </p>
                                        </div>

                                        <p className="text-lg font-black text-emerald-700">
                                            {money(expectedCash)}
                                        </p>

                                    </div>
                                </div>

                                {/* NOTES */}
                                <div className="mb-6">
                                    <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                                        Notes
                                    </label>

                                    <textarea
                                        value={form.data.notes}
                                        onChange={(e) =>
                                            form.setData(
                                                'notes',
                                                e.target.value
                                            )
                                        }
                                        rows={3}
                                        placeholder="Optional note..."
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                                    />

                                    {form.errors.notes && (
                                        <p className="mt-1 text-xs font-bold text-red-600">
                                            {form.errors.notes}
                                        </p>
                                    )}
                                </div>

                                {/* ACTIONS */}
                                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                                    <button
                                        type="button"
                                        onClick={cancel}
                                        disabled={form.processing}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-black text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        <ArrowLeft size={15} />
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-xs font-black text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {form.processing ? (
                                            <>
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={15} />
                                                Save Daily Record
                                            </>
                                        )}
                                    </button>

                                </div>

                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}


/*
|--------------------------------------------------------------------------
| Money Input
|--------------------------------------------------------------------------
*/

function MoneyInput({
    label,
    icon,
    value,
    onChange,
    error,
}) {
    return (
        <div>
            <label className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <span className="text-teal-600">
                    {icon}
                </span>
                {label}
            </label>

            <div className="relative">

                <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={value}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    placeholder="0.00"
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-lg font-black text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 ${
                        error
                            ? 'border-red-300'
                            : 'border-slate-200'
                    }`}
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">
                    SAR
                </span>
            </div>

            {error && (
                <p className="mt-1 text-xs font-bold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}