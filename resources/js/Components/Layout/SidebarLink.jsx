import Icon from '@/Components/UI/Icon';
import Badge from '@/Components/UI/Badge';
import { Link } from '@inertiajs/react';

/*
|--------------------------------------------------------------------------
| Colorful Icon Colors
|--------------------------------------------------------------------------
*/

const iconColorClasses = {
    dashboard:
        'text-cyan-600 dark:text-cyan-400',

    inventory:
        'text-blue-600 dark:text-blue-400',

    reports:
        'text-indigo-600 dark:text-indigo-400',

    prescription:
        'text-violet-600 dark:text-violet-400',

    pos:
        'text-emerald-600 dark:text-emerald-400',

    customers:
        'text-sky-600 dark:text-sky-400',

    return:
        'text-orange-600 dark:text-orange-400',

    supplier:
        'text-amber-600 dark:text-amber-400',

    purchase:
        'text-teal-600 dark:text-teal-400',

    expense:
        'text-red-500 dark:text-red-400',

    profit:
        'text-green-600 dark:text-green-400',

    shield:
        'text-purple-600 dark:text-purple-400',

    settings:
        'text-slate-600 dark:text-slate-300',

    activity:
        'text-pink-600 dark:text-pink-400',

    team:
        'text-blue-600 dark:text-blue-400',

    profile:
        'text-slate-600 dark:text-slate-300',

    pharmacy:
        'text-teal-600 dark:text-teal-400',

    stock:
        'text-indigo-600 dark:text-indigo-400',

    expiry:
        'text-violet-600 dark:text-violet-400',

    sales:
        'text-emerald-600 dark:text-emerald-400',

    failed:
        'text-orange-600 dark:text-orange-400',

    logs:
        'text-rose-600 dark:text-rose-400',

    transaction:
        'text-blue-600 dark:text-blue-400',

    backup:
        'text-slate-600 dark:text-slate-300',

    barcode:
        'text-cyan-600 dark:text-cyan-400',

    medicine:
        'text-violet-600 dark:text-violet-400',

    category:
        'text-amber-600 dark:text-amber-400',

    unit:
        'text-sky-600 dark:text-sky-400',

    manufacturer:
        'text-orange-600 dark:text-orange-400',

    default:
        'text-slate-600 dark:text-slate-300',
};

function getIconColor(icon) {
    return iconColorClasses[icon] || iconColorClasses.default;
}

export default function SidebarLink({
    item,
    active,
    onNavigate,
    collapsed = false,
}) {
    const baseClass = active
        ? 'sidebar-link sidebar-link-active'
        : 'sidebar-link sidebar-link-inactive';

    const iconColor = getIconColor(item?.icon);

    /*
    |--------------------------------------------------------------------------
    | Collapsed Mode
    |--------------------------------------------------------------------------
    */

    if (collapsed) {
        const collapsedContent = (
            <span className="relative flex h-11 w-full items-center justify-center">
                <Icon
                    name={item.icon}
                    className={`h-[21px] w-[21px] shrink-0 ${iconColor}`}
                />

                {item.badge && (
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-white dark:ring-slate-900" />
                )}
            </span>
        );

        if (!item.route) {
            return (
                <span
                    className={`${baseClass} !justify-center !gap-0 !px-0 cursor-not-allowed opacity-60`}
                    title={item.name}
                    aria-label={item.name}
                >
                    {collapsedContent}
                </span>
            );
        }

        return (
            <Link
                href={route(item.route)}
                className={`${baseClass} !justify-center !gap-0 !px-0`}
                onClick={onNavigate}
                title={item.name}
                aria-label={item.name}
            >
                {collapsedContent}
            </Link>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Expanded Mode
    |--------------------------------------------------------------------------
    */

    const content = (
        <>
            <Icon
                name={item.icon}
                className={`h-5 w-5 shrink-0 ${iconColor}`}
            />

            <span className="min-w-0 flex-1 truncate">
                {item.name}
            </span>

            {item.badge && (
                <Badge
                    variant="warning"
                    className="ml-auto shrink-0"
                >
                    {item.badge}
                </Badge>
            )}
        </>
    );

    /*
    |--------------------------------------------------------------------------
    | Coming Soon / Disabled Item
    |--------------------------------------------------------------------------
    */

    if (!item.route) {
        return (
            <span
                className={`${baseClass} cursor-not-allowed opacity-60`}
                title="Coming soon"
            >
                {content}
            </span>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Normal Navigation Link
    |--------------------------------------------------------------------------
    */

    return (
        <Link
            href={route(item.route)}
            className={baseClass}
            onClick={onNavigate}
        >
            {content}
        </Link>
    );
}
