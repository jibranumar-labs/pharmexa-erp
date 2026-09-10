import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ contribution }) {
    const [reviewNote, setReviewNote] = useState('');
    const [processing, setProcessing] = useState(false);

    const isPending = contribution.status === 'pending';
    const isApproved = contribution.status === 'approved';
    const isRejected = contribution.status === 'rejected';

    const approve = () => {
        if (!isPending || processing) {
            return;
        }

        if (
            !window.confirm(
                'Are you sure you want to approve this contribution? This will update the global medicine catalogue.'
            )
        ) {
            return;
        }

        setProcessing(true);

        router.post(
            route(
                'platform.global-medicine-contributions.approve',
                contribution.id
            ),
            {
                review_note: reviewNote || null,
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            }
        );
    };

    const reject = () => {
        if (!isPending || processing) {
            return;
        }

        if (!reviewNote.trim()) {
            window.alert('Please enter a review note before rejecting.');
            return;
        }

        if (
            !window.confirm(
                'Are you sure you want to reject this contribution?'
            )
        ) {
            return;
        }

        setProcessing(true);

        router.post(
            route(
                'platform.global-medicine-contributions.reject',
                contribution.id
            ),
            {
                review_note: reviewNote,
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            }
        );
    };

    const formatDate = (value) => {
        if (!value) {
            return '—';
        }

        return new Date(value).toLocaleString();
    };

    const formatValue = (value) => {
        if (value === null || value === undefined || value === '') {
            return '—';
        }

        if (typeof value === 'object') {
            return JSON.stringify(value, null, 2);
        }

        return String(value);
    };

    const statusClass = isPending
        ? 'bg-amber-100 text-amber-800'
        : isApproved
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-red-100 text-red-800';

    return (
        <>
            <Head title={`Contribution #${contribution.id}`} />

            <div className="min-h-screen bg-gray-50 px-4 py-8">
                <div className="mx-auto max-w-6xl">

                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-2">
                                <Link
                                    href={route(
                                        'platform.global-medicine-contributions.index'
                                    )}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    ← Back to Contributions
                                </Link>
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900">
                                Global Medicine Contribution #{contribution.id}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Review this contribution before publishing it
                                to the global medicine catalogue.
                            </p>
                        </div>

                        <span
                            className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${statusClass}`}
                        >
                            {contribution.status?.toUpperCase()}
                        </span>
                    </div>

                    {/* Main information */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* Left / Main */}
                        <div className="space-y-6 lg:col-span-2">

                            {/* Contribution information */}
                            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                    Contribution Information
                                </h2>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                    <Info
                                        label="Contribution Type"
                                        value={
                                            contribution.contribution_type ===
                                            'new_medicine'
                                                ? 'New Medicine'
                                                : 'Correction'
                                        }
                                    />

                                    <Info
                                        label="Source"
                                        value={contribution.source}
                                    />

                                    <Info
                                        label="Pharmacy"
                                        value={
                                            contribution.pharmacy?.name ??
                                            contribution.pharmacy?.business_name ??
                                            `Pharmacy #${contribution.pharmacy_id}`
                                        }
                                    />

                                    <Info
                                        label="Submitted By"
                                        value={
                                            contribution.user?.name ??
                                            `User #${contribution.user_id ?? '—'}`
                                        }
                                    />

                                    <Info
                                        label="Submitted At"
                                        value={formatDate(
                                            contribution.created_at
                                        )}
                                    />

                                    <Info
                                        label="Confidence Score"
                                        value={
                                            contribution.confidence_score !==
                                            null
                                                ? `${contribution.confidence_score}%`
                                                : '—'
                                        }
                                    />
                                </div>
                            </div>

                            {/* Barcode / GS1 information */}
                            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                    GS1 / Barcode Information
                                </h2>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                    <Info
                                        label="GTIN"
                                        value={contribution.gtin}
                                        mono
                                    />

                                    <Info
                                        label="Barcode"
                                        value={contribution.barcode}
                                        mono
                                    />

                                    <Info
                                        label="Changes"
                                        value={
                                            contribution.payload?.changes
                                                ? Object.keys(contribution.payload.changes).join(', ')
                                                : contribution.field_name || 'Multiple Fields'
                                        }
                                    />

                                    <Info
                                        label="Medicine ID"
                                        value={
                                            contribution.medicine_id ??
                                            'New Medicine'
                                        }
                                    />
                                </div>

                                {contribution.raw_gs1_data && (
                                    <div className="mt-5">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Raw GS1 Data
                                        </label>

                                        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                                            {contribution.raw_gs1_data}
                                        </pre>
                                    </div>
                                )}
                            </div>

                            {/* Correction comparison */}
                            {contribution.contribution_type ===
                                'correction' && (
                                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                        Proposed Correction
                                    </h2>

                                    {getChanges().length > 0 ? (
                                        <div className="space-y-3">
                                            {getChanges().map(([field, change]) => (
                                                <div
                                                    key={field}
                                                    className="rounded-xl border border-gray-200 p-4"
                                                >
                                                    <div className="mb-3 flex items-center justify-between gap-3">
                                                        <span className="text-sm font-bold capitalize text-gray-900">
                                                            {field.replaceAll('_', ' ')}
                                                        </span>
                                                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                                            Change
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-700">
                                                                Current / Old Value
                                                            </p>
                                                            <p className="break-words font-mono text-sm text-red-900">
                                                                {formatValue(change?.old)}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                                                Proposed Value
                                                            </p>
                                                            <p className="break-words font-mono text-sm text-emerald-900">
                                                                {formatValue(change?.new)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            No correction details were supplied.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* New medicine payload */}
                            {contribution.contribution_type ===
                                'new_medicine' && (
                                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                        New Medicine Data
                                    </h2>

                                    {contribution.payload &&
                                    Object.keys(contribution.payload).length >
                                        0 ? (
                                        <div className="space-y-3">
                                            {Object.entries(
                                                contribution.payload
                                            ).map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="grid grid-cols-1 gap-2 border-b border-gray-100 pb-3 last:border-0 sm:grid-cols-3"
                                                >
                                                    <div className="text-sm font-medium capitalize text-gray-600">
                                                        {key.replaceAll(
                                                            '_',
                                                            ' '
                                                        )}
                                                    </div>

                                                    <div className="break-words text-sm text-gray-900 sm:col-span-2">
                                                        {formatValue(value)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            No additional medicine data was
                                            supplied.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Review history */}
                            {!isPending && (
                                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                        Review Information
                                    </h2>

                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                        <Info
                                            label="Reviewed By"
                                            value={
                                                contribution.reviewed_by
                                                    ? contribution.reviewedBy
                                                        ?.name ??
                                                      `User #${contribution.reviewed_by}`
                                                    : '—'
                                            }
                                        />

                                        <Info
                                            label="Reviewed At"
                                            value={formatDate(
                                                contribution.reviewed_at
                                            )}
                                        />
                                    </div>

                                    {contribution.review_note && (
                                        <div className="mt-5 rounded-lg bg-gray-50 p-4">
                                            <p className="mb-2 text-sm font-medium text-gray-700">
                                                Review Note
                                            </p>

                                            <p className="whitespace-pre-wrap text-sm text-gray-800">
                                                {contribution.review_note}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right / Actions */}
                        <div>
                            <div className="sticky top-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">

                                <h2 className="text-lg font-semibold text-gray-900">
                                    Review
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Carefully verify the submitted information
                                    before approving it.
                                </p>

                                {isPending ? (
                                    <>
                                        <div className="mt-6">
                                            <label
                                                htmlFor="review_note"
                                                className="mb-2 block text-sm font-medium text-gray-700"
                                            >
                                                Review Note
                                            </label>

                                            <textarea
                                                id="review_note"
                                                value={reviewNote}
                                                onChange={(e) =>
                                                    setReviewNote(
                                                        e.target.value
                                                    )
                                                }
                                                rows={5}
                                                maxLength={5000}
                                                placeholder="Optional for approval. Required when rejecting."
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            />

                                            <p className="mt-1 text-right text-xs text-gray-400">
                                                {reviewNote.length}/5000
                                            </p>
                                        </div>

                                        <div className="mt-6 space-y-3">

                                            <button
                                                type="button"
                                                onClick={approve}
                                                disabled={processing}
                                                className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {processing
                                                    ? 'Processing...'
                                                    : 'Approve Contribution'}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={reject}
                                                disabled={processing}
                                                className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {processing
                                                    ? 'Processing...'
                                                    : 'Reject Contribution'}
                                            </button>
                                        </div>

                                        <div className="mt-5 rounded-lg bg-amber-50 p-4">
                                            <p className="text-xs leading-5 text-amber-800">
                                                <strong>Important:</strong>{' '}
                                                approving a contribution can
                                                update the global medicine
                                                catalogue and synchronize
                                                eligible pharmacy records.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="mt-6 rounded-lg bg-gray-50 p-4">
                                        <p className="text-sm font-medium text-gray-800">
                                            This contribution has already been{' '}
                                            {isApproved
                                                ? 'approved.'
                                                : isRejected
                                                    ? 'rejected.'
                                                    : 'processed.'}
                                        </p>

                                        <p className="mt-2 text-xs text-gray-500">
                                            No further review action is
                                            available.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

/*
|--------------------------------------------------------------------------
| Reusable information field
|--------------------------------------------------------------------------
*/

function Info({ label, value, mono = false }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {label}
            </p>

            <p
                className={`mt-1 break-words text-sm text-gray-900 ${
                    mono ? 'font-mono' : ''
                }`}
            >
                {value === null ||
                value === undefined ||
                value === '' ? (
                    '—'
                ) : (
                    value
                )}
            </p>
        </div>
    );
}