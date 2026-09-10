<?php

namespace App\Http\Controllers;
use App\Models\ActivityLog;
use App\Imports\MedicinesImport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class MedicineImportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Inventory/Medicines/Import');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xls,xlsx,csv'],
        ]);

       $fileName = $request->file('file')->getClientOriginalName();

Excel::import(new MedicinesImport, $request->file('file'));

ActivityLog::record(
    'Medicines',
    'Imported',
    $fileName,
    'Medicines imported from Excel file'
);

        return redirect()
            ->route('medicines.index')
            ->with('success', 'Medicines imported successfully.');
    }
}