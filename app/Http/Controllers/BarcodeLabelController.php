<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Medicine;
use App\Models\PharmacyMedicine;
use App\Models\Setting;

class BarcodeLabelController extends Controller
{
    public function show(Medicine $medicine)
    {
        $user = auth()->user();

        abort_if(! $user, 403);

        /*
        |--------------------------------------------------------------------------
        | Super Owner
        |--------------------------------------------------------------------------
        */

        if ($this->isSuperOwner($user)) {

            ActivityLog::record(
                'Barcode Labels',
                'Printed',
                $medicine->name,
                'Master medicine barcode label printed.'
            );

            return view('print.medicine-label', [
                'medicine' => $medicine,
                'pharmacyName' => 'PHARMEXA',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Current Pharmacy
        |--------------------------------------------------------------------------
        */

        $pharmacyId = $user->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Settings
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        | Pharmacy branding comes from the pharmacy-specific settings record.
        |
        | Example:
        | AL NOOR
        | ROUH CARE
        | TEST AL NOOR PHARMACY
        |
        */

        $setting = Setting::where(
            'pharmacy_id',
            $pharmacyId
        )->first();

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Name
        |--------------------------------------------------------------------------
        */

        $pharmacyName =
            $setting?->pharmacy_name
            ?: 'PHARMEXA';

        /*
        |--------------------------------------------------------------------------
        | Medicine Access
        |--------------------------------------------------------------------------
        |
        | Global medicine:
        | pharmacy_id = NULL
        |
        | Local medicine:
        | pharmacy_id = current pharmacy
        |
        */

        abort_unless(
            $medicine->pharmacy_id === null
            || (int) $medicine->pharmacy_id === (int) $pharmacyId,
            403
        );

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Medicine
        |--------------------------------------------------------------------------
        |
        | Barcode, SKU, selling price and expiry are pharmacy-specific.
        |
        */

        $pharmacyMedicine = PharmacyMedicine::query()
            ->where('pharmacy_id', $pharmacyId)
            ->where('medicine_id', $medicine->id)
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Label Medicine
        |--------------------------------------------------------------------------
        */

        $labelMedicine = clone $medicine;

        if ($pharmacyMedicine) {

            /*
             * Pharmacy-specific medicine name
             */
            $labelMedicine->name =
                $pharmacyMedicine->name
                ?: $medicine->name;

            /*
             * Pharmacy-specific barcode
             *
             * IMPORTANT:
             * If you edit the barcode later, the sticker
             * automatically uses the new barcode.
             */
            $labelMedicine->barcode =
                $pharmacyMedicine->barcode
                ?: $medicine->barcode;

            /*
             * Pharmacy-specific SKU
             */
            $labelMedicine->sku =
                $pharmacyMedicine->sku
                ?: $medicine->sku;

            /*
             * Pharmacy-specific selling price
             */
            $labelMedicine->selling_price =
                $pharmacyMedicine->selling_price
                ?? $medicine->selling_price;

            /*
             * Pharmacy-specific expiry
             */
            $labelMedicine->expiry_date =
                $pharmacyMedicine->expiry_date
                ?? $medicine->expiry_date;
        }

        /*
        |--------------------------------------------------------------------------
        | Activity Log
        |--------------------------------------------------------------------------
        */

        ActivityLog::record(
            'Barcode Labels',
            'Printed',
            $labelMedicine->name,
            'Medicine barcode label printed.'
        );

        /*
        |--------------------------------------------------------------------------
        | Print View
        |--------------------------------------------------------------------------
        */

        return view('print.medicine-label', [
            'medicine' => $labelMedicine,
            'pharmacyName' => $pharmacyName,
        ]);
    }

    private function isSuperOwner($user): bool
    {
        return method_exists($user, 'isSuperOwner')
            && $user->isSuperOwner();
    }
}