<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SaleReturn extends Model
{
    protected $fillable = [
        'return_number',
        'sale_id',
        'user_id',
        'refund_amount',
        'reason',
        'return_date',
        'notes',
    ];

    protected $casts = [
        'refund_amount' => 'decimal:2',
        'return_date' => 'date',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Sale this return belongs to.
     *
     * Tenant ownership is determined through:
     * SaleReturn -> Sale -> pharmacy_id
     */
    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    /**
     * User who created the return.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Items included in this sale return.
     */
    public function items(): HasMany
    {
        return $this->hasMany(SaleReturnItem::class);
    }
}