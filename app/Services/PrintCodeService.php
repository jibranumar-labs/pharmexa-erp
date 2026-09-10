<?php

namespace App\Services;

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Milon\Barcode\DNS1D;

class PrintCodeService
{
    /**
     * Generate Code128 Barcode.
     */
    public function barcode(string $text): string
    {
        $barcode = new DNS1D();

        return $barcode->getBarcodeHTML(
            $text,
            'C128',
            1,
            35
        );
    }

    /**
     * Generate QR Code.
     */
    public function qr(string $text, int $size = 120): string
    {
        $writer = new PngWriter();

        $qrCode = new QrCode(
            data: $text,
            size: $size,
            margin: 2
        );

        $result = $writer->write($qrCode);

        return 'data:image/png;base64,' . base64_encode(
            $result->getString()
        );
    }
}