<?php

namespace App\Http\Controllers;

use App\Models\Pharmacy;
use App\Models\PharmacyMedicine;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Reports Dashboard
     *
     * All operational report data is isolated by pharmacy_id.
     */
    public function index(Request $request): Response
    {
        $user = auth()->user();

        abort_if(! $user, 403);

        $pharmacyId = $user->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        /*
        |--------------------------------------------------------------------------
        | Pharmacy / Branding
        |--------------------------------------------------------------------------
        */

        $pharmacy = Pharmacy::query()
            ->whereKey($pharmacyId)
            ->first();

        abort_if(! $pharmacy, 403);

        $setting = Setting::query()
            ->where('pharmacy_id', $pharmacyId)
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Report Filter
        |--------------------------------------------------------------------------
        |
        | Supported:
        | Today
        | This Week
        | This Month
        | This Year
        | Custom
        |
        */

        $filter = $request->input('filter', 'This Month');

        $allowedFilters = [
            'Today',
            'This Week',
            'This Month',
            'This Year',
            'Custom',
        ];

        if (! in_array($filter, $allowedFilters, true)) {
            $filter = 'This Month';
        }

        $now = now();

        $startDate = $now->copy()->startOfMonth();
        $endDate = $now->copy()->endOfMonth();

        /*
        |--------------------------------------------------------------------------
        | Custom Date Range
        |--------------------------------------------------------------------------
        */

        $customFrom = $request->input('from');
        $customTo = $request->input('to');

        if ($filter === 'Today') {
            $startDate = $now->copy()->startOfDay();
            $endDate = $now->copy()->endOfDay();
        }

        elseif ($filter === 'This Week') {
            $startDate = $now->copy()->startOfWeek();
            $endDate = $now->copy()->endOfWeek();
        }

        elseif ($filter === 'This Month') {
            $startDate = $now->copy()->startOfMonth();
            $endDate = $now->copy()->endOfMonth();
        }

        elseif ($filter === 'This Year') {
            $startDate = $now->copy()->startOfYear();
            $endDate = $now->copy()->endOfYear();
        }

        elseif ($filter === 'Custom') {
            try {
                if ($customFrom && $customTo) {
                    $from = Carbon::parse($customFrom);
                    $to = Carbon::parse($customTo);

                    /*
                     * If the dates were accidentally supplied backwards,
                     * automatically correct the order.
                     */
                    if ($from->gt($to)) {
                        [$from, $to] = [$to, $from];
                    }

                    $startDate = $from->startOfDay();
                    $endDate = $to->endOfDay();
                } else {
                    /*
                     * No valid custom dates yet.
                     * Fall back safely to current month.
                     */
                    $filter = 'This Month';

                    $startDate = $now->copy()->startOfMonth();
                    $endDate = $now->copy()->endOfMonth();
                }
            } catch (\Throwable $e) {
                $filter = 'This Month';

                $startDate = $now->copy()->startOfMonth();
                $endDate = $now->copy()->endOfMonth();
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Display Dates
        |--------------------------------------------------------------------------
        */

        $reportPeriod = [
            'filter' => $filter,

            'from' => $startDate->toDateString(),

            'to' => $endDate->toDateString(),

            'fromFormatted' => $startDate->format('d M Y'),

            'toFormatted' => $endDate->format('d M Y'),

            'label' => $this->periodLabel(
                $filter,
                $startDate,
                $endDate
            ),
        ];

        /*
        |--------------------------------------------------------------------------
        | Sales
        |--------------------------------------------------------------------------
        */

        $salesQuery = Sale::query()
            ->where('pharmacy_id', $pharmacyId)
            ->whereBetween('created_at', [
                $startDate,
                $endDate,
            ]);

        $totalSales = (float) $salesQuery->sum('total');

        $totalInvoices = (int) $salesQuery->count();

        $totalPaid = (float) $salesQuery->sum('paid_amount');

        /*
        |--------------------------------------------------------------------------
        | Purchases
        |--------------------------------------------------------------------------
        */

        $purchasesQuery = Purchase::query()
            ->where('pharmacy_id', $pharmacyId)
            ->whereBetween('created_at', [
                $startDate,
                $endDate,
            ]);

        $totalPurchases = (float) $purchasesQuery->sum('total');

        $totalPurchaseInvoices = (int) $purchasesQuery->count();

        $totalPurchasePaid = (float) $purchasesQuery->sum('paid_amount');

        /*
        |--------------------------------------------------------------------------
        | COGS / Gross Profit
        |--------------------------------------------------------------------------
        |
        | COGS is calculated from the historical cost_price saved on each
        | SaleItem at the time of sale. This is the actual cost of the
        | medicines sold during the selected reporting period.
        |
        | Gross Profit = Sales - COGS
        | Gross Margin = Gross Profit / Sales * 100
        |
        */

        $cogs = (float) SaleItem::query()
            ->where('pharmacy_id', $pharmacyId)
            ->whereHas('sale', function ($query) use (
                $pharmacyId,
                $startDate,
                $endDate
            ) {
                $query
                    ->where('pharmacy_id', $pharmacyId)
                    ->whereBetween('created_at', [
                        $startDate,
                        $endDate,
                    ]);
            })
            ->select(
                DB::raw(
                    'COALESCE(SUM(cost_price * quantity), 0) as total'
                )
            )
            ->value('total');

        $grossProfit = $totalSales - $cogs;

        $grossMargin = $totalSales > 0
            ? ($grossProfit / $totalSales) * 100
            : 0;

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Inventory
        |--------------------------------------------------------------------------
        |
        | Operational inventory belongs to pharmacy_medicines.
        |
        */

        $inventoryQuery = PharmacyMedicine::query()
            ->where('pharmacy_id', $pharmacyId)
            ->where('is_active', true);

        /*
        |--------------------------------------------------------------------------
        | Inventory Value
        |--------------------------------------------------------------------------
        */

        $inventoryValue = (float) (
            (clone $inventoryQuery)
                ->select(
                    DB::raw(
                        'COALESCE(
                            SUM(stock_quantity * purchase_price),
                            0
                        ) as total'
                    )
                )
                ->value('total') ?? 0
        );

        /*
        |--------------------------------------------------------------------------
        | Stock Alerts
        |--------------------------------------------------------------------------
        */

        $lowStock = (int) (clone $inventoryQuery)
            ->where('stock_quantity', '>', 0)
            ->whereColumn(
                'stock_quantity',
                '<=',
                'minimum_stock'
            )
            ->count();

        $outOfStock = (int) (clone $inventoryQuery)
            ->where('stock_quantity', '<=', 0)
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Expiry
        |--------------------------------------------------------------------------
        */

        $expired = (int) (clone $inventoryQuery)
            ->whereNotNull('expiry_date')
            ->whereDate(
                'expiry_date',
                '<',
                today()
            )
            ->count();

        $expiringSoon = (int) (clone $inventoryQuery)
            ->whereNotNull('expiry_date')
            ->whereBetween(
                'expiry_date',
                [
                    today(),
                    today()->copy()->addDays(30),
                ]
            )
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Active Medicines
        |--------------------------------------------------------------------------
        */

        $activeMedicines = (int) (clone $inventoryQuery)
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Sales Chart
        |--------------------------------------------------------------------------
        |
        | The chart follows the selected period.
        |
        | For short periods we use daily points.
        | For longer periods we use daily points for the selected range,
        | capped at 31 points to keep the dashboard performant.
        |
        */

        $salesChart = $this->buildDailySalesChart(
            $pharmacyId,
            $startDate,
            $endDate
        );

        /*
        |--------------------------------------------------------------------------
        | Purchase Chart
        |--------------------------------------------------------------------------
        */

        $purchaseChart = $this->buildDailyPurchaseChart(
            $pharmacyId,
            $startDate,
            $endDate
        );

        /*
        |--------------------------------------------------------------------------
        | Inventory Chart
        |--------------------------------------------------------------------------
        |
        | "Active" here means active inventory records.
        | Low/out-of-stock/expired are separate alert categories.
        |
        */

        $inventoryChart = [
            [
                'label' => 'Active',
                'value' => $activeMedicines,
            ],

            [
                'label' => 'Low Stock',
                'value' => $lowStock,
            ],

            [
                'label' => 'Out of Stock',
                'value' => $outOfStock,
            ],

            [
                'label' => 'Expired',
                'value' => $expired,
            ],
        ];

        /*
        |--------------------------------------------------------------------------
        | Recent Sales
        |--------------------------------------------------------------------------
        |
        | Keep these limited to the selected report period so the dashboard
        | does not show unrelated transactions when a period is selected.
        |
        */

        $recentSales = Sale::query()
            ->where('pharmacy_id', $pharmacyId)
            ->whereBetween('created_at', [
                $startDate,
                $endDate,
            ])
            ->with('user')
            ->latest()
            ->take(5)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Recent Purchases
        |--------------------------------------------------------------------------
        */

        $recentPurchases = Purchase::query()
            ->where('pharmacy_id', $pharmacyId)
            ->whereBetween('created_at', [
                $startDate,
                $endDate,
            ])
            ->with('supplier')
            ->latest()
            ->take(5)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Branding
        |--------------------------------------------------------------------------
        |
        | Prefer pharmacy-specific Settings.
        | Fall back to the Pharmacy master record.
        |
        */

       $pharmacyName =
    $setting?->pharmacy_name
    ?: $pharmacy->name
    ?: 'PHARMEXA';

        $branchName =
            $setting?->branch_name
            ?: null;

        $address =
            $setting?->address
            ?: $pharmacy->address
            ?: null;

        $city =
            $setting?->city
            ?: $pharmacy->city
            ?: null;

        $country =
            $setting?->country
            ?: $pharmacy->country
            ?: null;

        $phone =
            $setting?->phone
            ?: $pharmacy->phone
            ?: null;

        $email =
            $setting?->email
            ?: $pharmacy->email
            ?: null;

        $vatNumber =
            $setting?->vat_number
            ?: null;

        $commercialRegistration =
            $setting?->commercial_registration
            ?: null;

        $currency =
            $setting?->currency_symbol
            ?: $setting?->currency
            ?: 'SAR';

        /*
        |--------------------------------------------------------------------------
        | Render
        |--------------------------------------------------------------------------
        */

        return Inertia::render('Reports/Index', [
            /*
             * Current selected filter.
             */
            'filter' => $filter,

            /*
             * Complete report period.
             */
            'reportPeriod' => $reportPeriod,

            /*
             * Pharmacy identity / branding.
             */
            'pharmacy' => [
                'id' => $pharmacy->id,

                'name' => $pharmacyName,

                'branchName' => $branchName,

                'address' => $address,

                'city' => $city,

                'country' => $country,

                'phone' => $phone,

                'email' => $email,

                'vatNumber' => $vatNumber,

                'commercialRegistration' =>
                    $commercialRegistration,

                'logo' =>
                    $setting?->logo
                    ?: $pharmacy->logo,

                'logoUrl' =>
                    $pharmacy->logo_url
                    ?? null,

                'currency' => $currency,
            ],

            /*
             * Selected-period statistics.
             */
            'stats' => [
                /*
                 * Kept for compatibility with the existing frontend.
                 */
                'todaySales' => (float) Sale::query()
                    ->where('pharmacy_id', $pharmacyId)
                    ->whereDate('created_at', today())
                    ->sum('total'),

                'monthlySales' => (float) Sale::query()
                    ->where('pharmacy_id', $pharmacyId)
                    ->whereMonth(
                        'created_at',
                        now()->month
                    )
                    ->whereYear(
                        'created_at',
                        now()->year
                    )
                    ->sum('total'),

                /*
                 * Selected period.
                 */
                'totalSales' => $totalSales,

                'totalPurchases' => $totalPurchases,

                'inventoryValue' => $inventoryValue,

                'cogs' => $cogs,

                'grossProfit' => $grossProfit,

                'grossMargin' => round($grossMargin, 2),

                'lowStock' => $lowStock,

                'outOfStock' => $outOfStock,

                'expired' => $expired,

                'expiringSoon' => $expiringSoon,

                'totalMedicines' => $activeMedicines,

                'totalInvoices' => $totalInvoices,

                'totalPurchaseInvoices' =>
                    $totalPurchaseInvoices,

                'totalPaid' => $totalPaid,

                'totalPurchasePaid' =>
                    $totalPurchasePaid,

                'salesBalance' =>
                    max(
                        0,
                        $totalSales - $totalPaid
                    ),

                'purchaseBalance' =>
                    max(
                        0,
                        $totalPurchases -
                        $totalPurchasePaid
                    ),
            ],

            /*
             * Charts.
             */
            'salesChart' => $salesChart,

            'purchaseChart' => $purchaseChart,

            'inventoryChart' => $inventoryChart,

            /*
             * Recent transactions.
             */
            'recentSales' => $recentSales,

            'recentPurchases' => $recentPurchases,
        ]);
    }

    /**
     * Build daily sales chart data for the selected report period.
     */
    protected function buildDailySalesChart(
        int $pharmacyId,
        Carbon $startDate,
        Carbon $endDate
    ): array {
        $days = $startDate->copy()->startOfDay();

        $end = $endDate->copy()->startOfDay();

        /*
         * Prevent an excessively large chart.
         *
         * The dashboard is designed for practical reporting.
         * Maximum 31 daily points.
         */
        if ($days->diffInDays($end) > 30) {
            $days = $end->copy()->subDays(30);
        }

        $sales = Sale::query()
            ->where('pharmacy_id', $pharmacyId)
            ->whereBetween('created_at', [
                $days->copy()->startOfDay(),
                $endDate,
            ])
            ->select([
                DB::raw(
                    'DATE(created_at) as report_date'
                ),
                DB::raw(
                    'COALESCE(SUM(total), 0) as total'
                ),
                DB::raw(
                    'COUNT(*) as orders'
                ),
            ])
            ->groupBy(
                DB::raw('DATE(created_at)')
            )
            ->get()
            ->keyBy('report_date');

        $chart = [];

        $cursor = $days->copy();

        while ($cursor->lte($end)) {
            $dateKey = $cursor->toDateString();

            $row = $sales->get($dateKey);

            $chart[] = [
                'date' => $dateKey,

                'day' => $cursor->format('D'),

                'label' => $cursor->format('d M'),

                'sales' => (float) (
                    $row?->total ?? 0
                ),

                'orders' => (int) (
                    $row?->orders ?? 0
                ),
            ];

            $cursor->addDay();
        }

        return $chart;
    }

    /**
     * Build daily purchase chart data for the selected report period.
     */
    protected function buildDailyPurchaseChart(
        int $pharmacyId,
        Carbon $startDate,
        Carbon $endDate
    ): array {
        $days = $startDate->copy()->startOfDay();

        $end = $endDate->copy()->startOfDay();

        /*
         * Maximum 31 daily points.
         */
        if ($days->diffInDays($end) > 30) {
            $days = $end->copy()->subDays(30);
        }

        $purchases = Purchase::query()
            ->where('pharmacy_id', $pharmacyId)
            ->whereBetween('created_at', [
                $days->copy()->startOfDay(),
                $endDate,
            ])
            ->select([
                DB::raw(
                    'DATE(created_at) as report_date'
                ),
                DB::raw(
                    'COALESCE(SUM(total), 0) as total'
                ),
            ])
            ->groupBy(
                DB::raw('DATE(created_at)')
            )
            ->get()
            ->keyBy('report_date');

        $chart = [];

        $cursor = $days->copy();

        while ($cursor->lte($end)) {
            $dateKey = $cursor->toDateString();

            $row = $purchases->get($dateKey);

            $chart[] = [
                'date' => $dateKey,

                'day' => $cursor->format('D'),

                'label' => $cursor->format('d M'),

                'purchases' => (float) (
                    $row?->total ?? 0
                ),
            ];

            $cursor->addDay();
        }

        return $chart;
    }

    /**
     * Human-readable period label.
     */
    protected function periodLabel(
        string $filter,
        Carbon $startDate,
        Carbon $endDate
    ): string {
        if ($filter === 'Today') {
            return $startDate->format('d M Y');
        }

        if (
            $startDate->isSameDay($endDate)
        ) {
            return $startDate->format('d M Y');
        }

        return $startDate->format('d M Y')
            . ' – '
            . $endDate->format('d M Y');
    }
}