<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PharmacyMedicine extends Model
{
    protected $fillable = [
        /*
        |--------------------------------------------------------------------------
        | Relationships
        |--------------------------------------------------------------------------
        */

        'pharmacy_id',
        'medicine_id',

        /*
        |--------------------------------------------------------------------------
        | Product Identity
        |--------------------------------------------------------------------------
        */

        'barcode',
        'gtin',
        'sku',

        'name',
        'generic_name',
        'brand_name',
        'medicine_type',

        /*
        |--------------------------------------------------------------------------
        | Supplier
        |--------------------------------------------------------------------------
        */

        'supplier_id',

        /*
        |--------------------------------------------------------------------------
        | Pricing
        |--------------------------------------------------------------------------
        */

        'purchase_price',
        'selling_price',
        'discount_percentage',
        'tax_percentage',

        /*
        |--------------------------------------------------------------------------
        | Stock
        |--------------------------------------------------------------------------
        */

        'stock_quantity',
        'minimum_stock',

        /*
        |--------------------------------------------------------------------------
        | Batch / Expiry
        |--------------------------------------------------------------------------
        */

        'batch_number',
        'expiry_date',

        /*
        |--------------------------------------------------------------------------
        | Extra
        |--------------------------------------------------------------------------
        */

        'description',
        'image',
        'is_active',
    ];

    protected $casts = [
        /*
        |--------------------------------------------------------------------------
        | Pricing
        |--------------------------------------------------------------------------
        */

        'purchase_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'tax_percentage' => 'decimal:2',

        /*
        |--------------------------------------------------------------------------
        | Stock
        |--------------------------------------------------------------------------
        */

        'stock_quantity' => 'integer',
        'minimum_stock' => 'integer',

        /*
        |--------------------------------------------------------------------------
        | Expiry
        |--------------------------------------------------------------------------
        */

        'expiry_date' => 'date',

        /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        */

        'is_active' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Pharmacy
    |--------------------------------------------------------------------------
    */

    public function pharmacy(): BelongsTo
    {
        return $this->belongsTo(Pharmacy::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Master Medicine
    |--------------------------------------------------------------------------
    */

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Supplier
    |--------------------------------------------------------------------------
    */

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Final Selling Price After Discount
    |--------------------------------------------------------------------------
    |
    | Example:
    | Selling price = 100 SAR
    | Discount = 3%
    | Final price = 97 SAR
    |
    */

    public function getDiscountAmountAttribute(): float
    {
        $price = (float) ($this->selling_price ?? 0);
        $percentage = (float) ($this->discount_percentage ?? 0);

        return round(
            $price * ($percentage / 100),
            2
        );
    }

    public function getDiscountedSellingPriceAttribute(): float
    {
        $price = (float) ($this->selling_price ?? 0);
        $discount = (float) ($this->discount_percentage ?? 0);

        return round(
            max(
                0,
                $price - ($price * ($discount / 100))
            ),
            2
        );
    }
}