<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\PharmacyMedicine;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockMovement;
use App\Models\Supplier;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Inventory Base Query
        |--------------------------------------------------------------------------
        |
        | Operational inventory belongs to pharmacy_medicines.
        |
        | medicines is the global catalogue and must not be used for:
        |
        | - stock_quantity
        | - minimum_stock
        | - purchase_price
        | - expiry_date
        | - pharmacy active status
        |
        */

        $inventoryQuery = PharmacyMedicine::query()
            ->where('pharmacy_id', $pharmacyId);

        /*
        |--------------------------------------------------------------------------
        | Sales Chart - Last 7 Days
        |--------------------------------------------------------------------------
        */

        $salesChart = collect(range(6, 0))
            ->map(function ($day) use ($pharmacyId) {

                $date = now()->subDays($day);

                return [
                    'day' => $date->format('D'),

                    'sales' => (float) Sale::query()
                        ->where('pharmacy_id', $pharmacyId)
                        ->whereDate('created_at', $date)
                        ->sum('total'),

                    'orders' => Sale::query()
                        ->where('pharmacy_id', $pharmacyId)
                        ->whereDate('created_at', $date)
                        ->count(),
                ];
            });

        /*
        |--------------------------------------------------------------------------
        | Recent Activity
        |--------------------------------------------------------------------------
        */

        $recentActivity = Sale::query()
            ->where('pharmacy_id', $pharmacyId)
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($sale) {

                return [
                    'action' => 'Sale completed',

                    'detail' =>
                        $sale->invoice_number .
                        ' — ' .
                        number_format($sale->total, 2) .
                        ' SAR',

                    'time' =>
                        $sale->created_at->diffForHumans(),
                ];
            });

        /*
        |--------------------------------------------------------------------------
        | Inventory Statistics
        |--------------------------------------------------------------------------
        */

        $totalMedicines = (clone $inventoryQuery)
            ->count();

        $activeMedicines = (clone $inventoryQuery)
            ->where('is_active', true)
            ->count();

        /*
         * Low stock:
         *
         * stock > 0
         * stock <= minimum_stock
         *
         * Zero-stock products are counted separately.
         */
        $lowStock = (clone $inventoryQuery)
            ->where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->whereColumn(
                'stock_quantity',
                '<=',
                'minimum_stock'
            )
            ->count();

        $outOfStock = (clone $inventoryQuery)
            ->where('is_active', true)
            ->where('stock_quantity', '<=', 0)
            ->count();

        $expired = (clone $inventoryQuery)
            ->where('is_active', true)
            ->whereNotNull('expiry_date')
            ->whereDate(
                'expiry_date',
                '<',
                today()
            )
            ->count();

        $expiringSoon = (clone $inventoryQuery)
            ->where('is_active', true)
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
         * Inventory valuation:
         *
         * pharmacy stock × pharmacy purchase price
         */
        $inventoryValue = (clone $inventoryQuery)
            ->where('is_active', true)
            ->select(
                DB::raw(
                    'COALESCE(SUM(stock_quantity * purchase_price), 0) as total'
                )
            )
            ->value('total') ?? 0;

        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */

        return Inertia::render('Dashboard', [

            'stats' => [

                'todayRevenue' => Sale::query()
                    ->where('pharmacy_id', $pharmacyId)
                    ->whereDate('created_at', today())
                    ->sum('total'),

                'monthlyRevenue' => Sale::query()
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

                'todayPurchases' => Purchase::query()
                    ->where('pharmacy_id', $pharmacyId)
                    ->whereDate('created_at', today())
                    ->sum('total'),

                'monthlyPurchases' => Purchase::query()
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

                'totalInvoices' => Sale::query()
                    ->where(
                        'pharmacy_id',
                        $pharmacyId
                    )
                    ->count(),

                /*
                 * Inventory counts now come from pharmacy_medicines.
                 */
                'totalMedicines' =>
                    $totalMedicines,

                'activeMedicines' =>
                    $activeMedicines,

                'totalCustomers' => Customer::query()
                    ->where(
                        'pharmacy_id',
                        $pharmacyId
                    )
                    ->count(),

                'totalSuppliers' => Supplier::query()
                    ->where(
                        'pharmacy_id',
                        $pharmacyId
                    )
                    ->count(),

                'lowStock' =>
                    $lowStock,

                'outOfStock' =>
                    $outOfStock,

                'expired' =>
                    $expired,

                'expiringSoon' =>
                    $expiringSoon,

                'inventoryValue' =>
                    $inventoryValue,
            ],

            /*
            |--------------------------------------------------------------------------
            | Charts
            |--------------------------------------------------------------------------
            */

            'salesChart' =>
                $salesChart,

            /*
            |--------------------------------------------------------------------------
            | Recent Activity
            |--------------------------------------------------------------------------
            */

            'recentActivity' =>
                $recentActivity,

            /*
            |--------------------------------------------------------------------------
            | Recent Sales
            |--------------------------------------------------------------------------
            */

            'recentSales' => Sale::query()
                ->where('pharmacy_id', $pharmacyId)
                ->with('user')
                ->latest()
                ->take(6)
                ->get(),

            /*
            |--------------------------------------------------------------------------
            | Recent Stock Movements
            |--------------------------------------------------------------------------
            */

            'recentMovements' => StockMovement::query()
                ->where('pharmacy_id', $pharmacyId)
                ->with([
                    'medicine',
                    'user',
                ])
                ->latest()
                ->take(6)
                ->get(),

            /*
            |--------------------------------------------------------------------------
            | Recent Purchases
            |--------------------------------------------------------------------------
            */

            'recentPurchases' => Purchase::query()
                ->where('pharmacy_id', $pharmacyId)
                ->with('supplier')
                ->latest()
                ->take(5)
                ->get(),

            /*
            |--------------------------------------------------------------------------
            | Top Selling Medicines
            |--------------------------------------------------------------------------
            */

            'topMedicines' => SaleItem::query()
                ->where('pharmacy_id', $pharmacyId)
                ->select(
                    'medicine_name',
                    DB::raw(
                        'SUM(quantity) as total_quantity'
                    )
                )
                ->groupBy('medicine_name')
                ->orderByDesc('total_quantity')
                ->take(5)
                ->get(),
        ]);
    }
}