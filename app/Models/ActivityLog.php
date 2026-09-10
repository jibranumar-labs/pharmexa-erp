<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'pharmacy_id',
        'module',
        'action',
        'record_name',
        'description',
        'ip_address',
    ];

    /*
    |--------------------------------------------------------------------------
    | User
    |--------------------------------------------------------------------------
    */

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

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
    | Record Activity
    |--------------------------------------------------------------------------
    |
    | Every ActivityLog::record() call throughout Pharmexa will automatically
    | store both the authenticated user and their pharmacy.
    |
    | Platform / Super Owner activity can have pharmacy_id = NULL.
    |
    */

    public static function record(
        string $module,
        string $action,
        ?string $recordName = null,
        ?string $description = null
    ): void {
        $user = auth()->user();

        self::create([
            'user_id' => $user?->id,
            'pharmacy_id' => $user?->pharmacy_id,

            'module' => $module,
            'action' => $action,
            'record_name' => $recordName,
            'description' => $description,

            'ip_address' => request()->ip(),
        ]);
    }
}