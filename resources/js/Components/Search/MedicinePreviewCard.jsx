import { Link } from "@inertiajs/react";
import Icon from "@/Components/UI/Icon";

export default function MedicinePreviewCard({
    medicine,
    onClose,
}) {
    if (!medicine) return null;

    const stockBadge = () => {
        switch (medicine.stock_status) {
            case "Out of Stock":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";

            case "Low Stock":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";

            default:
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
        }
    };

    return (
        <div className="absolute left-full top-0 ml-4 z-50 w-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 transition-colors">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">

                <div className="flex items-center gap-3">

                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-100 text-2xl dark:bg-teal-900/40">
                        💊
                    </div>

                    <div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {medicine.name}
                        </h3>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {medicine.generic_name || "-"}
                        </p>

                    </div>

                </div>

                <button
                    onClick={onClose}
                    className="rounded-lg p-2 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800"
                >
                    ✕
                </button>

            </div>

            <div className="space-y-4 p-6">

                <div className="grid grid-cols-2 gap-4 text-sm">

                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Category</p>
                        <p className="font-semibold">
                            {medicine.category || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Manufacturer</p>
                        <p className="font-semibold">
                            {medicine.manufacturer || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Supplier</p>
                        <p className="font-semibold">
                            {medicine.supplier || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Unit</p>
                        <p className="font-semibold">
                            {medicine.unit || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Barcode</p>
                        <p className="font-semibold">
                            {medicine.barcode || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-500 dark:text-slate-400">SKU</p>
                        <p className="font-semibold">
                            {medicine.sku || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Batch</p>
                        <p className="font-semibold">
                            {medicine.batch_number || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Expiry</p>
                        <p className="font-semibold">
                            {medicine.expiry_date || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-500 dark:text-slate-400">
                            Selling Price
                        </p>

                        <p className="font-semibold text-teal-600">
                            {medicine.selling_price} SAR
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-500 dark:text-slate-400">
                            Purchase Price
                        </p>

                        <p className="font-semibold">
                            {medicine.purchase_price} SAR
                        </p>
                    </div>

                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

                    <div>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Stock
                        </p>

                        <p className="text-xl font-bold">
                            {medicine.stock_quantity}
                        </p>

                    </div>

                    <span
                        className={`rounded-full px-4 py-2 text-xs font-bold ${stockBadge()}`}
                    >
                        {medicine.stock_status}
                    </span>

                </div>

            </div>

          <div className="grid grid-cols-2 gap-3 border-t border-slate-200 p-5 dark:border-slate-700">
                <Link
                    href={route("medicines.show", medicine.id)}
                    className="flex-1 rounded-xl bg-slate-200 py-2 text-center font-semibold hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                >
                    View
                </Link>

                <Link
                    href={route("medicines.edit", medicine.id)}
                    className="flex-1 rounded-xl bg-teal-600 py-2 text-center font-semibold text-white hover:bg-teal-700"
                >
                    Edit
                </Link>

                

            </div>

        </div>
    );
}