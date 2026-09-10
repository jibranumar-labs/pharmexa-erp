import { useState, useEffect, useRef } from "react";
import axios from "axios";

import ThemeToggle from "@/Components/Layout/ThemeToggle";
import Icon from "@/Components/UI/Icon";
import { RoleBadge } from "@/Components/UI/Badge";
import Dropdown from "@/Components/Dropdown";
import MedicinePreviewCard from "@/Components/Search/MedicinePreviewCard";
import { Link, usePage } from "@inertiajs/react";

export default function TopNavbar({ onMenuClick, title }) {
    const { auth, notificationCount = 0 } = usePage().props;
    const user = auth.user;

    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);

    const searchRef = useRef(null);

    useEffect(() => {
        const closeDropdown = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setShowResults(false);
                setSelectedMedicine(null);
            }
        };

        document.addEventListener("mousedown", closeDropdown);

        return () => {
            document.removeEventListener("mousedown", closeDropdown);
        };
    }, []);

    useEffect(() => {
        if (search.trim() === "") {
            setResults([]);
            setShowResults(false);
            return;
        }

        const timer = setTimeout(() => {
            setLoading(true);

            axios
                .get(route("search"), {
                    params: {
                        q: search,
                    },
                })
                .then((response) => {
                    setResults(response.data);
                    setShowResults(true);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 px-4 backdrop-blur-md dark:bg-slate-900/80 sm:px-6 lg:px-8 transition-colors">
            <button
                type="button"
                onClick={onMenuClick}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 lg:hidden"
                aria-label="Open sidebar"
            >
                <Icon name="menu" className="h-6 w-6" />
            </button>

            {title && (
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white lg:hidden">
                    {title}
                </h1>
            )}

            <div className="flex-1">
                <div
                    ref={searchRef}
                    className="relative max-w-md"
                >
                    <Icon
                        name="search"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />

                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full rounded-lg border-slate-200 bg-slate-50 py-2 pl-10 pr-10 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-slate-500 focus:border-teal-500 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setResults([]);
                                setShowResults(false);
                                setSelectedMedicine(null);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-red-500"
                        >
                            ✕
                        </button>
                    )}

                    {showResults && (
                        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900 transition-colors">

                            {loading && (
                                <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                                    Searching...
                                </div>
                            )}

                            {!loading && results.length === 0 && (
                                <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                                    No products found.
                                </div>
                            )}

                            {!loading &&
                                results.map((medicine) => (
                                    <button
                                        key={medicine.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedMedicine(medicine);
                                        }}
                                        className="block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-teal-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                    >
                                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                                            {medicine.name}
                                        </div>

                                        <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                            <span>
                                                Barcode: {medicine.barcode || "-"}
                                            </span>

                                            <span>
                                                Stock: {medicine.stock_quantity}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                        </div>
                    )}

                    {selectedMedicine && (
                        <MedicinePreviewCard
                            medicine={selectedMedicine}
                            onClose={() => setSelectedMedicine(null)}
                        />
                    )}
                </div>
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
                {user.role !== 'super_owner' && (
    <Link
        href={route('notifications.index')}
        title="Notifications"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:hover:bg-slate-700"
    >
        <Icon name="bell" className="h-5 w-5" />

        {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
                {notificationCount > 99 ? '99+' : notificationCount}
            </span>
        )}
    </Link>
)}

                <ThemeToggle />

                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800 dark:border-slate-700 sm:px-3"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
                                {user.name.charAt(0).toUpperCase()}
                            </span>

                            <span className="hidden text-left sm:block">
                                <span className="block font-medium text-slate-900 dark:text-white">
                                    {user.name}
                                </span>
                                <span className="block text-xs text-slate-500 dark:text-slate-400">
                                    {user.role_label}
                                </span>
                            </span>

                            <Icon name="chevron" className="hidden h-4 w-4 text-slate-400 dark:text-slate-500 sm:block" />
                        </button>
                    </Dropdown.Trigger>

                    <Dropdown.Content align="right" width="48" contentClasses="py-1 bg-white dark:bg-slate-800">
                        <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700 sm:hidden">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {user.name}
                            </p>

                            <div className="mt-1">
                                <RoleBadge role={user.role} />
                            </div>
                        </div>

                        <Dropdown.Link href={route('profile.edit')}>
                            Profile
                        </Dropdown.Link>

                        {['owner', 'admin'].includes(user.role) && (
                            <Dropdown.Link href={route('settings.index')}>
                                Settings
                            </Dropdown.Link>
                        )}

                        <Dropdown.Link href={route('logout')} method="post" as="button">
                            Log Out
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </header>
    );
}