<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{{ $pharmacyName }} - Pharmexa Report</title>

    <style>
        @page {
            margin: 28px 30px;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            color: #0f172a;
            background: #ffffff;
            font-family: DejaVu Sans, Arial, sans-serif;
            font-size: 10px;
            line-height: 1.45;
        }

        .header {
            border-bottom: 2px solid #0f172a;
            padding-bottom: 14px;
            margin-bottom: 18px;
        }

        .brand {
            font-size: 10px;
            font-weight: 700;
            color: #2563eb;
            text-transform: uppercase;
            letter-spacing: 1.1px;
            margin-bottom: 4px;
        }

        h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 800;
        }

        .address {
            margin-top: 4px;
            color: #64748b;
            font-size: 9px;
        }

        .period {
            margin-top: 8px;
            font-size: 10px;
            font-weight: 700;
        }

        .grid {
            width: 100%;
            border-collapse: separate;
            border-spacing: 7px;
            margin: -7px;
            margin-bottom: 10px;
        }

        .grid td {
            width: 33.33%;
            vertical-align: top;
        }

        .card {
            border: 1px solid #dbe3ee;
            border-radius: 8px;
            padding: 10px;
            min-height: 66px;
        }

        .label {
            color: #64748b;
            text-transform: uppercase;
            font-size: 8px;
            font-weight: 700;
            letter-spacing: .35px;
        }

        .value {
            margin-top: 5px;
            color: #0f172a;
            font-size: 14px;
            font-weight: 800;
        }

        .section {
            margin-top: 18px;
        }

        .section-title {
            font-size: 13px;
            font-weight: 800;
            padding-bottom: 7px;
            border-bottom: 1px solid #cbd5e1;
            margin-bottom: 7px;
        }

        table.data {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
        }

        table.data th {
            text-align: left;
            background: #f1f5f9;
            color: #475569;
            font-size: 8px;
            font-weight: 800;
            text-transform: uppercase;
            padding: 7px;
            border-bottom: 1px solid #cbd5e1;
        }

        table.data td {
            padding: 7px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 9px;
        }

        .right {
            text-align: right !important;
        }

        .money {
            font-weight: 800;
        }

        .green {
            color: #059669;
        }

        .muted {
            color: #64748b;
        }

        .empty {
            padding: 14px;
            text-align: center;
            color: #94a3b8;
            border: 1px solid #e2e8f0;
        }

        .footer {
            margin-top: 25px;
            padding-top: 10px;
            border-top: 1px solid #cbd5e1;
            text-align: center;
            color: #64748b;
            font-size: 8px;
        }

        .footer strong {
            color: #0f172a;
        }
    </style>
</head>

