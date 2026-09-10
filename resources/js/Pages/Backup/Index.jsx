import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Database, Download, ShieldCheck } from 'lucide-react';

export default function Index() {
    return (
        <AppLayout title="Backup & Restore">
            <Head title="Backup | Pharmexa" />

            <div className="space-y-8">
                <section className="rounded-[2rem] bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3">
                        <Database size={34} />

                        <h1 className="text-4xl font-black">
                            Backup & Restore
                        </h1>
                    </div>

                    <p className="mt-3 max-w-3xl text-lg text-white/90">
                        Protect your pharmacy data by downloading a secure backup
                        of your database anytime.
                    </p>
                </section>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm transition-colors">
                        <ShieldCheck
                            className="text-emerald-600 dark:text-emerald-400"
                            size={60}
                        />

                        <h2 className="mt-5 text-3xl font-black text-slate-900 dark:text-white">
                            Create Backup
                        </h2>

                        <p className="mt-3 text-slate-500 dark:text-slate-400">
                            Download the latest Pharmexa database. Store this
                            backup in a safe location to restore your pharmacy
                            if needed.
                        </p>

                        <a
    href={route('backup.download')}
    className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-emerald-600 px-6 py-4 font-black text-white transition hover:bg-emerald-700"
>
    <Download size={20} />
    Download Backup
</a>
                    </div>

                    <div className="rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-8 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                            Restore Backup
                        </h2>

                        <p className="mt-3 text-slate-500 dark:text-slate-400">
                            Restore functionality will be added in Pharmexa ERP
                            v1.1 for additional safety.
                        </p>

                        <div className="mt-10 rounded-2xl bg-white dark:bg-slate-900 p-6 text-center shadow-sm transition-colors">
                            <Database
                                className="mx-auto text-slate-400 dark:text-slate-500"
                                size={56}
                            />

                            <p className="mt-4 font-bold text-slate-500 dark:text-slate-400">
                                Restore Coming Soon
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}