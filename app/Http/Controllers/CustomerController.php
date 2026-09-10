<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $customers = Customer::where('pharmacy_id', auth()->user()->pharmacy_id)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('customer_code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Customers/Index', [
            'customers' => $customers,

            'filters' => [
                'search' => $search,
            ],

            'stats' => [
                'total' => Customer::where('pharmacy_id', auth()->user()->pharmacy_id)->count(),

                'active' => Customer::where('pharmacy_id', auth()->user()->pharmacy_id)
                    ->where('is_active', true)
                    ->count(),

                'inactive' => Customer::where('pharmacy_id', auth()->user()->pharmacy_id)
                    ->where('is_active', false)
                    ->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Customers/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'gender' => ['required', 'in:Male,Female,Other'],
            'date_of_birth' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:255'],
            'national_id' => ['nullable', 'string', 'max:100'],
            'credit_limit' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $validated['pharmacy_id'] = auth()->user()->pharmacy_id;

        $validated['customer_code'] = 'CUS-' . str_pad(
    (Customer::max('id') ?? 0) + 1,
    6,
    '0',
    STR_PAD_LEFT
);
        $validated['loyalty_points'] = 0;
        $validated['current_balance'] = 0;
        $validated['is_active'] = $request->boolean('is_active', true);

        $customer = Customer::create($validated);

        ActivityLog::record(
            'Customers',
            'Created',
            $customer->name,
            'New customer created'
        );

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer created successfully.');
    }

    public function show(Customer $customer): Response
    {
        abort_if(
            $customer->pharmacy_id !== auth()->user()->pharmacy_id,
            403
        );

        return Inertia::render('Customers/Show', [
            'customer' => $customer,
        ]);
    }

    public function edit(Customer $customer): Response
    {
        abort_if(
            $customer->pharmacy_id !== auth()->user()->pharmacy_id,
            403
        );

        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer): RedirectResponse
    {
        abort_if(
            $customer->pharmacy_id !== auth()->user()->pharmacy_id,
            403
        );

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'gender' => ['required', 'in:Male,Female,Other'],
            'date_of_birth' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:255'],
            'national_id' => ['nullable', 'string', 'max:100'],
            'credit_limit' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $validated['is_active'] = $request->boolean('is_active');

        $customer->update($validated);

        ActivityLog::record(
            'Customers',
            'Updated',
            $customer->name,
            'Customer information updated'
        );

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        abort_if(
            $customer->pharmacy_id !== auth()->user()->pharmacy_id,
            403
        );

        $name = $customer->name;

        ActivityLog::record(
            'Customers',
            'Deleted',
            $name,
            'Customer deleted'
        );

        $customer->delete();

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer deleted successfully.');
    }
}