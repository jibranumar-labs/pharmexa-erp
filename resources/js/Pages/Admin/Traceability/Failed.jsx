import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

export default function Failed({ transactions = [] }) {
    return (
        <AppLayout title="Failed Saudi RSD Transactions">
            <Head title="Failed Saudi RSD Transactions" />

            <div className="space-y-8">

                {/* Header */}
                <div className="rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-800 p-8 text-white shadow-xl">
                    <h1 className="text-4xl font-black">
                        ❌ Failed Transactions
                    </h1>

                    <p className="mt-3 text-lg text-red-100">
                        Transactions that failed to send to Saudi RSD.
                    </p>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

                    <table className="min-w-full">

                        <thead className="bg-slate-100 dark:bg-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left">Invoice</th>
                                <th className="px-6 py-4 text-left">Operation</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Error</th>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {transactions.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="py-16 text-center text-slate-500"
                                    >
                                        No failed transactions found.
                                    </td>
                                </tr>
                            )}

                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className="border-t">

                                    <td className="px-6 py-4">
                                        {transaction.sale?.invoice_number ?? '-'}
                                    </td>

                                    <td className="px-6 py-4 capitalize">
                                        {transaction.operation}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                                            Failed
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        {transaction.response_message ?? '-'}
                                    </td>

                                    <td className="px-6 py-4">
                                        {transaction.created_at}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <button
                                            className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                                        >
                                            Retry
                                        </button>
                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>

            </div>
        </AppLayout>
    );
}