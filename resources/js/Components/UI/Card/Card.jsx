export function CardHeader({ title, description }) {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {title}
            </h2>

            {description && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {description}
                </p>
            )}
        </div>
    );
}

export default function Card({
    children,
    className = "",
}) {
    return (
        <div
            className={`rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${className}`}
        >
            {children}
        </div>
    );
}