import Card, { CardHeader } from "@/Components/UI/Card/Card";
import { useForm } from "@inertiajs/react";
import { Receipt, Save } from "lucide-react";

export default function ReceiptCard({ setting }) {

    const { data, setData, put, processing } = useForm({

        receipt_size: setting?.receipt_size || "80",

        auto_print_receipt: Boolean(setting?.auto_print_receipt),
        auto_print_sticker: Boolean(setting?.auto_print_sticker),

        show_logo: Boolean(setting?.show_logo),
        show_barcode: Boolean(setting?.show_barcode),
        show_qr: Boolean(setting?.show_qr),
        show_pharmacist: Boolean(setting?.show_pharmacist),

        show_patient_name: Boolean(setting?.show_patient_name),
        show_expiry_date: Boolean(setting?.show_expiry_date),
        show_sticker_logo: Boolean(setting?.show_sticker_logo),

        receipt_header: setting?.receipt_header || "",
        receipt_header_ar: setting?.receipt_header_ar || "",

        receipt_footer: setting?.receipt_footer || "",
        receipt_footer_ar: setting?.receipt_footer_ar || "",

    });

    function submit(e) {

        e.preventDefault();

        put(route("settings.update"));

    }

    return (

        <Card>

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/40">

                    <Receipt
                        className="text-blue-600"
                        size={28}
                    />

                </div>

                <CardHeader
                    title="Receipt & Sticker Settings"
                    description="Configure thermal receipts, dosage stickers and printing."
                />

            </div>

            <form
                onSubmit={submit}
                className="space-y-6"
            >

                <div>

                    <label className="mb-2 block text-sm font-black">

                        Receipt Paper Size

                    </label>

                    <select
                        value={data.receipt_size}
                        onChange={(e)=>setData("receipt_size",e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                    >
                        <option value="58">58 mm Thermal Printer</option>
                        <option value="80">80 mm Thermal Printer</option>
                    </select>

                </div>

                <div className="grid gap-4 md:grid-cols-2">

                    <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-4">

                        <span>Auto Print Receipt</span>

                        <input
                            type="checkbox"
                            checked={data.auto_print_receipt}
                            onChange={(e)=>setData("auto_print_receipt",e.target.checked)}
                        />

                    </label>

                    <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-4">

                        <span>Auto Print Dosage Sticker</span>

                        <input
                            type="checkbox"
                            checked={data.auto_print_sticker}
                            onChange={(e)=>setData("auto_print_sticker",e.target.checked)}
                        />

                    </label>

                    <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-4">

                        <span>Show Pharmacy Logo</span>

                        <input
                            type="checkbox"
                            checked={data.show_logo}
                            onChange={(e)=>setData("show_logo",e.target.checked)}
                        />

                    </label>

                    <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-4">

                        <span>Show Barcode</span>

                        <input
                            type="checkbox"
                            checked={data.show_barcode}
                            onChange={(e)=>setData("show_barcode",e.target.checked)}
                        />

                    </label>

                    <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-4">

                        <span>Show QR Code</span>

                        <input
                            type="checkbox"
                            checked={data.show_qr}
                            onChange={(e)=>setData("show_qr",e.target.checked)}
                        />

                    </label>

                    <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-4">

                        <span>Show Pharmacist Name</span>

                        <input
                            type="checkbox"
                            checked={data.show_pharmacist}
                            onChange={(e)=>setData("show_pharmacist",e.target.checked)}
                        />

                    </label>

                    <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-4">

                        <span>Show Patient Name</span>

                        <input
                            type="checkbox"
                            checked={data.show_patient_name}
                            onChange={(e)=>setData("show_patient_name",e.target.checked)}
                        />

                    </label>

                    <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-4">

                        <span>Show Expiry Date</span>

                        <input
                            type="checkbox"
                            checked={data.show_expiry_date}
                            onChange={(e)=>setData("show_expiry_date",e.target.checked)}
                        />

                    </label>

                    <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:col-span-2">

                        <span>Show Pharmacy Logo on Sticker</span>

                        <input
                            type="checkbox"
                            checked={data.show_sticker_logo}
                            onChange={(e)=>setData("show_sticker_logo",e.target.checked)}
                        />

                    </label>

                </div>

                <div>

                    <label className="mb-2 block text-sm font-black">

                        Receipt Header (English)

                    </label>

                    <textarea
                        rows={2}
                        value={data.receipt_header}
                        onChange={(e)=>setData("receipt_header",e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                        placeholder="Licensed Pharmacy"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-black">

                        Receipt Header (Arabic)

                    </label>

                    <textarea
                        dir="rtl"
                        rows={2}
                        value={data.receipt_header_ar}
                        onChange={(e)=>setData("receipt_header_ar",e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                        placeholder="صيدلية مرخصة"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-black">

                        Receipt Footer (English)

                    </label>

                    <textarea
                        rows={3}
                        value={data.receipt_footer}
                        onChange={(e)=>setData("receipt_footer",e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                        placeholder="Thank you for visiting Pharmexa."
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-black">

                        Receipt Footer (Arabic)

                    </label>

                    <textarea
                        dir="rtl"
                        rows={3}
                        value={data.receipt_footer_ar}
                        onChange={(e)=>setData("receipt_footer_ar",e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                        placeholder="شكراً لزيارتكم"
                    />

                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 font-black text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-50"
                >

                    <Save size={20} />

                    {processing
                        ? "Saving..."
                        : "Save Receipt Settings"}

                </button>

            </form>

        </Card>

    );

}