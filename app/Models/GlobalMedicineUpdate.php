<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GlobalMedicineUpdate extends Model
{
    protected $fillable = [
        'medicine_id',
        'version',
        'contribution_id',
        'changed_by',
        'changes',
        'source',
        'status',
        'published_at',
    ];

    protected $casts = [
        'version' => 'integer',

        'changes' => 'array',

        'published_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Global Medicine
    |--------------------------------------------------------------------------
    */

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Contribution
    |--------------------------------------------------------------------------
    */

    public function contribution(): BelongsTo
    {
        return $this->belongsTo(
            GlobalMedicineContribution::class,
            'contribution_id'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | User Who Published The Update
    |--------------------------------------------------------------------------
    */

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'changed_by'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }
}
