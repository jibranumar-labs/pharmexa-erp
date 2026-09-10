<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyCashRecord extends Model
{
    protected $fillable = [
        'pharmacy_id',
        'record_date',

        // System figures
        'cash_sales',
        'shabaka_sales',
        'other_sales',
        'total_sales',
        'expenses',

        // Physical collection
        'physical_cash',
        'physical_shabaka',
        'physical_others',
        'net_cash',

        // Differences
        'cash_difference',
        'shabaka_difference',
        'other_difference',

        'notes',
        'user_id',
    ];

    protected $casts = [
        'record_date' => 'date',

        'cash_sales' => 'decimal:2',
        'shabaka_sales' => 'decimal:2',
        'other_sales' => 'decimal:2',
        'total_sales' => 'decimal:2',
        'expenses' => 'decimal:2',

        'physical_cash' => 'decimal:2',
        'physical_shabaka' => 'decimal:2',
        'physical_others' => 'decimal:2',
        'net_cash' => 'decimal:2',

        'cash_difference' => 'decimal:2',
        'shabaka_difference' => 'decimal:2',
        'other_difference' => 'decimal:2',
    ];

    public function pharmacy(): BelongsTo
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}