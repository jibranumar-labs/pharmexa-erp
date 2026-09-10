import { ROLE_COLORS, ROLE_LABELS } from '@/utils/roles';

export default function Badge({ children, variant, className = '' }) {
    const variants = {
        default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        brand: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant] ?? variants.default} ${className}`}
        >
            {children}
        </span>
    );
}

export function RoleBadge({ role }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                ROLE_COLORS[role] ??
                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
            }`}
        >
            {ROLE_LABELS[role] ?? role}
        </span>
    );
}
