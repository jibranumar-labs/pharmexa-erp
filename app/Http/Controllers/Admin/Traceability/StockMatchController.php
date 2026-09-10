<?php

namespace App\Http\Controllers\Admin\Traceability;

use App\Exports\SfdaStockMatchExport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class StockMatchController extends Controller
{
    /**
     * Download the SFDA Stock Match Excel file.
     */
    public function export(): BinaryFileResponse
    {
        $pharmacyId = (int) auth()->user()->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $filename = 'sfda-stock-match-' . now()->format('Y-m-d_H-i-s') . '.xlsx';

        return Excel::download(
            new SfdaStockMatchExport($pharmacyId),
            $filename
        );
    }
}