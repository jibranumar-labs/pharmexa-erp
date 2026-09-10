import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Eye,
    Pencil,
    Trash2,
    Plus,
    Search,
    Wallet,
    DollarSign,
    Calendar,
    Receipt,
    Tag,
} from 'lucide-react';

export default function Index({
    expenses,
    filters = {},
    stats = {},
}) {
    const [search, setSearch] = useState(filters.search || '');

    const searchExpenses = (e) => {
        e.preventDefault();

        router.get(
            route('expenses.index'),
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const destroyExpense = (expense) => {
        if (confirm(`Delete expense "${expense.title}" ?`)) {
            router.delete(route('expenses.destroy', expense.id));
        }
    };

    return (
        <AppLayout title="Expenses">
            <Head title="Expenses | Pharmexa" />

            <div className="space-y-7">

                <section className="rounded-[2rem] bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-500 p-8 text-white shadow-2xl">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black backdrop-blur transition-colors">

                                <Wallet size={16} />

                                Expense Management

                            </div>

                            <h1 className="mt-5 text-5xl font-black">
                                Expenses
                            </h1>

                            <p className="mt-3 max-w-3xl text-white/90 leading-7">
                                Manage pharmacy expenses and financial transactions.
                            </p>

                        </div>

                        <Link
                            href={route('expenses.create')}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-slate-900 px-7 py-4 font-black text-emerald-700 dark:text-emerald-300 shadow-xl transition hover:-translate-y-1"
                        >
                            <Plus size={20} />
                            Add Expense
                        </Link>

                    </div>

                </section>

                <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        title="Total Expenses"
                        value={stats.totalExpenses || 0}
                        color="emerald"
                        icon={Receipt}
                    />

                    <StatCard
                        title="This Month"
                        value={`${Number(stats.thisMonth || 0).toFixed(2)} SAR`}
                        color="blue"
                        icon={Calendar}
                    />

                    <StatCard
                        title="Total Amount"
                        value={`${Number(stats.totalAmount || 0).toFixed(2)} SAR`}
                        color="purple"
                        icon={DollarSign}
                    />

                    <StatCard
                        title="Records"
                        value={expenses.total || 0}
                        color="red"
                        icon={Wallet}
                    />

                </section>

                <section className="rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm transition-colors">

                    <div className="border-b border-slate-200 dark:border-slate-700 p-6">

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                            <div>

                                <h2 className="text-2xl font-black">
                                    Expense Records
                                </h2>

                                <p className="mt-1 text-slate-500 dark:text-slate-400">
                                    Search and manage all pharmacy expenses.
                                </p>

                            </div>

                            <form
                                onSubmit={searchExpenses}
                                className="flex gap-3"
                            >

                                <div className="relative">

                                    <Search
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                                    />

                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search expense..."
                                        className="w-72 rounded-xl border border-slate-300 dark:border-slate-700 py-3 pl-11 pr-4 font-medium outline-none focus:border-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                                    />

                                </div>

                                <button className="rounded-xl bg-emerald-700 px-6 font-black text-white">
                                    Search
                                </button>

                            </form>

                        </div>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200">

                                <tr>

                                    <th className="p-4 text-left">
                                        Number
                                    </th>

                                    <th className="p-4 text-left">
                                        Title
                                    </th>

                                    <th className="p-4 text-left">
                                        Category
                                    </th>

                                    <th className="p-4 text-left">
                                        Amount
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
                                {expenses.data.length > 0 ? (
    expenses.data.map((expense) => (
        <tr
            key={expense.id}
            className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition"
        >
            <td className="p-4 font-black text-emerald-700 dark:text-emerald-300">
                {expense.expense_number}
            </td>

            <td className="p-4">
                <p className="font-black text-slate-900 dark:text-white">
                    {expense.title}
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {expense.description || '-'}
                </p>
            </td>

            <td className="p-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/40 px-3 py-1 text-sm font-black text-blue-700 dark:text-blue-300">
                    <Tag size={14} />
                    {expense.category}
                </div>
            </td>

            <td className="p-4 font-black text-emerald-600 dark:text-emerald-400">
                {Number(expense.amount).toFixed(2)} SAR
            </td>

            <td className="p-4">
                {expense.expense_date}
            </td>

            <td className="p-4">
                <div className="flex justify-center gap-2">

                    <Link
                        href={route('expenses.show', expense.id)}
                        className="rounded-xl bg-blue-100 dark:bg-blue-900/40 p-3 text-blue-700 dark:text-blue-300 transition hover:bg-blue-600 hover:text-white"
                    >
                        <Eye size={18} />
                    </Link>

                    <Link
                        href={route('expenses.edit', expense.id)}
                        className="rounded-xl bg-amber-100 dark:bg-amber-900/40 p-3 text-amber-700 dark:text-amber-300 transition hover:bg-amber-500 hover:text-white"
                    >
                        <Pencil size={18} />
                    </Link>

                    <button
                        onClick={() => destroyExpense(expense)}
                        className="rounded-xl bg-red-100 dark:bg-red-900/40 p-3 text-red-700 dark:text-red-300 transition hover:bg-red-600 hover:text-white"
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
            colSpan="6"
            className="p-12 text-center"
        >
            <Wallet
                size={50}
                className="mx-auto text-slate-300 dark:text-slate-600"
            />

            <h3 className="mt-4 text-2xl font-black">
                No Expenses Found
            </h3>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
                Click "Add Expense" to create your first expense.
            </p>
        </td>
    </tr>
)}

</tbody>

</table>

</div>

<div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 p-6">

    <p className="font-bold text-slate-500 dark:text-slate-400">
        Showing {expenses.from || 0} to {expenses.to || 0}
        {' '}of{' '}
        {expenses.total}
    </p>

    <div className="flex gap-2">

        {expenses.links.map((link, index) => (
            <Link
                key={index}
                href={link.url || '#'}
                dangerouslySetInnerHTML={{
                    __html: link.label,
                }}
                className={`rounded-lg px-4 py-2 text-sm font-bold ${ link.active ? 'bg-emerald-700 text-white' : 'border' } ${ !link.url ? 'pointer-events-none opacity-50' : '' }`}
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
    color,
    icon: Icon,
}) {
    const colors = {
        blue: 'from-blue-600 to-cyan-500',
        emerald: 'from-emerald-600 to-teal-500',
        red: 'from-red-500 to-rose-500',
        purple: 'from-purple-600 to-indigo-500',
    };

    return (
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

            <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${colors[color]} text-white`}
            >
                <Icon size={26} />
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
                            