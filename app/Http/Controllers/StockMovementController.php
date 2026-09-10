<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Medicine;
use App\Models\PharmacyMedicine;
use App\Models\StockMovement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StockMovementController extends Controller
{
    /**
     * Display stock movement history for the logged-in pharmacy.
     */
    public function index(): Response
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $movements = StockMovement::where('pharmacy_id', $pharmacyId)
            ->with(['medicine', 'user'])
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Inventory/StockHistory', [
            'movements' => $movements,
        ]);
    }

    /**
     * Show stock adjustment page.
     */
    public function create(Medicine $medicine): Response
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $this->ensureMedicineAccessible($medicine, $pharmacyId);

        $medicine->load(['category', 'unit']);

        $pharmacyMedicine = PharmacyMedicine::firstOrCreate(
            [
                'pharmacy_id' => $pharmacyId,
                'medicine_id' => $medicine->id,
            ],
            [
                'stock_quantity' => 0,
                'minimum_stock' => $medicine->minimum_stock ?? 10,
                'tax_percentage' => $medicine->tax_percentage ?? 0,
                'is_active' => true,
            ]
        );

        /*
         * The existing React page expects stock_quantity on medicine.
         * Give it the pharmacy's stock instead of global stock.
         */
        $medicine->setAttribute(
            'stock_quantity',
            $pharmacyMedicine->stock_quantity
        );

        $medicine->setAttribute(
            'minimum_stock',
            $pharmacyMedicine->minimum_stock
        );

        return Inertia::render('Inventory/Medicines/StockAdjust', [
            'medicine' => $medicine,

            'recentMovements' => StockMovement::where(
                'pharmacy_id',
                $pharmacyId
            )
                ->where('medicine_id', $medicine->id)
                ->latest()
                ->take(10)
                ->get(),
        ]);
    }

    /**
     * Store a stock adjustment.
     */
    public function store(
        Request $request,
        Medicine $medicine
    ): RedirectResponse {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $this->ensureMedicineAccessible($medicine, $pharmacyId);

        $validated = $request->validate([
            'type' => [
                'required',
                'in:in,out,adjustment',
            ],

            'quantity' => [
                'required',
                'integer',
                'min:1',
            ],

            'reason' => [
                'nullable',
                'string',
                'max:255',
            ],

            'note' => [
                'nullable',
                'string',
            ],
        ]);

        DB::transaction(function () use (
            $medicine,
            $pharmacyId,
            $validated
        ) {
            /*
             * Create/get the pharmacy-specific inventory record.
             *
             * Global catalogue stock is NEVER used as the pharmacy's
             * starting stock.
             */
            $pharmacyMedicine = PharmacyMedicine::firstOrCreate(
                [
                    'pharmacy_id' => $pharmacyId,
                    'medicine_id' => $medicine->id,
                ],
                [
                    'stock_quantity' => 0,
                    'minimum_stock' => $medicine->minimum_stock ?? 10,
                    'tax_percentage' => $medicine->tax_percentage ?? 0,
                    'is_active' => true,
                ]
            );

            /*
             * Lock the row while changing stock.
             *
             * This helps prevent two sales/adjustments from changing
             * the same pharmacy stock at the same time.
             */
            $pharmacyMedicine = PharmacyMedicine::where(
                'id',
                $pharmacyMedicine->id
            )
                ->lockForUpdate()
                ->firstOrFail();

            $stockBefore = (int) $pharmacyMedicine->stock_quantity;

            if ($validated['type'] === 'in') {
                $stockAfter =
                    $stockBefore + $validated['quantity'];
            } elseif ($validated['type'] === 'out') {
                /*
                 * Do not silently allow stock to become negative.
                 */
                abort_if(
                    $validated['quantity'] > $stockBefore,
                    422,
                    'Insufficient stock for this adjustment.'
                );

                $stockAfter =
                    $stockBefore - $validated['quantity'];
            } else {
                /*
                 * For "adjustment", quantity represents the
                 * final stock quantity.
                 */
                $stockAfter = $validated['quantity'];
            }

            $pharmacyMedicine->update([
                'stock_quantity' => $stockAfter,
            ]);

            StockMovement::create([
                'pharmacy_id' => $pharmacyId,
                'medicine_id' => $medicine->id,
                'user_id' => auth()->id(),

                'type' => $validated['type'],
                'quantity' => $validated['quantity'],

                'stock_before' => $stockBefore,
                'stock_after' => $stockAfter,

                'reason' => $validated['reason'] ?? null,
                'note' => $validated['note'] ?? null,
            ]);

            ActivityLog::record(
                'Stock',
                'Adjusted',
                $medicine->name,
                "Stock {$validated['type']} from {$stockBefore} to {$stockAfter}"
            );
        });

        return redirect()
            ->route('medicines.show', $medicine->id)
            ->with('success', 'Stock updated successfully.');
    }

    /**
     * A pharmacy may access:
     *
     * 1. Global medicines where pharmacy_id is NULL.
     * 2. Medicines created specifically by this pharmacy.
     */
    private function ensureMedicineAccessible(
        Medicine $medicine,
        int $pharmacyId
    ): void {
        abort_unless(
            $medicine->pharmacy_id === null ||
            (int) $medicine->pharmacy_id === $pharmacyId,
            403
        );
    }
}