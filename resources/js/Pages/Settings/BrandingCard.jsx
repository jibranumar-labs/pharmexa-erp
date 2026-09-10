import Card, { CardHeader } from "@/Components/UI/Card/Card";
import { Save, Image } from "lucide-react";

export default function BrandingCard({ setting }) {

    return (

        <Card>

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/40">

                    <Image
                        className="text-purple-600"
                        size={28}
                    />

                </div>

                <CardHeader
                    title="Branding"
                    description="Customize your pharmacy identity."
                />

            </div>

            <div className="space-y-6">

                <div>

                    <label className="mb-2 block text-sm font-black">

                        Pharmacy Logo

                    </label>

                    <input
                        type="file"
                        disabled
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                    />

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">

                        Logo upload will be enabled in the next update.

                    </p>

                </div>

                <div>

                    <label className="mb-2 block text-sm font-black">

                        Favicon

                    </label>

                    <input
                        type="file"
                        disabled
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                    />

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">

                        Browser favicon upload will be available soon.

                    </p>

                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-6">

                    <h4 className="font-black text-slate-800 dark:text-slate-100">

                        Live Branding Preview

                    </h4>

                    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-center placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors">

                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">

                            <Image
                                className="text-slate-400 dark:text-slate-500"
                                size={34}
                            />

                        </div>

                        <h2 className="text-2xl font-black">

                            {setting?.pharmacy_name || "PHARMEXA"}

                        </h2>

                        <p
                            dir="rtl"
                            className="mt-2 font-bold text-slate-600 dark:text-slate-400"
                        >

                            {setting?.pharmacy_name_ar || "صيدلية فارمكسا"}

                        </p>

                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">

                            {setting?.slogan || "Your Health, Our Priority"}

                        </p>

                        <p
                            dir="rtl"
                            className="mt-1 text-sm text-slate-500 dark:text-slate-400"
                        >

                            {setting?.slogan_ar || "صحتكم أولويتنا"}

                        </p>

                    </div>

                </div>

                <button
                    disabled
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-4 font-black text-white opacity-60"
                >

                    <Save size={20} />

                    Branding Auto Saves from Pharmacy Information

                </button>

            </div>

        </Card>

    );

}