import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({
    contributions,
    filters,
    stats,
}) {
    const currentStatus = filters?.status ?? 'pending';
    const currentSearch = filters?.search ?? '';

    const handleSearch = (event) => {
        event.preventDefault();

        const search = event.target.search.value;

        router.get(
            route('platform.global-medicine-contributions.index'),
            {
                status: currentStatus,
                search: search,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const changeStatus = (status) => {
        router.get(
            route('platform.global-medicine-contributions.index'),
            {
                status,
                search: currentSearch,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const clearSearch = () => {
        router.get(
            route('platform.global-medicine-contributions.index'),
            {
                status: currentStatus,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const getSourceLabel = (source) => {
        if (!source) {
            return 'Manual';
        }

        return source.toUpperCase();
    };

    const getContributionTypeLabel = (type) => {
        if (type === 'new_medicine') {
            return 'New Medicine';
        }

        if (type === 'correction') {
            return 'Correction';
        }

        return type || 'Unknown';
    };

    const getStatusLabel = (status) => {
        if (!status) {
            return 'Unknown';
        }

        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-100 text-amber-800';

            case 'approved':
                return 'bg-emerald-100 text-emerald-800';

            case 'rejected':
                return 'bg-red-100 text-red-800';

            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getSourceClasses = (source) => {
        if (source === 'gs1') {
            return 'bg-blue-100 text-blue-800';
        }

        return 'bg-gray-100 text-gray-800';
    };

    const getConfidenceClasses = (score) => {
        const value = Number(score ?? 0);

        if (value >= 80) {
            return 'text-emerald-600';
        }

        if (value >= 50) {
            return 'text-amber-600';
        }

        return 'text-red-600';
    };

    return (
        <>
            <Head title="Global Medicine Contributions" />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Global Medicine Contributions
                                </h1>

                                <p className="mt-1 text-sm text-gray-600">
                                    Review pharmacy-submitted corrections and new medicines before publishing them to the global catalogue.
                                </p>
                            </div>

                            <Link
                                href={route('platform.medicines.index')}
                                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                            >
                                Global Medicines
                            </Link>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

                        {/* Pending */}
                        <button
                            type="button"
                            onClick={() => changeStatus('pending')}
                            className={`rounded-xl border bg-white p-5 text-left shadow-sm transition hover:shadow ${
                                currentStatus === 'pending'
                                    ? 'border-amber-400 ring-2 ring-amber-100'
                                    : 'border-gray-200'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">
                                    Pending
                                </span>

                                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                                    Review
                                </span>
                            </div>

                            <div className="mt-2 text-3xl font-bold text-gray-900">
                                {stats?.pending ?? 0}
                            </div>
                        </button>

                        {/* Approved */}
                        <button
                            type="button"
                            onClick={() => changeStatus('approved')}
                            className={`rounded-xl border bg-white p-5 text-left shadow-sm transition hover:shadow ${
                                currentStatus === 'approved'
                                    ? 'border-emerald-400 ring-2 ring-emerald-100'
                                    : 'border-gray-200'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">
                                    Approved
                                </span>

                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                                    Published
                                </span>
                            </div>

                            <div className="mt-2 text-3xl font-bold text-gray-900">
                                {stats?.approved ?? 0}
                            </div>
                        </button>

                        {/* Rejected */}
                        <button
                            type="button"
                            onClick={() => changeStatus('rejected')}
                            className={`rounded-xl border bg-white p-5 text-left shadow-sm transition hover:shadow ${
                                currentStatus === 'rejected'
                                    ? 'border-red-400 ring-2 ring-red-100'
                                    : 'border-gray-200'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">
                                    Rejected
                                </span>

                                <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800">
                                    Declined
                                </span>
                            </div>

                            <div className="mt-2 text-3xl font-bold text-gray-900">
                                {stats?.rejected ?? 0}
                            </div>
                        </button>
                    </div>

                    {/* Search + Status */}
                    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col gap-3 lg:flex-row"
                        >
                            <div className="flex-1">
                                <label
                                    htmlFor="search"
                                    className="sr-only"
                                >
                                    Search contributions
                                </label>

                                <input
                                    id="search"
                                    name="search"
                                    type="text"
                                    defaultValue={currentSearch}
                                    placeholder="Search GTIN, barcode, field or proposed value..."
                                    className="w-full rounded-lg border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                            >
                                Search
                            </button>

                            {currentSearch !== '' && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                >
                                    Clear
                                </button>
                            )}
                        </form>

                        {/* Status filters */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {[
                                ['pending', 'Pending'],
                                ['approved', 'Approved'],
                                ['rejected', 'Rejected'],
                            ].map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => changeStatus(value)}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                        currentStatus === value
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contributions Table */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">

                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Medicine
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            GTIN / Barcode
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Pharmacy
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Source
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Confidence
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">

                                    {contributions?.data?.length > 0 ? (
                                        contributions.data.map((contribution) => (
                                            <tr
                                                key={contribution.id}
                                                className="transition hover:bg-gray-50"
                                            >
                                                {/* Medicine */}
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="font-medium text-gray-900">
                                                        {contribution.medicine?.name ||
                                                            contribution.payload?.name ||
                                                            'New Medicine'}
                                                    </div>

                                                    <div className="mt-1 text-xs text-gray-500">
                                                        {getContributionTypeLabel(
                                                            contribution.contribution_type
                                                        )}
                                                    </div>

                                                    {contribution.contribution_type === 'correction' ? (
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            {contribution.payload?.changes
                                                                ? `Changes: ${Object.keys(contribution.payload.changes).join(', ')}`
                                                                : contribution.field_name
                                                                    ? `Field: ${contribution.field_name}`
                                                                    : 'Multiple Fields'}
                                                        </div>
                                                    ) : null}
                                                </td>

                                                {/* GTIN / Barcode */}
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        <span className="font-medium">
                                                            GTIN:
                                                        </span>{' '}
                                                        {contribution.gtin || '—'}
                                                    </div>

                                                    <div className="mt-1 text-xs text-gray-500">
                                                        Barcode:{' '}
                                                        {contribution.barcode || '—'}
                                                    </div>
                                                </td>

                                                {/* Pharmacy */}
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {contribution.pharmacy?.name ||
                                                            `Pharmacy #${contribution.pharmacy_id}`}
                                                    </div>

                                                    {contribution.user && (
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            Submitted by:{' '}
                                                            {contribution.user.name}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Source */}
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getSourceClasses(
                                                            contribution.source
                                                        )}`}
                                                    >
                                                        {getSourceLabel(
                                                            contribution.source
                                                        )}
                                                    </span>
                                                </td>

                                                {/* Confidence */}
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span
                                                        className={`text-sm font-bold ${getConfidenceClasses(
                                                            contribution.confidence_score
                                                        )}`}
                                                    >
                                                        {Number(
                                                            contribution.confidence_score ?? 0
                                                        ).toFixed(0)}
                                                        %
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                                                            contribution.status
                                                        )}`}
                                                    >
                                                        {getStatusLabel(
                                                            contribution.status
                                                        )}
                                                    </span>
                                                </td>

                                                {/* Action */}
                                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                                    <Link
                                                        href={route(
                                                            'platform.global-medicine-contributions.show',
                                                            contribution.id
                                                        )}
                                                        className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-700"
                                                    >
                                                        Review
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-16 text-center"
                                            >
                                                <div className="text-sm font-medium text-gray-900">
                                                    No contributions found
                                                </div>

                                                <div className="mt-1 text-sm text-gray-500">
                                                    There are no contributions matching
                                                    the current filters.
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {contributions?.links?.length > 3 && (
                            <div className="border-t border-gray-200 px-6 py-4">
                                <div className="flex flex-wrap items-center justify-center gap-1">
                                    {contributions.links.map((link, index) => (
                                        <Link
                                            key={`${link.label}-${index}`}
                                            href={link.url || '#'}
                                            preserveScroll
                                            preserveState
                                            className={`rounded-lg px-3 py-2 text-sm ${
                                                link.active
                                                    ? 'bg-gray-900 text-white'
                                                    : link.url
                                                      ? 'bg-white text-gray-700 hover:bg-gray-100'
                                                      : 'cursor-not-allowed bg-gray-50 text-gray-400'
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}