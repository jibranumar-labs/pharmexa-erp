import { useEffect, useState } from 'react';

import Sidebar from '@/Components/Layout/Sidebar';
import TopNavbar from '@/Components/Layout/TopNavbar';

export default function AppLayout({
    title = 'Dashboard',
    children,
}) {
    /*
    |--------------------------------------------------------------------------
    | Mobile Sidebar
    |--------------------------------------------------------------------------
    */

    const [sidebarOpen, setSidebarOpen] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Desktop Sidebar
    |--------------------------------------------------------------------------
    |
    | false = expanded  (280px)
    | true  = collapsed  (76px)
    |
    */

    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        try {
            return (
                localStorage.getItem(
                    'pharmexa-sidebar-collapsed'
                ) === 'true'
            );
        } catch {
            return false;
        }
    });

    /*
    |--------------------------------------------------------------------------
    | Save Sidebar Preference
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        try {
            localStorage.setItem(
                'pharmexa-sidebar-collapsed',
                sidebarCollapsed ? 'true' : 'false'
            );
        } catch {
            // Ignore localStorage errors.
        }
    }, [sidebarCollapsed]);

    /*
    |--------------------------------------------------------------------------
    | Desktop Sidebar Toggle
    |--------------------------------------------------------------------------
    */

    const handleSidebarToggle = () => {
        setSidebarCollapsed((current) => !current);
    };

    /*
    |--------------------------------------------------------------------------
    | Close Mobile Sidebar
    |--------------------------------------------------------------------------
    */

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    /*
    |--------------------------------------------------------------------------
    | Open Mobile Sidebar
    |--------------------------------------------------------------------------
    */

    const handleMobileMenu = () => {
        setSidebarOpen(true);
    };

    return (
        <div
            className="
                min-h-screen
                bg-gradient-to-br
                from-slate-50
                via-white
                to-cyan-50
                text-slate-950
                transition-colors
                duration-300
                dark:from-slate-950
                dark:via-slate-950
                dark:to-slate-900
                dark:text-white
            "
        >

            {/* ==============================================================
                SIDEBAR
            ============================================================== */}

            <Sidebar
                open={sidebarOpen}
                onClose={handleSidebarClose}
                collapsed={sidebarCollapsed}
                onToggleCollapse={handleSidebarToggle}
            />

            {/* ==============================================================
                MAIN APPLICATION
            ============================================================== */}

            <div
                className={`
                    min-h-screen
                    transition-[padding-left]
                    duration-300
                    ease-in-out

                    ${
                        sidebarCollapsed
                            ? 'lg:pl-[76px]'
                            : 'lg:pl-[280px]'
                    }
                `}
            >

                {/* ==========================================================
                    TOP NAVBAR
                ========================================================== */}

                <TopNavbar
                    title={title}
                    onMenuClick={handleMobileMenu}
                />

                {/* ==========================================================
                    PAGE CONTENT
                ========================================================== */}

                <main
                    className="
                        px-4
                        py-5
                        sm:px-6
                        lg:px-8
                        lg:py-8
                    "
                >
                    <div className="mx-auto w-full max-w-[1700px]">

                        {children}

                        {/* ==================================================
                            FOOTER
                        ================================================== */}

                        <footer
                            className="
                                mt-10
                                border-t
                                border-slate-200
                                py-6
                                text-center
                                dark:border-slate-700
                            "
                        >
                            <p
                                className="
                                    text-sm
                                    font-bold
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Pharmexa ERP v1.0
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                © {new Date().getFullYear()} All Rights Reserved
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-black
                                    text-teal-600
                                    dark:text-teal-400
                                "
                            >
                                Powered by Jibran Umar
                            </p>

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    text-slate-400
                                    dark:text-slate-400
                                "
                            >
                                Software Engineer & ERP Developer
                            </p>
                        </footer>

                    </div>
                </main>
            </div>
        </div>
    );
}