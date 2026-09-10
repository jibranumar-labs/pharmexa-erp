import Logo from '@/Components/Brand/Logo';
import SidebarLink from '@/Components/Layout/SidebarLink';
import Icon from '@/Components/UI/Icon';

import {
    platformNavigation,
    navigation,
    secondaryNavigation,
} from '@/config/navigation';

import { usePage } from '@inertiajs/react';

import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    X,
} from 'lucide-react';

import {
    useEffect,
    useMemo,
    useState,
} from 'react';

/*
|--------------------------------------------------------------------------
| Permission
|--------------------------------------------------------------------------
*/

function canSee(item, role) {
    return (
        item &&
        Array.isArray(item.roles) &&
        item.roles.includes(role)
    );
}

/*
|--------------------------------------------------------------------------
| Clean Navigation Title
|--------------------------------------------------------------------------
*/

function cleanTitle(title) {
    if (!title) {
        return '';
    }

    return String(title)
        .replace(/^[^A-Za-z0-9]+/, '')
        .trim();
}

/*
|--------------------------------------------------------------------------
| Icon Colors
|--------------------------------------------------------------------------
*/

const iconColorClasses = {
    dashboard:
        '[&_svg]:text-cyan-600 dark:[&_svg]:text-cyan-400',

    inventory:
        '[&_svg]:text-blue-600 dark:[&_svg]:text-blue-400',

    history:
        '[&_svg]:text-slate-500 dark:[&_svg]:text-slate-400',

    prescription:
        '[&_svg]:text-violet-600 dark:[&_svg]:text-violet-400',

    pos:
        '[&_svg]:text-emerald-600 dark:[&_svg]:text-emerald-400',

    sales:
        '[&_svg]:text-green-600 dark:[&_svg]:text-green-400',

    customers:
        '[&_svg]:text-sky-600 dark:[&_svg]:text-sky-400',

    return:
        '[&_svg]:text-orange-600 dark:[&_svg]:text-orange-400',

    supplier:
        '[&_svg]:text-amber-600 dark:[&_svg]:text-amber-400',

    purchase:
        '[&_svg]:text-teal-600 dark:[&_svg]:text-teal-400',

    calendar:
        '[&_svg]:text-blue-600 dark:[&_svg]:text-blue-400',

    'cash-register':
        '[&_svg]:text-emerald-600 dark:[&_svg]:text-emerald-400',

    expense:
        '[&_svg]:text-red-500 dark:[&_svg]:text-red-400',

    profit:
        '[&_svg]:text-green-600 dark:[&_svg]:text-green-400',

    finance:
        '[&_svg]:text-lime-600 dark:[&_svg]:text-lime-400',

    reports:
        '[&_svg]:text-indigo-600 dark:[&_svg]:text-indigo-400',

    analytics:
        '[&_svg]:text-indigo-600 dark:[&_svg]:text-indigo-400',

    shield:
        '[&_svg]:text-purple-600 dark:[&_svg]:text-purple-400',

    transactions:
        '[&_svg]:text-cyan-600 dark:[&_svg]:text-cyan-400',

    alert:
        '[&_svg]:text-red-500 dark:[&_svg]:text-red-400',

    activity:
        '[&_svg]:text-pink-600 dark:[&_svg]:text-pink-400',

    team:
        '[&_svg]:text-blue-600 dark:[&_svg]:text-blue-400',

    profile:
        '[&_svg]:text-slate-600 dark:[&_svg]:text-slate-300',

    pharmacy:
        '[&_svg]:text-teal-600 dark:[&_svg]:text-teal-400',

    settings:
        '[&_svg]:text-slate-600 dark:[&_svg]:text-slate-300',
};

function getIconColor(icon) {
    return (
        iconColorClasses[icon] ||
        '[&_svg]:text-slate-600 dark:[&_svg]:text-slate-300'
    );
}

/*
|--------------------------------------------------------------------------
| Sidebar
|--------------------------------------------------------------------------
*/

