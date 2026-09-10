import AppLayout from '@/Layouts/AppLayout';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import FlashAlert from '@/Components/UI/FlashAlert';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Building2,
    CheckCircle2,
    Edit,
    Eye,
    Filter,
    Globe,
    Mail,
    MapPin,
    Phone,
    Plus,
    Search,
    Trash2,
    UserRound,
    XCircle,
} from 'lucide-react';

export default function Index({ pharmacies, stats, filters = {} }) {
    const rows = pharmacies?.data ?? [];

    const [search, setSearch] = useState(filters.search || '');
    const [pharmacyToDelete, setPharmacyToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const applySearch = (e) => {
        e.preventDefault();

        router.get(
            route('platform.pharmacies.index'),
            { search },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const clearSearch = () => {
        setSearch('');

        router.get(
            route('platform.pharmacies.index'),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const confirmDelete = (pharmacy) => {
        setPharmacyToDelete(pharmacy);
    };

    const closeDeleteModal = () => {
        if (!deleting) {
            setPharmacyToDelete(null);
        }
    };

    const deletePharmacy = () => {
        if (!pharmacyToDelete) {
            return;
        }

        setDeleting(true);

        router.delete(
            route(
                'platform.pharmacies.destroy',
                pharmacyToDelete.id
            ),
            {
                preserveScroll: true,

                onFinish: () => {
                    setDeleting(false);
                    setPharmacyToDelete(null);
                },
            }
        );
    };

    const dashboardStats = [
        {
            title: 'Total Pharmacies',
            value: stats?.total ?? 0,
            icon: Building2,
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
            iconColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Active',
            value: stats?.active ?? 0,
            icon: CheckCircle2,
            iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            title: 'Suspended',
            value: stats?.suspended ?? 0,
            icon: XCircle,
            iconBg: 'bg-red-100 dark:bg-red-900/30',
            iconColor: 'text-red-600 dark:text-red-400',
        },
    ];

    return (
        <AppLayout title="Pharmacies">
            <Head title="Pharmacies | Pharmexa Platform" />

            <FlashAlert />

            <div className="min-w-0 space-y-6">

                {/* Page Header */}
               <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/30 lg:p-8">

    {/* Decorative background */}
    <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-600/10" />
    <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-500/10" />

    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}
        <div className="min-w-0">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/80 px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                <Building2 size={14} />
                Platform Management
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white lg:text-4xl">
                Pharmacy Management
            </h1>

            <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-slate-600 dark:text-slate-300 lg:text-base">
                Manage pharmacy tenants, owners, users and platform access
                from one centralized workspace.
            </p>

        </div>

        {/* Right */}
        <div className="shrink-0">

            <Link
                href={route('platform.pharmacies.create')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/25"
            >
                <Plus size={19} />
                Add Pharmacy
            </Link>

        </div>

    </div>

</section>

                                {/* Statistics */}
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {dashboardStats.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-500 dark:text-slate-400">
                                            {item.title}
                                        </p>

                                        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                            {item.value}
                                        </h2>

                                        <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                                            Current platform total
                                        </p>
                                    </div>

                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
                                    >
                                        <Icon
                                            size={23}
                                            className={item.iconColor}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* Search */}
                <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex flex-col gap-4 p-5 xl:flex-row xl:items-center xl:justify-between">

                        <div className="min-w-0">
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">
                                Search Pharmacies
                            </h2>

                            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                Search by pharmacy name, owner, email, phone, city or country.
                            </p>
                        </div>

                        <form
                            onSubmit={applySearch}
                            className="flex min-w-0 w-full flex-col gap-2 sm:flex-row xl:w-auto"
                        >
                            <div className="relative min-w-0 flex-1 xl:w-80 xl:flex-none">
                                <Search
                                    size={17}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search pharmacy..."
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
                                />
                            </div>

                            <button
                                type="submit"
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                            >
                                <Search size={17} />
                                Search
                            </button>

                            {search && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Reset
                                </button>
                            )}
                        </form>

                    </div>
                </section>

                                {/* Pharmacy Directory */}
                <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

                    {/* Directory Header */}
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">

                        <div className="min-w-0">
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">
                                Pharmacy Directory
                            </h2>

                            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                {pharmacies?.total ?? 0} pharmacies registered on the platform.
                            </p>
                        </div>

                        <div className="shrink-0 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            Page {pharmacies?.current_page ?? 1} of{' '}
                            {pharmacies?.last_page ?? 1}
                        </div>

                    </div>

                    {/* Desktop Table */}
                    <div className="hidden w-full lg:block">
                        <table className="w-full table-fixed">

                            <colgroup>
                                <col className="w-[20%]" />
                                <col className="w-[15%]" />
                                <col className="w-[20%]" />
                                <col className="w-[15%]" />
                                <col className="w-[8%]" />
                                <col className="w-[10%]" />
                                <col className="w-[12%]" />
                            </colgroup>

                            <thead className="bg-slate-50 dark:bg-slate-800/70">
                                <tr>
                                    <th className="px-3 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 xl:px-4">
                                        Pharmacy
                                    </th>

                                    <th className="px-3 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 xl:px-4">
                                        Owner
                                    </th>

                                    <th className="px-3 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 xl:px-4">
                                        Contact
                                    </th>

                                    <th className="px-3 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 xl:px-4">
                                        Location
                                    </th>

                                    <th className="px-2 py-3 text-center text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Users
                                    </th>

                                    <th className="px-2 py-3 text-center text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Status
                                    </th>

                                    <th className="px-2 py-3 text-right text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 xl:px-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {rows.length ? (
                                    rows.map((pharmacy) => (
                                        <PharmacyRow
                                            key={pharmacy.id}
                                            pharmacy={pharmacy}
                                            onDelete={confirmDelete}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-14 text-center"
                                        >
                                            <Building2
                                                className="mx-auto text-slate-300 dark:text-slate-600"
                                                size={44}
                                            />

                                            <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
                                                No Pharmacies Found
                                            </h3>

                                            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                                Create your first pharmacy to start managing tenants.
                                            </p>

                                            <Link
                                                href={route('platform.pharmacies.create')}
                                                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                                            >
                                                <Plus size={17} />
                                                Add Pharmacy
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                       {/* Footer / Pagination */}
                    <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Showing{' '}
                            <span className="font-black text-slate-700 dark:text-slate-200">
                                {pharmacies?.from ?? 0}
                            </span>
                            {' – '}
                            <span className="font-black text-slate-700 dark:text-slate-200">
                                {pharmacies?.to ?? 0}
                            </span>
                            {' of '}
                            <span className="font-black text-slate-700 dark:text-slate-200">
                                {pharmacies?.total ?? 0}
                            </span>
                            {' pharmacies'}
                        </p>

                        <div className="flex items-center gap-2">

                            {pharmacies?.prev_page_url ? (
                                <Link
                                    href={pharmacies.prev_page_url}
                                    preserveScroll
                                    preserveState
                                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Previous
                                </Link>
                            ) : (
                                <span className="cursor-not-allowed rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-bold text-slate-300 dark:border-slate-800 dark:text-slate-600">
                                    Previous
                                </span>
                            )}

                            <span className="inline-flex min-w-10 items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-black text-white">
                                {pharmacies?.current_page ?? 1}
                            </span>

                            {pharmacies?.next_page_url ? (
                                <Link
                                    href={pharmacies.next_page_url}
                                    preserveScroll
                                    preserveState
                                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Next
                                </Link>
                            ) : (
                                <span className="cursor-not-allowed rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-bold text-slate-300 dark:border-slate-800 dark:text-slate-600">
                                    Next
                                </span>
                            )}

                        </div>
                    </div>

                </section>
            </div>

            {/* Delete Pharmacy Modal */}
            <Modal
                show={Boolean(pharmacyToDelete)}
                onClose={closeDeleteModal}
                maxWidth="lg"
            >
                <div className="p-6 sm:p-7">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
                        <Trash2
                            size={28}
                            className="text-red-600 dark:text-red-400"
                        />
                    </div>

                    <h2 className="mt-5 text-center text-xl font-black text-slate-900 dark:text-white">
                        Delete Pharmacy
                    </h2>

                    <p className="mx-auto mt-3 max-w-md text-center text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                        Are you sure you want to permanently delete{' '}
                        <span className="font-black text-slate-900 dark:text-white">
                            {pharmacyToDelete?.name}
                        </span>
                        ? This action cannot be undone.
                    </p>

                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/10">
                        <div className="flex gap-3">
                            <Trash2
                                size={18}
                                className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
                            />

                            <div>
                                <p className="text-sm font-black text-red-700 dark:text-red-300">
                                    Warning
                                </p>

                                <p className="mt-1 text-sm font-medium leading-6 text-red-600 dark:text-red-400">
                                    Pharmacy users and related tenant data may also
                                    become inaccessible after deletion.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        <SecondaryButton
                            type="button"
                            onClick={closeDeleteModal}
                            disabled={deleting}
                            className="justify-center"
                        >
                            Cancel
                        </SecondaryButton>

                        <DangerButton
                            type="button"
                            onClick={deletePharmacy}
                            disabled={deleting}
                            className="justify-center"
                        >
                            <Trash2 size={16} className="mr-2" />

                            {deleting
                                ? 'Deleting...'
                                : 'Delete Pharmacy'}
                        </DangerButton>

                    </div>

                </div>
            </Modal>

        </AppLayout>
    );
}

function StatusBadge({ status }) {
    const isActive = Boolean(status);

    return (
        <span
            className={`inline-flex rounded-full px-3 py-2 text-[11px] font-black ${
                isActive
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
            }`}
        >
            {isActive ? 'Active' : 'Suspended'}
        </span>
    );
}
function PharmacyRow({ pharmacy, onDelete }) {
    const location =
        [pharmacy.city, pharmacy.country]
            .filter(Boolean)
            .join(', ') || '-';

    return (
        <tr className="border-b border-slate-100 transition hover:bg-slate-50/80 last:border-b-0 dark:border-slate-800 dark:hover:bg-slate-800/40">

            {/* Pharmacy */}
            <td className="px-3 py-4 align-middle xl:px-4">
                <div className="flex min-w-0 items-center gap-3">

                    {pharmacy.logo_url ? (
                        <img
                            src={pharmacy.logo_url}
                            alt={pharmacy.name}
                            className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 object-cover dark:border-slate-700"
                        />
                    ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                            <Building2
                                size={19}
                                className="text-blue-600 dark:text-blue-400"
                            />
                        </div>
                    )}

                    <div className="min-w-0">
                        <h3
                            className="truncate text-sm font-black text-slate-900 dark:text-white"
                            title={pharmacy.name}
                        >
                            {pharmacy.name}
                        </h3>

                        <p className="mt-1 truncate text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            ID #{pharmacy.id}
                        </p>
                    </div>

                </div>
            </td>

            {/* Owner */}
            <td className="px-3 py-4 align-middle xl:px-4">
                <div className="flex min-w-0 items-center gap-2">
                    <UserRound
                        size={15}
                        className="shrink-0 text-slate-400"
                    />

                    <span
                        className="truncate text-sm font-semibold text-slate-700 dark:text-slate-300"
                        title={pharmacy.owner_name || 'Not Assigned'}
                    >
                        {pharmacy.owner_name || 'Not Assigned'}
                    </span>
                </div>
            </td>

            {/* Contact */}
            <td className="px-3 py-4 align-middle xl:px-4">
                <div className="min-w-0 space-y-1.5">

                    <div className="flex min-w-0 items-center gap-2">
                        <Mail
                            size={14}
                            className="shrink-0 text-slate-400"
                        />

                        <span
                            className="min-w-0 truncate text-xs font-medium text-slate-600 dark:text-slate-300"
                            title={pharmacy.email || '-'}
                        >
                            {pharmacy.email || '-'}
                        </span>
                    </div>

                    <div className="flex min-w-0 items-center gap-2">
                        <Phone
                            size={14}
                            className="shrink-0 text-slate-400"
                        />

                        <span
                            className="min-w-0 truncate text-xs font-medium text-slate-500 dark:text-slate-400"
                            title={pharmacy.phone || '-'}
                        >
                            {pharmacy.phone || '-'}
                        </span>
                    </div>

                </div>
            </td>

            {/* Location */}
            <td className="px-3 py-4 align-middle xl:px-4">
                <div className="flex min-w-0 items-center gap-2">
                    <MapPin
                        size={14}
                        className="shrink-0 text-slate-400"
                    />

                    <span
                        className="min-w-0 truncate text-xs font-medium text-slate-600 dark:text-slate-300"
                        title={location}
                    >
                        {location}
                    </span>
                </div>
            </td>

            {/* Users */}
            <td className="px-2 py-4 text-center align-middle">
                <span className="inline-flex min-w-8 items-center justify-center rounded-lg bg-slate-100 px-2 py-1.5 text-xs font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {pharmacy.users_count ?? 0}
                </span>
            </td>

            {/* Status */}
            <td className="px-2 py-4 text-center align-middle">
                {pharmacy.status ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1.5 text-[11px] font-black text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1.5 text-[11px] font-black text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                        Suspended
                    </span>
                )}
            </td>

            {/* Actions */}
            <td className="px-2 py-4 text-right align-middle xl:px-3">
                <div className="flex items-center justify-end gap-1">

                    <Link
                        href={route(
                            'platform.pharmacies.show',
                            pharmacy.id
                        )}
                        title="View Pharmacy"
                        aria-label={`View ${pharmacy.name}`}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-slate-700 dark:text-slate-300"
                    >
                        <Eye size={14} />
                    </Link>

                    <Link
                        href={route(
                            'platform.pharmacies.edit',
                            pharmacy.id
                        )}
                        title="Edit Pharmacy"
                        aria-label={`Edit ${pharmacy.name}`}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-slate-700 dark:text-slate-300"
                    >
                        <Edit size={14} />
                    </Link>

                    <button
                        type="button"
                        onClick={() => onDelete(pharmacy)}
                        title="Delete Pharmacy"
                        aria-label={`Delete ${pharmacy.name}`}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:border-red-600 hover:bg-red-600 hover:text-white dark:border-red-900/50 dark:text-red-400"
                    >
                        <Trash2 size={14} />
                    </button>

                </div>
            </td>

        </tr>
    );
}