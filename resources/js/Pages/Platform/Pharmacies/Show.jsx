import AppLayout from '@/Layouts/AppLayout';
import FlashAlert from '@/Components/UI/FlashAlert';
import { RoleBadge } from '@/Components/UI/Badge';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Edit,
    Globe,
    Mail,
    MapPin,
    Phone,
    StickyNote,
    UserRound,
    Users,
} from 'lucide-react';

export default function Show({ pharmacy }) {
    const isActive = Boolean(pharmacy.status);

    return (
        <AppLayout title="Pharmacy Details">
            <Head title={`${pharmacy.name} | Pharmexa Platform`} />

            <FlashAlert />

            <div className="space-y-7">
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-700 via-indigo-600 to-blue-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition-colors">
                                <Globe size={16} />
                                Platform / Pharmacy Details
                            </div>

                            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
                                {pharmacy.name}
                            </h1>

                            <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-white/90">
                                View pharmacy profile, owner account information,
                                tenant users, and platform status.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={route('platform.pharmacies.index')}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-6 py-4 font-black text-white backdrop-blur transition hover:bg-white hover:text-indigo-700"
                            >
                                <ArrowLeft size={20} />
                                Back
                            </Link>

                            <Link
                                href={route('platform.pharmacies.edit', pharmacy.id)}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-indigo-700 shadow-xl transition hover:-translate-y-1 dark:bg-slate-900 dark:text-indigo-300"
                            >
                                <Edit size={20} />
                                Edit Pharmacy
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
                        {pharmacy.logo_url ? (
                            <img
                                src={pharmacy.logo_url}
                                alt={pharmacy.name}
                                className="h-20 w-20 rounded-3xl object-cover shadow-lg ring-4 ring-slate-100 dark:ring-slate-800"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-lg">
                                <Building2 size={34} />
                            </div>
                        )}

                        <h2 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">
                            {pharmacy.name}
                        </h2>

                        <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                            Pharmacy ID: #{pharmacy.id}
                        </p>

                        <span
                            className={`mt-5 inline-flex rounded-full px-4 py-2 text-xs font-black ${
                                isActive
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                            }`}
                        >
                            {isActive ? 'Active' : 'Suspended'}
                        </span>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900 lg:col-span-2">
                        <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                            Pharmacy Information
                        </h2>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <InfoCard
                                icon={UserRound}
                                label="Owner Name"
                                value={pharmacy.owner_name || '-'}
                            />

                            <InfoCard
                                icon={Mail}
                                label="Owner Email"
                                value={pharmacy.email || '-'}
                            />

                            <InfoCard
                                icon={Phone}
                                label="Phone"
                                value={pharmacy.phone || '-'}
                            />

                            <InfoCard
                                icon={Globe}
                                label="Country"
                                value={pharmacy.country || '-'}
                            />

                            <InfoCard
                                icon={MapPin}
                                label="City"
                                value={pharmacy.city || '-'}
                            />

                            <InfoCard
                                icon={Users}
                                label="Total Users"
                                value={String(pharmacy.users?.length ?? 0)}
                            />

                            <div className="sm:col-span-2">
                                <InfoCard
                                    icon={MapPin}
                                    label="Address"
                                    value={pharmacy.address || '-'}
                                />
                            </div>

                            {pharmacy.notes && (
                                <div className="sm:col-span-2">
                                    <InfoCard
                                        icon={StickyNote}
                                        label="Notes"
                                        value={pharmacy.notes}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
                    <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                        Pharmacy Users
                    </h2>

                    <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                        Users assigned to this pharmacy tenant.
                    </p>

                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead className="bg-slate-50 dark:bg-slate-800/70">
                                <tr>
                                    {['Name', 'Email', 'Role'].map((head) => (
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
                                {pharmacy.users?.length ? (
                                    pharmacy.users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                        >
                                            <td className="px-5 py-4 text-sm font-black text-slate-950 dark:text-white">
                                                {user.name}
                                            </td>

                                            <td className="px-5 py-4 text-sm font-bold text-slate-600 dark:text-slate-400">
                                                {user.email}
                                            </td>

                                            <td className="px-5 py-4">
                                                <RoleBadge role={user.role} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="px-5 py-10 text-center text-sm font-bold text-slate-500 dark:text-slate-400"
                                        >
                                            No users assigned to this pharmacy yet.
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

function InfoCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/60">
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