<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GlobalMedicineContribution extends Model
{
    protected $fillable = [
        'pharmacy_id',
        'medicine_id',
        'user_id',

        'source',
        'contribution_type',

        'field_name',
        'old_value',
        'proposed_value',

        'payload',
        'raw_gs1_data',

        'gtin',
        'barcode',

        'confidence_score',
        'status',

        'reviewed_by',
        'reviewed_at',
        'review_note',
    ];

    protected $casts = [
        'payload' => 'array',

        'confidence_score' => 'decimal:2',

        'reviewed_at' => 'datetime',
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
    | Global Medicine
    |--------------------------------------------------------------------------
    */

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class);
    }

    /*
    |--------------------------------------------------------------------------
    | User Who Submitted
    |--------------------------------------------------------------------------
    */

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /*
    |--------------------------------------------------------------------------
    | User Who Reviewed
    |--------------------------------------------------------------------------
    */

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function isCorrection(): bool
    {
        return $this->contribution_type === 'correction';
    }

    public function isNewMedicine(): bool
    {
        return $this->contribution_type === 'new_medicine';
    }

    public function isGs1(): bool
    {
        return $this->source === 'gs1';
    }
}