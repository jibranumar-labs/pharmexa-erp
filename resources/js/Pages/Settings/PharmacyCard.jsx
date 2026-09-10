import Card, { CardHeader } from "@/Components/UI/Card/Card";
import { useForm } from "@inertiajs/react";
import { Building2, Save } from "lucide-react";

export default function PharmacyCard({ setting }) {

    const { data, setData, put, processing } = useForm({

    pharmacy_name: setting?.pharmacy_name || "",
    pharmacy_name_ar: setting?.pharmacy_name_ar || "",

    branch_name: setting?.branch_name || "",
    branch_name_ar: setting?.branch_name_ar || "",

    owner_name: setting?.owner_name || "",
    pharmacist_name: setting?.pharmacist_name || "",

    phone: setting?.phone || "",
    whatsapp: setting?.whatsapp || "",
    email: setting?.email || "",
    website: setting?.website || "",

    slogan: setting?.slogan || "",
    slogan_ar: setting?.slogan_ar || "",

    address: setting?.address || "",
    address_ar: setting?.address_ar || "",

    city: setting?.city || "",
    country: setting?.country || "",

});
    function submit(e) {

        e.preventDefault();

        put(route("settings.update"));

    }

    return (

        <Card>

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40">

                    <Building2 className="text-emerald-600 dark:text-emerald-400" size={28} />

                </div>

                <CardHeader
                    title="Pharmacy Information"
                    description="Basic information shown on invoices, receipts and reports."
                />

            </div>

            <form onSubmit={submit} className="space-y-5">

                <div className="grid gap-5 md:grid-cols-2">

                    <div>

                        <label className="mb-2 block text-sm font-bold">

                            Pharmacy Name

                        </label>

                        <input

                            value={data.pharmacy_name}

                            onChange={(e)=>

                                setData("pharmacy_name",e.target.value)

                            }

                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"

                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold">

                            Pharmacy Name (Arabic)

                        </label>

                        <input

                            dir="rtl"

                            value={data.pharmacy_name_ar}

                            onChange={(e)=>

                                setData("pharmacy_name_ar",e.target.value)

                            }

                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"

                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold">

                            Branch Name

                        </label>

                        <input

                            value={data.branch_name}

                            onChange={(e)=>

                                setData("branch_name",e.target.value)

                            }

                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"

                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold">

                            Branch Name (Arabic)

                        </label>

                        <input

                            dir="rtl"

                            value={data.branch_name_ar}

                            onChange={(e)=>

                                setData("branch_name_ar",e.target.value)

                            }

                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"

                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold">

                            Owner Name

                        </label>

                        <input

                            value={data.owner_name}

                            onChange={(e)=>

                                setData("owner_name",e.target.value)

                            }

                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"

                        />
                       

                    </div>
                     <div>

    <label className="mb-2 block text-sm font-bold">

        Pharmacist Name

    </label>

    <input

        value={data.pharmacist_name}

        onChange={(e)=>

            setData("pharmacist_name", e.target.value)

        }

        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"

        placeholder="Licensed Pharmacist"

    />

</div>

                    <div>

                        <label className="mb-2 block text-sm font-bold">

                            Phone

                        </label>

                       <input

    type="tel"

    value={data.phone}

    onChange={(e)=>

        setData("phone", e.target.value)

    }

    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"

    placeholder="+966 5X XXX XXXX"

/>

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold">

                            WhatsApp

                        </label>

                        <input

    type="tel"

    value={data.whatsapp}

    onChange={(e)=>

        setData("whatsapp", e.target.value)

    }

    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"

    placeholder="+966 5X XXX XXXX"

/>

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold">

                            Email

                        </label>

                        <input

                            type="email"

                            value={data.email}

                            onChange={(e)=>

                                setData("email",e.target.value)

                            }

                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"

                        />

                    </div>

                    <div className="md:col-span-2">

    <label className="mb-2 block text-sm font-bold">
        Website
    </label>

    <input
        type="url"
        value={data.website}
        onChange={(e) => setData("website", e.target.value)}
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
        placeholder="https://www.pharmacy.com"
    />

</div>

<div>

    <label className="mb-2 block text-sm font-bold">
        Pharmacy Slogan
    </label>

    <input
        value={data.slogan}
        onChange={(e) => setData("slogan", e.target.value)}
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
        placeholder="Your Health, Our Priority"
    />

</div>

<div>

    <label className="mb-2 block text-sm font-bold">
        Pharmacy Slogan (Arabic)
    </label>

    <input
        dir="rtl"
        value={data.slogan_ar}
        onChange={(e) => setData("slogan_ar", e.target.value)}
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
        placeholder="صحتكم أولويتنا"
    />



                    </div>

                    <div className="md:col-span-2">

                        <label className="mb-2 block text-sm font-bold">

                            Address

                        </label>

                       <textarea
    rows={3}
    value={data.address}
    onChange={(e) => setData("address", e.target.value)}
    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
    placeholder="King Fahd Road, Riyadh"
/>

                    </div>

                    <div className="md:col-span-2">

                        <label className="mb-2 block text-sm font-bold">

                            Address (Arabic)

                        </label>

                        <textarea
    dir="rtl"
    rows={3}
    value={data.address_ar}
    onChange={(e) => setData("address_ar", e.target.value)}
    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
    placeholder="طريق الملك فهد، الرياض"
/>

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold">

                            City

                        </label>

                        <input
    value={data.city}
    onChange={(e) => setData("city", e.target.value)}
    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
    placeholder="Riyadh"
/>
                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold">

                            Country

                        </label>

                        <input
    value={data.country}
    onChange={(e) => setData("country", e.target.value)}
    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
    placeholder="Saudi Arabia"
/>

                    </div>

                </div>

                <button
    type="submit"
    disabled={processing}
    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 font-black text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-50"
>
    <Save size={20} />

    {processing
        ? "Saving..."
        : "Save Pharmacy Information"}
</button>
            </form>

        </Card>

    );

}