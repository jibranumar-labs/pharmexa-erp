import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { RotateCcw } from 'lucide-react';
import Form from './Form';

export default function Create({ sales = [] }) {
    return (
        <AppLayout title="Sales Return">

            <Head title="New Sales Return | Pharmexa" />

            <div className="space-y-7">

                {/* Header */}
                <section className="rounded-[2rem] bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 p-8 text-white shadow-2xl">

                    <div className="flex items-center gap-4">

                        <div className="rounded-2xl bg-white/20 p-4 transition-colors">
                            <RotateCcw size={34} />
                        </div>

                        <div>

                            <h1 className="text-4xl font-black">
                                New Sales Return
                            </h1>

                            <p className="mt-2 text-white/90">
                                Process a customer sales return and automatically restore stock.
                            </p>

                        </div>

                    </div>

                </section>

                {/* Return Form */}
                <section className="rounded-[2rem] bg-white p-8 shadow-sm transition-colors dark:bg-slate-900">

                    <Form
                        sales={sales}
                        submitLabel="Process Return"
                    />

                </section>

            </div>

        </AppLayout>
    );
}