<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{{ $sale->invoice_number }}</title>

<style>

@page{
    size:80mm auto;
    margin:2mm;
}

*{
    box-sizing:border-box;
}

body{
    margin:0;
    padding:0;
    font-family:Arial,Helvetica,sans-serif;
    background:#ffffff;
    color:#000;
    font-size:11px;
}

.receipt{
    width:76mm;
    margin:auto;
    padding:3mm;
}

.center{
    text-align:center;
}

.title{
    font-size:20px;
    font-weight:bold;
    letter-spacing:1px;
}

.arabic{
    direction:rtl;
    font-weight:bold;
}

.small{
    font-size:10px;
}

.tiny{
    font-size:9px;
}

.bold{
    font-weight:bold;
}

.line{
    border-top:1px dashed #000;
    margin:6px 0;
}

.info-row{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    margin:2px 0;
}

.items{
    width:100%;
    border-collapse:collapse;
    margin-top:4px;
}

.items th{
    border-bottom:1px solid #000;
    padding:3px 1px;
    font-size:10px;
    text-align:left;
}

.items td{
    padding:3px 1px;
    border-bottom:1px dotted #bbb;
    vertical-align:top;
    font-size:10px;
}

.right{
    text-align:right;
}

.total{
    font-size:14px;
    font-weight:bold;
}

.barcode{
    margin:10px auto 6px;
    text-align:center;
}

.barcode img,
.barcode svg,
.barcode div{
    display:block;
    margin:0 auto;
    max-width:68mm;
    height:35px;
    overflow:hidden;
}

.barcode table{
    margin:0 auto !important;
}

.barcode td{
    padding:0 !important;
}

.qr{
    margin-top:8px;
}

.qr img{
    width:90px;
    height:90px;
}

.footer{
    text-align:center;
    margin-top:8px;
    font-size:10px;
}

.print-btn{
    width:100%;
    margin-top:12px;
    padding:10px;
    font-size:15px;
    font-weight:bold;
    cursor:pointer;
}

@media print{

.print-btn{
display:none;
}

body{
margin:0;
padding:0;
}

.receipt{
width:76mm;
page-break-after:auto;
}

table,
tr,
td{
page-break-inside:avoid;
}

}

</style>

</head>

<body>

<div class="receipt">

<div class="center">

<div class="title">
{{ $setting->pharmacy_name }}
</div>

@if(!empty($setting->pharmacy_name_ar))
<div class="arabic">
{{ $setting->pharmacy_name_ar }}
</div>
@endif

<div class="small bold">
Tax Invoice
</div>

<div class="arabic tiny">
فاتورة ضريبية مبسطة
</div>

@if(!empty($setting->city))
<div class="tiny">
{{ $setting->city }}
</div>
@endif

</div>
<div class="line"></div>

<div class="info-row">
<div>
<b>Invoice</b><br>
<span class="arabic">رقم الفاتورة</span>
</div>

<div class="right">
{{ $sale->invoice_number }}
</div>
</div>

<div class="info-row">
<div>
<b>Date</b><br>
<span class="arabic">التاريخ</span>
</div>

<div class="right">
{{ $sale->created_at->format('d-m-Y H:i') }}
</div>
</div>

<div class="info-row">
<div>
<b>Customer</b><br>
<span class="arabic">العميل</span>
</div>

<div class="right">
{{ $sale->customer->name ?? $sale->customer_name ?? 'Walk-in Customer' }}
</div>
</div>

<div class="info-row">
<div>
<b>Cashier</b><br>
<span class="arabic">الكاشير</span>
</div>

<div class="right">
{{ $sale->user->name ?? 'System' }}
</div>
</div>

<div class="info-row">
<div>
<b>Payment</b><br>
<span class="arabic">طريقة الدفع</span>
</div>

<div class="right">
{{ ucfirst($sale->payment_method) }}
</div>
</div>

<div class="line"></div>

<table class="items">

<thead>

<tr>
<th>Medicine<br><span class="arabic">الدواء</span></th>
<th class="right">Qty<br><span class="arabic">الكمية</span></th>
<th class="right">Price<br><span class="arabic">السعر</span></th>
<th class="right">Total<br><span class="arabic">الإجمالي</span></th>
</tr>

</thead>

<tbody>

@foreach($sale->items as $item)

<tr>

<td>

<strong>

{{ $item->medicine_name }}

</strong>

</td>

<td class="right">

{{ $item->quantity }}

</td>

<td class="right">

{{ number_format($item->unit_price,2) }}

</td>

<td class="right">

{{ number_format($item->total_price,2) }}

</td>

</tr>

@endforeach

</tbody>

</table>

<div class="line"></div>

<div class="info-row">

<div>
Subtotal
<br>
<span class="arabic">المجموع</span>
</div>

<div class="right bold">
{{ number_format($sale->subtotal,2) }} SAR
</div>

</div>

<div class="info-row">

<div>
Discount
<br>
<span class="arabic">الخصم</span>
</div>

<div class="right bold">
{{ number_format($sale->discount,2) }} SAR
</div>

</div>

<div class="info-row">

<div>
VAT
<br>
<span class="arabic">الضريبة</span>
</div>

<div class="right bold">
{{ number_format($sale->tax,2) }} SAR
</div>

</div>

<div class="line"></div>

<div class="info-row total">

<div>
TOTAL
<br>
<span class="arabic">الإجمالي</span>
</div>

<div>
{{ number_format($sale->total,2) }} SAR
</div>

</div>

<div class="line"></div>

<div class="info-row">

<div>
Paid
<br>
<span class="arabic">المدفوع</span>
</div>

<div class="right bold">
{{ number_format($sale->paid_amount,2) }} SAR
</div>

</div>

<div class="info-row">

<div>
Change
<br>
<span class="arabic">الباقي</span>
</div>

<div class="right bold">
{{ number_format($sale->change_amount,2) }} SAR
</div>

</div>

<div class="line"></div>

<div class="center barcode">

{!! $barcode !!}

<div class="tiny">
{{ $sale->invoice_number }}
</div>

</div>

<div class="center qr">
    <img src="{{ $qr }}" alt="Invoice QR">
</div>
<div class="footer">

<strong>
{{ $setting->receipt_footer ?: 'Thank You For Visiting' }}
</strong>

<br>

<span class="arabic">
{{ $setting->receipt_footer_ar ?: 'شكراً لزيارتكم' }}
</span>

</div>
<button
class="print-btn"
onclick="window.print()"
>
🖨 Print Receipt
</button>

<script>

window.onload = function () {

    if (window.location.search.includes("autoprint=1")) {

        setTimeout(function () {

            window.print();

        },500);

    }

};

window.onafterprint = function () {

    // Future:
    // window.close();

};

</script>

</div>

</body>

</html>