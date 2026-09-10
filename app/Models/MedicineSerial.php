<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicineSerial extends Model
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
    ];

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

    public function saleItem()
    {
        return $this->belongsTo(SaleItem::class);
    }

    public function purchaseItem()
    {
        return $this->belongsTo(PurchaseItem::class);
    }

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }
}