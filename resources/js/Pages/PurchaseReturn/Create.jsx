import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { RotateCcw } from 'lucide-react';
import Form from './Form';

export default function Create({ purchases }) {
    return (
        <AppLayout title="Purchase Return">

            <Head title="New Purchase Return | Pharmexa" />

            <div className="space-y-7">

                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 p-8 text-white shadow-2xl">

                    <div className="flex items-center gap-4">

                        <div className="rounded-2xl bg-white/20 p-4 transition-colors">
                            <RotateCcw size={34} />
                        </div>

                        <div>

                            <h1 className="text-4xl font-black">
                                New Purchase Return
                            </h1>

                            <p className="mt-2 text-white/90">
                                Return products to the supplier and automatically update inventory.
                            </p>

                        </div>

                    </div>

                </section>

                <section className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm transition-colors">

                    <Form
                        purchases={purchases}
                        submitLabel="Process Purchase Return"
                    />

                </section>

            </div>

        </AppLayout>
    );
}