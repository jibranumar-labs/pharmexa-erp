import AppLayout from '@/Layouts/AppLayout';
import FormInput from '@/Components/UI/FormInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, MapPin, Save, UserRound } from 'lucide-react';

export default function Edit({ customer }) {
    const { data, setData, put, processing, errors } = useForm({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        gender: customer.gender || 'Male',
        date_of_birth: customer.date_of_birth || '',
        address: customer.address || '',
        city: customer.city || '',
        national_id: customer.national_id || '',
        credit_limit: customer.credit_limit || 0,
        is_active: Boolean(customer.is_active),
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('customers.update', customer.id), { preserveScroll: true });
    };

    return (
        <AppLayout title="Edit Customer">
            <Head title={`Edit ${customer.name} | Pharmexa`} />

            <div className="space-y-7">
                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-8 text-white shadow-2xl">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black backdrop-blur transition-colors">
                                <UserRound size={16} />
                                Customers / Edit
                            </div>

                            <h1 className="mt-5 text-5xl font-black">
                                Edit Customer
                            </h1>

                            <p className="mt-3 max-w-3xl leading-7 text-white/90">
                                Update customer profile, contact information,
                                credit limit and active status.
                            </p>
                        </div>

                        <Link
                            href={route('customers.index')}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-white px-7 py-4 font-black text-blue-700 dark:text-blue-300 shadow-xl transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back
                        </Link>
                    </div>
                </section>

                <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
                    <section className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-sm lg:col-span-2 transition-colors">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                            Customer Information
                        </h2>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <FormInput label="Customer Name *" value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} />
                            <FormInput label="Phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} error={errors.phone} />
                            <FormInput label="Email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} />

                            <div>
                                <label className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-400">
                                    Gender *
                                </label>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 px-4 py-3 font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.gender && <p className="mt-2 text-sm font-bold text-red-600">{errors.gender}</p>}
                            </div>

                            <FormInput label="Date of Birth" type="date" value={data.date_of_birth || ''} onChange={(e) => setData('date_of_birth', e.target.value)} error={errors.date_of_birth} />
                            <FormInput label="National ID / Iqama" value={data.national_id || ''} onChange={(e) => setData('national_id', e.target.value)} error={errors.national_id} />
                            <FormInput label="City" value={data.city || ''} onChange={(e) => setData('city', e.target.value)} error={errors.city} />
                            <FormInput label="Credit Limit" type="number" min="0" step="0.01" value={data.credit_limit} onChange={(e) => setData('credit_limit', e.target.value)} error={errors.credit_limit} />

                            <div className="md:col-span-2">
                                <label className="mb-2 flex items-center gap-2 text-sm font-black text-slate-600 dark:text-slate-400">
                                    <MapPin size={16} />
                                    Address
                                </label>
                                <textarea
                                    value={data.address || ''}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="min-h-[120px] w-full rounded-2xl border border-slate-300 dark:border-slate-700 px-4 py-3 font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Status</h2>

                            <label className="mt-6 flex cursor-pointer items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-800 p-5">
                                <div>
                                    <p className="font-black text-slate-900 dark:text-white">Active Customer</p>
                                    <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">Can be selected in POS.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 focus:ring-emerald-500 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-emerald-500 px-6 py-4 font-black text-white shadow-xl disabled:opacity-60"
                        >
                            <Save size={20} />
                            {processing ? 'Updating...' : 'Update Customer'}
                        </button>
                    </section>
                </form>
            </div>
        </AppLayout>
    );
}