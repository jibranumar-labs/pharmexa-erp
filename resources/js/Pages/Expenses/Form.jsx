import { useForm } from '@inertiajs/react';

export default function Form({
    expense = null,
    submitLabel = 'Save Expense',
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        category: expense?.category || '',
        title: expense?.title || '',
        description: expense?.description || '',
        amount: expense?.amount || '',
        expense_date: expense?.expense_date || '',
    });

    const submit = (e) => {
        e.preventDefault();

        if (expense) {
            put(route('expenses.update', expense.id));
        } else {
            post(route('expenses.store'));
        }
    };

    const categories = [
        'Rent',
        'Electricity',
        'Internet',
        'Salary',
        'Transport',
        'Maintenance',
        'Office',
        'Tax',
        'Miscellaneous',
    ];

    return (
        <form onSubmit={submit} className="space-y-6">

            <div className="grid gap-6 md:grid-cols-2">

                <div>
                    <label className="mb-2 block font-bold text-slate-900 dark:text-white">
                        Category
                    </label>

                    <select
                        value={data.category}
                        onChange={(e) =>
                            setData('category', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                    >
                        <option value="">
                            Select Category
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>

                    {errors.category && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.category}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block font-bold text-slate-900 dark:text-white">
                        Amount
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        value={data.amount}
                        onChange={(e) =>
                            setData('amount', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                    />

                    {errors.amount && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.amount}
                        </p>
                    )}
                </div>

                <div className="md:col-span-2">

                    <label className="mb-2 block font-bold text-slate-900 dark:text-white">
                        Title
                    </label>

                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) =>
                            setData('title', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                    />

                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.title}
                        </p>
                    )}

                </div>
                                <div className="md:col-span-2">

                    <label className="mb-2 block font-bold text-slate-900 dark:text-white">
                        Description
                    </label>

                    <textarea
                        rows={4}
                        value={data.description}
                        onChange={(e) =>
                            setData('description', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                    />

                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.description}
                        </p>
                    )}

                </div>

                <div>

                    <label className="mb-2 block font-bold text-slate-900 dark:text-white">
                        Expense Date
                    </label>

                    <input
                        type="date"
                        value={data.expense_date}
                        onChange={(e) =>
                            setData('expense_date', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                    />

                    {errors.expense_date && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.expense_date}
                        </p>
                    )}

                </div>

            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 pt-6">

                <button
                    type="button"
                    onClick={() => history.back()}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 font-bold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-xl bg-emerald-700 px-8 py-3 font-black text-white disabled:opacity-50"
                >
                    {processing ? 'Saving...' : submitLabel}
                </button>

            </div>

        </form>
    );
}