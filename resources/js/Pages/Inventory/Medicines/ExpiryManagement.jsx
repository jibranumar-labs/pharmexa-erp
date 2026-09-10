import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    CalendarClock,
    Clock3,
    Eye,
    ShieldAlert,
    ShieldCheck,
} from 'lucide-react';

export default function ExpiryManagement({
    stats,
    filter,
    filteredMedicines = [],
}) {
    const cards = [
        {
            title: 'Expired',
            value: stats.expired,
            icon: ShieldAlert,
            color: 'from-red-600 to-rose-500',
            text: 'Already expired products',
            filter: 'expired',
        },
        {
            title: '30 Days',
            value: stats.thirtyDays,
            icon: AlertTriangle,
            color: 'from-orange-500 to-amber-500',
            text: 'Expiring within 30 days',
            filter: '30',
        },
        {
            title: '90 Days',
            value: stats.ninetyDays,
            icon: Clock3,
            color: 'from-blue-600 to-cyan-500',
            text: 'Expiring within 90 days',
            filter: '90',
        },
        {
            title: '6 Months',
            value: stats.sixMonths,
            icon: CalendarClock,
            color: 'from-purple-600 to-indigo-500',
            text: 'Expiring within 6 months',
            filter: '180',
        },
        {
            title: 'No Expiry',
            value: stats.noExpiry,
            icon: ShieldCheck,
            color: 'from-emerald-600 to-teal-500',
            text: 'Products without expiry date',
            filter: 'no-expiry',
        },
    ];

    return (
        <AppLayout title="Expiry Management">
            <Head title="Expiry Management | Pharmexa" />

            <div className="space-y-7">
                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur transition-colors">
                                <CalendarClock size={16} />
                                Inventory / Expiry Management
                            </div>

                            <h1 className="text-4xl font-black lg:text-5xl">
                                Expiry Management
                            </h1>

                            <p className="mt-3 max-w-3xl font-medium text-white/90">
                                Track expired products, near-expiry items, and products without expiry dates.
                            </p>
                        </div>

                        <Link
                            href={route('inventory.index')}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-white px-6 py-4 font-black text-blue-700 dark:text-blue-300 shadow-xl transition hover:-translate-y-1"
                        >
                            <ArrowLeft size={18} />
                            Back to Inventory
                        </Link>
                    </div>
                </section>

                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <Link
                                key={card.title}
                                href={route('medicines.expiry', {
                                    filter: card.filter,
                                })}
                                className={`rounded-[2rem] border bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl block ${
                                    filter === card.filter
                                        ? 'border-blue-600 ring-2 ring-blue-200'
                                        : 'border-slate-200 dark:border-slate-700'
                                }`}
                            >
                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg`}
                                >
                                    <Icon size={26} />
                                </div>

                                <p className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-400">
                                    {card.title}
                                </p>

                                <h2 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">
                                    {card.value}
                                </h2>

                                <p className="mt-2 text-xs font-bold text-slate-400 dark:text-slate-500">
                                    {card.text}
                                </p>
                            </Link>
                        );
                    })}
                </section>

                             <ExpiryTable
                    title={
                        filter === 'expired'
                            ? 'Expired Products'
                            : filter === '30'
                            ? 'Expiring Within 30 Days'
                            : filter === '90'
                            ? 'Expiring Within 90 Days'
                            : filter === '180'
                            ? 'Expiring Within 6 Months'
                            : filter === 'no-expiry'
                            ? 'Products Without Expiry'
                            : 'Select a Category'
                    }
                    subtitle="Click any summary card above to filter products."
                    medicines={filteredMedicines}
                    color={filter === 'expired' ? 'red' : 'amber'}
                    emptyText="No products found."
                />
            </div>
        </AppLayout>
    );
}

function ExpiryTable({ title, subtitle, medicines, color, emptyText }) {
    const colorClass =
        color === 'red'
            ? 'text-red-600 bg-red-100'
            : 'text-amber-700 bg-amber-100';

    return (
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white shadow-sm dark:bg-slate-900 transition-colors">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 dark:border-slate-700 p-6 lg:flex-row lg:items-center">
                <div>
                    <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                        {title}
                    </h2>
                    <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                        {subtitle}
                    </p>
                </div>

                <span className={`rounded-full px-4 py-2 text-sm font-black ${colorClass}`}>
                    {medicines.length} Items
                </span>
            </div>

            {medicines.length === 0 ? (
                <div className="p-10 text-center">
                    <ShieldCheck className="mx-auto text-emerald-500" size={44} />
                    <h3 className="mt-4 text-xl font-black text-slate-950 dark:text-white">
                        Good News
                    </h3>
                    <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                        {emptyText}
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden">
                    <table className="w-full table-fixed">
                        <colgroup>
                            <col className="w-[34%]" />
                            <col className="w-[18%]" />
                            <col className="w-[18%]" />
                            <col className="w-[15%]" />
                            <col className="w-[15%]" />
                        </colgroup>

                        <thead className="bg-slate-50 dark:bg-slate-800/70">
                            <tr>
                                {['Product', 'SKU', 'Category', 'Expiry Date', 'Action'].map((head) => (
                                    <th
                                        key={head}
                                        className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                    >
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {medicines.map((medicine) => (
                                <tr
                                    key={medicine.id}
                                    className="transition hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800/60"
                                >
                                    <td className="px-4 py-5 align-top">
                                        <p className="line-clamp-2 text-sm font-black leading-5 text-slate-950 dark:text-white">
                                            {medicine.name}
                                        </p>
                                        <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                                            {medicine.medicine_type}
                                        </p>
                                    </td>

                                    <td className="px-4 py-5 align-top text-xs font-black text-slate-500 dark:text-slate-400">
                                        {medicine.sku}
                                    </td>

                                    <td className="px-4 py-5 align-top text-xs font-black text-slate-600 dark:text-slate-400">
                                        {medicine.category?.name || '-'}
                                    </td>

                                    <td className="px-4 py-5 align-top">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-2 text-[11px] font-black ${colorClass}`}
                                        >
                                            {formatDate(medicine.expiry_date)}
                                        </span>
                                    </td>

                                    <td className="px-4 py-5 align-top">
                                        <Link
                                            href={route('medicines.show', medicine.id)}
                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 dark:text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700"
                                        >
                                            <Eye size={14} />
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

function formatDate(date) {
    if (!date) return 'No Expiry';

    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}