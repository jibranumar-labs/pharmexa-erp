import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

export default function Logs({ logs = [] }) {
    return (
        <AppLayout title="Saudi RSD Logs">
            <Head title="Saudi RSD Logs" />

            <div className="space-y-8">

                {/* Header */}
                <div className="rounded-3xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
                    <h1 className="text-4xl font-black">
                        📜 Saudi RSD Logs
                    </h1>

                    <p className="mt-3 text-lg text-slate-300">
                        View communication logs with the Saudi RSD service.
                    </p>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

                    <table className="min-w-full">

                        <thead className="bg-slate-100 dark:bg-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Operation</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Message</th>
                            </tr>
                        </thead>

                        <tbody>

                            {logs.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="py-16 text-center text-slate-500"
                                    >
                                        No logs available.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="border-t"
                                    >
                                        <td className="px-6 py-4">
                                            {log.created_at}
                                        </td>

                                        <td className="px-6 py-4">
                                            {log.operation}
                                        </td>

                                        <td className="px-6 py-4">
                                            {log.status}
                                        </td>

                                        <td className="px-6 py-4">
                                            {log.message}
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                </div>

            </div>
        </AppLayout>
    );
}