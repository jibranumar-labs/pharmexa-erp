import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ClipboardList,
    Eye,
    RefreshCcw,
} from 'lucide-react';

export default function StockHistory({ movements }) {
    const rows = movements?.data ?? [];

    return (
        <AppLayout title="Stock History">
            <Head title="Stock History | Pharmexa" />

            <div className="space-y-7">
                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur transition-colors">
                            <ClipboardList size={16} />
                            Inventory / Stock History
                        </div>

                        <h1 className="text-4xl font-black lg:text-5xl">
                            Stock History
                        </h1>

                        <p className="mt-3 max-w-3xl font-medium text-white/90">
                            Complete audit log of product stock in, stock out, and stock adjustments.
                        </p>
                    </div>
                </section>

                <section className="overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white shadow-sm dark:bg-slate-900 transition-colors">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 dark:border-slate-700 p-6 lg:flex-row lg:items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                                Movement Records
                            </h2>
                            <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                                Showing {movements?.from ?? 0}–{movements?.to ?? 0} of {movements?.total ?? 0} records.
                            </p>
                        </div>

                        <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 dark:bg-slate-800">
                            Page {movements?.current_page ?? 1} of {movements?.last_page ?? 1}
                        </div>
                    </div>

                    <div className="overflow-hidden">
                        <table className="w-full table-fixed">
                            <colgroup>
                                <col className="w-[26%]" />
                                <col className="w-[13%]" />
                                <col className="w-[10%]" />
                                <col className="w-[10%]" />
                                <col className="w-[10%]" />
                                <col className="w-[13%]" />
                                <col className="w-[12%]" />
                                <col className="w-[6%]" />
                            </colgroup>

                            <thead className="bg-slate-50 dark:bg-slate-800/70">
                                <tr>
                                    {[
                                        'Product',
                                        'Type',
                                        'Qty',
                                        'Before',
                                        'After',
                                        'User',
                                        'Date',
                                        'View',
                                    ].map((head) => (
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
                                {rows.length ? (
                                    rows.map((movement) => (
                                        <MovementRow key={movement.id} movement={movement} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-16 text-center">
                                            <ClipboardList
                                                className="mx-auto text-slate-400 dark:text-slate-500"
                                                size={42}
                                            />
                                            <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
                                                No stock movements yet
                                            </h3>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                                       <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-700 p-5 lg:flex-row lg:items-center lg:justify-between">
                        <p className="text-center text-sm font-bold text-slate-500 dark:text-slate-400 lg:text-left">
                            Showing {movements?.from ?? 0}–{movements?.to ?? 0} of {movements?.total ?? 0}
                        </p>

                        <div className="flex items-center justify-center gap-3">
                            {movements?.prev_page_url ? (
                                <Link
                                    href={movements.prev_page_url}
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
                                {movements?.current_page ?? 1} / {movements?.last_page ?? 1}
                            </span>

                            {movements?.next_page_url ? (
                                <Link
                                    href={movements.next_page_url}
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

function MovementRow({ movement }) {
    const type = movement.type;

    const typeStyles = {
        in: {
            label: 'Stock In',
            className: 'bg-emerald-100 text-emerald-700',
            icon: ArrowUp,
        },
        out: {
            label: 'Stock Out',
            className: 'bg-red-100 text-red-700',
            icon: ArrowDown,
        },
        adjustment: {
            label: 'Stock Adjustment',
            className: 'bg-blue-100 text-blue-700',
            icon: RefreshCcw,
        },
    };

    const style = typeStyles[type] || typeStyles.adjustment;
    const Icon = style.icon;

    return (
        <tr className="transition hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800/60">
            <td className="px-4 py-5 align-top">
                <p className="line-clamp-2 text-sm font-black leading-5 text-slate-950 dark:text-white">
                    {movement.medicine?.name || '-'}
                </p>
                <p className="mt-1 text-xs font-bold text-slate-400 dark:text-slate-500">
                    {movement.medicine?.sku || '-'}
                </p>
            </td>

            <td className="px-4 py-5 align-top">
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-[11px] font-black ${style.className}`}>
                    <Icon size={13} />
                    {style.label}
                </span>
            </td>

            <td className="px-4 py-5 align-top text-sm font-black text-slate-700 dark:text-slate-200">
                {movement.quantity}
            </td>

            <td className="px-4 py-5 align-top text-sm font-black text-slate-500 dark:text-slate-400">
                {movement.stock_before}
            </td>

            <td className="px-4 py-5 align-top text-sm font-black text-slate-950 dark:text-white">
                {movement.stock_after}
            </td>

            <td className="px-4 py-5 align-top text-xs font-black text-slate-500 dark:text-slate-400">
                {movement.user?.name || 'System'}
            </td>

            <td className="px-4 py-5 align-top text-xs font-black text-slate-500 dark:text-slate-400">
                {formatDateTime(movement.created_at)}
            </td>

            <td className="px-4 py-5 align-top">
                {movement.medicine?.id && (
                    <Link
                        href={route('medicines.show', movement.medicine.id)}
                        className="inline-flex rounded-xl border border-slate-200 p-2 text-slate-500 dark:text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700"
                    >
                        <Eye size={15} />
                    </Link>
                )}
            </td>
        </tr>
    );
}

function formatDateTime(date) {
    if (!date) return '-';

    return new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}