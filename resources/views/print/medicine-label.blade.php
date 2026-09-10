<!DOCTYPE html>
<html lang="en">
<head>

    <meta charset="UTF-8">

    <title>
        {{ $medicine->name ?? 'Barcode Label' }}
    </title>

    <style>

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html,
        body {
            width: 100%;
            min-height: 100%;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            background: #f1f5f9;
            color: #111827;
        }

        /* =========================================================
           TOOLBAR
        ========================================================= */

        .toolbar {
            height: 84px;

            display: flex;
            align-items: center;
            justify-content: center;

            background: #ffffff;

            border-bottom: 1px solid #e2e8f0;

            box-shadow:
                0 3px 15px rgba(0, 0, 0, .07);
        }

        .print-btn {
            border: none;

            background: #0f766e;
            color: #ffffff;

            padding: 14px 34px;

            border-radius: 12px;

            font-size: 18px;
            font-weight: 800;

            cursor: pointer;

            transition: .2s ease;
        }

        .print-btn:hover {
            background: #115e59;
            transform: translateY(-1px);
        }


        /* =========================================================
           PREVIEW
        ========================================================= */

        .container {
            min-height: calc(100vh - 84px);

            display: flex;
            justify-content: center;
            align-items: center;

            padding: 40px;
        }


        /* =========================================================
           PHYSICAL LABEL
           80mm x 50mm
        ========================================================= */

        .label {

            width: 80mm;
            height: 50mm;

            background: #ffffff;

            border: 2px solid #0f766e;

            border-radius: 12px;

            padding: 4mm 4mm 3mm;

            display: flex;
            flex-direction: column;

            align-items: center;

            text-align: center;

            overflow: hidden;

            box-shadow:
                0 15px 35px rgba(15, 23, 42, .16);
        }


        /* =========================================================
           PHARMACY NAME
        ========================================================= */

        .pharmacy-name {

            width: 100%;

            color: #0f766e;

            font-size: 17px;

            line-height: 1.05;

            font-weight: 900;

            text-transform: uppercase;

            overflow-wrap: anywhere;

            display: -webkit-box;

            -webkit-box-orient: vertical;

            -webkit-line-clamp: 2;

            overflow: hidden;

            margin-bottom: 2px;
        }


        /* =========================================================
           MEDICINE NAME
        ========================================================= */

        .medicine-name {

            width: 100%;

            color: #111827;

            font-size: 15px;

            line-height: 1.05;

            font-weight: 900;

            text-transform: uppercase;

            overflow-wrap: anywhere;

            display: -webkit-box;

            -webkit-box-orient: vertical;

            -webkit-line-clamp: 2;

            overflow: hidden;

            margin-top: 1px;
        }


        /* =========================================================
           SKU + PRICE
        ========================================================= */

        .details {

            width: 100%;

            margin-top: 3px;

            font-size: 10px;

            line-height: 1.1;

            font-weight: 700;

            color: #475569;

            white-space: nowrap;
        }


        /* =========================================================
           BARCODE
        ========================================================= */

        .barcode-area {

            width: 100%;

            margin-top: 4px;

            display: flex;

            flex-direction: column;

            align-items: center;

            justify-content: center;
        }


        .barcode-svg {

            width: 48mm;

            height: 13mm;

            display: block;

            overflow: visible;
        }


        .barcode-number {

            margin-top: 1px;

            font-size: 10px;

            line-height: 1;

            font-weight: 900;

            color: #111827;

            letter-spacing: .5px;
        }


        /* =========================================================
           FOOTER / EXPIRY
        ========================================================= */

        .footer {

            width: 100%;

            margin-top: auto;

            padding-top: 2px;

            font-size: 10px;

            line-height: 1;

            font-weight: 800;

            color: #475569;

            text-align: center;

            white-space: nowrap;
        }

        .footer strong {
            color: #111827;
        }


        /* =========================================================
           PRINT
        ========================================================= */

        @page {
            size: 80mm 50mm;
            margin: 0;
        }

        @media print {

            html,
            body {

                width: 80mm;
                height: 50mm;

                margin: 0;
                padding: 0;

                background: #ffffff;

                overflow: hidden;
            }

            .toolbar {
                display: none !important;
            }

            .container {

                width: 80mm;
                height: 50mm;

                min-height: 50mm;

                margin: 0;
                padding: 0;

                display: flex;

                justify-content: center;
                align-items: center;
            }

            .label {

                width: 80mm;
                height: 50mm;

                margin: 0;

                border: 1px solid #000000;

                border-radius: 0;

                box-shadow: none;

                page-break-after: avoid;
                page-break-before: avoid;
                page-break-inside: avoid;
            }
        }


        /* =========================================================
           SMALL SCREEN PREVIEW
        ========================================================= */

        @media screen and (max-width: 600px) {

            .toolbar {
                height: 72px;
            }

            .container {

                min-height: calc(100vh - 72px);

                padding: 20px;
            }

            .label {
                transform: scale(.9);
            }

            .print-btn {

                padding: 12px 26px;

                font-size: 16px;
            }
        }

    </style>

</head>


<body>


<!-- =============================================================
     PRINT TOOLBAR
============================================================= -->

<div class="toolbar">

    <button
        type="button"
        class="print-btn"
        onclick="window.print()"
    >
        🖨 Print Label
    </button>

</div>


<!-- =============================================================
     LABEL
============================================================= -->

