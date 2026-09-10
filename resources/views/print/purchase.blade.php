<!DOCTYPE html>
<html>
<head>
    <title>{{ $purchase->purchase_number }}</title>

    <style>
        @page{
            size:A4;
            margin:12mm;
        }

        *{
            box-sizing:border-box;
        }

        body{
            margin:0;
            background:#f8fafc;
            font-family:Arial,sans-serif;
            color:#0f172a;
            font-size:13px;
        }

        .invoice{
            max-width:190mm;
            min-height:270mm;
            margin:auto;
            background:white;
            padding:16mm;
        }

        .print{
            margin-bottom:12px;
            padding:8px 14px;
            border:none;
            border-radius:8px;
            background:#2563eb;
            color:white;
            font-weight:800;
            cursor:pointer;
        }

        .header{
            display:flex;
            justify-content:space-between;
            gap:24px;
            border-bottom:3px solid #2563eb;
            padding-bottom:14px;
        }

        .brand{
            font-size:34px;
            font-weight:900;
            color:#2563eb;
            letter-spacing:1px;
        }

        .subtitle{
            margin-top:3px;
            font-weight:800;
            text-transform:uppercase;
            color:#334155;
        }

        .muted{
            color:#64748b;
            font-size:12px;
            font-weight:700;
        }

        .purchase-no{
            margin:0;
            font-size:25px;
            font-weight:900;
        }

        .grid{
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:12px;
            margin-top:18px;
        }

        .box{
            background:#f8fafc;
            border:1px solid #e2e8f0;
            border-radius:12px;
            padding:14px;
        }

        .box-title{
            font-size:11px;
            color:#64748b;
            text-transform:uppercase;
            font-weight:900;
            margin-bottom:6px;
            letter-spacing:.08em;
        }

        table{
            width:100%;
            border-collapse:collapse;
            margin-top:18px;
        }

        th{
            background:#2563eb;
            color:white;
            padding:10px;
            text-align:left;
            font-size:12px;
            text-transform:uppercase;
        }

        td{
            padding:10px;
            border-bottom:1px solid #e2e8f0;
        }

        .text-right{
            text-align:right;
        }

        .summary{
            width:320px;
            margin-left:auto;
            margin-top:18px;
        }

        .summary-row{
            display:flex;
            justify-content:space-between;
            padding:7px 0;
            border-bottom:1px solid #f1f5f9;
        }

        .grand{
            margin-top:5px;
            padding-top:10px;
            border-top:2px solid #2563eb;
            font-size:22px;
            font-weight:900;
            color:#2563eb;
        }

        .signatures{
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:80px;
            margin-top:35px;
        }

        .signature{
            border-top:1px solid #94a3b8;
            padding-top:8px;
            text-align:center;
            color:#64748b;
            font-weight:800;
        }

        .footer{
            margin-top:25px;
            border-top:1px solid #e2e8f0;
            padding-top:12px;
            text-align:center;
            color:#64748b;
            font-size:11px;
            font-weight:700;
        }

        @media print{

            body{
                background:white;
            }

            .print{
                display:none;
            }

            .invoice{
                padding:0;
                max-width:none;
                min-height:auto;
                box-shadow:none;
            }

            table,tr,td,th{
                page-break-inside:avoid;
            }

        }

    </style>

</head>

<body>

<div class="invoice">

<button class="print" onclick="window.print()">
Print Purchase
</button>

<div class="header">

<div>

<div class="brand">
PHARMEXA
</div>

<div class="subtitle">
Pharmacy ERP Purchase Invoice
</div>

<div class="muted">
Riyadh, Saudi Arabia
</div>

</div>

<div style="text-align:right">

<h2 class="purchase-no">
{{ $purchase->purchase_number }}
</h2>

<div class="muted">
{{ optional($purchase->purchase_date)->format('d M Y') }}
</div>

<div class="muted">
Created By:
{{ $purchase->user->name ?? 'System' }}
</div>

</div>

</div>

<div class="grid">

<div class="box">

<div class="box-title">
Supplier Information
</div>

<strong>{{ $purchase->supplier->name ?? '-' }}</strong><br>

Invoice:
{{ $purchase->supplier_invoice_number ?? '-' }}

</div>

<div class="box">

<div class="box-title">
Purchase Status
</div>

Payment Status:
<strong>{{ ucfirst($purchase->payment_status ?? 'Pending') }}</strong>

Purchase Date:
{{ optional($purchase->purchase_date)->format('d M Y') }}

</div>

</div>

<table>

<thead>

<tr>

<th>#</th>

<th>Medicine</th>

<th>Batch</th>

<th>Expiry</th>

<th class="text-right">Qty</th>

<th class="text-right">Cost</th>

<th class="text-right">Total</th>

</tr>

</thead>

<tbody>

@foreach($purchase->items as $index=>$item)

<tr>

<td>{{ $index+1 }}</td>

<td>
<strong>{{ $item->medicine->name ?? '-' }}</strong>
</td>

<td>{{ $item->batch_number ?? '-' }}</td>

<td>{{ optional($item->expiry_date)->format('d M Y') ?? '-' }}</td>

<td class="text-right">{{ $item->quantity }}</td>

<td class="text-right">
{{ number_format($item->purchase_price,2) }} SAR
</td>

<td class="text-right">
<strong>{{ number_format($item->total,2) }} SAR</strong>
</td>

</tr>

@endforeach

</tbody>

</table>

<div class="summary">

<div class="summary-row">
<span>Subtotal</span>
<strong>{{ number_format($purchase->subtotal,2) }} SAR</strong>
</div>

<div class="summary-row">
<span>Discount</span>
<strong>{{ number_format($purchase->discount,2) }} SAR</strong>
</div>

<div class="summary-row">
<span>Tax</span>
<strong>{{ number_format($purchase->tax,2) }} SAR</strong>
</div>

<div class="summary-row grand">
<span>Total</span>
<span>{{ number_format($purchase->total,2) }} SAR</span>
</div>

<div class="summary-row">
<span>Paid</span>
<strong>{{ number_format($purchase->paid_amount,2) }} SAR</strong>
</div>

<div class="summary-row">
<span>Balance</span>
<strong>{{ number_format($purchase->balance_amount,2) }} SAR</strong>
</div>

</div>

<div class="signatures">

<div class="signature">
Supplier Signature
</div>

<div class="signature">
Authorized Signature
</div>

</div>

<div class="footer">

Purchase Invoice generated by Pharmexa ERP<br>

Printed on {{ now()->format('d M Y, h:i A') }}

</div>

</div>

</body>
</html>