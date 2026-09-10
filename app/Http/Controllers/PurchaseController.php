<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Medicine;
use App\Models\PharmacyMedicine;
use App\Models\Purchase;
use App\Models\StockMovement;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Services\Inventory\SerializedInventoryService;
use Inertia\Response;

class PurchaseController extends Controller
{
    protected SerializedInventoryService $serializedInventory;

public function __construct(
    SerializedInventoryService $serializedInventory
) {
    $this->serializedInventory = $serializedInventory;
}
    /**
     * Display purchases for the logged-in pharmacy.
     */
    public function index(): Response
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $purchases = Purchase::where('pharmacy_id', $pharmacyId)
            ->with(['supplier', 'user'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases,

            'stats' => [
                'totalPurchases' => Purchase::where(
                    'pharmacy_id',
                    $pharmacyId
                )->count(),

                'totalAmount' => Purchase::where(
                    'pharmacy_id',
                    $pharmacyId
                )->sum('total'),

                'paidAmount' => Purchase::where(
                    'pharmacy_id',
                    $pharmacyId
                )->sum('paid_amount'),

                'balanceAmount' => Purchase::where(
                    'pharmacy_id',
                    $pharmacyId
                )->sum('balance_amount'),
            ],
        ]);
    }

    /**
     * Show purchase creation page.
     */
    public function create(): Response
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Suppliers
        |--------------------------------------------------------------------------
        |
        | Suppliers remain pharmacy-specific.
        |
        */

        $suppliers = Supplier::where('pharmacy_id', $pharmacyId)
            ->where('is_active', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Available Medicines
        |--------------------------------------------------------------------------
        |
        | Pharmacy may purchase:
        |
        | 1. Global catalogue medicines where pharmacy_id is NULL.
        | 2. Medicines created specifically by this pharmacy.
        |
        | We do NOT use medicines.stock_quantity because pharmacy inventory
        | belongs to pharmacy_medicines.
        |
        */

        $medicines = Medicine::query()
            ->where(function ($query) use ($pharmacyId) {
                $query->whereNull('pharmacy_id')
                    ->orWhere('pharmacy_id', $pharmacyId);
            })
            ->where('is_active', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'barcode',
                'sku',
                'purchase_price',
                'selling_price',
                'minimum_stock',
                'tax_percentage',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Apply Pharmacy Overrides
        |--------------------------------------------------------------------------
        |
        | Purchase price and selling price may already have been customised
        | by this pharmacy.
        |
        */

        $overrides = PharmacyMedicine::where(
            'pharmacy_id',
            $pharmacyId
        )
            ->whereIn(
                'medicine_id',
                $medicines->pluck('id')
            )
            ->get()
            ->keyBy('medicine_id');

        $medicines->transform(function ($medicine) use ($overrides) {
            $override = $overrides->get($medicine->id);

            if ($override) {
                $medicine->setAttribute(
                    'purchase_price',
                    $override->purchase_price
                        ?? $medicine->purchase_price
                );

                $medicine->setAttribute(
                    'selling_price',
                    $override->selling_price
                        ?? $medicine->selling_price
                );

                $medicine->setAttribute(
                    'stock_quantity',
                    (int) $override->stock_quantity
                );

                $medicine->setAttribute(
                    'minimum_stock',
                    (int) $override->minimum_stock
                );

                $medicine->setAttribute(
                    'batch_number',
                    $override->batch_number
                );

                $medicine->setAttribute(
                    'expiry_date',
                    $override->expiry_date
                );

                $medicine->setAttribute(
                    'is_active',
                    (bool) $override->is_active
                );
            } else {
                /*
                 * Never inherit global stock as pharmacy stock.
                 */
                $medicine->setAttribute(
                    'stock_quantity',
                    0
                );

                $medicine->setAttribute(
                    'batch_number',
                    null
                );

                $medicine->setAttribute(
                    'expiry_date',
                    null
                );
            }

            return $medicine;
        });

        /*
         * Do not offer products hidden/disabled by this pharmacy.
         */
        $medicines = $medicines
            ->filter(
                fn ($medicine) =>
                    (bool) $medicine->is_active
            )
            ->values();

        return Inertia::render('Purchases/Create', [
            'suppliers' => $suppliers,
            'medicines' => $medicines,
        ]);
    }

    /**
     * Store a purchase and increase pharmacy-specific inventory.
     */
    public function store(Request $request): RedirectResponse
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $validated = $request->validate([
            /*
            |--------------------------------------------------------------------------
            | Supplier
            |--------------------------------------------------------------------------
            */

            'supplier_id' => [
                'required',
                Rule::exists('suppliers', 'id')
                    ->where(
                        'pharmacy_id',
                        $pharmacyId
                    ),
            ],

            'supplier_invoice_number' => [
                'nullable',
                'string',
                'max:255',
            ],

            'purchase_date' => [
                'required',
                'date',
            ],

            'discount' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'tax' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'paid_amount' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'notes' => [
                'nullable',
                'string',
            ],

            /*
            |--------------------------------------------------------------------------
            | Purchase Items
            |--------------------------------------------------------------------------
            */

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.medicine_id' => [
                'required',

                Rule::exists('medicines', 'id')
                    ->where(function ($query) use ($pharmacyId) {
                        $query->whereNull('pharmacy_id')
                            ->orWhere(
                                'pharmacy_id',
                                $pharmacyId
                            );
                    }),
            ],

        'items.*.batch_number' => [
    'required',
    'string',
    'max:255',
],

'items.*.expiry_date' => [
    'required',
    'date',
],

'items.*.quantity' => [
    'required',
    'integer',
    'min:1',
],

'items.*.purchase_price' => [
    'required',
    'numeric',
    'min:0',
],

'items.*.selling_price' => [
    'required',
    'numeric',
    'min:0',
],
],
[
    'items.*.medicine_id.required' => 'Please select a medicine.',

    'items.*.batch_number.required' => 'Batch Number is required.',

    'items.*.expiry_date.required' => 'Expiry Date is required.',

    'items.*.quantity.required' => 'Quantity is required.',

    'items.*.purchase_price.required' => 'Purchase Price is required.',

    'items.*.selling_price.required' => 'Selling Price is required.',
]);
       
        DB::transaction(function () use (
            $validated,
            $pharmacyId
        ) {
            /*
            |--------------------------------------------------------------------------
            | Purchase Totals
            |--------------------------------------------------------------------------
            */

            $subtotal = collect(
                $validated['items']
            )->sum(function ($item) {
                return
                    $item['quantity']
                    * $item['purchase_price'];
            });

            $discount = $validated['discount'] ?? 0;
            $tax = $validated['tax'] ?? 0;

            $total = max(
                0,
                $subtotal - $discount + $tax
            );

            $paid = $validated['paid_amount'] ?? 0;

            $balance = max(
                0,
                $total - $paid
            );

            /*
            |--------------------------------------------------------------------------
            | Create Purchase
            |--------------------------------------------------------------------------
            */

            $purchase = Purchase::create([
                'pharmacy_id' => $pharmacyId,

               'purchase_number' => 'PUR-' . str_pad(
    (Purchase::max('id') ?? 0) + 1,
    6,
    '0',
    STR_PAD_LEFT
),

                'supplier_id' =>
                    $validated['supplier_id'],

                'user_id' =>
                    auth()->id(),

                'supplier_invoice_number' =>
                    $validated[
                        'supplier_invoice_number'
                    ] ?? null,

                'purchase_date' =>
                    $validated['purchase_date'],

                'subtotal' =>
                    $subtotal,

                'discount' =>
                    $discount,

                'tax' =>
                    $tax,

                'total' =>
                    $total,

                'paid_amount' =>
                    $paid,

                'balance_amount' =>
                    $balance,

                'payment_status' =>
                    $balance <= 0
                        ? 'paid'
                        : (
                            $paid > 0
                                ? 'partial'
                                : 'unpaid'
                        ),

                'status' =>
                    'received',

                'notes' =>
                    $validated['notes'] ?? null,
            ]);

            /*
            |--------------------------------------------------------------------------
            | Purchase Items + Pharmacy Inventory
            |--------------------------------------------------------------------------
            */

            foreach ($validated['items'] as $item) {
                $lineTotal =
                    $item['quantity']
                    * $item['purchase_price'];

                /*
                 * Save purchase item.
                 */

               $purchaseItem = $purchase->items()->create([
    'pharmacy_id' => $pharmacyId,

    'medicine_id' => $item['medicine_id'],

    'batch_number' => $item['batch_number'] ?? null,

    'expiry_date' => $item['expiry_date'] ?? null,

    'quantity' => $item['quantity'],

    'purchase_price' => $item['purchase_price'],

    'selling_price' => $item['selling_price'],

    'total' => $lineTotal,
]);

$this->serializedInventory->create($purchaseItem);

                /*
                |--------------------------------------------------------------------------
                | Get Accessible Medicine
                |--------------------------------------------------------------------------
                |
                | Global medicine:
                | medicines.pharmacy_id = NULL
                |
                | OR
                |
                | Pharmacy-created medicine:
                | medicines.pharmacy_id = current pharmacy
                |
                */

                $medicine = Medicine::query()
                    ->where(
                        'id',
                        $item['medicine_id']
                    )
                    ->where(function ($query) use ($pharmacyId) {
                        $query->whereNull('pharmacy_id')
                            ->orWhere(
                                'pharmacy_id',
                                $pharmacyId
                            );
                    })
                    ->firstOrFail();

                /*
                |--------------------------------------------------------------------------
                | Pharmacy Inventory Record
                |--------------------------------------------------------------------------
                |
                | Never update medicines.stock_quantity here.
                |
                */

                $pharmacyMedicine =
                    PharmacyMedicine::firstOrCreate(
                        [
                            'pharmacy_id' =>
                                $pharmacyId,

                            'medicine_id' =>
                                $medicine->id,
                        ],
                        [
                            'stock_quantity' =>
                                0,

                            'minimum_stock' =>
                                $medicine->minimum_stock
                                ?? 10,

                            'tax_percentage' =>
                                $medicine->tax_percentage
                                ?? 0,

                            'is_active' =>
                                true,
                        ]
                    );

                /*
                |--------------------------------------------------------------------------
                | Lock Inventory Row
                |--------------------------------------------------------------------------
                |
                | Prevent concurrent purchases/sales from changing the same
                | pharmacy stock at the same time.
                |
                */

                $pharmacyMedicine =
                    PharmacyMedicine::where(
                        'id',
                        $pharmacyMedicine->id
                    )
                        ->lockForUpdate()
                        ->firstOrFail();

                $stockBefore =
                    (int) $pharmacyMedicine
                        ->stock_quantity;

                $stockAfter =
                    $stockBefore
                    + (int) $item['quantity'];

                /*
                |--------------------------------------------------------------------------
                | Update Pharmacy-Specific Inventory
                |--------------------------------------------------------------------------
                */

                $inventoryUpdate = [
                    'stock_quantity' =>
                        $stockAfter,

                    'purchase_price' =>
                        $item['purchase_price'],

                    'selling_price' =>
                        $item['selling_price'],
                ];

                /*
                 * Only replace batch when one was entered.
                 */
                if (
                    ! empty(
                        $item['batch_number']
                    )
                ) {
                    $inventoryUpdate[
                        'batch_number'
                    ] = $item['batch_number'];
                }

                /*
                 * Only replace expiry when one was entered.
                 */
                if (
                    ! empty(
                        $item['expiry_date']
                    )
                ) {
                    $inventoryUpdate[
                        'expiry_date'
                    ] = $item['expiry_date'];
                }

                $pharmacyMedicine->update(
                    $inventoryUpdate
                );

                /*
                |--------------------------------------------------------------------------
                | Stock Movement
                |--------------------------------------------------------------------------
                */

                StockMovement::create([
                    'pharmacy_id' =>
                        $pharmacyId,

                    'medicine_id' =>
                        $medicine->id,

                    'user_id' =>
                        auth()->id(),

                    'type' =>
                        'in',

                    'quantity' =>
                        $item['quantity'],

                    'stock_before' =>
                        $stockBefore,

                    'stock_after' =>
                        $stockAfter,

                    'reason' =>
                        'Purchase',

                    'note' =>
                        $purchase->purchase_number,
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Activity Log
            |--------------------------------------------------------------------------
            */

            ActivityLog::record(
                'Purchases',
                'Created',
                $purchase->purchase_number,
                'Purchase created successfully.'
            );
        });

        return redirect()
            ->route('purchases.index')
            ->with(
                'success',
                'Purchase saved and stock updated successfully.'
            );
    }

    /**
     * Display a purchase.
     */
    public function show(Purchase $purchase): Response
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(
            ! $pharmacyId ||
            (int) $purchase->pharmacy_id
                !== (int) $pharmacyId,
            403
        );

        $purchase->load([
            'supplier',
            'user',
            'items.medicine',
        ]);

        return Inertia::render('Purchases/Show', [
            'purchase' => $purchase,
        ]);
    }
}