<?php

namespace App\Http\Controllers\Admin\Traceability;

use App\Http\Controllers\Controller;
use App\Models\TraceabilitySetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
class SettingsController extends Controller
{
    /**
     * Display Traceability Settings
     */
    public function index(Request $request): Response
    {
        $pharmacy = $request->user()->pharmacy;

        $settings = TraceabilitySetting::firstOrCreate(
            [
                'pharmacy_id' => $pharmacy->id,
            ],
            [
                'enabled' => false,
                'environment' => 'sandbox',
            ]
        );

        return Inertia::render('Admin/Traceability/Settings', [
            'settings' => $settings,
        ]);
    }

    /**
     * Save Traceability Settings
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'enabled' => ['required', 'boolean'],
            'environment' => ['required', 'in:sandbox,production'],

            'gln' => ['nullable', 'string', 'max:50'],
            'username' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string'],

            'certificate_password' => ['nullable', 'string'],

            'api_endpoint' => ['nullable', 'url'],
            'drug_endpoint' => ['nullable', 'url'],
        ]);

        $pharmacy = $request->user()->pharmacy;

        $settings = TraceabilitySetting::firstOrCreate([
            'pharmacy_id' => $pharmacy->id,
        ]);

       /*
/*
|--------------------------------------------------------------------------
| Certificate Upload
|--------------------------------------------------------------------------
*/

if ($request->hasFile('certificate')) {

    if (
        $settings->certificate_path &&
        Storage::exists($settings->certificate_path)
    ) {
        Storage::delete($settings->certificate_path);
    }

    $validated['certificate_path'] = $request
        ->file('certificate')
        ->store('traceability/certificates');
}

$settings->update($validated);

return back()->with([
    'success' => 'Traceability settings saved successfully.',
]);
    }
}