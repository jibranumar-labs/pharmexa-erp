<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Pharmacy extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'owner_name',
        'owner_id',
        'email',
        'phone',
        'license_number',
        'address',
        'city',
        'country',
        'logo',
        'notes',
        'subscription_plan',
        'subscription_status',
        'subscription_expires_at',
        'status',
    ];

    protected $appends = [
        'logo_url',
        'status_label',
    ];

    protected $casts = [
        'subscription_expires_at' => 'datetime',
        'status' => 'boolean',
    ];

    /**
     * Pharmacy owner.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Users belonging to this pharmacy.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Pharmacy-specific medicine records.
     *
     * These contain the pharmacy's own inventory, pricing,
     * barcode corrections and other local product overrides.
     */
    public function pharmacyMedicines(): HasMany
    {
        return $this->hasMany(PharmacyMedicine::class);
    }

    /**
     * Public URL for the pharmacy logo.
     */
    public function getLogoUrlAttribute(): ?string
    {
        if (! $this->logo) {
            return null;
        }

        return Storage::disk('public')->url($this->logo);
    }

    /**
     * Human-readable pharmacy status.
     */
    public function getStatusLabelAttribute(): string
    {
        return $this->status ? 'Active' : 'Suspended';
    }

    /**
     * Check whether the pharmacy is active.
     */
    public function isActive(): bool
    {
        return (bool) $this->status;
    }
}