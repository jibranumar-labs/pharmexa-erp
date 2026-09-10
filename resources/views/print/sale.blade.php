<!DOCTYPE html>
<html>
<head>
    <title>{{ $sale->invoice_number }}</title>
    <style>
        @page {
            size: A4;
            margin: 12mm;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #0f172a;
            background: #f8fafc;
            font-size: 13px;
        }

        .invoice {
            max-width: 190mm;
            min-height: 270mm;
            margin: 0 auto;
            background: white;
            padding: 16mm;
        }

        .print {
            margin-bottom: 12px;
            padding: 8px 14px;
            border: 0;
            border-radius: 8px;
            background: #0f766e;
            color: white;
            font-weight: 800;
            cursor: pointer;
        }

        .header {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            border-bottom: 3px solid #0f766e;
            padding-bottom: 14px;
        }

        .brand {
            font-size: 34px;
            font-weight: 900;
            color: #0f766e;
            letter-spacing: 1px;
        }

        .subtitle {
            margin-top: 3px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #334155;
        }

        .muted {
            color: #64748b;
            font-size: 12px;
            font-weight: 700;
        }

        .invoice-no {
            margin: 0;
            font-size: 25px;
            font-weight: 900;
            color: #0f172a;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 16px;
        }

        .box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px 14px;
        }

        .box-title {
            margin-bottom: 6px;
            color: #64748b;
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: .08em;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
        }

        th {
            background: #0f766e;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
        }

        td {
            border-bottom: 1px solid #e2e8f0;
            padding: 10px;
            vertical-align: top;
        }

        .text-right {
            text-align: right;
        }

        .summary-wrap {
            display: flex;
            justify-content: flex-end;
            margin-top: 18px;
        }

        .total {
            width: 310px;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 7px 0;
            border-bottom: 1px solid #f1f5f9;
        }

        .grand {
            margin-top: 4px;
            padding-top: 10px;
            border-top: 2px solid #0f766e;
            font-size: 22px;
            font-weight: 900;
            color: #0f766e;
        }

        .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 80px;
            margin-top: 35px;
        }

        .signature-line {
            border-top: 1px solid #94a3b8;
            padding-top: 8px;
            text-align: center;
            color: #64748b;
            font-weight: 800;
        }

        .footer {
            margin-top: 26px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            text-align: center;
            font-size: 11px;
            color: #64748b;
            font-weight: 700;
        }

        @media print {
            body {
                background: white;
            }

            .print {
                display: none;
            }

            .invoice {
                max-width: none;
                min-height: auto;
                margin: 0;
                padding: 0;
                box-shadow: none;
            }

            table, tr, td, th {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
<div class="invoice">
    <div class="print" style="display:flex; gap:10px; margin-bottom:15px;">

    <button
        onclick="window.print()"
        style="padding:10px 18px; border:none; border-radius:8px; background:#0f766e; color:#fff; font-weight:bold; cursor:pointer;"
    >
        🖨 Print Invoice
    </button>

    <!-- <button
        onclick="window.close()"
        style="padding:10px 18px; border:none; border-radius:8px; background:#dc2626; color:#fff; font-weight:bold; cursor:pointer;"
    >
        ✖ Close
    </button> -->

</div>

    <div class="header">
        <div>
            <div class="brand">{{ $setting->pharmacy_name }}</div>
            <div class="subtitle">
    {{ $setting->branch_name ?: 'Pharmacy ERP Sales Invoice' }}
</div>
            <div class="muted">
    {{ $setting->city }}, {{ $setting->country }}
</div>

@if($setting->phone)
<div class="muted">
    Phone: {{ $setting->phone }}
</div>
@endif

@if($setting->email)
<div class="muted">
    Email: {{ $setting->email }}
</div>
@endif

        <div style="text-align:right">
            <h2 class="invoice-no">{{ $sale->invoice_number }}</h2>
            <div class="muted">{{ $sale->created_at->format('d M Y, h:i A') }}</div>
            <div class="muted">Cashier: {{ $sale->user->name ?? 'System' }}</div>
           <div class="muted">
Payment Method:
<strong>{{ ucfirst($sale->payment_method ?? 'Cash') }}</strong>
</div>
        </div>
    </div>

    <div class="info-grid">

    <div class="box">
        <div class="box-title">Customer Information</div>

        <strong>{{ $sale->customer->name ?? $sale->customer_name ?? 'Walk-in Customer' }}</strong><br>

        Phone: {{ $sale->customer->phone ?? $sale->customer_phone ?? '-' }}
    </div>

    <div class="box">
        <div class="box-title">Invoice Information</div>

        Invoice No:
        <strong>{{ $sale->invoice_number }}</strong><br>

        Status:
        <strong>{{ ucfirst($sale->status ?? 'Completed') }}</strong>
    </div>

    @if($setting->vat_number || $setting->commercial_registration || $setting->pharmacy_license)
    <div class="box">

        <div class="box-title">
            Saudi Tax Information
        </div>

        @if($setting->vat_number)
            VAT No:
            <strong>{{ $setting->vat_number }}</strong><br>
        @endif

        @if($setting->commercial_registration)
            CR:
            <strong>{{ $setting->commercial_registration }}</strong><br>
        @endif

        @if($setting->pharmacy_license)
            License:
            <strong>{{ $setting->pharmacy_license }}</strong>
        @endif

    </div>
    @endif

</div>
    </div>

    <table>
        <thead>
        <tr>
            <th style="width:50px">#</th>
            <th>Medicine</th>
            <th class="text-right" style="width:80px">Qty</th>
            <th class="text-right" style="width:130px">Unit Price</th>
            <th class="text-right" style="width:130px">Total</th>
        </tr>
        </thead>

        <tbody>
        @foreach($sale->items as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>
    <strong>{{ $item->medicine->name ?? $item->medicine_name }}</strong>
</td>
                <td class="text-right">{{ $item->quantity }}</td>
                <td class="text-right">{{ number_format($item->unit_price, 2) }} SAR</td>
                <td class="text-right"><strong>{{ number_format($item->total_price, 2) }} SAR</strong></td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <div class="summary-wrap">
        <div class="total">
            <div class="total-row"><span>Subtotal</span><strong>{{ number_format($sale->subtotal, 2) }} SAR</strong></div>
            <div class="total-row"><span>Discount</span><strong>{{ number_format($sale->discount, 2) }} SAR</strong></div>
            <div class="total-row"><span>Tax</span><strong>{{ number_format($sale->tax, 2) }} SAR</strong></div>
            <div class="total-row grand"><span>Total</span><span>{{ number_format($sale->total, 2) }} SAR</span></div>
            <div class="total-row"><span>Paid</span><strong>{{ number_format($sale->paid_amount, 2) }} SAR</strong></div>
            <div class="total-row"><span>Change</span><strong>{{ number_format($sale->change_amount, 2) }} SAR</strong></div>
        </div>
    </div>
<div style="margin-top:35px; display:flex; justify-content:space-between; align-items:center;">

    <div style="text-align:center; width:48%;">
        {!! $barcode !!}
        <div style="margin-top:8px; font-weight:bold;">
            {{ $sale->invoice_number }}
        </div>
    </div>

    <div style="text-align:center; width:48%;">
        <img
            src="{{ $qr }}"
            alt="Invoice QR"
            style="width:140px;height:140px;"
        >
    </div>

</div>
    <div class="signatures">
        <div class="signature-line">Customer Signature</div>
        <div class="signature-line">Authorized Signature</div>
    </div>

    <div class="footer">
        Thank you for visiting Pharmexa Pharmacy.<br>
        Printed on {{ now()->format('d M Y, h:i A') }} | Powered by Pharmexa ERP
    </div>
</div>
<script>
window.onload = function () {
    if (window.location.search.includes("autoprint=1")) {
        setTimeout(() => {
            window.print();
        }, 500);
    }
};
</script>
</body>
</html>