<body>

    <div class="header">
        <div class="brand">Pharmexa Reports</div>

        <h1>{{ $pharmacyName ?: 'Pharmacy' }}</h1>

        @php
            $location = collect([
                $pharmacyCity ?? '',
                $pharmacyAddress ?? '',
                $pharmacyCountry ?? '',
            ])->filter()->implode(', ');
        @endphp

        @if($location)
            <div class="address">{{ $location }}</div>
        @endif

        <div class="period">
            {{ $periodLabel ?? 'Current Reporting Period' }}
        </div>
    </div>

    <table class="grid">
        <tr>
            <td>
                <div class="card">
                    <div class="label">Sales</div>
                    <div class="value">
                        {{ number_format($totalSales ?? 0, 2) }} {{ $currency ?? 'SAR' }}
                    </div>
                </div>
            </td>

            <td>
                <div class="card">
                    <div class="label">Purchases</div>
                    <div class="value">
                        {{ number_format($totalPurchases ?? 0, 2) }} {{ $currency ?? 'SAR' }}
                    </div>
                </div>
            </td>

            <td>
                <div class="card">
                    <div class="label">Gross Profit</div>
                    <div class="value green">
                        {{ number_format($grossProfit ?? 0, 2) }} {{ $currency ?? 'SAR' }}
                    </div>
                </div>
            </td>
        </tr>

        <tr>
            <td>
                <div class="card">
                    <div class="label">Transactions</div>
                    <div class="value">{{ $totalInvoices ?? 0 }}</div>
                </div>
            </td>

            <td>
                <div class="card">
                    <div class="label">Low Stock</div>
                    <div class="value">{{ $lowStock ?? 0 }}</div>
                </div>
            </td>

            <td>
                <div class="card">
                    <div class="label">Expired</div>
                    <div class="value">{{ $expired ?? 0 }}</div>
                </div>
            </td>
        </tr>
    </table>

    <div class="section">
        <div class="section-title">Inventory Summary</div>

        <table class="data">
            <thead>
                <tr>
                    <th>Active Products</th>
                    <th>Inventory Value</th>
                    <th>Low Stock</th>
                    <th>Expired</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>{{ $totalMedicines ?? 0 }}</td>
                    <td class="money">
                        {{ number_format($inventoryValue ?? 0, 2) }} {{ $currency ?? 'SAR' }}
                    </td>
                    <td>{{ $lowStock ?? 0 }}</td>
                    <td>{{ $expired ?? 0 }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Recent Sales</div>

        @if(isset($recentSales) && $recentSales->count())
            <table class="data">
                <thead>
                    <tr>
                        <th>Invoice</th>
                        <th>Customer</th>
                        <th class="right">Total</th>
                        <th class="right">Date</th>
                    </tr>
                </thead>

                <tbody>
                    @foreach($recentSales as $sale)
                        @php
                            $customer =
                                $sale->customer_name
                                ?? optional($sale->customer)->name
                                ?? 'Walk-in Customer';

                            $invoice =
                                $sale->invoice_number
                                ?? $sale->reference_number
                                ?? ('#' . $sale->id);
                        @endphp

                        <tr>
                            <td><strong>{{ $invoice }}</strong></td>
                            <td>{{ $customer }}</td>
                            <td class="right money green">
                                {{ number_format($sale->total ?? 0, 2) }}
                                {{ $currency ?? 'SAR' }}
                            </td>
                            <td class="right muted">
                                {{ optional($sale->created_at)->format('d/m/Y') }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <div class="empty">No sales records found for this period.</div>
        @endif
    </div>

    <div class="section">
        <div class="section-title">Recent Purchases</div>

        @if(isset($recentPurchases) && $recentPurchases->count())
            <table class="data">
                <thead>
                    <tr>
                        <th>Reference</th>
                        <th>Supplier</th>
                        <th class="right">Total</th>
                        <th class="right">Date</th>
                    </tr>
                </thead>

                <tbody>
                    @foreach($recentPurchases as $purchase)
                        @php
                            $supplier = optional($purchase->supplier)->name ?? 'Supplier';

                            $reference =
                                $purchase->reference_number
                                ?? $purchase->invoice_number
                                ?? ('#' . $purchase->id);
                        @endphp

                        <tr>
                            <td><strong>{{ $reference }}</strong></td>
                            <td>{{ $supplier }}</td>
                            <td class="right money green">
                                {{ number_format($purchase->total ?? 0, 2) }}
                                {{ $currency ?? 'SAR' }}
                            </td>
                            <td class="right muted">
                                {{ optional($purchase->created_at)->format('d/m/Y') }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <div class="empty">No purchase records found for this period.</div>
        @endif
    </div>

    <div class="footer">
        <strong>Pharmexa ERP v1.0</strong><br>
        &copy; {{ now()->year }} All Rights Reserved<br>
        Powered by Jibran Umar — Software Engineer &amp; ERP Developer
    </div>

    @if(request()->query('format') === 'print')
        <script>
            window.addEventListener('load', function () {
                setTimeout(function () {
                    window.print();
                }, 250);
            });
        </script>
    @endif

</body>
</html>
