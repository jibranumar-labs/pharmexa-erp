<?php

namespace App\Services\Traceability;

use App\Models\Sale;
use App\Models\TraceabilityTransaction;
use App\Models\TraceabilityTransactionItem;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    /**
     * Create a traceability transaction from a completed sale.
     */
    public function createSaleTransaction(
        Sale $sale
    ): TraceabilityTransaction {

        return DB::transaction(function () use ($sale) {

            // Make sure sale items and medicines are loaded
            $sale->loadMissing('items.medicine');

            $transaction = TraceabilityTransaction::create([

                'pharmacy_id' => $sale->pharmacy_id,

                'sale_id' => $sale->id,

                'operation' => 'sale',

                'status' => 'pending',

                'reference_number' => null,

            ]);

            foreach ($sale->items as $item) {

                TraceabilityTransactionItem::create([

                    'traceability_transaction_id' => $transaction->id,

                    'sale_item_id' => $item->id,

                    'medicine_id' => $item->medicine_id,

                    /*
                    |--------------------------------------------------------------------------
                    | Temporary Values
                    |--------------------------------------------------------------------------
                    |
                    | These values will later come from serialized inventory
                    | and the official Saudi RSD integration.
                    |
                    */

                    'gtin' => $item->medicine->gtin ?? '',

                    'serial_number' => '',

                    'batch_number' => '',

                    'expiry_date' => now()->addYear(),

                    'quantity' => $item->quantity,

                    'status' => 'pending',

                ]);
            }

            return $transaction;
        });
    }

    /**
     * Mark transaction as processing.
     */
    public function processing(
        TraceabilityTransaction $transaction
    ): void {

        $transaction->update([
            'status' => 'processing',
        ]);
    }

    /**
     * Mark transaction as successfully sent.
     */
    public function success(
        TraceabilityTransaction $transaction,
        string $reference,
        string $code,
        ?string $message = null
    ): void {

        $transaction->update([

            'status' => 'sent',

            'reference_number' => $reference,

            'response_code' => $code,

            'response_message' => $message,

            'sent_at' => now(),

        ]);

        $transaction->items()->update([
            'status' => 'sent',
        ]);
    }

    /**
     * Mark transaction as failed.
     */
    public function failed(
        TraceabilityTransaction $transaction,
        string $code,
        string $message
    ): void {

        $transaction->update([

            'status' => 'failed',

            'response_code' => $code,

            'response_message' => $message,

        ]);

        $transaction->items()->update([
            'status' => 'failed',
        ]);
    }

    /**
     * Reset a failed transaction so it can be retried.
     */
    public function retry(
        TraceabilityTransaction $transaction
    ): void {

        $transaction->update([

            'status' => 'pending',

            'response_code' => null,

            'response_message' => null,

        ]);

        $transaction->items()->update([
            'status' => 'pending',
        ]);
    }
}