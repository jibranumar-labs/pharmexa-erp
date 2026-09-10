import { ROLES } from '@/utils/roles';

/*
|--------------------------------------------------------------------------
| PLATFORM NAVIGATION
|--------------------------------------------------------------------------
*/

export const platformNavigation = [
    {
        name: 'Platform',
        icon: 'pharmacy',
        roles: [ROLES.SUPER_OWNER],

        items: [
            {
                name: 'Pharmacies',
                route: 'platform.pharmacies.index',
                icon: 'pharmacy',
                roles: [ROLES.SUPER_OWNER],
            },
            {
                name: 'Global Catalogue',
                route: 'platform.medicines.index',
                icon: 'inventory',
                roles: [ROLES.SUPER_OWNER],
            },
            {
                name: 'Global Medicine Contributions',
                route: 'platform.global-medicine-contributions.index',
                icon: 'activity',
                roles: [ROLES.SUPER_OWNER],
            },
        ],
    },
];

/*
|--------------------------------------------------------------------------
| PHARMACY ERP NAVIGATION
|--------------------------------------------------------------------------
*/

export const navigation = [
    {
        name: 'Dashboard',
        route: 'dashboard',
        icon: 'dashboard',
        roles: [
           
            ROLES.OWNER,
            ROLES.ADMIN,
            ROLES.PHARMACIST,
            ROLES.CASHIER,
        ],
        
    },
      {
        name: 'Dashboard',
        route: 'platform.dashboard',
        icon: 'dashboard',
        roles: [
            ROLES.SUPER_OWNER,
        ],
    },

    {
        name: 'Inventory',
        icon: 'inventory',
        items: [
            {
                name: 'Inventory',
                route: 'inventory.index',
                icon: 'inventory',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                    ROLES.PHARMACIST,
                ],
            },
            {
                name: 'Stock History',
                route: 'stock.history',
                icon: 'history',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                    ROLES.PHARMACIST,
                ],
            },
            {
                name: 'Expiry Management',
                route: 'medicines.expiry',
                icon: 'prescription',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                    ROLES.PHARMACIST,
                ],
            },
        ],
    },

    {
        name: 'Sales',
        icon: 'pos',
        items: [
            {
                name: 'Point of Sale',
                route: 'pos.index',
                icon: 'pos',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                    ROLES.PHARMACIST,
                    ROLES.CASHIER,
                ],
            },
            {
                name: 'Sales History',
                route: 'sales.index',
                icon: 'sales',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                    ROLES.PHARMACIST,
                    ROLES.CASHIER,
                ],
            },
            {
                name: 'Customers',
                route: 'customers.index',
                icon: 'customers',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                    ROLES.PHARMACIST,
                    ROLES.CASHIER,
                ],
            },
            {
                name: 'Sales Return',
                route: 'sale-returns.index',
                icon: 'return',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                    ROLES.PHARMACIST,
                ],
            },
        ],
    },

    {
        name: 'Purchasing',
        icon: 'purchase',
        items: [
            {
                name: 'Suppliers',
                route: 'suppliers.index',
                icon: 'supplier',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                    ROLES.PHARMACIST,
                ],
            },
            {
                name: 'Purchases',
                route: 'purchases.index',
                icon: 'purchase',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                    ROLES.PHARMACIST,
                ],
            },
            {
                name: 'Purchase Return',
                route: 'purchase-returns.index',
                icon: 'return',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                    ROLES.PHARMACIST,
                ],
            },
        ],
    },

    {
        name: 'Daily Operations',
        icon: 'calendar',
        items: [
            {
                name: 'Daily Register',
                route: 'daily-cash-records.index',
                icon: 'cash-register',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                    ROLES.PHARMACIST,
                ],
            },
            {
                name: 'Expenses',
                route: 'expenses.index',
                icon: 'expense',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                    ROLES.PHARMACIST,
                ],
            },
        ],
    },

    {
        name: 'Finance',
        icon: 'finance',
        items: [
            {
                name: 'Profit & Loss',
                route: 'profit-loss.index',
                icon: 'profit',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                ],
            },
        {
            name: 'Reports',
            route: 'reports.index',
            icon: 'reports',
            roles: [
                ROLES.OWNER,
                ROLES.ADMIN,
            ],
        },
        ],
    },

 

    {
        name: 'Saudi Compliance',
        icon: 'shield',
        items: [
            {
                name: 'Saudi RSD',
                route: 'admin.traceability.dashboard',
                icon: 'shield',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                ],
            },
            {
                name: 'Settings',
                route: 'admin.traceability.settings',
                icon: 'settings',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                ],
            },
            {
                name: 'Transactions',
                route: 'admin.traceability.transactions',
                icon: 'transactions',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                ],
            },
            {
                name: 'Failed',
                route: 'admin.traceability.failed',
                icon: 'alert',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                ],
            },
            {
                name: 'Logs',
                route: 'admin.traceability.logs',
                icon: 'activity',
                roles: [
                    ROLES.OWNER,
                    ROLES.ADMIN,
                ],
            },
        ],
    },
];

/*
|--------------------------------------------------------------------------
| SYSTEM NAVIGATION
|--------------------------------------------------------------------------
*/

export const secondaryNavigation = [
    {
        name: 'Activity Logs',
        route: 'activity-logs.index',
        icon: 'activity',
        roles: [
            ROLES.OWNER,
            ROLES.ADMIN,
        ],
    },
    {
        name: 'Team & Access',
        route: 'team.index',
        icon: 'team',
        roles: [
            ROLES.OWNER,
        ],
    },
    {
        name: 'Settings',
        route: 'settings.index',
        icon: 'settings',
        roles: [
            ROLES.OWNER,
            ROLES.ADMIN,
        ],
    },
    {
        name: 'Profile',
        route: 'profile.edit',
        icon: 'profile',
        roles: [
            ROLES.SUPER_OWNER,
            ROLES.OWNER,
            ROLES.ADMIN,
            ROLES.PHARMACIST,
            ROLES.CASHIER,
        ],
    },
];

