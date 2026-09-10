<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<title>Medicine Label</title>

<style>

@page{
    size:58mm auto;
    margin:2mm;
}

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:Arial,Helvetica,sans-serif;
    background:#fff;
    color:#000;
    font-size:10px;
}

.sticker{
    width:54mm;
    margin:auto;
    padding:2mm;
}

.header{
    text-align:center;
    border-bottom:1px solid #000;
    padding-bottom:4px;
    margin-bottom:5px;
}

.pharmacy{
    font-size:15px;
    font-weight:900;
    text-transform:uppercase;
}

.pharmacy-ar{
    font-size:10px;
    direction:rtl;
    font-weight:bold;
    margin-top:2px;
}

.subtitle{
    font-size:9px;
    color:#555;
    margin-top:2px;
}

.medicine{
    text-align:center;
    font-size:15px;
    font-weight:900;
    margin:6px 0 2px;
    line-height:18px;
}

.medicine-ar{
    text-align:center;
    direction:rtl;
    font-size:11px;
    font-weight:bold;
    margin-bottom:5px;
}

.line{
    border-top:1px dashed #999;
    margin:5px 0;
}

.row{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    margin:3px 0;
}

.label{
    width:40%;
    font-size:9px;
    font-weight:bold;
    color:#444;
}

.value{
    width:60%;
    text-align:right;
    font-size:10px;
    font-weight:bold;
}

.box{
    border:1px solid #000;
    border-radius:4px;
    padding:5px;
    margin-top:5px;
}

.dose{
    text-align:center;
    font-size:18px;
    font-weight:900;
}

.dose-text{
    text-align:center;
    font-size:10px;
    margin-top:3px;
}

.notes{
    font-size:10px;
    line-height:14px;
}

.footer{
    margin-top:6px;
    border-top:1px solid #000;
    padding-top:5px;
    font-size:9px;
}

.footer-row{
    display:flex;
    justify-content:space-between;
    margin:2px 0;
}

.print-btn{
    width:100%;
    margin-top:8px;
    padding:8px;
    background:#16a34a;
    color:#fff;
    border:none;
    border-radius:4px;
    font-weight:bold;
    cursor:pointer;
}

@media print{

.print-btn{
    display:none;
}

}

</style>

</head>

<body>

<div class="sticker">

<div class="header">

<div class="pharmacy">
{{ $setting->pharmacy_name }}
</div>

@if(!empty($setting->pharmacy_name_ar))
<div class="pharmacy-ar">
{{ $setting->pharmacy_name_ar }}
</div>
@endif

<div class="subtitle">
Medication Label | ملصق الدواء
</div>

</div>

<div class="medicine">
{{ $item->medicine_name }}
</div>

@if($item->medicine && !empty($item->medicine->medicine_name_ar))
<div class="medicine-ar">
{{ $item->medicine->medicine_name_ar }}
</div>
@elseif($item->medicine && !empty($item->medicine->generic_name_ar))
<div class="medicine-ar">
{{ $item->medicine->generic_name_ar }}
</div>
@endif

<div class="line"></div>

@if($setting->show_patient_name)

<div class="row">
<div class="label">
Patient<br>المريض
</div>

<div class="value">
{{ $item->sale->customer->name ?? 'Walk-in Customer' }}
</div>
</div>

@endif

<div class="row">
<div class="label">
Quantity<br>الكمية
</div>

<div class="value">
{{ $item->quantity }}
</div>
</div>
<div class="box">

<div class="dose">
{{ $item->dosage }}
</div>

<div class="dose-text">
Dosage / الجرعة
</div>

</div>

<div class="row">

<div class="label">
Time<br>الوقت
</div>

<div class="value">
{{ $time['en'] }}

@if(!empty($time['ar']))
<br>
<span style="font-size:9px;direction:rtl;">
{{ $time['ar'] }}
</span>
@endif

</div>

</div>

<div class="row">

<div class="label">
Food<br>الطعام
</div>

<div class="value">
{{ $food['en'] }}

@if(!empty($food['ar']))
<br>
<span style="font-size:9px;direction:rtl;">
{{ $food['ar'] }}
</span>
@endif

</div>

</div>

<div class="row">

<div class="label">
Duration<br>المدة
</div>

<div class="value">
{{ $item->duration }}
</div>

</div>

@if($setting->show_expiry_date && $item->medicine && $item->medicine->expiry_date)

<div class="row">

<div class="label">
Expiry<br>تاريخ الانتهاء
</div>

<div class="value">
{{ \Carbon\Carbon::parse($item->medicine->expiry_date)->format('d-m-Y') }}
</div>

</div>

@endif

@if(!empty($item->notes))

<div class="box">

<div style="font-weight:bold;margin-bottom:3px;">
Notes / ملاحظات
</div>

<div class="notes">
{{ $item->notes }}
</div>

</div>

@endif
<div class="footer">

<div class="footer-row">

<span>
<strong>Invoice / الفاتورة</strong>
</span>

<span>
{{ $item->sale->invoice_number }}
</span>

</div>

<div class="footer-row">

<span>
<strong>Pharmacist / الصيدلي</strong>
</span>

<span>
{{ $item->sale->user->name }}
</span>

</div>

<div class="footer-row">

<span>
<strong>Date / التاريخ</strong>
</span>

<span>
{{ $item->sale->created_at->format('d-m-Y H:i') }}
</span>

</div>

</div>

<button
type="button"
class="print-btn"
onclick="window.print()">
🖨 Print Label | طباعة الملصق
</button>

</div>

</body>

</html>