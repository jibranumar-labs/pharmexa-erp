<?php

namespace App\Services\Inventory;

use App\Models\SaleItem;
use App\Models\SerializedInventory;
use Illuminate\Database\Eloquent\Collection;

class FefoService
{
    /**
     * Allocate inventory using FEFO.
     */
    public function allocate(
        int $pharmacyId,
        int $medicineId,
        int $quantity
    ): Collection {

        return SerializedInventory::query()
            ->where('pharmacy_id', $pharmacyId)
            ->where('medicine_id', $medicineId)
            ->where('status', 'available')
            ->orderBy('expiry_date')
            ->orderBy('id')
            ->lockForUpdate()
            ->limit($quantity)
            ->get();
    }

    /**
     * Mark inventory as sold.
     */
    public function sell(
        SaleItem $saleItem
    ): void {

        $items = $this->allocate(
            $saleItem->pharmacy_id,
            $saleItem->medicine_id,
            $saleItem->quantity
        );

        /*
        |--------------------------------------------------------------------------
        | Safety Check
        |--------------------------------------------------------------------------
        |
        | Prevent selling more serialized items than are actually available.
        |
        */

        if ($items->count() < $saleItem->quantity) {

            abort(
                422,
                'Not enough serialized inventory available.'
            );

        }

        foreach ($items as $item) {

            $item->update([

                'sale_item_id' => $saleItem->id,

                'status' => 'sold',

                'sold_at' => now(),

            ]);

        }
    }
}