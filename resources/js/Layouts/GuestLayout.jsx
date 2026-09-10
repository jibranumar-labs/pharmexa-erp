import Logo from '@/Components/Brand/Logo';
import ThemeToggle from '@/Components/Layout/ThemeToggle';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-800">
            <header className="flex items-center justify-between px-4 py-4 sm:px-6">
                <Link href="/">
                    <Logo />
                </Link>
                <ThemeToggle />
            </header>

            <div className="flex flex-1 flex-col items-center justify-center px-4 pb-12">
                <div className="w-full max-w-md">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm dark:bg-slate-900 transition-colors">
                        <div className="border-b border-slate-100 dark:border-slate-700 px-6 py-5">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Pharmexa
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Sign in to your pharmacy workspace
                            </p>
                        </div>
                        <div className="px-6 py-6">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
