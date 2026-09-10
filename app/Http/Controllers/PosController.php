<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Customer;
use App\Models\Medicine;
use App\Models\PharmacyMedicine;
use App\Models\Sale;
use App\Models\StockMovement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\Inventory\FefoService;
use App\Services\Traceability\TraceabilityService;

class PosController extends Controller
{
    public function __construct(
        protected TraceabilityService $traceabilityService,
        protected FefoService $fefoService
    ) {
    }

    /*
    |--------------------------------------------------------------------------
    | POS
    |--------------------------------------------------------------------------
    */

    public function index(): Response
    {
        $user = auth()->user();
        $pharmacyId = $user->pharmacy_id;

        /*
         * POS belongs to a pharmacy.
         * Super Owner without pharmacy_id should not use pharmacy POS.
         */
        abort_if(! $pharmacyId, 403);

        /*
        |--------------------------------------------------------------------------
        | Products Available To This Pharmacy
        |--------------------------------------------------------------------------
        |
        | Product identity comes from medicines.
        |
        | Pharmacy operational values come from pharmacy_medicines:
        |
        | - barcode
        | - sku
        | - name override
        | - selling price
        | - tax percentage
        | - stock
        | - active status
        |
        | Only products with a PharmacyMedicine record and stock > 0
        | should be sellable.
        |
        */

        $pharmacyMedicines = PharmacyMedicine::query()
            ->where('pharmacy_id', $pharmacyId)
            ->where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->whereHas('medicine', function ($query) use ($pharmacyId) {
                $query->where(function ($q) use ($pharmacyId) {
                    $q->whereNull('pharmacy_id')
                        ->orWhere('pharmacy_id', $pharmacyId);
                });
            })
            ->with([
                'medicine:id,pharmacy_id,name,sku,barcode,selling_price,is_active',
            ])
            ->orderBy('name')
            ->limit(500)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | POS Medicine Data
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | id remains the master Medicine ID because
        | sale_items.medicine_id references medicines.id.
        |
        */

        $medicines = $pharmacyMedicines
            ->map(function (PharmacyMedicine $inventory) {
                $medicine = $inventory->medicine;

                if (! $medicine) {
                    return null;
                }

                return [
                    'id' => $medicine->id,

                    'name' =>
                        $inventory->name
                        ?? $medicine->name,

                    'sku' =>
                        $inventory->sku
                        ?? $medicine->sku,

                    'barcode' =>
                        $inventory->barcode
                        ?? $medicine->barcode,

                    'selling_price' =>
                        $inventory->selling_price
                        ?? $medicine->selling_price,

                    /*
                     * VAT percentage belongs to the pharmacy inventory
                     * record because pricing/tax is pharmacy-specific.
                     */
                    'tax_percentage' =>
                        (float) (
                            $inventory->tax_percentage
                            ?? 0
                        ),

                    'stock_quantity' =>
                        (int) $inventory->stock_quantity,

                    'is_global' =>
                        $medicine->pharmacy_id === null,

                    'pharmacy_medicine_id' =>
                        $inventory->id,
                ];
            })
            ->filter()
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Customers
        |--------------------------------------------------------------------------
        */

        $customers = Customer::where(
            'pharmacy_id',
            $pharmacyId
        )
            ->where('is_active', true)
            ->orderBy('name')
            ->get([
                'id',
                'customer_code',
                'name',
                'phone',
            ]);

        return Inertia::render('POS/Index', [
            'medicines' => $medicines,
            'customers' => $customers,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Store Sale
    |--------------------------------------------------------------------------
    */

    public function store(
        Request $request
    ): RedirectResponse {
        $user = auth()->user();
        $pharmacyId = $user->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        /*
        |--------------------------------------------------------------------------
        | Validation
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'customer_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'customer_phone' => [
                'nullable',
                'string',
                'max:255',
            ],

            'customer_id' => [
                'nullable',

                Rule::exists(
                    'customers',
                    'id'
                )->where(
                    fn ($query) =>
                    $query->where(
                        'pharmacy_id',
                        $pharmacyId
                    )
                ),
            ],

            'payment_method' => [
                'required',
                'string',
            ],

            'paid_amount' => [
                'required',
                'numeric',
                'min:0',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            /*
             * This ID is still medicines.id.
             */
            'items.*.id' => [
                'required',
                'integer',
                'exists:medicines,id',
            ],

            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],

            'items.*.dosage' => [
                'nullable',
                'string',
            ],

            'items.*.time' => [
                'nullable',
                'string',
            ],

            'items.*.food' => [
                'nullable',
                'string',
            ],

            'items.*.duration' => [
                'nullable',
                'string',
            ],

            'items.*.notes' => [
                'nullable',
                'string',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Sale Transaction
        |--------------------------------------------------------------------------
        */

        $sale = DB::transaction(function () use (
            $validated,
            $pharmacyId
        ) {
            $subtotal = 0;
            $tax = 0;

            $preparedItems = [];

            /*
            |--------------------------------------------------------------------------
            | Prepare + Validate Products
            |--------------------------------------------------------------------------
            */

            foreach ($validated['items'] as $item) {

                /*
                 * Make sure the medicine itself is either:
                 *
                 * - global
                 * - owned by this pharmacy
                 *
                 * This prevents somebody manually submitting another
                 * pharmacy's medicine ID.
                 */

                $medicine = Medicine::query()
                    ->where('id', $item['id'])
                    ->where(function ($query) use ($pharmacyId) {
                        $query
                            ->whereNull('pharmacy_id')
                            ->orWhere(
                                'pharmacy_id',
                                $pharmacyId
                            );
                    })
                    ->firstOrFail();

                /*
                 * PharmacyMedicine is the real inventory record.
                 *
                 * Lock it so two simultaneous sales cannot both read
                 * the same stock before either one updates it.
                 */

                $inventory = PharmacyMedicine::query()
                    ->where(
                        'pharmacy_id',
                        $pharmacyId
                    )
                    ->where(
                        'medicine_id',
                        $medicine->id
                    )
                    ->lockForUpdate()
                    ->first();

                /*
                 * No inventory row = this pharmacy has never stocked
                 * this product.
                 */

                if (! $inventory) {
                    abort(
                        422,
                        $medicine->name .
                        ' is not available in this pharmacy inventory.'
                    );
                }

                /*
                 * Pharmacy may have hidden/deactivated this product.
                 */

                if (! $inventory->is_active) {
                    abort(
                        422,
                        ($inventory->name ?? $medicine->name) .
                        ' is currently inactive.'
                    );
                }

                $quantity = (int) $item['quantity'];

                $availableStock =
                    (int) $inventory->stock_quantity;

                /*
                 * Prevent negative inventory.
                 */

                if ($availableStock < $quantity) {
                    abort(
                        422,
                        ($inventory->name ?? $medicine->name) .
                        ' does not have enough stock.'
                    );
                }

                /*
                |--------------------------------------------------------------------------
                | Pharmacy Price
                |--------------------------------------------------------------------------
                |
                | Pharmacy price overrides master medicine price.
                |
                */

                $unitPrice =
                    $inventory->selling_price
                    ?? $medicine->selling_price
                    ?? 0;

                $unitPrice = (float) $unitPrice;

                // Capture purchase cost at the moment of sale for accurate COGS.
                $costPrice = (float) ($inventory->purchase_price ?? 0);

                /*
                |--------------------------------------------------------------------------
                | Line Subtotal
                |--------------------------------------------------------------------------
                */

                $lineSubtotal =
                    $unitPrice * $quantity;

                $subtotal += $lineSubtotal;

                /*
                |--------------------------------------------------------------------------
                | Line VAT
                |--------------------------------------------------------------------------
                |
                | tax_percentage belongs to pharmacy_medicines.
                |
                | Example:
                |
                | price = 30.00
                | quantity = 1
                | tax = 15%
                |
                | VAT = 4.50
                |
                */

                $taxPercentage =
                    (float) (
                        $inventory->tax_percentage
                        ?? 0
                    );

                /*
                 * Protect against invalid negative values.
                 */
                $taxPercentage = max(
                    0,
                    min(
                        100,
                        $taxPercentage
                    )
                );

                $lineTax = round(
                    $lineSubtotal
                    * ($taxPercentage / 100),
                    2
                );

                $tax += $lineTax;

                $preparedItems[] = [
                    'medicine' => $medicine,
                    'inventory' => $inventory,

                    'medicine_name' =>
                        $inventory->name
                        ?? $medicine->name,

                    'quantity' =>
                        $quantity,

                    'dosage' =>
                        $item['dosage'] ?? null,

                    'time' =>
                        $item['time'] ?? null,

                    'food' =>
                        $item['food'] ?? null,

                    'duration' =>
                        $item['duration'] ?? null,

                    'notes' =>
                        $item['notes'] ?? null,

                    'unit_price' =>
                        $unitPrice,

                    'cost_price' =>
                        $costPrice,

                    'total_price' =>
                        $lineSubtotal,

                    'tax_percentage' =>
                        $taxPercentage,

                    'line_tax' =>
                        $lineTax,
                ];
            }

            /*
            |--------------------------------------------------------------------------
            | Sale Totals
            |--------------------------------------------------------------------------
            */

            $subtotal = round(
                $subtotal,
                2
            );

            $tax = round(
                $tax,
                2
            );

            /*
             * No POS discount is currently used.
             *
             * Total = subtotal + VAT
             */

            $discount = 0;

            $total = round(
                max(
                    0,
                    $subtotal
                    - $discount
                    + $tax
                ),
                2
            );

            $paidAmount = round(
                (float) $validated['paid_amount'],
                2
            );

            $changeAmount = round(
                max(
                    0,
                    $paidAmount - $total
                ),
                2
            );

            /*
            |--------------------------------------------------------------------------
            | Create Sale
            |--------------------------------------------------------------------------
            */

            $sale = Sale::create([
                'pharmacy_id' => $pharmacyId,

                'invoice_number' =>
                    $this->generateInvoiceNumber(
                        $pharmacyId
                    ),

                'user_id' =>
                    auth()->id(),

                'customer_name' =>
                    $validated['customer_name']
                    ?? null,

                'customer_phone' =>
                    $validated['customer_phone']
                    ?? null,

                'customer_id' =>
                    $validated['customer_id']
                    ?? null,

                'subtotal' =>
                    $subtotal,

                'discount' =>
                    $discount,

                /*
                 * IMPORTANT:
                 * This now contains the actual VAT amount.
                 */
                'tax' =>
                    $tax,

                /*
                 * IMPORTANT:
                 * Total now includes VAT.
                 */
                'total' =>
                    $total,

                'paid_amount' =>
                    $paidAmount,

                /*
                 * Change must be calculated from the
                 * VAT-inclusive total.
                 */
                'change_amount' =>
                    $changeAmount,

                'payment_method' =>
                    $validated['payment_method'],

                'status' =>
                    'completed',
            ]);

            /*
            |--------------------------------------------------------------------------
            | Sale Items + Stock
            |--------------------------------------------------------------------------
            */

            foreach ($preparedItems as $prepared) {

                /** @var Medicine $medicine */
                $medicine =
                    $prepared['medicine'];

                /** @var PharmacyMedicine $inventory */
                $inventory =
                    $prepared['inventory'];

                $quantity =
                    $prepared['quantity'];

                /*
                |--------------------------------------------------------------------------
                | Sale Item
                |--------------------------------------------------------------------------
                */

                $saleItem = $sale->items()->create([
                    'pharmacy_id' =>
                        $pharmacyId,

                    'medicine_id' =>
                        $medicine->id,

                    'medicine_name' =>
                        $prepared['medicine_name'],

                    'quantity' =>
                        $quantity,

                    'dosage' =>
                        $prepared['dosage'],

                    'time' =>
                        $prepared['time'],

                    'food' =>
                        $prepared['food'],

                    'duration' =>
                        $prepared['duration'],

                    'notes' =>
                        $prepared['notes'],

                    'unit_price' =>
                        $prepared['unit_price'],

                    'cost_price' =>
                        $prepared['cost_price'],

                    'total_price' =>
                        $prepared['total_price'],
                ]);

                /*
                |--------------------------------------------------------------------------
                | Serialized Medicines Only
                |--------------------------------------------------------------------------
                */

                if ($medicine->isSerialized()) {
                    $this->fefoService->sell(
                        $saleItem
                    );
                }

                /*
                |--------------------------------------------------------------------------
                | Pharmacy Stock
                |--------------------------------------------------------------------------
                */

                $stockBefore =
                    (int) $inventory->stock_quantity;

                $stockAfter =
                    $stockBefore - $quantity;

                $inventory->update([
                    'stock_quantity' =>
                        $stockAfter,
                ]);

                /*
                |--------------------------------------------------------------------------
                | Stock Movement
                |--------------------------------------------------------------------------
                */

                StockMovement::create([
                    'pharmacy_id' =>
                        $pharmacyId,

                    /*
                     * Keep master Medicine ID because your existing
                     * stock_movements.medicine_id references medicines.id.
                     */
                    'medicine_id' =>
                        $medicine->id,

                    'user_id' =>
                        auth()->id(),

                    'type' =>
                        'out',

                    'quantity' =>
                        $quantity,

                    'stock_before' =>
                        $stockBefore,

                    'stock_after' =>
                        $stockAfter,

                    'reason' =>
                        'POS Sale',

                    'note' =>
                        $sale->invoice_number,
                ]);

                /*
                 * IMPORTANT:
                 *
                 * DO NOT:
                 *
                 * $medicine->decrement(
                 *     'stock_quantity',
                 *     ...
                 * );
                 *
                 * medicines.stock_quantity is no longer this
                 * pharmacy's operational stock.
                 */
            }

            /*
            |--------------------------------------------------------------------------
            | Load Success Modal Data
            |--------------------------------------------------------------------------
            */

            $sale->load([
                'items',
                'customer',
            ]);

            return $sale;
        });

        /*
        |--------------------------------------------------------------------------
        | Activity Log
        |--------------------------------------------------------------------------
        */

        ActivityLog::record(
            'POS',
            'Sale Created',
            $sale->invoice_number,
            'New sale completed successfully.'
        );

        /*
        |--------------------------------------------------------------------------
        | Saudi RSD / Traceability
        |--------------------------------------------------------------------------
        */

        try {
            $this->traceabilityService->sendSale(
                $sale
            );
        } catch (\Throwable $e) {
            report($e);
        }

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return back()->with([
            'success' =>
                'Sale completed successfully.',

            'sale' => [
                'id' =>
                    $sale->id,

                'invoice_number' =>
                    $sale->invoice_number,

                'customer_name' =>
                    $sale->customer?->name
                    ?? $sale->customer_name
                    ?? 'Walk-in Customer',

                'subtotal' =>
                    $sale->subtotal,

                'tax' =>
                    $sale->tax,

                'total' =>
                    $sale->total,

                'paid_amount' =>
                    $sale->paid_amount,

                'change_amount' =>
                    $sale->change_amount,

                'items' =>
                    $sale->items
                        ->map(function ($item) {
                            return [
                                'id' =>
                                    $item->id,

                                'medicine_name' =>
                                    $item->medicine_name,

                                'quantity' =>
                                    $item->quantity,

                                'unit_price' =>
                                    $item->unit_price,

                                'total_price' =>
                                    $item->total_price,
                            ];
                        })
                        ->values(),
            ],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Invoice Number
    |--------------------------------------------------------------------------
    */

    private function generateInvoiceNumber(
        int $pharmacyId
    ): string {
        /*
         * Your sales.invoice_number column is globally UNIQUE.
         *
         * Therefore using INV-000001 separately for every pharmacy
         * would eventually create duplicate invoice numbers.
         *
         * Include pharmacy ID so each pharmacy has its own sequence
         * while the complete invoice number remains globally unique.
         *
         * Example:
         *
         * PH1-INV-000001
         * PH2-INV-000001
         */

        $nextNumber =
            Sale::where(
                'pharmacy_id',
                $pharmacyId
            )->count() + 1;

        /*
         * Extra protection in case old records/deletions cause a
         * collision.
         */

        do {
            $invoiceNumber =
                'PH' .
                $pharmacyId .
                '-INV-' .
                str_pad(
                    $nextNumber,
                    6,
                    '0',
                    STR_PAD_LEFT
                );

            $exists = Sale::where(
                'invoice_number',
                $invoiceNumber
            )->exists();

            if ($exists) {
                $nextNumber++;
            }

        } while ($exists);

        return $invoiceNumber;
    }
}