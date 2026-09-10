import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    Eye,
    FileText,
    Plus,
    Receipt,
    Wallet,
} from 'lucide-react';

export default function Index({ purchases, stats = {} }) {
    const rows = purchases?.data ?? [];

    const cards = [
        {
            label: 'Total Purchases',
            value: stats.totalPurchases || 0,
            icon: Receipt,
            color: 'from-blue-600 to-cyan-500',
        },
        {
            label: 'Purchase Amount',
            value: `${Number(stats.totalAmount || 0).toFixed(2)} SAR`,
            icon: Wallet,
            color: 'from-emerald-600 to-teal-500',
        },
        {
            label: 'Paid Amount',
            value: `${Number(stats.paidAmount || 0).toFixed(2)} SAR`,
            icon: FileText,
            color: 'from-purple-600 to-indigo-500',
        },
        {
            label: 'Balance',
            value: `${Number(stats.balanceAmount || 0).toFixed(2)} SAR`,
            icon: Building2,
            color: 'from-rose-500 to-red-500',
        },
    ];

    return (
        <AppLayout title="Purchases">
            <Head title="Purchases | Pharmexa" />

            <div className="space-y-7">
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition-colors">
                                <Receipt size={16} />
                                Purchase Management
                            </div>

                            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
                                Purchase Invoices
                            </h1>

                            <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-white/90">
                                Manage supplier purchase invoices, received products,
                                payment status, and procurement records.
                            </p>
                        </div>

                        <Link
                            href={route('purchases.create')}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-white px-6 py-4 font-black text-blue-700 dark:text-blue-300 shadow-xl transition hover:-translate-y-1"
                        >
                            <Plus size={20} />
                            New Purchase
                        </Link>
                    </div>
                </section>

                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.label}
                                className="group rounded-[1.75rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-900"
                            >
                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg`}
                                >
                                    <Icon size={26} />
                                </div>

                                <p className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-400">
                                    {card.label}
                                </p>

                                <h3 className="mt-2 break-words text-3xl font-black text-slate-950 dark:text-white">
                                    {card.value}
                                </h3>

                                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                    Updated live
                                </p>
                            </div>
                        );
                    })}
                </section>

                              <section className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white shadow-sm dark:bg-slate-900 transition-colors">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 dark:border-slate-700 p-6 lg:flex-row lg:items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                                Purchase History
                            </h2>
                            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                Showing {purchases?.from ?? 0}–{purchases?.to ?? 0} of {purchases?.total ?? 0} purchases.
                            </p>
                        </div>

                        <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 dark:bg-slate-800">
                            Page {purchases?.current_page ?? 1} of {purchases?.last_page ?? 1}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-slate-50 dark:bg-slate-800/70">
                                <tr>
                                    {[
                                        'Purchase No',
                                        'Supplier',
                                        'Invoice',
                                        'Date',
                                        'Total',
                                        'Paid',
                                        'Balance',
                                        'Status',
                                        'Action',
                                    ].map((head) => (
                                        <th
                                            key={head}
                                            className="px-5 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                        >
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {rows.length ? (
                                    rows.map((purchase) => (
                                        <tr
                                            key={purchase.id}
                                            className="transition hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800/60"
                                        >
                                            <td className="px-5 py-5 font-black text-blue-700 dark:text-blue-300">
                                                {purchase.purchase_number}
                                            </td>

                                            <td className="px-5 py-5">
                                                <p className="font-black text-slate-950 dark:text-white">
                                                    {purchase.supplier?.name || '-'}
                                                </p>
                                            </td>

                                            <td className="px-5 py-5 font-bold text-slate-600 dark:text-slate-400">
                                                {purchase.supplier_invoice_number || '-'}
                                            </td>

                                            <td className="px-5 py-5 font-bold text-slate-600 dark:text-slate-400">
                                                {purchase.purchase_date
                                                    ? new Date(purchase.purchase_date).toLocaleDateString('en-GB')
                                                    : '-'}
                                            </td>

                                            <td className="px-5 py-5 font-black text-emerald-600 dark:text-emerald-400">
                                                {Number(purchase.total || 0).toFixed(2)} SAR
                                            </td>

                                            <td className="px-5 py-5 font-bold text-slate-600 dark:text-slate-400">
                                                {Number(purchase.paid_amount || 0).toFixed(2)} SAR
                                            </td>

                                            <td className="px-5 py-5 font-bold text-rose-600">
                                                {Number(purchase.balance_amount || 0).toFixed(2)} SAR
                                            </td>

                                            <td className="px-5 py-5">
                                                <span className="inline-flex rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-3 py-2 text-[11px] font-black text-emerald-700 dark:text-emerald-300">
                                                    {purchase.payment_status}
                                                </span>
                                            </td>

                                            <td className="px-5 py-5">
                                                <Link
                                                    href={route('purchases.show', purchase.id)}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-black text-slate-600 dark:text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <Eye size={15} />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-16 text-center">
                                            <Receipt
                                                className="mx-auto text-slate-400 dark:text-slate-500"
                                                size={42}
                                            />
                                            <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
                                                No purchases found
                                            </h3>
                                            <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                                                Create your first purchase invoice to receive products.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-700 p-5 lg:flex-row lg:items-center lg:justify-between">
                        <p className="text-center text-sm font-bold text-slate-500 dark:text-slate-400 lg:text-left">
                            Showing {purchases?.from ?? 0}–{purchases?.to ?? 0} of {purchases?.total ?? 0}
                        </p>

                        <div className="flex items-center justify-center gap-3">
                            {purchases?.prev_page_url ? (
                                <Link
                                    href={purchases.prev_page_url}
                                    preserveScroll
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-700"
                                >
                                    Previous
                                </Link>
                            ) : (
                                <span className="rounded-xl border border-slate-100 dark:border-slate-700 px-4 py-2 text-sm font-black text-slate-300 dark:text-slate-600">
                                    Previous
                                </span>
                            )}

                            <span className="rounded-xl bg-gradient-to-r from-blue-700 to-emerald-500 px-4 py-2 text-sm font-black text-white shadow-lg">
                                {purchases?.current_page ?? 1} / {purchases?.last_page ?? 1}
                            </span>

                            {purchases?.next_page_url ? (
                                <Link
                                    href={purchases.next_page_url}
                                    preserveScroll
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-700"
                                >
                                    Next
                                </Link>
                            ) : (
                                <span className="rounded-xl border border-slate-100 dark:border-slate-700 px-4 py-2 text-sm font-black text-slate-300 dark:text-slate-600">
                                    Next
                                </span>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}