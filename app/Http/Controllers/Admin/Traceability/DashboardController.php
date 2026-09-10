<?php

namespace App\Http\Controllers\Admin\Traceability;

use App\Http\Controllers\Controller;
use App\Models\TraceabilityTransaction;
use App\Models\TraceabilitySetting;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Traceability/Dashboard', [

            'stats' => [

                'total' => TraceabilityTransaction::count(),

                'pending' => TraceabilityTransaction::where('status', 'pending')->count(),

                'processing' => TraceabilityTransaction::where('status', 'processing')->count(),

                'sent' => TraceabilityTransaction::where('status', 'sent')->count(),

                'failed' => TraceabilityTransaction::where('status', 'failed')->count(),

            ],

            'settings' => TraceabilitySetting::first(),

            'recentTransactions' => TraceabilityTransaction::latest()
                ->take(10)
                ->get(),

        ]);
    }
}