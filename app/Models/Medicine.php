<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Medicine extends Model
{
    protected $fillable = [
        'pharmacy_id',

        /*
        |--------------------------------------------------------------------------
        | Global / Product Identity
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
        | Relationships
        |--------------------------------------------------------------------------
        */

        'category_id',
        'manufacturer_id',
        'supplier_id',
        'unit_id',

        /*
        |--------------------------------------------------------------------------
        | Pricing
        |--------------------------------------------------------------------------
        */

        'purchase_price',
        'selling_price',
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
        | Batch / Expiry / GS1
        |--------------------------------------------------------------------------
        */

        'batch_number',
        'expiry_date',
        'serial_number',

        /*
        |--------------------------------------------------------------------------
        | Extra
        |--------------------------------------------------------------------------
        */

        'description',
        'image',
        'is_active',

        /*
        |--------------------------------------------------------------------------
        | Serialization
        |--------------------------------------------------------------------------
        */

        'is_serialized',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'tax_percentage' => 'decimal:2',

        'stock_quantity' => 'integer',
        'minimum_stock' => 'integer',

        'expiry_date' => 'date',

        'is_active' => 'boolean',

        'is_serialized' => 'boolean',
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
    | Category
    |--------------------------------------------------------------------------
    */

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Manufacturer
    |--------------------------------------------------------------------------
    */

    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(Manufacturer::class);
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
    | Unit
    |--------------------------------------------------------------------------
    */

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Pharmacy Medicines
    |--------------------------------------------------------------------------
    */

    public function pharmacyMedicines(): HasMany
    {
        return $this->hasMany(PharmacyMedicine::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Stock Movements
    |--------------------------------------------------------------------------
    */

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Global / Local Helpers
    |--------------------------------------------------------------------------
    */

    public function isGlobal(): bool
    {
        return $this->pharmacy_id === null;
    }

    public function isLocal(): bool
    {
        return $this->pharmacy_id !== null;
    }

    public function pharmacyMedicine(?int $pharmacyId = null): ?PharmacyMedicine
    {
        $pharmacyId ??= auth()->user()?->pharmacy_id;

        if (! $pharmacyId) {
            return null;
        }

        return $this->pharmacyMedicines()
            ->where('pharmacy_id', $pharmacyId)
            ->first();
    }

    /*
    |--------------------------------------------------------------------------
    | Serialization Helper
    |--------------------------------------------------------------------------
    */

    public function isSerialized(): bool
    {
        return (bool) $this->is_serialized;
    }
}