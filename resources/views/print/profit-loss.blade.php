<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <title>Profit & Loss - {{ $pharmacyName ?? ($setting->pharmacy_name ?? ($pharmacy->name ?? 'Pharmacy')) }}</title>

    <style>
        @page {
            size: A4 portrait;
            margin: 16mm 14mm 17mm 14mm;
        }

        * {
            box-sizing: border-box;
        }

        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
        }

        body {
            font-family: DejaVu Sans, Arial, sans-serif;
            background: #ffffff;
            color: #182230;
            font-size: 8.5px;
            line-height: 1.4;
        }

        .report {
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 0;
        }

        /* =========================================================
           PRINT BUTTON
        ========================================================= */

        .print-actions {
            max-width: 182mm;
            margin: 15px auto;
            text-align: right;
        }

        .print-button {
            border: 0;
            background: #047857;
            color: #ffffff;
            font-weight: bold;
            font-size: 12px;
            padding: 10px 22px;
            border-radius: 6px;
            cursor: pointer;
        }

        /* =========================================================
           HEADER
        ========================================================= */

        .top-line {
            width: 100%;
            height: 4px;
            background: #047857;
            margin-bottom: 14px;
        }

        .header-table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
        }

        .header-table td {
            vertical-align: top;
            padding: 0;
        }

        .brand-side {
            width: 52%;
            padding-right: 10px !important;
        }

        .report-side {
            width: 48%;
            text-align: right;
            padding-left: 10px !important;
        }

        .system-name {
            font-size: 7px;
            font-weight: bold;
            letter-spacing: 1.2px;
            color: #047857;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .pharmacy-name {
            margin: 0;
            font-size: 21px;
            line-height: 1.1;
            font-weight: bold;
            color: #111827;
            word-wrap: break-word;
        }

        .report-type {
            margin-top: 5px;
            font-size: 7px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.6px;
        }

        .statement-title {
            font-size: 15px;
            line-height: 1.2;
            font-weight: bold;
            color: #111827;
        }

        .period {
            margin-top: 5px;
            color: #047857;
            font-size: 8px;
            font-weight: bold;
        }

        .generated {
            margin-top: 4px;
            color: #64748b;
            font-size: 6.5px;
        }

        /* =========================================================
           BUSINESS INFORMATION
        ========================================================= */

        .business-info {
            width: 100%;
            margin-top: 13px;
            padding: 8px 10px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
        }

        .business-table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
        }

        .business-table td {
            width: 50%;
            vertical-align: top;
            padding: 2px 4px 2px 0;
            color: #475569;
            font-size: 7.5px;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        .business-table td:last-child {
            text-align: right;
            padding-right: 0;
            padding-left: 5px;
        }

        .business-table strong {
            color: #111827;
        }

        /* =========================================================
           SECTION HEADINGS
        ========================================================= */

        .section {
            width: 100%;
            margin-top: 14px;
        }

        .section-head {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            margin-bottom: 7px;
        }

        .section-head td {
            vertical-align: middle;
            padding: 0;
        }

        .section-number {
            width: 27px;
            color: #047857;
            font-size: 8px;
            font-weight: bold;
        }

        .section-name {
            font-size: 9.5px;
            font-weight: bold;
            color: #111827;
            text-transform: uppercase;
            letter-spacing: 0.45px;
        }

        .section-line {
            height: 1px;
            margin-top: 4px;
            background: #d8e0e8;
        }

        /* =========================================================
           EXECUTIVE SUMMARY
        ========================================================= */

        .summary-table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
        }

        .summary-table td {
            width: 25%;
            vertical-align: top;
            padding: 9px 8px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
        }

        .summary-table td + td {
            border-left: 4px solid #ffffff;
        }

        .summary-table td.sales-card {
            border-top: 3px solid #047857;
        }

        .summary-table td.purchase-card {
            border-top: 3px solid #2563eb;
        }

        .summary-table td.expense-card {
            border-top: 3px solid #dc2626;
        }

        .summary-table td.result-card {
            border-top: 3px solid #111827;
        }

        .summary-label {
            color: #64748b;
            font-size: 6.5px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .summary-value {
            margin-top: 5px;
            font-size: 12px;
            line-height: 1.1;
            font-weight: bold;
            color: #111827;
            white-space: nowrap;
        }

        .summary-currency {
            margin-top: 3px;
            font-size: 6.5px;
            color: #94a3b8;
            font-weight: bold;
        }

        .positive {
            color: #047857 !important;
        }

        .negative {
            color: #dc2626 !important;
        }

        /* =========================================================
           PROFIT & LOSS STATEMENT
        ========================================================= */

        .statement-box {
            width: 100%;
            border: 1px solid #dfe6ec;
        }

        .statement-table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
        }

        .statement-table td {
            padding: 7px 10px;
            border-bottom: 1px solid #edf1f5;
        }

        .statement-table tr:last-child td {
            border-bottom: none;
        }

        .statement-label {
            width: 68%;
            color: #334155;
        }

        .statement-amount {
            width: 32%;
            text-align: right;
            font-weight: bold;
            color: #111827;
            white-space: nowrap;
        }

        .revenue-row td {
            background: #f8fffc;
        }

        .deduction-label {
            padding-left: 24px !important;
            color: #64748b;
        }

        .gross-row td {
            background: #f8fafc;
            font-weight: bold;
            border-top: 1px solid #cbd5e1;
        }

        .net-row td {
            padding-top: 9px;
            padding-bottom: 9px;
            font-size: 10px;
            font-weight: bold;
            border-top: 2px solid #047857;
            background: #ecfdf5;
        }

        .net-row.loss td {
            border-top-color: #dc2626;
            background: #fff5f5;
        }

        /* =========================================================
           ACTIVITY TABLE
        ========================================================= */

        .activity-table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
        }

        .activity-table thead {
            display: table-header-group;
        }

        .activity-table tr {
            page-break-inside: avoid;
        }

        .activity-table th {
            padding: 6px 5px;
            background: #172033;
            color: #ffffff;
            text-align: left;
            font-size: 6.3px;
            text-transform: uppercase;
            letter-spacing: 0.15px;
        }

        .activity-table td {
            padding: 6px 5px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 7.2px;
        }

        .activity-table tbody tr:nth-child(even) td {
            background: #f8fafc;
        }

        .activity-date {
            width: 18%;
            font-weight: bold;
        }

        .activity-day {
            width: 10%;
            color: #64748b;
        }

        .activity-sales {
            width: 17%;
        }

        .activity-purchases {
            width: 18%;
        }

        .activity-expenses {
            width: 17%;
        }

        .activity-result {
            width: 20%;
        }

        .money {
            text-align: right !important;
            white-space: nowrap;
        }

        .muted {
            color: #94a3b8 !important;
        }

        .empty-state {
            text-align: center !important;
            padding: 14px !important;
            color: #94a3b8;
        }

        /* =========================================================
           TRANSACTION DETAILS
        ========================================================= */

        .transaction-group {
            width: 100%;
            margin-top: 9px;
            page-break-inside: auto;
        }

        .transaction-heading {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            margin-bottom: 3px;
        }

        .transaction-heading td {
            padding: 6px 7px;
            background: #f8fafc;
            border-left: 3px solid #047857;
        }

        .transaction-heading.purchase td {
            border-left-color: #2563eb;
        }

        .transaction-heading.expense td {
            border-left-color: #dc2626;
        }

        .transaction-name {
            width: 60%;
            font-size: 8.5px;
            font-weight: bold;
            color: #111827;
        }

        .transaction-note {
            width: 40%;
            text-align: right;
            color: #94a3b8;
            font-size: 6.5px;
        }

        .transaction-table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
        }

        .transaction-table thead {
            display: table-header-group;
        }

        .transaction-table tr {
            page-break-inside: avoid;
        }

        .transaction-table th {
            background: #ffffff;
            border-bottom: 1px solid #cbd5e1;
            padding: 5px 7px;
            color: #64748b;
            text-align: left;
            font-size: 6px;
            text-transform: uppercase;
        }

        .transaction-table td {
            border-bottom: 1px solid #edf1f5;
            padding: 5px 7px;
            font-size: 7.2px;
            word-wrap: break-word;
        }

        .transaction-table th:nth-child(1),
        .transaction-table td:nth-child(1) {
            width: 47%;
        }

        .transaction-table th:nth-child(2),
        .transaction-table td:nth-child(2) {
            width: 25%;
        }

        .transaction-table th:nth-child(3),
        .transaction-table td:nth-child(3) {
            width: 28%;
        }

        .reference {
            font-weight: bold;
            color: #111827;
        }

        .date {
            color: #64748b;
        }

        /* =========================================================
           NOTE
        ========================================================= */

        .report-note {
            width: 100%;
            margin-top: 13px;
            padding: 7px 9px;
            background: #f8fafc;
            border-left: 3px solid #94a3b8;
            color: #64748b;
            font-size: 6.5px;
        }

        /* =========================================================
           FOOTER
        ========================================================= */

        .footer {
            width: 100%;
            margin-top: 14px;
            padding-top: 7px;
            border-top: 1px solid #cbd5e1;
        }

        .footer-table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
        }

        .footer-table td {
            color: #64748b;
            font-size: 6.3px;
            vertical-align: middle;
        }

        .footer-left {
            width: 48%;
        }

        .footer-right {
            width: 52%;
            text-align: right;
        }

        .footer-brand {
            font-weight: bold;
            color: #047857;
        }

        /* =========================================================
           SCREEN
        ========================================================= */

        @media screen {
            body {
                background: #eef2f7;
            }

            .report {
                width: 182mm;
                max-width: 182mm;
                margin: 20px auto 40px auto;
                background: #ffffff;
                padding: 12mm;
                box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
            }
        }

        /* =========================================================
           PRINT / DOMPDF
        ========================================================= */

        @media print {
            .print-actions {
                display: none !important;
            }

            html,
            body {
                width: 100%;
                margin: 0;
                padding: 0;
                background: #ffffff;
            }

            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .report {
                width: 100%;
                max-width: 100%;
                margin: 0;
                padding: 0;
                box-shadow: none;
            }
        }
    </style>
