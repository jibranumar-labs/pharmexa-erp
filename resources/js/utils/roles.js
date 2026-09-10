export const ROLES = {
    SUPER_OWNER: 'super_owner',
    OWNER: 'owner',
    ADMIN: 'admin',
    PHARMACIST: 'pharmacist',
    CASHIER: 'cashier',
};

export const ROLE_LABELS = {
    [ROLES.SUPER_OWNER]: 'Super Owner',
    [ROLES.OWNER]: 'Owner',
    [ROLES.ADMIN]: 'Admin',
    [ROLES.PHARMACIST]: 'Pharmacist',
    [ROLES.CASHIER]: 'Cashier',
};

export const ROLE_COLORS = {
    [ROLES.SUPER_OWNER]:
        'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',

    [ROLES.OWNER]:
        'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',

    [ROLES.ADMIN]:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',

    [ROLES.PHARMACIST]:
        'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',

    [ROLES.CASHIER]:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

export function hasRole(user, roles) {
    if (!user?.role) {
        return false;
    }

    const allowed = Array.isArray(roles) ? roles : [roles];

    return allowed.includes(user.role);
}

export function canAccessSettings(user) {
    return hasRole(user, [
        ROLES.SUPER_OWNER,
        ROLES.OWNER,
        ROLES.ADMIN,
    ]);
}