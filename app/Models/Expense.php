<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    protected $fillable = [
        'pharmacy_id',
        'expense_number',
        'category',
        'title',
        'description',
        'amount',
        'expense_date',
        'user_id',
    ];

    protected $casts = [
        'pharmacy_id' => 'integer',
        'expense_date' => 'date',
        'amount' => 'decimal:2',
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