</head>

<body>

@if($printMode ?? false)
    <div class="print-actions">
        <button type="button" class="print-button" onclick="window.print()">
            Print Report
        </button>
    </div>
@endif


@php
    $activeDays = collect($chart)->filter(function ($day) {
        return
            (float) ($day['sales'] ?? 0) != 0 ||
            (float) ($day['purchases'] ?? 0) != 0 ||
            (float) ($day['expenses'] ?? 0) != 0;
    });

    $netProfit = (float) ($stats['netProfit'] ?? 0);
    $grossProfit = (float) ($stats['grossProfit'] ?? 0);
@endphp


<div class="report">

    <div class="top-line"></div>


    {{-- HEADER --}}

    <table class="header-table">
        <tr>

            <td class="brand-side">

                <div class="system-name">
                    Pharmexa ERP
                </div>

                <div class="pharmacy-name">
                    {{ $pharmacyName ?? ($setting->pharmacy_name ?? ($pharmacy->name ?? 'Pharmacy')) }}
                </div>

                <div class="report-type">
                    Pharmacy Financial Management
                </div>

            </td>

            <td class="report-side">

                <div class="statement-title">
                    Profit & Loss Statement
                </div>

                <div class="period">
                    {{ $dateRange['label'] }}
                </div>

                <div class="generated">
                    Generated {{ $generatedAt }}
                </div>

            </td>

        </tr>
    </table>


    {{-- BUSINESS DETAILS --}}

    <div class="business-info">

        <table class="business-table">

            <tr>
                <td>
                    <strong>Owner:</strong>
                    {{ !empty($pharmacy->owner_name) ? $pharmacy->owner_name : '—' }}
                </td>

                <td>
                    @if(!empty($pharmacy->license_number))
                        <strong>License:</strong>
                        {{ $pharmacy->license_number }}
                    @endif
                </td>
            </tr>

            <tr>
                <td>
                    @if(!empty($pharmacy->phone))
                        <strong>Phone:</strong>
                        {{ $pharmacy->phone }}
                    @endif
                </td>

                <td>
                    @if(!empty($pharmacy->email))
                        <strong>Email:</strong>
                        {{ $pharmacy->email }}
                    @endif
                </td>
            </tr>

            @if(
                !empty($pharmacy->address) ||
                !empty($pharmacy->city) ||
                !empty($pharmacy->country)
            )
                <tr>
                    <td colspan="2" style="width:100%; text-align:left;">

                        <strong>Address:</strong>

                        @if(!empty($pharmacy->address))
                            {{ $pharmacy->address }}
                        @endif

                        @if(!empty($pharmacy->city))
                            {{ !empty($pharmacy->address) ? ', ' : '' }}
                            {{ $pharmacy->city }}
                        @endif

                        @if(!empty($pharmacy->country))
                            {{
                                (!empty($pharmacy->address) || !empty($pharmacy->city))
                                    ? ', '
                                    : ''
                            }}
                            {{ $pharmacy->country }}
                        @endif

                    </td>
                </tr>
            @endif

        </table>

    </div>


    {{-- 01 EXECUTIVE SUMMARY --}}

    <div class="section">

        <table class="section-head">
            <tr>
                <td class="section-number">01</td>

                <td>
                    <div class="section-name">
                        Executive Summary
                    </div>

                    <div class="section-line"></div>
                </td>
            </tr>
        </table>


        <table class="summary-table">
            <tr>

                <td class="sales-card">

                    <div class="summary-label">
                        Total Sales
                    </div>

                    <div class="summary-value positive">
                        {{ number_format((float) $stats['sales'], 2) }}
                    </div>

                    <div class="summary-currency">
                        SAR
                    </div>

                </td>


                <td class="purchase-card">

                    <div class="summary-label">
                        Purchases
                    </div>

                    <div class="summary-value">
                        {{ number_format((float) $stats['purchases'], 2) }}
                    </div>

                    <div class="summary-currency">
                        SAR
                    </div>

                </td>


                <td class="expense-card">

                    <div class="summary-label">
                        Expenses
                    </div>

                    <div class="summary-value negative">
                        {{ number_format((float) $stats['expenses'], 2) }}
                    </div>

                    <div class="summary-currency">
                        SAR
                    </div>

                </td>


                <td class="result-card">

                    <div class="summary-label">
                        Net Result
                    </div>

                    <div class="summary-value {{ $netProfit >= 0 ? 'positive' : 'negative' }}">
                        {{ number_format($netProfit, 2) }}
                    </div>

                    <div class="summary-currency">
                        SAR
                    </div>

                </td>

            </tr>
        </table>

    </div>


    {{-- 02 PROFIT & LOSS STATEMENT --}}

    <div class="section">

        <table class="section-head">
            <tr>

                <td class="section-number">
                    02
                </td>

                <td>
                    <div class="section-name">
                        Profit & Loss Statement
                    </div>

                    <div class="section-line"></div>
                </td>

            </tr>
        </table>


        <div class="statement-box">

            <table class="statement-table">

                <tr class="revenue-row">

                    <td class="statement-label">
                        Sales Revenue
                    </td>

                    <td class="statement-amount positive">
                        {{ number_format((float) $stats['sales'], 2) }} SAR
                    </td>

                </tr>


                <tr>

                    <td class="statement-label deduction-label">
                        Less: Purchases
                    </td>

                    <td class="statement-amount">
                        ({{ number_format((float) $stats['purchases'], 2) }}) SAR
                    </td>

                </tr>


                <tr class="gross-row">

                    <td class="statement-label">
                        Gross Profit
                    </td>

                    <td class="statement-amount {{ $grossProfit >= 0 ? 'positive' : 'negative' }}">
                        {{ number_format($grossProfit, 2) }} SAR
                    </td>

                </tr>


                <tr>

                    <td class="statement-label deduction-label">
                        Less: Operating Expenses
                    </td>

                    <td class="statement-amount negative">
                        ({{ number_format((float) $stats['expenses'], 2) }}) SAR
                    </td>

                </tr>


                <tr class="net-row {{ $netProfit < 0 ? 'loss' : '' }}">

                    <td>
                        NET {{ $netProfit >= 0 ? 'PROFIT' : 'LOSS' }}
                    </td>

                    <td class="statement-amount {{ $netProfit >= 0 ? 'positive' : 'negative' }}">
                        {{ number_format($netProfit, 2) }} SAR
                    </td>

                </tr>

            </table>

        </div>

    </div>


    {{-- 03 PERIOD ACTIVITY --}}

    <div class="section">

        <table class="section-head">
            <tr>

                <td class="section-number">
                    03
                </td>

                <td>
                    <div class="section-name">
                        Period Activity
                    </div>

                    <div class="section-line"></div>
                </td>

            </tr>
        </table>


        <table class="activity-table">

            <thead>
                <tr>

                    <th class="activity-date">
                        Date
                    </th>

                    <th class="activity-day">
                        Day
                    </th>

                    <th class="money activity-sales">
                        Sales
                    </th>

                    <th class="money activity-purchases">
                        Purchases
                    </th>

                    <th class="money activity-expenses">
                        Expenses
                    </th>

                    <th class="money activity-result">
                        Result
                    </th>

                </tr>
            </thead>


            <tbody>

                @forelse($activeDays as $day)

                    <tr>

                        <td class="activity-date">
                            {{ \Carbon\Carbon::parse($day['date'])->format('d M Y') }}
                        </td>

                        <td class="activity-day">
                            {{ $day['day'] }}
                        </td>

                        <td class="money activity-sales {{ (float) $day['sales'] > 0 ? 'positive' : 'muted' }}">

                            @if((float) $day['sales'] != 0)
                                {{ number_format((float) $day['sales'], 2) }}
                            @else
                                —
                            @endif

                        </td>

                        <td class="money activity-purchases {{ (float) $day['purchases'] == 0 ? 'muted' : '' }}">

                            @if((float) $day['purchases'] != 0)
                                {{ number_format((float) $day['purchases'], 2) }}
                            @else
                                —
                            @endif

                        </td>

                        <td class="money activity-expenses {{ (float) $day['expenses'] > 0 ? 'negative' : 'muted' }}">

                            @if((float) $day['expenses'] != 0)
                                {{ number_format((float) $day['expenses'], 2) }}
                            @else
                                —
                            @endif

                        </td>

                        <td class="money activity-result {{ (float) $day['profit'] >= 0 ? 'positive' : 'negative' }}">
                            {{ number_format((float) $day['profit'], 2) }} SAR
                        </td>

                    </tr>

                @empty

                    <tr>
                        <td colspan="6" class="empty-state">
                            No financial activity found for the selected period.
                        </td>
                    </tr>

                @endforelse

            </tbody>

        </table>

    </div>


    {{-- 04 TRANSACTION DETAILS --}}

    <div class="section">

        <table class="section-head">
            <tr>

                <td class="section-number">
                    04
                </td>

                <td>
                    <div class="section-name">
                        Transaction Details
                    </div>

                    <div class="section-line"></div>
                </td>

            </tr>
        </table>


        {{-- SALES --}}

        <div class="transaction-group">

            <table class="transaction-heading">
                <tr>

                    <td class="transaction-name">
                        Recent Sales
                    </td>

                    <td class="transaction-note">
                        {{ count($recentSales) }} record(s)
                    </td>

                </tr>
            </table>


            <table class="transaction-table">

                <thead>
                    <tr>
                        <th>Invoice</th>
                        <th>Date</th>
                        <th class="money">Amount</th>
                    </tr>
                </thead>

                <tbody>

                    @forelse($recentSales as $sale)

                        <tr>

                            <td class="reference">
                                {{ $sale->invoice_number ?? 'Sale #' . $sale->id }}
                            </td>

                            <td class="date">
                                {{ optional($sale->created_at)->format('d M Y') }}
                            </td>

                            <td class="money positive">
                                {{ number_format((float) $sale->total, 2) }} SAR
                            </td>

                        </tr>

                    @empty

                        <tr>
                            <td colspan="3" class="empty-state">
                                No sales found for this period.
                            </td>
                        </tr>

                    @endforelse

                </tbody>

            </table>

        </div>


        {{-- PURCHASES --}}

        <div class="transaction-group">

            <table class="transaction-heading purchase">
                <tr>

                    <td class="transaction-name">
                        Recent Purchases
                    </td>

                    <td class="transaction-note">
                        {{ count($recentPurchases) }} record(s)
                    </td>

                </tr>
            </table>


            <table class="transaction-table">

                <thead>
                    <tr>
                        <th>Purchase</th>
                        <th>Date</th>
                        <th class="money">Amount</th>
                    </tr>
                </thead>

                <tbody>

                    @forelse($recentPurchases as $purchase)

                        <tr>

                            <td class="reference">
                                {{ $purchase->purchase_number ?? 'Purchase #' . $purchase->id }}
                            </td>

                            <td class="date">
                                {{ optional($purchase->created_at)->format('d M Y') }}
                            </td>

                            <td class="money">
                                {{ number_format((float) $purchase->total, 2) }} SAR
                            </td>

                        </tr>

                    @empty

                        <tr>
                            <td colspan="3" class="empty-state">
                                No purchases found for this period.
                            </td>
                        </tr>

                    @endforelse

                </tbody>

            </table>

        </div>


        {{-- EXPENSES --}}

        <div class="transaction-group">

            <table class="transaction-heading expense">
                <tr>

                    <td class="transaction-name">
                        Recent Expenses
                    </td>

                    <td class="transaction-note">
                        {{ count($recentExpenses) }} record(s)
                    </td>

                </tr>
            </table>


            <table class="transaction-table">

                <thead>
                    <tr>
                        <th>Expense</th>
                        <th>Date</th>
                        <th class="money">Amount</th>
                    </tr>
                </thead>

                <tbody>

                    @forelse($recentExpenses as $expense)

                        <tr>

                            <td class="reference">
                                {{
                                    $expense->title
                                    ?? $expense->expense_number
                                    ?? 'Expense #' . $expense->id
                                }}
                            </td>

                            <td class="date">
                                {{ \Carbon\Carbon::parse($expense->expense_date)->format('d M Y') }}
                            </td>

                            <td class="money negative">
                                {{ number_format((float) $expense->amount, 2) }} SAR
                            </td>

                        </tr>

                    @empty

                        <tr>
                            <td colspan="3" class="empty-state">
                                No expenses found for this period.
                            </td>
                        </tr>

                    @endforelse

                </tbody>

            </table>

        </div>

    </div>


    {{-- REPORT NOTE --}}

    <div class="report-note">
        This financial statement was generated automatically by Pharmexa ERP
        for the reporting period {{ $dateRange['label'] }}.
    </div>


    {{-- FOOTER --}}

    <div class="footer">

        <table class="footer-table">
            <tr>

                <td class="footer-left">
                    <span class="footer-brand">PHARMEXA ERP</span>
                    &nbsp;•&nbsp; Financial Management
                </td>

                <td class="footer-right">
                    Confidential Financial Report
                    &nbsp;•&nbsp;
                    {{ $generatedAt }}
                </td>

            </tr>
        </table>

    </div>

</div>

</body>
</html>