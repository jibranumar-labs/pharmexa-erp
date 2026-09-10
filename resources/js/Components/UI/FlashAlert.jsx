import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export default function FlashAlert() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
        } else if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
        }
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        if (!visible) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            setVisible(false);
        }, 6000);

        return () => window.clearTimeout(timer);
    }, [visible, message]);

    if (!visible || !message) {
        return null;
    }

    const isSuccess = type === 'success';

    return (
        <div
            className={`mb-6 flex items-start justify-between gap-4 rounded-2xl border px-5 py-4 shadow-lg ${
                isSuccess
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100'
                    : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-100'
            }`}
        >
            <div className="flex items-start gap-3">
                {isSuccess ? (
                    <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
                ) : (
                    <XCircle className="mt-0.5 shrink-0" size={20} />
                )}

                <p className="text-sm font-bold">{message}</p>
            </div>

            <button
                type="button"
                onClick={() => setVisible(false)}
                className="rounded-lg p-1 transition hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Dismiss notification"
            >
                <X size={16} />
            </button>
        </div>
    );
}
