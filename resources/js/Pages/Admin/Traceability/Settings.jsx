import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Settings({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        enabled: settings.enabled,
        environment: settings.environment ?? 'sandbox',

        gln: settings.gln ?? '',
        username: settings.username ?? '',
        password: settings.password ?? '',

        certificate: null,
        certificate_password: settings.certificate_password ?? '',

        api_endpoint: settings.api_endpoint ?? '',
        drug_endpoint: settings.drug_endpoint ?? '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.traceability.settings.save'));
    };

    return (
        <AppLayout title="Saudi RSD Settings">
            <Head title="Saudi RSD Settings" />

            <form onSubmit={submit} className="space-y-8">

                {/* Header */}
                <div className="rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-900 p-8 text-white shadow-xl">
                    <h1 className="text-4xl font-black">
                        🇸🇦 Saudi RSD Settings
                    </h1>

                    <p className="mt-3 text-lg text-cyan-100">
                        Configure Saudi Drug Traceability integration for your pharmacy.
                    </p>
                </div>

                {/* Main Card */}
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">

                    {/* Enable */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-6 dark:border-slate-700">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                Enable Traceability
                            </h2>

                            <p className="text-sm text-slate-500">
                                Enable Saudi RSD integration.
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            checked={data.enabled}
                            onChange={(e) =>
                                setData('enabled', e.target.checked)
                            }
                            className="h-5 w-5 accent-cyan-600"
                        />
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">

                        {/* Environment */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block font-bold text-slate-700 dark:text-slate-300">
                                Environment
                            </label>

                            <select
                                value={data.environment}
                                onChange={(e) =>
                                    setData('environment', e.target.value)
                                }
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                            >
                                <option value="sandbox">Sandbox</option>
                                <option value="production">Production</option>
                            </select>
                        </div>

                        {/* GLN */}
                        <div>
                            <label className="mb-2 block font-bold">
                                GLN
                            </label>

                            <input
                                type="text"
                                value={data.gln}
                                onChange={(e) => setData('gln', e.target.value)}
                                className="w-full rounded-2xl border px-4 py-3 shadow-sm"
                            />

                            {errors.gln && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.gln}
                                </p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="mb-2 block font-bold">
                                Username
                            </label>

                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) =>
                                    setData('username', e.target.value)
                                }
                                className="w-full rounded-2xl border px-4 py-3 shadow-sm"
                            />

                            {errors.username && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-2 block font-bold">
                                Password
                            </label>

                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="w-full rounded-2xl border px-4 py-3 shadow-sm"
                            />
                        </div>

                        {/* Certificate Password */}
                        <div>
                            <label className="mb-2 block font-bold">
                                Certificate Password
                            </label>

                            <input
                                type="password"
                                value={data.certificate_password}
                                onChange={(e) =>
                                    setData(
                                        'certificate_password',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-2xl border px-4 py-3 shadow-sm"
                            />
                        </div>

                        {/* API */}
                        <div>
                            <label className="mb-2 block font-bold">
                                API Endpoint
                            </label>

                            <input
                                type="url"
                                value={data.api_endpoint}
                                onChange={(e) =>
                                    setData('api_endpoint', e.target.value)
                                }
                                className="w-full rounded-2xl border px-4 py-3 shadow-sm"
                            />
                        </div>

                        {/* Drug */}
                        <div>
                            <label className="mb-2 block font-bold">
                                Drug Endpoint
                            </label>

                            <input
                                type="url"
                                value={data.drug_endpoint}
                                onChange={(e) =>
                                    setData('drug_endpoint', e.target.value)
                                }
                                className="w-full rounded-2xl border px-4 py-3 shadow-sm"
                            />
                        </div>

                        {/* Certificate */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block font-bold">
                                Certificate (.pfx)
                            </label>

                            <input
                                type="file"
                                onChange={(e) =>
                                    setData(
                                        'certificate',
                                        e.target.files[0]
                                    )
                                }
                                className="w-full rounded-2xl border border-dashed border-cyan-400 bg-cyan-50 p-4"
                            />
                        </div>
                    </div>

                    <div className="mt-10">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-105"
                        >
                            {processing ? 'Saving...' : '💾 Save Settings'}
                        </button>
                    </div>

                </div>
            </form>
        </AppLayout>
    );
}