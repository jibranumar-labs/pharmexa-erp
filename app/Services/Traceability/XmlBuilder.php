<?php

namespace App\Services\Traceability;

use App\Models\TraceabilityTransaction;
use SimpleXMLElement;

class XmlBuilder
{
    /**
     * Build XML for a traceability sale.
     *
     * NOTE:
     * This is a temporary internal XML structure.
     * It will be replaced with the official Saudi RSD
     * SOAP XML format when the specification is available.
     */
    public function buildSale(
        TraceabilityTransaction $transaction
    ): string {

        $transaction->loadMissing('items.medicine');

        $xml = new SimpleXMLElement(
            '<?xml version="1.0" encoding="UTF-8"?><TraceabilityTransaction/>'
        );

        $this->buildHeader($xml, $transaction);

        $this->buildItems($xml, $transaction);

        return $xml->asXML();
    }

    /**
     * Build transaction header.
     */
    protected function buildHeader(
        SimpleXMLElement $xml,
        TraceabilityTransaction $transaction
    ): void {

        $xml->addChild(
            'Operation',
            (string) $transaction->operation
        );

        $xml->addChild(
            'PharmacyId',
            (string) $transaction->pharmacy_id
        );

        $xml->addChild(
            'SaleId',
            (string) $transaction->sale_id
        );
    }

    /**
     * Build transaction items.
     */
    protected function buildItems(
        SimpleXMLElement $xml,
        TraceabilityTransaction $transaction
    ): void {

        $items = $xml->addChild('Items');

        foreach ($transaction->items as $item) {

            $node = $items->addChild('Item');

            $node->addChild(
                'GTIN',
                (string) $item->gtin
            );

            $node->addChild(
                'SerialNumber',
                (string) ($item->serial_number ?? '')
            );

            $node->addChild(
                'BatchNumber',
                (string) ($item->batch_number ?? '')
            );

            $node->addChild(
                'ExpiryDate',
                $item->expiry_date
                    ? date('Y-m-d', strtotime($item->expiry_date))
                    : ''
            );

            $node->addChild(
                'Quantity',
                (string) $item->quantity
            );
        }
    }
}