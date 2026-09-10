import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    FileSpreadsheet,
    Rocket,
    ShieldCheck,
    Sparkles,
    UploadCloud,
} from 'lucide-react';

export default function Import() {
    const { data, setData, post, processing, errors } = useForm({
        file: null,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('medicines.import.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout title="Import Products">
            <Head title="Import Products | Pharmexa" />

            <div className="space-y-7">
                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition-colors">
                                <FileSpreadsheet size={16} />
                                Inventory / Smart Import
                            </div>

                            <h1 className="text-4xl font-black lg:text-5xl">
                                Smart Product Import
                            </h1>

                            <p className="mt-3 max-w-3xl font-medium text-white/90">
                                Upload Excel or CSV files and let Pharmexa automatically create
                                products, SKUs, categories, units and pricing.
                            </p>
                        </div>

                        <Link
                            href={route('medicines.index')}
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-5 py-3 font-black text-white backdrop-blur transition hover:bg-white dark:bg-white hover:text-blue-700 dark:text-blue-300"
                        >
                            <ArrowLeft size={18} />
                            Back to Products
                        </Link>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-3">
                    <form
                        onSubmit={submit}
                        className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 xl:col-span-2 transition-colors"
                    >
                        <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-800/60 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors">
                            <UploadCloud className="mx-auto text-blue-600" size={52} />

                            <h2 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">
                                Upload Product File
                            </h2>

                            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                Supported formats: XLS, XLSX, CSV
                            </p>

                            <input
                                type="file"
                                accept=".xls,.xlsx,.csv"
                                onChange={(e) => setData('file', e.target.files[0])}
                                className="mx-auto mt-6 block w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-600 dark:text-slate-400 dark:border-slate-700 dark:bg-slate-900 transition-colors"
                            />

                            {data.file && (
                                <div className="mx-auto mt-5 max-w-md rounded-2xl bg-emerald-50 p-4 text-left text-sm font-bold text-emerald-700 dark:text-emerald-300">
                                    Selected: {data.file.name}
                                </div>
                            )}

                            {errors.file && (
                                <p className="mt-3 text-sm font-bold text-red-600">
                                    {errors.file}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 rounded-3xl bg-slate-50 p-5 dark:bg-slate-800/60">
                            <h3 className="font-black text-slate-900 dark:text-white">
                                Import Rules
                            </h3>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <Rule text="Auto SKU: MED-000001..." />
                                <Rule text="Use PROD_ID as Barcode" />
                                <Rule text="Auto Category Detection" />
                                <Rule text="Auto Unit Detection" />
                                <Rule text="Default Supplier" />
                                <Rule text="Skip Duplicate Barcodes" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-emerald-500 px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl disabled:opacity-60"
                        >
                            <Rocket size={20} />
                            {processing ? 'Importing Products...' : 'Import Products'}
                        </button>
                    </form>

                    <div className="space-y-6">
                        <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 transition-colors">
                            <Sparkles
                                className="text-emerald-600 dark:text-emerald-400"
                                size={32}
                            />

                            <h3 className="mt-4 text-xl font-black text-slate-950 dark:text-white">
                                Smart Classification
                            </h3>

                            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                Pharmexa automatically classifies products such as
                                tablets, capsules, syrups, injections, creams,
                                cosmetics, supplements, medical devices and more.
                            </p>
                        </div>

                        <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white p-6 shadow-sm dark:bg-slate-900 transition-colors">
                            <ShieldCheck className="text-blue-600" size={32} />

                            <h3 className="mt-4 text-xl font-black text-slate-950 dark:text-white">
                                Safe Import
                            </h3>

                            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                Duplicate barcodes are skipped or updated safely,
                                preventing accidental duplicate products.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}

function Rule({ text }) {
    return (
        <div className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-bold text-slate-600 dark:text-slate-400 dark:bg-slate-900 transition-colors">
            <CheckCircle2
                className="text-emerald-600 dark:text-emerald-400"
                size={18}
            />
            {text}
        </div>
    );
}