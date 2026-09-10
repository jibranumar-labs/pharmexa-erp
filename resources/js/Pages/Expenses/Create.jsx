import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
import Form from './Form';

export default function Create() {
    return (
        <AppLayout title="Add Expense">
            <Head title="Add Expense | Pharmexa" />

            <div className="space-y-7">

                <section className="rounded-[2rem] bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-500 p-8 text-white shadow-2xl">

                    <div className="flex items-center gap-4">

                        <div className="rounded-2xl bg-white/20 p-4 transition-colors">
                            <PlusCircle size={34} />
                        </div>

                        <div>
                            <h1 className="text-4xl font-black">
                                Add Expense
                            </h1>

                            <p className="mt-2 text-white/90">
                                Record a new pharmacy expense.
                            </p>
                        </div>

                    </div>

                </section>

                <section className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm transition-colors">

                    <Form submitLabel="Save Expense" />

                </section>

            </div>

        </AppLayout>
    );
}