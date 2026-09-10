<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Expense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function index(Request $request): Response
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $search = $request->input('search');

        $expenses = Expense::query()
            ->where('pharmacy_id', $pharmacyId)
            ->with('user')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('expense_number', 'like', "%{$search}%")
                        ->orWhere('title', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,

            'filters' => [
                'search' => $search,
            ],

            'stats' => [
                'totalExpenses' => Expense::query()
                    ->where('pharmacy_id', $pharmacyId)
                    ->count(),

                'totalAmount' => Expense::query()
                    ->where('pharmacy_id', $pharmacyId)
                    ->sum('amount'),

                'thisMonth' => Expense::query()
                    ->where('pharmacy_id', $pharmacyId)
                    ->whereMonth('expense_date', now()->month)
                    ->whereYear('expense_date', now()->year)
                    ->sum('amount'),
            ],
        ]);
    }

    public function create(): Response
    {
        abort_if(! auth()->user()->pharmacy_id, 403);

        return Inertia::render('Expenses/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $validated = $this->validateExpense($request);

        $expense = DB::transaction(function () use (
            $validated,
            $pharmacyId
        ) {
            /*
             * expense_number is globally UNIQUE.
             *
             * Start after the highest existing EXP sequence instead
             * of using count() + 1, which can collide after deletion.
             */
            $lastExpenseNumber = Expense::query()
                ->where(
                    'expense_number',
                    'like',
                    'EXP-%'
                )
                ->orderByRaw(
                    "CAST(SUBSTRING(expense_number, 5) AS UNSIGNED) DESC"
                )
                ->lockForUpdate()
                ->value('expense_number');

            $nextSequence = 1;

            if ($lastExpenseNumber) {
                $nextSequence =
                    ((int) substr($lastExpenseNumber, 4)) + 1;
            }

            do {
                $expenseNumber =
                    'EXP-' . str_pad(
                        $nextSequence,
                        6,
                        '0',
                        STR_PAD_LEFT
                    );

                $exists = Expense::query()
                    ->where(
                        'expense_number',
                        $expenseNumber
                    )
                    ->exists();

                $nextSequence++;
            } while ($exists);

            return Expense::create([
                'pharmacy_id' => $pharmacyId,
                'expense_number' => $expenseNumber,
                'category' => $validated['category'],
                'title' => $validated['title'],
                'description' =>
                    $validated['description'] ?? null,
                'amount' => $validated['amount'],
                'expense_date' => $validated['expense_date'],
                'user_id' => auth()->id(),
            ]);
        });

        ActivityLog::record(
            'Expenses',
            'Created',
            $expense->expense_number,
            'Expense created successfully.'
        );

        return redirect()
            ->route('expenses.index')
            ->with(
                'success',
                'Expense created successfully.'
            );
    }

    public function show(Expense $expense): Response
    {
        $this->authorizeExpense($expense);

        return Inertia::render('Expenses/Show', [
            'expense' => $expense->load('user'),
        ]);
    }

    public function edit(Expense $expense): Response
    {
        $this->authorizeExpense($expense);

        return Inertia::render('Expenses/Edit', [
            'expense' => $expense,
        ]);
    }

    public function update(
        Request $request,
        Expense $expense
    ): RedirectResponse {
        $this->authorizeExpense($expense);

        $validated = $this->validateExpense($request);

        /*
         * Do not allow pharmacy_id, expense_number or user_id
         * to be changed through the request.
         */
        $expense->update([
            'category' => $validated['category'],
            'title' => $validated['title'],
            'description' =>
                $validated['description'] ?? null,
            'amount' => $validated['amount'],
            'expense_date' => $validated['expense_date'],
        ]);

        ActivityLog::record(
            'Expenses',
            'Updated',
            $expense->expense_number,
            'Expense updated successfully.'
        );

        return redirect()
            ->route('expenses.index')
            ->with(
                'success',
                'Expense updated successfully.'
            );
    }

    public function destroy(
        Expense $expense
    ): RedirectResponse {
        $this->authorizeExpense($expense);

        $expenseNumber = $expense->expense_number;

        $expense->delete();

        ActivityLog::record(
            'Expenses',
            'Deleted',
            $expenseNumber,
            'Expense deleted successfully.'
        );

        return redirect()
            ->route('expenses.index')
            ->with(
                'success',
                'Expense deleted successfully.'
            );
    }

    private function validateExpense(Request $request): array
    {
        return $request->validate([
            'category' => [
                'required',
                'in:Rent,Electricity,Internet,Salary,Transport,Maintenance,Office,Tax,Miscellaneous',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'amount' => [
                'required',
                'numeric',
                'min:0',
            ],

            'expense_date' => [
                'required',
                'date',
            ],
        ]);
    }

    private function authorizeExpense(Expense $expense): void
    {
        $pharmacyId = auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        abort_if(
            (int) $expense->pharmacy_id !==
            (int) $pharmacyId,
            403
        );
    }
}