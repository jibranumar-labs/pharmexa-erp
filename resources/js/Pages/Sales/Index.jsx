import AppLayout from '@/Layouts/AppLayout';

import { Head, Link, router } from '@inertiajs/react';

import {
    Eye,
    Search,
    CalendarDays,
    CreditCard,
    X,
} from 'lucide-react';

import { useState } from 'react';

export default function Index({ sales, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [paymentStatus, setPaymentStatus] = useState(
        filters.payment_status || ''
    );

    const applyFilters = (e) => {
        e.preventDefault();

        router.get(
            route('sales.index'),
            {
                search: search || undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
                payment_status: paymentStatus || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setSearch('');
        setDateFrom('');
        setDateTo('');
        setPaymentStatus('');

        router.get(
            route('sales.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    return (
        <AppLayout title="Sales History">
            <Head title="Sales History | Pharmexa" />

            <div className="space-y-6">

                {/* Header */}
                <div className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-8 text-white shadow-xl">
                    <h1 className="text-4xl font-black">
                        Sales History
                    </h1>

                    <p className="mt-2 text-white/90">
                        View, search and manage completed pharmacy sales.
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="rounded-[2rem] bg-white p-6 shadow-sm dark:bg-slate-900">

                    <form
                        onSubmit={applyFilters}
                        className="space-y-4"
                    >
                        <div className="grid gap-4 lg:grid-cols-12">

                            {/* Search */}
                            <div className="lg:col-span-5">
                                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Search Sales
                                </label>

                                <div className="relative">
                                    <Search
                                        size={20}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Invoice number or customer name..."
                                        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Date From */}
                            <div className="lg:col-span-2">
                                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                                    From Date
                                </label>

                                <div className="relative">
                                    <CalendarDays
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) =>
                                            setDateFrom(e.target.value)
                                        }
                                        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Date To */}
                            <div className="lg:col-span-2">
                                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                                    To Date
                                </label>

                                <div className="relative">
                                    <CalendarDays
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) =>
                                            setDateTo(e.target.value)
                                        }
                                        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Payment Status */}
                            <div className="lg:col-span-3">
                                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Payment Status
                                </label>

                                <div className="relative">
                                    <CreditCard
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <select
                                        value={paymentStatus}
                                        onChange={(e) =>
                                            setPaymentStatus(e.target.value)
                                        }
                                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="">
                                            All Payment Status
                                        </option>

                                        <option value="paid">
                                            Paid
                                        </option>

                                        <option value="partial">
                                            Partial
                                        </option>

                                        <option value="unpaid">
                                            Unpaid
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-3">

                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 px-6 py-3 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                <Search size={18} />
                                Search
                            </button>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                                <X size={18} />
                                Clear Filters
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sales Records */}
                <div className="rounded-[2rem] bg-white p-6 shadow-sm transition-colors dark:bg-slate-900">

                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                Sales Records
                            </h2>

                            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                Showing completed pharmacy sales
                            </p>
                        </div>

                        <span className="rounded-full bg-emerald-100 px-4 py-2 font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            {sales.total} Sales
                        </span>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">

                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-3 text-left">
                                        Invoice
                                    </th>

                                    <th className="p-3 text-left">
                                        Customer
                                    </th>

                                    <th className="p-3 text-left">
                                        Total
                                    </th>

                                    <th className="p-3 text-left">
                                        Paid
                                    </th>

                                    <th className="p-3 text-left">
                                        Date
                                    </th>

                                    <th className="p-3 text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {sales.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-4 py-12 text-center"
                                        >
                                            <div className="text-lg font-bold text-slate-500 dark:text-slate-400">
                                                No sales found
                                            </div>

                                            <p className="mt-1 text-sm text-slate-400">
                                                Try changing your search or filters.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    sales.data.map((sale) => (
                                        <tr
                                            key={sale.id}
                                            className="border-b border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                        >

                                            {/* Invoice */}
                                            <td className="p-3 font-bold text-slate-900 dark:text-white">
                                                {sale.invoice_number}
                                            </td>

                                            {/* Customer */}
                                            <td className="p-3 text-slate-700 dark:text-slate-300">
                                                {sale.customer_name ||
                                                    'Walk-in Customer'}
                                            </td>

                                            {/* Total */}
                                            <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                                                {Number(sale.total).toFixed(2)} SAR
                                            </td>

                                            {/* Paid */}
                                            <td className="p-3 text-slate-700 dark:text-slate-300">
                                                {Number(
                                                    sale.paid_amount
                                                ).toFixed(2)} SAR
                                            </td>

                                            {/* Date */}
                                            <td className="p-3 text-slate-700 dark:text-slate-300">
                                                {new Date(
                                                    sale.created_at
                                                ).toLocaleDateString('en-GB')}
                                            </td>

                                            {/* Actions */}
                                            <td className="p-3 text-center">
                                                <div className="flex justify-center">

                                                    <Link
                                                        href={route(
                                                            'sales.show',
                                                            sale.id
                                                        )}
                                                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                                                    >
                                                        <Eye size={16} />
                                                        View
                                                    </Link>

                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {sales.links && sales.links.length > 3 && (
                        <div className="mt-6 flex flex-wrap justify-center gap-2">

                            {sales.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : link.url
                                              ? 'bg-slate-100 text-slate-700 hover:bg-blue-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                              : 'cursor-not-allowed bg-slate-50 text-slate-300 dark:bg-slate-900 dark:text-slate-600'
                                    }`}
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </Link>
                            ))}

                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}