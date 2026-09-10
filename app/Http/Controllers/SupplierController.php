<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $suppliers = Supplier::where('pharmacy_id', auth()->user()->pharmacy_id)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('contact_person', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('vat_number', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers,

            'filters' => [
                'search' => $search,
            ],

            'stats' => [
                'total' => Supplier::where('pharmacy_id', auth()->user()->pharmacy_id)->count(),

                'active' => Supplier::where('pharmacy_id', auth()->user()->pharmacy_id)
                    ->where('is_active', true)
                    ->count(),

                'inactive' => Supplier::where('pharmacy_id', auth()->user()->pharmacy_id)
                    ->where('is_active', false)
                    ->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Suppliers/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateSupplier($request);

        $validated['pharmacy_id'] = auth()->user()->pharmacy_id;
        $validated['is_active'] = $request->boolean('is_active', true);

        $supplier = Supplier::create($validated);

        ActivityLog::record(
            'Suppliers',
            'Created',
            $supplier->name,
            'New supplier created'
        );

        return redirect()
            ->route('suppliers.index')
            ->with('success', 'Supplier added successfully.');
    }

    public function show(Supplier $supplier): Response
    {
        abort_if(
            $supplier->pharmacy_id !== auth()->user()->pharmacy_id,
            403
        );

        return Inertia::render('Suppliers/Show', [
            'supplier' => $supplier,
        ]);
    }

    public function edit(Supplier $supplier): Response
    {
        abort_if(
            $supplier->pharmacy_id !== auth()->user()->pharmacy_id,
            403
        );

        return Inertia::render('Suppliers/Edit', [
            'supplier' => $supplier,
        ]);
    }

    public function update(Request $request, Supplier $supplier): RedirectResponse
    {
        abort_if(
            $supplier->pharmacy_id !== auth()->user()->pharmacy_id,
            403
        );

        $validated = $this->validateSupplier($request);

        $validated['is_active'] = $request->boolean('is_active');

        $supplier->update($validated);

        ActivityLog::record(
            'Suppliers',
            'Updated',
            $supplier->name,
            'Supplier updated'
        );

        return redirect()
            ->route('suppliers.index')
            ->with('success', 'Supplier updated successfully.');
    }

    public function destroy(Supplier $supplier): RedirectResponse
    {
        abort_if(
            $supplier->pharmacy_id !== auth()->user()->pharmacy_id,
            403
        );

        $name = $supplier->name;

        $supplier->update([
            'is_active' => false,
        ]);

        ActivityLog::record(
            'Suppliers',
            'Deactivated',
            $name,
            'Supplier deactivated'
        );

        return redirect()
            ->route('suppliers.index')
            ->with('success', 'Supplier has been deactivated successfully.');
    }

    private function validateSupplier(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string'],
            'vat_number' => ['nullable', 'string', 'max:100'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}