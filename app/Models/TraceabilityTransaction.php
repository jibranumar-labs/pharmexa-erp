<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TraceabilityTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'pharmacy_id',
        'sale_id',
        'operation',
        'status',
        'reference_number',
        'response_code',
        'response_message',
        'sent_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
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

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function items()
    {
        return $this->hasMany(TraceabilityTransactionItem::class);
    }
}