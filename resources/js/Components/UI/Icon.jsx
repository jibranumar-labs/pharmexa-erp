import React from 'react';

const icons = {
    dashboard: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
    ),

    pharmacy: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 21h16.5"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 21V6.75A2.25 2.25 0 017.5 4.5h9a2.25 2.25 0 012.25 2.25V21"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 8.25h6M12 5.25v6M9 14.25h6M10.5 21v-3.75h3V21"
            />
        </>
    ),

    inventory: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
    ),

    pos: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
        />
    ),

    prescription: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        />
    ),

    customers: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
    ),

    team: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07A6.375 6.375 0 002.25 19.125l-.001.109A12.318 12.318 0 008.624 21c2.331 0 4.512-.645 6.374-1.766l.002-.106z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
        </>
    ),

    reports: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
    ),

    settings: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
    ),

    profile: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
    ),

    sun: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
    ),

    moon: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
        />
    ),

    menu: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
    ),

    close: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
        />
    ),

    bell: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
    ),

    search: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
    ),

    chevron: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
    ),

    pill: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        />
    ),

    expense: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2.25c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-4.03-9-9-9zm0 3v13.5M9 8.25h4.125a1.875 1.875 0 010 3.75H10.875a1.875 1.875 0 000 3.75H15"
        />
    ),

    supplier: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 21h16.5M5.25 21V7.5L12 3l6.75 4.5V21M9 10.5h6M9 14.25h6M9 18h6"
        />
    ),

    history: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l2.5 2.5M21 12a9 9 0 11-3.364-7.03M3 4.5v4.5h4.5"
        />
    ),

    sales: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3v18h18M7 16v-4M11 16V8M15 16v-7M19 16V5"
        />
    ),

    return: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15L4 10l5-5M4 10h10a6 6 0 016 6v2"
        />
    ),

    purchase: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M6 6.75V19.5h12V6.75M8.25 6.75V4.5h7.5v2.25M9 11.25h6M9 15h6"
        />
    ),

    profit: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 17.25l5.25-5.25 3.75 3.75L21 6.75M16.5 6.75H21v4.5"
        />
    ),

    finance: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10.5h18M5.25 10.5v8.25M9.75 10.5v8.25M14.25 10.5v8.25M18.75 10.5v8.25M3 21h18M4.5 7.5L12 3l7.5 4.5"
            />
        </>
    ),

    shield: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3l7.5 3v5.25c0 4.65-3.15 8.85-7.5 9.75-4.35-.9-7.5-5.1-7.5-9.75V6L12 3zM9 12l2 2 4-4"
        />
    ),

    activity: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12h4l2.25-6 4.5 12L16 12h5"
        />
    ),

    analytics: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5V15M9.5 19.5V9M14.5 19.5v-6M19.5 19.5V4.5"
        />
    ),

    transactions: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 7.5h13.5M16.5 4.5l3 3-3 3"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 16.5H3M7.5 13.5l-3 3 3 3"
            />
        </>
    ),

    alert: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75M12 16.5h.008M10.29 3.86L2.82 17a1.875 1.875 0 001.63 2.813h15.1A1.875 1.875 0 0021.18 17L13.71 3.86a1.875 1.875 0 00-3.42 0z"
        />
    ),

    calendar: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v3M17.25 3v3M3.75 9h16.5M5.25 5.25h13.5A1.5 1.5 0 0120.25 6.75v12a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-12a1.5 1.5 0 011.5-1.5z"
        />
    ),

    'cash-register': (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 8.25h15A1.5 1.5 0 0121 9.75v9A1.5 1.5 0 0119.5 20.25h-15A1.5 1.5 0 013 18.75v-9a1.5 1.5 0 011.5-1.5z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25V5.25h9v3M7.5 13.5h9M9 16.5h.008M12 16.5h.008M15 16.5h.008"
            />
        </>
    ),
};

export default function Icon({
    name,
    className = 'h-5 w-5',
}) {
    const path = icons[name];

    if (!path) {
        return null;
    }

    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.7}
            stroke="currentColor"
            aria-hidden="true"
        >
            {path}
        </svg>
    );
}