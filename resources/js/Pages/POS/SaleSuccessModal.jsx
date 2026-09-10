import {
    CheckCircle2,
    Receipt,
    Printer,
    Sticker,
    Plus,
    X,
} from "lucide-react";

export default function SaleSuccessModal({
    open,
    sale,
    onClose,
    onNewSale,
}) {
    if (!open || !sale) return null;

    const openWindow = (url) => {
    window.open(
        url,
        "printWindow",
        "width=500,height=850,left=200,top=50,scrollbars=yes,resizable=yes"
    );
};

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md">

            <div className="flex min-h-screen items-center justify-center p-4">

                <div className="w-full max-w-xl max-h-[95vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 shadow-2xl transition-colors">

                    {/* Header */}

                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center text-white">

                        <CheckCircle2
                            size={74}
                            strokeWidth={2.5}
                            className="mx-auto"
                        />

                        <h2 className="mt-4 text-3xl font-black">
                            Sale Completed
                        </h2>

                        <p className="mt-2 text-white/90">
                            The sale has been completed successfully.
                        </p>

                    </div>

                    {/* Invoice */}

                    <div className="space-y-4 p-8">

                        <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                            <span className="font-bold text-slate-500 dark:text-slate-400">
                                Invoice No.
                            </span>

                            <span className="font-black">
                                {sale.invoice_number}
                            </span>
                        </div>

                        <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                            <span className="font-bold text-slate-500 dark:text-slate-400">
                                Customer
                            </span>

                            <span className="font-black">
                                {sale.customer_name}
                            </span>
                        </div>

                        <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                            <span className="font-bold text-slate-500 dark:text-slate-400">
                                Total
                            </span>

                            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                {Number(sale.total).toFixed(2)} SAR
                            </span>
                        </div>

                    </div>

                    {/* Print Buttons */}

                    <div className="grid gap-3 px-8">

                        <button
                            type="button"
                            onClick={() => openWindow(route("sales.thermal", sale.id))}
                            className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 font-black text-white transition hover:bg-blue-700"
                        >
                            <Printer size={20} />
                            Print Thermal Receipt
                        </button>

                        {/* <button
                            type="button"
                            onClick={() => openWindow(route("sales.print", sale.id))}
                            className="flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-4 font-black text-white transition hover:bg-emerald-700"
                        >
                            <Receipt size={20} />
                            Print A4 Invoice
                        </button> */}

                        {sale.items?.length > 0 && (
                            <button
                                type="button"
                                onClick={() =>
                                    openWindow(
                                        route("sales.dosage-stickers", sale.id)
                                    )
                                }
                                className="flex items-center justify-center gap-3 rounded-2xl bg-purple-600 py-4 font-black text-white transition hover:bg-purple-700"
                            >
                                <Sticker size={20} />
                                Print All Dosage Stickers ({sale.items.length})
                            </button>
                        )}

                    </div>

                    {/* Footer */}

                    <div className="sticky bottom-0 mt-8 flex gap-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition-colors">

                        <button
                            type="button"
                            onClick={onNewSale}
                            className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 font-black text-white transition hover:scale-[1.01]"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <Plus size={18} />
                                New Sale
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-slate-300 dark:border-slate-700 px-5 py-4 transition hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        >
                            <X size={20} />
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}