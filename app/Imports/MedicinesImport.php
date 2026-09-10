<?php

namespace App\Imports;

use App\Models\Category;
use App\Models\Manufacturer;
use App\Models\Medicine;
use App\Models\PharmacyMedicine;
use App\Models\Supplier;
use App\Models\Unit;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;

class MedicinesImport implements ToCollection
{
    public function collection(Collection $rows): void
    {
        $user = auth()->user();

        abort_if(! $user, 403);

        $pharmacyId = $user->pharmacy_id;

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Import Only
        |--------------------------------------------------------------------------
        |
        | Imported quantity belongs to pharmacy_medicines.
        | medicines.stock_quantity must NOT become operational pharmacy stock.
        |
        */

        abort_if(! $pharmacyId, 403);

        $manufacturer = Manufacturer::firstOrCreate(
            [
                'name' => 'Unknown Manufacturer',
            ],
            [
                'is_active' => true,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Default Supplier
        |--------------------------------------------------------------------------
        |
        | Suppliers are pharmacy-specific.
        |
        */

        $supplier = Supplier::firstOrCreate(
            [
                'pharmacy_id' => $pharmacyId,
                'name' => 'Default Import Supplier',
            ],
            [
                'company_name' => 'Imported Medicine Supplier',
                'is_active' => true,
            ]
        );

        $counter = 1;

        foreach ($rows as $index => $row) {

            /*
             * Skip Excel heading row.
             */
            if ($index === 0) {
                continue;
            }

            $qty = $row[0] ?? 0;
            $price = $row[1] ?? 0;
            $name = trim((string) ($row[2] ?? ''));
            $productId = trim((string) ($row[3] ?? ''));

            if ($name === '') {
                continue;
            }

            $quantity = is_numeric($qty)
                ? max(0, (int) $qty)
                : 0;

            $sellingPrice = is_numeric($price)
                ? max(0, (float) $price)
                : 0;

            $category = $this->categoryFor($name);
            $unit = $this->unitFor($name);
            $medicineType = $this->detectType($name);

            DB::transaction(function () use (
                $pharmacyId,
                $manufacturer,
                $supplier,
                $category,
                $unit,
                $medicineType,
                $name,
                $productId,
                $quantity,
                $sellingPrice,
                $counter
            ) {

                /*
                |--------------------------------------------------------------------------
                | Barcode
                |--------------------------------------------------------------------------
                |
                | medicines.barcode is globally unique.
                |
                | If Excel contains a barcode, use it to locate an existing
                | global/current-pharmacy product.
                |
                | If no barcode exists, generate a globally unique one.
                |
                */

                $barcode = $productId !== ''
                    ? $productId
                    : $this->generateUniqueBarcode();

                $medicine = Medicine::query()
                    ->where('barcode', $barcode)
                    ->first();

                /*
                |--------------------------------------------------------------------------
                | Existing Medicine
                |--------------------------------------------------------------------------
                |
                | We may use:
                |
                | - Global medicine
                | - Medicine belonging to current pharmacy
                |
                | We must NOT attach another pharmacy's local medicine.
                |
                */

                if (
                    $medicine &&
                    $medicine->pharmacy_id !== null &&
                    (int) $medicine->pharmacy_id !== (int) $pharmacyId
                ) {
                    /*
                     * The barcode belongs to another pharmacy's local product.
                     * Because medicines.barcode is globally unique, this import
                     * cannot safely create another product using that barcode.
                     */
                    return;
                }

                /*
                |--------------------------------------------------------------------------
                | Create Product Identity
                |--------------------------------------------------------------------------
                */

                if (! $medicine) {

                    $sku = $this->generateUniqueSku();

                    $medicine = Medicine::create([
                        'pharmacy_id' => $pharmacyId,

                        'barcode' => $barcode,
                        'sku' => $sku,

                        'name' => $name,
                        'generic_name' => null,
                        'brand_name' => null,
                        'medicine_type' => $medicineType,

                        'category_id' => $category->id,
                        'manufacturer_id' => $manufacturer->id,
                        'supplier_id' => $supplier->id,
                        'unit_id' => $unit->id,

                        'purchase_price' => 0,
                        'selling_price' => $sellingPrice,
                        'tax_percentage' => 0,

                        /*
                         * IMPORTANT:
                         * Operational stock belongs to pharmacy_medicines.
                         */
                        'stock_quantity' => 0,

                        'minimum_stock' => 10,

                        'batch_number' => null,
                        'expiry_date' => null,

                        'description' =>
                            'Imported from medicine Excel file.',

                        'is_active' => true,
                    ]);
                }

                /*
                |--------------------------------------------------------------------------
                | Pharmacy Inventory
                |--------------------------------------------------------------------------
                |
                | This is the operational inventory record.
                |
                */

                $pharmacyMedicine = PharmacyMedicine::query()
                    ->where('pharmacy_id', $pharmacyId)
                    ->where('medicine_id', $medicine->id)
                    ->lockForUpdate()
                    ->first();

                if (! $pharmacyMedicine) {

                    /*
                     * Prefer the master barcode/SKU when available.
                     *
                     * Since pharmacy_medicines uniqueness is per pharmacy,
                     * the same global barcode can be used by different pharmacies.
                     */

                    $pharmacyMedicine = new PharmacyMedicine();

                    $pharmacyMedicine->pharmacy_id = $pharmacyId;
                    $pharmacyMedicine->medicine_id = $medicine->id;

                    $pharmacyMedicine->barcode = $medicine->barcode;
                    $pharmacyMedicine->sku = $medicine->sku;

                    $pharmacyMedicine->name =
                        $medicine->name ?? $name;

                    $pharmacyMedicine->generic_name =
                        $medicine->generic_name;

                    $pharmacyMedicine->brand_name =
                        $medicine->brand_name;

                    $pharmacyMedicine->medicine_type =
                        $medicine->medicine_type ?? $medicineType;

                    $pharmacyMedicine->supplier_id =
                        $supplier->id;

                    $pharmacyMedicine->purchase_price =
                        $medicine->purchase_price ?? 0;

                    $pharmacyMedicine->selling_price =
                        $sellingPrice;

                    $pharmacyMedicine->tax_percentage =
                        $medicine->tax_percentage ?? 0;

                    $pharmacyMedicine->stock_quantity =
                        $quantity;

                    $pharmacyMedicine->minimum_stock =
                        $medicine->minimum_stock ?? 10;

                    $pharmacyMedicine->batch_number =
                        $medicine->batch_number;

                    $pharmacyMedicine->expiry_date =
                        $medicine->expiry_date;

                    $pharmacyMedicine->description =
                        $medicine->description
                        ?? 'Imported from medicine Excel file.';

                    $pharmacyMedicine->image =
                        $medicine->image;

                    $pharmacyMedicine->is_active = true;

                    $pharmacyMedicine->save();

                } else {

                    /*
                    |--------------------------------------------------------------------------
                    | Existing Pharmacy Inventory
                    |--------------------------------------------------------------------------
                    |
                    | Import represents the current quantity from the Excel file,
                    | so replace the inventory quantity instead of adding it.
                    |
                    */

                    $pharmacyMedicine->name = $name;

                    $pharmacyMedicine->selling_price =
                        $sellingPrice;

                    $pharmacyMedicine->supplier_id =
                        $supplier->id;

                    $pharmacyMedicine->stock_quantity =
                        $quantity;

                    $pharmacyMedicine->is_active = true;

                    $pharmacyMedicine->save();
                }
            });

            $counter++;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    private function categoryFor(string $name): Category
    {
        $type = $this->detectType($name);

        return Category::firstOrCreate(
            [
                'name' => $type . 's',
            ],
            [
                'description' =>
                    'Auto-created during smart medicine import',

                'is_active' => true,
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Unit
    |--------------------------------------------------------------------------
    */

    private function unitFor(string $name): Unit
    {
        $upper = strtoupper($name);

        if (str_contains($upper, 'TAB')) {
            return Unit::firstOrCreate(
                ['name' => 'Tablet'],
                [
                    'short_name' => 'Tab',
                    'is_active' => true,
                ]
            );
        }

        if (str_contains($upper, 'CAP')) {
            return Unit::firstOrCreate(
                ['name' => 'Capsule'],
                [
                    'short_name' => 'Cap',
                    'is_active' => true,
                ]
            );
        }

        if (
            str_contains($upper, 'SYR') ||
            str_contains($upper, 'ML')
        ) {
            return Unit::firstOrCreate(
                ['name' => 'Bottle'],
                [
                    'short_name' => 'Btl',
                    'is_active' => true,
                ]
            );
        }

        if (
            str_contains($upper, 'INJ') ||
            str_contains($upper, 'AMP')
        ) {
            return Unit::firstOrCreate(
                ['name' => 'Ampoule'],
                [
                    'short_name' => 'Amp',
                    'is_active' => true,
                ]
            );
        }

        if (
            str_contains($upper, 'CREAM') ||
            str_contains($upper, 'GEL') ||
            str_contains($upper, 'OINT')
        ) {
            return Unit::firstOrCreate(
                ['name' => 'Tube'],
                [
                    'short_name' => 'Tube',
                    'is_active' => true,
                ]
            );
        }

        if (str_contains($upper, 'DROP')) {
            return Unit::firstOrCreate(
                ['name' => 'Drops'],
                [
                    'short_name' => 'Drp',
                    'is_active' => true,
                ]
            );
        }

        if (str_contains($upper, 'SACHET')) {
            return Unit::firstOrCreate(
                ['name' => 'Sachet'],
                [
                    'short_name' => 'Sct',
                    'is_active' => true,
                ]
            );
        }

        return Unit::firstOrCreate(
            ['name' => 'Piece'],
            [
                'short_name' => 'Pcs',
                'is_active' => true,
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Detect Medicine Type
    |--------------------------------------------------------------------------
    */

    private function detectType(string $name): string
    {
        $upper = strtoupper($name);

        if (str_contains($upper, 'CAP')) {
            return 'Capsule';
        }

        if (
            str_contains($upper, 'SYR') ||
            str_contains($upper, 'SYRUP')
        ) {
            return 'Syrup';
        }

        if (
            str_contains($upper, 'INJ') ||
            str_contains($upper, 'AMP')
        ) {
            return 'Injection';
        }

        if (
            str_contains($upper, 'CREAM') ||
            str_contains($upper, 'OINT')
        ) {
            return 'Cream';
        }

        if (str_contains($upper, 'GEL')) {
            return 'Gel';
        }

        if (str_contains($upper, 'DROP')) {
            return 'Drops';
        }

        if (str_contains($upper, 'SACHET')) {
            return 'Other';
        }

        if (str_contains($upper, 'POWDER')) {
            return 'Powder';
        }

        if (str_contains($upper, 'TAB')) {
            return 'Tablet';
        }

        return 'Other';
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Globally Unique Barcode
    |--------------------------------------------------------------------------
    */

    private function generateUniqueBarcode(): string
    {
        do {
            $barcode =
                'AUTO-' .
                strtoupper(bin2hex(random_bytes(6)));
        } while (
            Medicine::query()
                ->where('barcode', $barcode)
                ->exists()
        );

        return $barcode;
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Globally Unique SKU
    |--------------------------------------------------------------------------
    */

    private function generateUniqueSku(): string
    {
        do {
            $sku =
                'MED-' .
                strtoupper(bin2hex(random_bytes(6)));
        } while (
            Medicine::query()
                ->where('sku', $sku)
                ->exists()
        );

        return $sku;
    }
}