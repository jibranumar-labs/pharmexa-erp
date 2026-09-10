<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Setting extends Model
{
    protected $fillable = [

        /*
        |--------------------------------------------------------------------------
        | Tenant / Pharmacy
        |--------------------------------------------------------------------------
        */

        'pharmacy_id',

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Information
        |--------------------------------------------------------------------------
        */

        'pharmacy_name',
        'pharmacy_name_ar',

        'branch_name',
        'branch_name_ar',

        'owner_name',
        'pharmacist_name',

        'phone',
        'whatsapp',
        'email',
        'website',

        'slogan',
        'slogan_ar',

        /*
        |--------------------------------------------------------------------------
        | Address
        |--------------------------------------------------------------------------
        */

        'address',
        'address_ar',

        'city',
        'country',

        /*
        |--------------------------------------------------------------------------
        | Saudi Legal
        |--------------------------------------------------------------------------
        */

        'vat_number',
        'tax_percentage',
        'commercial_registration',
        'pharmacy_license',
        'zatca_qr',

        /*
        |--------------------------------------------------------------------------
        | Receipt
        |--------------------------------------------------------------------------
        */

        'receipt_size',
        'default_printer',

        'auto_print_receipt',
        'auto_print_sticker',

        'show_logo',
        'show_barcode',
        'show_qr',
        'show_pharmacist',
        'show_patient_name',
        'show_expiry_date',
        'show_sticker_logo',

        /*
        |--------------------------------------------------------------------------
        | Regional
        |--------------------------------------------------------------------------
        */

        'currency',
        'currency_symbol',
        'timezone',
        'language',

        /*
        |--------------------------------------------------------------------------
        | Branding
        |--------------------------------------------------------------------------
        */

        'logo',
        'favicon',

        /*
        |--------------------------------------------------------------------------
        | Receipt Header
        |--------------------------------------------------------------------------
        */

        'receipt_header',
        'receipt_header_ar',

        /*
        |--------------------------------------------------------------------------
        | Receipt Footer
        |--------------------------------------------------------------------------
        */

        'receipt_footer',
        'receipt_footer_ar',
    ];

    protected $casts = [

        /*
        |--------------------------------------------------------------------------
        | Numeric
        |--------------------------------------------------------------------------
        */

        'tax_percentage' => 'decimal:2',

        /*
        |--------------------------------------------------------------------------
        | Boolean
        |--------------------------------------------------------------------------
        */

        'auto_print_receipt' => 'boolean',
        'auto_print_sticker' => 'boolean',

        'show_logo' => 'boolean',
        'show_barcode' => 'boolean',
        'show_qr' => 'boolean',
        'show_pharmacist' => 'boolean',
        'show_patient_name' => 'boolean',
        'show_expiry_date' => 'boolean',
        'show_sticker_logo' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Pharmacy that owns these settings.
     */
    public function pharmacy(): BelongsTo
    {
        return $this->belongsTo(Pharmacy::class);
    }
}