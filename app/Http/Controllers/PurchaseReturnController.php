<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\PharmacyMedicine;
use App\Models\Purchase;
use App\Models\PurchaseReturn;
use App\Models\PurchaseReturnItem;
use App\Models\StockMovement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseReturnController extends Controller
{
    /**
     * Display purchase returns for the current pharmacy.
     */
    public function index(): Response
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $returns = PurchaseReturn::query()
            ->whereHas('purchase', function ($query) use ($pharmacyId) {
                $query->where('pharmacy_id', $pharmacyId);
            })
            ->with([
                'purchase',
                'user',
                'items.medicine',
            ])
            ->latest()
            ->paginate(10);

        $totalReturns = PurchaseReturn::query()
            ->whereHas('purchase', function ($query) use ($pharmacyId) {
                $query->where('pharmacy_id', $pharmacyId);
            })
            ->count();

        $returnAmount = PurchaseReturn::query()
            ->whereHas('purchase', function ($query) use ($pharmacyId) {
                $query->where('pharmacy_id', $pharmacyId);
            })
            ->sum('return_amount');

        return Inertia::render('PurchaseReturn/Index', [
            'returns' => $returns,

            'stats' => [
                'totalReturns' => $totalReturns,
                'returnAmount' => $returnAmount,
            ],
        ]);
    }

    /**
     * Show purchase return creation page.
     */
    public function create(): Response
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        /*
        |--------------------------------------------------------------------------
        | Load Purchases + Purchase Items
        |--------------------------------------------------------------------------
        |
        | Form.jsx needs:
        |
        | purchase.items
        | item.medicine
        | item.returned_quantity
        | item.returnable_quantity
        | purchase.has_returnable_items
        |
        */

        $purchases = Purchase::query()
            ->where('pharmacy_id', $pharmacyId)
            ->with([
                'supplier:id,name',

                'items' => function ($query) {
                    $query->with([
                        'medicine:id,name,barcode,sku',
                    ]);
                },
            ])
            ->latest()
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Get All Purchase Item IDs
        |--------------------------------------------------------------------------
        */

        $purchaseItemIds = $purchases
            ->flatMap(function ($purchase) {
                return $purchase->items->pluck('id');
            })
            ->filter()
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Calculate Previous Returns PER PURCHASE ITEM
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | We use purchase_item_id.
        |
        | We do NOT use medicine_id.
        |
        | Therefore:
        |
        | PUR-000001 item ID 1 returned 10
        |
        | does NOT affect:
        |
        | PUR-000002 item ID 2 returned 0
        |
        */

        $returnedQuantities = collect();

        if ($purchaseItemIds->isNotEmpty()) {
            $returnedQuantities = PurchaseReturnItem::query()
                ->whereIn(
                    'purchase_item_id',
                    $purchaseItemIds
                )
                ->select(
                    'purchase_item_id',
                    DB::raw(
                        'SUM(quantity) as returned_quantity'
                    )
                )
                ->groupBy('purchase_item_id')
                ->pluck(
                    'returned_quantity',
                    'purchase_item_id'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Add Return Information to Every Purchase Item
        |--------------------------------------------------------------------------
        */

        $purchases->each(
            function ($purchase) use ($returnedQuantities) {

                $purchase->items->each(
                    function ($item) use ($returnedQuantities) {

                        $purchasedQuantity =
                            (int) $item->quantity;

                        $returnedQuantity =
                            (int) (
                                $returnedQuantities->get(
                                    $item->id,
                                    0
                                )
                            );

                        $returnableQuantity = max(
                            0,
                            $purchasedQuantity
                                - $returnedQuantity
                        );

                        $item->setAttribute(
                            'returned_quantity',
                            $returnedQuantity
                        );

                        $item->setAttribute(
                            'returnable_quantity',
                            $returnableQuantity
                        );
                    }
                );

                /*
                 * Used by Form.jsx for:
                 *
                 * "- Fully Returned"
                 */
                $purchase->setAttribute(
                    'has_returnable_items',
                    $purchase->items->contains(
                        function ($item) {
                            return
                                (int) $item->returnable_quantity
                                > 0;
                        }
                    )
                );
            }
        );

        return Inertia::render(
            'PurchaseReturn/Create',
            [
                'purchases' => $purchases,
            ]
        );
    }

    /**
     * Process a partial purchase return.
     */
    public function store(
        Request $request
    ): RedirectResponse {
        $pharmacyId =
            auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        /*
        |--------------------------------------------------------------------------
        | Validate Request
        |--------------------------------------------------------------------------
        |
        | Form.jsx sends:
        |
        | purchase_id
        | return_date
        | reason
        | notes
        |
        | items: [
        |     {
        |         purchase_item_id: 2,
        |         quantity: 3
        |     }
        | ]
        |
        */

        $validated = $request->validate([
            'purchase_id' => [
                'required',
                'integer',

                Rule::exists(
                    'purchases',
                    'id'
                )->where(
                    'pharmacy_id',
                    $pharmacyId
                ),
            ],

            'return_date' => [
                'required',
                'date',
            ],

            'reason' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'notes' => [
                'nullable',
                'string',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.purchase_item_id' => [
                'required',
                'integer',
                'distinct',
                'exists:purchase_items,id',
            ],

            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],
        ]);

        DB::transaction(
            function () use (
                $validated,
                $pharmacyId
            ) {
                /*
                |--------------------------------------------------------------------------
                | Lock Selected Purchase
                |--------------------------------------------------------------------------
                */

                $purchase = Purchase::query()
                    ->where(
                        'pharmacy_id',
                        $pharmacyId
                    )
                    ->lockForUpdate()
                    ->findOrFail(
                        $validated['purchase_id']
                    );

                /*
                |--------------------------------------------------------------------------
                | Load Selected Purchase Items
                |--------------------------------------------------------------------------
                */

                $submittedPurchaseItemIds =
                    collect($validated['items'])
                        ->pluck('purchase_item_id')
                        ->map(
                            fn ($id) => (int) $id
                        )
                        ->values();

                $purchaseItems =
                    $purchase->items()
                        ->whereIn(
                            'id',
                            $submittedPurchaseItemIds
                        )
                        ->with('medicine')
                        ->lockForUpdate()
                        ->get()
                        ->keyBy('id');

                /*
                |--------------------------------------------------------------------------
                | Make Sure Every Submitted Item Belongs to This Purchase
                |--------------------------------------------------------------------------
                */

                if (
                    $purchaseItems->count()
                    !==
                    $submittedPurchaseItemIds->count()
                ) {
                    throw ValidationException::withMessages([
                        'items' =>
                            'One or more selected products do not belong to this purchase.',
                    ]);
                }

                /*
                |--------------------------------------------------------------------------
                | Validate Each Return + Prepare Lines
                |--------------------------------------------------------------------------
                */

                $returnLines = [];

                $returnAmount = 0;

                foreach (
                    $validated['items']
                    as $submittedItem
                ) {
                    $purchaseItemId =
                        (int) $submittedItem[
                            'purchase_item_id'
                        ];

                    $returnQuantity =
                        (int) $submittedItem[
                            'quantity'
                        ];

                    $purchaseItem =
                        $purchaseItems->get(
                            $purchaseItemId
                        );

                    /*
                    |--------------------------------------------------------------------------
                    | Calculate Already Returned Quantity
                    |--------------------------------------------------------------------------
                    |
                    | This is specific to THIS purchase item.
                    |
                    */

                    $alreadyReturned =
                        (int) PurchaseReturnItem::query()
                            ->where(
                                'purchase_item_id',
                                $purchaseItem->id
                            )
                            ->sum('quantity');

                    $purchasedQuantity =
                        (int) $purchaseItem->quantity;

                    $remainingReturnable =
                        max(
                            0,
                            $purchasedQuantity
                                - $alreadyReturned
                        );

                    $medicineName =
                        $purchaseItem->medicine?->name
                        ?? 'Product';

                    /*
                    |--------------------------------------------------------------------------
                    | Prevent Returning Fully Returned Item
                    |--------------------------------------------------------------------------
                    */

                    if (
                        $remainingReturnable <= 0
                    ) {
                        throw ValidationException::withMessages([
                            'items' =>
                                $medicineName .
                                ' has already been fully returned.',
                        ]);
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Prevent Over-Return
                    |--------------------------------------------------------------------------
                    */

                    if (
                        $returnQuantity
                        > $remainingReturnable
                    ) {
                        throw ValidationException::withMessages([
                            'items' =>
                                $medicineName .
                                ' only has ' .
                                $remainingReturnable .
                                ' unit(s) remaining available for return.',
                        ]);
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Lock Pharmacy Inventory
                    |--------------------------------------------------------------------------
                    */

                    $pharmacyMedicine =
                        PharmacyMedicine::query()
                            ->where(
                                'pharmacy_id',
                                $pharmacyId
                            )
                            ->where(
                                'medicine_id',
                                $purchaseItem->medicine_id
                            )
                            ->lockForUpdate()
                            ->first();

                    if (! $pharmacyMedicine) {
                        throw ValidationException::withMessages([
                            'items' =>
                                $medicineName .
                                ' does not exist in this pharmacy inventory.',
                        ]);
                    }

                    $stockBefore =
                        (int) $pharmacyMedicine
                            ->stock_quantity;

                    /*
                    |--------------------------------------------------------------------------
                    | Prevent Negative Pharmacy Stock
                    |--------------------------------------------------------------------------
                    */

                    if (
                        $returnQuantity
                        > $stockBefore
                    ) {
                        throw ValidationException::withMessages([
                            'items' =>
                                $medicineName .
                                ' only has ' .
                                $stockBefore .
                                ' unit(s) currently available in pharmacy stock.',
                        ]);
                    }

                    $stockAfter =
                        $stockBefore
                        - $returnQuantity;

                    /*
                    |--------------------------------------------------------------------------
                    | Calculate Return Value
                    |--------------------------------------------------------------------------
                    |
                    | We use the ORIGINAL PURCHASE PRICE.
                    |
                    */

                    $unitPrice =
                        (float) $purchaseItem
                            ->purchase_price;

                    $lineTotal =
                        round(
                            $unitPrice
                            * $returnQuantity,
                            2
                        );

                    $returnAmount +=
                        $lineTotal;

                    $returnLines[] = [
                        'purchase_item' =>
                            $purchaseItem,

                        'pharmacy_medicine' =>
                            $pharmacyMedicine,

                        'quantity' =>
                            $returnQuantity,

                        'unit_price' =>
                            $unitPrice,

                        'total_price' =>
                            $lineTotal,

                        'stock_before' =>
                            $stockBefore,

                        'stock_after' =>
                            $stockAfter,
                    ];
                }

                if (empty($returnLines)) {
                    throw ValidationException::withMessages([
                        'items' =>
                            'Please select at least one product to return.',
                    ]);
                }

                /*
                |--------------------------------------------------------------------------
                | Generate Return Number
                |--------------------------------------------------------------------------
                */

                $lastReturnNumber = PurchaseReturn::query()
    ->where(
        'return_number',
        'like',
        'PR-%'
    )
    ->orderByRaw(
        "CAST(SUBSTRING(return_number, 4) AS UNSIGNED) DESC"
    )
    ->lockForUpdate()
    ->value('return_number');

$nextReturnSequence = 1;

if ($lastReturnNumber) {
    $nextReturnSequence =
        ((int) substr($lastReturnNumber, 3)) + 1;
}

do {
    $returnNumber =
        'PR-' . str_pad(
            $nextReturnSequence,
            6,
            '0',
            STR_PAD_LEFT
        );

    $exists = PurchaseReturn::query()
        ->where(
            'return_number',
            $returnNumber
        )
        ->exists();

    $nextReturnSequence++;
} while ($exists);

                /*
                |--------------------------------------------------------------------------
                | Create Purchase Return
                |--------------------------------------------------------------------------
                |
                | The browser does NOT decide return_amount.
                |
                */

                $return =
                    PurchaseReturn::create([
                        'return_number' =>
                            $returnNumber,

                        'purchase_id' =>
                            $purchase->id,

                        'user_id' =>
                            auth()->id(),

                        'return_amount' =>
                            round(
                                $returnAmount,
                                2
                            ),

                        'reason' =>
                            $validated['reason']
                            ?? null,

                        'return_date' =>
                            $validated['return_date'],

                        'notes' =>
                            $validated['notes']
                            ?? null,
                    ]);

                /*
                |--------------------------------------------------------------------------
                | Process Partial Return Lines
                |--------------------------------------------------------------------------
                */

                foreach (
                    $returnLines
                    as $line
                ) {
                    $purchaseItem =
                        $line['purchase_item'];

                    $pharmacyMedicine =
                        $line['pharmacy_medicine'];

                    /*
                    |--------------------------------------------------------------------------
                    | Reduce Pharmacy Inventory
                    |--------------------------------------------------------------------------
                    |
                    | Global medicines.stock_quantity remains untouched.
                    |
                    */

                    $pharmacyMedicine->update([
                        'stock_quantity' =>
                            $line['stock_after'],
                    ]);

                    /*
                    |--------------------------------------------------------------------------
                    | Create Return Item
                    |--------------------------------------------------------------------------
                    */

                    PurchaseReturnItem::create([
                        'purchase_return_id' =>
                            $return->id,

                        'purchase_item_id' =>
                            $purchaseItem->id,

                        'medicine_id' =>
                            $purchaseItem->medicine_id,

                        'quantity' =>
                            $line['quantity'],

                        'unit_price' =>
                            $line['unit_price'],

                        'total_price' =>
                            $line['total_price'],
                    ]);

                    /*
                    |--------------------------------------------------------------------------
                    | Record Stock Movement
                    |--------------------------------------------------------------------------
                    */

                    StockMovement::create([
                        'pharmacy_id' =>
                            $pharmacyId,

                        'medicine_id' =>
                            $purchaseItem->medicine_id,

                        'user_id' =>
                            auth()->id(),

                        'type' =>
                            'out',

                        'quantity' =>
                            $line['quantity'],

                        'stock_before' =>
                            $line['stock_before'],

                        'stock_after' =>
                            $line['stock_after'],

                        'reason' =>
                            'Purchase Return',

                        'note' =>
                            $return->return_number,
                    ]);
                }

                /*
                |--------------------------------------------------------------------------
                | Activity Log
                |--------------------------------------------------------------------------
                */

                ActivityLog::record(
                    'Purchase Return',
                    'Created',
                    $return->return_number,
                    'Purchase return processed successfully.'
                );
            }
        );

        return redirect()
            ->route('purchase-returns.index')
            ->with(
                'success',
                'Purchase return processed successfully.'
            );
    }

    /**
     * Display one purchase return.
     */
    public function show(
        PurchaseReturn $purchaseReturn
    ): Response {
        $pharmacyId =
            auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $purchaseReturn->load([
            'purchase',
            'user',
            'items.medicine',
            'items.purchaseItem',
        ]);

        abort_if(
            ! $purchaseReturn->purchase
            ||
            (int) $purchaseReturn
                ->purchase
                ->pharmacy_id
            !==
            (int) $pharmacyId,
            403
        );

        return Inertia::render(
            'PurchaseReturn/Show',
            [
                'purchaseReturn' =>
                    $purchaseReturn,
            ]
        );
    }

    /**
     * Delete purchase return.
     *
     * NOTE:
     * This preserves your current delete behaviour.
     * Deleting a processed return does NOT restore inventory.
     *
     * Later we should replace this with a proper return reversal/cancellation.
     */
    public function destroy(
        PurchaseReturn $purchaseReturn
    ): RedirectResponse {
        $pharmacyId =
            auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $purchaseReturn->load('purchase');

        abort_if(
            ! $purchaseReturn->purchase
            ||
            (int) $purchaseReturn
                ->purchase
                ->pharmacy_id
            !==
            (int) $pharmacyId,
            403
        );

        ActivityLog::record(
            'Purchase Return',
            'Deleted',
            $purchaseReturn->return_number,
            'Purchase return deleted.'
        );

        $purchaseReturn->delete();

        return redirect()
            ->route('purchase-returns.index')
            ->with(
                'success',
                'Purchase return deleted successfully.'
            );
    }
}
