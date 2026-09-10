<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [

        'pharmacy_id',

        'customer_code',

        'name',

        'phone',

        'email',

        'gender',

        'date_of_birth',

        'address',

        'city',

        'national_id',

        'loyalty_points',

        'credit_limit',

        'current_balance',

        'is_active',

    ];

    protected $casts = [

        'date_of_birth' => 'date',

        'is_active' => 'boolean',

    ];

    public function pharmacy(): BelongsTo
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}