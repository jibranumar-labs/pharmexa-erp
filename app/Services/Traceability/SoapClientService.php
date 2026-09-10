<?php

namespace App\Services\Traceability;

use App\Models\TraceabilitySetting;
use Illuminate\Support\Facades\Http;

class SoapClientService
{
    /**
     * Send XML to the configured Saudi RSD endpoint.
     *
     * NOTE:
     * This is a generic XML HTTP client.
     * When the official Saudi RSD WSDL is available,
     * only this service will be updated to generate
     * the proper SOAP envelope and headers.
     */
    public function send(
        TraceabilitySetting $settings,
        string $xml
    ): array {

        if (empty($settings->api_endpoint)) {

            return [
                'success' => false,
                'response_code' => 'CONFIG',
                'response_message' => 'API endpoint is not configured.',
                'raw_response' => null,
            ];
        }

        try {

            $response = Http::timeout(60)
                ->accept('text/xml')
                ->withHeaders([
                    'Content-Type' => 'text/xml; charset=utf-8',
                    'Accept' => 'text/xml',
                ])
                ->withBody($xml, 'text/xml')
                ->post($settings->api_endpoint);

            return [

                'success' => $response->successful(),

                'response_code' => (string) $response->status(),

                'response_message' => $response->successful()
                    ? 'SOAP request completed successfully.'
                    : 'SOAP request failed.',

                'raw_response' => $response->body(),

            ];

        } catch (\Throwable $e) {

            report($e);

            return [

                'success' => false,

                'response_code' => 'EXCEPTION',

                'response_message' => $e->getMessage(),

                'raw_response' => null,

            ];
        }
    }
}