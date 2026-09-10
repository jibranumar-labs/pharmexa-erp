<?php

namespace App\Http\Controllers;

use App\Models\PharmacyMedicine;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(): Response
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        /*
        |--------------------------------------------------------------------------
        | Base Pharmacy Inventory Query
        |--------------------------------------------------------------------------
        |
        | Operational inventory belongs to pharmacy_medicines.
        |
        | medicines is the global catalogue and must NOT be used for:
        |
        | - stock quantity
        | - minimum stock
        | - expiry date
        |
        */

        $baseQuery = PharmacyMedicine::query()
            ->where('pharmacy_id', $pharmacyId)
            ->where('is_active', true);

        /*
        |--------------------------------------------------------------------------
        | Statistics
        |--------------------------------------------------------------------------
        */

        $expiredCount = (clone $baseQuery)
            ->whereNotNull('expiry_date')
            ->whereDate('expiry_date', '<', today())
            ->count();

        $expiringSoonCount = (clone $baseQuery)
            ->whereNotNull('expiry_date')
            ->whereBetween('expiry_date', [
                today(),
                today()->copy()->addDays(30),
            ])
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Low Stock
        |--------------------------------------------------------------------------
        |
        | Low Stock means:
        |
        | stock > 0
        | AND
        | stock <= minimum_stock
        |
        | Out-of-stock products are kept separate.
        |
        */

        $lowStockCount = (clone $baseQuery)
            ->where('stock_quantity', '>', 0)
            ->whereColumn(
                'stock_quantity',
                '<=',
                'minimum_stock'
            )
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Out of Stock
        |--------------------------------------------------------------------------
        */

        $outOfStockCount = (clone $baseQuery)
            ->where('stock_quantity', '<=', 0)
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Expired Products
        |--------------------------------------------------------------------------
        */

        $expired = (clone $baseQuery)
            ->whereNotNull('expiry_date')
            ->whereDate('expiry_date', '<', today())
            ->with('medicine')
            ->latest()
            ->take(20)
            ->get()
            ->map(function (PharmacyMedicine $inventory) {
                return $this->formatNotificationItem($inventory);
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Expiring Soon
        |--------------------------------------------------------------------------
        */

        $expiringSoon = (clone $baseQuery)
            ->whereNotNull('expiry_date')
            ->whereBetween('expiry_date', [
                today(),
                today()->copy()->addDays(30),
            ])
            ->with('medicine')
            ->orderBy('expiry_date')
            ->take(20)
            ->get()
            ->map(function (PharmacyMedicine $inventory) {
                return $this->formatNotificationItem($inventory);
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Low Stock
        |--------------------------------------------------------------------------
        */

        $lowStock = (clone $baseQuery)
            ->where('stock_quantity', '>', 0)
            ->whereColumn(
                'stock_quantity',
                '<=',
                'minimum_stock'
            )
            ->with('medicine')
            ->orderBy('stock_quantity')
            ->take(20)
            ->get()
            ->map(function (PharmacyMedicine $inventory) {
                return $this->formatNotificationItem($inventory);
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Out of Stock
        |--------------------------------------------------------------------------
        */

        $outOfStock = (clone $baseQuery)
            ->where('stock_quantity', '<=', 0)
            ->with('medicine')
            ->orderBy('stock_quantity')
            ->take(20)
            ->get()
            ->map(function (PharmacyMedicine $inventory) {
                return $this->formatNotificationItem($inventory);
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Send To Inertia
        |--------------------------------------------------------------------------
        */

        return Inertia::render('Notifications/Index', [
            'stats' => [
                'expired' => $expiredCount,
                'expiringSoon' => $expiringSoonCount,
                'lowStock' => $lowStockCount,
                'outOfStock' => $outOfStockCount,
            ],

            'expired' => $expired,
            'expiringSoon' => $expiringSoon,
            'lowStock' => $lowStock,
            'outOfStock' => $outOfStock,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Format Notification Item
    |--------------------------------------------------------------------------
    |
    | The React Notifications/Index.jsx expects:
    |
    | medicine.id
    | medicine.name
    | medicine.sku
    | medicine.stock_quantity
    | medicine.expiry_date
    |
    | We therefore return a flat structure.
    |
    */

    protected function formatNotificationItem(
        PharmacyMedicine $inventory
    ): array {
        $medicine = $inventory->medicine;

        return [
            'id' => $inventory->id,

            'name' => $medicine?->name
                ?? 'Unknown Product',

            'sku' => $medicine?->sku
                ?? $inventory->sku
                ?? null,

            'stock_quantity' => (int) ($inventory->stock_quantity ?? 0),

            'expiry_date' => $inventory->expiry_date
                ? $inventory->expiry_date->format('Y-m-d')
                : null,
        ];
    }
}