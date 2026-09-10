<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TraceabilitySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'pharmacy_id',
        'enabled',
        'environment',
        'gln',
        'username',
        'password',
        'certificate_path',
        'certificate_password',
        'api_endpoint',
        'drug_endpoint',
        'is_connected',
        'last_connection_at',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'is_connected' => 'boolean',
        'last_connection_at' => 'datetime',
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
}