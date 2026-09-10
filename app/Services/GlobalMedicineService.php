<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GlobalMedicineService
{
    public function search($barcode)
    {
        $response = Http::timeout(10)->get(
            'https://api.fda.gov/drug/ndc.json',
            [
                'search' => 'product_ndc:' . $barcode,
                'limit' => 1,
            ]
        );

        if (!$response->successful()) {
            return [
                'found' => false,
                'medicine' => null,
            ];
        }

        $results = $response->json('results');

        if (empty($results)) {
            return [
                'found' => false,
                'medicine' => null,
            ];
        }

        $drug = $results[0];

        return [
            'found' => true,

            'medicine' => [
                'barcode'      => $barcode,
                'gtin'         => $barcode,
                'name'         => $drug['brand_name'] ?? '',
                'generic_name' => $drug['generic_name'] ?? '',
                'manufacturer' => $drug['labeler_name'] ?? '',
                'dosage_form'  => $drug['dosage_form'] ?? '',
                'route'        => $drug['route'][0] ?? '',
                'source'       => 'global',
            ],
        ];
    }
}