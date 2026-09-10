import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Receipt,
    Calendar,
    DollarSign,
    Tag,
    FileText,
    User,
    ArrowLeft,
    Pencil,
} from 'lucide-react';

export default function Show({ expense }) {
    return (
        <AppLayout title="Expense Details">
            <Head title="Expense Details | Pharmexa" />

            <div className="space-y-7">

                <section className="rounded-[2rem] bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-500 p-8 text-white shadow-2xl">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black transition-colors">

                                <Receipt size={16} />

                                Expense Details

                            </div>

                            <h1 className="mt-5 text-5xl font-black">
                                {expense.title}
                            </h1>

                            <p className="mt-2 text-white/90">
                                Expense Number: {expense.expense_number}
                            </p>

                        </div>

                        <div className="flex gap-3">

                            <Link
                                href={route('expenses.index')}
                                className="rounded-xl bg-white dark:bg-slate-900 px-6 py-3 font-black text-slate-700 dark:text-slate-200 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <ArrowLeft size={18} />
                                    Back
                                </div>
                            </Link>

                            <Link
                                href={route('expenses.edit', expense.id)}
                                className="rounded-xl bg-yellow-400 px-6 py-3 font-black text-black"
                            >
                                <div className="flex items-center gap-2">
                                    <Pencil size={18} />
                                    Edit
                                </div>
                            </Link>

                        </div>

                    </div>

                </section>

                <section className="grid gap-6 md:grid-cols-2">

                    <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm transition-colors">

                        <h2 className="mb-6 text-2xl font-black">
                            Expense Information
                        </h2>

                        <Info
                            icon={Receipt}
                            title="Expense Number"
                            value={expense.expense_number}
                        />

                        <Info
                            icon={Tag}
                            title="Category"
                            value={expense.category}
                        />

                        <Info
                            icon={DollarSign}
                            title="Amount"
                            value={`${Number(expense.amount).toFixed(2)} SAR`}
                        />

                        <Info
                            icon={Calendar}
                            title="Expense Date"
                            value={expense.expense_date}
                        />

                        <Info
                            icon={User}
                            title="Created By"
                            value={expense.user?.name || '-'}
                        />

                    </div>

                    <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm transition-colors">

                        <h2 className="mb-6 text-2xl font-black">
                            Description
                        </h2>

                        <div className="flex items-start gap-3">

                            <FileText
                                className="mt-1 text-slate-500 dark:text-slate-400"
                                size={22}
                            />

                            <p className="leading-7 text-slate-700 dark:text-slate-200">
                                {expense.description || 'No description available.'}
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </AppLayout>
    );
}

function Info({
    icon: Icon,
    title,
    value,
}) {
    return (
        <div className="mb-5 flex items-start gap-4 rounded-xl border p-4">

            <div className="rounded-xl bg-emerald-100 dark:bg-emerald-900/40 p-3 text-emerald-700 dark:text-emerald-300">
                <Icon size={20} />
            </div>

            <div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    {title}
                </p>

                <h3 className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                    {value}
                </h3>
            </div>

        </div>
    );
}