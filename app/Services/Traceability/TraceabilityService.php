<?php

namespace App\Services\Traceability;

use App\Models\Sale;
use App\Models\TraceabilitySetting;
use App\Models\TraceabilityTransaction;

class TraceabilityService
{
    protected SoapClientService $soap;
    protected XmlBuilder $xmlBuilder;
    protected TransactionService $transactions;
    protected AuthenticationService $authentication;
    protected ResponseParser $responseParser;

    public function __construct(
        SoapClientService $soap,
        XmlBuilder $xmlBuilder,
        TransactionService $transactions,
        AuthenticationService $authentication,
        ResponseParser $responseParser
    ) {
        $this->soap = $soap;
        $this->xmlBuilder = $xmlBuilder;
        $this->transactions = $transactions;
        $this->authentication = $authentication;
        $this->responseParser = $responseParser;
    }

    /**
     * Handle a completed sale.
     */
    public function sendSale(
        Sale $sale
    ): TraceabilityTransaction {

        // Create local transaction
        $transaction = $this->transactions->createSaleTransaction($sale);

        // Mark as processing
        $this->transactions->processing($transaction);

        /*
        |--------------------------------------------------------------------------
        | Current Stage
        |--------------------------------------------------------------------------
        |
        | The official Saudi RSD SOAP implementation has not yet been
        | integrated. For now, we stop after creating the local transaction.
        |
        | Future workflow:
        |
        | XML
        | Authentication
        | SOAP
        | Response Parsing
        | Success / Failed
        |
        */

        return $transaction;
    }

    /**
     * Cancel a previously reported sale.
     */
    public function cancelSale(
        Sale $sale
    ): bool {

        // TODO
        return true;
    }

    /**
     * Retry a failed transaction.
     */
    public function retryTransaction(
        TraceabilityTransaction $transaction
    ): bool {

        $this->transactions->retry($transaction);

        // Future implementation:
        // Build XML
        // Authenticate
        // Send SOAP
        // Parse response

        return true;
    }

    /**
     * Check whether Traceability is ready.
     */
    public function ready(
        TraceabilitySetting $settings
    ): bool {

        return $this->authentication->validate($settings);
    }
}