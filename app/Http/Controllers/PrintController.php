<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Purchase;
use App\Models\PurchaseReturn;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SaleReturn;
use App\Models\Setting;
use App\Services\PrintCodeService;
use Carbon\Carbon;

class PrintController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Pharmacy Settings
    |--------------------------------------------------------------------------
    */

   private function setting(): Setting
{
    $pharmacyId = $this->pharmacyId();

    return Setting::firstOrCreate(
        [
            'pharmacy_id' => $pharmacyId,
        ],
        [
            'pharmacy_name' => 'PHARMEXA',
            'pharmacy_name_ar' => 'صيدلية فارمكسا',
            'city' => 'Riyadh',
            'country' => 'Saudi Arabia',
            'currency' => 'SAR',
            'currency_symbol' => 'SAR',
            'timezone' => 'Asia/Riyadh',
            'language' => 'en',
            'receipt_size' => '80',
        ]
    );
}

    /*
    |--------------------------------------------------------------------------
    | Current Pharmacy
    |--------------------------------------------------------------------------
    */

    private function pharmacyId(): int
    {
        $user = auth()->user();

        abort_if(! $user, 403);
        abort_if(! $user->pharmacy_id, 403);

        return (int) $user->pharmacy_id;
    }

    /*
    |--------------------------------------------------------------------------
    | Sale Ownership
    |--------------------------------------------------------------------------
    */

    private function authorizeSale(Sale $sale): void
    {
        abort_unless(
            (int) $sale->pharmacy_id === $this->pharmacyId(),
            403
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Purchase Ownership
    |--------------------------------------------------------------------------
    */

    private function authorizePurchase(Purchase $purchase): void
    {
        abort_unless(
            (int) $purchase->pharmacy_id === $this->pharmacyId(),
            403
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Sale Return Ownership
    |--------------------------------------------------------------------------
    */

    private function authorizeSaleReturn(SaleReturn $saleReturn): void
    {
        abort_unless(
            (int) $saleReturn->pharmacy_id === $this->pharmacyId(),
            403
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Purchase Return Ownership
    |--------------------------------------------------------------------------
    */

    private function authorizePurchaseReturn(
        PurchaseReturn $purchaseReturn
    ): void {
        abort_unless(
            (int) $purchaseReturn->pharmacy_id === $this->pharmacyId(),
            403
        );
    }

    /*
    |--------------------------------------------------------------------------
    | A4 Sale Invoice
    |--------------------------------------------------------------------------
    */

    public function sale(
        Sale $sale,
        PrintCodeService $printCode
    ) {
        $this->authorizeSale($sale);

        $sale->load([
            'items.medicine',
            'user',
            'customer',
        ]);

        $setting = $this->setting();

        ActivityLog::record(
            'Sales',
            'Printed',
            $sale->invoice_number,
            'A4 sale invoice printed.'
        );

        $barcode = $printCode->barcode(
            $sale->invoice_number
        );

        $qr = $printCode->qr(
            "Invoice: {$sale->invoice_number}\n" .
            "Total: {$sale->total} SAR\n" .
            "Date: {$sale->created_at->format('d-m-Y H:i')}"
        );

        return view('print.sale', [
            'sale' => $sale,
            'setting' => $setting,
            'barcode' => $barcode,
            'qr' => $qr,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Thermal Receipt
    |--------------------------------------------------------------------------
    */

    public function thermalReceipt(
        Sale $sale,
        PrintCodeService $printCode
    ) {
        $this->authorizeSale($sale);

        $sale->load([
            'items.medicine',
            'user',
            'customer',
        ]);

        $setting = $this->setting();

        ActivityLog::record(
            'Sales',
            'Printed',
            $sale->invoice_number,
            'Thermal receipt printed.'
        );

        $barcode = $printCode->barcode(
            $sale->invoice_number
        );

        $qr = $printCode->qr(
            "Invoice: {$sale->invoice_number}\n" .
            "Total: {$sale->total} SAR\n" .
            "Date: {$sale->created_at->format('d-m-Y H:i')}"
        );

        return view('print.thermal-receipt', [
            'sale' => $sale,
            'setting' => $setting,
            'barcode' => $barcode,
            'qr' => $qr,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Purchase Invoice
    |--------------------------------------------------------------------------
    */

    public function purchase(Purchase $purchase)
    {
        $this->authorizePurchase($purchase);

        $purchase->load([
            'items.medicine',
            'supplier',
            'user',
        ]);

        $setting = $this->setting();

        ActivityLog::record(
            'Purchases',
            'Printed',
            $purchase->purchase_number,
            'Purchase invoice printed.'
        );

        return view('print.purchase', [
            'purchase' => $purchase,
            'setting' => $setting,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Sale Return
    |--------------------------------------------------------------------------
    */

    public function saleReturn(SaleReturn $saleReturn)
    {
        $this->authorizeSaleReturn($saleReturn);

        $saleReturn->load([
            'sale.customer',
            'user',
            'items.medicine',
        ]);

        /*
         * Additional protection:
         * the original sale must also belong to this pharmacy.
         */
        abort_unless(
            $saleReturn->sale
            && (int) $saleReturn->sale->pharmacy_id === $this->pharmacyId(),
            403
        );

        $setting = $this->setting();

        ActivityLog::record(
            'Sales Return',
            'Printed',
            $saleReturn->return_number,
            'Sales return printed.'
        );

        return view('print.sale-return', [
            'saleReturn' => $saleReturn,
            'setting' => $setting,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Purchase Return
    |--------------------------------------------------------------------------
    */

    public function purchaseReturn(
        PurchaseReturn $purchaseReturn
    ) {
        $this->authorizePurchaseReturn($purchaseReturn);

        $purchaseReturn->load([
            'purchase.supplier',
            'user',
            'items.medicine',
        ]);

        /*
         * Additional protection:
         * original purchase must belong to this pharmacy.
         */
        abort_unless(
            $purchaseReturn->purchase
            && (int) $purchaseReturn->purchase->pharmacy_id === $this->pharmacyId(),
            403
        );

        $setting = $this->setting();

        ActivityLog::record(
            'Purchase Return',
            'Printed',
            $purchaseReturn->return_number,
            'Purchase return printed.'
        );

        return view('print.purchase-return', [
            'purchaseReturn' => $purchaseReturn,
            'setting' => $setting,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Dosage Sticker
    |--------------------------------------------------------------------------
    */

    public function dosageSticker(SaleItem $saleItem)
    {
        $saleItem->load([
            'sale.user',
            'sale.customer',
            'medicine.unit',
        ]);

        /*
         * SaleItem itself does not need pharmacy_id.
         * Ownership is determined through its parent Sale.
         */
        abort_unless(
            $saleItem->sale
            && (int) $saleItem->sale->pharmacy_id === $this->pharmacyId(),
            403
        );

        $setting = $this->setting();

        $times = [
            'Morning' => [
                'en' => 'Morning',
                'ar' => 'صباحاً',
            ],

            'Afternoon' => [
                'en' => 'Afternoon',
                'ar' => 'ظهراً',
            ],

            'Evening' => [
                'en' => 'Evening',
                'ar' => 'مساءً',
            ],

            'Night' => [
                'en' => 'Night',
                'ar' => 'ليلاً',
            ],
        ];

        $foods = [
            'Before Food' => [
                'en' => 'Before Food',
                'ar' => 'قبل الطعام',
            ],

            'After Food' => [
                'en' => 'After Food',
                'ar' => 'بعد الطعام',
            ],

            'With Food' => [
                'en' => 'With Food',
                'ar' => 'مع الطعام',
            ],
        ];

        $dosages = [
            'OD' => [
                'en' => 'Once Daily',
                'ar' => 'مرة يومياً',
            ],

            'BD' => [
                'en' => 'Twice Daily',
                'ar' => 'مرتين يومياً',
            ],

            'TDS' => [
                'en' => 'Three Times Daily',
                'ar' => 'ثلاث مرات يومياً',
            ],

            'QID' => [
                'en' => 'Four Times Daily',
                'ar' => 'أربع مرات يومياً',
            ],

            'SOS' => [
                'en' => 'When Required',
                'ar' => 'عند الحاجة',
            ],

            'HS' => [
                'en' => 'At Bedtime',
                'ar' => 'قبل النوم',
            ],
        ];

        ActivityLog::record(
            'Dosage Sticker',
            'Printed',
            $saleItem->sale->invoice_number,
            'Dosage sticker printed.'
        );

        return view('print.dosage-sticker', [
            'item' => $saleItem,

            'setting' => $setting,

            'today' => Carbon::now(),

            'time' => (function () use (
                $saleItem,
                $times
            ) {
                $selected = preg_split(
                    '/\s*,\s*/',
                    (string) $saleItem->time
                );

                $en = [];
                $ar = [];

                foreach ($selected as $value) {
                    $key = ucfirst(
                        strtolower(trim($value))
                    );

                    if (isset($times[$key])) {
                        $en[] = $times[$key]['en'];
                        $ar[] = $times[$key]['ar'];
                    } else {
                        $en[] = $value;
                        $ar[] = $value;
                    }
                }

                return [
                    'en' => implode(', ', $en),
                    'ar' => implode('، ', $ar),
                ];
            })(),

            'food' => (function () use (
                $saleItem,
                $foods
            ) {
                $selected = preg_split(
                    '/\s*,\s*/',
                    (string) $saleItem->food
                );

                $en = [];
                $ar = [];

                foreach ($selected as $value) {
                    $key = ucwords(
                        strtolower(trim($value))
                    );

                    if (isset($foods[$key])) {
                        $en[] = $foods[$key]['en'];
                        $ar[] = $foods[$key]['ar'];
                    } else {
                        $en[] = $value;
                        $ar[] = $value;
                    }
                }

                return [
                    'en' => implode(', ', $en),
                    'ar' => implode('، ', $ar),
                ];
            })(),

            'dosage' => $dosages[$saleItem->dosage] ?? [
                'en' => $saleItem->dosage,
                'ar' => $saleItem->dosage,
            ],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | All Dosage Stickers
    |--------------------------------------------------------------------------
    */

    public function allDosageStickers(Sale $sale)
    {
        $this->authorizeSale($sale);

        $sale->load([
            'items.medicine.unit',
            'items.sale.user',
            'items.sale.customer',
        ]);

        $setting = $this->setting();

        ActivityLog::record(
            'Dosage Sticker',
            'Printed',
            $sale->invoice_number,
            'All dosage stickers printed.'
        );

        return view('print.all-dosage-stickers', [
            'sale' => $sale,
            'setting' => $setting,
        ]);
    }
}