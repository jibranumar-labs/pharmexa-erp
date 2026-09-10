import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Building2,
    Activity,
    Users,
    UserCheck,
    UserRound,
    ShieldCheck,
    Plus,
    ArrowRight,
    HeartPulse,
    Database,
    Server,
    Sparkles,
} from "lucide-react";

export default function Dashboard({
    stats,
    recentPharmacies = [],
    recentUsers = [],
}) {
    const cards = [
        {
            title: "Total Pharmacies",
            value: stats?.totalPharmacies ?? 0,
            icon: Building2,

            cardClass:
                "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-100/70 dark:border-blue-900/50 dark:from-blue-950/40 dark:via-slate-900 dark:to-blue-950/20",

            iconClass:
                "bg-blue-100 text-blue-600 ring-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:ring-blue-800",

            labelClass:
                "text-blue-700 dark:text-blue-300",

            glowClass:
                "bg-blue-300/30 dark:bg-blue-600/10",
        },

        {
            title: "Active",
            value: stats?.activePharmacies ?? 0,
            icon: ShieldCheck,

            cardClass:
                "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70 dark:border-emerald-900/50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20",

            iconClass:
                "bg-emerald-100 text-emerald-600 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:ring-emerald-800",

            labelClass:
                "text-emerald-700 dark:text-emerald-300",

            glowClass:
                "bg-emerald-300/30 dark:bg-emerald-600/10",
        },

        {
            title: "Inactive",
            value: stats?.inactivePharmacies ?? 0,
            icon: Activity,

            cardClass:
                "border-red-200 bg-gradient-to-br from-red-50 via-white to-red-100/70 dark:border-red-900/50 dark:from-red-950/40 dark:via-slate-900 dark:to-red-950/20",

            iconClass:
                "bg-red-100 text-red-600 ring-red-200 dark:bg-red-900/40 dark:text-red-400 dark:ring-red-800",

            labelClass:
                "text-red-700 dark:text-red-300",

            glowClass:
                "bg-red-300/30 dark:bg-red-600/10",
        },

        {
            title: "Users",
            value: stats?.totalUsers ?? 0,
            icon: Users,

            cardClass:
                "border-violet-200 bg-gradient-to-br from-violet-50 via-white to-violet-100/70 dark:border-violet-900/50 dark:from-violet-950/40 dark:via-slate-900 dark:to-violet-950/20",

            iconClass:
                "bg-violet-100 text-violet-600 ring-violet-200 dark:bg-violet-900/40 dark:text-violet-400 dark:ring-violet-800",

            labelClass:
                "text-violet-700 dark:text-violet-300",

            glowClass:
                "bg-violet-300/30 dark:bg-violet-600/10",
        },

        {
            title: "Owners",
            value: stats?.owners ?? 0,
            icon: UserCheck,

            cardClass:
                "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-100/70 dark:border-amber-900/50 dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-950/20",

            iconClass:
                "bg-amber-100 text-amber-600 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:ring-amber-800",

            labelClass:
                "text-amber-700 dark:text-amber-300",

            glowClass:
                "bg-amber-300/30 dark:bg-amber-600/10",
        },

        {
            title: "Pharmacists",
            value: stats?.pharmacists ?? 0,
            icon: UserRound,

            cardClass:
                "border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-cyan-100/70 dark:border-cyan-900/50 dark:from-cyan-950/40 dark:via-slate-900 dark:to-cyan-950/20",

            iconClass:
                "bg-cyan-100 text-cyan-600 ring-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-400 dark:ring-cyan-800",

            labelClass:
                "text-cyan-700 dark:text-cyan-300",

            glowClass:
                "bg-cyan-300/30 dark:bg-cyan-600/10",
        },
    ];

    return (
        <AppLayout title="Platform Dashboard">
            <Head title="Platform Dashboard" />

            <div className="space-y-8">

                {/* =========================================================
                    HERO
                ========================================================= */}

                <section className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-teal-50 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/30">

                    {/* Background decoration */}
                    <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-600/10" />

                    <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-teal-300/30 blur-3xl dark:bg-teal-500/10" />

                    <div className="relative flex flex-col gap-7 p-7 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/80 px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-300">

                                <Activity size={14} />

                                Platform Dashboard

                            </div>

                            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">

                                Welcome Back 👋

                            </h1>

                            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-600 dark:text-slate-300 sm:text-base">

                                Monitor pharmacies, users, and overall platform
                                activity from one centralized dashboard.

                            </p>

                        </div>

                        <div className="shrink-0">

                            <Link
                                href={route("platform.pharmacies.create")}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/25"
                            >
                                <Plus size={19} />

                                Add Pharmacy

                            </Link>

                        </div>

                    </div>

                </section>

                {/* =========================================================
                    STATISTICS
                ========================================================= */}

                <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                    {cards.map((card) => {

                        const Icon = card.icon;

                        return (

                            <div
                                key={card.title}
                                className={`group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${card.cardClass}`}
                            >

                                {/* Decorative glow */}
                                <div
                                    className={`pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full blur-3xl ${card.glowClass}`}
                                />

                                <div className="relative flex items-center justify-between gap-5">

                                    <div>

                                        <p
                                            className={`text-sm font-black ${card.labelClass}`}
                                        >
                                            {card.title}
                                        </p>

                                        <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white">

                                            {card.value}

                                        </h2>

                                        <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">

                                            Live platform statistics

                                        </p>

                                    </div>

                                    <div
                                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-105 ${card.iconClass}`}
                                    >

                                        <Icon size={29} />

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </section>

                {/* =========================================================
                    MAIN CONTENT
                ========================================================= */}

                <div className="grid gap-6 xl:grid-cols-3">

                    {/* Recent Pharmacies */}

                    <section className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50/60 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20 xl:col-span-2">

                        <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/50 p-6 dark:border-slate-700 dark:bg-blue-950/10">

                            <div>

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">

                                        <Building2 size={19} />

                                    </div>

                                    <div>

                                        <h2 className="text-xl font-black text-slate-900 dark:text-white">

                                            Recent Pharmacies

                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                                            Newly registered pharmacies on the platform.

                                        </p>

                                    </div>

                                </div>

                            </div>

                            <Link
                                href={route("platform.pharmacies.index")}
                                className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-black text-blue-600 transition hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30"
                            >
                                View All

                                <ArrowRight size={16} />
                            </Link>

                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800">

                            {recentPharmacies.length ? (

                                recentPharmacies.map((pharmacy) => (

                                    <div
                                        key={pharmacy.id}
                                        className="flex items-center justify-between gap-4 p-5 transition-all hover:bg-blue-50/60 dark:hover:bg-slate-800/40"
                                    >

                                        <div className="flex min-w-0 items-center gap-4">

                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 ring-1 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800">

                                                <Building2 size={22} />

                                            </div>

                                            <div className="min-w-0">

                                                <h3 className="truncate font-black text-slate-900 dark:text-white">

                                                    {pharmacy.name}

                                                </h3>

                                                <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">

                                                    {pharmacy.email || "-"}

                                                </p>

                                            </div>

                                        </div>

                                        {pharmacy.status ? (

                                            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">

                                                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                                                Active

                                            </span>

                                        ) : (

                                            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-black text-red-700 dark:bg-red-900/30 dark:text-red-300">

                                                <span className="h-2 w-2 rounded-full bg-red-500" />

                                                Inactive

                                            </span>

                                        )}

                                    </div>

                                ))

                            ) : (

                                <div className="p-12 text-center">

                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 dark:bg-blue-900/30">

                                        <Building2
                                            size={36}
                                            className="text-blue-600 dark:text-blue-400"
                                        />

                                    </div>

                                    <h3 className="mt-5 font-black text-slate-900 dark:text-white">

                                        No Pharmacies Found

                                    </h3>

                                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">

                                        Create your first pharmacy to start using
                                        the platform.

                                    </p>

                                </div>

                            )}

                        </div>

                    </section>

                    {/* =====================================================
                        RIGHT SIDE
                    ===================================================== */}

                    <div className="space-y-6">

                        {/* Recent Users */}

                        <section className="overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-white via-white to-violet-50/70 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950/20">

                            <div className="border-b border-violet-100 bg-violet-50/50 p-6 dark:border-slate-700 dark:bg-violet-950/10">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">

                                        <Users size={19} />

                                    </div>

                                    <h2 className="text-lg font-black text-slate-900 dark:text-white">

                                        Recent Users

                                    </h2>

                                </div>

                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800">

                                {recentUsers.length ? (

                                    recentUsers.map((user) => (

                                        <div
                                            key={user.id}
                                            className="flex items-center gap-3 p-5 transition hover:bg-violet-50/50 dark:hover:bg-slate-800/40"
                                        >

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 ring-1 ring-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:ring-violet-800">

                                                <UserRound size={18} />

                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <h3 className="truncate font-semibold text-slate-900 dark:text-white">

                                                    {user.name}

                                                </h3>

                                                <p className="truncate text-xs text-slate-500 dark:text-slate-400">

                                                    {user.email}

                                                </p>

                                            </div>

                                            <span className="max-w-[100px] truncate rounded-full bg-violet-100 px-3 py-1 text-xs font-black capitalize text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">

                                                {String(user.role).replaceAll("_", " ")}

                                            </span>

                                        </div>

                                    ))

                                ) : (

                                    <div className="p-8 text-center">

                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-500 dark:bg-violet-900/30">

                                            <Users size={24} />

                                        </div>

                                        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">

                                            No users available.

                                        </p>

                                    </div>

                                )}

                            </div>

                        </section>

                        {/* Quick Actions */}

                        <section className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 shadow-sm dark:border-blue-900/40 dark:from-blue-950/30 dark:via-slate-900 dark:to-cyan-950/20">

                            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-600/10" />

                            <div className="relative">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">

                                        <Sparkles size={19} />

                                    </div>

                                    <h2 className="text-lg font-black text-slate-900 dark:text-white">

                                        Quick Actions

                                    </h2>

                                </div>

                                <div className="mt-5 grid gap-3">

                                    <Link
                                        href={route("platform.pharmacies.create")}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-black text-white shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
                                    >

                                        <Plus size={17} />

                                        Add Pharmacy

                                    </Link>

                                    <Link
                                        href={route("platform.pharmacies.index")}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white/80 px-5 py-3 font-black text-blue-700 transition-all hover:bg-blue-100 dark:border-blue-900/50 dark:bg-slate-900/60 dark:text-blue-300 dark:hover:bg-blue-900/30"
                                    >

                                        <Building2 size={17} />

                                        Manage Pharmacies

                                    </Link>

                                </div>

                            </div>

                        </section>

                    </div>

                </div>

                {/* =========================================================
                    BOTTOM SECTION
                ========================================================= */}

                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Platform Overview */}

                    <section className="overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-white to-indigo-50/60 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20">

                        <div className="border-b border-indigo-100 bg-indigo-50/40 p-6 dark:border-slate-700 dark:bg-indigo-950/10">

                            <div className="flex items-start gap-3">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">

                                    <Activity size={20} />

                                </div>

                                <div>

                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">

                                        Platform Overview

                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                                        A quick summary of the current platform status.

                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="space-y-3 p-6">

                            <OverviewItem
                                label="Total Pharmacies"
                                value={stats?.totalPharmacies ?? 0}
                                tone="blue"
                            />

                            <OverviewItem
                                label="Active Pharmacies"
                                value={stats?.activePharmacies ?? 0}
                                tone="emerald"
                            />

                            <OverviewItem
                                label="Inactive Pharmacies"
                                value={stats?.inactivePharmacies ?? 0}
                                tone="red"
                            />

                            <OverviewItem
                                label="Total Users"
                                value={stats?.totalUsers ?? 0}
                                tone="violet"
                            />

                            <OverviewItem
                                label="Owners"
                                value={stats?.owners ?? 0}
                                tone="amber"
                            />

                            <OverviewItem
                                label="Pharmacists"
                                value={stats?.pharmacists ?? 0}
                                tone="cyan"
                            />

                        </div>

                    </section>

                    {/* Platform Health */}

                    <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/60 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20">

                        <div className="border-b border-emerald-100 bg-emerald-50/40 p-6 dark:border-slate-700 dark:bg-emerald-950/10">

                            <div className="flex items-start gap-3">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">

                                    <HeartPulse size={20} />

                                </div>

                                <div>

                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">

                                        Platform Health

                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                                        Core platform services.

                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="space-y-3 p-6">

                            <HealthItem
                                title="Application"
                                status="Running"
                                icon={Server}
                            />

                            <HealthItem
                                title="Database"
                                status="Online"
                                icon={Database}
                            />

                            <HealthItem
                                title="Platform"
                                status="Healthy"
                                icon={ShieldCheck}
                            />

                            <HealthItem
                                title="Users"
                                status="Connected"
                                icon={Users}
                            />

                        </div>

                    </section>

                </div>

            </div>

        </AppLayout>
    );
}


/* =============================================================
   PLATFORM OVERVIEW ITEM
============================================================= */

function OverviewItem({ label, value, tone = "blue" }) {

    const tones = {
        blue: {
            container:
                "border-blue-100 bg-blue-50/80 dark:border-blue-900/30 dark:bg-blue-950/20",
            value:
                "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
        },

        emerald: {
            container:
                "border-emerald-100 bg-emerald-50/80 dark:border-emerald-900/30 dark:bg-emerald-950/20",
            value:
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
        },

        red: {
            container:
                "border-red-100 bg-red-50/80 dark:border-red-900/30 dark:bg-red-950/20",
            value:
                "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
        },

        violet: {
            container:
                "border-violet-100 bg-violet-50/80 dark:border-violet-900/30 dark:bg-violet-950/20",
            value:
                "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
        },

        amber: {
            container:
                "border-amber-100 bg-amber-50/80 dark:border-amber-900/30 dark:bg-amber-950/20",
            value:
                "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
        },

        cyan: {
            container:
                "border-cyan-100 bg-cyan-50/80 dark:border-cyan-900/30 dark:bg-cyan-950/20",
            value:
                "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
        },
    };

    const selected = tones[tone] ?? tones.blue;

    return (

        <div
            className={`flex items-center justify-between rounded-2xl border px-5 py-3.5 transition hover:shadow-sm ${selected.container}`}
        >

            <span className="font-semibold text-slate-700 dark:text-slate-300">

                {label}

            </span>

            <span
                className={`min-w-10 rounded-xl px-3 py-1.5 text-center text-lg font-black ${selected.value}`}
            >

                {value}

            </span>

        </div>

    );
}


/* =============================================================
   PLATFORM HEALTH ITEM
============================================================= */

function HealthItem({ title, status, icon: Icon }) {

    return (

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4 transition hover:shadow-sm dark:border-emerald-900/30 dark:bg-emerald-950/20">

            <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100 dark:bg-slate-900 dark:text-emerald-400 dark:ring-emerald-900/50">

                    {Icon && <Icon size={17} />}

                </div>

                <span className="font-semibold text-slate-700 dark:text-slate-300">

                    {title}

                </span>

            </div>

            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">

                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                {status}

            </span>

        </div>

    );
}