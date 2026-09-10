import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Barcode,
    Boxes,
    Building2,
    Edit,
    Eye,
    Filter,
    Globe2,
    Package,
    Pill,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';

export default function Index({
    medicines,
    stats,
    filters = {},
}) {
    const rows = medicines?.data ?? [];

    const [search, setSearch] = useState(
        filters.search || ''
    );

    /*
    |--------------------------------------------------------------------------
    | Search Global Catalogue
    |--------------------------------------------------------------------------
    */

    const applySearch = (e) => {
        e.preventDefault();

        router.get(
            route('platform.medicines.index'),
            {
                search,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Clear Search
    |--------------------------------------------------------------------------
    */

    const clearSearch = () => {
        setSearch('');

        router.get(
            route('platform.medicines.index'),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Delete Global Product
    |--------------------------------------------------------------------------
    */

    const deleteMedicine = (medicine) => {
        const confirmed = confirm(
            `Delete global product "${medicine.name}"?\n\n` +
            'This product will be removed from the master catalogue.'
        );

        if (! confirmed) {
            return;
        }

        router.delete(
            route(
                'platform.medicines.destroy',
                medicine.id
            ),
            {
                preserveScroll: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Dashboard Statistics
    |--------------------------------------------------------------------------
    */

    const dashboardStats = [
        {
            label: 'Global Products',
            value: stats?.total ?? 0,
            icon: Globe2,
            color: 'from-blue-600 to-cyan-500',
            note: 'Master catalogue',
        },
        {
            label: 'Active Products',
            value: stats?.active ?? 0,
            icon: Boxes,
            color: 'from-emerald-600 to-teal-500',
            note: 'Available globally',
        },
        {
            label: 'Inactive Products',
            value: stats?.inactive ?? 0,
            icon: Package,
            color: 'from-amber-500 to-orange-500',
            note: 'Currently inactive',
        },
        {
            label: 'Pharmacies',
            value: stats?.pharmacies ?? 0,
            icon: Building2,
            color: 'from-violet-600 to-purple-500',
            note: 'Connected pharmacies',
        },
    ];

    return (
        <AppLayout title="Global Catalogue">
            <Head title="Global Catalogue | Pharmexa" />

            <div className="space-y-7">

                {/* Hero */}

                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">

                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

                        <div>

                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
                                <Globe2 size={16} />
                                Platform / Global Catalogue
                            </div>

                            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
                                Global Product Catalogue
                            </h1>

                            <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-white/90">
                                Manage Pharmexa&apos;s master product catalogue.
                                Global products are automatically made available
                                to every pharmacy while each pharmacy keeps its
                                own stock, pricing, barcode and local
                                customisations.
                            </p>

                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">

                            <Link
                                href={route(
                                    'platform.medicines.create'
                                )}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-blue-700 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
                            >
                                <Plus size={20} />
                                Add Global Product
                            </Link>

                        </div>

                    </div>

                </section>

                {/* Statistics */}

                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                    {dashboardStats.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.label}
                                className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                            >

                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg transition group-hover:scale-110`}
                                >
                                    <Icon size={26} />
                                </div>

                                <p className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-400">
                                    {item.label}
                                </p>

                                <h3 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">
                                    {item.value}
                                </h3>

                                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                    {item.note}
                                </p>

                            </div>
                        );
                    })}

                </section>

                {/* Search */}

                <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">

                    <form
                        onSubmit={applySearch}
                        className="grid gap-4 lg:grid-cols-12"
                    >

                        <div className="relative lg:col-span-6">

                            <Search
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                            />

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="input pl-12"
                                placeholder="Search global products by name, barcode or SKU..."
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn-primary lg:col-span-3"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <Filter size={18} />
                                Search
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={clearSearch}
                            className="rounded-xl border border-slate-200 px-5 py-3 font-black text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                            Clear
                        </button>

                    </form>

                </section>
                                {/* Global Products Table */}

                <section className="rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">

                    {/* Table Header */}

                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 dark:border-slate-700 lg:flex-row lg:items-center">

                        <div>
                            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                                Global Products
                            </h2>

                            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                Showing {medicines?.from ?? 0}–
                                {medicines?.to ?? 0} of{' '}
                                {medicines?.total ?? 0} master products.
                            </p>
                        </div>

                        <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            Page {medicines?.current_page ?? 1} of{' '}
                            {medicines?.last_page ?? 1}
                        </div>

                    </div>

                    {/* Table */}

                    <div className="overflow-x-auto">

                        <table className="w-full table-fixed">

                            <colgroup>
                                <col className="w-[14%]" />
                                <col className="w-[25%]" />
                                <col className="w-[14%]" />
                                <col className="w-[12%]" />
                                <col className="w-[15%]" />
                                <col className="w-[10%]" />
                                <col className="w-[10%]" />
                            </colgroup>

                            <thead className="bg-slate-50 dark:bg-slate-800/70">

                                <tr>
                                    {[
                                        'Barcode',
                                        'Product',
                                        'Category',
                                        'Type',
                                        'Master Price',
                                        'Status',
                                        'Actions',
                                    ].map((head) => (
                                        <th
                                            key={head}
                                            className="px-3 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 lg:px-4"
                                        >
                                            {head}
                                        </th>
                                    ))}
                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">

                                {rows.length ? (
                                    rows.map((medicine) => (
                                        <GlobalMedicineRow
                                            key={medicine.id}
                                            medicine={medicine}
                                            onDelete={
                                                deleteMedicine
                                            }
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-16 text-center"
                                        >
                                            <Package
                                                className="mx-auto text-slate-400 dark:text-slate-500"
                                                size={42}
                                            />

                                            <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
                                                No global products found
                                            </h3>

                                            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500 dark:text-slate-400">
                                                No products match your
                                                current search, or the
                                                global catalogue is empty.
                                            </p>

                                            <Link
                                                href={route(
                                                    'platform.medicines.create'
                                                )}
                                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5"
                                            >
                                                <Plus size={17} />
                                                Add Global Product
                                            </Link>
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* Pagination */}

                    <div className="flex flex-col gap-4 border-t border-slate-100 p-5 dark:border-slate-700 lg:flex-row lg:items-center lg:justify-between">

                        <p className="text-center text-sm font-bold text-slate-500 dark:text-slate-400 lg:text-left">
                            Showing {medicines?.from ?? 0}–
                            {medicines?.to ?? 0} of{' '}
                            {medicines?.total ?? 0} products
                        </p>

                        <div className="flex items-center justify-center gap-3">

                            {medicines?.prev_page_url ? (
                                <Link
                                    href={
                                        medicines.prev_page_url
                                    }
                                    preserveScroll
                                    preserveState
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                                >
                                    Previous
                                </Link>
                            ) : (
                                <span className="rounded-xl border border-slate-100 px-4 py-2 text-sm font-black text-slate-300 dark:border-slate-700 dark:text-slate-600">
                                    Previous
                                </span>
                            )}

                            <span className="rounded-xl bg-gradient-to-r from-blue-700 to-emerald-500 px-4 py-2 text-sm font-black text-white shadow-lg">
                                {medicines?.current_page ?? 1} /{' '}
                                {medicines?.last_page ?? 1}
                            </span>

                            {medicines?.next_page_url ? (
                                <Link
                                    href={
                                        medicines.next_page_url
                                    }
                                    preserveScroll
                                    preserveState
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                                >
                                    Next
                                </Link>
                            ) : (
                                <span className="rounded-xl border border-slate-100 px-4 py-2 text-sm font-black text-slate-300 dark:border-slate-700 dark:text-slate-600">
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
function GlobalMedicineRow({ medicine, onDelete }) {
    return (
        <tr className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">

            {/* Barcode / SKU */}

            <td className="px-3 py-5 align-top lg:px-4">
                <div className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                    <Barcode
                        size={15}
                        className="shrink-0 text-slate-400 dark:text-slate-500"
                    />

                    <span className="truncate">
                        {medicine.barcode || '-'}
                    </span>
                </div>

                <p className="mt-1 break-words text-[11px] font-black leading-4 text-slate-400 dark:text-slate-500">
                    SKU: {medicine.sku || '-'}
                </p>
            </td>

            {/* Product */}

            <td className="px-3 py-5 align-top lg:px-4">
                <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-emerald-100 text-blue-700 dark:from-blue-950 dark:to-emerald-950 dark:text-blue-300">
                        <Pill size={18} />
                    </div>

                    <div className="min-w-0">

                        <p className="line-clamp-2 text-sm font-black leading-5 text-slate-950 dark:text-white">
                            {medicine.name}
                        </p>

                        <p className="mt-1 truncate text-xs font-bold text-slate-500 dark:text-slate-400">
                            {medicine.generic_name ||
                                medicine.brand_name ||
                                'No generic / brand'}
                        </p>

                        {medicine.manufacturer?.name && (
                            <p className="mt-1 truncate text-[11px] font-bold text-slate-400 dark:text-slate-500">
                                {medicine.manufacturer.name}
                            </p>
                        )}

                    </div>

                </div>
            </td>

            {/* Category */}

            <td className="px-3 py-5 align-top lg:px-4">
                <span className="inline-flex max-w-full rounded-full bg-blue-50 px-3 py-2 text-[11px] font-black text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    <span className="truncate">
                        {medicine.category?.name || 'Uncategorised'}
                    </span>
                </span>
            </td>

            {/* Medicine Type */}

            <td className="px-3 py-5 align-top lg:px-4">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-[11px] font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {medicine.medicine_type || '-'}
                </span>
            </td>

            {/* Master Price */}

            <td className="px-3 py-5 align-top lg:px-4">

                <p className="text-sm font-black leading-5 text-slate-900 dark:text-white">
                    {formatMoney(medicine.selling_price)} SAR
                </p>

                <p className="mt-1 text-[11px] font-black text-slate-400 dark:text-slate-500">
                    Cost: {formatMoney(medicine.purchase_price)} SAR
                </p>

                {Number(medicine.tax_percentage || 0) > 0 && (
                    <p className="mt-1 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                        Tax: {medicine.tax_percentage}%
                    </p>
                )}

            </td>

            {/* Status */}

            <td className="px-3 py-5 align-top lg:px-4">

                <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-black ${
                        medicine.is_active
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                >
                    <span
                        className={`h-2 w-2 rounded-full ${
                            medicine.is_active
                                ? 'bg-emerald-500'
                                : 'bg-slate-400'
                        }`}
                    />

                    {medicine.is_active
                        ? 'Active'
                        : 'Inactive'}
                </span>

            </td>

            {/* Actions */}

            <td className="px-3 py-5 align-top lg:px-4">

                <div className="flex flex-wrap items-center gap-2">

                    {/* View */}

                    <Link
                        href={route(
                            'platform.medicines.show',
                            medicine.id
                        )}
                        title="View Global Product"
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-900 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
                    >
                        <Eye size={15} />
                    </Link>

                    {/* Edit */}

                    <Link
                        href={route(
                            'platform.medicines.edit',
                            medicine.id
                        )}
                        title="Edit Global Product"
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
                    >
                        <Edit size={15} />
                    </Link>

                    {/* Delete */}

                    <button
                        type="button"
                        onClick={() =>
                            onDelete(medicine)
                        }
                        title="Delete Global Product"
                        className="rounded-xl border border-red-200 p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/30"
                    >
                        <Trash2 size={15} />
                    </button>

                </div>

            </td>

        </tr>
    );
}

/*
|--------------------------------------------------------------------------
| Money Formatter
|--------------------------------------------------------------------------
*/

function formatMoney(value) {
    const amount = Number(value ?? 0);

    if (Number.isNaN(amount)) {
        return '0.00';
    }

    return amount.toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}