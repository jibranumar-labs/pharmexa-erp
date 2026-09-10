import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';

export default function StockAdjust({ medicine, recentMovements }) {
    const { data, setData, post, processing } = useForm({
        type: 'in',
        quantity: '',
        reason: '',
        note: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('medicines.stock.store', medicine.id));
    };

    return (
        <AppLayout title="Stock Management">
            <Head title="Stock Management" />

            <div className="space-y-6">

                <div className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-8 text-white">
                    <h1 className="text-4xl font-black">
                        Stock Management
                    </h1>

                    <p className="mt-2 text-white/90">
                        {medicine.name}
                    </p>

                    <div className="mt-4 inline-flex rounded-full bg-white/20 px-4 py-2 font-bold transition-colors">
                        Current Stock: {medicine.stock_quantity}
                    </div>
                </div>

                <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm transition-colors">
                    <h2 className="mb-6 text-2xl font-black">
                        Adjust Product Stock
                    </h2>

                    <form onSubmit={submit} className="space-y-5">

                        <select
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="input"
                        >
                            <option value="in">Stock In</option>
                            <option value="out">Stock Out</option>
                            <option value="adjustment">Stock Adjustment</option>
                        </select>

                        <input
                            type="number"
                            placeholder="Quantity"
                            value={data.quantity}
                            onChange={(e) => setData('quantity', e.target.value)}
                            className="input"
                        />

                        <input
                            type="text"
                            placeholder="Reason"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            className="input"
                        />

                        <textarea
                            placeholder="Notes"
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            className="input min-h-[120px]"
                        />

                        <button
                            type="submit"
                            disabled={processing}
                            className="btn-primary"
                        >
                            Save Stock Movement
                        </button>

                    </form>
                </div>

            </div>
        </AppLayout>
    );
}