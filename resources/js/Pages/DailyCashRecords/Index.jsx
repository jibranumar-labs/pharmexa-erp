import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    CircleDollarSign,
    Edit3,
    FileText,
    Plus,
    RefreshCw,
    Trash2,
    WalletCards,
} from 'lucide-react';

const money = (value) =>
    `${Number(value || 0).toFixed(2)} SAR`;

export default function Index({
    record = null,
    date,
    summary = {},
    monthly = {},
}) {
    const displayDate = new Date(
        `${date}T00:00:00`
    ).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const shortDate = new Date(
        `${date}T00:00:00`
    ).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

    const loadDate = (value) => {
        if (!value) return;

        router.get(
            route('daily-cash-records.index'),
            { date: value },
            {
                preserveState: false,
                preserveScroll: false,
            }
        );
    };

    const moveDate = (days) => {
        const current = new Date(
            `${date}T00:00:00`
        );

        current.setDate(
            current.getDate() + days
        );

        loadDate(
            current.toISOString().slice(0, 10)
        );
    };

    const addRecord = () => {
        router.get(
            route('daily-cash-records.create'),
            { date },
            {
                preserveState: false,
                preserveScroll: false,
            }
        );
    };

    const editRecord = () => {
        if (!record?.id) return;

        router.get(
            route(
                'daily-cash-records.edit',
                record.id
            ),
            {},
            {
                preserveState: false,
                preserveScroll: false,
            }
        );
    };

    const editRow = (row) => {
        if (!row?.id) return;

        router.get(
            route(
                'daily-cash-records.edit',
                row.id
            ),
            {},
            {
                preserveState: false,
                preserveScroll: false,
            }
        );
    };

    const deleteRecord = (id) => {
        if (!id) return;

        const confirmed = window.confirm(
            'Are you sure you want to delete this daily cash record?\n\nThis action cannot be undone.'
        );

        if (!confirmed) return;

        router.delete(
            route(
                'daily-cash-records.destroy',
                id
            ),
            {
                preserveScroll: true,
            }
        );
    };

    /*
     * IMPORTANT:
     *
     * salesTotal = actual POS sales
     * totalSales = physical collection for a saved record
     *
     * We therefore use salesTotal for today's POS sales.
     */
    const posSalesTotal = Number(
        summary.salesTotal ??
            (
                Number(summary.cashSales || 0) +
                Number(summary.shabakaSales || 0) +
                Number(summary.otherSales || 0)
            )
    );

    const physicalTotal = Number(
        summary.physicalTotal ??
            summary.totalSales ??
            0
    );

    return (
        <AppLayout title="Daily Cash Register">
            <Head title="Daily Cash Register | Pharmexa" />

            <div className="min-h-full bg-slate-50/60 pb-10">
                <div className="mx-auto max-w-[1500px] space-y-4">

                    {/* HEADER */}
                    <section className="rounded-2xl bg-gradient-to-r from-teal-700 to-cyan-500 px-5 py-5 text-white shadow-sm lg:px-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                            <div>
                                <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/75">
                                    <WalletCards size={13} />
                                    Daily Operations
                                </div>

                                <h1 className="text-2xl font-black tracking-tight">
                                    Daily Cash Register
                                </h1>

                                <p className="mt-1 text-xs font-medium text-white/80">
                                    Record the physical payments collected at the end of each day.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    onClick={() => moveDate(-1)}
                                    className="rounded-lg bg-white/15 p-2.5 transition hover:bg-white/25"
                                    title="Previous day"
                                >
                                    <ArrowLeft size={16} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => loadDate(date)}
                                    className="rounded-lg bg-white px-3 py-2.5 text-xs font-black text-teal-700"
                                >
                                    {shortDate}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => moveDate(1)}
                                    className="rounded-lg bg-white/15 p-2.5 transition hover:bg-white/25"
                                    title="Next day"
                                >
                                    <ArrowRight size={16} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => loadDate(date)}
                                    className="rounded-lg bg-white/15 p-2.5 transition hover:bg-white/25"
                                    title="Refresh"
                                >
                                    <RefreshCw size={15} />
                                </button>

                            </div>
                        </div>
                    </section>

                    {/* DATE / ACTION */}
                    <section className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                                    <CalendarDays size={20} />
                                </div>

                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                                        Register Date
                                    </p>

                                    <h2 className="text-base font-black text-slate-900">
                                        {displayDate}
                                    </h2>
                                </div>

                            </div>

                            <div className="flex flex-wrap items-center gap-2">

                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) =>
                                        loadDate(
                                            e.target.value
                                        )
                                    }
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-teal-500"
                                />

                                {!record ? (
                                    <button
                                        type="button"
                                        onClick={addRecord}
                                        className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-teal-700"
                                    >
                                        <Plus size={15} />
                                        Add Daily Record
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={editRecord}
                                        className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-teal-700"
                                    >
                                        <Edit3 size={15} />
                                        Edit Daily Record
                                    </button>
                                )}

                            </div>
                        </div>
                    </section>

                    {/* STATUS */}
                    <section
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                            record
                                ? 'border-emerald-200 bg-emerald-50'
                                : 'border-amber-200 bg-amber-50'
                        }`}
                    >
                        {record ? (
                            <CheckCircle2
                                size={18}
                                className="text-emerald-600"
                            />
                        ) : (
                            <CircleDollarSign
                                size={18}
                                className="text-amber-600"
                            />
                        )}

                        <div>
                            <p
                                className={`text-xs font-black ${
                                    record
                                        ? 'text-emerald-800'
                                        : 'text-amber-800'
                                }`}
                            >
                                {record
                                    ? 'Daily record saved'
                                    : 'Daily record not entered yet'}
                            </p>

                            <p className="text-[11px] font-medium text-slate-500">
                                {record
                                    ? 'The physical payment amounts are saved and editable.'
                                    : 'Click Add Daily Record to enter today’s physical payments.'}
                            </p>
                        </div>
                    </section>

                    {/* TODAY'S POS SALES */}
                    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

                        <Stat
                            label="Cash Sales"
                            value={summary.cashSales}
                            icon={<WalletCards size={16} />}
                        />

                        <Stat
                            label="Shabaka / Mada"
                            value={summary.shabakaSales}
                            icon={<WalletCards size={16} />}
                        />

                        <Stat
                            label="Other Sales"
                            value={summary.otherSales}
                            icon={<CircleDollarSign size={16} />}
                        />

                        <Stat
                            label="Today's Total Sales"
                            value={posSalesTotal}
                            icon={<CheckCircle2 size={16} />}
                            highlight
                        />

                    </section>

                    {/* CASH POSITION */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="mb-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                                Cash Position
                            </p>

                            <h2 className="text-xl font-black text-slate-900">
                                Today&apos;s Summary
                            </h2>

                            <p className="text-xs font-medium text-slate-500">
                                Physical collection and pharmacy expenses.
                            </p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-4">

                            <SummaryCard
                                label="Physical Collection"
                                value={physicalTotal}
                            />

                            <SummaryCard
                                label="Today's Expenses"
                                value={summary.expenses}
                                danger
                            />

                            <SummaryCard
                                label="Expected Cash"
                                value={summary.expectedCash}
                            />

                            <SummaryCard
                                label="Net Cash"
                                value={summary.netCash}
                                success
                            />

                        </div>
                    </section>

                    {/* SAVED RECORD */}
                    {record && (
                        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between">

                            <div>
                                <p className="text-sm font-black text-slate-900">
                                    Daily record is saved
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Physical Cash:{' '}
                                    <b>
                                        {money(
                                            summary.physicalCash
                                        )}
                                    </b>

                                    {' · '}

                                    Shabaka:{' '}
                                    <b>
                                        {money(
                                            summary.physicalShabaka
                                        )}
                                    </b>

                                    {' · '}

                                    Other:{' '}
                                    <b>
                                        {money(
                                            summary.physicalOthers
                                        )}
                                    </b>

                                    {' · '}

                                    Total:{' '}
                                    <b className="text-teal-700">
                                        {money(
                                            physicalTotal
                                        )}
                                    </b>
                                </p>
                            </div>

                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    onClick={editRecord}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-5 py-2.5 text-xs font-black text-teal-700 transition hover:bg-teal-100"
                                >
                                    <Edit3 size={15} />
                                    Edit Record
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        deleteRecord(
                                            record.id
                                        )
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 transition hover:bg-red-100"
                                >
                                    <Trash2 size={15} />
                                    Delete
                                </button>

                            </div>
                        </section>
                    )}

                    {/* MONTHLY RECORD */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-teal-600">
                                    Monthly Record
                                </p>

                                <h2 className="text-lg font-black text-slate-900">
                                    {monthly.month ||
                                        'Monthly Record'}
                                </h2>

                                <p className="text-xs text-slate-500">
                                    Every saved daily record appears here.
                                </p>
                            </div>

                            <span className="rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-black text-teal-700">
                                {monthly.daysClosed || 0}{' '}
                                days saved
                            </span>

                        </div>

                        {/* MONTHLY TOTALS */}
                        <div className="grid gap-2 border-b border-slate-100 p-4 sm:grid-cols-2 lg:grid-cols-5">

                            <Mini
                                label="Physical Collected"
                                value={monthly.totalSales}
                            />

                            <Mini
                                label="Cash"
                                value={monthly.cashSales}
                            />

                            <Mini
                                label="Shabaka"
                                value={monthly.shabakaSales}
                            />

                            <Mini
                                label="Expenses"
                                value={monthly.expenses}
                                danger
                            />

                            <Mini
                                label="Net Cash"
                                value={monthly.netCash}
                                success
                            />

                        </div>

                        {/* TABLE */}
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1050px] text-left">

                                <thead className="bg-slate-50">
                                    <tr className="border-b border-slate-100">

                                        {[
                                            'Date',
                                            'POS Cash',
                                            'POS Shabaka',
                                            'POS Other',
                                            'POS Total',
                                            'Expenses',
                                            'Physical Cash',
                                            'Physical Total',
                                            'Difference',
                                            'Action',
                                        ].map(
                                            (heading) => (
                                                <th
                                                    key={
                                                        heading
                                                    }
                                                    className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-400"
                                                >
                                                    {heading}
                                                </th>
                                            )
                                        )}

                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {monthly.records?.length ? (
                                        monthly.records.map(
                                            (row) => {
                                                const rowPosTotal =
                                                    Number(
                                                        row.salesTotal ??
                                                            (
                                                                Number(
                                                                    row.cashSales ||
                                                                        0
                                                                ) +
                                                                Number(
                                                                    row.shabakaSales ||
                                                                        0
                                                                ) +
                                                                Number(
                                                                    row.otherSales ||
                                                                        0
                                                                )
                                                            )
                                                    );

                                                const rowPhysicalTotal =
                                                    Number(
                                                        row.physicalTotal ??
                                                            row.totalSales ??
                                                            0
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            row.id
                                                        }
                                                        className="transition hover:bg-slate-50"
                                                    >

                                                        <td className="px-4 py-3 text-xs font-black text-slate-800">
                                                            {new Date(
                                                                `${row.date}T00:00:00`
                                                            ).toLocaleDateString(
                                                                'en-US',
                                                                {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                }
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-3 text-xs font-bold">
                                                            {money(
                                                                row.cashSales
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-3 text-xs font-bold">
                                                            {money(
                                                                row.shabakaSales
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-3 text-xs font-bold">
                                                            {money(
                                                                row.otherSales
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-3 text-xs font-black text-slate-700">
                                                            {money(
                                                                rowPosTotal
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-3 text-xs font-black text-red-600">
                                                            {money(
                                                                row.expenses
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-3 text-xs font-black text-emerald-700">
                                                            {money(
                                                                row.physicalCash
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-3 text-xs font-black text-teal-700">
                                                            {money(
                                                                rowPhysicalTotal
                                                            )}
                                                        </td>

                                                        <td
                                                            className={`px-4 py-3 text-xs font-black ${
                                                                Number(
                                                                    row.cashDifference
                                                                ) === 0
                                                                    ? 'text-slate-500'
                                                                    : Number(
                                                                            row.cashDifference
                                                                        ) > 0
                                                                      ? 'text-emerald-600'
                                                                      : 'text-red-600'
                                                            }`}
                                                        >
                                                            {money(
                                                                row.cashDifference
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-3">

                                                            <div className="flex items-center gap-2">

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        editRow(
                                                                            row
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-black text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
                                                                >
                                                                    <Edit3
                                                                        size={
                                                                            13
                                                                        }
                                                                    />
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        deleteRecord(
                                                                            row.id
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-black text-red-600 transition hover:bg-red-100"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            13
                                                                        }
                                                                    />
                                                                    Delete
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="10"
                                                className="px-6 py-12 text-center"
                                            >
                                                <FileText
                                                    className="mx-auto text-slate-300"
                                                    size={30}
                                                />

                                                <p className="mt-2 text-xs font-black text-slate-500">
                                                    No daily records saved this month
                                                </p>

                                                <p className="mt-1 text-[11px] text-slate-400">
                                                    Add a daily record and it will appear here automatically.
                                                </p>
                                            </td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>
                        </div>
                    </section>

                </div>
            </div>
        </AppLayout>
    );
}


/*
|--------------------------------------------------------------------------
| Small UI Components
|--------------------------------------------------------------------------
*/

function Stat({
    label,
    value,
    icon,
    highlight = false,
}) {
    return (
        <div
            className={`rounded-2xl border p-4 shadow-sm ${
                highlight
                    ? 'border-teal-200 bg-teal-50'
                    : 'border-slate-200 bg-white'
            }`}
        >
            <div className="flex items-center justify-between">

                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                    {label}
                </p>

                <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        highlight
                            ? 'bg-white text-teal-600'
                            : 'bg-slate-50 text-slate-500'
                    }`}
                >
                    {icon}
                </div>

            </div>

            <p
                className={`mt-3 text-xl font-black ${
                    highlight
                        ? 'text-teal-700'
                        : 'text-slate-900'
                }`}
            >
                {money(value)}
            </p>
        </div>
    );
}


function SummaryCard({
    label,
    value,
    danger = false,
    success = false,
}) {
    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                {label}
            </p>

            <p
                className={`mt-2 text-lg font-black ${
                    danger
                        ? 'text-red-600'
                        : success
                          ? 'text-emerald-700'
                          : 'text-slate-900'
                }`}
            >
                {money(value)}
            </p>

        </div>
    );
}


function Mini({
    label,
    value,
    danger = false,
    success = false,
}) {
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-3">

            <p className="text-[8px] font-black uppercase tracking-[0.14em] text-slate-400">
                {label}
            </p>

            <p
                className={`mt-1 text-sm font-black ${
                    danger
                        ? 'text-red-600'
                        : success
                          ? 'text-emerald-700'
                          : 'text-slate-800'
                }`}
            >
                {money(value)}
            </p>

        </div>
    );
}