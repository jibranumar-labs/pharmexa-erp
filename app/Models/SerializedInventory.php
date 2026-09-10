<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SerializedInventory extends Model
{
    protected $fillable = [

        'pharmacy_id',

        'medicine_id',

        'purchase_item_id',

        'sale_item_id',

        'gtin',

        'serial_number',

        'batch_number',

        'expiry_date',

        'status',

        'sold_at',

    ];

    protected $casts = [

        'expiry_date' => 'date',

        'sold_at' => 'datetime',

    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

    public function purchaseItem()
    {
        return $this->belongsTo(PurchaseItem::class);
    }

    public function saleItem()
    {
        return $this->belongsTo(SaleItem::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }

    public function isSold(): bool
    {
        return $this->status === 'sold';
    }

    public function isExpired(): bool
    {
        return $this->status === 'expired';
    }
}