<?php

namespace App\Http\Controllers;

use App\Models\PharmacyMedicine;
use App\Models\StockMovement;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    /**
     * Display the inventory dashboard for the current pharmacy.
     */
    public function __invoke(): Response
    {
        /*
        |--------------------------------------------------------------------------
        | Current Pharmacy
        |--------------------------------------------------------------------------
        */

        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        /*
        |--------------------------------------------------------------------------
        | Recent Stock Movements
        |--------------------------------------------------------------------------
        |
        | Stock movements are always scoped to the currently logged-in
        | pharmacy.
        |
        */

        $recentMovements = StockMovement::query()
            ->where('pharmacy_id', $pharmacyId)
            ->with([
                'medicine',
                'user',
            ])
            ->latest()
            ->take(8)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Inventory Base Query
        |--------------------------------------------------------------------------
        |
        | Operational inventory belongs to pharmacy_medicines.
        |
        | The global medicines table is the medicine catalogue and must not
        | be used as the pharmacy's operational stock source.
        |
        | PharmacyMedicine contains pharmacy-specific:
        |
        | - stock_quantity
        | - minimum_stock
        | - purchase_price
        | - selling_price
        | - batch_number
        | - expiry_date
        | - supplier
        | - active status
        |
        */

        $inventory = PharmacyMedicine::query()
            ->where('pharmacy_id', $pharmacyId);

        /*
        |--------------------------------------------------------------------------
        | Total Medicines
        |--------------------------------------------------------------------------
        |
        | Includes all medicine records assigned to this pharmacy, including
        | inactive records.
        |
        */

        $totalMedicines = (clone $inventory)
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Active Medicines
        |--------------------------------------------------------------------------
        */

        $activeMedicines = (clone $inventory)
            ->where('is_active', true)
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Low Stock
        |--------------------------------------------------------------------------
        |
        | Only active medicines are included.
        |
        | Low stock means:
        |
        | stock_quantity > 0
        | AND
        | stock_quantity <= minimum_stock
        |
        | This prevents out-of-stock medicines from also being counted as
        | low-stock medicines.
        |
        */

        $lowStock = (clone $inventory)
            ->where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->whereColumn(
                'stock_quantity',
                '<=',
                'minimum_stock'
            )
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Out Of Stock
        |--------------------------------------------------------------------------
        */

        $outOfStock = (clone $inventory)
            ->where('is_active', true)
            ->where('stock_quantity', '<=', 0)
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Expired Medicines
        |--------------------------------------------------------------------------
        |
        | Expiry comes from pharmacy_medicines because batches and expiry
        | information belong to the pharmacy inventory.
        |
        */

        $expired = (clone $inventory)
            ->where('is_active', true)
            ->whereNotNull('expiry_date')
            ->whereDate(
                'expiry_date',
                '<',
                today()
            )
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Expiring Soon
        |--------------------------------------------------------------------------
        |
        | Products expiring from today through the next 30 days.
        |
        */

        $expiringSoon = (clone $inventory)
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
        |--------------------------------------------------------------------------
        | Inventory Value
        |--------------------------------------------------------------------------
        |
        | Inventory value:
        |
        | pharmacy stock quantity × pharmacy purchase price
        |
        | Only active pharmacy inventory is included.
        |
        */

        $inventoryValue = (clone $inventory)
            ->where('is_active', true)
            ->selectRaw(
                'COALESCE(
                    SUM(stock_quantity * purchase_price),
                    0
                ) as total'
            )
            ->value('total') ?? 0;

        /*
        |--------------------------------------------------------------------------
        | Statistics
        |--------------------------------------------------------------------------
        */

        $stats = [
            'totalMedicines' =>
                $totalMedicines,

            'activeMedicines' =>
                $activeMedicines,

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
        ];

        /*
        |--------------------------------------------------------------------------
        | Render Inventory Dashboard
        |--------------------------------------------------------------------------
        */

        return Inertia::render(
            'Inventory/Dashboard',
            [
                'stats' =>
                    $stats,

                'recentMovements' =>
                    $recentMovements,
            ]
        );
    }
}