export default function FormInput({
    label,
    error,
    className = '',
    ...props
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-400">
                {label}
            </label>

            <input
                {...props}
                className={`w-full rounded-2xl border border-slate-300 dark:border-slate-700 px-4 py-3 font-medium outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${className} bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500`}
            />

            {error && (
                <p className="mt-2 text-sm font-bold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}