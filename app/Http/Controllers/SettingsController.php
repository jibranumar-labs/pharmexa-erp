<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Settings Page
    |--------------------------------------------------------------------------
    */

    public function index(): Response
    {
        $pharmacyId = $this->pharmacyId();

        $setting = Setting::firstOrCreate(
            [
                'pharmacy_id' => $pharmacyId,
            ],
            $this->defaults()
        );

        return Inertia::render('Settings/Index', [
            'setting' => $setting,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Settings
    |--------------------------------------------------------------------------
    */

    public function update(Request $request): RedirectResponse
    {
        /*
        |--------------------------------------------------------------------------
        | ALWAYS use the logged-in user's pharmacy
        |--------------------------------------------------------------------------
        |
        | This is extremely important for a multi-pharmacy system.
        | A pharmacist must only update the settings belonging to their
        | own pharmacy.
        |
        */

        $pharmacyId = $this->pharmacyId();

        $validated = $request->validate([

            /*
            |--------------------------------------------------------------------------
            | Pharmacy Information
            |--------------------------------------------------------------------------
            */

            'pharmacy_name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'pharmacy_name_ar' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'branch_name' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'branch_name_ar' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'owner_name' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'pharmacist_name' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'phone' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'whatsapp' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'email' => [
                'sometimes',
                'nullable',
                'email',
                'max:255',
            ],

            'website' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'slogan' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'slogan_ar' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'address' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'address_ar' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'city' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'country' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            /*
            |--------------------------------------------------------------------------
            | Saudi / Tax Settings
            |--------------------------------------------------------------------------
            */

            'vat_number' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'tax_percentage' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
                'max:100',
            ],

            'commercial_registration' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'pharmacy_license' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'zatca_qr' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            /*
            |--------------------------------------------------------------------------
            | General Settings
            |--------------------------------------------------------------------------
            */

            'currency' => [
                'sometimes',
                'string',
                'max:20',
            ],

            'currency_symbol' => [
                'sometimes',
                'nullable',
                'string',
                'max:20',
            ],

            'timezone' => [
                'sometimes',
                'string',
                'max:255',
            ],

            'language' => [
                'sometimes',
                'string',
                'max:20',
            ],

            /*
            |--------------------------------------------------------------------------
            | Receipt Settings
            |--------------------------------------------------------------------------
            */

            'receipt_size' => [
                'sometimes',
                'in:58,80',
            ],

            'default_printer' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'auto_print_receipt' => [
                'sometimes',
                'boolean',
            ],

            'auto_print_sticker' => [
                'sometimes',
                'boolean',
            ],

            'show_logo' => [
                'sometimes',
                'boolean',
            ],

            'show_barcode' => [
                'sometimes',
                'boolean',
            ],

            'show_qr' => [
                'sometimes',
                'boolean',
            ],

            'show_pharmacist' => [
                'sometimes',
                'boolean',
            ],

            'show_patient_name' => [
                'sometimes',
                'boolean',
            ],

            'show_expiry_date' => [
                'sometimes',
                'boolean',
            ],

            'show_sticker_logo' => [
                'sometimes',
                'boolean',
            ],

            /*
            |--------------------------------------------------------------------------
            | Receipt Text
            |--------------------------------------------------------------------------
            */

            'receipt_header' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'receipt_header_ar' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'receipt_footer' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'receipt_footer_ar' => [
                'sometimes',
                'nullable',
                'string',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Boolean Fields
        |--------------------------------------------------------------------------
        */

        $booleanFields = [
            'auto_print_receipt',
            'auto_print_sticker',
            'show_logo',
            'show_barcode',
            'show_qr',
            'show_pharmacist',
            'show_patient_name',
            'show_expiry_date',
            'show_sticker_logo',
        ];

        foreach ($booleanFields as $field) {
            if ($request->has($field)) {
                $validated[$field] = $request->boolean($field);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Get ONLY Current Pharmacy Settings
        |--------------------------------------------------------------------------
        */

        $setting = Setting::firstOrCreate(
            [
                'pharmacy_id' => $pharmacyId,
            ],
            $this->defaults()
        );

        /*
        |--------------------------------------------------------------------------
        | Update ONLY Current Pharmacy Settings
        |--------------------------------------------------------------------------
        */

        $setting->update($validated);

        /*
        |--------------------------------------------------------------------------
        | Activity Log
        |--------------------------------------------------------------------------
        */

        ActivityLog::record(
            'Settings',
            'Updated',
            $setting->pharmacy_name,
            'Pharmacy settings updated successfully.'
        );

        return back()->with(
            'success',
            'Pharmacy settings updated successfully.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Current Pharmacy ID
    |--------------------------------------------------------------------------
    |
    | Every pharmacy-specific operation must use this method.
    |
    */

    private function pharmacyId(): int
    {
        $user = auth()->user();

        abort_if(
            ! $user,
            403,
            'You must be logged in.'
        );

        abort_if(
            ! $user->pharmacy_id,
            403,
            'Your account is not assigned to a pharmacy.'
        );

        return (int) $user->pharmacy_id;
    }

    /*
    |--------------------------------------------------------------------------
    | Default Settings
    |--------------------------------------------------------------------------
    */

    private function defaults(): array
    {
        return [

            /*
            |--------------------------------------------------------------------------
            | Pharmacy
            |--------------------------------------------------------------------------
            */

            'pharmacy_name' => 'PHARMEXA',

            'pharmacy_name_ar' => 'صيدلية فارمكسا',

            'branch_name' => null,

            'branch_name_ar' => null,

            'owner_name' => null,

            'pharmacist_name' => null,

            'phone' => null,

            'whatsapp' => null,

            'email' => null,

            'website' => null,

            'slogan' => null,

            'slogan_ar' => null,

            'address' => null,

            'address_ar' => null,

            'city' => 'Riyadh',

            'country' => 'Saudi Arabia',

            /*
            |--------------------------------------------------------------------------
            | Saudi / Tax
            |--------------------------------------------------------------------------
            */

            'vat_number' => null,

            'tax_percentage' => 15,

            'commercial_registration' => null,

            'pharmacy_license' => null,

            'zatca_qr' => null,

            /*
            |--------------------------------------------------------------------------
            | Currency / Locale
            |--------------------------------------------------------------------------
            */

            'currency' => 'SAR',

            'currency_symbol' => 'SAR',

            'timezone' => 'Asia/Riyadh',

            'language' => 'en',

            /*
            |--------------------------------------------------------------------------
            | Receipt
            |--------------------------------------------------------------------------
            */

            'receipt_size' => '80',

            'default_printer' => null,

            'auto_print_receipt' => true,

            'auto_print_sticker' => false,

            'show_logo' => true,

            'show_barcode' => true,

            'show_qr' => true,

            'show_pharmacist' => true,

            'show_patient_name' => true,

            'show_expiry_date' => true,

            'show_sticker_logo' => false,

            /*
            |--------------------------------------------------------------------------
            | Branding
            |--------------------------------------------------------------------------
            */

            'logo' => null,

            'favicon' => null,

            /*
            |--------------------------------------------------------------------------
            | Receipt Text
            |--------------------------------------------------------------------------
            */

            'receipt_header' => null,

            'receipt_header_ar' => null,

            'receipt_footer' => null,

            'receipt_footer_ar' => null,
        ];
    }
}