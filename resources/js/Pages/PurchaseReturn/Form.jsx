import { useForm } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Package,
    RotateCcw,
} from 'lucide-react';

export default function Form({
    purchases = [],
    submitLabel = 'Save Return',
}) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        transform,
    } = useForm({
        purchase_id: '',
        return_date: new Date().toISOString().split('T')[0],
        reason: '',
        notes: '',
        items: [],
    });

    /*
     * Currently selected purchase.
     */
    const selectedPurchase = purchases.find(
        (purchase) =>
            String(purchase.id) === String(data.purchase_id)
    );

    /*
     * Products that still have quantity available for return.
     */
    const returnableItems =
        selectedPurchase?.items?.filter(
            (item) =>
                Number(item.returnable_quantity || 0) > 0
        ) ?? [];

    /*
     * Change purchase and initialise all returnable items
     * with return quantity 0.
     */
    const changePurchase = (purchaseId) => {
        const purchase = purchases.find(
            (item) =>
                String(item.id) === String(purchaseId)
        );

        setData({
            ...data,

            purchase_id: purchaseId,

            items:
                purchase?.items
                    ?.filter(
                        (item) =>
                            Number(
                                item.returnable_quantity || 0
                            ) > 0
                    )
                    .map((item) => ({
                        purchase_item_id: item.id,
                        quantity: 0,
                    })) ?? [],
        });
    };

    /*
     * Current entered quantity for an item.
     */
    const getReturnQuantity = (purchaseItemId) => {
        const row = data.items.find(
            (item) =>
                Number(item.purchase_item_id) ===
                Number(purchaseItemId)
        );

        return Number(row?.quantity || 0);
    };

    /*
     * Update return quantity safely.
     */
    const updateQuantity = (
        purchaseItemId,
        value,
        maximum
    ) => {
        let quantity = Number(value);

        if (
            Number.isNaN(quantity) ||
            quantity < 0
        ) {
            quantity = 0;
        }

        quantity = Math.floor(quantity);

        const maxQuantity = Number(maximum || 0);

        if (quantity > maxQuantity) {
            quantity = maxQuantity;
        }

        setData(
            'items',
            data.items.map((item) =>
                Number(item.purchase_item_id) ===
                Number(purchaseItemId)
                    ? {
                          ...item,
                          quantity,
                      }
                    : item
            )
        );
    };

    /*
     * Preview return total.
     *
     * The backend calculates the amount again securely.
     */
    const returnTotal = returnableItems.reduce(
        (total, item) => {
            const quantity =
                getReturnQuantity(item.id);

            const purchasePrice =
                Number(item.purchase_price || 0);

            return total + quantity * purchasePrice;
        },
        0
    );

    /*
     * Total number of units selected for return.
     */
    const selectedQuantity = data.items.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    /*
     * Number of product lines selected.
     */
    const selectedLines = data.items.filter(
        (item) =>
            Number(item.quantity || 0) > 0
    ).length;

    /*
     * Submit only items with quantity > 0.
     *
     * transform() modifies the outgoing payload without
     * depending on an asynchronous setData call.
     */
    const submit = (e) => {
        e.preventDefault();

        if (!data.purchase_id) {
            return;
        }

        if (selectedQuantity <= 0) {
            return;
        }

        transform((formData) => ({
            ...formData,

            items: formData.items
                .filter(
                    (item) =>
                        Number(item.quantity || 0) > 0
                )
                .map((item) => ({
                    purchase_item_id:
                        Number(item.purchase_item_id),

                    quantity:
                        Number(item.quantity),
                })),
        }));

        post(route('purchase-returns.store'), {
            preserveScroll: true,
        });
    };

    return (
        <form
            onSubmit={submit}
            className="space-y-7"
        >
            {/* Purchase Selection */}

            <div>
                <label className="mb-2 block font-bold text-slate-900 dark:text-white">
                    Purchase Invoice
                </label>

                <select
                    value={data.purchase_id}
                    onChange={(e) =>
                        changePurchase(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-900/40"
                >
                    <option value="">
                        Select Purchase
                    </option>

                    {purchases.map((purchase) => (
                        <option
                            key={purchase.id}
                            value={purchase.id}
                        >
                            {purchase.purchase_number}
                            {' - '}
                            {Number(
                                purchase.total || 0
                            ).toFixed(2)}
                            {' SAR'}
                            {purchase.has_returnable_items
                                ? ''
                                : ' - Fully Returned'}
                        </option>
                    ))}
                </select>

                {errors.purchase_id && (
                    <p className="mt-2 text-sm font-bold text-red-600 dark:text-red-400">
                        {errors.purchase_id}
                    </p>
                )}
            </div>

            {/* Selected Purchase Information */}

            {selectedPurchase && (
                <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                                Purchase
                            </p>

                            <p className="mt-1 font-black text-slate-900 dark:text-white">
                                {selectedPurchase.purchase_number}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                                Supplier
                            </p>

                            <p className="mt-1 font-black text-slate-900 dark:text-white">
                                {selectedPurchase.supplier?.name || '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                                Purchase Total
                            </p>

                            <p className="mt-1 font-black text-slate-900 dark:text-white">
                                {Number(
                                    selectedPurchase.total || 0
                                ).toFixed(2)}{' '}
                                SAR
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Products */}

            {selectedPurchase && (
                <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="border-b border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-3">
                            <Package
                                size={22}
                                className="text-blue-600 dark:text-blue-400"
                            />

                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white">
                                    Products
                                </h3>

                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Enter the quantity you want to return.
                                </p>
                            </div>
                        </div>
                    </div>

                    {returnableItems.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white dark:bg-slate-900">
                                    <tr>
                                        <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                                            Product
                                        </th>

                                        <th className="px-5 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                                            Purchased
                                        </th>

                                        <th className="px-5 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                                            Returned
                                        </th>

                                        <th className="px-5 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                                            Available
                                        </th>

                                        <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-500">
                                            Price
                                        </th>

                                        <th className="px-5 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                                            Return Qty
                                        </th>

                                        <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-500">
                                            Total
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-900">
                                    {returnableItems.map((item) => {
                                        const quantity =
                                            getReturnQuantity(
                                                item.id
                                            );

                                        const lineTotal =
                                            quantity *
                                            Number(
                                                item.purchase_price || 0
                                            );

                                        return (
                                            <tr key={item.id}>
                                                <td className="px-5 py-5">
                                                    <p className="font-black text-slate-900 dark:text-white">
                                                        {item.medicine?.name ||
                                                            'Product'}
                                                    </p>

                                                    <p className="mt-1 text-xs font-bold text-slate-400">
                                                        {item.medicine?.sku ||
                                                            item.medicine
                                                                ?.barcode ||
                                                            '-'}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-5 text-center font-black text-slate-700 dark:text-slate-300">
                                                    {item.quantity}
                                                </td>

                                                <td className="px-5 py-5 text-center font-black text-amber-600 dark:text-amber-400">
                                                    {item.returned_quantity ||
                                                        0}
                                                </td>

                                                <td className="px-5 py-5 text-center">
                                                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                                        {
                                                            item.returnable_quantity
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-5 py-5 text-right font-black text-slate-700 dark:text-slate-300">
                                                    {Number(
                                                        item.purchase_price ||
                                                            0
                                                    ).toFixed(2)}{' '}
                                                    SAR
                                                </td>

                                                <td className="px-5 py-5">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={
                                                            item.returnable_quantity
                                                        }
                                                        step="1"
                                                        value={quantity}
                                                        onChange={(e) =>
                                                            updateQuantity(
                                                                item.id,
                                                                e.target
                                                                    .value,
                                                                item.returnable_quantity
                                                            )
                                                        }
                                                        className="mx-auto block w-24 rounded-xl border border-slate-300 bg-white p-3 text-center font-black text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40"
                                                    />
                                                </td>

                                                <td className="px-5 py-5 text-right font-black text-blue-700 dark:text-blue-400">
                                                    {lineTotal.toFixed(2)}{' '}
                                                    SAR
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-10 text-center">
                            <CheckCircle2
                                size={40}
                                className="mx-auto text-emerald-500"
                            />

                            <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
                                Fully Returned
                            </h3>

                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                All products from this purchase have
                                already been returned.
                            </p>
                        </div>
                    )}
                </section>
            )}

            {/* Backend Errors */}

            {errors.items && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                    <AlertCircle
                        size={20}
                        className="mt-0.5 shrink-0"
                    />

                    <p className="font-bold">
                        {errors.items}
                    </p>
                </div>
            )}

            {/* Return Information */}

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label className="mb-2 block font-bold text-slate-900 dark:text-white">
                        Return Date
                    </label>

                    <input
                        type="date"
                        value={data.return_date}
                        onChange={(e) =>
                            setData(
                                'return_date',
                                e.target.value
                            )
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-900/40"
                    />

                    {errors.return_date && (
                        <p className="mt-2 text-sm font-bold text-red-600 dark:text-red-400">
                            {errors.return_date}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block font-bold text-slate-900 dark:text-white">
                        Return Amount
                    </label>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 font-black text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                        {returnTotal.toFixed(2)} SAR
                    </div>

                    <p className="mt-2 text-xs font-bold text-slate-400">
                        Calculated automatically from selected
                        quantities.
                    </p>
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block font-bold text-slate-900 dark:text-white">
                        Reason
                    </label>

                    <input
                        type="text"
                        value={data.reason}
                        onChange={(e) =>
                            setData(
                                'reason',
                                e.target.value
                            )
                        }
                        placeholder="Example: Damaged products, wrong delivery..."
                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
                    />

                    {errors.reason && (
                        <p className="mt-2 text-sm font-bold text-red-600 dark:text-red-400">
                            {errors.reason}
                        </p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block font-bold text-slate-900 dark:text-white">
                        Notes
                    </label>

                    <textarea
                        rows="4"
                        value={data.notes}
                        onChange={(e) =>
                            setData(
                                'notes',
                                e.target.value
                            )
                        }
                        placeholder="Optional notes..."
                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
                    />

                    {errors.notes && (
                        <p className="mt-2 text-sm font-bold text-red-600 dark:text-red-400">
                            {errors.notes}
                        </p>
                    )}
                </div>
            </div>

            {/* Summary */}

            {selectedPurchase &&
                returnableItems.length > 0 && (
                    <section className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 p-6 text-white shadow-xl">
                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-bold text-white/80">
                                    Return Summary
                                </p>

                                <h3 className="mt-1 text-3xl font-black">
                                    {returnTotal.toFixed(2)} SAR
                                </h3>

                                <p className="mt-1 text-sm font-bold text-white/80">
                                    {selectedQuantity}{' '}
                                    unit
                                    {selectedQuantity === 1
                                        ? ''
                                        : 's'}{' '}
                                    from {selectedLines}{' '}
                                    product
                                    {selectedLines === 1
                                        ? ''
                                        : 's'}{' '}
                                    selected
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    processing ||
                                    selectedQuantity <= 0
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-black text-blue-700 shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                <RotateCcw size={19} />

                                {processing
                                    ? 'Processing...'
                                    : submitLabel}
                            </button>
                        </div>
                    </section>
                )}
        </form>
    );
}