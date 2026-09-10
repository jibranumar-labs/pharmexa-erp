import Icon from '@/Components/UI/Icon';

export default function StatCard({ label, value, change, trend = 'up' }) {
    const trendColor =
        trend === 'down'
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-emerald-600 dark:text-emerald-400';

    return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 transition-colors">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {value}
            </p>
            {change && (
                <p className={`mt-2 flex items-center gap-1 text-sm font-medium ${trendColor}`}>
                    {trend === 'up' ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                    ) : (
                        <Icon name="bell" className="h-4 w-4" />
                    )}
                    {change}
                </p>
            )}
        </div>
    );
}
