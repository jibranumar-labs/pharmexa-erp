<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\ActivityLog;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SalesController extends Controller
{
    /**
     * Display sales belonging to the logged-in pharmacy.
     */
    public function index(Request $request): Response
    {
        $user = auth()->user();
        $pharmacyId = $user->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $search = trim((string) $request->input('search', ''));

        $salesQuery = Sale::query()
            ->where('pharmacy_id', $pharmacyId)
            ->with('user');

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        | Search by:
        | - Invoice number
        | - Customer name
        */
        if ($search !== '') {
            $salesQuery->where(function ($query) use ($search) {
                $query
                    ->where('invoice_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%");
            });
        }

        $sales = $salesQuery
            ->latest()
            ->paginate(20)
            ->withQueryString();

        /*
        |--------------------------------------------------------------------------
        | Sales Statistics
        |--------------------------------------------------------------------------
        */
        $totalSales = Sale::query()
            ->where('pharmacy_id', $pharmacyId)
            ->count();

        $totalRevenue = Sale::query()
            ->where('pharmacy_id', $pharmacyId)
            ->sum('total');

        $paidAmount = Sale::query()
            ->where('pharmacy_id', $pharmacyId)
            ->sum('paid_amount');

        return Inertia::render('Sales/Index', [
            'sales' => $sales,

            'filters' => [
                'search' => $search,
            ],

            'stats' => [
                'totalSales' => $totalSales,
                'totalRevenue' => $totalRevenue,
                'paidAmount' => $paidAmount,
                'balanceAmount' => $totalRevenue - $paidAmount,
            ],
        ]);
    }

    /**
     * Display a sale belonging to the logged-in pharmacy.
     */
    public function show(Sale $sale): Response
    {
        $user = auth()->user();
        $pharmacyId = $user->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        /*
        |--------------------------------------------------------------------------
        | Security: Make sure this sale belongs to this pharmacy
        |--------------------------------------------------------------------------
        */
        abort_unless(
            (int) $sale->pharmacy_id === (int) $pharmacyId,
            403
        );

        $sale->load([
            'items.medicine',
            'user',
            'customer',
        ]);

        $setting = Setting::where(
            'pharmacy_id',
            $pharmacyId
        )->first();

        /*
        |--------------------------------------------------------------------------
        | Activity Log
        |--------------------------------------------------------------------------
        */
        ActivityLog::record(
            'Sales',
            'Viewed',
            $sale->invoice_number,
            'Sale viewed by ' . $user->name
        );

        return Inertia::render('Sales/Show', [
            'sale' => $sale,
            'setting' => $setting,
        ]);
    }
}