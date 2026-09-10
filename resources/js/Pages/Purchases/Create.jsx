import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
    ArrowLeft,
    Plus,
    Save,
    Trash2,
} from 'lucide-react';

export default function Create({ suppliers = [], medicines = [] }) {
    const today = new Date().toISOString().slice(0, 10);
    const beep = () => {
    const audio = new Audio('/sounds/allow.mp3');
    audio.volume = 1;

    audio.play().catch((error) => {
        console.error('Unable to play beep:', error);
    });

};
const barcodeRef = useRef(null);

const [barcode, setBarcode] = useState('');

useEffect(() => {
    barcodeRef.current?.focus();
}, []);
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        supplier_invoice_number: '',
        purchase_date: today,
        discount: 0,
        tax: 0,
        paid_amount: 0,
        notes: '',
        items: [],
    });

    const subtotal = data.items.reduce((sum, item) => {
        return sum + Number(item.quantity || 0) * Number(item.purchase_price || 0);
    }, 0);

    const total = Math.max(
        0,
        subtotal - Number(data.discount || 0) + Number(data.tax || 0)
    );

    const balance = Math.max(0, total - Number(data.paid_amount || 0));

    const updateItem = (index, key, value) => {
       let items = [...data.items];
        items[index][key] = value;

        if (key === 'medicine_id') {
            const medicine = medicines.find((m) => Number(m.id) === Number(value));
            if (medicine) {
                items[index].purchase_price = Number(medicine.purchase_price || 0);
                items[index].selling_price = Number(medicine.selling_price || 0);
            }
        }

        setData('items', items);
       
    };

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                medicine_id: '',
                batch_number: '',
                expiry_date: '',
                quantity: 1,
                purchase_price: 0,
                selling_price: 0,
            },
        ]);
    };

    const removeItem = (index) => {

    const items = data.items.filter((_, i) => i !== index);

    setData('items', items);

    setTimeout(() => {
        barcodeRef.current?.focus();
    }, 100);
};
const scanBarcode = async (e) => {

    if (e.key !== 'Enter') return;

    e.preventDefault();

    if (!barcode.trim()) return;

    try {

        const { data: result } = await axios.post(
            route('medicines.search-barcode'),
            {
                barcode: barcode.trim(),
            }
        );

        if (!result.found) {

            alert('Medicine not found.');

            setBarcode('');

            barcodeRef.current?.focus();

            return;
        }

        const medicine = result.medicine;

        let items = [...data.items];

        // Remove empty row
        items = items.filter(item => item.medicine_id);

        const existing = items.findIndex(
            item => Number(item.medicine_id) === Number(medicine.id)
        );

        if (existing >= 0) {

            items[existing].quantity =
                Number(items[existing].quantity) + 1;

        } else {

            items.push({
                medicine_id: medicine.id,
                batch_number: '',
                expiry_date: '',
                quantity: 1,
                purchase_price: Number(medicine.purchase_price || 0),
                selling_price: Number(medicine.selling_price || 0),
            });

        }

        beep();

        setData('items', items);

        setBarcode('');

        setTimeout(() => {
            barcodeRef.current?.focus();
        }, 100);

    } catch (error) {

        console.error(error);

        alert('Unable to scan product.');

    }

};
    const submit = (e) => {
        e.preventDefault();
        post(route('purchases.store'));
    };

    return (
        <AppLayout title="New Purchase">
            <Head title="New Purchase | Pharmexa" />

            <div className="space-y-7">
                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition-colors">
                                Purchase / New Invoice
                            </div>

                            <h1 className="text-4xl font-black lg:text-5xl">
                                New Purchase Invoice
                            </h1>

                            <p className="mt-3 max-w-3xl text-white/90">
                                Receive products from suppliers and update stock automatically.
                            </p>
                        </div>

                        <Link
                            href={route('purchases.index')}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-white px-6 py-4 font-black text-blue-700 dark:text-blue-300 shadow-xl transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back
                        </Link>
                    </div>
                </section>

                <form onSubmit={submit} className="space-y-6">
                    <section className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
                        <h2 className="text-2xl font-black">Supplier Details</h2>

                        <div className="mt-6 grid gap-5 lg:grid-cols-4">
                            <div>
                                <label className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-400">
                                    Supplier *
                                </label>
                                <select
                                    value={data.supplier_id}
                                    onChange={(e) => setData('supplier_id', e.target.value)}
                                    className="input"
                                >
                                    <option value="">Select supplier</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.supplier_id && <Error text={errors.supplier_id} />}
                            </div>

                            <Input
                                label="Supplier Invoice No"
                                value={data.supplier_invoice_number}
                                onChange={(v) => setData('supplier_invoice_number', v)}
                            />

                            <Input
                                label="Purchase Date"
                                type="date"
                                value={data.purchase_date}
                                onChange={(v) => setData('purchase_date', v)}
                                error={errors.purchase_date}
                            />

                            <Input
                                label="Paid Amount"
                                type="number"
                                value={data.paid_amount}
                                onChange={(v) => setData('paid_amount', v)}
                            />
                        </div>
                    </section>

                             <section className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
    <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">Purchase Items</h2>
        <div className="mt-6 mb-6">

    <label className="mb-2 block text-sm font-black">
        Scan Product Barcode
    </label>

    <input
        ref={barcodeRef}
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        onKeyDown={scanBarcode}
        placeholder="Scan barcode..."
        className="input text-xl font-black"
    />

