import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BadgePercent,
    Building2,
    Edit,
    Mail,
    MapPin,
    Phone,
    UserRound,
} from 'lucide-react';

export default function Show({ supplier }) {
    return (
        <AppLayout title="Supplier Details">
            <Head title={`${supplier.name} | Pharmexa`} />

            <div className="space-y-7">
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition-colors">
                                <Building2 size={16} />
                                Suppliers / Details
                            </div>

                            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
                                {supplier.name}
                            </h1>

                            <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-white/90">
                                View supplier profile, contact information, VAT number,
                                purchase status and future purchase activity.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={route('suppliers.index')}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-6 py-4 font-black text-white backdrop-blur transition hover:bg-white dark:bg-white hover:text-blue-700 dark:text-blue-300"
                            >
                                <ArrowLeft size={20} />
                                Back
                            </Link>

                            <Link
                                href={route('suppliers.edit', supplier.id)}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-slate-900 px-6 py-4 font-black text-blue-700 dark:text-blue-300 shadow-xl transition hover:-translate-y-1"
                            >
                                <Edit size={20} />
                                Edit Supplier
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 transition-colors">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-lg">
                            <Building2 size={30} />
                        </div>

                        <h2 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">
                            {supplier.name}
                        </h2>

                        <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                            Supplier ID: #{supplier.id}
                        </p>

                        <span className={`mt-5 inline-flex rounded-full px-4 py-2 text-xs font-black ${ supplier.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' }`}>
                            {supplier.is_active ? 'Active Supplier' : 'Inactive Supplier'}
                        </span>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 lg:col-span-2 transition-colors">
                        <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                            Supplier Information
                        </h2>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <InfoCard
                                icon={UserRound}
                                label="Contact Person"
                                value={supplier.contact_person || '-'}
                            />

                            <InfoCard
                                icon={Phone}
                                label="Phone"
                                value={supplier.phone || '-'}
                            />

                            <InfoCard
                                icon={Mail}
                                label="Email"
                                value={supplier.email || '-'}
                            />

                            <InfoCard
                                icon={BadgePercent}
                                label="VAT Number"
                                value={supplier.vat_number || '-'}
                            />

                            <div className="sm:col-span-2">
                                <InfoCard
                                    icon={MapPin}
                                    label="Address"
                                    value={supplier.address || '-'}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 transition-colors">
                    <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                        Purchase Summary
                    </h2>

                    <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                        Purchase invoices and supplier balance will appear here after we complete the Purchase Management module.
                    </p>

                    <div className="mt-6 grid gap-5 sm:grid-cols-3">
                        <SummaryCard label="Total Purchases" value="0 SAR" />
                        <SummaryCard label="Paid Amount" value="0 SAR" />
                        <SummaryCard label="Outstanding" value="0 SAR" />
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}

function InfoCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 p-5 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-sm font-black text-slate-500 dark:text-slate-400">
                <Icon size={17} />
                {label}
            </div>

            <p className="mt-3 break-words text-base font-black text-slate-950 dark:text-white">
                {value}
            </p>
        </div>
    );
}

function SummaryCard({ label, value }) {
    return (
        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-cyan-50 p-5 dark:from-slate-800 dark:to-slate-900">
            <p className="text-sm font-black text-slate-500 dark:text-slate-400">
                {label}
            </p>

            <p className="mt-2 text-2xl font-black text-blue-700 dark:text-blue-300">
                {value}
            </p>
        </div>
    );
}