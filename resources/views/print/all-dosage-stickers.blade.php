<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dosage Labels</title>

<style>

body{
    margin:20px;
    font-family:Arial,Helvetica,sans-serif;
    background:#f5f5f5;
}

.header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:20px;
}

h2{
    margin:0;
}

button{
    padding:10px 20px;
    font-size:15px;
    font-weight:bold;
    cursor:pointer;
    border:none;
    border-radius:6px;
    background:#16a34a;
    color:#fff;
}

.labels{
    display:flex;
    flex-wrap:wrap;
    gap:12px;
}

.label{
    width:58mm;
    background:#fff;
    border:1px solid #ccc;
    padding:0;
}

iframe{
    width:100%;
    height:320px;
    border:none;
}

@media print{

button,
.header{
    display:none;
}

body{
    background:#fff;
    margin:0;
}

.labels{
    display:block;
}

.label{
    border:none;
    page-break-after:always;
}

.label:last-child{
    page-break-after:auto;
}

}

</style>

</head>

<body>

<div class="header">

    <div>
        <h2>Dosage Labels</h2>
        <div>Invoice : {{ $sale->invoice_number }}</div>
        <div>Customer : {{ $sale->customer->name ?? 'Walk-in Customer' }}</div>
    </div>

    <button onclick="window.print()">
        🖨 Print All
    </button>

</div>

<div class="labels">

@foreach($sale->items as $item)

<div class="label">

<iframe
src="{{ route('print.dosage-sticker',$item->id) }}">
</iframe>

</div>

@endforeach

</div>

</body>
</html>