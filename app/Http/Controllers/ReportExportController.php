<?php

namespace App\Http\Controllers;

use App\Models\Pharmacy;
use App\Models\PharmacyMedicine;
use App\Models\Purchase;
use App\Models\Sale;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class ReportExportController extends Controller
{
    /**
     * Download the report as a real PDF.
     */
    public function pdf(Request $request)
    {
        $data = $this->reportData();

        // Print button uses the same report endpoint, but opens the clean
        // standalone Blade report instead of printing the React/AppLayout page.
        if ($request->query('format') === 'print') {
            return response()
                ->view('print.report', $data)
                ->header('Content-Type', 'text/html; charset=UTF-8');
        }

        return Pdf::loadView('print.report', $data)
            ->setPaper('a4', 'portrait')
            ->setOption('isRemoteEnabled', false)
            ->download('pharmexa-report.pdf');
    }

    /**
     * Excel-compatible tab-separated export.
     */
    public function excel(): Response
    {
        return $this->downloadCsv(
            'pharmexa-report.xls',
            "\t"
        );
    }

    /**
     * CSV export.
     */
    public function csv(): Response
    {
        return $this->downloadCsv(
            'pharmexa-report.csv',
            ','
        );
    }

    /**
     * Build report data for the currently authenticated pharmacy.
     */
    private function reportData(): array
    {
        $user = auth()->user();

        $pharmacyId = $user?->pharmacy_id;

        abort_if(
            !$pharmacyId,
            403,
            'No pharmacy is assigned to this account.'
        );

        $pharmacy = Pharmacy::find($pharmacyId);

        abort_if(
            !$pharmacy,
            404,
            'Pharmacy not found.'
        );

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Settings / Branding
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        | The pharmacy master record may contain the original name entered
        | by the Super Owner, while Settings may contain the name updated
        | later by the Admin.
        |
        | Example:
        | pharmacies.name       = Rouh care
        | settings.pharmacy_name = Al Noor Pharmacy
        |
        | The Admin Settings name must be preferred for reports.
        |
        |--------------------------------------------------------------------------
        */

        $setting = DB::table('settings')
            ->where('pharmacy_id', $pharmacyId)
            ->first();

        $pharmacyName = trim((string) (
            $setting?->pharmacy_name
            ?: $pharmacy->name
            ?: 'Pharmacy'
        ));

        /*
        |--------------------------------------------------------------------------
        | Report Period
        |--------------------------------------------------------------------------
        */

        [$from, $to, $periodLabel, $filter] = $this->period();

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Inventory
        |--------------------------------------------------------------------------
        */

        $inventoryQuery = PharmacyMedicine::query()
            ->where('pharmacy_id', $pharmacyId)
            ->where('is_active', true);

        $lowStock = (clone $inventoryQuery)
            ->where('stock_quantity', '>', 0)
            ->whereColumn(
                'stock_quantity',
                '<=',
                'minimum_stock'
            )
            ->count();

        $expired = (clone $inventoryQuery)
            ->whereNotNull('expiry_date')
            ->whereDate('expiry_date', '<', today())
            ->count();

        $totalMedicines = (clone $inventoryQuery)->count();

        $inventoryValue = (clone $inventoryQuery)
            ->selectRaw(
                'COALESCE(SUM(stock_quantity * purchase_price), 0) as inventory_value'
            )
            ->value('inventory_value');

        /*
        |--------------------------------------------------------------------------
        | Sales / Purchases
        |--------------------------------------------------------------------------
        */

        $salesQuery = Sale::query()
            ->where('pharmacy_id', $pharmacyId)
            ->whereBetween('created_at', [$from, $to]);

        $purchasesQuery = Purchase::query()
            ->where('pharmacy_id', $pharmacyId)
            ->whereBetween('created_at', [$from, $to]);

        $totalSales = (clone $salesQuery)->sum('total');

        $totalPurchases = (clone $purchasesQuery)->sum('total');

        $totalInvoices = (clone $salesQuery)->count();

        $totalPurchaseInvoices = (clone $purchasesQuery)->count();

        /*
        |--------------------------------------------------------------------------
        | Cost of Goods Sold / Gross Profit
        |--------------------------------------------------------------------------
        */

        $cogs = DB::table('sale_items')
            ->join(
                'sales',
                'sale_items.sale_id',
                '=',
                'sales.id'
            )
            ->leftJoin(
                'pharmacy_medicines',
                function ($join) use ($pharmacyId) {
                    $join->on(
                        'sale_items.medicine_id',
                        '=',
                        'pharmacy_medicines.medicine_id'
                    )->where(
                        'pharmacy_medicines.pharmacy_id',
                        '=',
                        $pharmacyId
                    );
                }
            )
            ->where(
                'sales.pharmacy_id',
                $pharmacyId
            )
            ->whereBetween(
                'sales.created_at',
                [$from, $to]
            )
            ->sum(
                DB::raw(
                    'sale_items.quantity * COALESCE(pharmacy_medicines.purchase_price, 0)'
                )
            );

        $grossProfit =
            (float) $totalSales -
            (float) $cogs;

        /*
        |--------------------------------------------------------------------------
        | Recent Transactions
        |--------------------------------------------------------------------------
        */

        $recentSales = (clone $salesQuery)
            ->with('user')
            ->latest('created_at')
            ->take(10)
            ->get();

        $recentPurchases = (clone $purchasesQuery)
            ->with('supplier')
            ->latest('created_at')
            ->take(10)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Return Report Data
        |--------------------------------------------------------------------------
        */

        return [
            /*
            |--------------------------------------------------------------------------
            | Pharmacy Branding
            |--------------------------------------------------------------------------
            */

            'pharmacyName' => $pharmacyName,

            'pharmacyCity' =>
                $setting?->city
                ?: $pharmacy->city
                ?: '',

            'pharmacyAddress' =>
                $setting?->address
                ?: $pharmacy->address
                ?: '',

            'pharmacyCountry' =>
                $setting?->country
                ?: $pharmacy->country
                ?: '',

            'currency' =>
                $setting?->currency
                ?: $pharmacy->currency
                ?: 'SAR',

            /*
            |--------------------------------------------------------------------------
            | Period
            |--------------------------------------------------------------------------
            */

            'filter' => $filter,

            'periodFrom' => $from->format('Y-m-d'),

            'periodTo' => $to->format('Y-m-d'),

            'periodLabel' => $periodLabel,

            /*
            |--------------------------------------------------------------------------
            | Financial Statistics
            |--------------------------------------------------------------------------
            */

            'totalSales' => (float) $totalSales,

            'totalPurchases' => (float) $totalPurchases,

            'cogs' => (float) $cogs,

            'grossProfit' => (float) $grossProfit,

            /*
            |--------------------------------------------------------------------------
            | Transactions
            |--------------------------------------------------------------------------
            */

            'totalInvoices' => $totalInvoices,

            'totalPurchaseInvoices' => $totalPurchaseInvoices,

            /*
            |--------------------------------------------------------------------------
            | Inventory
            |--------------------------------------------------------------------------
            */

            'totalMedicines' => $totalMedicines,

            'inventoryValue' => (float) $inventoryValue,

            'lowStock' => $lowStock,

            'expired' => $expired,

            /*
            |--------------------------------------------------------------------------
            | Recent Transactions
            |--------------------------------------------------------------------------
            */

            'recentSales' => $recentSales,

            'recentPurchases' => $recentPurchases,
        ];
    }

    /**
     * Resolve the requested report period.
     */
    private function period(): array
    {
        $filter = request()->query(
            'filter',
            'This Month'
        );

        $today = Carbon::today();

        switch ($filter) {
            case 'Today':

                $from = $today->copy()->startOfDay();

                $to = $today->copy()->endOfDay();

                break;

            case 'This Week':

                $from = $today->copy()->startOfWeek();

                $to = $today->copy()->endOfWeek();

                break;

            case 'This Year':

                $from = $today->copy()->startOfYear();

                $to = $today->copy()->endOfYear();

                break;

            case 'Custom':

                $customFrom = request()->query('from');

                $customTo = request()->query('to');

                if ($customFrom && $customTo) {
                    try {
                        $from = Carbon::parse(
                            $customFrom
                        )->startOfDay();

                        $to = Carbon::parse(
                            $customTo
                        )->endOfDay();

                        if ($from->gt($to)) {
                            [
                                $from,
                                $to
                            ] = [
                                $to->copy()->startOfDay(),
                                $from->copy()->endOfDay()
                            ];
                        }

                        $label =
                            $from->format('d M Y')
                            . ' – '
                            . $to->format('d M Y');

                        return [
                            $from,
                            $to,
                            $label,
                            'Custom'
                        ];
                    } catch (\Throwable $e) {
                        // Fall through to the current month.
                    }
                }

                $filter = 'This Month';

                $from = $today->copy()->startOfMonth();

                $to = $today->copy()->endOfMonth();

                break;

            case 'This Month':

            default:

                $filter = 'This Month';

                $from = $today->copy()->startOfMonth();

                $to = $today->copy()->endOfMonth();

                break;
        }

        $label =
            $from->format('d M Y')
            . ' – '
            . $to->format('d M Y');

        return [
            $from,
            $to,
            $label,
            $filter
        ];
    }

    /**
     * Generate CSV or Excel-compatible TSV response.
     */
    private function downloadCsv(
        string $filename,
        string $separator
    ): Response {
        $data = $this->reportData();

        $rows = [
            [
                'Pharmexa ERP Report'
            ],

            [
                'Pharmacy',
                $data['pharmacyName']
            ],

            [
                'Period',
                $data['periodLabel']
            ],

            [
                'Generated At',
                now()->format('d M Y h:i A')
            ],

            [],

            [
                'Metric',
                'Value'
            ],

            [
                'Total Sales',
                number_format(
                    $data['totalSales'],
                    2
                ) . ' ' . $data['currency']
            ],

            [
                'Total Purchases',
                number_format(
                    $data['totalPurchases'],
                    2
                ) . ' ' . $data['currency']
            ],

            [
                'Gross Profit',
                number_format(
                    $data['grossProfit'],
                    2
                ) . ' ' . $data['currency']
            ],

            [
                'Transactions',
                $data['totalInvoices']
            ],

            [
                'Purchase Invoices',
                $data['totalPurchaseInvoices']
            ],

            [
                'Inventory Value',
                number_format(
                    $data['inventoryValue'],
                    2
                ) . ' ' . $data['currency']
            ],

            [
                'Active Products',
                $data['totalMedicines']
            ],

            [
                'Low Stock',
                $data['lowStock']
            ],

            [
                'Expired Medicines',
                $data['expired']
            ],
        ];

        $content = collect($rows)
            ->map(function ($row) use ($separator) {

                return collect($row)
                    ->map(function ($value) use ($separator) {

                        $value = (string) $value;

                        if (
                            str_contains(
                                $value,
                                $separator
                            ) ||
                            str_contains(
                                $value,
                                '"'
                            ) ||
                            str_contains(
                                $value,
                                "\n"
                            ) ||
                            str_contains(
                                $value,
                                "\r"
                            )
                        ) {
                            $value =
                                '"'
                                .
                                str_replace(
                                    '"',
                                    '""',
                                    $value
                                )
                                .
                                '"';
                        }

                        return $value;
                    })
                    ->implode($separator);
            })
            ->implode("\n");

        return response(
            $content,
            200,
            [
                'Content-Type' =>
                    $separator === ','
                        ? 'text/csv; charset=UTF-8'
                        : 'application/vnd.ms-excel; charset=UTF-8',

                'Content-Disposition' =>
                    'attachment; filename="'
                    . $filename
                    . '"',
            ]
        );
    }
}