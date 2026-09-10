import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CreditCard,
    Edit,
    Mail,
    MapPin,
    Phone,
    Star,
    UserRound,
    Wallet,
} from 'lucide-react';

export default function Show({ customer }) {
    return (
        <AppLayout title="Customer Details">
            <Head title={`${customer.name} | Pharmexa`} />

            <div className="space-y-7">
                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-8 text-white shadow-2xl">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black backdrop-blur transition-colors">
                                <UserRound size={16} />
                                Customers / Profile
                            </div>

                            <h1 className="mt-5 text-5xl font-black">
                                {customer.name}
                            </h1>

                            <p className="mt-3 max-w-3xl leading-7 text-white/90">
                                Customer profile, contact information, loyalty points,
                                credit balance and future sales history.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={route('customers.index')}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-6 py-4 font-black text-white backdrop-blur transition-colors"
                            >
                                <ArrowLeft size={20} />
                                Back
                            </Link>

                            <Link
                                href={route('customers.edit', customer.id)}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-white px-6 py-4 font-black text-blue-700 dark:text-blue-300 shadow-xl transition-colors"
                            >
                                <Edit size={20} />
                                Edit
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-700 to-emerald-500 text-white shadow-xl">
                            <UserRound size={36} />
                        </div>

                        <h2 className="mt-5 text-3xl font-black text-slate-900 dark:text-white">
                            {customer.name}
                        </h2>

                        <p className="mt-2 font-bold text-slate-500 dark:text-slate-400">
                            {customer.customer_code}
                        </p>

                        <span className={`mt-5 inline-flex rounded-full px-4 py-2 text-xs font-black ${ customer.is_active ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' }`}>
                            {customer.is_active ? 'Active Customer' : 'Inactive Customer'}
                        </span>
                    </div>

                    <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-sm lg:col-span-2 transition-colors">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                            Contact Information
                        </h2>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <Info icon={Phone} label="Phone" value={customer.phone || '-'} />
                            <Info icon={Mail} label="Email" value={customer.email || '-'} />
                            <Info icon={MapPin} label="City" value={customer.city || '-'} />
                            <Info icon={CreditCard} label="National ID / Iqama" value={customer.national_id || '-'} />
                            <Info icon={UserRound} label="Gender" value={customer.gender || '-'} />
                            <Info icon={MapPin} label="Address" value={customer.address || '-'} />
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 md:grid-cols-3">
                    <SummaryCard
                        icon={Star}
                        label="Loyalty Points"
                        value={customer.loyalty_points || 0}
                    />

                    <SummaryCard
                        icon={Wallet}
                        label="Credit Limit"
                        value={`${Number(customer.credit_limit || 0).toFixed(2)} SAR`}
                    />

                    <SummaryCard
                        icon={CreditCard}
                        label="Current Balance"
                        value={`${Number(customer.current_balance || 0).toFixed(2)} SAR`}
                    />
                </section>

                <section className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                        Sales History
                    </h2>

                    <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                        Customer sales history will appear here when we connect customers with POS.
                    </p>

                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors">
                        <CreditCard className="mx-auto text-slate-400 dark:text-slate-500" size={42} />

                        <h3 className="mt-4 text-xl font-black text-slate-700 dark:text-slate-200">
                            No linked sales yet
                        </h3>

                        <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                            We will connect this customer profile with POS in the next step.
                        </p>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}

function Info({ icon: Icon, label, value }) {
    return (
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-5">
            <div className="flex items-center gap-2 text-sm font-black text-slate-500 dark:text-slate-400">
                <Icon size={17} />
                {label}
            </div>

            <p className="mt-3 break-words font-black text-slate-900 dark:text-white">
                {value}
            </p>
        </div>
    );
}

function SummaryCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-emerald-500 text-white">
                <Icon size={26} />
            </div>

            <p className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-400">
                {label}
            </p>

            <h3 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                {value}
            </h3>
        </div>
    );
}