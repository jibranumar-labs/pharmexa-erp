<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\PharmacyMedicine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class SearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $search = trim((string) $request->q);

        if ($search === '') {
            return response()->json([]);
        }

        /*
        |--------------------------------------------------------------------------
        | Search Pharmacy Inventory First
        |--------------------------------------------------------------------------
        |
        | This is important because the pharmacy can have its own barcode,
        | GTIN, SKU, name, etc. which may be different from the global
        | medicine catalogue.
        |
        */

        $pharmacyQuery = PharmacyMedicine::query()
            ->where('pharmacy_id', $pharmacyId)
            ->where(function ($query) use ($search) {

                $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('generic_name', 'like', "%{$search}%")
                    ->orWhere('brand_name', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");

                /*
                 * GTIN support.
                 *
                 * Only search this column when it actually exists in the
                 * database, so the search never breaks on installations
                 * where GTIN has not been added yet.
                 */
                if (Schema::hasColumn('pharmacy_medicines', 'gtin')) {
                    $query->orWhere(
                        'gtin',
                        'like',
                        "%{$search}%"
                    );
                }

                /*
                 * Old barcode support.
                 *
                 * If your database already has an old_barcode column,
                 * it will automatically be searchable.
                 */
                if (Schema::hasColumn('pharmacy_medicines', 'old_barcode')) {
                    $query->orWhere(
                        'old_barcode',
                        'like',
                        "%{$search}%"
                    );
                }
            })
            ->with('supplier:id,name')
            ->limit(10)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | IDs Found Through Pharmacy Inventory
        |--------------------------------------------------------------------------
        */

        $pharmacyMedicineIds = $pharmacyQuery
            ->pluck('medicine_id')
            ->filter()
            ->unique()
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Search Global Medicine Catalogue
        |--------------------------------------------------------------------------
        |
        | Search global products too.
        |
        */

        $medicines = Medicine::query()
            ->with([
                'category:id,name',
                'manufacturer:id,name',
                'unit:id,name',
            ])
            ->where(function ($query) use (
                $search,
                $pharmacyMedicineIds
            ) {

                $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('generic_name', 'like', "%{$search}%")
                    ->orWhere('brand_name', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");

                /*
                 * GTIN on global medicines, when available.
                 */
                if (Schema::hasColumn('medicines', 'gtin')) {
                    $query->orWhere(
                        'gtin',
                        'like',
                        "%{$search}%"
                    );
                }

                /*
                 * Old barcode on global medicines, when available.
                 */
                if (Schema::hasColumn('medicines', 'old_barcode')) {
                    $query->orWhere(
                        'old_barcode',
                        'like',
                        "%{$search}%"
                    );
                }

                /*
                 * If the pharmacy search found a product through its
                 * pharmacy-specific barcode / GTIN / SKU, include it.
                 */
                if ($pharmacyMedicineIds->isNotEmpty()) {
                    $query->orWhereIn(
                        'id',
                        $pharmacyMedicineIds
                    );
                }
            })
            ->orderBy('name')
            ->limit(10)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Load Pharmacy Inventory For All Results
        |--------------------------------------------------------------------------
        */

        $medicineIds = $medicines
            ->pluck('id')
            ->values();

        $pharmacyMedicines = PharmacyMedicine::query()
            ->where('pharmacy_id', $pharmacyId)
            ->whereIn('medicine_id', $medicineIds)
            ->with('supplier:id,name')
            ->get()
            ->keyBy('medicine_id');

        /*
        |--------------------------------------------------------------------------
        | Build Search Response
        |--------------------------------------------------------------------------
        */

        $results = $medicines->map(
            function ($medicine) use ($pharmacyMedicines) {

                $inventory = $pharmacyMedicines->get(
                    $medicine->id
                );

                /*
                |--------------------------------------------------------------------------
                | Stock
                |--------------------------------------------------------------------------
                */

                $stockQuantity = $inventory
                    ? (int) $inventory->stock_quantity
                    : 0;

                $minimumStock = $inventory
                    ? (int) $inventory->minimum_stock
                    : 10;

                if ($stockQuantity <= 0) {
                    $stockStatus = 'Out of Stock';
                } elseif ($stockQuantity <= $minimumStock) {
                    $stockStatus = 'Low Stock';
                } else {
                    $stockStatus = 'In Stock';
                }

                /*
                |--------------------------------------------------------------------------
                | Pharmacy-Specific Values
                |--------------------------------------------------------------------------
                */

                $name =
                    $inventory?->name
                    ?? $medicine->name;

                $genericName =
                    $inventory?->generic_name
                    ?? $medicine->generic_name;

                $brandName =
                    $inventory?->brand_name
                    ?? $medicine->brand_name;

                $barcode =
                    $inventory?->barcode
                    ?? $medicine->barcode;

                $sku =
                    $inventory?->sku
                    ?? $medicine->sku;

                /*
                 * GTIN
                 */
                $gtin = null;

                if ($inventory && Schema::hasColumn(
                    'pharmacy_medicines',
                    'gtin'
                )) {
                    $gtin = $inventory->gtin;
                }

                if (
                    ! $gtin &&
                    Schema::hasColumn('medicines', 'gtin')
                ) {
                    $gtin = $medicine->gtin;
                }

                /*
                 * Old barcode.
                 *
                 * This is returned when your database has an
                 * old_barcode column.
                 */
                $oldBarcode = null;

                if (
                    $inventory &&
                    Schema::hasColumn(
                        'pharmacy_medicines',
                        'old_barcode'
                    )
                ) {
                    $oldBarcode = $inventory->old_barcode;
                }

                if (
                    ! $oldBarcode &&
                    Schema::hasColumn(
                        'medicines',
                        'old_barcode'
                    )
                ) {
                    $oldBarcode = $medicine->old_barcode;
                }

                /*
                |--------------------------------------------------------------------------
                | Prices
                |--------------------------------------------------------------------------
                */

                $purchasePrice =
                    $inventory?->purchase_price
                    ?? $medicine->purchase_price;

                $sellingPrice =
                    $inventory?->selling_price
                    ?? $medicine->selling_price;

                /*
                |--------------------------------------------------------------------------
                | Batch / Expiry / Image
                |--------------------------------------------------------------------------
                */

                $batchNumber =
                    $inventory?->batch_number;

                $expiryDate =
                    $inventory?->expiry_date;

                $image =
                    $inventory?->image
                    ?? $medicine->image;

                /*
                |--------------------------------------------------------------------------
                | Active Status
                |--------------------------------------------------------------------------
                */

                $isActive = $inventory
                    ? (bool) $inventory->is_active
                    : (bool) $medicine->is_active;

                /*
                |--------------------------------------------------------------------------
                | Response
                |--------------------------------------------------------------------------
                */

                return [
                    'id' =>
                        $medicine->id,

                    'name' =>
                        $name,

                    'generic_name' =>
                        $genericName,

                    'brand_name' =>
                        $brandName,

                    'barcode' =>
                        $barcode,

                    'old_barcode' =>
                        $oldBarcode,

                    'gtin' =>
                        $gtin,

                    'sku' =>
                        $sku,

                    'batch_number' =>
                        $batchNumber,

                    'purchase_price' =>
                        $purchasePrice,

                    'selling_price' =>
                        $sellingPrice,

                    'stock_quantity' =>
                        $stockQuantity,

                    'minimum_stock' =>
                        $minimumStock,

                    'stock_status' =>
                        $stockStatus,

                    'expiry_date' =>
                        $expiryDate
                            ? $expiryDate->format('d M Y')
                            : null,

                    'image' =>
                        $image,

                    'category' =>
                        $medicine->category?->name,

                    'manufacturer' =>
                        $medicine->manufacturer?->name,

                    'supplier' =>
                        $inventory?->supplier?->name,

                    'unit' =>
                        $medicine->unit?->name,

                    'is_active' =>
                        $isActive,
                ];
            }
        );

        return response()->json($results->values());
    }
}