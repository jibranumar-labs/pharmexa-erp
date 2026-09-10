<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Expense;
use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DailyCashRecordController extends Controller
{
    /**
     * Daily Register main page.
     */
    public function index(Request $request): Response
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(!$pharmacyId, 403);

        $date = Carbon::parse(
            $request->input('date', now()->toDateString())
        )->toDateString();

        $selected = Carbon::parse($date);

        /*
         * Find the saved physical record for this date.
         */
        $record = DB::table('daily_cash_records')
            ->where('pharmacy_id', $pharmacyId)
            ->whereDate('record_date', $date)
            ->first();

        /*
         * Live POS/expense figures.
         */
        $live = $this->calculateDay($pharmacyId, $date);

        /*
         * If a physical record exists, show the saved physical values.
         * Otherwise show an empty form state.
         */
        $summary = $record
            ? $this->recordSummary($record)
            : [
                'id' => null,
                'date' => $date,

                // Automatic POS figures
                'cashSales' => $live['cashSales'],
                'shabakaSales' => $live['shabakaSales'],
                'otherSales' => $live['otherSales'],
                'salesTotal' => $live['totalSales'],

                // Physical collection
                'physicalCash' => 0,
                'physicalShabaka' => 0,
                'physicalOthers' => 0,
                'physicalTotal' => 0,

                'totalSales' => 0,
                'expenses' => $live['expenses'],
                'expectedCash' => $live['netCash'],
                'netCash' => 0,

                'cashDifference' => 0,
                'shabakaDifference' => 0,
                'otherDifference' => 0,

                'notes' => '',
                'closed' => false,
            ];

        /*
         * Monthly saved records.
         */
        $monthly = $this->monthlyData($pharmacyId, $selected);

        return Inertia::render('DailyCashRecords/Index', [
            'record' => $record,
            'date' => $date,
            'summary' => $summary,
            'monthly' => $monthly,
        ]);
    }

    /**
     * Create a new daily physical-count record.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(!$pharmacyId, 403);

        $date = Carbon::parse(
            $request->input('date', now()->toDateString())
        )->toDateString();

        /*
         * Do not create duplicate records for the same pharmacy/date.
         */
        $existing = DB::table('daily_cash_records')
            ->where('pharmacy_id', $pharmacyId)
            ->whereDate('record_date', $date)
            ->first();

        if ($existing) {
            return redirect()->route(
                'daily-cash-records.edit',
                $existing->id
            );
        }

        return Inertia::render('DailyCashRecords/Create', [
            'date' => $date,
            'summary' => $this->calculateDay($pharmacyId, $date),
        ]);
    }

    /**
     * Store new daily record.
     */
    public function store(Request $request): RedirectResponse
    {
        return $this->save($request, null);
    }

    /**
     * Edit an existing daily record.
     */
    public function edit(int $dailyCashRecord): Response
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(!$pharmacyId, 403);

        $record = DB::table('daily_cash_records')
            ->where('id', $dailyCashRecord)
            ->where('pharmacy_id', $pharmacyId)
            ->first();

        abort_if(!$record, 404);

        return Inertia::render('DailyCashRecords/Edit', [
            'record' => $record,
            'date' => Carbon::parse($record->record_date)->toDateString(),
            'summary' => $this->recordSummary($record),
        ]);
    }

    /**
     * Update existing daily record.
     */
    public function update(
        Request $request,
        int $dailyCashRecord
    ): RedirectResponse {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(!$pharmacyId, 403);

        $record = DB::table('daily_cash_records')
            ->where('id', $dailyCashRecord)
            ->where('pharmacy_id', $pharmacyId)
            ->first();

        abort_if(!$record, 404);

        return $this->save($request, $record);
    }

    /**
     * Delete daily record.
     */
    public function destroy(int $dailyCashRecord): RedirectResponse
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(!$pharmacyId, 403);

        $record = DB::table('daily_cash_records')
            ->where('id', $dailyCashRecord)
            ->where('pharmacy_id', $pharmacyId)
            ->first();

        abort_if(!$record, 404);

        $date = Carbon::parse($record->record_date)->toDateString();

        DB::table('daily_cash_records')
            ->where('id', $record->id)
            ->delete();

        ActivityLog::record(
            'Daily Cash',
            'Deleted',
            $date,
            'Daily cash record deleted successfully.'
        );

        return redirect()
            ->route('daily-cash-records.index', ['date' => $date])
            ->with(
                'success',
                'Daily cash record deleted successfully.'
            );
    }

    /**
     * Save/create/update the physical daily count.
     */
    private function save(
        Request $request,
        ?object $existing
    ): RedirectResponse {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(!$pharmacyId, 403);

        $validated = $request->validate([
            'record_date' => ['required', 'date'],

            'physical_cash' => [
                'required',
                'numeric',
                'min:0',
            ],

            'physical_shabaka' => [
                'required',
                'numeric',
                'min:0',
            ],

            'physical_others' => [
                'required',
                'numeric',
                'min:0',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:2000',
            ],
        ]);

        $date = Carbon::parse(
            $validated['record_date']
        )->toDateString();

        /*
         * Prevent duplicate records for the same pharmacy/date.
         */
        $duplicate = DB::table('daily_cash_records')
            ->where('pharmacy_id', $pharmacyId)
            ->whereDate('record_date', $date)
            ->when(
                $existing,
                fn ($query) => $query->where('id', '!=', $existing->id)
            )
            ->first();

        if ($duplicate) {
            return redirect()
                ->route(
                    'daily-cash-records.edit',
                    $duplicate->id
                )
                ->with(
                    'error',
                    'A daily record already exists for this date.'
                );
        }

        /*
         * Get automatic POS and expense figures.
         */
        $figures = $this->calculateDay(
            $pharmacyId,
            $date
        );

        /*
         * IMPORTANT:
         *
         * These are the REAL physical amounts entered by the pharmacy.
         * We save them directly.
         *
         * Physical Cash
         * Physical Shabaka
         * Physical Other
         */
        $physicalCash = round(
            (float) $validated['physical_cash'],
            2
        );

        $physicalShabaka = round(
            (float) $validated['physical_shabaka'],
            2
        );

        $physicalOthers = round(
            (float) $validated['physical_others'],
            2
        );

        /*
         * Total actually collected physically.
         */
        $physicalTotal = round(
            $physicalCash
            + $physicalShabaka
            + $physicalOthers,
            2
        );

        /*
         * Expected amount from the system.
         *
         * Cash expected after expenses:
         * cash sales - expenses
         *
         * Shabaka and other payments are not reduced by cash expenses
         * because expenses are treated as cash-position expenses.
         */
        $expectedCash = round(
            $figures['netCash'],
            2
        );

        /*
         * Differences are informational only.
         */
        $cashDifference = round(
            $physicalCash - $expectedCash,
            2
        );

        $shabakaDifference = round(
            $physicalShabaka - $figures['shabakaSales'],
            2
        );

        $otherDifference = round(
            $physicalOthers - $figures['otherSales'],
            2
        );

        /*
         * Net physical cash after expenses.
         */
        $netCash = round(
            $physicalTotal - $figures['expenses'],
            2
        );

        /*
         * Save EVERYTHING required by the UI/database.
         *
         * This fixes the previous problem where the physical values
         * were calculated but not actually stored.
         */
        $data = [
            'pharmacy_id' => $pharmacyId,

            'record_date' => $date,

            // Automatic POS figures
            'cash_sales' => $figures['cashSales'],
            'shabaka_sales' => $figures['shabakaSales'],
            'other_sales' => $figures['otherSales'],
            'total_sales' => $figures['totalSales'],

            // Automatic expenses
            'expenses' => $figures['expenses'],

            // Physical amounts entered by user
            'physical_cash' => $physicalCash,
            'physical_shabaka' => $physicalShabaka,
            'physical_others' => $physicalOthers,

            // Calculated values
            'net_cash' => $netCash,

            'cash_difference' => $cashDifference,
            'shabaka_difference' => $shabakaDifference,
            'other_difference' => $otherDifference,

            'notes' => $validated['notes'] ?? null,

            'user_id' => auth()->id(),

            'updated_at' => now(),
        ];

        /*
         * Update existing record.
         */
        if ($existing) {
            DB::table('daily_cash_records')
                ->where('id', $existing->id)
                ->update($data);

            $action = 'Updated';
        }

        /*
         * Create new record.
         */
        else {
            $data['created_at'] = now();

            DB::table('daily_cash_records')
                ->insert($data);

            $action = 'Created';
        }

        ActivityLog::record(
            'Daily Cash',
            $action,
            $date,
            'Daily cash register saved successfully.'
        );

        /*
         * Always return to the Daily Register main page
         * for the same date.
         */
        return redirect()
            ->route(
                'daily-cash-records.index',
                ['date' => $date]
            )
            ->with(
                'success',
                'Daily cash register saved successfully.'
            );
    }

    /**
     * Calculate automatic POS sales and expenses for a day.
     */
    private function calculateDay(
        int $pharmacyId,
        string $date
    ): array {
        $sales = Sale::query()
            ->where('pharmacy_id', $pharmacyId)
            ->whereDate('created_at', $date)
            ->where('status', 'completed');

        /*
         * Cash sales.
         */
        $cash = (float) (
            clone $sales
        )
            ->where('payment_method', 'cash')
            ->sum(
                DB::raw(
                    'paid_amount - change_amount'
                )
            );

        /*
         * Mada/Shabaka sales.
         */
        $shabaka = (float) (
            clone $sales
        )
            ->where('payment_method', 'mada')
            ->sum(
                DB::raw(
                    'paid_amount - change_amount'
                )
            );

        /*
         * Other payment methods.
         */
        $others = (float) (
            clone $sales
        )
            ->whereNotIn(
                'payment_method',
                ['cash', 'mada']
            )
            ->sum(
                DB::raw(
                    'paid_amount - change_amount'
                )
            );

        /*
         * Pharmacy expenses for the same date.
         */
        $expenses = (float) Expense::query()
            ->where('pharmacy_id', $pharmacyId)
            ->whereDate('expense_date', $date)
            ->sum('amount');

        $totalSales = $cash + $shabaka + $others;

        /*
         * Expected cash position.
         */
        $netCash = $cash - $expenses;

        return [
            'cashSales' => round($cash, 2),
            'shabakaSales' => round($shabaka, 2),
            'otherSales' => round($others, 2),

            'totalSales' => round($totalSales, 2),

            'expenses' => round($expenses, 2),

            'netCash' => round($netCash, 2),
        ];
    }

    /**
     * Convert a saved database record into the UI summary.
     */
    private function recordSummary(object $record): array
    {
        $cash = (float) ($record->cash_sales ?? 0);
        $shabaka = (float) ($record->shabaka_sales ?? 0);
        $others = (float) ($record->other_sales ?? 0);
        $expenses = (float) ($record->expenses ?? 0);

        /*
         * REAL physical amounts.
         *
         * Do NOT reconstruct these from differences.
         */
        $physicalCash = (float) ($record->physical_cash ?? 0);
        $physicalShabaka = (float) ($record->physical_shabaka ?? 0);
        $physicalOthers = (float) ($record->physical_others ?? 0);

        /*
         * Total physically collected.
         */
        $physicalTotal =
            $physicalCash
            + $physicalShabaka
            + $physicalOthers;

        /*
         * POS sales total.
         */
        $salesTotal =
            $cash
            + $shabaka
            + $others;

        /*
         * Expected cash from system.
         */
        $expectedCash = $cash - $expenses;

        /*
         * Net physical cash after expenses.
         */
        $netCash = $physicalTotal - $expenses;

        return [
            'id' => $record->id ?? null,

            'date' => Carbon::parse(
                $record->record_date
            )->toDateString(),

            /*
             * Automatic POS sales.
             */
            'cashSales' => round($cash, 2),
            'shabakaSales' => round($shabaka, 2),
            'otherSales' => round($others, 2),
            'salesTotal' => round($salesTotal, 2),

            /*
             * Physical collection.
             *
             * totalSales is kept as physicalTotal for compatibility
             * with the existing UI cards.
             */
            'totalSales' => round($physicalTotal, 2),

            'physicalCash' => round($physicalCash, 2),
            'physicalShabaka' => round($physicalShabaka, 2),
            'physicalOthers' => round($physicalOthers, 2),
            'physicalTotal' => round($physicalTotal, 2),

            /*
             * Expenses and net cash.
             */
            'expenses' => round($expenses, 2),
            'expectedCash' => round($expectedCash, 2),
            'netCash' => round($netCash, 2),

            /*
             * Differences.
             */
            'cashDifference' => round(
                (float) ($record->cash_difference ?? 0),
                2
            ),

            'shabakaDifference' => round(
                (float) ($record->shabaka_difference ?? 0),
                2
            ),

            'otherDifference' => round(
                (float) ($record->other_difference ?? 0),
                2
            ),

            'notes' => $record->notes ?? '',

            'closed' => true,
        ];
    }

    /**
     * Monthly saved daily records.
     */
    private function monthlyData(
        int $pharmacyId,
        Carbon $month
    ): array {
        $rows = DB::table('daily_cash_records')
            ->where('pharmacy_id', $pharmacyId)
            ->whereBetween(
                DB::raw('DATE(record_date)'),
                [
                    $month
                        ->copy()
                        ->startOfMonth()
                        ->toDateString(),

                    $month
                        ->copy()
                        ->endOfMonth()
                        ->toDateString(),
                ]
            )
            ->orderBy('record_date')
            ->get()
            ->map(
                fn ($row) => $this->recordSummary($row)
            )
            ->values();

        return [
            'month' => $month->format('F Y'),

            'records' => $rows,

            'daysClosed' => $rows->count(),

            /*
             * Monthly physical collection.
             */
            'totalSales' => round(
                $rows->sum('physicalTotal'),
                2
            ),

            'cashSales' => round(
                $rows->sum('physicalCash'),
                2
            ),

            'shabakaSales' => round(
                $rows->sum('physicalShabaka'),
                2
            ),

            'otherSales' => round(
                $rows->sum('physicalOthers'),
                2
            ),

            'expenses' => round(
                $rows->sum('expenses'),
                2
            ),

            'netCash' => round(
                $rows->sum('netCash'),
                2
            ),
        ];
    }
}