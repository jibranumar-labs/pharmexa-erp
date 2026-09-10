import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Barcode,
    Boxes,
    CalendarClock,
    DollarSign,
    Factory,
    Globe,
    PackageCheck,
    Pill,
    Tag,
    Truck,
} from 'lucide-react';

export default function Show({
    medicine,
    catalogueMode = 'pharmacy',
    canSubmitToGlobal = false,
    globalSubmission = null,
}) {
    const expiryDate = medicine.expiry_date
        ? new Date(medicine.expiry_date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          })
        : 'No Expiry';

    const stockStatus =
        medicine.stock_quantity <= 0
            ? 'Out of Stock'
            : medicine.stock_quantity <= medicine.minimum_stock
              ? 'Low Stock'
              : 'In Stock';

    const submitToGlobal = () => {
        if (
            !window.confirm(
                'Submit this product to the Global Catalogue for Super Owner review? Only GTIN, barcode and product name will be sent. Your local inventory will not be changed.'
            )
        ) {
            return;
        }

        router.post(
            route('medicines.submit-to-global-catalogue', medicine.id),
            {},
            { preserveScroll: true }
        );
    };

    return (
        <AppLayout title="Product Details">
            <Head title={`${medicine.name} | Pharmexa`} />

            <div className="space-y-7">
                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur transition-colors">
                                <Pill size={16} />
                                Product Profile
                            </div>

                            <h1 className="max-w-5xl text-3xl font-black leading-tight lg:text-5xl">
                                {medicine.name}
                            </h1>

                            <div className="mt-5 flex flex-wrap gap-3">
                                <Badge text={`SKU: ${medicine.sku}`} />
                                <Badge text={`Barcode: ${medicine.barcode}`} />
                                <Badge text={`GTIN: ${medicine.gtin || 'Not assigned'}`} />
                                <Badge text={medicine.category?.name || 'No Category'} />
                                <Badge text={medicine.is_active ? 'Active' : 'Inactive'} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:items-end">
                            {canSubmitToGlobal && (
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={submitToGlobal}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-blue-700 shadow-xl transition hover:-translate-y-1 dark:bg-slate-900 dark:text-blue-300"
                                    >
                                        <Globe size={18} />
                                        Submit to Global Catalogue
                                    </button>

                                    <a
                                        href={route(
                                            'medicines.export-new-product',
                                            medicine.id
                                        )}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-6 py-4 font-black text-white backdrop-blur transition hover:bg-white hover:text-blue-700"
                                    >
                                        Export Identity
                                    </a>
                                </div>
                            )}

                            {globalSubmission?.status && (
                                <p className="text-sm font-bold text-white/90">
                                    Global submission: {globalSubmission.status}
                                </p>
                            )}

                            <Link
                                href={route('medicines.index')}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-white px-6 py-4 font-black text-blue-700 dark:text-blue-300 shadow-xl transition hover:-translate-y-1"
                            >
                                <ArrowLeft size={18} />
                                Back to Products
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <MiniCard
                        icon={Barcode}
                        label="Barcode"
                        value={medicine.barcode}
                        color="text-blue-600"
                    />

                    <MiniCard
                        icon={Barcode}
                        label="GTIN"
                        value={medicine.gtin || 'Not assigned'}
                        color="text-cyan-600"
                    />

                    <MiniCard
                        icon={Boxes}
                        label="Category"
                        value={medicine.category?.name || '-'}
                        color="text-amber-500"
                    />

                    <MiniCard
                        icon={Pill}
                        label="Product Form"
                        value={medicine.medicine_type}
                        color="text-purple-600"
                    />
                </section>

                <section className="grid gap-6 xl:grid-cols-3">
                    <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 xl:col-span-2 transition-colors">
                        <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                            Inventory Information
                        </h2>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <InfoRow
                                label="Stock Quantity"
                                value={`${medicine.stock_quantity} ${medicine.unit?.short_name || ''}`}
                            />

                            <InfoRow
                                label="Unit"
                                value={medicine.unit?.name || '-'}
                            />

                            <InfoRow
                                label="Minimum Stock"
                                value={medicine.minimum_stock}
                            />

                            <InfoRow
                                label="Stock Status"
                                value={stockStatus}
                            />

                            <InfoRow
                                label="Batch Number"
                                value={medicine.batch_number || '-'}
                            />

                            <InfoRow
                                label="Expiry Date"
                                value={expiryDate}
                            />
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 transition-colors">
                        <PackageCheck
                            className="text-emerald-600 dark:text-emerald-400"
                            size={36}
                        />

                        <h2 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">
                            Current Status
                        </h2>

                        <div className="mt-5 space-y-3">
                            <StatusBadge status={stockStatus} />
                            <StatusBadge status={medicine.is_active ? 'Active' : 'Inactive'} />
                            <StatusBadge
                                status={
                                    expiryDate === 'No Expiry'
                                        ? 'No Expiry'
                                        : `Expiry: ${expiryDate}`
                                }
                            />
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 transition-colors">
                        <div className="flex items-center gap-3">
                            <DollarSign className="text-blue-600" size={34} />

                            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                                Pricing Information
                            </h2>
                        </div>

                        <div className="mt-6 space-y-4">
                            <InfoLine
                                label="Purchase Price"
                                value={`${medicine.purchase_price} SAR`}
                            />

                            <InfoLine
                                label="Selling Price"
                                value={`${medicine.selling_price} SAR`}
                            />

                            <InfoLine
                                label="Tax Percentage"
                                value={`${medicine.tax_percentage}%`}
                            />
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 transition-colors">
                        <div className="flex items-center gap-3">
                            <CalendarClock
                                className="text-rose-500"
                                size={34}
                            />

                            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                                Tracking
                            </h2>
                        </div>

                        <div className="mt-6 space-y-4">
                            <InfoLine
                                label="Created At"
                                value={formatDate(medicine.created_at)}
                            />

                            <InfoLine
                                label="Last Updated"
                                value={formatDate(medicine.updated_at)}
                            />

                            <InfoLine
                                label="Expiry Date"
                                value={expiryDate}
                            />
                        </div>
                    </div>
                </section>

                               <section className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 transition-colors">
                        <Factory
                            className="text-slate-600 dark:text-slate-400"
                            size={34}
                        />

                        <p className="mt-4 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Manufacturer
                        </p>

                        <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                            {medicine.manufacturer?.name || '-'}
                        </h3>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 transition-colors">
                        <Truck
                            className="text-slate-600 dark:text-slate-400"
                            size={34}
                        />

                        <p className="mt-4 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Supplier
                        </p>

                        <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                            {medicine.supplier?.name || '-'}
                        </h3>
                    </div>
                </section>

                {medicine.description && (
                    <section className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 transition-colors">
                        <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                            Product Description
                        </h2>

                        <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                            {medicine.description}
                        </p>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}

function Badge({ text }) {
    return (
        <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-black text-white backdrop-blur transition-colors">
            {text}
        </span>
    );
}

function MiniCard({ icon: Icon, label, value, color }) {
    return (
        <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900">
            <Icon className={color} size={34} />

            <p className="mt-4 text-sm font-bold text-slate-500 dark:text-slate-400">
                {label}
            </p>

            <h3 className="mt-2 break-words text-xl font-black text-slate-950 dark:text-white">
                {value}
            </h3>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {label}
            </p>

            <p className="mt-2 break-words text-lg font-black text-slate-950 dark:text-white">
                {value}
            </p>
        </div>
    );
}

function InfoLine({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-3 last:border-b-0">
            <span className="font-bold text-slate-500 dark:text-slate-400">
                {label}
            </span>

            <strong className="text-right text-slate-950 dark:text-white">
                {value}
            </strong>
        </div>
    );
}

function StatusBadge({ status }) {
    return (
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {status}
        </div>
    );
}

function formatDate(date) {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}