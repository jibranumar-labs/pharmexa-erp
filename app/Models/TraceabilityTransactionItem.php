<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TraceabilityTransactionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'traceability_transaction_id',
        'sale_item_id',
        'medicine_id',
        'gtin',
        'serial_number',
        'batch_number',
        'expiry_date',
        'quantity',
        'status',
        'response_code',
        'response_message',
    ];

    protected $casts = [
        'expiry_date' => 'date',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function transaction()
    {
        return $this->belongsTo(
            TraceabilityTransaction::class,
            'traceability_transaction_id'
        );
    }

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

    public function saleItem()
    {
        return $this->belongsTo(SaleItem::class);
    }
}