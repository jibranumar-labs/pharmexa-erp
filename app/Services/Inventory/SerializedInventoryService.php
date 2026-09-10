<?php

namespace App\Services\Inventory;

use App\Models\PurchaseItem;
use App\Models\SerializedInventory;

class SerializedInventoryService
{
    /**
     * Create serialized inventory records from a purchase item.
     */
    public function create(PurchaseItem $purchaseItem): void
    {
        // Ensure the medicine relationship is loaded
        $purchaseItem->loadMissing('medicine');

        /*
        |--------------------------------------------------------------------------
        | Temporary Implementation
        |--------------------------------------------------------------------------
        |
        | One serialized inventory record is created for each purchased unit.
        | Temporary serial numbers are generated until real GS1 DataMatrix
        | scanning or supplier import is implemented.
        |
        */

        for ($i = 1; $i <= $purchaseItem->quantity; $i++) {

            SerializedInventory::create([

                'pharmacy_id' => $purchaseItem->pharmacy_id,

                'medicine_id' => $purchaseItem->medicine_id,

                'purchase_item_id' => $purchaseItem->id,

                'gtin' => $purchaseItem->medicine->gtin ?? null,

                'serial_number' => uniqid('TMP-'),

                'batch_number' => $purchaseItem->batch_number,

                'expiry_date' => $purchaseItem->expiry_date,

                'status' => 'available',

            ]);
        }
    }
}