</div>

        <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-emerald-500 px-5 py-3 font-black text-white"
        >
            <Plus size={18} />
            Add Item
        </button>
    </div>

    <div className="mt-6 space-y-4">
        {data.items.map((item, index) => (
            <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4"
            >
                <div className="grid gap-4 lg:grid-cols-7">

                    <div className="lg:col-span-2">
                        <label className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-400">
                            Product *
                        </label>

                        <select
                            value={item.medicine_id}
                            onChange={(e) =>
                                updateItem(index, 'medicine_id', e.target.value)
                            }
                            className={`input ${
                                errors[`items.${index}.medicine_id`]
                                    ? 'border-red-500'
                                    : ''
                            }`}
                        >
                            <option value="">Select product</option>

                            {medicines.map((medicine) => (
                                <option
                                    key={medicine.id}
                                    value={medicine.id}
                                >
                                    {medicine.name} - Stock {medicine.stock_quantity}
                                </option>
                            ))}
                        </select>

                        {errors[`items.${index}.medicine_id`] && (
                            <Error
                                text={errors[`items.${index}.medicine_id`]}
                            />
                        )}
                    </div>

                    <Input
                        label="Batch"
                        value={item.batch_number}
                        onChange={(v) =>
                            updateItem(index, 'batch_number', v)
                        }
                        error={errors[`items.${index}.batch_number`]}
                    />

                    <Input
                        label="Expiry"
                        type="date"
                        value={item.expiry_date}
                        onChange={(v) =>
                            updateItem(index, 'expiry_date', v)
                        }
                        error={errors[`items.${index}.expiry_date`]}
                    />

                    <Input
                        label="Quantity"
                        type="number"
                        value={item.quantity}
                        onChange={(v) =>
                            updateItem(index, 'quantity', v)
                        }
                        error={errors[`items.${index}.quantity`]}
                    />

                    <Input
                        label="Purchase Price"
                        type="number"
                        value={item.purchase_price}
                        onChange={(v) =>
                            updateItem(index, 'purchase_price', v)
                        }
                        error={errors[`items.${index}.purchase_price`]}
                    />

                    <Input
                        label="Selling Price"
                        type="number"
                        value={item.selling_price}
                        onChange={(v) =>
                            updateItem(index, 'selling_price', v)
                        }
                        error={errors[`items.${index}.selling_price`]}
                    />

                </div>

                <div className="mt-4 flex items-center justify-between">
                    <p className="font-black text-emerald-600 dark:text-emerald-400">
                        Line Total:{' '}
                        {(
                            Number(item.quantity || 0) *
                            Number(item.purchase_price || 0)
                        ).toFixed(2)}{' '}
                        SAR
                    </p>

                    <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="rounded-xl border border-red-200 p-3 text-red-500"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        ))}
    </div>
</section>

                    <section className="grid gap-6 lg:grid-cols-3">
                        <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm lg:col-span-2 transition-colors">
                            <label className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-400">
                                Notes
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="input min-h-[130px]"
                                placeholder="Purchase notes..."
                            />
                        </div>

                        <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
                            <h2 className="text-2xl font-black">Summary</h2>

                            <div className="mt-5 space-y-4">
                                <Summary label="Subtotal" value={`${subtotal.toFixed(2)} SAR`} />

                                <Input
                                    label="Discount"
                                    type="number"
                                    value={data.discount}
                                    onChange={(v) => setData('discount', v)}
                                />

                                <Input
                                    label="Tax"
                                    type="number"
                                    value={data.tax}
                                    onChange={(v) => setData('tax', v)}
                                />

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                    <Summary label="Total" value={`${total.toFixed(2)} SAR`} big />
                                    <Summary label="Balance" value={`${balance.toFixed(2)} SAR`} />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-emerald-500 px-6 py-4 font-black text-white shadow-xl disabled:opacity-60"
                                >
                                    <Save size={20} />
                                    {processing ? 'Saving...' : 'Save Purchase'}
                                </button>
                            </div>
                        </div>
                    </section>
                </form>
            </div>
        </AppLayout>
    );
}

function Input({ label, value, onChange, type = 'text', error }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-400">
                {label}
            </label>

            <input
                type={type}
                value={value}
                min={type === 'number' ? 0 : undefined}
                step={type === 'number' ? '0.01' : undefined}
                onChange={(e) => onChange(e.target.value)}
                className={`input ${
                    error
                        ? 'border-red-500 focus:border-red-500'
                        : ''
                }`}
            />

            {error && <Error text={error} />}
        </div>
    );
}
function Summary({ label, value, big = false }) {
    return (
        <div className="flex justify-between">
            <span className="font-bold text-slate-500 dark:text-slate-400">
                {label}
            </span>
            <span className={big ? 'text-xl font-black text-blue-700' : 'font-black'}>
                {value}
            </span>
        </div>
    );
}

function Error({ text }) {
    return <p className="mt-2 text-sm font-bold text-red-600">{text}</p>;
}