import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import {
    BarChart3,
    CalendarDays,
    Download,
    FileDown,
    Package,
    Printer,
    ShoppingCart,
    TrendingUp,
    AlertTriangle,
    XCircle,
    Search,
} from 'lucide-react';
import { useState } from 'react';

export default function Index({
    stats = {},
    salesChart = [],
    purchaseChart = [],
    inventoryChart = [],
    recentSales = [],
    recentPurchases = [],
    filter = 'This Month',
    reportPeriod = {},
    pharmacy = {},
}) {
    const [customFrom, setCustomFrom] = useState(reportPeriod?.from || '');
    const [customTo, setCustomTo] = useState(reportPeriod?.to || '');
    const [customMode, setCustomMode] = useState(filter === 'Custom');
    const [loading, setLoading] = useState(false);

    const applyFilter = (selectedFilter) => {
        if (selectedFilter === 'Custom' && (!customFrom || !customTo)) {
            // Custom is a two-step action: first open the date controls,
            // then apply once both dates have been selected.
            setCustomMode(true);
            return;
        }

        setLoading(true);

        const params = { filter: selectedFilter };

        if (selectedFilter === 'Custom') {
            params.from = customFrom;
            params.to = customTo;
        }

        router.get(route('reports.index'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setLoading(false),
        });
    };

    const selectFilter = (selectedFilter) => {
        if (selectedFilter === 'Custom') {
            setCustomMode(true);
            return;
        }

        setCustomMode(false);
        applyFilter(selectedFilter);
    };

    const buildExportUrl = (format) => {
        const params = new URLSearchParams();

        params.set('filter', filter);

        if (filter === 'Custom') {
            if (customFrom) params.set('from', customFrom);
            if (customTo) params.set('to', customTo);
        }

        params.set('format', format);

        return `${route(
            format === 'pdf'
                ? 'reports.export.pdf'
                : format === 'xlsx'
                  ? 'reports.export.excel'
                  : 'reports.export.csv'
        )}?${params.toString()}`;
    };

    const downloadReport = (format) => {
        window.location.href = buildExportUrl(format);
    };

    const printReport = () => {
        // Print the current report using the browser's native print dialog.
        // The @media print CSS above hides navigation, filters and action
        // buttons and keeps only the professional report area.
        window.print();
    };

    const formatMoney = (value) =>
        `${Number(value || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} ${pharmacy?.currency || 'SAR'}`;

    const cards = [
        {
            title: 'Sales',
            value: formatMoney(stats?.totalSales),
            subtitle: `${stats?.totalInvoices || 0} transactions`,
            icon: ShoppingCart,
            className:
                'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        },
        {
            title: 'Purchases',
            value: formatMoney(stats?.totalPurchases),
            subtitle: `${stats?.totalPurchaseInvoices || 0} invoices`,
            icon: Package,
            className:
                'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
        },
        {
            title: 'Gross Profit',
            value: formatMoney(stats?.grossProfit),
            subtitle: 'Selected period',
            icon: TrendingUp,
            className:
                'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400',
        },
        {
            title: 'Inventory Value',
            value: formatMoney(stats?.inventoryValue),
            subtitle: `${stats?.totalMedicines || 0} active products`,
            icon: BarChart3,
            className:
                'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400',
        },
        {
            title: 'Low Stock',
            value: stats?.lowStock || 0,
            subtitle: 'Needs attention',
            icon: AlertTriangle,
            className:
                'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
        },
        {
            title: 'Expired',
            value: stats?.expired || 0,
            subtitle: 'Expired products',
            icon: XCircle,
            className:
                'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
        },
    ];

    return (
        <>
            <Head title="Reports | Pharmexa" />

            <style>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 12mm;
                    }

                    html,
                    body {
                        background: #fff !important;
                        color: #0f172a !important;
                    }

                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    body * {
                        visibility: hidden !important;
                    }

                    #pharmexa-report-print-area,
                    #pharmexa-report-print-area * {
                        visibility: visible !important;
                    }

                    #pharmexa-report-print-area {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    #pharmexa-report-print-area .no-print {
                        display: none !important;
                    }

                    #pharmexa-report-print-area .print-report-header {
                        display: block !important;
                    }

                    #pharmexa-report-print-area .print-card {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }

                    #pharmexa-report-print-area .print-chart {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }

                    #pharmexa-report-print-area table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                    }

                    #pharmexa-report-print-area tr {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }

                    #pharmexa-report-print-area .screen-only {
                        display: none !important;
                    }

                    #pharmexa-report-print-area .print-only {
                        display: block !important;
                    }
                }

                .print-report-header {
                    display: none;
                }

                .print-only {
                    display: none;
                }
            `}</style>

            <AppLayout title="Reports">
                <div
                    id="pharmexa-report-print-area"
                    className="space-y-5 print:space-y-0"
                >
                    {/* SCREEN HEADER */}
                    <section className="screen-only overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 px-6 py-5 text-white shadow-lg">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="mb-1 flex items-center gap-2">
                                    <BarChart3 size={24} />
                                    <span className="text-sm font-bold uppercase tracking-wider text-white/80">
                                        Pharmexa Reports
                                    </span>
                                </div>

                                <h1 className="text-2xl font-black sm:text-3xl">
                                    {pharmacy?.name || 'Pharmacy'}
                                </h1>

                                <p className="mt-1 text-sm text-white/90">
                                    {pharmacy?.city || pharmacy?.address || ''}
                                    {pharmacy?.city && pharmacy?.country
                                        ? `, ${pharmacy.country}`
                                        : ''}
                                </p>

                                <p className="mt-2 text-sm font-semibold text-white/90">
                                    {reportPeriod?.label ||
                                        'Current Reporting Period'}
                                </p>
                            </div>

                            <div className="no-print flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={printReport}
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-100"
                                >
                                    <Printer size={17} />
                                    Print
                                </button>

                                <button
                                    type="button"
                                    onClick={() => downloadReport('pdf')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-red-700 shadow-sm transition hover:bg-red-50"
                                >
                                    <FileDown size={17} />
                                    PDF
                                </button>

                                <button
                                    type="button"
                                    onClick={() => downloadReport('xlsx')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900/90 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-900"
                                >
                                    <Download size={17} />
                                    Excel
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* PRINT HEADER */}
                    <div className="print-report-header border-b-2 border-slate-900 pb-4">
                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                                    Pharmexa Reports
                                </p>
                                <h1 className="mt-1 text-3xl font-black">
                                    {pharmacy?.name || 'Pharmacy'}
                                </h1>
                                <p className="mt-1 text-sm text-slate-600">
                                    {pharmacy?.city ||
                                        pharmacy?.address ||
                                        ''}
                                    {pharmacy?.city && pharmacy?.country
                                        ? `, ${pharmacy.country}`
                                        : ''}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-sm font-bold">
                                    Sales & Performance Report
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    {reportPeriod?.label ||
                                        'Current Reporting Period'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* FILTERS */}
                    <section className="no-print rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Report Period
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {[
                                        'Today',
                                        'This Week',
                                        'This Month',
                                        'This Year',
                                    ].map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            disabled={loading}
                                            onClick={() => applyFilter(item)}
                                            className={`rounded-lg px-3.5 py-2 text-sm font-bold transition ${
                                                filter === item
                                                    ? 'bg-blue-600 text-white shadow'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => selectFilter('Custom')}
                                        className={`rounded-lg px-3.5 py-2 text-sm font-bold transition ${
                                            customMode || filter === 'Custom'
                                                ? 'bg-blue-600 text-white shadow'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                        }`}
                                    >
                                        Custom
                                    </button>
                                </div>
                            </div>

                            {customMode && (
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-slate-500">
                                            From
                                        </label>
                                        <input
                                            type="date"
                                            value={customFrom}
                                            onChange={(e) =>
                                                setCustomFrom(
                                                    e.target.value
                                                )
                                            }
                                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-slate-500">
                                            To
                                        </label>
                                        <input
                                            type="date"
                                            value={customTo}
                                            onChange={(e) =>
                                                setCustomTo(e.target.value)
                                            }
                                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        disabled={
                                            !customFrom ||
                                            !customTo ||
                                            loading
                                        }
                                        onClick={() => applyFilter('Custom')}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Search size={16} />
                                        Apply
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* KPI CARDS */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {cards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <div
                                    key={card.title}
                                    className="print-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                                {card.title}
                                            </p>

                                            <p className="mt-2 truncate text-xl font-black text-slate-900 dark:text-white">
                                                {card.value}
                                            </p>

                                            <p className="mt-1 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                {card.subtitle}
                                            </p>
                                        </div>

                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.className}`}
                                        >
                                            <Icon size={19} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    {/* SALES + PURCHASE SUMMARY */}
                    <section className="grid gap-5 lg:grid-cols-2">
                        <div className="print-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                                        Sales Overview
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        {reportPeriod?.label}
                                    </p>
                                </div>

                                <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                                    {formatMoney(stats?.totalSales)}
                                </span>
                            </div>

                            <div className="print-chart">
                                <SimpleChart
                                    data={salesChart}
                                    valueKey="sales"
                                    label="Sales"
                                />
                            </div>
                        </div>

                        <div className="print-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                                        Purchase Overview
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        {reportPeriod?.label}
                                    </p>
                                </div>

                                <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                                    {formatMoney(stats?.totalPurchases)}
                                </span>
                            </div>

                            <div className="print-chart">
                                <SimpleChart
                                    data={purchaseChart}
                                    valueKey="purchases"
                                    label="Purchases"
                                />
                            </div>
                        </div>
                    </section>

                    {/* RECENT SALES / PURCHASES */}
                    <section className="grid gap-5 lg:grid-cols-2">
                        <TransactionTable
                            title="Recent Sales"
                            rows={recentSales}
                            type="sale"
                            currency={pharmacy?.currency || 'SAR'}
                        />

                        <TransactionTable
                            title="Recent Purchases"
                            rows={recentPurchases}
                            type="purchase"
                            currency={pharmacy?.currency || 'SAR'}
                        />
                    </section>

                    {/* PRINT SUMMARY */}
                    <div className="print-only border-t-2 border-slate-900 pt-4">
                        <div className="grid grid-cols-3 gap-3">
                            <PrintStat
                                label="Sales"
                                value={formatMoney(stats?.totalSales)}
                            />
                            <PrintStat
                                label="Purchases"
                                value={formatMoney(stats?.totalPurchases)}
                            />
                            <PrintStat
                                label="Gross Profit"
                                value={formatMoney(stats?.grossProfit)}
                            />
                            <PrintStat
                                label="Transactions"
                                value={stats?.totalInvoices || 0}
                            />
                            <PrintStat
                                label="Low Stock"
                                value={stats?.lowStock || 0}
                            />
                            <PrintStat
                                label="Expired"
                                value={stats?.expired || 0}
                            />
                        </div>

                        <div className="mt-8 border-t border-slate-300 pt-4 text-center">
                            <p className="font-black">Pharmexa ERP v1.0</p>
                            <p className="text-xs text-slate-600">
                                © 2026 All Rights Reserved
                            </p>
                            <p className="mt-1 text-xs font-bold text-emerald-600">
                                Powered by Jibran Umar
                            </p>
                            <p className="text-[10px] text-slate-500">
                                Software Engineer & ERP Developer
                            </p>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}

function SimpleChart({ data = [], valueKey, label }) {
    if (!data.length) {
        return (
            <div className="flex h-48 items-center justify-center rounded-xl bg-slate-50 text-sm font-semibold text-slate-400 dark:bg-slate-800">
                No data available.
            </div>
        );
    }

    const max = Math.max(
        ...data.map((item) => Number(item?.[valueKey] || 0)),
        1
    );

    return (
        <div className="overflow-x-auto">
            <div className="flex h-48 min-w-[520px] items-end gap-1">
                {data.map((item, index) => {
                    const value = Number(item?.[valueKey] || 0);
                    const height = Math.max(
                        (value / max) * 100,
                        value > 0 ? 4 : 1
                    );

                    return (
                        <div
                            key={item?.date || item?.label || index}
                            className="group flex h-full flex-1 flex-col justify-end"
                        >
                            <div className="relative flex flex-1 items-end">
                                <div
                                    title={`${item?.label || item?.date || ''}: ${value.toLocaleString()}`}
                                    style={{ height: `${height}%` }}
                                    className="w-full min-w-[5px] rounded-t-md bg-blue-500 transition hover:bg-blue-600"
                                />
                            </div>

                            <span className="mt-2 truncate text-center text-[9px] font-semibold text-slate-400">
                                {item?.label || item?.date || ''}
                            </span>
                        </div>
                    );
                })}
            </div>

            <p className="mt-2 text-right text-xs font-semibold text-slate-400">
                {label}
            </p>
        </div>
    );
}

function TransactionTable({
    title,
    rows = [],
    type,
    currency,
}) {
    return (
        <div className="print-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {title}
                </h2>

                <span className="text-xs font-bold text-slate-400">
                    {rows.length} records
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                    <thead>
                        <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                            <th className="px-3 py-2 text-xs font-black text-slate-500">
                                {type === 'sale' ? 'Invoice' : 'Reference'}
                            </th>
                            <th className="px-3 py-2 text-xs font-black text-slate-500">
                                {type === 'sale' ? 'Customer' : 'Supplier'}
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-black text-slate-500">
                                Total
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-black text-slate-500">
                                Date
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {!rows.length ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-3 py-8 text-center text-sm font-semibold text-slate-400"
                                >
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr
                                    key={row?.id}
                                    className="border-b border-slate-100 dark:border-slate-800"
                                >
                                    <td className="px-3 py-3 text-sm font-bold text-slate-900 dark:text-white">
                                        {row?.invoice_number ||
                                            row?.reference_number ||
                                            `#${row?.id}`}
                                    </td>

                                    <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-400">
                                        {type === 'sale'
                                            ? row?.customer_name ||
                                              'Walk-in Customer'
                                            : row?.supplier?.name ||
                                              'Supplier'}
                                    </td>

                                    <td className="px-3 py-3 text-right text-sm font-black text-emerald-600">
                                        {Number(row?.total || 0).toFixed(2)}{' '}
                                        {currency}
                                    </td>

                                    <td className="px-3 py-3 text-right text-xs font-semibold text-slate-500">
                                        {row?.created_at
                                            ? new Date(
                                                  row.created_at
                                              ).toLocaleDateString('en-GB')
                                            : '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PrintStat({ label, value }) {
    return (
        <div className="border border-slate-300 p-3">
            <p className="text-xs font-bold uppercase text-slate-500">
                {label}
            </p>
            <p className="mt-1 text-lg font-black">{value}</p>
        </div>
    );
}
