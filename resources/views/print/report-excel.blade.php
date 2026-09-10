<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $pharmacyName }} Report</title>
    <style>
        body { font-family: Arial, sans-serif; }
        h1 { font-size: 22px; }
        h2 { margin-top: 24px; }
        table { border-collapse: collapse; width: 100%; }
        th { background: #dbeafe; font-weight: bold; }
        th, td { border: 1px solid #cbd5e1; padding: 7px; }
        .amount { text-align: right; }
    </style>
</head>
<body>
    <h1>{{ $pharmacyName }}</h1>
    <p><strong>Pharmexa ERP Report</strong></p>
    <p>Period: {{ $reportPeriod['label'] }}</p>
    <p>Generated: {{ now()->format('d M Y h:i A') }}</p>

    <table>
        <tr>
            <th>Metric</th>
            <th>Value</th>
        </tr>
        <tr><td>Sales</td><td>{{ number_format($totalSales, 2) }} SAR</td></tr>
        <tr><td>Purchases</td><td>{{ number_format($totalPurchases, 2) }} SAR</td></tr>
        <tr><td>Gross Profit</td><td>{{ number_format($grossProfit, 2) }} SAR</td></tr>
        <tr><td>Inventory Value</td><td>{{ number_format($inventoryValue, 2) }} SAR</td></tr>
        <tr><td>Transactions</td><td>{{ $totalInvoices }}</td></tr>
        <tr><td>Low Stock</td><td>{{ $lowStock }}</td></tr>
        <tr><td>Expired</td><td>{{ $expired }}</td></tr>
    </table>

    <h2>Sales Transactions</h2>
    <table>
        <tr>
            <th>Invoice</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Date</th>
        </tr>
        @foreach($recentSales as $sale)
            <tr>
                <td>{{ $sale->invoice_number }}</td>
                <td>{{ $sale->customer_name ?: 'Walk-in Customer' }}</td>
                <td class="amount">{{ number_format((float) $sale->total, 2) }} SAR</td>
                <td class="amount">{{ number_format((float) $sale->paid_amount, 2) }} SAR</td>
                <td>{{ optional($sale->created_at)->format('d/m/Y') }}</td>
            </tr>
        @endforeach
    </table>

    <h2>Purchase Transactions</h2>
    <table>
        <tr>
            <th>Reference</th>
            <th>Supplier</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Date</th>
        </tr>
        @foreach($recentPurchases as $purchase)
            <tr>
                <td>
                    {{ $purchase->purchase_number
                        ?? $purchase->reference_number
                        ?? $purchase->id }}
                </td>
                <td>{{ $purchase->supplier?->name ?? 'Supplier' }}</td>
                <td class="amount">{{ number_format((float) $purchase->total, 2) }} SAR</td>
                <td class="amount">{{ number_format((float) $purchase->paid_amount, 2) }} SAR</td>
                <td>{{ optional($purchase->created_at)->format('d/m/Y') }}</td>
            </tr>
        @endforeach
    </table>
</body>
</html>