export default function Sidebar({
    open,
    onClose,
    collapsed = false,
    onToggleCollapse,
}) {
    const { auth } = usePage().props;

    const user = auth?.user;
    const role = user?.role;

    /*
    |--------------------------------------------------------------------------
    | Currently Open Group
    |--------------------------------------------------------------------------
    */

    const [openGroup, setOpenGroup] = useState(() => {
        try {
            return (
                sessionStorage.getItem(
                    'pharmexa-sidebar-group'
                ) || null
            );
        } catch {
            return null;
        }
    });

    /*
    |--------------------------------------------------------------------------
    | Save Group
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        try {
            if (openGroup) {
                sessionStorage.setItem(
                    'pharmexa-sidebar-group',
                    openGroup
                );
            } else {
                sessionStorage.removeItem(
                    'pharmexa-sidebar-group'
                );
            }
        } catch {
            // Ignore storage errors.
        }
    }, [openGroup]);

    /*
    |--------------------------------------------------------------------------
    | Safe Navigation
    |--------------------------------------------------------------------------
    */

    const safeNavigation = useMemo(
        () => (
            Array.isArray(navigation)
                ? navigation
                : []
        ),
        []
    );

    const safePlatformNavigation = useMemo(
        () => (
            Array.isArray(platformNavigation)
                ? platformNavigation
                : []
        ),
        []
    );

    const safeSecondaryNavigation = useMemo(
        () => (
            Array.isArray(secondaryNavigation)
                ? secondaryNavigation
                : []
        ),
        []
    );

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    | IMPORTANT:
    | Dashboard is a top-level navigation item.
    |--------------------------------------------------------------------------
    */

   const dashboardItem = useMemo(() => {
    // Super Owner uses the Platform Dashboard
    if (role === 'super_owner') {
        const platformDashboard = safePlatformNavigation
            .flatMap((section) =>
                Array.isArray(section?.items)
                    ? section.items
                    : []
            )
            .find(
                (item) =>
                    item?.route === 'platform.dashboard' &&
                    canSee(item, role)
            );

        if (platformDashboard) {
            return {
                ...platformDashboard,
                name: 'Dashboard',
            };
        }
    }

    // Pharmacy users use the normal Pharmacy Dashboard
    return (
        safeNavigation.find(
            (item) =>
                item?.route === 'dashboard' &&
                canSee(item, role)
        ) || null
    );
}, [
    safeNavigation,
    safePlatformNavigation,
    role,
]);
    /*
    |--------------------------------------------------------------------------
    | Pharmacy Groups
    |--------------------------------------------------------------------------
    */

    const pharmacyGroups = useMemo(() => {
        return safeNavigation
            .filter(
                (section) =>
                    section &&
                    !section.route &&
                    Array.isArray(section.items)
            )
            .map((section) => {
                const visibleItems =
                    section.items.filter(
                        (item) =>
                            canSee(item, role)
                    );

                if (!visibleItems.length) {
                    return null;
                }

                return {
                    title:
                        cleanTitle(
                            section.title ||
                            section.name ||
                            section.label
                        ),
                    icon:
                        section.icon ||
                        visibleItems[0]?.icon ||
                        'pharmacy',
                    items: visibleItems,
                };
            })
            .filter(Boolean);
    }, [safeNavigation, role]);

    /*
    |--------------------------------------------------------------------------
    | Platform Groups
    |--------------------------------------------------------------------------
    */

    const platformGroups = useMemo(() => {
        if (role !== 'super_owner') {
            return [];
        }

        return safePlatformNavigation
            .map((section) => {
                if (
                    !section ||
                    !Array.isArray(section.items)
                ) {
                    return null;
                }

                const visibleItems =
                    section.items.filter(
                        (item) =>
                            canSee(item, role)
                    );

                if (!visibleItems.length) {
                    return null;
                }

                return {
                    title:
                        cleanTitle(
                            section.title ||
                            section.name
                        ),
                    icon:
                        section.icon ||
                        visibleItems[0]?.icon ||
                        'pharmacy',
                    items: visibleItems,
                };
            })
            .filter(Boolean);
    }, [
        safePlatformNavigation,
        role,
    ]);

    /*
    |--------------------------------------------------------------------------
    | System Navigation
    |--------------------------------------------------------------------------
    */

    const systemItems = useMemo(
        () => (
            safeSecondaryNavigation.filter(
                (item) =>
                    canSee(item, role)
            )
        ),
        [
            safeSecondaryNavigation,
            role,
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Group Toggle
    |--------------------------------------------------------------------------
    */

    const toggleGroup = (groupName) => {
        setOpenGroup((current) =>
            current === groupName
                ? null
                : groupName
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Navigate
    |--------------------------------------------------------------------------
    */

    const handleNavigate = () => {
        if (typeof onClose === 'function') {
            onClose();
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Render Group
    |--------------------------------------------------------------------------
    */

    const renderGroup = (
        group,
        index,
        prefix = 'pharmacy'
    ) => {
        const groupKey =
            `${prefix}-${index}-${group.title}`;

        const isOpen =
            openGroup === groupKey;

        /*
        |--------------------------------------------------------------------------
        | Collapsed Sidebar
        |--------------------------------------------------------------------------
        */

        if (collapsed) {
            return (
                <div
                    key={groupKey}
                    className="mb-1.5"
                >
                    <button
                        type="button"
                        title={group.title}
                        onClick={() => {
                            if (
                                typeof onToggleCollapse ===
                                'function'
                            ) {
                                onToggleCollapse();
                            }
                        }}
                        className={`
                            mx-auto
                            flex h-11 w-11
                            items-center justify-center
                            rounded-xl
                            transition-all
                            duration-200
                            hover:bg-slate-100
                            dark:hover:bg-slate-800
                            ${getIconColor(group.icon)}
                        `}
                    >
                        <Icon
                            name={group.icon}
                            className="h-5 w-5"
                        />
                    </button>
                </div>
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Expanded Sidebar
        |--------------------------------------------------------------------------
        */

        return (
            <div
                key={groupKey}
                className="mb-1"
            >
                <button
                    type="button"
                    onClick={() =>
                        toggleGroup(groupKey)
                    }
                    aria-expanded={isOpen}
                    aria-controls={
                        `sidebar-group-${groupKey}`
                    }
                    className="
                        group
                        flex w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-left
                        transition-all
                        duration-200
                        hover:bg-slate-50
                        dark:hover:bg-slate-800/70
                    "
                >
                    <span
                        className={`
                            flex h-8 w-8
                            shrink-0
                            items-center justify-center
                            rounded-lg
                            bg-slate-50
                            dark:bg-slate-800
                            ${getIconColor(group.icon)}
                        `}
                    >
                        <Icon
                            name={group.icon}
                            className="h-[19px] w-[19px]"
                        />
                    </span>

                    <span
                        className="
                            min-w-0
                            flex-1
                            truncate
                            text-[15px]
                            font-bold
                            text-slate-800
                            dark:text-slate-100
                        "
                    >
                        {group.title}
                    </span>

                    <ChevronDown
                        size={17}
                        className={`
                            shrink-0
                            text-slate-400
                            transition-transform
                            duration-200
                            ${
                                isOpen
                                    ? 'rotate-180'
                                    : ''
                            }
                        `}
                    />
                </button>

                <div
                    id={
                        `sidebar-group-${groupKey}`
                    }
                    className={`
                        grid
                        transition-all
                        duration-200
                        ${
                            isOpen
                                ? 'grid-rows-[1fr] opacity-100'
                                : 'grid-rows-[0fr] opacity-0'
                        }
                    `}
                >
                    <div
                        className="
                            min-h-0
                            min-w-0
                            overflow-hidden
                        "
                    >
                        <div
                            className="
                                ml-5
                                mt-0.5
                                space-y-0.5
                                border-l
                                border-slate-200
                                pl-3
                                dark:border-slate-800
                            "
                        >
                            {group.items.map(
                                (item) => (
                                    <div
                                        key={
                                            item.route ||
                                            item.name
                                        }
                                        className={getIconColor(
                                            item.icon
                                        )}
                                    >
                                        <SidebarLink
                                            item={item}
                                            active={
                                                item.route
                                                    ? route().current(
                                                        item.route
                                                    )
                                                    : false
                                            }
                                            onNavigate={
                                                handleNavigate
                                            }
                                            collapsed={
                                                collapsed
                                            }
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Sidebar Content
    |--------------------------------------------------------------------------
    */

    const sidebarContent = (
        <div
            className="
                flex h-full
                min-h-0
                flex-col
                bg-white
                dark:bg-slate-900
            "
        >
            {/* HEADER */}

            <div
                className="
                    flex
                    h-[76px]
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-slate-100
                    px-3
                    dark:border-slate-800
                "
            >
                {!collapsed && (
                    <div className="min-w-0 flex-1">
                        <Logo />
                    </div>
                )}

                {collapsed && (
                    <div
                        className="
                            mx-auto
                            flex h-10 w-10
                            items-center justify-center
                            rounded-xl
                            bg-teal-600
                            text-white
                            shadow-sm
                        "
                    >
                        <Icon
                            name="pharmacy"
                            className="h-6 w-6"
                        />
                    </div>
                )}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-1.5
                    "
                >
                    {/* Desktop Toggle */}

                    {typeof onToggleCollapse ===
                        'function' && (
                        <button
                            type="button"
                            onClick={
                                onToggleCollapse
                            }
                            className="
                                hidden
                                h-9 w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                text-slate-500
                                shadow-sm
                                transition
                                hover:bg-slate-50
                                hover:text-slate-900
                                dark:border-slate-700
                                dark:bg-slate-900
                                dark:text-slate-400
                                dark:hover:bg-slate-800
                                dark:hover:text-white
                                lg:flex
                            "
                            aria-label={
                                collapsed
                                    ? 'Expand sidebar'
                                    : 'Collapse sidebar'
                            }
                        >
                            {collapsed ? (
                                <ChevronRight
                                    size={18}
                                />
                            ) : (
                                <ChevronLeft
                                    size={18}
                                />
                            )}
                        </button>
                    )}

                    {/* Mobile Close */}

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
                            text-slate-500
                            transition
                            hover:bg-slate-100
                            dark:text-slate-400
                            dark:hover:bg-slate-800
                            lg:hidden
                        "
                        aria-label="Close sidebar"
                    >
                        <X size={19} />
                    </button>
                </div>
            </div>

            {/* NAVIGATION */}

            <nav
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    overflow-x-hidden
                    px-2.5
                    py-3
                    scrollbar-thin
                "
            >
                {/* DASHBOARD */}

                {dashboardItem && (
                    <div className="mb-3">
                        <div
                            className={getIconColor(
                                'dashboard'
                            )}
                        >
                            <SidebarLink
                                item={dashboardItem}
                                active={
                                    dashboardItem.route
                                        ? route().current(
                                            dashboardItem.route
                                        )
                                        : false
                                }
                                onNavigate={
                                    handleNavigate
                                }
                                collapsed={
                                    collapsed
                                }
                            />
                        </div>
                    </div>
                )}

                {/* PLATFORM */}

                {platformGroups.length > 0 && (
                    <section className="mb-3">
                        {!collapsed && (
                            <div
                                className="
                                    mb-1.5
                                    px-3
                                "
                            >
                                <span
                                    className="
                                        text-[10px]
                                        font-black
                                        uppercase
                                        tracking-[0.2em]
                                        text-slate-400
                                        dark:text-slate-500
                                    "
                                >
                                    Platform
                                </span>
                            </div>
                        )}

                        {platformGroups.map(
                            (group, index) =>
                                renderGroup(
                                    group,
                                    index,
                                    'platform'
                                )
                        )}
                    </section>
                )}

                {/* PHARMACY */}

                {pharmacyGroups.length > 0 && (
                    <section className="mb-3">
                        {!collapsed && (
                            <div
                                className="
                                    mb-1.5
                                    mt-1
                                    px-3
                                "
                            >
                                <span
                                    className="
                                        text-[10px]
                                        font-black
                                        uppercase
                                        tracking-[0.2em]
                                        text-slate-400
                                        dark:text-slate-500
                                    "
                                >
                                    Pharmacy
                                </span>
                            </div>
                        )}

                        {pharmacyGroups.map(
                            (group, index) =>
                                renderGroup(
                                    group,
                                    index,
                                    'pharmacy'
                                )
                        )}
                    </section>
                )}

                {/* SYSTEM */}

                {systemItems.length > 0 && (
                    <section
                        className="
                            mt-3
                            border-t
                            border-slate-100
                            pt-3
                            dark:border-slate-800
                        "
                    >
                        {!collapsed && (
                            <div
                                className="
                                    mb-1.5
                                    px-3
                                "
                            >
                                <span
                                    className="
                                        text-[10px]
                                        font-black
                                        uppercase
                                        tracking-[0.2em]
                                        text-slate-400
                                        dark:text-slate-500
                                    "
                                >
                                    System
                                </span>
                            </div>
                        )}

                        <div className="space-y-0.5">
                            {systemItems.map(
                                (item) => (
                                    <div
                                        key={
                                            item.route ||
                                            item.name
                                        }
                                        className={getIconColor(
                                            item.icon
                                        )}
                                    >
                                        <SidebarLink
                                            item={item}
                                            active={
                                                item.route
                                                    ? route().current(
                                                        item.route
                                                    )
                                                    : false
                                            }
                                            onNavigate={
                                                handleNavigate
                                            }
                                            collapsed={
                                                collapsed
                                            }
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </section>
                )}
            </nav>

            {/* BOTTOM ACCENT */}

            <div
                className="
                    h-1
                    shrink-0
                    bg-gradient-to-r
                    from-teal-500
                    via-cyan-500
                    to-emerald-500
                "
            />
        </div>
    );

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <>
            {/* DESKTOP */}

            <aside
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-40
                    hidden
                    border-r
                    border-slate-100
                    bg-white
                    shadow-sm
                    transition-[width]
                    duration-300
                    dark:border-slate-800
                    dark:bg-slate-900
                    lg:flex
                    lg:flex-col
                    ${
                        collapsed
                            ? 'w-[76px]'
                            : 'w-[280px]'
                    }
                `}
            >
                {sidebarContent}
            </aside>

            {/* MOBILE */}

            {open && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        lg:hidden
                    "
                >
                    <div
                        className="
                            fixed
                            inset-0
                            bg-slate-950/60
                            backdrop-blur-sm
                        "
                        onClick={onClose}
                    />

                    <aside
                        className="
                            fixed
                            inset-y-0
                            left-0
                            z-50
                            flex
                            w-[min(22rem,92vw)]
                            max-w-full
                            flex-col
                            shadow-2xl
                        "
                    >
                        {sidebarContent}
                    </aside>
                </div>
            )}
        </>
    );
}