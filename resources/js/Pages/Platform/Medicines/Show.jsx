import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Barcode,
    Building2,
    CheckCircle2,
    Edit,
    Package,
    Pill,
    Tag,
} from 'lucide-react';

export default function Show({
    medicine,
    pharmacyCount = 0,
    totalPharmacies = 0,
}) {
    const distributedPercentage =
        totalPharmacies > 0
            ? Math.round((pharmacyCount / totalPharmacies) * 100)
            : 0;

    return (
        <AppLayout title="Global Product">
            <Head title={`${medicine.name} | Pharmexa`} />

            <div className="space-y-7">
                {/* Hero */}
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
                                <Package size={16} />
                                Platform / Global Catalogue
                            </div>

                            <h1 className="text-3xl font-black tracking-tight lg:text-5xl">
                                {medicine.name}
                            </h1>

                            <p className="mt-3 max-w-3xl font-medium text-white/90">
                                Global master product information managed by
                                Pharmexa.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={route(
                                    'platform.medicines.index'
                                )}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-5 py-3 font-black text-white backdrop-blur transition hover:bg-white hover:text-blue-700"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </Link>

                            <Link
                                href={route(
                                    'platform.medicines.edit',
                                    medicine.id
                                )}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-black text-blue-700 shadow-xl transition hover:-translate-y-1"
                            >
                                <Edit size={18} />
                                Edit Product
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Summary */}
                <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Status"
                        value={
                            medicine.is_active
                                ? 'Active'
                                : 'Inactive'
                        }
                        icon={CheckCircle2}
                    />

                    <StatCard
                        title="Selling Price"
                        value={`${formatMoney(
                            medicine.selling_price
                        )} SAR`}
                        icon={Tag}
                    />

                    <StatCard
                        title="Pharmacies"
                        value={`${pharmacyCount} / ${totalPharmacies}`}
                        icon={Building2}
                    />

                    <StatCard
                        title="Distribution"
                        value={`${distributedPercentage}%`}
                        icon={Package}
                    />
                </section>

                <div className="grid gap-7 xl:grid-cols-3">
                    {/* Main Information */}
                    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 xl:col-span-2 lg:p-8">
                        <div className="mb-7">
                            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                                Product Information
                            </h2>

                            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                Master catalogue information for this product.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Info
                                label="Product Name"
                                value={medicine.name}
                            />

                            <Info
                                label="Generic Name"
                                value={
                                    medicine.generic_name ||
                                    '-'
                                }
                            />

                            <Info
                                label="Brand Name"
                                value={
                                    medicine.brand_name ||
                                    '-'
                                }
                            />

                            <Info
                                label="Medicine Type"
                                value={
                                    medicine.medicine_type ||
                                    '-'
                                }
                            />

                            <Info
                                label="Barcode"
                                value={
                                    medicine.barcode || '-'
                                }
                                icon={Barcode}
                            />

                            <Info
                                label="SKU"
                                value={medicine.sku || '-'}
                            />

                            <Info
                                label="Category"
                                value={
                                    medicine.category?.name ||
                                    '-'
                                }
                            />

                            <Info
                                label="Manufacturer"
                                value={
                                    medicine.manufacturer
                                        ?.name || '-'
                                }
                            />

                            <Info
                                label="Unit"
                                value={
                                    medicine.unit?.name ||
                                    medicine.unit
                                        ?.short_name ||
                                    '-'
                                }
                            />

                            <Info
                                label="Purchase Price"
                                value={`${formatMoney(
                                    medicine.purchase_price
                                )} SAR`}
                            />

                            <Info
                                label="Selling Price"
                                value={`${formatMoney(
                                    medicine.selling_price
                                )} SAR`}
                            />

                            <Info
                                label="Tax"
                                value={`${formatMoney(
                                    medicine.tax_percentage
                                )}%`}
                            />

                            <Info
                                label="Default Minimum Stock"
                                value={
                                    medicine.minimum_stock ??
                                    0
                                }
                            />

                            <Info
                                label="Master Stock"
                                value={
                                    medicine.stock_quantity ??
                                    0
                                }
                            />

                            <Info
                                label="Batch Number"
                                value={
                                    medicine.batch_number ||
                                    '-'
                                }
                            />

                            <Info
                                label="Expiry Date"
                                value={formatDate(
                                    medicine.expiry_date
                                )}
                            />
                        </div>

                        <div className="mt-6 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/70">
                            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                                Description
                            </p>

                            <p className="mt-2 whitespace-pre-line text-sm font-medium leading-7 text-slate-700 dark:text-slate-300">
                                {medicine.description ||
                                    'No description provided.'}
                            </p>
                        </div>
                    </section>

                    {/* Distribution */}
                    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:p-8">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-lg">
                            <Building2 size={26} />
                        </div>

                        <h2 className="mt-6 text-2xl font-black text-slate-950 dark:text-white">
                            Pharmacy Distribution
                        </h2>

                        <p className="mt-2 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                            This master product is linked to
                            pharmacy-specific inventory records.
                        </p>

                        <div className="mt-7 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                        Connected
                                    </p>

                                    <p className="mt-1 text-3xl font-black text-slate-950 dark:text-white">
                                        {pharmacyCount}
                                    </p>
                                </div>

                                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                                    {distributedPercentage}%
                                </p>
                            </div>

                            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500"
                                    style={{
                                        width: `${Math.min(
                                            distributedPercentage,
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>

                            <p className="mt-3 text-xs font-bold text-slate-400">
                                {pharmacyCount} of{' '}
                                {totalPharmacies} pharmacies
                            </p>
                        </div>

                        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-950/30">
                            <div className="flex gap-3">
                                <Pill
                                    size={20}
                                    className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-300"
                                />

                                <p className="text-sm font-medium leading-6 text-blue-800 dark:text-blue-200">
                                    Pharmacy stock, pricing,
                                    expiry and availability can
                                    remain independent from this
                                    global master product.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
}) {
    return (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-blue-700 dark:bg-slate-800 dark:text-blue-300">
                <Icon size={22} />
            </div>

            <p className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-400">
                {title}
            </p>

            <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                {value}
            </p>
        </div>
    );
}

function Info({
    label,
    value,
    icon: Icon,
}) {
    return (
        <div className="rounded-2xl border border-slate-100 p-4 dark:border-slate-700">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                {label}
            </p>

            <div className="mt-2 flex items-center gap-2">
                {Icon && (
                    <Icon
                        size={16}
                        className="shrink-0 text-slate-400"
                    />
                )}

                <p className="break-words text-sm font-black text-slate-800 dark:text-slate-200">
                    {value}
                </p>
            </div>
        </div>
    );
}

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

function formatDate(value) {
    if (!value) {
        return 'No expiry';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}