import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { SquarePen } from 'lucide-react';
import Form from './Form';

export default function Edit({ expense }) {
    return (
        <AppLayout title="Edit Expense">
            <Head title="Edit Expense | Pharmexa" />

            <div className="space-y-7">

                <section className="rounded-[2rem] bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 p-8 text-white shadow-2xl">

                    <div className="flex items-center gap-4">

                        <div className="rounded-2xl bg-white/20 p-4 transition-colors">
                            <SquarePen size={34} />
                        </div>

                        <div>
                            <h1 className="text-4xl font-black">
                                Edit Expense
                            </h1>

                            <p className="mt-2 text-white/90">
                                Update expense information.
                            </p>
                        </div>

                    </div>

                </section>

                <section className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm transition-colors">

                    <Form
                        expense={expense}
                        submitLabel="Update Expense"
                    />

                </section>

            </div>

        </AppLayout>
    );
}