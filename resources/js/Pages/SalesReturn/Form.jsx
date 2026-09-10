import { useForm } from '@inertiajs/react';
import { Minus, Plus, RotateCcw } from 'lucide-react';

export default function Form({
    sales = [],
    submitLabel = 'Save Return',
}) {
    const { data, setData, post, processing, errors } = useForm({
        sale_id: '',
        items: [],
        refund_amount: '0.00',
        reason: '',
        return_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const selectedSale = sales.find(
        (sale) => String(sale.id) === String(data.sale_id)
    );

    const handleSaleChange = (e) => {
        const saleId = e.target.value;

        const sale = sales.find(
            (item) => String(item.id) === String(saleId)
        );

        setData({
            ...data,
            sale_id: saleId,

            items: sale
                ? sale.items.map((item) => ({
                      sale_item_id: item.id,
                      quantity: 0,
                  }))
                : [],

            refund_amount: '0.00',
        });
    };

    const calculateRefund = (items) => {
        if (!selectedSale) {
            return '0.00';
        }

        const total = items.reduce((sum, returnItem) => {
            const saleItem = selectedSale.items.find(
                (item) =>
                    Number(item.id) ===
                    Number(returnItem.sale_item_id)
            );

            if (!saleItem) {
                return sum;
            }

            return (
                sum +
                Number(returnItem.quantity || 0) *
                    Number(saleItem.unit_price || 0)
            );
        }, 0);

        return total.toFixed(2);
    };

    const updateQuantity = (saleItemId, quantity) => {
        if (!selectedSale) {
            return;
        }

        const saleItem = selectedSale.items.find(
            (item) => Number(item.id) === Number(saleItemId)
        );

        if (!saleItem) {
            return;
        }

        const max = Number(
            saleItem.returnable_quantity || 0
        );

        let nextQuantity = Number(quantity);

        if (
            Number.isNaN(nextQuantity) ||
            nextQuantity < 0
        ) {
            nextQuantity = 0;
        }

        if (nextQuantity > max) {
            nextQuantity = max;
        }

        const updatedItems = data.items.map((item) =>
            Number(item.sale_item_id) === Number(saleItemId)
                ? {
                      ...item,
                      quantity: nextQuantity,
                  }
                : item
        );

        setData({
            ...data,
            items: updatedItems,
            refund_amount: calculateRefund(updatedItems),
        });
    };

    const totalReturnQuantity = data.items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
    );

    const submit = (e) => {
        e.preventDefault();

        if (totalReturnQuantity <= 0) {
            return;
        }

        post(route('sale-returns.store'));
    };

    return (
        <form onSubmit={submit} className="space-y-7">

            <div>
                <label className="mb-2 block font-bold text-slate-900 dark:text-white">
                    Sale Invoice
                </label>

                <select
                    value={data.sale_id}
                    onChange={handleSaleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-900/40"
                >
                    <option value="">
                        Select Invoice
                    </option>

                    {sales.map((sale) => (
                        <option
                            key={sale.id}
                            value={sale.id}
                        >
                            {sale.invoice_number} -{' '}
                            {Number(sale.total).toFixed(2)} SAR
                            {!sale.has_returnable_items
                                ? ' - Fully Returned'
                                : ''}
                        </option>
                    ))}
                </select>

                {errors.sale_id && (
                    <p className="mt-1 text-red-600 dark:text-red-400">
                        {errors.sale_id}
                    </p>
                )}
            </div>

            {selectedSale && (
                <div className="space-y-4">

                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">
                            Products to Return
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Select the quantity you want to return for each product.
                        </p>
                    </div>

                    {selectedSale.items.map((item) => {
                        const formItem = data.items.find(
                            (row) =>
                                Number(row.sale_item_id) ===
                                Number(item.id)
                        );

                        const quantity = Number(
                            formItem?.quantity || 0
                        );

                        const sold = Number(
                            item.sold_quantity ??
                                item.quantity ??
                                0
                        );

                        const returned = Number(
                            item.returned_quantity || 0
                        );

                        const returnable = Number(
                            item.returnable_quantity || 0
                        );

                        return (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/60"
                            >
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-wrap items-center gap-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400">
                                                <RotateCcw size={21} />
                                            </div>

                                            <div>
                                                <h4 className="font-black text-slate-900 dark:text-white">
                                                    {item.medicine_name ||
                                                        'Medicine'}
                                                </h4>

                                                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {Number(
                                                        item.unit_price
                                                    ).toFixed(2)}{' '}
                                                    SAR / unit
                                                </p>
                                            </div>

                                        </div>

                                        <div className="mt-5 grid grid-cols-3 gap-3">

                                            <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                                                <p className="text-xs font-bold uppercase text-slate-500">
                                                    Sold
                                                </p>

                                                <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                                                    {sold}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                                                <p className="text-xs font-bold uppercase text-slate-500">
                                                    Returned
                                                </p>

                                                <p className="mt-1 text-lg font-black text-orange-600">
                                                    {returned}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                                                <p className="text-xs font-bold uppercase text-slate-500">
                                                    Returnable
                                                </p>

                                                <p className="mt-1 text-lg font-black text-emerald-600">
                                                    {returnable}
                                                </p>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="lg:w-72">

                                        <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">
                                            Return Quantity
                                        </label>

                                        {returnable > 0 ? (
                                            <div className="flex items-center gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            quantity - 1
                                                        )
                                                    }
                                                    disabled={quantity <= 0}
                                                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                                                >
                                                    <Minus size={18} />
                                                </button>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={returnable}
                                                    value={quantity}
                                                    onChange={(e) =>
                                                        updateQuantity(
                                                            item.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-11 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white text-center font-black text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-900/40"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            quantity + 1
                                                        )
                                                    }
                                                    disabled={
                                                        quantity >= returnable
                                                    }
                                                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    <Plus size={18} />
                                                </button>

                                            </div>
                                        ) : (
                                            <div className="rounded-xl bg-slate-200 px-4 py-3 text-center font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                                                Fully Returned
                                            </div>
                                        )}

                                        {errors[`items.${item.id}.quantity`] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {
                                                    errors[
                                                        `items.${item.id}.quantity`
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {!selectedSale.has_returnable_items && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                            All products from this invoice have already been returned.
                        </div>
                    )}

                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">

                <div>
                    <label className="mb-2 block font-bold text-slate-900 dark:text-white">
                        Refund Amount
                    </label>

                    <div className="relative">
                        <input
                            type="text"
                            value={data.refund_amount}
                            readOnly
                            className="w-full rounded-xl border border-slate-300 bg-slate-100 p-3 pr-16 font-black text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                            SAR
                        </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                        Calculated automatically from the returned quantities.
                    </p>

                    {errors.refund_amount && (
                        <p className="mt-1 text-red-600 dark:text-red-400">
                            {errors.refund_amount}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block font-bold text-slate-900 dark:text-white">
                        Return Date
                    </label>

                    <input
                        type="date"
                        value={data.return_date}
                        onChange={(e) =>
                            setData('return_date', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-900/40"
                    />

                    {errors.return_date && (
                        <p className="mt-1 text-red-600 dark:text-red-400">
                            {errors.return_date}
                        </p>
                    )}
                </div>

                <div className="md:col-span-2">

                    <label className="mb-2 block font-bold text-slate-900 dark:text-white">
                        Reason
                    </label>

                    <input
                        type="text"
                        value={data.reason}
                        onChange={(e) =>
                            setData('reason', e.target.value)
                        }
                        placeholder="Example: Customer returned unopened medicine"
                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-900/40"
                    />

                    {errors.reason && (
                        <p className="mt-1 text-red-600 dark:text-red-400">
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
                            setData('notes', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-900/40"
                    />

                    {errors.notes && (
                        <p className="mt-1 text-red-600 dark:text-red-400">
                            {errors.notes}
                        </p>
                    )}
                </div>

            </div>

            {errors.items && (
                <p className="text-red-600 dark:text-red-400">
                    {errors.items}
                </p>
            )}

            <div className="flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-700">

                <div>
                    <p className="text-sm font-semibold text-slate-500">
                        Total Quantity
                    </p>

                    <p className="text-xl font-black text-slate-900 dark:text-white">
                        {totalReturnQuantity}
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={
                        processing ||
                        !data.sale_id ||
                        totalReturnQuantity <= 0
                    }
                    className="rounded-xl bg-red-700 px-8 py-3 font-black text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {processing
                        ? 'Processing...'
                        : submitLabel}
                </button>

            </div>

        </form>
    );
}