import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Activity, Clock, Monitor, User } from 'lucide-react';

export default function Index({ logs }) {
    return (
        <AppLayout title="Activity Logs">
            <Head title="Activity Logs | Pharmexa" />

            <div className="space-y-7">

                <section className="rounded-[2rem] bg-gradient-to-r from-slate-800 via-blue-700 to-cyan-600 p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3">
                        <Activity size={34} />
                        <h1 className="text-4xl font-black">
                            Activity Logs
                        </h1>
                    </div>

                    <p className="mt-3 max-w-3xl text-white/90">
                        Track every important action performed inside Pharmexa ERP.
                    </p>
                </section>

                <section className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">

                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead>

                                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">

                                    <th className="px-4 py-4 text-left font-black">
                                        User
                                    </th>

                                    <th className="px-4 py-4 text-left font-black">
                                        Module
                                    </th>

                                    <th className="px-4 py-4 text-left font-black">
                                        Action
                                    </th>

                                    <th className="px-4 py-4 text-left font-black">
                                        Record
                                    </th>

                                    <th className="px-4 py-4 text-left font-black">
                                        IP Address
                                    </th>

                                    <th className="px-4 py-4 text-left font-black">
                                        Time
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {logs.data.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="py-10 text-center font-bold text-slate-500 dark:text-slate-400"
                                        >
                                            No activity logs found.
                                        </td>

                                    </tr>

                                ) : (

                                    logs.data.map((log) => (

                                        <tr
                                            key={log.id}
                                            className="border-b border-slate-200 dark:border-slate-700 transition hover:bg-blue-50"
                                        >

                                            <td className="px-4 py-4">

                                                <div className="flex items-center gap-2">

                                                    <User
                                                        size={16}
                                                        className="text-blue-600"
                                                    />

                                                    <span className="font-bold">
                                                        {log.user?.name || 'System'}
                                                    </span>

                                                </div>

                                            </td>

                                            <td className="px-4 py-4 font-semibold">
                                                {log.module}
                                            </td>

                                            <td className="px-4 py-4">

                                                <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 px-3 py-1 text-sm font-bold text-blue-700 dark:text-blue-300">
                                                    {log.action}
                                                </span>

                                            </td>

                                            <td className="px-4 py-4 font-semibold">
                                                {log.record_name ?? log.record ?? '-'}
                                            </td>

                                            <td className="px-4 py-4">

                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">

                                                    <Monitor size={16} />

                                                    {log.ip_address || '-'}

                                                </div>

                                            </td>

                                            <td className="px-4 py-4">

                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">

                                                    <Clock size={16} />

                                                    {new Date(log.created_at).toLocaleString()}

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            </div>

        </AppLayout>
    );
}