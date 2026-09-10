<?php

namespace App\Http\Controllers\Admin\Traceability;

use App\Http\Controllers\Controller;
use App\Models\TraceabilityTransaction;
use Inertia\Inertia;
use Inertia\Response;

class LogController extends Controller
{
    /**
     * Display traceability logs.
     */
    public function index(): Response
    {
        $logs = TraceabilityTransaction::latest()
            ->select([
                'id',
                'operation',
                'status',
                'response_code',
                'response_message',
                'created_at',
            ])
            ->take(100)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'operation' => ucfirst($transaction->operation),
                    'status' => ucfirst($transaction->status),
                    'message' => $transaction->response_message ?? 'No message',
                    'response_code' => $transaction->response_code,
                    'created_at' => $transaction->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Admin/Traceability/Logs', [
            'logs' => $logs,
        ]);
    }
}