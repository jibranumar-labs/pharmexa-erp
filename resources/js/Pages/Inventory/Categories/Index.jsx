import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { FolderTree, Plus, Edit, Trash2 } from 'lucide-react';

export default function Index({ categories }) {
    const rows = categories?.data ?? [];

    return (
        <AppLayout title="Categories">
            <Head title="Categories | Pharmexa" />

            <div className="space-y-7">
                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition-colors">
                                <FolderTree size={16} />
                                Inventory / Categories
                            </div>

                            <h1 className="text-4xl font-black lg:text-5xl">
                                Product Categories
                            </h1>

                            <p className="mt-3 max-w-3xl font-medium text-white/90">
                                Organize all products into clean and professional categories.
                            </p>
                        </div>

                        <Link
                            href={route('categories.create')}
                            className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-white px-6 py-4 font-black text-blue-700 dark:text-blue-300 shadow-xl transition hover:-translate-y-1"
                        >
                            <Plus size={20} />
                            Add Category
                        </Link>
                    </div>
                </section>

                <section className="overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white shadow-sm dark:bg-slate-900 transition-colors">
                    <div className="border-b border-slate-100 dark:border-slate-700 p-6">
                        <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                            Categories List
                        </h2>

                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                            Manage all product categories.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-slate-50 dark:bg-slate-800/70">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                                        Name
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                                        Description
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {rows.length ? (
                                    rows.map((category) => (
                                        <tr
                                            key={category.id}
                                            className="transition hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800/60"
                                        >
                                            <td className="px-6 py-5 font-black text-slate-950 dark:text-white">
                                                {category.name}
                                            </td>

                                            <td className="px-6 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">
                                                {category.description || '-'}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-black ${
                                                        category.is_active
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                                    }`}
                                                >
                                                    {category.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={route(
                                                            'categories.edit',
                                                            category.id
                                                        )}
                                                        className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600"
                                                    >
                                                        <Edit size={17} />
                                                    </Link>

                                                    <button className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600">
                                                        <Trash2 size={17} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-16 text-center"
                                        >
                                            <FolderTree
                                                className="mx-auto text-slate-400 dark:text-slate-500"
                                                size={42}
                                            />

                                            <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
                                                No categories found
                                            </h3>

                                            <Link
                                                href={route('categories.create')}
                                                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-emerald-500 px-5 py-3 font-black text-white"
                                            >
                                                <Plus size={18} />
                                                Add Category
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}