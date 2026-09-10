import { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Pill,
    CreditCard,
    BarChart3,
    Cloud,
    Eye,
    EyeOff,
    Lock,
    ShieldCheck,
    Zap,
    Building2,
    Sparkles,
} from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login | Pharmexa" />

            <div className="min-h-screen overflow-hidden bg-slate-950">
                <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[1.08fr_0.92fr]">
                    <section className="relative hidden min-h-screen overflow-hidden px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_28%),linear-gradient(135deg,#1d4ed8_0%,#059669_48%,#22d3ee_100%)]" />
                        <div className="absolute -left-28 -top-28 h-96 w-96 rounded-full bg-white/20 blur-3xl transition-colors" />
                        <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-blue-950/25 blur-3xl" />
                        <div className="absolute left-[45%] top-[45%] h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

                        <div className="relative z-10 flex items-center gap-4 mb-10">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-2xl shadow-blue-950/20 transition-colors">
                                <Pill size={36} strokeWidth={2.4} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight">Pharmexa</h1>
                                <p className="text-sm font-bold text-white/85">Smart Pharmacy ERP</p>
                            </div>
                        </div>

                        <div className="relative z-10 max-w-3xl">
                            <div className="mb-7 flex flex-wrap gap-3">
                                <MiniBadge icon={<Zap size={15} />} text="Fast" />
                                <MiniBadge icon={<ShieldCheck size={15} />} text="Secure" />
                                <MiniBadge icon={<Sparkles size={15} />} text="Intelligent" />
                                <MiniBadge icon={<Cloud size={15} />} text="Cloud Ready" />
                            </div>

                            <h2 className="max-w-2xl text-5xl font-black leading-[1.08] tracking-tight xl:text-6xl">
                                Smarter Pharmacy.
                                <br />
                                Faster Growth.
                                <br />
                                Better Control.
                            </h2>

                            <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-white/88">
                                Control Products, Stock, Expiry Alerts, Purchases, Sales, Invoices,
                                Reports, & Users From One Premium Pharmacy Platform.
                            </p>

                            <div className="mt-10 grid max-w-3xl grid-cols-3 gap-5">
                                <FeatureCard icon={<CreditCard size={28} />} title="POS" text="Fast Billing" />
                                <FeatureCard icon={<BarChart3 size={28} />} title="ERP" text="Full Control" />
                                <FeatureCard icon={<Cloud size={28} />} title="SaaS" text="Cloud Ready" />
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-white/90">
                                <TrustBadge icon={<ShieldCheck size={16} />} text="Secure Access" />
                                <TrustBadge icon={<Zap size={16} />} text="Fast Performance" />
                                <TrustBadge icon={<Building2 size={16} />} text="Multi Branch Ready" />
                            </div>
                        </div>

                        <p className="relative z-10 text-sm font-semibold text-white/75">
                            © {new Date().getFullYear()} Pharmexa ERP v1.0 • Designed for Modern Pharmacies
                        </p>
                    </section>

                    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800 px-5 py-8 text-slate-900 dark:text-white sm:px-8">
                        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100 dark:bg-blue-900/40 blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-100 dark:bg-emerald-900/40 blur-3xl" />

                        <div className="relative w-full max-w-lg">
                            <div className="mb-8 text-center lg:hidden">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-700 to-emerald-500 text-white shadow-xl">
                                    <Pill size={34} />
                                </div>
                                <h1 className="mt-4 text-3xl font-black">Pharmexa</h1>
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Smart Pharmacy ERP</p>
                            </div>

                            <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white/95 p-7 shadow-2xl shadow-slate-200/80 backdrop-blur sm:p-9 transition-colors">
                                <div className="mb-8">
                                    <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-600">
                                        Secure Login
                                    </p>
                                    <h2 className="mt-3 text-4xl font-black tracking-tight">Welcome back</h2>
                                    <p className="mt-2 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                                        Login to access your pharmacy dashboard and daily operations.
                                    </p>
                                </div>

                                {status && (
                                    <div className="mb-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                                        {status}
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            autoComplete="username"
                                            autoFocus
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-4 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none transition duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                                            Password
                                        </label>

                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                autoComplete="current-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Enter your password"
                                                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-4 pr-14 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none transition duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl p-1 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 hover:text-blue-600"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>

                                        <InputError message={errors.password} className="mt-2" />
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <label className="flex items-center">
                                            <Checkbox
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                            />
                                            <span className="ms-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                                                Remember me
                                            </span>
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm font-black text-blue-600 transition hover:text-emerald-600 dark:text-emerald-400"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 px-5 py-4 text-sm font-black uppercase tracking-wide text-white shadow-xl shadow-blue-500/25 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t border-slate-200 dark:border-slate-700-white" />
                                                Signing in...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Lock size={18} />
                                                Login to Dashboard →
                                            </span>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-8 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-center text-xs font-bold leading-5 text-slate-500 dark:text-slate-400">
                                    User accounts are created by the pharmacy owner or system admin.
                                </div>

                                <div className="mt-5 grid grid-cols-3 gap-3 text-center text-[11px] font-black text-slate-500 dark:text-slate-400">
                                    <span className="rounded-xl bg-slate-50 dark:bg-slate-800 py-2">Secure</span>
                                    <span className="rounded-xl bg-slate-50 dark:bg-slate-800 py-2">Cloud Ready</span>
                                    <span className="rounded-xl bg-slate-50 dark:bg-slate-800 py-2">Fast</span>
                                </div>

                                <p className="mt-6 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                                    Pharmexa ERP v1.0 • © {new Date().getFullYear()} All Rights Reserved
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

function MiniBadge({ icon, text }) {
    return (
        <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur-xl transition-colors">
            {icon}
            {text}
        </span>
    );
}

function FeatureCard({ icon, title, text }) {
    return (
        <div className="rounded-3xl border border-white/20 bg-white/15 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-white/20">
            <div className="text-white">{icon}</div>
            <p className="mt-5 text-3xl font-black">{title}</p>
            <p className="mt-1 text-sm font-semibold text-white/80">{text}</p>
        </div>
    );
}

function TrustBadge({ icon, text }) {
    return (
        <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/15 px-4 py-2 backdrop-blur-xl transition-colors">
            {icon}
            {text}
        </span>
    );
}