import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FolderTree, Save } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('categories.store'));
    };

    return (
        <AppLayout title="Add Category">
            <Head title="Add Category | Pharmexa" />

            <div className="space-y-7">
                {/* Hero */}
                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition-colors">
                                <FolderTree size={16} />
                                Inventory / Add Category
                            </div>

                            <h1 className="text-4xl font-black lg:text-5xl">
                                Add Category
                            </h1>

                            <p className="mt-3 max-w-3xl font-medium text-white/90">
                                Create a new product category to organize your inventory.
                            </p>
                        </div>

                        <Link
                            href={route('categories.index')}
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-5 py-3 font-black text-white backdrop-blur transition hover:bg-white hover:text-blue-700 dark:bg-white dark:text-blue-300"
                        >
                            <ArrowLeft size={18} />
                            Back to Categories
                        </Link>
                    </div>
                </section>

                {/* Form */}
                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
                    <form
                        onSubmit={submit}
                        className="space-y-6"
                    >
                        <Input
                            label="Category Name *"
                            value={data.name}
                            error={errors.name}
                            onChange={(e) =>
                                setData('name', e.target.value)
                            }
                            placeholder="Pain Relief"
                        />

                        <div>
                            <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">
                                Description
                            </label>

                            <textarea
                                className="input"
                                rows="4"
                                value={data.description}
                                onChange={(e) =>
                                    setData(
                                        'description',
                                        e.target.value
                                    )
                                }
                                placeholder="Enter a short description for this product category..."
                            />

                            {errors.description && (
                                <p className="mt-2 text-sm font-bold text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700">
                            <Link
                                href={route(
                                    'categories.index'
                                )}
                                className="rounded-2xl border border-slate-200 px-7 py-4 font-black text-slate-600 dark:border-slate-700 dark:text-slate-400"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-emerald-500 px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 disabled:opacity-60"
                            >
                                <Save size={20} />

                                {processing
                                    ? 'Saving...'
                                    : 'Save Category'}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}

function Input({
    label,
    error,
    ...props
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">
                {label}
            </label>

            <input
                className="input"
                {...props}
            />

            {error && (
                <p className="mt-2 text-sm font-bold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}