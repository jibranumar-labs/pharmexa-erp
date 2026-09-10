import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FolderTree, Save } from 'lucide-react';

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        description: category.description || '',
        is_active: category.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('categories.update', category.id));
    };

    return (
        <AppLayout title="Edit Category">
            <Head title="Edit Category | Pharmexa" />

            <div className="space-y-7">
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition-colors">
                                <FolderTree size={16} />
                                Inventory / Edit Category
                            </div>

                            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
                                Edit Category
                            </h1>

                            <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-white/90">
                                Update category details and keep your product inventory organized.
                            </p>
                        </div>

                        <Link
                            href={route('categories.index')}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-5 py-3 font-black text-white backdrop-blur transition hover:bg-white dark:bg-white hover:text-blue-700 dark:text-blue-300"
                        >
                            <ArrowLeft size={18} />
                            Back to Categories
                        </Link>
                    </div>
                </section>

                <section className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 lg:p-8 transition-colors">
                    <form onSubmit={submit} className="space-y-7">
                        <div className="grid gap-5 lg:grid-cols-2">
                            <Input
                                label="Category Name *"
                                value={data.name}
                                error={errors.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Pain Relief"
                            />

                            <Select
                                label="Status"
                                value={data.is_active ? '1' : '0'}
                                error={errors.is_active}
                                onChange={(e) => setData('is_active', e.target.value === '1')}
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </Select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">
                                Description
                            </label>

                            <textarea
                                rows="5"
                                className="input"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Short category description..."
                            />

                            {errors.description && (
                                <p className="mt-2 text-sm font-bold text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 p-5 dark:bg-slate-800/60">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-lg">
                                    <FolderTree size={24} />
                                </div>

                                <div>
                                    <p className="font-black text-slate-900 dark:text-white">
                                        Editing: {category.name}
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Changes will update this category everywhere in Pharmexa, including product forms, inventory, purchases, sales and reports.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 dark:border-slate-700 pt-6 sm:flex-row sm:justify-end">
                            <Link
                                href={route('categories.index')}
                                className="rounded-2xl border border-slate-200 px-7 py-4 text-center font-black text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-emerald-500 px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl disabled:opacity-60"
                            >
                                <Save size={20} />
                                {processing ? 'Updating...' : 'Update Category'}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}

function Input({ label, error, ...props }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">
                {label}
            </label>

            <input className="input" {...props} />

            {error && (
                <p className="mt-2 text-sm font-bold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

function Select({ label, children, error, ...props }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">
                {label}
            </label>

            <select className="input" {...props}>
                {children}
            </select>

            {error && (
                <p className="mt-2 text-sm font-bold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}