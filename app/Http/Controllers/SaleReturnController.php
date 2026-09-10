<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\PharmacyMedicine;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\SaleReturnItem;
use App\Models\StockMovement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SaleReturnController extends Controller
{
    /**
     * Display sales returns for the current pharmacy.
     */
    public function index(): Response
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $returns = SaleReturn::query()
            ->whereHas('sale', function ($query) use ($pharmacyId) {
                $query->where('pharmacy_id', $pharmacyId);
            })
            ->with([
                'sale',
                'user',
            ])
            ->latest()
            ->paginate(10);

        $baseQuery = SaleReturn::query()
            ->whereHas('sale', function ($query) use ($pharmacyId) {
                $query->where('pharmacy_id', $pharmacyId);
            });

        return Inertia::render('SalesReturn/Index', [
            'returns' => $returns,

            'stats' => [
                'totalReturns' =>
                    (clone $baseQuery)->count(),

                'refundAmount' =>
                    (clone $baseQuery)->sum('refund_amount'),
            ],
        ]);
    }

    /**
     * Show sales return creation page.
     */
    public function create(): Response
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        /*
        |--------------------------------------------------------------------------
        | Sales Available For Return
        |--------------------------------------------------------------------------
        */

        $sales = Sale::query()
            ->where('pharmacy_id', $pharmacyId)
            ->with([
                'items' => function ($query) {
                    $query->select([
                        'id',
                        'sale_id',
                        'medicine_id',
                        'medicine_name',
                        'quantity',
                        'unit_price',
                        'total_price',
                    ]);
                },
            ])
            ->latest()
            ->get([
                'id',
                'invoice_number',
                'total',
                'created_at',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Quantities Already Returned
        |--------------------------------------------------------------------------
        */

        $saleItemIds = $sales
            ->flatMap(
                fn ($sale) => $sale->items->pluck('id')
            )
            ->values();

        $returnedQuantities = collect();

        if ($saleItemIds->isNotEmpty()) {
            $returnedQuantities = SaleReturnItem::query()
                ->whereIn(
                    'sale_item_id',
                    $saleItemIds
                )
                ->selectRaw(
                    'sale_item_id, SUM(quantity) as returned_quantity'
                )
                ->groupBy('sale_item_id')
                ->pluck(
                    'returned_quantity',
                    'sale_item_id'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Add Return Information To Items
        |--------------------------------------------------------------------------
        */

        $sales->each(
            function ($sale) use ($returnedQuantities) {

                $sale->items->each(
                    function ($item) use ($returnedQuantities) {

                        $soldQuantity =
                            (int) $item->quantity;

                        $returnedQuantity =
                            (int) (
                                $returnedQuantities[$item->id]
                                ?? 0
                            );

                        $returnableQuantity =
                            max(
                                0,
                                $soldQuantity - $returnedQuantity
                            );

                        $item->setAttribute(
                            'sold_quantity',
                            $soldQuantity
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

                $sale->setAttribute(
                    'has_returnable_items',
                    $sale->items->contains(
                        fn ($item) =>
                            (int) $item->returnable_quantity > 0
                    )
                );
            }
        );

        return Inertia::render(
            'SalesReturn/Create',
            [
                'sales' => $sales,
            ]
        );
    }

    /**
     * Process a partial or full sales return.
     */
    public function store(
        Request $request
    ): RedirectResponse {

        $pharmacyId =
            auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        /*
        |--------------------------------------------------------------------------
        | Basic Request Validation
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'sale_id' => [
                'required',
                'integer',

                Rule::exists(
                    'sales',
                    'id'
                )->where(
                    'pharmacy_id',
                    $pharmacyId
                ),
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.sale_item_id' => [
                'required',
                'integer',
                'distinct',
            ],

            'items.*.quantity' => [
                'required',
                'integer',
                'min:0',
            ],

            'refund_amount' => [
                'required',
                'numeric',
                'min:0',
            ],

            'reason' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'return_date' => [
                'required',
                'date',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:5000',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Remove Zero Quantity Items
        |--------------------------------------------------------------------------
        */

        $requestedItems = collect(
            $validated['items']
        )
            ->map(function ($item) {
                return [
                    'sale_item_id' =>
                        (int) $item['sale_item_id'],

                    'quantity' =>
                        (int) $item['quantity'],
                ];
            })
            ->filter(
                fn ($item) =>
                    $item['quantity'] > 0
            )
            ->values();

        if ($requestedItems->isEmpty()) {
            throw ValidationException::withMessages([
                'items' =>
                    'Please select at least one quantity to return.',
            ]);
        }

        DB::transaction(
            function () use (
                $validated,
                $requestedItems,
                $pharmacyId
            ) {

                /*
                |--------------------------------------------------------------------------
                | Lock Sale
                |--------------------------------------------------------------------------
                */

                $sale = Sale::query()
                    ->where(
                        'pharmacy_id',
                        $pharmacyId
                    )
                    ->lockForUpdate()
                    ->findOrFail(
                        $validated['sale_id']
                    );

                /*
                |--------------------------------------------------------------------------
                | Load Sale Items
                |--------------------------------------------------------------------------
                |
                | Only items belonging to THIS sale can be returned.
                |
                */

                $saleItems = $sale
                    ->items()
                    ->whereIn(
                        'id',
                        $requestedItems->pluck(
                            'sale_item_id'
                        )
                    )
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('id');

                if (
                    $saleItems->count()
                    !== $requestedItems->count()
                ) {
                    throw ValidationException::withMessages([
                        'items' =>
                            'One or more selected items do not belong to this invoice.',
                    ]);
                }

                /*
                |--------------------------------------------------------------------------
                | Validate Remaining Returnable Quantities
                |--------------------------------------------------------------------------
                |
                | This is recalculated on the server.
                | Never trust the frontend returnable quantity.
                |
                */

                $preparedItems = [];

                $calculatedRefund = 0;

                foreach ($requestedItems as $requestedItem) {

                    $saleItem = $saleItems->get(
                        $requestedItem['sale_item_id']
                    );

                    $returnQuantity =
                        (int) $requestedItem['quantity'];

                    $alreadyReturned =
                        (int) SaleReturnItem::query()
                            ->where(
                                'sale_item_id',
                                $saleItem->id
                            )
                            ->sum('quantity');

                    $soldQuantity =
                        (int) $saleItem->quantity;

                    $returnableQuantity =
                        max(
                            0,
                            $soldQuantity - $alreadyReturned
                        );

                    if ($returnableQuantity <= 0) {
                        throw ValidationException::withMessages([
                            'items' =>
                                $saleItem->medicine_name .
                                ' has already been fully returned.',
                        ]);
                    }

                    if (
                        $returnQuantity >
                        $returnableQuantity
                    ) {
                        throw ValidationException::withMessages([
                            'items' =>
                                'Only ' .
                                $returnableQuantity .
                                ' unit(s) of ' .
                                $saleItem->medicine_name .
                                ' can still be returned.',
                        ]);
                    }

                    $unitPrice =
                        (float) $saleItem->unit_price;

                    $lineTotal =
                        round(
                            $unitPrice *
                            $returnQuantity,
                            2
                        );

                    $calculatedRefund +=
                        $lineTotal;

                    $preparedItems[] = [
                        'saleItem' =>
                            $saleItem,

                        'quantity' =>
                            $returnQuantity,

                        'unitPrice' =>
                            $unitPrice,

                        'lineTotal' =>
                            $lineTotal,
                    ];
                }

                $calculatedRefund =
                    round(
                        $calculatedRefund,
                        2
                    );

                /*
                |--------------------------------------------------------------------------
                | Verify Refund Amount
                |--------------------------------------------------------------------------
                |
                | The frontend calculates it for display,
                | but the server calculates it again.
                |
                */

                $submittedRefund =
                    round(
                        (float) $validated['refund_amount'],
                        2
                    );

                if (
                    abs(
                        $submittedRefund -
                        $calculatedRefund
                    ) > 0.009
                ) {
                    throw ValidationException::withMessages([
                        'refund_amount' =>
                            'Refund amount does not match the selected return quantities. Please refresh and try again.',
                    ]);
                }

                /*
                |--------------------------------------------------------------------------
                | Generate Unique Return Number
                |--------------------------------------------------------------------------
                |
                | Do NOT use count() + 1.
                |
                | We inspect existing SR numbers and generate the
                | next available numeric sequence.
                |
                */

                $lastReturnNumber =
                    SaleReturn::query()
                        ->where(
                            'return_number',
                            'like',
                            'SR-%'
                        )
                        ->orderByRaw(
                            "CAST(SUBSTRING(return_number, 4) AS UNSIGNED) DESC"
                        )
                        ->lockForUpdate()
                        ->value(
                            'return_number'
                        );

                $nextReturnSequence = 1;

                if ($lastReturnNumber) {
                    $nextReturnSequence =
                        ((int) substr(
                            $lastReturnNumber,
                            3
                        )) + 1;
                }

                do {
                    $returnNumber =
                        'SR-' .
                        str_pad(
                            $nextReturnSequence,
                            6,
                            '0',
                            STR_PAD_LEFT
                        );

                    $exists =
                        SaleReturn::query()
                            ->where(
                                'return_number',
                                $returnNumber
                            )
                            ->exists();

                    $nextReturnSequence++;
                } while ($exists);

                /*
                |--------------------------------------------------------------------------
                | Create Return Header
                |--------------------------------------------------------------------------
                */

                $return =
                    SaleReturn::create([
                        'return_number' =>
                            $returnNumber,

                        'sale_id' =>
                            $sale->id,

                        'user_id' =>
                            auth()->id(),

                        /*
                         * Store the SERVER calculated amount.
                         */
                        'refund_amount' =>
                            $calculatedRefund,

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
                | Process Selected Return Items
                |--------------------------------------------------------------------------
                */

                foreach (
                    $preparedItems
                    as $preparedItem
                ) {

                    $saleItem =
                        $preparedItem['saleItem'];

                    $returnQuantity =
                        $preparedItem['quantity'];

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
                                $saleItem->medicine_id
                            )
                            ->lockForUpdate()
                            ->first();

                    /*
                     * A sold item should already have a
                     * pharmacy_medicines record.
                     *
                     * Do NOT silently create a partial inventory row here,
                     * because PharmacyMedicine contains required local
                     * fields such as barcode in this project.
                     */

                    if (! $pharmacyMedicine) {
                        throw ValidationException::withMessages([
                            'items' =>
                                'Pharmacy inventory record was not found for ' .
                                $saleItem->medicine_name .
                                '. Return was cancelled and no stock was changed.',
                        ]);
                    }

                    $stockBefore =
                        (int) $pharmacyMedicine
                            ->stock_quantity;

                    $stockAfter =
                        $stockBefore +
                        $returnQuantity;

                    /*
                    |--------------------------------------------------------------------------
                    | Restore Pharmacy Stock
                    |--------------------------------------------------------------------------
                    */

                    $pharmacyMedicine->update([
                        'stock_quantity' =>
                            $stockAfter,
                    ]);

                    /*
                    |--------------------------------------------------------------------------
                    | Save Returned Item
                    |--------------------------------------------------------------------------
                    */

                    SaleReturnItem::create([
                        'sale_return_id' =>
                            $return->id,

                        'sale_item_id' =>
                            $saleItem->id,

                        'medicine_id' =>
                            $saleItem->medicine_id,

                        'quantity' =>
                            $returnQuantity,

                        'unit_price' =>
                            $preparedItem['unitPrice'],

                        'total_price' =>
                            $preparedItem['lineTotal'],
                    ]);

                    /*
                    |--------------------------------------------------------------------------
                    | Stock Movement
                    |--------------------------------------------------------------------------
                    */

                    StockMovement::create([
                        'pharmacy_id' =>
                            $pharmacyId,

                        'medicine_id' =>
                            $saleItem->medicine_id,

                        'user_id' =>
                            auth()->id(),

                        'type' =>
                            'in',

                        'quantity' =>
                            $returnQuantity,

                        'stock_before' =>
                            $stockBefore,

                        'stock_after' =>
                            $stockAfter,

                        'reason' =>
                            'Sale Return',

                        'note' =>
                            $return->return_number,
                    ]);

                    /*
                     * IMPORTANT:
                     *
                     * Never increment:
                     *
                     * medicines.stock_quantity
                     *
                     * Operational pharmacy stock lives in:
                     *
                     * pharmacy_medicines.stock_quantity
                     */
                }

                /*
                |--------------------------------------------------------------------------
                | Activity Log
                |--------------------------------------------------------------------------
                */

                ActivityLog::record(
                    'Sales Return',
                    'Created',
                    $return->return_number,
                    'Sales return processed successfully.'
                );
            }
        );

        return redirect()
            ->route(
                'sale-returns.index'
            )
            ->with(
                'success',
                'Sales return processed successfully and stock restored.'
            );
    }

    /**
     * Display one sales return.
     */
    public function show(
        SaleReturn $saleReturn
    ): Response {

        $pharmacyId =
            auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $saleReturn->load([
            'sale',
            'user',
            'items.medicine',
        ]);

        abort_if(
            ! $saleReturn->sale ||
            (int) $saleReturn
                ->sale
                ->pharmacy_id !==
            (int) $pharmacyId,
            403
        );

        return Inertia::render(
            'SalesReturn/Show',
            [
                'saleReturn' =>
                    $saleReturn,
            ]
        );
    }

    /**
     * Delete a sales return record.
     *
     * IMPORTANT:
     * This does NOT reverse inventory.
     */
    public function destroy(
        SaleReturn $saleReturn
    ): RedirectResponse {

        $pharmacyId =
            auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $saleReturn->load('sale');

        abort_if(
            ! $saleReturn->sale ||
            (int) $saleReturn
                ->sale
                ->pharmacy_id !==
            (int) $pharmacyId,
            403
        );

        ActivityLog::record(
            'Sales Return',
            'Deleted',
            $saleReturn->return_number,
            'Sales return deleted.'
        );

        $saleReturn->delete();

        return redirect()
            ->route(
                'sale-returns.index'
            )
            ->with(
                'success',
                'Sales return deleted successfully.'
            );
    }
}