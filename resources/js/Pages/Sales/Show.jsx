import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Barcode,
    Printer,
    QrCode,
    Receipt,
    ExternalLink,
} from 'lucide-react';

export default function Show({ sale, setting })  {
    const printInvoice = () => window.print();

    const saleDate = new Date(sale.created_at).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const qrText = encodeURIComponent(
        `Pharmexa Invoice: ${sale.invoice_number} | Total: ${Number(sale.total).toFixed(2)} SAR | Date: ${saleDate}`
    );

    return (
        <AppLayout title="Invoice">
            <Head title={`${sale.invoice_number} | Pharmexa`} />

            <style>{`
                @media print {
                    @page {
                        size: 80mm auto;
                        margin: 2mm;
                    }

                    body * {
                        visibility: hidden !important;
                    }

                    #receipt, #receipt * {
                        visibility: visible !important;
                    }

                    #receipt {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 76mm !important;
                        max-width: 76mm !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                        border-radius: 0 !important;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .print-text {
                        font-size: 10px !important;
                    }

                    .print-title {
                        font-size: 18px !important;
                    }

                    .print-total {
                        font-size: 15px !important;
                    }
                }
            `}</style>

            <div className="space-y-6">
                <section className="no-print rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-8 text-white shadow-2xl">
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur transition-colors">
                                <Receipt size={16} />
                                Sales / Receipt
                            </div>

                            <h1 className="text-4xl font-black lg:text-5xl">
                                {sale.invoice_number}
                            </h1>

                            <p className="mt-2 text-white/90">
                                Arabic + English pharmacy receipt with QR and barcode.
                            </p>
                        </div>

                       <div className="flex flex-wrap gap-3">
    <Link
        href={route("sales.index")}
        className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-white px-5 py-3 font-black text-blue-700 dark:text-blue-300 shadow-lg transition-colors"
    >
        <ArrowLeft size={18} />
        Back
    </Link>

    <button
        type="button"
        onClick={() =>
            window.open(
                route("sales.thermal", sale.id),
                "thermalReceipt",
                "width=500,height=850,scrollbars=yes,resizable=yes"
            )
        }
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-black text-white shadow-lg"
    >
        <Printer size={18} />
        Thermal Receipt
    </button>

    <button
        type="button"
        onClick={() =>
            window.open(
                route("sales.print", sale.id),
                "a4Invoice",
                "width=900,height=1000,scrollbars=yes,resizable=yes"
            )
        }
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-black text-white shadow-lg"
    >
        <Printer size={18} />
        A4 Invoice
    </button>

    <button
        type="button"
        onClick={() =>
            window.open(
                route("sales.dosage-stickers", sale.id),
                "dosageStickers",
                "width=500,height=850,scrollbars=yes,resizable=yes"
            )
        }
        className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-black text-white shadow-lg"
    >
        <Printer size={18} />
        All Stickers
    </button>
</div>
                    </div>
                </section>

                <section
                    id="receipt"
                    className="mx-auto max-w-sm rounded-[1.5rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-xl transition-colors"
                >
                    <div className="text-center">
                        <h2 className="print-title text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                            {setting?.pharmacy_name || "PHARMEXA"}
                        </h2>

                        <p className="text-sm font-black text-slate-950 dark:text-white" dir="rtl">
                           {setting?.pharmacy_name_ar || "صيدلية فارمكسا"}
                        </p>

                        <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                            Pharmacy POS Receipt
                        </p>

                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400" dir="rtl">
                            فاتورة ضريبية مبسطة
                        </p>

                        <p className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {setting?.city}, {setting?.country}
                        </p>

                        <p
    className="text-[11px] font-semibold text-slate-500 dark:text-slate-400"
    dir="rtl"
>
    {setting?.city
        ? `${setting.city}، ${setting.country}`
        : "الرياض، المملكة العربية السعودية"}
</p>
                    </div>

                    <Divider />

                    <div className="space-y-1.5 text-xs print-text">
                        <BiRow en="Invoice No" ar="رقم الفاتورة" value={sale.invoice_number} />
                        <BiRow en="Date" ar="التاريخ" value={saleDate} />
                        <BiRow en="Customer" ar="العميل" value={sale.customer_name || 'Walk-in / عميل نقدي'} />
                        <BiRow en="Cashier" ar="الكاشير" value={sale.user?.name || 'System'} />
                        <BiRow en="Payment" ar="طريقة الدفع" value={capitalize(sale.payment_method || 'cash')} />
                    </div>

                    <Divider />

                    <div className="grid grid-cols-12 border-b border-slate-200 dark:border-slate-700 pb-2 text-[11px] font-black text-slate-500 dark:text-slate-400">
                        <div className="col-span-6">
                            Item
                            <br />
                            <span dir="rtl">الصنف</span>
                        </div>
                        <div className="col-span-2 text-center">
                            Qty
                            <br />
                            <span dir="rtl">كمية</span>
                        </div>
                        <div className="col-span-2 text-right">
                            Price
                            <br />
                            <span dir="rtl">السعر</span>
                        </div>
                        <div className="col-span-2 text-right">
                            Total
                            <br />
                            <span dir="rtl">الإجمالي</span>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
    {sale.items.map((item) => (
        <div
            key={item.id}
            className="grid grid-cols-12 gap-1 py-2 text-xs print-text"
        >
            <div className="col-span-6">
                <p className="font-black leading-4 text-slate-950 dark:text-white">
                    {item.medicine_name}
                </p>

                <a
                    href={route("print.dosage-sticker", item.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-print mt-2 inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-700"
                >
                    <Printer size={12} />
                    Sticker
                </a>
            </div>

            <div className="col-span-2 text-center font-bold">
                {item.quantity}
            </div>

            <div className="col-span-2 text-right font-bold">
                {Number(item.unit_price).toFixed(2)}
            </div>

            <div className="col-span-2 text-right font-black">
                {Number(item.total_price).toFixed(2)}
            </div>
        </div>
    ))}

                    </div>

                    <Divider />

                    <div className="space-y-1.5 text-xs print-text">
                        <BiRow en="Subtotal" ar="المجموع" value={`${Number(sale.subtotal).toFixed(2)} SAR`} />
                        <BiRow en="Discount" ar="الخصم" value={`${Number(sale.discount).toFixed(2)} SAR`} />
                        <BiRow en="VAT" ar="الضريبة" value={`${Number(sale.tax).toFixed(2)} SAR`} />

                        <div className="my-2 border-t border-slate-200 dark:border-slate-700" />

                        <div className="flex justify-between text-base font-black text-slate-950 dark:text-white print-total">
                            <span>
                                Total
                                <br />
                                <span className="text-xs" dir="rtl">الصافي</span>
                            </span>
                            <span>{Number(sale.total).toFixed(2)} SAR</span>
                        </div>

                        <BiRow en="Paid" ar="المدفوع" value={`${Number(sale.paid_amount).toFixed(2)} SAR`} />
                        <BiRow en="Change" ar="الباقي" value={`${Number(sale.change_amount).toFixed(2)} SAR`} />
                    </div>

                    <Divider />

                    <div className="text-center">
                        <div className="mb-3">
                            <img
                                alt="Invoice Barcode"
                                className="mx-auto h-12 max-w-full"
                                src={`https://barcode.tec-it.com/barcode.ashx?data=${sale.invoice_number}&code=Code128&translate-esc=on`}
                            />
                            <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                <Barcode size={12} />
                                {sale.invoice_number}
                            </div>
                        </div>

                        <div className="mb-3">
                            <img
                                alt="Invoice QR"
                                className="mx-auto h-28 w-28"
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrText}`}
                            />
                            <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                <QrCode size={12} />
                                QR Invoice
                            </div>
                        </div>

                        <p className="text-xs font-black text-slate-950 dark:text-white">
                            Thank you for visiting
                        </p>

                        <p className="text-xs font-black text-slate-950 dark:text-white" dir="rtl">
                            شكراً لزيارتكم
                        </p>

                        <p className="mt-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            Return within 72 hours with original receipt.
                        </p>

                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400" dir="rtl">
                            الاسترجاع خلال ٧٢ ساعة مع الفاتورة الأصلية.
                        </p>

                        <p className="mt-2 text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                            Powered by Pharmexa ERP
                        </p>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}

function Divider() {
    return <div className="my-4 border-t border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors" />;
}

function BiRow({ en, ar, value }) {
    return (
        <div className="flex justify-between gap-3">
            <span className="font-bold text-slate-500 dark:text-slate-400">
                {en}
                <br />
                <span dir="rtl">{ar}</span>
            </span>

            <span className="text-right font-black text-slate-950 dark:text-white">
                {value}
            </span>
        </div>
    );
}

function capitalize(value) {
    if (!value) return '';

    return value.charAt(0).toUpperCase() + value.slice(1);
}