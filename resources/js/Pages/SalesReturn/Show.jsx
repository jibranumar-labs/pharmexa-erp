import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    RotateCcw,
    Receipt,
    DollarSign,
    Calendar,
    User,
    FileText,
    ArrowLeft,
    Printer,
} from 'lucide-react';

export default function Show({ saleReturn }) {
    return (
        <AppLayout title="Sales Return Details">

            <Head title="Sales Return Details | Pharmexa" />

            <div className="space-y-7">

                <section className="rounded-[2rem] bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 p-8 text-white shadow-2xl">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black transition-colors">
                                <RotateCcw size={18} />
                                Sales Return Details
                            </div>

                            <h1 className="mt-5 text-5xl font-black">
                                {saleReturn.return_number}
                            </h1>

                            <p className="mt-2 text-white/90">
                                Complete sales return information.
                            </p>

                        </div>

                       <div className="flex gap-3">

    <a
        href={route('sale-returns.print', saleReturn.id)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-black text-white transition hover:bg-emerald-700"
    >
        <Printer size={18} />
        Print
    </a>

    <Link
        href={route('sale-returns.index')}
        className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-6 py-3 font-black text-red-700 dark:text-red-300 transition-colors"
    >
        <ArrowLeft size={18} />
        Back
    </Link>

</div>

                    </div>

                </section>

                <section className="grid gap-6 md:grid-cols-2">

                    <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm transition-colors">

                        <h2 className="mb-6 text-2xl font-black">
                            Return Information
                        </h2>

                        <Info
                            icon={Receipt}
                            title="Return Number"
                            value={saleReturn.return_number}
                        />

                        <Info
                            icon={Receipt}
                            title="Invoice Number"
                            value={saleReturn.sale?.invoice_number}
                        />

                        <Info
                            icon={DollarSign}
                            title="Refund Amount"
                            value={`${Number(saleReturn.refund_amount).toFixed(2)} SAR`}
                        />

                        <Info
                            icon={Calendar}
                            title="Return Date"
                            value={saleReturn.return_date}
                        />

                        <Info
                            icon={User}
                            title="Processed By"
                            value={saleReturn.user?.name || '-'}
                        />

                    </div>

                    <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm transition-colors">

                        <h2 className="mb-6 text-2xl font-black">
                            Return Notes
                        </h2>

                        <div className="flex items-start gap-3">

                            <FileText
                                size={22}
                                className="mt-1 text-slate-500 dark:text-slate-400"
                            />

                            <div>

                                <p className="font-bold">
                                    Reason
                                </p>

                                <p className="mb-6 text-slate-600 dark:text-slate-400">
                                    {saleReturn.reason || 'No reason provided.'}
                                </p>

                                <p className="font-bold">
                                    Notes
                                </p>

                                <p className="text-slate-600 dark:text-slate-400">
                                    {saleReturn.notes || 'No notes available.'}
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

                <section className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm transition-colors">

                    <h2 className="mb-6 text-2xl font-black">
                        Returned Products
                    </h2>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-100 dark:bg-slate-800">

                                <tr>

                                    <th className="p-4 text-left">
                                        Product
                                    </th>

                                    <th className="p-4 text-left">
                                        Quantity
                                    </th>

                                    <th className="p-4 text-left">
                                        Unit Price
                                    </th>

                                    <th className="p-4 text-left">
                                        Total
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {saleReturn.items && saleReturn.items.length > 0 ? (

                                    saleReturn.items.map((item) => (

                                        <tr
                                            key={item.id}
                                            className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800"
                                        >

                                            <td className="p-4">
                                                {item.medicine?.name}
                                            </td>

                                            <td className="p-4">
                                                {item.quantity}
                                            </td>

                                            <td className="p-4">
                                                {Number(item.unit_price).toFixed(2)} SAR
                                            </td>

                                            <td className="p-4 font-black text-emerald-600 dark:text-emerald-400">
                                                {Number(item.total_price).toFixed(2)} SAR
                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="p-8 text-center text-slate-500 dark:text-slate-400"
                                        >
                                            No returned products found.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            </div>

        </AppLayout>
    );
}

function Info({
    icon: Icon,
    title,
    value,
}) {
    return (
        <div className="mb-5 flex items-start gap-4 rounded-xl border p-4">

            <div className="rounded-xl bg-red-100 dark:bg-red-900/40 p-3 text-red-700 dark:text-red-300">
                <Icon size={20} />
            </div>

            <div>

                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    {title}
                </p>

                <h3 className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                    {value || '-'}
                </h3>

            </div>

        </div>
    );
}