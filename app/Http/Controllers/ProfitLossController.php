<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Pharmacy;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProfitLossController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    public function index(Request $request): Response
    {
        $data = $this->buildReportData($request);

        return Inertia::render(
            'Finance/ProfitLoss/Index',
            $data
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Printable Report
    |--------------------------------------------------------------------------
    */

    public function print(Request $request): HttpResponse
    {
        $data = $this->buildReportData($request);

        return response()->view(
            'print.profit-loss',
            array_merge($data, [
                'printMode' => true,
            ])
        );
    }

    /*
    |--------------------------------------------------------------------------
    | PDF Download
    |--------------------------------------------------------------------------
    */

    public function pdf(Request $request)
    {
        $data = $this->buildReportData($request);

        $pdf = Pdf::loadView(
            'print.profit-loss',
            array_merge($data, [
                'printMode' => false,
            ])
        )->setPaper('a4', 'portrait');

        /*
        |--------------------------------------------------------------------------
        | PDF Filename
        |--------------------------------------------------------------------------
        | Use the pharmacy name from Settings.
        */

        $pharmacyName = preg_replace(
            '/[^A-Za-z0-9\-]+/',
            '-',
            $data['pharmacyName'] ?? 'Pharmacy'
        );

        $fileName =
            'Profit-Loss-' .
            trim($pharmacyName, '-') .
            '-' .
            $data['dateRange']['from'] .
            '-to-' .
            $data['dateRange']['to'] .
            '.pdf';

        return $pdf->download($fileName);
    }

    /*
    |--------------------------------------------------------------------------
    | Shared Financial Report Data
    |--------------------------------------------------------------------------
    */

    private function buildReportData(Request $request): array
    {
        /*
        |--------------------------------------------------------------------------
        | Current Pharmacy
        |--------------------------------------------------------------------------
        */

        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $pharmacy = Pharmacy::findOrFail($pharmacyId);

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Settings
        |--------------------------------------------------------------------------
        |
        | The pharmacy-specific Settings record is the primary source for
        | the displayed pharmacy name.
        |
        */

        $setting = Setting::where(
            'pharmacy_id',
            $pharmacyId
        )->first();

        /*
        |--------------------------------------------------------------------------
        | Display Pharmacy Name
        |--------------------------------------------------------------------------
        |
        | Priority:
        |
        | 1. Settings → pharmacy_name
        | 2. Pharmacy master name
        | 3. Generic "Pharmacy"
        |
        */

        $pharmacyName =
            $setting?->pharmacy_name
            ?: $pharmacy->name
            ?: 'Pharmacy';

        /*
        |--------------------------------------------------------------------------
        | Resolve Date Filter
        |--------------------------------------------------------------------------
        */

        $allowedFilters = [
            'Today',
            'This Week',
            'This Month',
            'This Year',
            'Custom',
        ];

        $filter = $request->get(
            'filter',
            'This Month'
        );

        if (! in_array(
            $filter,
            $allowedFilters,
            true
        )) {
            $filter = 'This Month';
        }

        /*
        |--------------------------------------------------------------------------
        | Date Range
        |--------------------------------------------------------------------------
        */

        switch ($filter) {

            case 'Today':

                $startDate = now()
                    ->copy()
                    ->startOfDay();

                $endDate = now()
                    ->copy()
                    ->endOfDay();

                break;

            case 'This Week':

                $startDate = now()
                    ->copy()
                    ->startOfWeek();

                $endDate = now()
                    ->copy()
                    ->endOfWeek();

                break;

            case 'This Year':

                $startDate = now()
                    ->copy()
                    ->startOfYear();

                $endDate = now()
                    ->copy()
                    ->endOfYear();

                break;

            case 'Custom':

                $request->validate([
                    'from' => [
                        'required',
                        'date',
                    ],

                    'to' => [
                        'required',
                        'date',
                        'after_or_equal:from',
                    ],
                ]);

                $startDate = Carbon::parse(
                    $request->from
                )->startOfDay();

                $endDate = Carbon::parse(
                    $request->to
                )->endOfDay();

                break;

            case 'This Month':

            default:

                $startDate = now()
                    ->copy()
                    ->startOfMonth();

                $endDate = now()
                    ->copy()
                    ->endOfMonth();

                break;
        }

        /*
        |--------------------------------------------------------------------------
        | Main Statistics
        |--------------------------------------------------------------------------
        */

        $sales = Sale::query()
            ->where(
                'pharmacy_id',
                $pharmacyId
            )
            ->whereBetween(
                'created_at',
                [
                    $startDate,
                    $endDate,
                ]
            )
            ->sum('total');

        $purchases = Purchase::query()
            ->where(
                'pharmacy_id',
                $pharmacyId
            )
            ->whereBetween(
                'created_at',
                [
                    $startDate,
                    $endDate,
                ]
            )
            ->sum('total');

        $expenses = Expense::query()
            ->where(
                'pharmacy_id',
                $pharmacyId
            )
            ->whereBetween(
                'expense_date',
                [
                    $startDate->toDateString(),
                    $endDate->toDateString(),
                ]
            )
            ->sum('amount');

        /*
        |--------------------------------------------------------------------------
        | Profit Calculations
        |--------------------------------------------------------------------------
        */

        $grossProfit =
            (float) $sales -
            (float) $purchases;

        $netProfit =
            $grossProfit -
            (float) $expenses;

        /*
        |--------------------------------------------------------------------------
        | Selected Period Daily Summary
        |--------------------------------------------------------------------------
        |
        | For periods longer than 30 days, only the latest 31 days are
        | displayed in the daily summary to keep the report readable.
        |
        */

        $summaryStart = $startDate->copy();

        if (
            $summaryStart->diffInDays($endDate) > 30
        ) {
            $summaryStart = $endDate
                ->copy()
                ->subDays(30)
                ->startOfDay();
        }

        $chart = collect();

        $currentDate = $summaryStart
            ->copy()
            ->startOfDay();

        while (
            $currentDate->lte($endDate)
        ) {

            $dateString =
                $currentDate->toDateString();

            /*
            |--------------------------------------------------------------------------
            | Daily Sales
            |--------------------------------------------------------------------------
            */

            $dailySales = Sale::query()
                ->where(
                    'pharmacy_id',
                    $pharmacyId
                )
                ->whereDate(
                    'created_at',
                    $dateString
                )
                ->sum('total');

            /*
            |--------------------------------------------------------------------------
            | Daily Purchases
            |--------------------------------------------------------------------------
            */

            $dailyPurchases = Purchase::query()
                ->where(
                    'pharmacy_id',
                    $pharmacyId
                )
                ->whereDate(
                    'created_at',
                    $dateString
                )
                ->sum('total');

            /*
            |--------------------------------------------------------------------------
            | Daily Expenses
            |--------------------------------------------------------------------------
            */

            $dailyExpenses = Expense::query()
                ->where(
                    'pharmacy_id',
                    $pharmacyId
                )
                ->whereDate(
                    'expense_date',
                    $dateString
                )
                ->sum('amount');

            /*
            |--------------------------------------------------------------------------
            | Daily Summary
            |--------------------------------------------------------------------------
            */

            $chart->push([
                'day' =>
                    $currentDate->format('D'),

                'date' =>
                    $dateString,

                'sales' =>
                    (float) $dailySales,

                'purchases' =>
                    (float) $dailyPurchases,

                'expenses' =>
                    (float) $dailyExpenses,

                'profit' =>
                    (float) $dailySales
                    - (float) $dailyPurchases
                    - (float) $dailyExpenses,
            ]);

            $currentDate->addDay();
        }

        /*
        |--------------------------------------------------------------------------
        | Recent Sales
        |--------------------------------------------------------------------------
        */

        $recentSales = Sale::query()
            ->where(
                'pharmacy_id',
                $pharmacyId
            )
            ->whereBetween(
                'created_at',
                [
                    $startDate,
                    $endDate,
                ]
            )
            ->latest()
            ->take(5)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Recent Purchases
        |--------------------------------------------------------------------------
        */

        $recentPurchases = Purchase::query()
            ->where(
                'pharmacy_id',
                $pharmacyId
            )
            ->whereBetween(
                'created_at',
                [
                    $startDate,
                    $endDate,
                ]
            )
            ->latest()
            ->take(5)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Recent Expenses
        |--------------------------------------------------------------------------
        */

        $recentExpenses = Expense::query()
            ->where(
                'pharmacy_id',
                $pharmacyId
            )
            ->whereBetween(
                'expense_date',
                [
                    $startDate->toDateString(),
                    $endDate->toDateString(),
                ]
            )
            ->latest('expense_date')
            ->take(5)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Return Report Data
        |--------------------------------------------------------------------------
        */

        return [

            /*
            |--------------------------------------------------------------------------
            | Current Filter
            |--------------------------------------------------------------------------
            */

            'filter' =>
                $filter,

            /*
            |--------------------------------------------------------------------------
            | Pharmacy
            |--------------------------------------------------------------------------
            |
            | Kept for compatibility with existing frontend and Blade templates.
            |
            */

            'pharmacy' =>
                $pharmacy,

            /*
            |--------------------------------------------------------------------------
            | Pharmacy Settings
            |--------------------------------------------------------------------------
            */

            'setting' =>
                $setting,

            /*
            |--------------------------------------------------------------------------
            | Display Pharmacy Name
            |--------------------------------------------------------------------------
            |
            | This is the value that should be used by reports, print and PDF.
            |
            */

            'pharmacyName' =>
                $pharmacyName,

            /*
            |--------------------------------------------------------------------------
            | Date Range
            |--------------------------------------------------------------------------
            */

            'dateRange' => [

                'from' =>
                    $startDate->toDateString(),

                'to' =>
                    $endDate->toDateString(),

                'label' =>
                    $startDate->format('d M Y') .
                    ' - ' .
                    $endDate->format('d M Y'),
            ],

            /*
            |--------------------------------------------------------------------------
            | Financial Statistics
            |--------------------------------------------------------------------------
            */

            'stats' => [

                'sales' =>
                    (float) $sales,

                'purchases' =>
                    (float) $purchases,

                'expenses' =>
                    (float) $expenses,

                'grossProfit' =>
                    (float) $grossProfit,

                'netProfit' =>
                    (float) $netProfit,
            ],

            /*
            |--------------------------------------------------------------------------
            | Daily Chart
            |--------------------------------------------------------------------------
            */

            'chart' =>
                $chart,

            /*
            |--------------------------------------------------------------------------
            | Recent Sales
            |--------------------------------------------------------------------------
            */

            'recentSales' =>
                $recentSales,

            /*
            |--------------------------------------------------------------------------
            | Recent Purchases
            |--------------------------------------------------------------------------
            */

            'recentPurchases' =>
                $recentPurchases,

            /*
            |--------------------------------------------------------------------------
            | Recent Expenses
            |--------------------------------------------------------------------------
            */

            'recentExpenses' =>
                $recentExpenses,

            /*
            |--------------------------------------------------------------------------
            | Generated At
            |--------------------------------------------------------------------------
            */

            'generatedAt' =>
                now()->format(
                    'd M Y, h:i A'
                ),
        ];
    }
}