import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Lock } from 'lucide-react';

export default function Edit({ purchase }) {
    return (
        <AppLayout title="Edit Purchase">
            <Head title={`Edit ${purchase.purchase_number} | Pharmexa`} />

            <div className="space-y-7">
                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-8 text-white shadow-2xl">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black backdrop-blur transition-colors">
                                <Lock size={16} />
                                Purchase Locked
                            </div>

                            <h1 className="mt-4 text-5xl font-black">
                                {purchase.purchase_number}
                            </h1>

                            <p className="mt-3 max-w-3xl leading-7 text-white/90">
                                This purchase has already been posted to inventory.
                                Editing is disabled to protect inventory accuracy.
                            </p>
                        </div>

                        <Link
                            href={route('purchases.show', purchase.id)}
                            className="rounded-2xl bg-white px-7 py-4 font-black text-blue-700 shadow-xl transition-colors dark:bg-white dark:text-blue-300"
                        >
                            ← View Purchase
                        </Link>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-4">
                    <div className="rounded-3xl bg-white p-6 shadow transition-colors dark:bg-slate-900">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            Purchase No
                        </p>

                        <h3 className="mt-2 text-2xl font-black">
                            {purchase.purchase_number}
                        </h3>
                    </div>

                    <div className="rounded-3xl bg-white p-6 shadow transition-colors dark:bg-slate-900">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            Supplier
                        </p>

                        <h3 className="mt-2 text-xl font-black">
                            {purchase.supplier?.name}
                        </h3>
                    </div>

                    <div className="rounded-3xl bg-white p-6 shadow transition-colors dark:bg-slate-900">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            Purchase Total
                        </p>

                        <h3 className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            {Number(purchase.total).toFixed(2)} SAR
                        </h3>
                    </div>

                    <div className="rounded-3xl bg-white p-6 shadow transition-colors dark:bg-slate-900">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            Status
                        </p>

                        <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-4 py-2 font-black text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            Posted to Inventory
                        </span>
                    </div>
                </section>

                <section className="rounded-3xl border border-amber-300 bg-amber-50 p-8 dark:bg-amber-950/30">
                    <h2 className="text-2xl font-black text-amber-900 dark:text-amber-200">
                        Editing is disabled
                    </h2>

                    <p className="mt-4 leading-8 text-amber-800 dark:text-amber-200">
                        This purchase has already updated product inventory.

                        Professional ERP systems such as SAP, Oracle,
                        Microsoft Dynamics, and Odoo do not allow direct
                        editing after inventory posting.
                    </p>

                    <div className="mt-6 rounded-2xl bg-white p-6 transition-colors dark:bg-slate-900">
                        <h3 className="font-black text-slate-900 dark:text-white">
                            Recommended Actions
                        </h3>

                        <ul className="mt-4 space-y-3 text-slate-700 dark:text-slate-200">
                            <li>✅ View Purchase Details</li>

                            <li>✅ Print Purchase Invoice</li>

                            <li>✅ Create Purchase Return</li>

                            <li>✅ Perform Stock Adjustment</li>
                        </ul>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}