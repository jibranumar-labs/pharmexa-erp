<?php

namespace App\Http\Controllers\Admin\Traceability;

use App\Http\Controllers\Controller;
use App\Models\TraceabilityTransaction;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * All Transactions
     */
    public function index(): Response
    {
        $transactions = TraceabilityTransaction::with('sale')
            ->latest()
            ->get();

        return Inertia::render('Admin/Traceability/Transactions', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Failed Transactions
     */
    public function failed(): Response
    {
        $transactions = TraceabilityTransaction::with('sale')
            ->where('status', 'failed')
            ->latest()
            ->get();

        return Inertia::render('Admin/Traceability/Failed', [
            'transactions' => $transactions,
        ]);
    }
}