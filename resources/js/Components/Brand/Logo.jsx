import Icon from '@/Components/UI/Icon';

export default function Logo({ className = 'h-8 w-8', showText = true }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className={`flex shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white ${className}`}>
                <Icon name="pill" className="h-5 w-5" />
            </div>
            {showText && (
                <div>
                    <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                        Pharmexa
                    </span>
                    <span className="block text-[10px] font-medium uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        Pharmacy ERP
                    </span>
                </div>
            )}
        </div>
    );
}
