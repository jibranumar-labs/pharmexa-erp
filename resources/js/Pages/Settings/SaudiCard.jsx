import Card, { CardHeader } from "@/Components/UI/Card/Card";
import { useForm } from "@inertiajs/react";
import { Landmark, Save } from "lucide-react";

export default function SaudiCard({ setting }) {

    const { data, setData, put, processing } = useForm({

        vat_number: setting?.vat_number || "",

        commercial_registration:
            setting?.commercial_registration || "",

        pharmacy_license:
            setting?.pharmacy_license || "",

        currency: setting?.currency || "SAR",

        timezone: setting?.timezone || "Asia/Riyadh",

        language: setting?.language || "en",
        tax_percentage: setting?.tax_percentage || 15,

currency_symbol: setting?.currency_symbol || "SAR",

default_printer: setting?.default_printer || "",

    });

    function submit(e) {

        e.preventDefault();

        put(route("settings.update"));

    }

    return (

        <Card>

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">

                    <Landmark
                        className="text-green-700"
                        size={28}
                    />

                </div>

                <CardHeader
                    title="Saudi Arabia Settings"
                    description="Legal and regional information printed on invoices and receipts."
                />

            </div>

            <form
                onSubmit={submit}
                className="space-y-5"
            >

                <div className="grid gap-5 md:grid-cols-2">

                    <div>

                        <label className="mb-2 block text-sm font-black">

                            VAT Number

                        </label>

                        <input
                            value={data.vat_number}
                            onChange={(e)=>
                                setData("vat_number", e.target.value)
                            }
                            placeholder="300xxxxxxxxxxxx"
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-black">

                            Commercial Registration (CR)

                        </label>

                        <input
                            value={data.commercial_registration}
                            onChange={(e)=>
                                setData(
                                    "commercial_registration",
                                    e.target.value
                                )
                            }
                            placeholder="1010XXXXXX"
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-black">

                            Pharmacy License

                        </label>

                        <input
                            value={data.pharmacy_license}
                            onChange={(e)=>
                                setData(
                                    "pharmacy_license",
                                    e.target.value
                                )
                            }
                            placeholder="License Number"
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                        />

                    </div>
                    <div>

    <label className="mb-2 block text-sm font-black">
        VAT Percentage
    </label>

    <input
        type="number"
        step="0.01"
        value={data.tax_percentage}
        onChange={(e) =>
            setData("tax_percentage", e.target.value)
        }
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
    />

</div>

                    <div>

                        <label className="mb-2 block text-sm font-black">

                            Currency

                        </label>

                        <select
                            value={data.currency}
                            onChange={(e)=>
                                setData("currency", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                        >

                            <option value="SAR">
                                Saudi Riyal (SAR)
                            </option>

                            <option value="USD">
                                US Dollar (USD)
                            </option>

                            <option value="PKR">
                                Pakistani Rupee (PKR)
                            </option>

                        </select>

                    </div>
                    <div>

    <label className="mb-2 block text-sm font-black">
        Currency Symbol
    </label>

    <input
        value={data.currency_symbol}
        onChange={(e) =>
            setData("currency_symbol", e.target.value)
        }
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
        placeholder="SAR"
    />

</div>

                    <div>

                        <label className="mb-2 block text-sm font-black">

                            Timezone

                        </label>

                        <select
                            value={data.timezone}
                            onChange={(e)=>
                                setData("timezone", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                        >

                            <option value="Asia/Riyadh">
                                Asia/Riyadh
                            </option>

                            <option value="Asia/Dubai">
                                Asia/Dubai
                            </option>

                            <option value="Asia/Karachi">
                                Asia/Karachi
                            </option>

                        </select>

                    </div>
                    <div>

    <label className="mb-2 block text-sm font-black">
        Default Printer
    </label>

    <input
        value={data.default_printer}
        onChange={(e) =>
            setData("default_printer", e.target.value)
        }
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
        placeholder="EPSON TM-T20III"
    />

</div>

                    <div>

                        <label className="mb-2 block text-sm font-black">

                            Default Language

                        </label>

                        <select
                            value={data.language}
                            onChange={(e)=>
                                setData("language", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                        >

                            <option value="en">
                                English
                            </option>

                            <option value="ar">
                                Arabic
                            </option>

                            <option value="both">
                                English + Arabic
                            </option>

                        </select>

                    </div>

                </div>

                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5">

                    <h4 className="font-black text-slate-800 dark:text-slate-100">

                        Printed on Receipts

                    </h4>

                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">

                        <li>✓ VAT Number</li>

                        <li>✓ Commercial Registration</li>

                        <li>✓ Pharmacy License</li>

                        <li>✓ Currency</li>

                        <li>✓ Arabic + English Receipt</li>

                    </ul>

                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 font-black text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-50"
                >

                    <Save size={18} />

                    Save Saudi Settings

                </button>

            </form>

        </Card>

    );

}