<?php

namespace App\Services\Traceability;

class ResponseParser
{
    /**
     * Parse the SOAP/XML response.
     *
     * Returns a normalized response so the rest of the
     * application does not depend on the external format.
     */
    public function parse(string $response): array
    {
        $result = [
            'success' => false,
            'reference_number' => null,
            'response_code' => null,
            'response_message' => null,
            'raw_response' => $response,
        ];

        try {

            libxml_use_internal_errors(true);

            $xml = simplexml_load_string($response);

            if (!$xml) {

                $result['response_message'] = 'Invalid XML response.';

                return $result;
            }

            /*
            |--------------------------------------------------------------------------
            | Temporary Mapping
            |--------------------------------------------------------------------------
            |
            | Replace these fields with the official Saudi RSD
            | SOAP response structure once the specification is available.
            |
            */

            $result['response_code'] = isset($xml->ResponseCode)
                ? (string) $xml->ResponseCode
                : null;

            $result['response_message'] = isset($xml->ResponseMessage)
                ? (string) $xml->ResponseMessage
                : null;

            $result['reference_number'] = isset($xml->ReferenceNumber)
                ? (string) $xml->ReferenceNumber
                : null;

            /*
            |--------------------------------------------------------------------------
            | Success Detection
            |--------------------------------------------------------------------------
            */

            $result['success'] = in_array(
                $result['response_code'],
                ['200', 'SUCCESS', 'OK'],
                true
            );

        } catch (\Throwable $e) {

            report($e);

            $result['response_message'] = $e->getMessage();
        }

        return $result;
    }
}