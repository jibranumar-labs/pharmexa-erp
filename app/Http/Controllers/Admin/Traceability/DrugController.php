<?php

namespace App\Http\Controllers\Admin\Traceability;

use App\Http\Controllers\Controller;
use App\Models\TraceabilitySetting;
use App\Services\Traceability\DrugService;
use Illuminate\Http\RedirectResponse;

class DrugController extends Controller
{
    protected DrugService $drugService;

    public function __construct(DrugService $drugService)
    {
        $this->drugService = $drugService;
    }

    /**
     * Synchronize medicines from Saudi RSD.
     */
    public function sync(): RedirectResponse
    {
        $settings = TraceabilitySetting::first();

        if (!$settings) {
            return back()->with('error', 'Traceability settings not found.');
        }

        $result = $this->drugService->sync($settings);

        if (!$result['success']) {
            return back()->with('error', $result['message']);
        }

        return back()->with(
            'success',
            "Drug synchronization completed. {$result['count']} medicines processed."
        );
    }
}