<div class="container">

    <div class="label">


        <!-- =====================================================
             PHARMACY NAME
        ====================================================== -->

        <div class="pharmacy-name">
            {{ strtoupper($pharmacyName ?? 'PHARMACY') }}
        </div>


        <!-- =====================================================
             MEDICINE NAME
        ====================================================== -->

        <div class="medicine-name">
            {{ strtoupper($medicine->name ?? '-') }}
        </div>


        <!-- =====================================================
             SKU + PRICE
        ====================================================== -->

        <div class="details">

            SKU:
            {{ $medicine->sku ?? '-' }}

            &nbsp;&nbsp;|&nbsp;&nbsp;

            Price:
            {{ number_format($medicine->selling_price ?? 0, 2) }}
            SAR

        </div>


        @php

            /*
             * Current pharmacy barcode.
             *
             * If the user edits the barcode later,
             * this value automatically changes.
             */
            $barcodeValue =
                trim(
                    (string) (
                        $medicine->barcode
                        ?? $medicine->sku
                        ?? $medicine->id
                    )
                );

            /*
             * Code 39 character map.
             *
             * Each character consists of:
             * narrow bar / narrow space / wide bar / wide space
             */
            $code39 = [

                '0' => 'nnnwwnwnn',
                '1' => 'wnnwnnnnw',
                '2' => 'nnwwnnnnw',
                '3' => 'wnwwnnnnn',
                '4' => 'nnnwwnnnw',
                '5' => 'wnnwwnnnn',
                '6' => 'nnwwwnnnn',
                '7' => 'nnnwnnwnw',
                '8' => 'wnnwnnwnn',
                '9' => 'nnwwnnwnn',

                'A' => 'wnnnnwnnw',
                'B' => 'nnwnnwnnw',
                'C' => 'wnwnnwnnn',
                'D' => 'nnnnwwnnw',
                'E' => 'wnnnwwnnn',
                'F' => 'nnwnwwnnn',
                'G' => 'nnnnnwwnw',
                'H' => 'wnnnnwwnn',
                'I' => 'nnwnnwwnn',
                'J' => 'nnnnwwwnn',

                'K' => 'wnnnnnnww',
                'L' => 'nnwnnnnww',
                'M' => 'wnwnnnnwn',
                'N' => 'nnnnwnnww',
                'O' => 'wnnnwnnwn',
                'P' => 'nnwnwnnwn',
                'Q' => 'nnnnnnwww',
                'R' => 'wnnnnnwwn',
                'S' => 'nnwnnnwwn',
                'T' => 'nnnnwnwwn',

                'U' => 'wwnnnnnnw',
                'V' => 'nwwnnnnnw',
                'W' => 'wwwnnnnnn',
                'X' => 'nwnnwnnnw',
                'Y' => 'wwnnwnnnn',
                'Z' => 'nwwnwnnnn',

                '-' => 'nwnnnnwnw',
                '.' => 'wwnnnnwnn',
                ' ' => 'nwwnnnwnn',
                '$' => 'nwnwnwnnn',
                '/' => 'nwnwnnnwn',
                '+' => 'nwnnnwnwn',
                '%' => 'nnnwnwnwn',
            ];

            /*
             * Code 39 requires * as start/stop.
             */
            $barcodeText =
                strtoupper($barcodeValue);

            /*
             * Keep only characters supported by Code 39.
             */
            $barcodeText = preg_replace(
                '/[^0-9A-Z\-\.\ \$\/\+\%]/',
                '',
                $barcodeText
            );

            $barcodeData =
                '*' .
                $barcodeText .
                '*';

            /*
             * Generate barcode modules.
             */
            $modules = [];

            foreach (str_split($barcodeData) as $character) {

                if (! isset($code39[$character])) {
                    continue;
                }

                $pattern = $code39[$character];

                foreach (str_split($pattern) as $index => $width) {

                    $modules[] = [
                        'black' => $index % 2 === 0,
                        'width' => $width === 'w' ? 3 : 1,
                    ];
                }

                /*
                 * Inter-character narrow white space.
                 */
                $modules[] = [
                    'black' => false,
                    'width' => 1,
                ];
            }

            /*
             * Calculate total width.
             */
            $totalWidth = 0;

            foreach ($modules as $module) {
                $totalWidth += $module['width'];
            }

            /*
             * SVG dimensions.
             */
            $svgWidth = 480;
            $svgHeight = 130;

            $sideMargin = 10;

            $availableWidth =
                $svgWidth - ($sideMargin * 2);

            $scale =
                $availableWidth / max($totalWidth, 1);

            $x = $sideMargin;

        @endphp


        <!-- =====================================================
             REAL CODE 39 BARCODE
        ====================================================== -->

        <div class="barcode-area">

            <svg
                class="barcode-svg"
                viewBox="0 0 {{ $svgWidth }} {{ $svgHeight }}"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Barcode {{ $barcodeValue }}"
            >

                <rect
                    x="0"
                    y="0"
                    width="{{ $svgWidth }}"
                    height="{{ $svgHeight }}"
                    fill="#ffffff"
                />

                @foreach($modules as $module)

                    @if($module['black'])

                        @php
                            $barWidth =
                                $module['width'] * $scale;
                        @endphp

                        <rect
                            x="{{ $x }}"
                            y="5"
                            width="{{ $barWidth }}"
                            height="100"
                            fill="#000000"
                        />

                    @endif

                    @php
                        $x +=
                            $module['width'] * $scale;
                    @endphp

                @endforeach

            </svg>


            <!-- Barcode number -->
            <div class="barcode-number">
                {{ $barcodeValue }}
            </div>

        </div>


        <!-- =====================================================
             FOOTER / EXPIRY
        ====================================================== -->

        <div class="footer">

            @if(!empty($medicine->expiry_date))

                Expiry:
                <strong>
                    {{ \Carbon\Carbon::parse($medicine->expiry_date)->format('d-m-Y') }}
                </strong>

            @else

                Expiry:
                <strong>N/A</strong>

            @endif

        </div>


    </div>

</div>


</body>
</html>