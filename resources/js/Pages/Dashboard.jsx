import AppLayout from '@/Layouts/AppLayout';
import { useTheme } from '@/Hooks/useTheme';
import { Head, Link, usePage } from '@inertiajs/react';
import { RoleBadge } from '@/Components/UI/Badge';
import {
    Activity,
    AlertTriangle,
    ArrowUpRight,
    BarChart3,
    CalendarDays,
    Clock,
    Package,
    Pill,
    Plus,
    ShoppingCart,
    Users,
    Boxes,
    ShieldAlert,
    TrendingUp,
    CheckCircle2,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export default function Dashboard({
    recentActivity = [],
    stats = {},
    recentMovements = [],
    salesChart = [],
    recentSales = [],
    recentPurchases = [],
    topMedicines = [],
}) {
    const { auth } = usePage().props;
    const user = auth.user;
    const { isDark } = useTheme();

    const chartTickColor = isDark ? '#94a3b8' : '#64748B';
    const chartGridColor = isDark ? '#334155' : '#E2E8F0';

    const greeting = getGreeting();

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const dashboardStats = [
        {
            label: 'Total Products',
            value: stats.totalMedicines || 0,
            note: 'Registered products',
            icon: Pill,
            route: 'medicines.index',

            cardBg:
                'bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/30',

            border:
                'border-blue-100 dark:border-blue-900/50',

            iconBg:
                'bg-blue-100 dark:bg-blue-900/40',

            iconColor:
                'text-blue-600 dark:text-blue-400',

            noteColor:
                'text-blue-600 dark:text-blue-400',

            hover:
                'hover:border-blue-200 dark:hover:border-blue-800',
        },

        {
            label: 'Active Products',
            value: stats.activeMedicines || 0,
            note: 'Available products',
            icon: CheckCircle2,
            route: 'medicines.index',

            cardBg:
                'bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/30',

            border:
                'border-emerald-100 dark:border-emerald-900/50',

            iconBg:
                'bg-emerald-100 dark:bg-emerald-900/40',

            iconColor:
                'text-emerald-600 dark:text-emerald-400',

            noteColor:
                'text-emerald-600 dark:text-emerald-400',

            hover:
                'hover:border-emerald-200 dark:hover:border-emerald-800',
        },

        {
            label: 'Low Stock',
            value: stats.lowStock || 0,
            note: 'Needs attention',
            icon: AlertTriangle,
            route: 'inventory.index',

            cardBg:
                'bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/30',

            border:
                'border-amber-100 dark:border-amber-900/50',

            iconBg:
                'bg-amber-100 dark:bg-amber-900/40',

            iconColor:
                'text-amber-600 dark:text-amber-400',

            noteColor:
                'text-amber-600 dark:text-amber-400',

            hover:
                'hover:border-amber-200 dark:hover:border-amber-800',
        },

        {
            label: 'Expiring Soon',
            value: stats.expiringSoon || 0,
            note: 'Within 30 days',
            icon: Clock,
            route: 'medicines.expiry',

            cardBg:
                'bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-rose-950/40 dark:via-slate-900 dark:to-red-950/30',

            border:
                'border-rose-100 dark:border-rose-900/50',

            iconBg:
                'bg-rose-100 dark:bg-rose-900/40',

            iconColor:
                'text-rose-600 dark:text-rose-400',

            noteColor:
                'text-rose-600 dark:text-rose-400',

            hover:
                'hover:border-rose-200 dark:hover:border-rose-800',
        },
    ];

    const salesData = salesChart;
    const activity = recentActivity;

    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard | Pharmexa" />

            <div className="space-y-7">

                {/* =========================================================
                    PHARMEXA COMMAND CENTER
                ========================================================= */}

               <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-500 p-5 text-white shadow-xl shadow-blue-500/10 lg:p-7">
                    {/* Decorative background */}
                    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />

                    <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

                        {/* Left */}
                        <div className="max-w-3xl">

                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur-xl">
                                <Activity size={16} />
                                Pharmexa Command Center
                            </div>

                            <h1 className="mt-5 text-4xl font-black tracking-tight lg:text-5xl">
                                {greeting}
                            </h1>

                            <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-white/90">
                                Welcome to Pharmexa Command Center. Monitor sales,
                                stock, expiry alerts, and pharmacy performance from
                                one centralized workspace.
                            </p>

                            {/* KPI Badges */}
                            <div className="mt-6 flex flex-wrap gap-3">

                                <KpiBadge
                                    label="Today Sales"
                                    value={`${Number(
                                        stats.todayRevenue || 0
                                    ).toFixed(2)} SAR`}
                                />

                                <KpiBadge
                                    label="Monthly Sales"
                                    value={`${Number(
                                        stats.monthlyRevenue || 0
                                    ).toFixed(2)} SAR`}
                                />

                                <KpiBadge
                                    label="Invoices"
                                    value={stats.totalInvoices || 0}
                                />

                                <KpiBadge
                                    label="Products"
                                    value={stats.totalMedicines || 0}
                                />

                            </div>
                        </div>

                        {/* Right Information Panel */}
                        <div className="w-full rounded-[1.75rem] border border-white/20 bg-white/15 p-5 shadow-xl backdrop-blur-xl lg:w-auto lg:min-w-[300px]">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                                    <CalendarDays size={20} />
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                                        Today
                                    </p>

                                    <p className="mt-1 text-sm font-black">
                                        {today}
                                    </p>
                                </div>

                            </div>

                            <div className="my-4 h-px bg-white/15" />

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                                    <Clock size={20} />
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                                        Current Time
                                    </p>

                                    <LiveClock />
                                </div>

                            </div>

                            <div className="my-4 h-px bg-white/15" />

                            <div className="flex items-center justify-between gap-4">

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                                        Signed In As
                                    </p>

                                    <p className="mt-1 max-w-[150px] truncate text-sm font-black">
                                        {user.name}
                                    </p>
                                </div>

                                <RoleBadge role={user.role} />

                            </div>

                        </div>
                    </div>
                </section>


                {/* =========================================================
                    MAIN STATISTICS
                ========================================================= */}

                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                    {dashboardStats.map((stat) => {

                        const Icon = stat.icon;

                        return (
                            <Link
                                key={stat.label}
                                href={route(stat.route)}
                                className={`group relative overflow-hidden rounded-[1.75rem] border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${stat.cardBg} ${stat.border} ${stat.hover}`}
                            >

                                {/* Decorative circle */}
                                <div
                                    className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-2xl ${stat.iconBg}`}
                                />

                                <div className="relative">

                                    <div className="flex items-start justify-between">

                                        <div
                                            className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${stat.iconBg} ${stat.iconColor}`}
                                        >
                                            <Icon size={26} />
                                        </div>

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-slate-400 shadow-sm transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-slate-700 dark:bg-slate-800/70 dark:text-slate-500 dark:group-hover:text-white">
                                            <ArrowUpRight size={19} />
                                        </div>

                                    </div>

                                    <p className="mt-6 text-sm font-bold text-slate-500 dark:text-slate-400">
                                        {stat.label}
                                    </p>

                                    <div className="mt-2 flex items-end justify-between gap-3">

                                        <h3 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white">
                                            {stat.value}
                                        </h3>

                                        <TrendingUp
                                            size={20}
                                            className={stat.iconColor}
                                        />

                                    </div>

                                    <div className="mt-4 flex items-center gap-2">

                                        <span
                                            className={`h-2 w-2 rounded-full ${stat.iconBg}`}
                                        />

                                        <p
                                            className={`text-sm font-bold ${stat.noteColor}`}
                                        >
                                            {stat.note}
                                        </p>

                                    </div>

                                </div>
                            </Link>
                        );
                    })}

                </section>
                                {/* =========================================================
                    SALES OVERVIEW + QUICK ACTIONS
                ========================================================= */}

                <section className="grid gap-6 xl:grid-cols-3">

                    {/* Sales Overview */}
                    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 dark:border-slate-700 dark:bg-slate-900 xl:col-span-2">

                        {/* Header */}
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                                        <BarChart3 size={21} />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-black text-slate-950 dark:text-white">
                                            Sales Overview
                                        </h2>

                                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                            Revenue and invoice activity for the last 7 days.
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Chart Legend */}
                            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">

                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                        Sales
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                        Orders
                                    </span>
                                </div>

                            </div>
                        </div>


                        {/* Mini Statistics */}
                        <div className="grid gap-4 p-6 sm:grid-cols-3">

                            <MiniStat
                                title="Inventory Value"
                                value={`${Number(
                                    stats.inventoryValue || 0
                                ).toFixed(0)} SAR`}
                                icon={Package}
                                variant="blue"
                            />

                            <MiniStat
                                title="Expired"
                                value={stats.expired || 0}
                                icon={ShieldAlert}
                                variant="rose"
                            />

                            <MiniStat
                                title="Out Of Stock"
                                value={stats.outOfStock || 0}
                                icon={AlertTriangle}
                                variant="amber"
                            />

                        </div>


                        {/* Chart */}
                        <div className="px-6 pb-6">

                            <div className="relative h-80 overflow-hidden rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4 dark:border-slate-700 dark:from-slate-800 dark:via-slate-900 dark:to-emerald-950/20">

                                <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-500/10" />

                                <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />

                                <div className="relative h-full">

                                    <ResponsiveContainer width="100%" height="100%">

                                        <AreaChart data={salesData}>

                                            <defs>

                                                <linearGradient
                                                    id="sales"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#2563EB"
                                                        stopOpacity={0.35}
                                                    />

                                                    <stop
                                                        offset="95%"
                                                        stopColor="#2563EB"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>

                                                <linearGradient
                                                    id="orders"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#10B981"
                                                        stopOpacity={0.35}
                                                    />

                                                    <stop
                                                        offset="95%"
                                                        stopColor="#10B981"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>

                                            </defs>

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke={chartGridColor}
                                                vertical={false}
                                            />

                                            <XAxis
                                                dataKey="day"
                                                tick={{
                                                    fill: chartTickColor,
                                                    fontWeight: 700,
                                                    fontSize: 12,
                                                }}
                                                axisLine={false}
                                                tickLine={false}
                                            />

                                            <YAxis
                                                tick={{
                                                    fill: chartTickColor,
                                                    fontWeight: 700,
                                                    fontSize: 12,
                                                }}
                                                axisLine={false}
                                                tickLine={false}
                                            />

                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '16px',
                                                    border: isDark
                                                        ? '1px solid #334155'
                                                        : '1px solid #e2e8f0',
                                                    backgroundColor: isDark
                                                        ? '#0f172a'
                                                        : '#ffffff',
                                                    color: isDark
                                                        ? '#f8fafc'
                                                        : '#0f172a',
                                                    boxShadow:
                                                        '0 15px 35px rgba(15, 23, 42, 0.12)',
                                                }}
                                            />

                                            <Area
                                                type="monotone"
                                                dataKey="sales"
                                                stroke="#2563EB"
                                                strokeWidth={3}
                                                fill="url(#sales)"
                                            />

                                            <Area
                                                type="monotone"
                                                dataKey="orders"
                                                stroke="#10B981"
                                                strokeWidth={3}
                                                fill="url(#orders)"
                                            />

                                        </AreaChart>

                                    </ResponsiveContainer>

                                </div>
                            </div>
                        </div>
                    </div>


                    {/* =====================================================
                        QUICK ACTIONS
                    ===================================================== */}

                    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

                        <div className="border-b border-slate-100 p-6 dark:border-slate-800">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
                                    <Plus size={22} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-black text-slate-950 dark:text-white">
                                        Quick Actions
                                    </h2>

                                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Common pharmacy tasks.
                                    </p>
                                </div>

                            </div>
                        </div>


                        <div className="space-y-3 p-6">

                            <QuickAction
                                label="New Sale"
                                description="Create a new POS transaction"
                                icon={ShoppingCart}
                                routeName="pos.index"
                                variant="blue"
                            />

                            <QuickAction
                                label="Add Product"
                                description="Register medicine or product"
                                icon={Pill}
                                routeName="medicines.create"
                                variant="emerald"
                            />

                            <QuickAction
                                label="Purchase Stock"
                                description="Create a supplier purchase"
                                icon={Package}
                                routeName="purchases.create"
                                variant="amber"
                            />

                            <QuickAction
                                label="Add Customer"
                                description="Register a new customer"
                                icon={Users}
                                routeName="customers.create"
                                variant="violet"
                            />

                        </div>
                    </div>

                </section>


                {/* =========================================================
                    RECENT ACTIVITY + SMART ALERTS
                ========================================================= */}

                <section className="grid gap-6 xl:grid-cols-3">

                    {/* Recent Activity */}
                    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 xl:col-span-2">

                        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400">
                                    <Activity size={21} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-black text-slate-950 dark:text-white">
                                        Recent Activity
                                    </h2>

                                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Latest pharmacy updates and operations.
                                    </p>
                                </div>

                            </div>

                            <div className="hidden rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 sm:block">
                                Live Activity
                            </div>

                        </div>


                        <div className="p-6">

                            {activity.length ? (

                                <div className="space-y-2">

                                    {activity.map((item, index) => (

                                        <div
                                            key={index}
                                            className="group flex items-start gap-4 rounded-2xl p-4 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                        >

                                            {/* Timeline Icon */}
                                            <div className="relative">

                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400">
                                                    <Activity size={18} />
                                                </div>

                                                {index !== activity.length - 1 && (
                                                    <span className="absolute left-1/2 top-12 h-5 w-px -translate-x-1/2 bg-slate-200 dark:bg-slate-700" />
                                                )}

                                            </div>


                                            <div className="min-w-0 flex-1">

                                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                                                    <p className="font-black text-slate-900 dark:text-white">
                                                        {item.action}
                                                    </p>

                                                    <span className="shrink-0 text-xs font-bold text-slate-400 dark:text-slate-500">
                                                        {item.time}
                                                    </span>

                                                </div>

                                                <p className="mt-1 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                                                    {item.detail}
                                                </p>

                                            </div>
                                        </div>

                                    ))}

                                </div>

                            ) : (

                                <div className="py-12 text-center">

                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 dark:bg-cyan-950/40 dark:text-cyan-400">
                                        <Activity size={28} />
                                    </div>

                                    <h3 className="mt-4 font-black text-slate-900 dark:text-white">
                                        No Recent Activity
                                    </h3>

                                    <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        New pharmacy activity will appear here.
                                    </p>

                                </div>

                            )}

                        </div>
                    </div>


                    {/* =====================================================
                        SMART ALERTS
                    ===================================================== */}

                    <div className="overflow-hidden rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-sm dark:border-amber-900/50 dark:from-amber-950/30 dark:via-slate-900 dark:to-orange-950/20">

                        <div className="border-b border-amber-100 p-6 dark:border-amber-900/40">

                            <div className="flex items-center gap-3">

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-sm dark:bg-amber-900/40 dark:text-amber-400">
                                    <ShieldAlert size={23} />
                                </div>

                                <div>

                                    <h2 className="text-xl font-black text-slate-950 dark:text-white">
                                        Smart Alerts
                                    </h2>

                                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Inventory attention required.
                                    </p>

                                </div>
                            </div>

                        </div>


                        <div className="space-y-3 p-6">

                            <AlertRow
                                icon={AlertTriangle}
                                title="Low Stock"
                                text={`${stats.lowStock || 0} products are low in stock.`}
                                variant="amber"
                            />

                            <AlertRow
                                icon={Clock}
                                title="Expiring Soon"
                                text={`${stats.expiringSoon || 0} products expire within 30 days.`}
                                variant="orange"
                            />

                            <AlertRow
                                icon={ShieldAlert}
                                title="Expired Products"
                                text={`${stats.expired || 0} products are already expired.`}
                                variant="rose"
                            />

                        </div>


                        <div className="px-6 pb-6">

                            <Link
                                href={route('inventory.index')}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                            >
                                Review Inventory
                                <ArrowUpRight size={17} />
                            </Link>

                        </div>
                    </div>

                </section>
                                {/* =========================================================
                    TOP SELLING PRODUCTS + RECENT PURCHASES
                ========================================================= */}

                <section className="grid gap-6 lg:grid-cols-2">

                    {/* Top Selling Products */}
                    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">

                            <div className="flex items-center gap-3">

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm dark:bg-emerald-900/40 dark:text-emerald-400">
                                    <TrendingUp size={23} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-black text-slate-950 dark:text-white">
                                        Top Selling Products
                                    </h2>

                                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Best performing products by quantity sold.
                                    </p>
                                </div>

                            </div>

                            <div className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 sm:block">
                                Top Products
                            </div>

                        </div>


                        {/* Content */}
                        <div className="p-6">

                            {topMedicines.length ? (

                                <div className="space-y-3">

                                    {topMedicines.map((medicine, index) => (

                                        <div
                                            key={index}
                                            className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/60 hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/20"
                                        >

                                            <div className="flex min-w-0 items-center gap-4">

                                                {/* Ranking */}
                                                <div
                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${
                                                        index === 0
                                                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                                            : index === 1
                                                              ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                                                              : index === 2
                                                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                                                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                    }`}
                                                >
                                                    #{index + 1}
                                                </div>


                                                <div className="min-w-0">

                                                    <p className="truncate font-black text-slate-900 dark:text-white">
                                                        {medicine.medicine_name}
                                                    </p>

                                                    <div className="mt-1 flex items-center gap-2">

                                                        <Pill
                                                            size={13}
                                                            className="text-slate-400"
                                                        />

                                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                                            Product Sales
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* Quantity */}
                                            <div className="shrink-0 text-right">

                                                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                                    {medicine.total_quantity}
                                                </p>

                                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                                                    sold
                                                </p>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            ) : (

                                <EmptyState
                                    icon={TrendingUp}
                                    title="No Sales Yet"
                                    description="Top selling products will appear here after sales are recorded."
                                    variant="emerald"
                                />

                            )}

                        </div>
                    </div>


                    {/* =====================================================
                        RECENT PURCHASES
                    ===================================================== */}

                    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">

                            <div className="flex items-center gap-3">

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm dark:bg-blue-900/40 dark:text-blue-400">
                                    <Package size={23} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-black text-slate-950 dark:text-white">
                                        Recent Purchases
                                    </h2>

                                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Latest stock purchases from suppliers.
                                    </p>
                                </div>

                            </div>

                            <Link
                                href={route('purchases.index')}
                                className="hidden items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50 sm:inline-flex"
                            >
                                View All
                                <ArrowUpRight size={14} />
                            </Link>

                        </div>


                        {/* Content */}
                        <div className="p-6">

                            {recentPurchases.length ? (

                                <div className="space-y-3">

                                    {recentPurchases.map((purchase) => (

                                        <Link
                                            key={purchase.id}
                                            href={route(
                                                'purchases.show',
                                                purchase.id
                                            )}
                                            className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-blue-900 dark:hover:bg-blue-950/20"
                                        >

                                            <div className="flex min-w-0 items-center gap-4">

                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                                                    <Package size={19} />
                                                </div>


                                                <div className="min-w-0">

                                                    <p className="truncate font-black text-slate-900 dark:text-white">
                                                        {purchase.purchase_number}
                                                    </p>

                                                    <p className="mt-1 truncate text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        {purchase.supplier?.name ||
                                                            'No supplier'}
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="shrink-0 text-right">

                                                <p className="font-black text-blue-700 dark:text-blue-300">
                                                    {Number(
                                                        purchase.total || 0
                                                    ).toFixed(2)}{' '}
                                                    SAR
                                                </p>

                                                <div className="mt-1 flex items-center justify-end gap-1 text-xs font-bold text-slate-400 transition group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400">
                                                    Details
                                                    <ArrowUpRight size={13} />
                                                </div>

                                            </div>

                                        </Link>

                                    ))}

                                </div>

                            ) : (

                                <EmptyState
                                    icon={Package}
                                    title="No Purchases Yet"
                                    description="Recent supplier purchases will appear here."
                                    variant="blue"
                                />

                            )}

                        </div>
                    </div>

                </section>

            </div>
        </AppLayout>
    );
}


/* =========================================================
    MINI STAT
========================================================= */

function MiniStat({
    title,
    value,
    icon: Icon,
    variant = 'blue',
}) {
    const variants = {
        blue: {
            container:
                'border-blue-100 bg-blue-50/70 dark:border-blue-900/50 dark:bg-blue-950/20',
            icon:
                'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
            value:
                'text-blue-700 dark:text-blue-300',
        },

        rose: {
            container:
                'border-rose-100 bg-rose-50/70 dark:border-rose-900/50 dark:bg-rose-950/20',
            icon:
                'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400',
            value:
                'text-rose-700 dark:text-rose-300',
        },

        amber: {
            container:
                'border-amber-100 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20',
            icon:
                'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
            value:
                'text-amber-700 dark:text-amber-300',
        },
    };

    const style = variants[variant] ?? variants.blue;

    return (
        <div
            className={`rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${style.container}`}
        >

            <div className="flex items-start justify-between gap-3">

                <div>

                    <p className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {title}
                    </p>

                    <p
                        className={`mt-2 text-xl font-black ${style.value}`}
                    >
                        {value}
                    </p>

                </div>


                {Icon && (
                    <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
                    >
                        <Icon size={18} />
                    </div>
                )}

            </div>

        </div>
    );
}


/* =========================================================
    QUICK ACTION
========================================================= */

function QuickAction({
    label,
    description,
    icon: Icon,
    routeName,
    variant = 'blue',
}) {
    const variants = {
        blue: {
            container:
                'hover:border-blue-200 hover:bg-blue-50 dark:hover:border-blue-900 dark:hover:bg-blue-950/20',
            icon:
                'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
            arrow:
                'group-hover:text-blue-600 dark:group-hover:text-blue-400',
        },

        emerald: {
            container:
                'hover:border-emerald-200 hover:bg-emerald-50 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/20',
            icon:
                'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
            arrow:
                'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
        },

        amber: {
            container:
                'hover:border-amber-200 hover:bg-amber-50 dark:hover:border-amber-900 dark:hover:bg-amber-950/20',
            icon:
                'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
            arrow:
                'group-hover:text-amber-600 dark:group-hover:text-amber-400',
        },

        violet: {
            container:
                'hover:border-violet-200 hover:bg-violet-50 dark:hover:border-violet-900 dark:hover:bg-violet-950/20',
            icon:
                'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400',
            arrow:
                'group-hover:text-violet-600 dark:group-hover:text-violet-400',
        },
    };

    const style = variants[variant] ?? variants.blue;

    return (
        <Link
            href={route(routeName)}
            className={`group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/50 ${style.container}`}
        >

            <div className="flex min-w-0 items-center gap-3">

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105 ${style.icon}`}
                >
                    <Icon size={19} />
                </div>


                <div className="min-w-0">

                    <p className="font-black text-slate-900 dark:text-white">
                        {label}
                    </p>

                    <p className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                        {description}
                    </p>

                </div>

            </div>


            <ArrowUpRight
                size={18}
                className={`shrink-0 text-slate-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${style.arrow}`}
            />

        </Link>
    );
}


/* =========================================================
    SMART ALERT ROW
========================================================= */

function AlertRow({
    icon: Icon,
    title,
    text,
    variant = 'amber',
}) {
    const variants = {
        amber: {
            container:
                'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30',
            icon:
                'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
            title:
                'text-amber-800 dark:text-amber-200',
        },

        orange: {
            container:
                'border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-950/30',
            icon:
                'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400',
            title:
                'text-orange-800 dark:text-orange-200',
        },

        rose: {
            container:
                'border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/30',
            icon:
                'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400',
            title:
                'text-rose-800 dark:text-rose-200',
        },
    };

    const style = variants[variant] ?? variants.amber;

    return (
        <div
            className={`flex items-start gap-3 rounded-2xl border p-4 ${style.container}`}
        >

            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
            >
                <Icon size={18} />
            </div>


            <div>

                <p className={`text-sm font-black ${style.title}`}>
                    {title}
                </p>

                <p className="mt-1 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-400">
                    {text}
                </p>

            </div>

        </div>
    );
}


/* =========================================================
    EMPTY STATE
========================================================= */

function EmptyState({
    icon: Icon,
    title,
    description,
    variant = 'blue',
}) {
    const variants = {
        blue:
            'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',

        emerald:
            'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
    };

    return (
        <div className="py-10 text-center">

            <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
                    variants[variant] ?? variants.blue
                }`}
            >
                <Icon size={28} />
            </div>

            <h3 className="mt-4 font-black text-slate-900 dark:text-white">
                {title}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                {description}
            </p>

        </div>
    );
}


/* =========================================================
    COMMAND CENTER KPI BADGE
========================================================= */

function KpiBadge({ label, value }) {
    return (
        <div className="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 shadow-sm backdrop-blur-xl transition-all duration-200 hover:bg-white/20">

            <p className="text-[10px] font-black uppercase tracking-wider text-white/70">
                {label}
            </p>

            <p className="mt-1 text-sm font-black text-white">
                {value}
            </p>

        </div>
    );
}


/* =========================================================
    LIVE CLOCK
========================================================= */

function LiveClock() {
    const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <p className="mt-1 text-sm font-black text-white">
            {time}
        </p>
    );
}


/* =========================================================
    GREETING
========================================================= */

function getGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return 'Good Morning';
    }

    if (hour >= 12 && hour < 17) {
        return 'Good Afternoon';
    }

    if (hour >= 17 && hour < 21) {
        return 'Good Evening';
    }

    return 'Good Night';
}