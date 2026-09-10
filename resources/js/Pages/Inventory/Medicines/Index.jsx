import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import {
    AlertTriangle,
    Barcode,
    Boxes,
    CalendarClock,
    Edit,
    Eye,
    Filter,
    Package,
    Pill,
    Plus,
    Printer,
    Search,
    Trash2,
    X,
} from 'lucide-react';

export default function Index({ medicines, stats, filters = {} }) {
    const rows = medicines?.data ?? [];

    const [search, setSearch] = useState(filters.search || '');

    /*
    |--------------------------------------------------------------------------
    | Barcode Label Modal
    |--------------------------------------------------------------------------
    */

    const [labelMedicine, setLabelMedicine] = useState(null);

    const openLabel = (medicine) => {
        setLabelMedicine(medicine);
    };

    const closeLabel = () => {
        setLabelMedicine(null);
    };

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const applySearch = (e) => {
        e.preventDefault();

        router.get(
            route('medicines.index'),
            {
                search,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const clearSearch = () => {
        setSearch('');

        router.get(
            route('medicines.index'),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const deleteMedicine = (medicine) => {
        if (
            confirm(
                `Delete "${medicine.name}"? This action cannot be undone.`
            )
        ) {
            router.delete(route('medicines.destroy', medicine.id), {
                preserveScroll: true,
            });
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Dashboard Statistics
    |--------------------------------------------------------------------------
    */

    const dashboardStats = [
        {
            label: 'Total Products',
            value: stats?.total ?? 0,
            icon: Pill,
            color: 'from-blue-600 to-cyan-500',
        },
        {
            label: 'Active Products',
            value: stats?.active ?? 0,
            icon: Boxes,
            color: 'from-emerald-600 to-teal-500',
        },
        {
            label: 'Low Stock',
            value: stats?.low_stock ?? 0,
            icon: AlertTriangle,
            color: 'from-amber-500 to-orange-500',
        },
        {
            label: 'Expiring Soon',
            value: stats?.expiring ?? 0,
            icon: CalendarClock,
            color: 'from-rose-500 to-red-500',
        },
    ];

    return (
        <>
            <AppLayout title="Products">
                <Head title="Products | Pharmexa" />

                <div className="space-y-7">
                    {/* =========================================================
                        HERO
                    ========================================================== */}

                    <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                            <div>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition-colors">
                                    <Package size={16} />
                                    Inventory / Products
                                </div>

                                <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
                                    Product Management
                                </h1>

                                <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-white/90">
                                    Manage products, barcode, stock, expiry
                                    dates, pricing, categories and suppliers
                                    from one premium workspace.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={route('medicines.import')}
                                    className="inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/15 px-6 py-4 font-black text-white backdrop-blur transition hover:bg-white hover:text-blue-700"
                                >
                                    Import
                                </Link>

                                <Link
                                    href={route('medicines.create')}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-blue-700 shadow-xl transition hover:-translate-y-1 dark:bg-slate-900 dark:text-blue-300"
                                >
                                    <Plus size={20} />
                                    Add Product
                                </Link>

                                <Link
                                    href={route('medicines.scan')}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/15 px-6 py-4 font-black text-white backdrop-blur"
                                >
                                    <Barcode size={20} />
                                    Scan Product
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* =========================================================
                        STATISTICS
                    ========================================================== */}

                    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {dashboardStats.map((item) => {
                            const Icon = item.icon;

                            const cardContent = (
                                <>
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
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
                                        Updated live
                                    </p>
                                </>
                            );

                            if (item.label === 'Low Stock') {
                                return (
                                    <Link
                                        key={item.label}
                                        href={route('medicines.index', { low_stock: 1 })}
                                        className="group block rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                                    >
                                        {cardContent}
                                    </Link>
                                );
                            }

                            if (item.label === 'Expiring Soon') {
                                return (
                                    <Link
                                        key={item.label}
                                        href={route('medicines.expiry')}
                                        className="group block rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                                    >
                                        {cardContent}
                                    </Link>
                                );
                            }

                            return (
                                <div
                                    key={item.label}
                                    className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                                >
                                    {cardContent}
                                </div>
                            );
                        })}
                    </section>

                    {/* =========================================================
                        SEARCH
                    ========================================================== */}

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
                                    placeholder="Search by product name, barcode or SKU..."
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
                                className="rounded-xl border border-slate-200 px-5 py-3 font-black text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 lg:col-span-3"
                            >
                                Clear
                            </button>
                        </form>
                    </section>

                    {/* =========================================================
                        PRODUCTS
                    ========================================================== */}

                    <section className="rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
                        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 dark:border-slate-700 lg:flex-row lg:items-center">
                            <div>
                                <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                                    Products List
                                </h2>

                                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Showing {medicines?.from ?? 0}–
                                    {medicines?.to ?? 0} of{' '}
                                    {medicines?.total ?? 0} products.
                                </p>
                            </div>

                            <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                Page {medicines?.current_page ?? 1} of{' '}
                                {medicines?.last_page ?? 1}
                            </div>
                        </div>

                        <div className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1050px] table-fixed">
                                    <colgroup>
                                        <col className="w-[11%]" />
                                        <col className="w-[24%]" />
                                        <col className="w-[11%]" />
                                        <col className="w-[13%]" />
                                        <col className="w-[11%]" />
                                        <col className="w-[12%]" />
                                        <col className="w-[9%]" />
                                        <col className="w-[9%]" />
                                    </colgroup>

                                    <thead className="bg-slate-50 dark:bg-slate-800/70">
                                        <tr>
                                            {[
                                                'Barcode',
                                                'Product',
                                                'Category',
                                                'Stock',
                                                'Price',
                                                'Expiry',
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
                                                <MedicineRow
                                                    key={medicine.id}
                                                    medicine={medicine}
                                                    onDelete={deleteMedicine}
                                                    onPrint={openLabel}
                                                />
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="8"
                                                    className="px-6 py-16 text-center"
                                                >
                                                    <Package
                                                        className="mx-auto text-slate-400 dark:text-slate-500"
                                                        size={42}
                                                    />

                                                    <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
                                                        No products found
                                                    </h3>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* =====================================================
                            PAGINATION
                        ====================================================== */}

                        <div className="flex flex-col gap-4 border-t border-slate-100 p-5 dark:border-slate-700 lg:flex-row lg:items-center lg:justify-between">
                            <p className="text-center text-sm font-bold text-slate-500 dark:text-slate-400 lg:text-left">
                                Showing {medicines?.from ?? 0}–
                                {medicines?.to ?? 0} of{' '}
                                {medicines?.total ?? 0} products
                            </p>

                            <div className="flex items-center justify-center gap-3">
                                {medicines?.prev_page_url ? (
                                    <Link
                                        href={medicines.prev_page_url}
                                        preserveScroll
                                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
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
                                        href={medicines.next_page_url}
                                        preserveScroll
                                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
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

            {/* ================================================================
                BARCODE LABEL MODAL
            ================================================================= */}

            {labelMedicine && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeLabel();
                        }
                    }}
                >
                    <div className="relative flex h-[96vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 sm:h-[94vh] sm:rounded-[1.5rem]">
                        {/* Modal Header */}
                        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 sm:px-6">
                            <div className="min-w-0">
                                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                                    Barcode Label
                                </p>

                                <h3 className="truncate text-base font-black text-slate-900 dark:text-white sm:text-lg">
                                    {labelMedicine.name}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={closeLabel}
                                aria-label="Close barcode label"
                                title="Close"
                                className="ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                            >
                                <X size={23} />
                            </button>
                        </div>

                        {/* Label Page */}
                        <div className="min-h-0 flex-1 bg-slate-100">
                            <iframe
                                key={labelMedicine.id}
                                src={route(
                                    'medicines.label',
                                    labelMedicine.id
                                )}
                                title={`Barcode label - ${labelMedicine.name}`}
                                className="h-full w-full border-0"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/*
|--------------------------------------------------------------------------
| Medicine Row
|--------------------------------------------------------------------------
*/

function MedicineRow({ medicine, onDelete, onPrint }) {
    const isLowStock =
        Number(medicine.stock_quantity) <=
        Number(medicine.minimum_stock);

    const isOutOfStock =
        Number(medicine.stock_quantity) <= 0;

    const isExpiring =
        medicine.expiry_date &&
        new Date(medicine.expiry_date) <=
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return (
        <tr className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
            {/* Barcode */}
            <td className="px-3 py-5 align-top lg:px-4">
                <div className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                    <Barcode
                        size={15}
                        className="shrink-0 text-slate-400 dark:text-slate-500"
                    />

                    <span className="truncate">
                        {medicine.barcode}
                    </span>
                </div>

                <p className="mt-1 break-words text-[11px] font-black leading-4 text-slate-400 dark:text-slate-500">
                    SKU: {medicine.sku}
                </p>
            </td>

            {/* Product */}
            <td className="px-3 py-5 align-top lg:px-4">
                <p className="line-clamp-2 text-sm font-black leading-5 text-slate-950 dark:text-white">
                    {medicine.name}
                </p>

                <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                    {medicine.generic_name ||
                        medicine.brand_name ||
                        medicine.medicine_type}
                </p>
            </td>

            {/* Category */}
            <td className="px-3 py-5 align-top text-xs font-black text-slate-600 dark:text-slate-400 lg:px-4">
                <span className="line-clamp-2">
                    {medicine.category?.name || '-'}
                </span>
            </td>

            {/* Stock */}
            <td className="px-3 py-5 align-top lg:px-4">
                {isOutOfStock ? (
                    <span className="inline-flex rounded-full bg-red-100 px-3 py-2 text-[11px] font-black text-red-700 dark:bg-red-900/40 dark:text-red-300">
                        Out of Stock
                    </span>
                ) : isLowStock ? (
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-2 text-[11px] font-black text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        Low: {medicine.stock_quantity}{' '}
                        {medicine.unit?.short_name || ''}
                    </span>
                ) : (
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-2 text-[11px] font-black text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {medicine.stock_quantity}{' '}
                        {medicine.unit?.short_name || ''}
                    </span>
                )}
            </td>

            {/* Price */}
            <td className="px-3 py-5 align-top lg:px-4">
                <p className="text-sm font-black leading-5 text-slate-900 dark:text-white">
                    {medicine.selling_price} SAR
                </p>

                <p className="text-[11px] font-black text-slate-400 dark:text-slate-500">
                    Cost: {medicine.purchase_price}
                </p>
            </td>

            {/* Expiry */}
            <td className="px-3 py-5 align-top lg:px-4">
                <span
                    className={`inline-flex rounded-full px-3 py-2 text-[11px] font-black ${
                        isExpiring
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                >
                    {medicine.expiry_date
                        ? new Date(
                              medicine.expiry_date
                          ).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                          })
                        : 'No expiry'}
                </span>
            </td>

            {/* Status */}
            <td className="px-3 py-5 align-top lg:px-4">
                <span
                    className={`inline-flex rounded-full px-3 py-2 text-[11px] font-black ${
                        medicine.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                >
                    {medicine.is_active ? 'Active' : 'Inactive'}
                </span>
            </td>

            {/* Actions */}
            <td className="px-3 py-5 align-top lg:px-4">
                <div className="flex flex-wrap items-center gap-2">
                    {/* View */}
                    <Link
                        href={route(
                            'medicines.show',
                            medicine.id
                        )}
                        title="View Product"
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400"
                    >
                        <Eye size={15} />
                    </Link>

                    {/* Edit */}
                    <Link
                        href={route(
                            'medicines.edit',
                            medicine.id
                        )}
                        title="Edit Product"
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-emerald-950/30"
                    >
                        <Edit size={15} />
                    </Link>

                    {/* Print Label */}
                    <button
                        type="button"
                        onClick={() => onPrint(medicine)}
                        title="Print Product Label"
                        className="rounded-xl border border-emerald-200 p-2 text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                    >
                        <Printer size={15} />
                    </button>

                    {/* Delete */}
                    <button
                        type="button"
                        onClick={() => onDelete(medicine)}
                        title="Delete Product"
                        className="rounded-xl border border-red-200 p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-300"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </td>
        </tr>
    );
}