<?php

namespace App\Services\Traceability;

use App\Models\Medicine;
use App\Models\TraceabilitySetting;
use Illuminate\Support\Facades\Http;

class DrugService
{
    /**
     * Synchronize medicines from the Saudi RSD endpoint.
     *
     * NOTE:
     * This is a placeholder implementation.
     * The official SFDA/RSD medicine mapping will be added
     * when the API specification is available.
     */
    public function sync(
        TraceabilitySetting $settings
    ): array {

        if (empty($settings->drug_endpoint)) {

            return [
                'success' => false,
                'message' => 'Drug endpoint is not configured.',
                'count' => 0,
            ];
        }

        try {

            $response = Http::timeout(60)
                ->acceptJson()
                ->get($settings->drug_endpoint);

            if (!$response->successful()) {

                return [
                    'success' => false,
                    'message' => 'Unable to download medicines.',
                    'count' => 0,
                ];
            }

            /*
            |--------------------------------------------------------------------------
            | TODO
            |--------------------------------------------------------------------------
            |
            | Replace this placeholder with the official
            | Saudi RSD medicine mapping.
            |
            */

            $count = 0;

            return [
                'success' => true,
                'message' => 'Medicine synchronization completed.',
                'count' => $count,
            ];

        } catch (\Throwable $e) {

            report($e);

            return [
                'success' => false,
                'message' => $e->getMessage(),
                'count' => 0,
            ];
        }
    }

    /**
     * Find medicine by GTIN.
     */
    public function findByGTIN(
        string $gtin
    ): ?Medicine {

        return Medicine::where('gtin', $gtin)->first();
    }

    /**
     * Check if a GTIN exists.
     */
    public function exists(
        string $gtin
    ): bool {

        return Medicine::where('gtin', $gtin)->exists();
    }
}