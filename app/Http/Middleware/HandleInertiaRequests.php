<?php

namespace App\Http\Middleware;

use App\Models\PharmacyMedicine;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Notification Count
        |--------------------------------------------------------------------------
        |
        | Notifications are pharmacy-specific.
        |
        | Super Owner:
        | - has no pharmacy_id
        | - does not use pharmacy inventory notifications
        | - receives notificationCount = 0
        |
        | Pharmacy users:
        | - notifications are calculated only from their own pharmacy inventory
        |
        */

        $notificationCount = 0;

        if ($user && $user->pharmacy_id) {

            $inventoryQuery = PharmacyMedicine::query()
                ->where('pharmacy_id', $user->pharmacy_id)
                ->where('is_active', true);

            /*
            |--------------------------------------------------------------------------
            | Expired Medicines
            |--------------------------------------------------------------------------
            */

            $expired = (clone $inventoryQuery)
                ->whereNotNull('expiry_date')
                ->whereDate('expiry_date', '<', today())
                ->exists();

            /*
            |--------------------------------------------------------------------------
            | Expiring Soon
            |--------------------------------------------------------------------------
            */

            $expiringSoon = (clone $inventoryQuery)
                ->whereNotNull('expiry_date')
                ->whereBetween('expiry_date', [
                    today(),
                    today()->copy()->addDays(30),
                ])
                ->exists();

            /*
            |--------------------------------------------------------------------------
            | Low Stock
            |--------------------------------------------------------------------------
            |
            | Stock > 0 and stock <= minimum stock.
            | Zero stock is handled separately.
            |
            */

            $lowStock = (clone $inventoryQuery)
                ->where('stock_quantity', '>', 0)
                ->whereColumn(
                    'stock_quantity',
                    '<=',
                    'minimum_stock'
                )
                ->exists();

            /*
            |--------------------------------------------------------------------------
            | Out Of Stock
            |--------------------------------------------------------------------------
            */

            $outOfStock = (clone $inventoryQuery)
                ->where('stock_quantity', '<=', 0)
                ->exists();

            /*
            |--------------------------------------------------------------------------
            | Notification Categories
            |--------------------------------------------------------------------------
            |
            | The badge represents the number of active notification categories,
            | not the total number of affected medicines.
            |
            */

            if ($expired) {
                $notificationCount++;
            }

            if ($expiringSoon) {
                $notificationCount++;
            }

            if ($lowStock) {
                $notificationCount++;
            }

            if ($outOfStock) {
                $notificationCount++;
            }
        }

        return [
            ...parent::share($request),

            /*
            |--------------------------------------------------------------------------
            | Authentication
            |--------------------------------------------------------------------------
            */

            'auth' => [
                'user' => $user,
            ],

            /*
            |--------------------------------------------------------------------------
            | Notifications
            |--------------------------------------------------------------------------
            */

            'notificationCount' => $notificationCount,

            /*
            |--------------------------------------------------------------------------
            | Flash Messages
            |--------------------------------------------------------------------------
            */

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'sale'    => fn () => $request->session()->get('sale'),
            ],

            /*
            |--------------------------------------------------------------------------
            | Application
            |--------------------------------------------------------------------------
            */

            'app' => [
                'name' => config('app.name'),
            ],
        ];
    }
}