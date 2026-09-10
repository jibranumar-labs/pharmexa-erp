import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    CalendarDays,
    DollarSign,
    Download,
    Printer,
    Receipt,
    ShoppingCart,
    TrendingUp,
    Wallet,
} from 'lucide-react';

export default function Index({
    stats,
    chart = [],
    filter = 'This Month',
    dateRange,
    recentSales = [],
    recentPurchases = [],
    recentExpenses = [],
}) {
    const [selectedFilter, setSelectedFilter] = useState(filter);

    const [from, setFrom] = useState(
        dateRange?.from || ''
    );

    const [to, setTo] = useState(
        dateRange?.to || ''
    );

    /*
    |--------------------------------------------------------------------------
    | Preset Filter
    |--------------------------------------------------------------------------
    */

    const applyPreset = (value) => {
        setSelectedFilter(value);

        router.get(
            route('profit-loss.index'),
            {
                filter: value,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Custom Date Range
    |--------------------------------------------------------------------------
    */

    const applyCustomRange = () => {
        if (!from || !to) {
            alert('Please select both From and To dates.');
            return;
        }

        if (from > to) {
            alert('From date cannot be after To date.');
            return;
        }

        setSelectedFilter('Custom');

        router.get(
            route('profit-loss.index'),
            {
                filter: 'Custom',
                from,
                to,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Report Query
    |--------------------------------------------------------------------------
    |
    | PDF and Print receive exactly the same filter currently shown
    | on the dashboard.
    |
    */

    const buildReportQuery = () => {
        const params = new URLSearchParams();

        params.set(
            'filter',
            selectedFilter || filter || 'This Month'
        );

        if (
            (selectedFilter || filter) === 'Custom'
        ) {
            params.set(
                'from',
                dateRange?.from || from
            );

            params.set(
                'to',
                dateRange?.to || to
            );
        }

        return params.toString();
    };

    /*
    |--------------------------------------------------------------------------
    | Download PDF
    |--------------------------------------------------------------------------
    */

    const downloadPdf = () => {
        const query = buildReportQuery();

        window.location.href =
            `${route('profit-loss.pdf')}?${query}`;
    };

    /*
    |--------------------------------------------------------------------------
    | Print
    |--------------------------------------------------------------------------
    */

    const printReport = () => {
        const query = buildReportQuery();

        window.open(
            `${route('profit-loss.print')}?${query}`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    return (
        <AppLayout title="Profit & Loss">

            <Head title="Profit & Loss | Pharmexa" />

            <div className="space-y-7">

                {/* =====================================================
                    HERO
                ====================================================== */}

                <section className="rounded-[2rem] bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-500 p-8 text-white shadow-2xl">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black">

                                <TrendingUp size={18} />

                                Financial Dashboard

                            </div>

                            <h1 className="mt-5 text-5xl font-black">
                                Profit & Loss
                            </h1>

                            <p className="mt-3 text-white/90">
                                Complete financial overview of your pharmacy.
                            </p>

                            <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 font-bold">

                                <CalendarDays size={18} />

                                {dateRange?.label}

                            </div>

                        </div>

                        {/* PDF + PRINT */}

                        <div className="flex flex-col gap-3 sm:flex-row">

                            <button
                                type="button"
                                onClick={downloadPdf}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-black text-emerald-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                <Download size={20} />

                                Download PDF
                            </button>

                            <button
                                type="button"
                                onClick={printReport}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/15 px-6 py-3 font-black text-white shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/25"
                            >
                                <Printer size={20} />

                                Print
                            </button>

                        </div>

                    </div>

                </section>

                {/* =====================================================
                    FILTER
                ====================================================== */}

                <section className="rounded-[2rem] bg-white p-6 shadow-sm dark:bg-slate-900">

                    <div className="flex flex-col gap-5">

                        <div className="flex flex-wrap gap-3">

                            {[
                                'Today',
                                'This Week',
                                'This Month',
                                'This Year',
                            ].map((item) => (

                                <button
                                    key={item}
                                    type="button"
                                    onClick={() =>
                                        applyPreset(item)
                                    }
                                    className={`rounded-xl px-5 py-3 font-black transition ${
                                        selectedFilter === item
                                            ? 'bg-emerald-600 text-white shadow-lg'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'
                                    }`}
                                >
                                    {item}
                                </button>

                            ))}

                        </div>

                        <div className="border-t border-slate-200 pt-5 dark:border-slate-700">

                            <div className="flex flex-col gap-4 xl:flex-row xl:items-end">

                                <div className="flex-1">

                                    <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">
                                        From Date
                                    </label>

                                    <input
                                        type="date"
                                        value={from}
                                        onChange={(e) =>
                                            setFrom(
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900"
                                    />

                                </div>

                                <div className="flex-1">

                                    <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">
                                        To Date
                                    </label>

                                    <input
                                        type="date"
                                        value={to}
                                        onChange={(e) =>
                                            setTo(
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900"
                                    />

                                </div>

                                <button
                                    type="button"
                                    onClick={applyCustomRange}
                                    className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-7 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5"
                                >
                                    Apply Custom Range
                                </button>

                            </div>

                        </div>

                    </div>

                </section>

                {/* =====================================================
                    STATS
                ====================================================== */}

                <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">

                    <Card
                        title="Sales"
                        value={`${Number(
                            stats.sales
                        ).toFixed(2)} SAR`}
                        color="emerald"
                        icon={DollarSign}
                    />

                    <Card
                        title="Purchases"
                        value={`${Number(
                            stats.purchases
                        ).toFixed(2)} SAR`}
                        color="blue"
                        icon={ShoppingCart}
                    />

                    <Card
                        title="Expenses"
                        value={`${Number(
                            stats.expenses
                        ).toFixed(2)} SAR`}
                        color="red"
                        icon={Receipt}
                    />

                    <Card
                        title="Gross Profit"
                        value={`${Number(
                            stats.grossProfit
                        ).toFixed(2)} SAR`}
                        color="purple"
                        icon={Wallet}
                    />

                    <Card
                        title="Net Profit"
                        value={`${Number(
                            stats.netProfit
                        ).toFixed(2)} SAR`}
                        color={
                            Number(stats.netProfit) >= 0
                                ? 'emerald'
                                : 'red'
                        }
                        icon={TrendingUp}
                    />

                </section>

                {/* =====================================================
                    SELECTED PERIOD SUMMARY
                ====================================================== */}

                <section className="rounded-[2rem] bg-white p-8 shadow-sm dark:bg-slate-900">

                    <div className="flex flex-col gap-1">

                        <h2 className="text-2xl font-black">
                            Selected Period Summary
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {dateRange?.label}
                        </p>

                    </div>

                    <div className="mt-6 overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-100 dark:bg-slate-800">

                                <tr>

                                    <th className="p-4 text-left">
                                        Date
                                    </th>

                                    <th className="p-4 text-left">
                                        Day
                                    </th>

                                    <th className="p-4 text-left">
                                        Sales
                                    </th>

                                    <th className="p-4 text-left">
                                        Purchases
                                    </th>

                                    <th className="p-4 text-left">
                                        Expenses
                                    </th>

                                    <th className="p-4 text-left">
                                        Profit
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {chart.length > 0 ? (

                                    chart.map(
                                        (day, index) => (

                                            <tr
                                                key={
                                                    day.date ||
                                                    index
                                                }
                                                className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                            >

                                                <td className="p-4 font-bold">
                                                    {formatReportDate(
                                                        day.date
                                                    )}
                                                </td>

                                                <td className="p-4 font-bold">
                                                    {day.day}
                                                </td>

                                                <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">

                                                    {Number(
                                                        day.sales
                                                    ).toFixed(2)}

                                                </td>

                                                <td className="p-4 font-bold text-blue-600 dark:text-blue-400">

                                                    {Number(
                                                        day.purchases
                                                    ).toFixed(2)}

                                                </td>

                                                <td className="p-4 font-bold text-red-600 dark:text-red-400">

                                                    {Number(
                                                        day.expenses
                                                    ).toFixed(2)}

                                                </td>

                                                <td
                                                    className={`p-4 font-black ${
                                                        Number(
                                                            day.profit
                                                        ) >= 0
                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                            : 'text-red-600 dark:text-red-400'
                                                    }`}
                                                >

                                                    {Number(
                                                        day.profit
                                                    ).toFixed(2)}{' '}
                                                    SAR

                                                </td>

                                            </tr>

                                        )
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="p-10 text-center text-slate-500 dark:text-slate-400"
                                        >
                                            No financial activity found for this period.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

                {/* =====================================================
                    RECENT
                ====================================================== */}

                <section className="grid gap-6 lg:grid-cols-3">

                    <ListCard
                        title="Recent Sales"
                        data={recentSales}
                        field="invoice_number"
                        amount="total"
                        color="emerald"
                    />

                    <ListCard
                        title="Recent Purchases"
                        data={recentPurchases}
                        field="purchase_number"
                        amount="total"
                        color="blue"
                    />

                    <ListCard
                        title="Recent Expenses"
                        data={recentExpenses}
                        field="title"
                        amount="amount"
                        color="red"
                        dateField="expense_date"
                    />

                </section>

            </div>

        </AppLayout>
    );
}

/*
|--------------------------------------------------------------------------
| Statistic Card
|--------------------------------------------------------------------------
*/

function Card({
    title,
    value,
    color,
    icon: Icon,
}) {
    const colors = {
        emerald:
            'from-emerald-600 to-teal-500',

        blue:
            'from-blue-600 to-cyan-500',

        red:
            'from-red-600 to-rose-500',

        purple:
            'from-purple-600 to-indigo-500',
    };

    return (

        <div className="rounded-[2rem] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900">

            <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${colors[color]} text-white`}
            >
                <Icon size={28} />
            </div>

            <p className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-400">
                {title}
            </p>

            <h2 className="mt-2 text-3xl font-black">
                {value}
            </h2>

        </div>

    );
}

/*
|--------------------------------------------------------------------------
| Recent Record Card
|--------------------------------------------------------------------------
*/

function ListCard({
    title,
    data = [],
    field,
    amount,
    color,
    dateField = 'created_at',
}) {
    const colors = {
        emerald:
            'text-emerald-600 dark:text-emerald-400',

        blue:
            'text-blue-600 dark:text-blue-400',

        red:
            'text-red-600 dark:text-red-400',
    };

    return (

        <div className="rounded-[2rem] bg-white p-6 shadow-sm dark:bg-slate-900">

            <h2 className="mb-5 text-xl font-black">
                {title}
            </h2>

            <div className="space-y-4">

                {data.length > 0 ? (

                    data.map((item) => (

                        <div
                            key={item.id}
                            className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-700"
                        >

                            <div>

                                <p className="font-black">
                                    {item[field] ||
                                        `#${item.id}`}
                                </p>

                                <p className="text-xs text-slate-500 dark:text-slate-400">

                                    {formatDate(
                                        item[dateField] ||
                                            item.created_at
                                    )}

                                </p>

                            </div>

                            <p
                                className={`whitespace-nowrap font-black ${colors[color]}`}
                            >

                                {Number(
                                    item[amount]
                                ).toFixed(2)}{' '}
                                SAR

                            </p>

                        </div>

                    ))

                ) : (

                    <p className="py-10 text-center text-slate-500 dark:text-slate-400">
                        No records found for this period.
                    </p>

                )}

            </div>

        </div>

    );
}

/*
|--------------------------------------------------------------------------
| Date Helpers
|--------------------------------------------------------------------------
*/

function formatDate(value) {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleDateString(
        'en-GB'
    );
}

function formatReportDate(value) {
    if (!value) {
        return '-';
    }

    const parts = value.split('-');

    if (parts.length !== 3) {
        return value;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}