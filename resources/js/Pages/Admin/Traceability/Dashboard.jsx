import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Dashboard() {
    const cards = [
        {
            title: 'Connection',
            value: 'Not Connected',
            color: 'text-red-600',
        },
        {
            title: 'Environment',
            value: 'Sandbox',
            color: 'text-amber-600',
        },
        {
            title: 'Pending',
            value: '0',
            color: 'text-blue-600',
        },
        {
            title: 'Successful',
            value: '0',
            color: 'text-green-600',
        },
        {
            title: 'Failed',
            value: '0',
            color: 'text-red-600',
        },
        {
            title: 'Last Sync',
            value: 'Never',
            color: 'text-slate-700 dark:text-slate-300',
        },
    ];

    /**
     * Synchronize medicines with Saudi RSD.
     */
    const synchronizeMedicines = () => {
        router.post(
            route('admin.traceability.sync.drugs'),
            {},
            {
                preserveScroll: true,
                onStart: () => {
                    console.log('Medicine synchronization started.');
                },
                onSuccess: () => {
                    console.log('Medicine synchronization completed.');
                },
                onError: (errors) => {
                    console.error(
                        'Medicine synchronization failed:',
                        errors
                    );
                },
            }
        );
    };

    return (
        <AppLayout title="Saudi RSD">
            <Head title="Saudi RSD Dashboard" />

            <div className="space-y-8">

                {/* Header */}

                <div className="rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-700 to-slate-900 p-8 text-white shadow-xl">

                    <h1 className="text-4xl font-black">
                        🇸🇦 Saudi RSD
                    </h1>

                    <p className="mt-3 text-cyan-100">
                        Saudi Drug Traceability System
                    </p>

                    <p className="mt-1 text-cyan-200">
                        Integrated with Pharmexa ERP
                    </p>

                </div>

                {/* Statistics */}

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                    {cards.map((card) => (

                        <div
                            key={card.title}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                        >

                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                {card.title}
                            </p>

                            <h2
                                className={`mt-4 text-3xl font-black ${card.color}`}
                            >
                                {card.value}
                            </h2>

                        </div>

                    ))}

                </div>

                {/* Quick Actions */}

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">

                    <h2 className="text-xl font-black">
                        Quick Actions
                    </h2>

                    <div className="mt-6 flex flex-wrap gap-4">

                        {/* Connect to RSD */}

                        <button
                            type="button"
                            onClick={() => {
                                console.log('Connect to RSD clicked.');
                            }}
                            className="rounded-2xl bg-cyan-600 px-6 py-3 font-bold text-white transition hover:bg-cyan-700"
                        >
                            Connect to RSD
                        </button>

                        {/* Synchronize Medicines */}

                        <button
                            type="button"
                            onClick={synchronizeMedicines}
                            className="rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
                        >
                            Synchronize Medicines
                        </button>

                        {/* Send Pending Transactions */}

                        <button
                            type="button"
                            onClick={() => {
                                console.log(
                                    'Send Pending Transactions clicked.'
                                );
                            }}
                            className="rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700"
                        >
                            Send Pending Transactions
                        </button>

                        {/* Retry Failed */}

                        <button
                            type="button"
                            onClick={() => {
                                console.log('Retry Failed clicked.');
                            }}
                            className="rounded-2xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
                        >
                            Retry Failed
                        </button>

                    </div>

                </div>

                {/* Recent Activity */}

                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

                    <div className="border-b border-slate-200 p-6 dark:border-slate-700">

                        <h2 className="text-xl font-black">
                            Recent RSD Activity
                        </h2>

                    </div>

                    <div className="p-10 text-center">

                        <p className="text-slate-500 dark:text-slate-400">
                            No traceability transactions available.
                        </p>

                    </div>

                </div>

            </div>
        </AppLayout>
    );
}