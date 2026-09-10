import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Pill,
    AlertTriangle,
    ShieldAlert,
    PackageCheck,
    History,
    Clock3,
    Barcode,
    ArrowRight,
    Boxes,
} from "lucide-react";

export default function Dashboard({ stats = {}, recentMovements = [] }) {
    const modules = [
        {
            title: "Products",
            description: "Manage all products in your inventory.",
            count: stats.totalMedicines || 0,
            icon: Pill,
            route: "medicines.index",
        },
        {
            title: "Active Products",
            description: "Available active product records.",
            count: stats.activeMedicines || 0,
            icon: PackageCheck,
            route: "medicines.index",
        },
        {
            title: "Low Stock",
            description: "Products that need restocking.",
            count: stats.lowStock || 0,
            icon: AlertTriangle,
            route: "medicines.index",
        },
        {
            title: "Out of Stock",
            description: "Products currently unavailable.",
            count: stats.outOfStock || 0,
            icon: Boxes,
            route: "medicines.index",
        },
        {
            title: "Expiry",
            description: "Check expiring products.",
            count: stats.expiringSoon || 0,
            icon: Clock3,
            route: "medicines.expiry",
        },
        {
            title: "Expired",
            description: "Products already expired.",
            count: stats.expired || 0,
            icon: ShieldAlert,
            route: "medicines.expiry",
        },
        {
            title: "Stock History",
            description: "View stock movement records.",
            count: recentMovements.length || 0,
            icon: History,
            route: "stock.history",
        },
        {
            title: "Inventory Value",
            description: "Current purchase value.",
            count: `${Number(stats.inventoryValue || 0).toFixed(0)} SAR`,
            icon: Barcode,
            route: "medicines.index",
        },
    ];

    const health =
        (stats.totalMedicines || 0) > 0
            ? Math.max(
                  0,
                  Math.round(
                      100 -
                          ((stats.lowStock || 0) /
                              (stats.totalMedicines || 1)) *
                              100
                  )
              )
            : 100;

    return (
        <AppLayout title="Inventory">
            <Head title="Product Inventory | Pharmexa" />

            <div className="space-y-8">
                <div className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-8 text-white shadow-2xl lg:p-10">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur transition-colors">
                                Pharmexa Inventory Command Center
                            </div>

                            <h1 className="text-4xl font-black lg:text-5xl">
                                Product Inventory
                            </h1>

                            <p className="mt-3 max-w-3xl text-lg text-white/90">
                                Manage products, expiry, stock levels,
                                inventory value and stock movements from one
                                professional dashboard.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/20 bg-white/15 p-6 backdrop-blur-lg transition-colors">
                            <p className="text-sm font-bold">
                                Inventory Status
                            </p>

                            <h2 className="mt-2 text-5xl font-black">
                                {health}%
                            </h2>

                            <p className="text-white/80">
                                {health >= 90
                                    ? "Excellent"
                                    : health >= 70
                                    ? "Good"
                                    : "Needs Attention"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {modules.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                href={route(item.route)}
                                key={item.title}
                                className="group rounded-3xl border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-900"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-lg">
                                        <Icon size={28} />
                                    </div>

                                    <ArrowRight className="text-slate-300 dark:text-slate-600 transition group-hover:text-emerald-500" />
                                </div>

                                <p className="mt-6 text-xl font-black text-slate-900 dark:text-white">
                                    {item.title}
                                </p>

                                <p className="mt-2 min-h-[42px] text-sm text-slate-500 dark:text-slate-400">
                                    {item.description}
                                </p>

                                <div className="mt-5 flex items-center justify-between gap-3">
                                    <span className="break-words text-3xl font-black text-blue-600">
                                        {item.count}
                                    </span>

                                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                                        Open
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 transition-colors">
                    <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                        Recent Stock Movements
                    </h2>

                    <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-700">
                        {recentMovements.length ? (
                            recentMovements.map((movement) => (
                                <div
                                    key={movement.id}
                                    className="flex items-center justify-between gap-4 py-4"
                                >
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white">
                                            {movement.medicine?.name ||
                                                "Unknown Product"}
                                        </p>

                                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                            {movement.type} · Qty{" "}
                                            {movement.quantity} ·{" "}
                                            {movement.stock_before} →{" "}
                                            {movement.stock_after}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-black text-slate-600 dark:text-slate-400">
                                        {formatDate(movement.created_at)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="py-6 text-sm font-bold text-slate-500 dark:text-slate-400">
                                No inventory movements yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}