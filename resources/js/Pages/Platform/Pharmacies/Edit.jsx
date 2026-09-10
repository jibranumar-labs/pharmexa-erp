import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import FlashAlert from '@/Components/UI/FlashAlert';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Globe,
    ImageIcon,
    Lock,
    Mail,
    MapPin,
    Phone,
    Save,
    StickyNote,
    UserRound,
    Eye,
    EyeOff,
} from 'lucide-react';

export default function Edit({ pharmacy }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: pharmacy.name || '',
        owner_name: pharmacy.owner_name || '',
        email: pharmacy.email || '',

        // Optional Password Change
        password: '',
        password_confirmation: '',

        phone: pharmacy.phone || '',
        address: pharmacy.address || '',
        city: pharmacy.city || '',
        country: pharmacy.country || 'Saudi Arabia',
        logo: null,
        remove_logo: false,
        status: pharmacy.status ? 'active' : 'suspended',
        notes: pharmacy.notes || '',
        _method: 'put',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('platform.pharmacies.update', pharmacy.id), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AppLayout title="Edit Pharmacy">
            <Head title={`Edit ${pharmacy.name} | Pharmexa Platform`} />

            <FlashAlert />

            <div className="space-y-7">
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-700 via-indigo-600 to-blue-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
                                <Globe size={16} />
                                Platform / Edit Pharmacy
                            </div>

                            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
                                Edit Pharmacy
                            </h1>

                            <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-white/90">
                                Update pharmacy information, owner account,
                                branding and security settings.
                            </p>
                        </div>

                        <Link
                            href={route('platform.pharmacies.index')}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-indigo-700 shadow-xl transition hover:-translate-y-1"
                        >
                            <ArrowLeft size={20} />
                            Back to Pharmacies
                        </Link>
                    </div>
                </section>

                <form
                    onSubmit={submit}
                    className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                    <div className="grid gap-6 lg:grid-cols-2">

                        <InputField
                            label="Pharmacy Name"
                            icon={Building2}
                            value={data.name}
                            error={errors.name}
                            required
                            placeholder="Example: Al Noor Pharmacy"
                            onChange={(value) => setData('name', value)}
                        />

                        <InputField
                            label="Owner Name"
                            icon={UserRound}
                            value={data.owner_name}
                            error={errors.owner_name}
                            required
                            placeholder="Example: Ahmed Khan"
                            onChange={(value) => setData('owner_name', value)}
                        />

                        <InputField
                            label="Email"
                            icon={Mail}
                            type="email"
                            value={data.email}
                            error={errors.email}
                            required
                            placeholder="admin@pharmacy.com"
                            onChange={(value) => setData('email', value)}
                        />

                        <PasswordField
                            label="New Password"
                            value={data.password}
                            error={errors.password}
                            show={showPassword}
                            toggle={() => setShowPassword(!showPassword)}
                            onChange={(value) => setData('password', value)}
                        />

                        <PasswordField
                            label="Confirm New Password"
                            value={data.password_confirmation}
                            error={errors.password_confirmation}
                            show={showConfirmPassword}
                            toggle={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            onChange={(value) =>
                                setData('password_confirmation', value)
                            }
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
                            label="City"
                            icon={MapPin}
                            value={data.city}
                            error={errors.city}
                            placeholder="Riyadh"
                            onChange={(value) => setData('city', value)}
                        />

                        <InputField
                            label="Country"
                            icon={Globe}
                            value={data.country}
                            error={errors.country}
                            placeholder="Saudi Arabia"
                            onChange={(value) => setData('country', value)}
                        />

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                                <Building2 size={17} />
                                Status
                                <span className="text-red-500">*</span>
                            </label>

                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="input"
                            >
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                            </select>

                            {errors.status && (
                                <p className="mt-2 text-sm font-bold text-red-600">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                                <ImageIcon size={17} />
                                Logo
                            </label>

                            {pharmacy.logo_url && !data.remove_logo && (
                                <div className="mb-3 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                                    <img
                                        src={pharmacy.logo_url}
                                        alt={pharmacy.name}
                                        className="h-16 w-16 rounded-2xl object-cover"
                                    />

                                    <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-red-600">
                                        <input
                                            type="checkbox"
                                            checked={data.remove_logo}
                                            onChange={(e) =>
                                                setData(
                                                    'remove_logo',
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-slate-300"
                                        />
                                        Remove current logo
                                    </label>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={(e) =>
                                    setData('logo', e.target.files[0])
                                }
                                className="input file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:font-black file:text-indigo-700"
                            />

                            {errors.logo && (
                                <p className="mt-2 text-sm font-bold text-red-600">
                                    {errors.logo}
                                </p>
                            )}
                        </div>

                                               <div className="lg:col-span-2">
                            <label className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                                <MapPin size={17} />
                                Address
                            </label>

                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={3}
                                className="input min-h-[100px]"
                                placeholder="Pharmacy address..."
                            />

                            {errors.address && (
                                <p className="mt-2 text-sm font-bold text-red-600">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        <div className="lg:col-span-2">
                            <label className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                                <StickyNote size={17} />
                                Notes
                            </label>

                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={4}
                                className="input min-h-[120px]"
                                placeholder="Internal notes about this pharmacy..."
                            />

                            {errors.notes && (
                                <p className="mt-2 text-sm font-bold text-red-600">
                                    {errors.notes}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/30">
                        <h3 className="text-sm font-black text-amber-900 dark:text-amber-200">
                            Owner Account
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-amber-700 dark:text-amber-300">
                            Update the owner's name and email as needed.
                            Leave the password fields empty if you don't want
                            to change the owner's password.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 dark:border-slate-700 sm:flex-row sm:justify-end">
                        <Link
                            href={route('platform.pharmacies.show', pharmacy.id)}
                            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-4 font-black text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-indigo-500 px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={20} />
                            {processing ? 'Updating...' : 'Update Pharmacy'}
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

function PasswordField({
    label,
    value,
    onChange,
    error,
    show,
    toggle,
    required = false,
}) {
    return (
        <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                <Lock size={17} />
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>

            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="input pr-12"
                    placeholder={label}
                />

                <button
                    type="button"
                    onClick={toggle}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {error && (
                <p className="mt-2 text-sm font-bold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}