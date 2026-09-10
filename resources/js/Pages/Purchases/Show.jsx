import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    CalendarDays,
    CreditCard,
    FileText,
    Package,
    Printer,
    Receipt,
    UserRound,
    Wallet,
} from 'lucide-react';

export default function Show({ purchase }) {
    const printPage = () => window.print();

    const items = purchase.items || [];

    return (
        <AppLayout title="Purchase Invoice">
            <Head title={`${purchase.purchase_number} | Pharmexa`} />

            <style>{`
                @media print {
                    body * {
                        visibility: hidden !important;
                    }

                    #purchase-invoice,
                    #purchase-invoice * {
                        visibility: visible !important;
                    }

                    #purchase-invoice {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                    }

                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            <div className="space-y-7">
                <section className="no-print overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition-colors">
                                <Receipt size={16} />
                                Purchase / Invoice
                            </div>

                            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
                                {purchase.purchase_number}
                            </h1>

                            <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-white/90">
                                Supplier purchase invoice details, received products,
                                payment summary, and inventory receiving record.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={route('purchases.index')}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-6 py-4 font-black text-white backdrop-blur transition hover:bg-white hover:text-blue-700 dark:bg-white dark:text-blue-300"
                            >
                                <ArrowLeft size={20} />
                                Back
                            </Link>

                            <button
                                type="button"
                                onClick={printPage}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-blue-700 shadow-xl transition hover:-translate-y-1 dark:bg-slate-900 dark:text-blue-300"
                            >
                                <Printer size={20} />
                                Print
                            </button>
                        </div>
                    </div>
                </section>

                                <section
                    id="purchase-invoice"
                    className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 transition-colors"
                >
                    <div className="flex flex-col justify-between gap-6 border-b border-slate-100 dark:border-slate-700 pb-6 lg:flex-row">
                        <div>
                            <h2 className="text-3xl font-black text-slate-950 dark:text-white">
                                PHARMEXA
                            </h2>
                            <p className="mt-1 text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                Pharmacy ERP Purchase Invoice
                            </p>
                            <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                                Riyadh, Saudi Arabia
                            </p>
                        </div>

                        <div className="text-left lg:text-right">
                            <p className="text-sm font-black text-slate-500 dark:text-slate-400">
                                Purchase No
                            </p>

                            <h3 className="mt-1 text-2xl font-black text-blue-700 dark:text-blue-300">
                                {purchase.purchase_number}
                            </h3>

                            <span
                                className={`mt-3 inline-flex rounded-full px-4 py-2 text-xs font-black ${
                                    purchase.payment_status === 'paid'
                                        ? 'bg-green-100 text-green-700'
                                        : purchase.payment_status === 'partial'
                                          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                                          : 'bg-rose-100 text-rose-700'
                                }`}
                            >
                                {purchase.payment_status}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-5 lg:grid-cols-4">
                        <InfoCard
                            icon={Building2}
                            label="Supplier"
                            value={purchase.supplier?.name || '-'}
                        />

                        <InfoCard
                            icon={FileText}
                            label="Supplier Invoice"
                            value={purchase.supplier_invoice_number || '-'}
                        />

                        <InfoCard
                            icon={CalendarDays}
                            label="Purchase Date"
                            value={formatDate(purchase.purchase_date)}
                        />

                        <InfoCard
                            icon={UserRound}
                            label="Created By"
                            value={purchase.user?.name || 'System'}
                        />
                    </div>

                    <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-700">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-slate-50 dark:bg-slate-800/70">
                                <tr>
                                    {[
                                        'Product',
                                        'Batch',
                                        'Expiry',
                                        'Quantity',
                                        'Purchase Price',
                                        'Selling Price',
                                        'Total',
                                    ].map((head) => (
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
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-5 py-5">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                                                    <Package size={20} />
                                                </div>

                                                <div>
                                                    <p className="font-black text-slate-950 dark:text-white">
                                                        {item.medicine?.name || item.medicine_name || 'Product'}
                                                    </p>

                                                    <p className="mt-1 text-xs font-bold text-slate-400 dark:text-slate-500">
                                                        ID: #{item.medicine_id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-5 font-bold text-slate-600 dark:text-slate-400">
                                            {item.batch_number || '-'}
                                        </td>

                                        <td className="px-5 py-5 font-bold text-slate-600 dark:text-slate-400">
                                            {formatDate(item.expiry_date)}
                                        </td>

                                        <td className="px-5 py-5 font-black text-blue-700 dark:text-blue-300">
                                            {item.quantity}
                                        </td>

                                        <td className="px-5 py-5 font-bold text-slate-600 dark:text-slate-400">
                                            {Number(item.purchase_price || 0).toFixed(2)} SAR
                                        </td>

                                        <td className="px-5 py-5 font-bold text-slate-600 dark:text-slate-400">
                                            {Number(item.selling_price || 0).toFixed(2)} SAR
                                        </td>

                                        <td className="px-5 py-5 font-black text-emerald-600 dark:text-emerald-400">
                                            {Number(item.total || 0).toFixed(2)} SAR
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                                        <div className="mt-8 grid gap-6 lg:grid-cols-3">
                        <div className="rounded-[2rem] bg-slate-50 p-6 dark:bg-slate-800/60 lg:col-span-2">
                            <h3 className="text-xl font-black text-slate-950 dark:text-white">
                                Notes
                            </h3>

                            <p className="mt-3 whitespace-pre-wrap text-sm font-bold text-slate-500 dark:text-slate-400">
                                {purchase.notes || 'No notes available.'}
                            </p>
                        </div>

                        <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 transition-colors">
                            <h3 className="text-xl font-black text-slate-950 dark:text-white">
                                Payment Summary
                            </h3>

                            <div className="mt-5 space-y-3">
                                <Summary label="Subtotal" value={purchase.subtotal} />
                                <Summary label="Discount" value={purchase.discount} />
                                <Summary label="Tax" value={purchase.tax} />

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                                    <Summary label="Total" value={purchase.total} big />
                                    <Summary label="Paid" value={purchase.paid_amount} />
                                    <Summary label="Balance" value={purchase.balance_amount} danger />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}

function InfoCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 p-5 dark:bg-slate-800/60">
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

function Summary({ label, value, big = false, danger = false }) {
    return (
        <div className="flex justify-between gap-4">
            <span className="font-bold text-slate-500 dark:text-slate-400">
                {label}
            </span>

            <span
                className={
                    big
                        ? 'text-xl font-black text-blue-700'
                        : danger
                          ? 'font-black text-rose-600'
                          : 'font-black text-slate-950 dark:text-white'
                }
            >
                {Number(value || 0).toFixed(2)} SAR
            </span>
        </div>
    );
}

function formatDate(date) {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}