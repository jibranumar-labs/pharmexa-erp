import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    Boxes,
    CheckCircle2,
    ChevronRight,
    CircleDollarSign,
    Clock3,
    FileText,
    HeartPulse,
    Menu,
    Pill,
    Play,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Store,
    Truck,
    Users,
    X,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

const WHATSAPP_URL =
    'https://wa.me/966573144547?text=Hello%20Pharmexa%2C%20I%20would%20like%20to%20know%20more%20about%20Pharmexa.';

const EMAIL_URL = 'mailto:jibranumar555@gmail.com';

const features = [
    {
        icon: Pill,
        title: 'Smart Inventory',
        text: 'Manage medicines, stock, batches and expiry dates with clarity and control.',
    },
    {
        icon: ShoppingCart,
        title: 'Powerful POS',
        text: 'Make pharmacy sales fast with an intuitive checkout experience built for daily operations.',
    },
    {
        icon: Truck,
        title: 'Purchasing',
        text: 'Manage suppliers, purchases and returns while keeping your stock organized.',
    },
    {
        icon: BarChart3,
        title: 'Business Intelligence',
        text: 'Understand sales, profit, expenses and business performance from one place.',
    },
    {
        icon: CircleDollarSign,
        title: 'Daily Operations',
        text: 'Keep your daily register, expenses and pharmacy operations organized.',
    },
    {
        icon: ShieldCheck,
        title: 'Saudi Compliance',
        text: 'Built with Saudi pharmacy workflows and RSD traceability capabilities in mind.',
    },
];

const steps = [
    {
        number: '01',
        title: 'Set up your pharmacy',
        text: 'Create your pharmacy workspace and configure your team.',
    },
    {
        number: '02',
        title: 'Add your medicines',
        text: 'Import or manage your medicines, stock and expiry information.',
    },
    {
        number: '03',
        title: 'Run your pharmacy',
        text: 'Sell, purchase, manage expenses and monitor daily operations.',
    },
    {
        number: '04',
        title: 'Understand your business',
        text: 'Use reports and analytics to make better business decisions.',
    },
];

const stats = [
    { value: '01', label: 'Unified Platform' },
    { value: '24/7', label: 'Business Visibility' },
    { value: '100%', label: 'Pharmacy Focused' },
];

const pricingPlans = [
    {
        name: 'Monthly',
        period: 'per month',
        oldPrice: '500',
        price: '250',
        description: 'Flexible monthly access for your pharmacy.',
        popular: false,
        features: [
            'Full pharmacy platform',
            'Inventory & stock management',
            'POS & sales',
            'Purchasing & suppliers',
            'Reports & analytics',
            'Team & access management',
        ],
    },
    {
        name: '6 Months',
        period: 'every 6 months',
        oldPrice: '3,000',
        price: '1,500',
        description: 'A smarter commitment for growing pharmacies.',
        popular: true,
        features: [
            'Everything in Monthly',
            '6 months of access',
            '50% launch discount',
            'Better value for growing teams',
            'Priority product improvements',
            'Saudi-focused workflows',
        ],
    },
    {
        name: '1 Year',
        period: 'per year',
        oldPrice: '6,000',
        price: '3,000',
        description: 'Maximum value for pharmacies ready to grow.',
        popular: false,
        features: [
            'Everything in 6 Months',
            '12 months of access',
            '50% launch discount',
            'Save 3,000 SAR',
            'Long-term business value',
            'All major Pharmexa modules',
        ],
    },
];

