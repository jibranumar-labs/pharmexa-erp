import AppLayout from "@/Layouts/AppLayout";
import ThemeToggle from "@/Components/Layout/ThemeToggle";
import Card, { CardHeader } from "@/Components/UI/Card/Card";
import PageHeader from "@/Components/UI/PageHeader";
import { Head, usePage } from "@inertiajs/react";

import {
    Bell,
    Database,
    Lock,
    Store,
    Palette,
} from "lucide-react";

import PharmacyCard from "./PharmacyCard";
import ReceiptCard from "./ReceiptCard";
import SaudiCard from "./SaudiCard";
import BrandingCard from "./BrandingCard";

export default function SettingsIndex({ setting }) {

    const { auth } = usePage().props;

    return (

        <AppLayout title="Settings">

            <Head title="Settings" />

            <PageHeader
                title="Pharmacy Settings"
                description="Configure Pharmexa ERP for your pharmacy."
            />

            <div className="grid gap-6">

                {/* Theme */}

                <Card>

                    <div className="flex items-center gap-3 mb-5">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">

                            <Palette
                                className="text-indigo-600"
                                size={28}
                            />

                        </div>

                        <CardHeader
                            title="Appearance"
                            description="Customize the application theme."
                        />

                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-700 p-5">

                        <div>

                            <h4 className="font-black">

                                Theme

                            </h4>

                            <p className="text-sm text-slate-500 dark:text-slate-400">

                                Switch between Light and Dark mode.

                            </p>

                        </div>

                        <ThemeToggle />

                    </div>

                </Card>

                {/* Pharmacy */}

                <PharmacyCard setting={setting} />

                {/* Saudi */}

                <SaudiCard setting={setting} />

                {/* Receipt */}

                <ReceiptCard setting={setting} />

                {/* Branding */}

                <BrandingCard setting={setting} />

                {/* Backup */}

                <Card>

                    <div className="flex items-center gap-3 mb-5">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40">

                            <Database
                                className="text-emerald-600 dark:text-emerald-400"
                                size={28}
                            />

                        </div>

                        <CardHeader
                            title="Backup"
                            description="Protect your pharmacy database."
                        />

                    </div>

                    <a
                        href={route("backup.download")}
                        className="inline-flex rounded-2xl bg-emerald-600 px-6 py-3 font-black text-white"
                    >
                        Download Database Backup
                    </a>

                </Card>

                {/* Notifications */}

                <Card>

                    <div className="flex items-center gap-3 mb-5">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">

                            <Bell
                                className="text-orange-600"
                                size={28}
                            />

                        </div>

                        <CardHeader
                            title="Notifications"
                            description="Coming in next version."
                        />

                    </div>

                    <div className="space-y-3">

                        {[
                            "Low Stock Alerts",
                            "Expiry Alerts",
                            "Daily Sales Report",
                        ].map((item) => (

                            <label
                                key={item}
                                className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                            >

                                <span>

                                    {item}

                                </span>

                                <input
                                    type="checkbox"
                                    disabled
                                    defaultChecked
                                />

                            </label>

                        ))}

                    </div>

                </Card>

                {/* Security */}

                <Card>

                    <div className="flex items-center gap-3 mb-5">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/40">

                            <Lock
                                className="text-blue-600"
                                size={28}
                            />

                        </div>

                        <CardHeader
                            title="Security"
                            description="User management and permissions."
                        />

                    </div>

                    <p className="text-slate-600 dark:text-slate-400">

                        Logged in as

                        <strong>

                            {" "}
                            {auth.user.name}

                        </strong>

                    </p>

                </Card>

                {/* About */}

                <Card>

                    <div className="flex items-center gap-3 mb-5">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100">

                            <Store
                                className="text-cyan-600"
                                size={28}
                            />

                        </div>

                        <CardHeader
                            title="About Pharmexa ERP"
                            description="Commercial Pharmacy ERP."
                        />

                    </div>

                    <div className="space-y-2">

                        <p>

                            <strong>

                                Version

                            </strong>

                            : 1.0

                        </p>

                        <p>

                            <strong>

                                Developer

                            </strong>

                            : Jibran Umar

                        </p>

                        <p>

                            <strong>

                                Country

                            </strong>

                            : Saudi Arabia

                        </p>

                    </div>

                </Card>

            </div>

        </AppLayout>

    );

}