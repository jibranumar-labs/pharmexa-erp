import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Mail,
    MapPin,
    Phone,
    Save,
    UserRound,
    BadgePercent,
} from 'lucide-react';

export default function Edit({ supplier }) {
    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name || '',
        contact_person: supplier.contact_person || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
        vat_number: supplier.vat_number || '',
        is_active: Boolean(supplier.is_active),
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('suppliers.update', supplier.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title="Edit Supplier">
            <Head title={`Edit ${supplier.name} | Pharmexa`} />

            <div className="space-y-7">
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition-colors">
                                <Building2 size={16} />
                                Suppliers / Edit
                            </div>

                            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
                                Edit Supplier
                            </h1>

                            <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-white/90">
                                Update supplier contact details, VAT information and active status.
                            </p>
                        </div>

                        <Link
                            href={route('suppliers.index')}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-white px-6 py-4 font-black text-blue-700 dark:text-blue-300 shadow-xl transition hover:-translate-y-1"
                        >
                            <ArrowLeft size={20} />
                            Back to Suppliers
                        </Link>
                    </div>
                </section>

                <form onSubmit={submit} className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 transition-colors">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <InputField
                            label="Supplier Name"
                            icon={Building2}
                            value={data.name}
                            error={errors.name}
                            required
                            placeholder="Example: ABC Pharma Trading"
                            onChange={(value) => setData('name', value)}
                        />

                        <InputField
                            label="Contact Person"
                            icon={UserRound}
                            value={data.contact_person}
                            error={errors.contact_person}
                            placeholder="Example: Ahmed Khan"
                            onChange={(value) => setData('contact_person', value)}
                        />

                        <InputField
                            label="Phone"
                            icon={Phone}
                            value={data.phone}
                            error={errors.phone}
                            placeholder="+966 5XXXXXXXX"
                            onChange={(value) => setData('phone', value)}
                        />

                        <InputField
                            label="Email"
                            icon={Mail}
                            type="email"
                            value={data.email}
                            error={errors.email}
                            placeholder="supplier@example.com"
                            onChange={(value) => setData('email', value)}
                        />

                        <InputField
                            label="VAT Number"
                            icon={BadgePercent}
                            value={data.vat_number}
                            error={errors.vat_number}
                            placeholder="VAT / Tax registration number"
                            onChange={(value) => setData('vat_number', value)}
                        />

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/60">
                            <label className="flex cursor-pointer items-center justify-between gap-4">
                                <div>
                                    <p className="font-black text-slate-900 dark:text-white">
                                        Active Supplier
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                                        Active suppliers can be used in purchase invoices.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 focus:ring-emerald-500 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                                />
                            </label>
                        </div>

                        <div className="lg:col-span-2">
                            <label className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                                <MapPin size={17} />
                                Address
                            </label>

                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={4}
                                className="input min-h-[120px]"
                                placeholder="Supplier address..."
                            />

                            {errors.address && (
                                <p className="mt-2 text-sm font-bold text-red-600">
                                    {errors.address}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 dark:border-slate-700 pt-6 sm:flex-row sm:justify-end">
                        <Link
                            href={route('suppliers.index')}
                            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-4 font-black text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-700"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-emerald-500 px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={20} />
                            {processing ? 'Updating...' : 'Update Supplier'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function InputField({
    label,
    icon: Icon,
    value,
    onChange,
    error,
    placeholder,
    type = 'text',
    required = false,
}) {
    return (
        <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                <Icon size={17} />
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>

            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input"
                placeholder={placeholder}
            />

            {error && (
                <p className="mt-2 text-sm font-bold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}