export default function Welcome() {
    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <>
            <Head>
                <title>Pharmexa — Smarter Pharmacy. Better Business.</title>

                <meta
                    name="description"
                    content="Pharmexa is a modern pharmacy management platform for inventory, POS, purchasing, reports, expenses and Saudi pharmacy operations."
                />

                <meta
                    name="keywords"
                    content="Pharmacy ERP Saudi Arabia, Pharmacy Management System, Pharmacy POS, Pharmexa, Pharmacy Software Saudi Arabia"
                />
            </Head>

            <div className="min-h-screen overflow-x-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-white">

                {/* =========================================================
                    NAVBAR
                ========================================================== */}
                <header className="fixed inset-x-0 top-0 z-50">
                    <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                        <nav className="rounded-2xl border border-white/20 bg-slate-950/80 px-4 py-3 shadow-2xl backdrop-blur-xl">
                            <div className="flex items-center justify-between">

                                <a
                                    href="#home"
                                    className="group flex items-center gap-3"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg shadow-teal-500/20">
                                        <Pill className="h-5 w-5 rotate-45 text-white" />
                                    </div>

                                    <div>
                                        <div className="text-lg font-black tracking-tight text-white">
                                            PHARMEXA
                                        </div>

                                        <div className="text-[9px] font-medium uppercase tracking-[0.28em] text-teal-300">
                                            Pharmacy Intelligence
                                        </div>
                                    </div>
                                </a>

                                <div className="hidden items-center gap-7 md:flex">
                                    <a href="#about" className="nav-link">
                                        About
                                    </a>

                                    <a href="#features" className="nav-link">
                                        Features
                                    </a>

                                    <a href="#pricing" className="nav-link">
                                        Pricing
                                    </a>

                                    <a href="#how-it-works" className="nav-link">
                                        How It Works
                                    </a>

                                    <a href="#contact" className="nav-link">
                                        Contact
                                    </a>
                                </div>

                                <div className="hidden items-center gap-3 md:flex">
                                    <Link
                                        href="/login"
                                        className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-50"
                                    >
                                        Get Started
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setMobileMenu(!mobileMenu)}
                                    className="rounded-xl p-2 text-white md:hidden"
                                    aria-label="Toggle menu"
                                >
                                    {mobileMenu ? (
                                        <X className="h-6 w-6" />
                                    ) : (
                                        <Menu className="h-6 w-6" />
                                    )}
                                </button>
                            </div>

                            {mobileMenu && (
                                <div className="mt-4 border-t border-white/10 pt-4 md:hidden">
                                    <div className="flex flex-col gap-2">
                                        {[
                                            ['About', '#about'],
                                            ['Features', '#features'],
                                            ['Pricing', '#pricing'],
                                            ['How It Works', '#how-it-works'],
                                            ['Contact', '#contact'],
                                        ].map(([label, href]) => (
                                            <a
                                                key={href}
                                                href={href}
                                                onClick={() =>
                                                    setMobileMenu(false)
                                                }
                                                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
                                            >
                                                {label}
                                            </a>
                                        ))}

                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            <Link
                                                href="/login"
                                                className="rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white"
                                            >
                                                Login
                                            </Link>

                                            <Link
                                                href="/register"
                                                className="rounded-xl bg-teal-500 px-4 py-3 text-center text-sm font-bold text-white"
                                            >
                                                Get Started
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </nav>
                    </div>
                </header>

                {/* =========================================================
                    HERO
                ========================================================== */}
                <section
                    id="home"
                    className="relative flex min-h-[850px] items-center overflow-hidden bg-slate-950"
                >
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(20,184,166,0.25),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.18),transparent_30%),linear-gradient(135deg,#020617,#0f172a_55%,#042f2e)]" />

                        <div className="absolute -left-32 top-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

                        <div className="absolute -right-32 bottom-20 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

                        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:60px_60px]" />
                    </div>

                    <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-40 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">

                            <div className="max-w-3xl">
                                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-300">
                                    <Sparkles className="h-4 w-4" />
                                    Founding Launch Offer · 50% OFF
                                </div>

                                <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                                    The smarter way to
                                    <span className="block bg-gradient-to-r from-teal-300 via-cyan-300 to-white bg-clip-text text-transparent">
                                        manage your pharmacy.
                                    </span>
                                </h1>

                                <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                                    Pharmexa brings your pharmacy's daily operations
                                    together in one intelligent platform — from
                                    inventory and POS to purchasing, expenses,
                                    analytics and Saudi compliance workflows.
                                </p>

                                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                    <Link
                                        href="/register"
                                        className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-500 px-7 py-4 text-sm font-black text-white shadow-xl shadow-teal-500/20 transition hover:-translate-y-1 hover:shadow-2xl"
                                    >
                                        Start with 50% OFF
                                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                    </Link>

                                    <a
                                        href="#pricing"
                                        className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
                                    >
                                        View Pricing
                                    </a>
                                </div>

                                <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-400">
                                    <span className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-teal-400" />
                                        Pharmacy focused
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-teal-400" />
                                        Responsive everywhere
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-teal-400" />
                                        Built for growth
                                    </span>
                                </div>
                            </div>

                            {/* Hero product visual */}
                            <div className="relative mx-auto w-full max-w-xl">
                                <div className="absolute -inset-8 rounded-[3rem] bg-teal-500/10 blur-3xl" />

                                <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-xl">
                                    <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/95 p-5">

                                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Pharmacy Overview
                                                </p>

                                                <h3 className="mt-1 text-lg font-bold text-white">
                                                    Today's Performance
                                                </h3>
                                            </div>

                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10">
                                                <BarChart3 className="h-5 w-5 text-teal-300" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 py-5">
                                            {[
                                                ['Today Sales', 'SAR 12,840', '↗ 18.4%'],
                                                ['Products', '4,286', 'Active'],
                                                ['Low Stock', '24', 'Attention'],
                                                ['Orders', '186', 'Today'],
                                            ].map(([title, value, note]) => (
                                                <div
                                                    key={title}
                                                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                                                >
                                                    <p className="text-[11px] text-slate-500">
                                                        {title}
                                                    </p>

                                                    <p className="mt-2 text-lg font-black text-white">
                                                        {value}
                                                    </p>

                                                    <p className="mt-1 text-[11px] font-semibold text-teal-300">
                                                        {note}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Sales Overview
                                                    </p>

                                                    <p className="mt-1 text-sm font-bold text-white">
                                                        Business performance
                                                    </p>
                                                </div>

                                                <TrendingMini />
                                            </div>

                                            <div className="mt-5 flex h-24 items-end gap-2">
                                                {[35,48,42,65,52,78,70,92,84,100,88,96].map(
                                                    (height, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex-1 rounded-t-lg bg-gradient-to-t from-teal-600 to-cyan-300 opacity-80"
                                                            style={{
                                                                height: `${height}%`,
                                                            }}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/15 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl sm:block">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
                                            <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-white">
                                                Controlled & Organized
                                            </p>

                                            <p className="text-[11px] text-slate-400">
                                                Pharmacy operations
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    STATS
                ========================================================== */}
                <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                    <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-slate-200 px-4 py-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8 dark:divide-slate-800">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="px-6 py-4 text-center"
                            >
                                <p className="text-2xl font-black text-teal-600 dark:text-teal-400">
                                    {stat.value}
                                </p>

                                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* =========================================================
                    ABOUT
                ========================================================== */}
                <section
                    id="about"
                    className="bg-slate-50 py-24 dark:bg-slate-900/40"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-14 lg:grid-cols-2">

                            <div>
                                <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                                    <span className="h-px w-8 bg-teal-500" />
                                    About Pharmexa
                                </div>

                                <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
                                    Everything your pharmacy needs.
                                    <span className="block text-teal-600 dark:text-teal-400">
                                        One intelligent platform.
                                    </span>
                                </h2>

                                <p className="mt-6 text-base leading-8 text-slate-600 dark:text-slate-400">
                                    Pharmexa is designed around the real workflow
                                    of modern pharmacies. Instead of jumping
                                    between disconnected tools, your team gets one
                                    connected environment for managing medicines,
                                    sales, purchasing, expenses, reports and
                                    everyday operations.
                                </p>

                                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                    {[
                                        ['Inventory', 'Know what you have.'],
                                        ['POS', 'Sell faster.'],
                                        ['Analytics', 'Understand performance.'],
                                        ['Compliance', 'Stay organized.'],
                                    ].map(([title, text]) => (
                                        <div
                                            key={title}
                                            className="flex items-start gap-3"
                                        >
                                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />

                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">
                                                    {title}
                                                </p>

                                                <p className="text-sm text-slate-500">
                                                    {text}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -inset-5 rounded-[3rem] bg-gradient-to-r from-teal-500/10 to-cyan-500/10 blur-2xl" />

                                <div className="relative rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoCard
                                            icon={Store}
                                            title="Pharmacy"
                                            text="One connected workspace"
                                        />

                                        <InfoCard
                                            icon={Boxes}
                                            title="Inventory"
                                            text="Stock & expiry control"
                                        />

                                        <InfoCard
                                            icon={ShoppingCart}
                                            title="POS"
                                            text="Fast daily checkout"
                                        />

                                        <InfoCard
                                            icon={BarChart3}
                                            title="Reports"
                                            text="Clear business insight"
                                        />
                                    </div>

                                    <div className="mt-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-400/10">
                                                <HeartPulse className="h-5 w-5 text-teal-300" />
                                            </div>

                                            <div>
                                                <p className="font-bold">
                                                    Built around pharmacy operations
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    From opening the pharmacy to closing
                                                    the register.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    FEATURES
                ========================================================== */}
                <section
                    id="features"
                    className="bg-white py-24 dark:bg-slate-950"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                                One platform. Complete control.
                            </div>

                            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                                Powerful tools for every part of your pharmacy
                            </h2>

                            <p className="mt-5 text-base leading-7 text-slate-500 dark:text-slate-400">
                                Everything your team needs to operate efficiently,
                                understand the business and keep pharmacy
                                operations organized.
                            </p>
                        </div>

                        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature) => {
                                const Icon = feature.icon;

                                return (
                                    <div
                                        key={feature.title}
                                        className="group rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-800"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 transition group-hover:bg-teal-500 group-hover:text-white dark:bg-teal-500/10 dark:text-teal-400">
                                            <Icon className="h-6 w-6" />
                                        </div>

                                        <h3 className="mt-6 text-xl font-black">
                                            {feature.title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                                            {feature.text}
                                        </p>

                                        <div className="mt-6 flex items-center gap-1 text-sm font-bold text-teal-600 dark:text-teal-400">
                                            Explore
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    PRICING
                ========================================================== */}
                <section
                    id="pricing"
                    className="relative overflow-hidden bg-slate-950 py-24 text-white"
                >
                    <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
                    <div className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                        <div className="mx-auto max-w-3xl text-center">
                            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-teal-300">
                                <Zap className="h-4 w-4" />
                                Founding Launch Offer
                            </div>

                            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
                                Start smarter with
                                <span className="block text-teal-300">
                                    50% OFF.
                                </span>
                            </h2>

                            <p className="mt-5 leading-7 text-slate-400">
                                Pharmexa is launching with special founding
                                pricing for pharmacies joining us early.
                                Standard pricing is shown with the launch
                                discount applied below.
                            </p>
                        </div>

                        <div className="mt-14 grid gap-6 lg:grid-cols-3">
                            {pricingPlans.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={`relative rounded-[2rem] border p-7 ${
                                        plan.popular
                                            ? 'border-teal-400 bg-gradient-to-b from-teal-500/15 to-white/[0.04] shadow-2xl shadow-teal-500/10'
                                            : 'border-white/10 bg-white/[0.03]'
                                    }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-lg">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black">
                                            {plan.name}
                                        </h3>

                                        <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-300">
                                            50% OFF
                                        </span>
                                    </div>

                                    <p className="mt-3 text-sm leading-6 text-slate-400">
                                        {plan.description}
                                    </p>

                                    <div className="mt-7">
                                        <div className="text-sm text-slate-500 line-through">
                                            {plan.oldPrice} SAR
                                        </div>

                                        <div className="mt-1 flex items-end gap-2">
                                            <span className="text-5xl font-black tracking-tight">
                                                {plan.price}
                                            </span>

                                            <span className="pb-2 text-sm text-slate-400">
                                                SAR
                                            </span>
                                        </div>

                                        <p className="mt-1 text-xs font-semibold text-teal-300">
                                            {plan.period}
                                        </p>
                                    </div>

                                    <div className="my-7 h-px bg-white/10" />

                                    <ul className="space-y-3">
                                        {plan.features.map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-start gap-3 text-sm text-slate-300"
                                            >
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href="/register"
                                        className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black transition hover:-translate-y-0.5 ${
                                            plan.popular
                                                ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow-xl shadow-teal-500/20'
                                                : 'bg-white text-slate-950 hover:bg-teal-50'
                                        }`}
                                    >
                                        Choose {plan.name}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-slate-500">
                            Launch pricing is a promotional offer for early
                            Pharmexa customers and may change in the future.
                            Payment processing and subscription activation will
                            be connected to the registration flow before
                            production launch.
                        </p>
                    </div>
                </section>

                {/* =========================================================
                    PRODUCT SHOWCASE
                ========================================================== */}
                <section
                    id="product"
                    className="overflow-hidden bg-slate-950 py-24 text-white"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-14 lg:grid-cols-[.8fr_1.2fr]">

                            <div>
                                <div className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-300">
                                    See Pharmexa in action
                                </div>

                                <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                                    Your pharmacy.
                                    <span className="block text-teal-300">
                                        Connected.
                                    </span>
                                </h2>

                                <p className="mt-6 leading-8 text-slate-400">
                                    From the first barcode scan to the final
                                    business report, Pharmexa is designed to make
                                    your team's workflow clearer and faster.
                                </p>

                                <div className="mt-8 space-y-4">
                                    {[
                                        ['01', 'Dashboard', 'See what matters at a glance.'],
                                        ['02', 'Inventory', 'Control stock, batches and expiry.'],
                                        ['03', 'POS', 'Keep checkout fast and simple.'],
                                        ['04', 'Reports', 'Turn daily activity into insight.'],
                                    ].map(([number, title, text]) => (
                                        <div
                                            key={number}
                                            className="flex gap-4"
                                        >
                                            <span className="font-mono text-sm text-teal-400">
                                                {number}
                                            </span>

                                            <div>
                                                <p className="font-bold">
                                                    {title}
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {text}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -inset-10 bg-teal-500/10 blur-3xl" />

                                <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl">
                                    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900">

                                        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                                            </div>

                                            <span className="text-xs text-slate-500">
                                                Pharmexa Dashboard
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[150px_1fr]">

                                            <div className="border-r border-white/10 p-3">
                                                <div className="mb-5 flex h-8 items-center justify-center rounded-lg bg-teal-500/20">
                                                    <Pill className="h-4 w-4 text-teal-300" />
                                                </div>

                                                <div className="space-y-2">
                                                    {[1,2,3,4,5].map((item) => (
                                                        <div
                                                            key={item}
                                                            className={`h-8 rounded-lg ${
                                                                item === 1
                                                                    ? 'bg-teal-500/20'
                                                                    : 'bg-white/5'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="p-4 sm:p-6">
                                                <div className="grid gap-3 sm:grid-cols-3">
                                                    {[
                                                        ['Sales', 'SAR 12,840'],
                                                        ['Products', '4,286'],
                                                        ['Orders', '186'],
                                                    ].map(([label, value]) => (
                                                        <div
                                                            key={label}
                                                            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                                                        >
                                                            <p className="text-[10px] text-slate-500">
                                                                {label}
                                                            </p>

                                                            <p className="mt-2 text-base font-black">
                                                                {value}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-4 h-48 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                                    <div className="flex h-full items-end gap-2">
                                                        {[30,45,35,58,50,75,62,85,70,95,82,100].map(
                                                            (height, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex-1 rounded-t-md bg-gradient-to-t from-teal-700 to-teal-300"
                                                                    style={{
                                                                        height: `${height}%`,
                                                                    }}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    HOW IT WORKS
                ========================================================== */}
                <section
                    id="how-it-works"
                    className="bg-slate-50 py-24 dark:bg-slate-900/40"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                                Simple by design
                            </div>

                            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                                From setup to smarter decisions
                            </h2>

                            <p className="mt-5 leading-7 text-slate-500 dark:text-slate-400">
                                Pharmexa keeps the journey simple so your team can
                                focus on the pharmacy, not the software.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {steps.map((step, index) => (
                                <div
                                    key={step.number}
                                    className="relative rounded-3xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"
                                >
                                    {index < steps.length - 1 && (
                                        <div className="absolute right-[-24px] top-16 z-10 hidden lg:block">
                                            <ArrowRight className="h-6 w-6 text-teal-300" />
                                        </div>
                                    )}

                                    <span className="font-mono text-sm font-bold text-teal-500">
                                        {step.number}
                                    </span>

                                    <h3 className="mt-6 text-xl font-black">
                                        {step.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                                        {step.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    SAUDI COMPLIANCE
                ========================================================== */}
                <section className="bg-white py-24 dark:bg-slate-950">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-8 text-white sm:p-12 lg:p-16">

                            <div className="grid items-center gap-12 lg:grid-cols-[1fr_.8fr]">

                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-300">
                                        <ShieldCheck className="h-4 w-4" />
                                        Saudi Pharmacy Operations
                                    </div>

                                    <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
                                        Built with your pharmacy's future in mind.
                                    </h2>

                                    <p className="mt-6 max-w-2xl leading-8 text-slate-400">
                                        Pharmexa brings operational tools and Saudi
                                        traceability capabilities together so your
                                        pharmacy can stay organized as it grows.
                                    </p>

                                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                        {[
                                            'RSD / traceability workflows',
                                            'Transaction visibility',
                                            'Failed transaction tracking',
                                            'Operational logs',
                                        ].map((item) => (
                                            <div
                                                key={item}
                                                className="flex items-center gap-3 text-sm font-semibold text-slate-200"
                                            >
                                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-teal-400/20 bg-teal-400/5">
                                        <div className="absolute inset-8 rounded-full border border-teal-400/20" />
                                        <div className="absolute inset-16 rounded-full border border-teal-400/20" />

                                        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-400 to-cyan-500 shadow-2xl shadow-teal-500/30">
                                            <ShieldCheck className="h-12 w-12 text-white" />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    VIDEO PLACEHOLDER
                ========================================================== */}
                <section className="bg-slate-50 py-24 dark:bg-slate-900/40">
                    <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">

                        <div className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                            See the vision
                        </div>

                        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                            Meet Pharmexa
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-500 dark:text-slate-400">
                            A professional product story explaining how Pharmexa
                            helps pharmacies work smarter.
                        </p>

                        <div className="relative mt-12 aspect-video overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-2xl dark:border-slate-800">

                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,.25),transparent_35%),linear-gradient(135deg,#020617,#0f172a)]" />

                            <div className="relative flex h-full flex-col items-center justify-center p-8">

                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-500 shadow-2xl shadow-teal-500/30">
                                    <Play className="ml-1 h-8 w-8 fill-white text-white" />
                                </div>

                                <h3 className="mt-6 text-2xl font-black text-white">
                                    Smarter Pharmacy. Better Business.
                                </h3>

                                <p className="mt-2 text-sm text-slate-400">
                                    Pharmexa product introduction
                                </p>

                                <span className="mt-5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400">
                                    Promotional video coming soon
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    CONTACT
                ========================================================== */}
                <section
                    id="contact"
                    className="bg-white py-24 dark:bg-slate-950"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                        <div className="grid gap-10 lg:grid-cols-[1fr_.8fr]">

                            <div>
                                <div className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                                    Let's connect
                                </div>

                                <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                                    Have questions?
                                    <span className="block text-teal-600 dark:text-teal-400">
                                        Let's talk pharmacy.
                                    </span>
                                </h2>

                                <p className="mt-6 max-w-xl leading-8 text-slate-500 dark:text-slate-400">
                                    Whether you want to learn more about Pharmexa,
                                    request a demonstration or discuss your
                                    pharmacy's needs, we're here to help.
                                </p>

                                <a
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-teal-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-teal-500/20 transition hover:-translate-y-1 hover:bg-teal-700"
                                >
                                    <Clock3 className="h-5 w-5" />
                                    Chat with Pharmexa on WhatsApp
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">

                                <ContactCard
                                    icon={Users}
                                    title="Request a Demo"
                                    text="See how Pharmexa can fit your pharmacy."
                                    href={WHATSAPP_URL}
                                    external
                                />

                                <ContactCard
                                    icon={Clock3}
                                    title="WhatsApp"
                                    text="+966 573144547"
                                    href="https://wa.me/966573144547"
                                    external
                                />

                                <ContactCard
                                    icon={FileText}
                                    title="Email"
                                    text="jibranumar555@gmail.com"
                                    href={EMAIL_URL}
                                />

                            </div>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    FINAL CTA
                ========================================================== */}
                <section className="px-4 pb-6 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 px-6 py-16 text-center text-white shadow-2xl shadow-teal-500/20 sm:px-12 lg:py-20">

                        <Sparkles className="mx-auto h-7 w-7 opacity-80" />

                        <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest">
                            50% Launch Offer
                        </div>

                        <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                            Your pharmacy deserves
                            <span className="block text-teal-100">
                                smarter software.
                            </span>
                        </h2>

                        <p className="mx-auto mt-6 max-w-2xl leading-7 text-teal-50/80">
                            Start your Pharmexa journey today and get our
                            special founding launch offer.
                        </p>

                        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:bg-slate-50"
                            >
                                Get Started with 50% OFF
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center rounded-2xl border border-white/25 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                            >
                                Login
                            </Link>

                        </div>
                    </div>
                </section>

                {/* =========================================================
                    FOOTER
                ========================================================== */}
                <footer className="bg-white px-4 pb-8 pt-16 dark:bg-slate-950 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">

                        <div className="grid gap-10 border-b border-slate-200 pb-12 md:grid-cols-[1.5fr_1fr_1fr_1fr] dark:border-slate-800">

                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
                                        <Pill className="h-5 w-5 rotate-45 text-white" />
                                    </div>

                                    <div>
                                        <div className="text-lg font-black">
                                            PHARMEXA
                                        </div>

                                        <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-teal-600 dark:text-teal-400">
                                            Pharmacy Intelligence
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-5 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
                                    A modern pharmacy management platform built to
                                    help pharmacies operate smarter and grow with
                                    confidence.
                                </p>

                                <div className="mt-5 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                    <a
                                        href={WHATSAPP_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block transition hover:text-teal-600"
                                    >
                                        WhatsApp: +966 573144547
                                    </a>

                                    <a
                                        href={EMAIL_URL}
                                        className="block transition hover:text-teal-600"
                                    >
                                        Email: jibranumar555@gmail.com
                                    </a>
                                </div>
                            </div>

                            <FooterColumn
                                title="Product"
                                links={[
                                    ['Features', '#features'],
                                    ['Pricing', '#pricing'],
                                    ['How It Works', '#how-it-works'],
                                    ['About', '#about'],
                                ]}
                            />

                            <FooterColumn
                                title="Company"
                                links={[
                                    ['Contact', '#contact'],
                                    ['Request a Demo', '#contact'],
                                    ['Login', '/login'],
                                ]}
                            />

                            <FooterColumn
                                title="Get Started"
                                links={[
                                    ['Create Account', '/register'],
                                    ['Login', '/login'],
                                    ['View Pricing', '#pricing'],
                                ]}
                            />

                        </div>

                        <div className="flex flex-col justify-between gap-4 pt-7 text-xs text-slate-500 sm:flex-row">
                            <p>
                                © {new Date().getFullYear()} Pharmexa. All rights
                                reserved.
                            </p>

                            <p className="font-semibold text-teal-600 dark:text-teal-400">
                                Smarter Pharmacy. Better Business.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function InfoCard({ icon: Icon, title, text }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                <Icon className="h-5 w-5" />
            </div>

            <p className="mt-4 font-black">{title}</p>

            <p className="mt-1 text-xs text-slate-500">
                {text}
            </p>
        </div>
    );
}

function ContactCard({
    icon: Icon,
    title,
    text,
    href,
    external = false,
}) {
    return (
        <a
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
            <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                    <Icon className="h-5 w-5" />
                </div>

                <div>
                    <p className="font-black">
                        {title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {text}
                    </p>
                </div>

                <ChevronRight className="ml-auto h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-500" />
            </div>
        </a>
    );
}

function FooterColumn({ title, links }) {
    return (
        <div>
            <h3 className="text-sm font-black">
                {title}
            </h3>

            <div className="mt-4 space-y-3">
                {links.map(([label, href]) => (
                    <a
                        key={`${label}-${href}`}
                        href={href}
                        className="block text-sm text-slate-500 transition hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                    >
                        {label}
                    </a>
                ))}
            </div>
        </div>
    );
}

function TrendingMini() {
    return (
        <div className="flex items-end gap-0.5">
            {[4, 7, 5, 8, 6, 10].map((height, index) => (
                <span
                    key={index}
                    className="w-1 rounded-full bg-teal-400"
                    style={{
                        height: `${height}px`,
                    }}
                />
            ))}
        </div>
    );
}