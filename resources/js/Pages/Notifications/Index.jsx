import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import {
    Bell,
    AlertTriangle,
    PackageX,
    Clock3,
    ShieldAlert,
} from 'lucide-react';

export default function Index({
    stats = {},
    expired = [],
    expiringSoon = [],
    lowStock = [],
    outOfStock = [],
}) {
    const cards = [
        {
            title: 'Expired Products',
            value: stats.expired || 0,
            color: 'bg-red-50 text-red-600',
            icon: ShieldAlert,
        },
        {
            title: 'Expiring Soon',
            value: stats.expiringSoon || 0,
            color: 'bg-yellow-50 text-yellow-600',
            icon: Clock3,
        },
        {
            title: 'Low Stock',
            value: stats.lowStock || 0,
            color: 'bg-orange-50 text-orange-600',
            icon: AlertTriangle,
        },
        {
            title: 'Out of Stock',
            value: stats.outOfStock || 0,
            color: 'bg-slate-100 text-slate-700',
            icon: PackageX,
        },
    ];

    return (
        <AppLayout title="Notifications">
            <Head title="Notifications | Pharmexa" />

            <div className="space-y-8">
                <section className="rounded-[2rem] bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3">
                        <Bell size={34} />
                        <h1 className="text-4xl font-black">
                            Notifications Center
                        </h1>
                    </div>

                    <p className="mt-3 max-w-3xl text-lg text-white/90">
                        Monitor expired products, stock alerts and important pharmacy notifications.
                    </p>
                </section>

                <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className="group rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
                            >
                                <div className={`flex h-16 w-16 items-center justify-center rounded-3xl ${card.color} transition group-hover:scale-110`}>
                                    <Icon size={30} />
                                </div>

                                <h2 className="mt-5 text-xl font-black text-slate-900 dark:text-white">
                                    {card.title}
                                </h2>

                                <p className="mt-3 text-5xl font-black text-slate-950 dark:text-white">
                                    {card.value}
                                </p>
                            </div>
                        );
                    })}
                </section>

                <NotificationTable title="Expired Products" data={expired} />
                <NotificationTable title="Expiring Soon" data={expiringSoon} />
                <NotificationTable title="Low Stock Products" data={lowStock} />
                <NotificationTable title="Out of Stock Products" data={outOfStock} />
            </div>
        </AppLayout>
    );
}

function NotificationTable({ title, data = [] }) {
    return (
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
            <h2 className="mb-5 text-2xl font-black text-slate-900 dark:text-white">
                {title}
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                            <th className="w-[42%] px-4 py-4 text-left text-sm font-black text-slate-600 dark:text-slate-400">
                                Product
                            </th>
                            <th className="w-[22%] px-4 py-4 text-left text-sm font-black text-slate-600 dark:text-slate-400">
                                SKU
                            </th>
                            <th className="w-[16%] px-4 py-4 text-left text-sm font-black text-slate-600 dark:text-slate-400">
                                Stock
                            </th>
                            <th className="w-[20%] px-4 py-4 text-left text-sm font-black text-slate-600 dark:text-slate-400">
                                Expiry
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-4 py-10 text-center font-bold text-slate-500 dark:text-slate-400"
                                >
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            data.map((medicine) => (
                                <tr
                                    key={medicine.id}
                                    className="border-b border-slate-100 dark:border-slate-700 transition hover:bg-blue-50"
                                >
                                    <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">
                                        {medicine.name}
                                    </td>

                                    <td className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-400">
                                        {medicine.sku || '-'}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-black text-red-600">
                                            {medicine.stock_quantity ?? 0}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-400">
                                        {medicine.expiry_date
                                            ? new Date(medicine.expiry_date).toLocaleDateString('en-GB', {
                                                  day: '2-digit',
                                                  month: 'short',
                                                  year: 'numeric',
                                              })
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