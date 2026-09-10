import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Building2,
    CheckCircle2,
    Edit,
    Eye,
    Filter,
    Mail,
    Phone,
    Plus,
    Search,
    Trash2,
    UserRound,
    XCircle,
} from 'lucide-react';

export default function Index({ suppliers, stats, filters = {} }) {
    const rows = suppliers?.data ?? [];
    const [search, setSearch] = useState(filters.search || '');

    const applySearch = (e) => {
        e.preventDefault();

        router.get(
            route('suppliers.index'),
            { search },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const clearSearch = () => {
        setSearch('');
        router.get(route('suppliers.index'), {}, { preserveScroll: true });
    };

    const deleteSupplier = (supplier) => {
        if (confirm(`Delete "${supplier.name}"? This action cannot be undone.`)) {
            router.delete(route('suppliers.destroy', supplier.id), {
                preserveScroll: true,
            });
        }
    };

    const dashboardStats = [
        {
            label: 'Total Suppliers',
            value: stats?.total ?? 0,
            icon: Building2,
            color: 'from-blue-600 to-cyan-500',
        },
        {
            label: 'Active Suppliers',
            value: stats?.active ?? 0,
            icon: CheckCircle2,
            color: 'from-emerald-600 to-teal-500',
        },
        {
            label: 'Inactive Suppliers',
            value: stats?.inactive ?? 0,
            icon: XCircle,
            color: 'from-rose-500 to-red-500',
        },
    ];

    return (
        <AppLayout title="Suppliers">
            <Head title="Suppliers | Pharmexa" />

            <div className="space-y-7">
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition-colors">
                                <Building2 size={16} />
                                Purchase / Suppliers
                            </div>

                            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
                                Supplier Management
                            </h1>

                            <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-white/90">
                                Manage pharmacy suppliers, contact details, VAT numbers,
                                and purchase partners from one professional workspace.
                            </p>
                        </div>

                        <Link
                            href={route('suppliers.create')}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-white px-6 py-4 font-black text-blue-700 dark:text-blue-300 shadow-xl transition hover:-translate-y-1"
                        >
                            <Plus size={20} />
                            Add Supplier
                        </Link>
                    </div>
                </section>

                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {dashboardStats.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.label}
                                className="group rounded-[1.75rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-900"
                            >
                                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                                    <Icon size={26} />
                                </div>

                                <p className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-400">
                                    {item.label}
                                </p>

                                <h3 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">
                                    {item.value}
                                </h3>

                                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                    Updated live
                                </p>
                            </div>
                        );
                    })}
                </section>

                <section className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-5 shadow-sm dark:bg-slate-900 transition-colors">
                    <form onSubmit={applySearch} className="grid gap-4 lg:grid-cols-12">
                        <div className="relative lg:col-span-6">
                            <Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input pl-12"
                                placeholder="Search supplier name, phone, email or VAT..."
                            />
                        </div>

                        <button type="submit" className="btn-primary lg:col-span-3">
                            <span className="flex items-center justify-center gap-2">
                                <Filter size={18} />
                                Search
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={clearSearch}
                            className="rounded-xl border border-slate-200 px-5 py-3 font-black text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-800 lg:col-span-3"
                        >
                            Clear
                        </button>
                    </form>
                </section>

                <section className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white shadow-sm dark:bg-slate-900 transition-colors">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 dark:border-slate-700 p-6 lg:flex-row lg:items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                                Suppliers List
                            </h2>
                            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                Showing {suppliers?.from ?? 0}–{suppliers?.to ?? 0} of {suppliers?.total ?? 0} suppliers.
                            </p>
                        </div>

                        <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 dark:bg-slate-800">
                            Page {suppliers?.current_page ?? 1} of {suppliers?.last_page ?? 1}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-slate-50 dark:bg-slate-800/70">
                                <tr>
                                    {['Supplier', 'Contact', 'Phone', 'Email', 'VAT', 'Status', 'Actions'].map((head) => (
                                        <th
                                            key={head}
                                            className="px-5 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                        >
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {rows.length ? (
                                    rows.map((supplier) => (
                                        <SupplierRow
                                            key={supplier.id}
                                            supplier={supplier}
                                            onDelete={deleteSupplier}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-16 text-center">
                                            <Building2 className="mx-auto text-slate-400 dark:text-slate-500" size={42} />
                                            <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
                                                No suppliers found
                                            </h3>
                                            <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                                                Add your first supplier to start purchase management.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-700 p-5 lg:flex-row lg:items-center lg:justify-between">
                        <p className="text-center text-sm font-bold text-slate-500 dark:text-slate-400 lg:text-left">
                            Showing {suppliers?.from ?? 0}–{suppliers?.to ?? 0} of {suppliers?.total ?? 0}
                        </p>

                        <div className="flex items-center justify-center gap-3">
                            {suppliers?.prev_page_url ? (
                                <Link
                                    href={suppliers.prev_page_url}
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
                                {suppliers?.current_page ?? 1} / {suppliers?.last_page ?? 1}
                            </span>

                            {suppliers?.next_page_url ? (
                                <Link
                                    href={suppliers.next_page_url}
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

function SupplierRow({ supplier, onDelete }) {
    return (
        <tr className="transition hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800/60">
            <td className="px-5 py-5 align-top">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        <Building2 size={20} />
                    </div>

                    <div>
                        <p className="line-clamp-2 font-black text-slate-950 dark:text-white">
                            {supplier.name}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-400 dark:text-slate-500">
                            Supplier ID: #{supplier.id}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-5 py-5 align-top">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <UserRound size={15} className="text-slate-400 dark:text-slate-500" />
                    {supplier.contact_person || '-'}
                </div>
            </td>

            <td className="px-5 py-5 align-top">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <Phone size={15} className="text-slate-400 dark:text-slate-500" />
                    {supplier.phone || '-'}
                </div>
            </td>

            <td className="px-5 py-5 align-top">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <Mail size={15} className="text-slate-400 dark:text-slate-500" />
                    <span className="max-w-[180px] truncate">{supplier.email || '-'}</span>
                </div>
            </td>

            <td className="px-5 py-5 align-top text-sm font-black text-slate-500 dark:text-slate-400">
                {supplier.vat_number || '-'}
            </td>

            <td className="px-5 py-5 align-top">
                <span className={`inline-flex rounded-full px-3 py-2 text-[11px] font-black ${ supplier.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' }`}>
                    {supplier.is_active ? 'Active' : 'Inactive'}
                </span>
            </td>

            <td className="px-5 py-5 align-top">
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href={route('suppliers.show', supplier.id)}
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 dark:text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700"
                    >
                        <Eye size={15} />
                    </Link>

                    <Link
                        href={route('suppliers.edit', supplier.id)}
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 dark:text-slate-400 transition hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:border-slate-700"
                    >
                        <Edit size={15} />
                    </Link>

                    <button
                        onClick={() => onDelete(supplier)}
                        className="rounded-xl border border-red-200 p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700 dark:text-red-300 dark:border-red-900/50"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </td>
        </tr>
    );
}