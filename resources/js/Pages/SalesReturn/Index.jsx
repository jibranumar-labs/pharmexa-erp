import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    RotateCcw,
    Plus,
    Eye,
    Trash2,
    DollarSign,
    Receipt,
    Calendar,
} from 'lucide-react';

export default function Index({
    returns,
    stats,
}) {

    const destroyReturn = (item) => {

        if (
            confirm(
                `Delete Return "${item.return_number}" ?`
            )
        ) {
            router.delete(
                route('sale-returns.destroy', item.id)
            );
        }
    };

    return (
        <AppLayout title="Sales Return">

            <Head title="Sales Return | Pharmexa" />

            <div className="space-y-7">

                <section className="rounded-[2rem] bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 p-8 text-white shadow-2xl">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black transition-colors">

                                <RotateCcw size={18} />

                                Sales Return

                            </div>

                            <h1 className="mt-5 text-5xl font-black">

                                Sales Returns

                            </h1>

                            <p className="mt-3 text-white/90">

                                Manage returned invoices and automatically restore stock.

                            </p>

                        </div>

                        <Link
                            href={route('sale-returns.create')}
                            className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-slate-900 px-7 py-4 font-black text-red-700 dark:text-red-300 shadow-xl transition-colors"
                        >

                            <Plus size={20} />

                            New Return

                        </Link>

                    </div>

                </section>

                <section className="grid gap-5 md:grid-cols-2">

                    <StatCard
                        title="Total Returns"
                        value={stats.totalReturns}
                        icon={Receipt}
                        color="red"
                    />

                    <StatCard
                        title="Refund Amount"
                        value={`${Number(stats.refundAmount).toFixed(2)} SAR`}
                        icon={DollarSign}
                        color="emerald"
                    />

                </section>

                <section className="rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm transition-colors">

                    <div className="border-b border-slate-200 dark:border-slate-700 p-6">

                        <h2 className="text-2xl font-black">

                            Sales Return History

                        </h2>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200">

                                <tr>

                                    <th className="p-4 text-left">
                                        Return No
                                    </th>

                                    <th className="p-4 text-left">
                                        Invoice
                                    </th>

                                    <th className="p-4 text-left">
                                        Refund
                                    </th>

                                    <th className="p-4 text-left">
                                        Date
                                    </th>

                                    <th className="p-4 text-center">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {returns.data.length > 0 ? (

                                    returns.data.map((item) => (

                                        <tr
                                            key={item.id}
                                            className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800"
                                        >

                                            <td className="p-4 font-black text-red-700 dark:text-red-300">

                                                {item.return_number}

                                            </td>

                                            <td className="p-4">

                                                {item.sale?.invoice_number}

                                            </td>

                                            <td className="p-4 font-black text-emerald-600 dark:text-emerald-400">

                                                {Number(item.refund_amount).toFixed(2)} SAR

                                            </td>

                                            <td className="p-4">

                                                {item.return_date}

                                            </td>

                                            <td className="p-4">

                                                <div className="flex justify-center gap-2">

                                                    <Link
                                                        href={route('sale-returns.show', item.id)}
                                                        className="rounded-xl bg-blue-100 dark:bg-blue-900/40 p-3 text-blue-700 dark:text-blue-300"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>

                                                    <button
                                                        onClick={() => destroyReturn(item)}
                                                        className="rounded-xl bg-red-100 dark:bg-red-900/40 p-3 text-red-700 dark:text-red-300"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                                                        ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="p-12 text-center"
                                        >

                                            <RotateCcw
                                                size={60}
                                                className="mx-auto text-slate-300 dark:text-slate-600"
                                            />

                                            <h3 className="mt-4 text-2xl font-black">
                                                No Sales Returns Found
                                            </h3>

                                            <p className="mt-2 text-slate-500 dark:text-slate-400">
                                                Click <strong>New Return</strong> to process your first sales return.
                                            </p>

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 p-6">

                        <p className="font-bold text-slate-500 dark:text-slate-400">

                            Showing {returns.from || 0} to {returns.to || 0}
                            {' '}of{' '}
                            {returns.total}

                        </p>

                        <div className="flex gap-2">

                            {returns.links.map((link, index) => (

                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                    className={`rounded-lg px-4 py-2 text-sm font-bold ${ link.active ? 'bg-red-700 text-white' : 'border' } ${ !link.url ? 'pointer-events-none opacity-50' : '' }`}
                                />

                            ))}

                        </div>

                    </div>

                </section>

            </div>

        </AppLayout>

    );
}

function StatCard({
    title,
    value,
    icon: Icon,
    color,
}) {

    const colors = {
        red: 'from-red-600 to-rose-500',
        emerald: 'from-emerald-600 to-teal-500',
        blue: 'from-blue-600 to-cyan-500',
        purple: 'from-purple-600 to-indigo-500',
    };

    return (

        <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

            <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${colors[color]} text-white`}
            >

                <Icon size={28} />

            </div>

            <p className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-400">
                {title}
            </p>

            <h2 className="mt-2 text-4xl font-black">
                {value}
            </h2>

        </div>

    );

}