<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Manufacturer;
use App\Models\Medicine;
use App\Models\Pharmacy;
use App\Models\PharmacyMedicine;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GlobalMedicineController extends Controller
{
    /**
     * Display the Super Owner global medicine catalogue.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        /*
        |--------------------------------------------------------------------------
        | Global Medicines Only
        |--------------------------------------------------------------------------
        |
        | pharmacy_id = NULL means this product belongs to the Pharmexa
        | master catalogue and is available to all pharmacies.
        |
        */

        $medicines = Medicine::query()
            ->whereNull('pharmacy_id')
            ->with([
                'category',
                'manufacturer',
                'unit',
            ])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where(
                        'name',
                        'like',
                        "%{$search}%"
                    )
                        ->orWhere(
                            'sku',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'barcode',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'generic_name',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'brand_name',
                            'like',
                            "%{$search}%"
                        );
                });
            })
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render(
            'Platform/Medicines/Index',
            [
                'medicines' => $medicines,

                'filters' => [
                    'search' => $search,
                ],

                'stats' => [
                    'total' => Medicine::whereNull(
                        'pharmacy_id'
                    )->count(),

                    'active' => Medicine::whereNull(
                        'pharmacy_id'
                    )
                        ->where('is_active', true)
                        ->count(),

                    'inactive' => Medicine::whereNull(
                        'pharmacy_id'
                    )
                        ->where('is_active', false)
                        ->count(),

                    'pharmacies' => Pharmacy::count(),
                ],
            ]
        );
    }

    /**
     * Show the global medicine creation form.
     */
    public function create(): Response
    {
        return Inertia::render(
            'Platform/Medicines/Create',
            $this->formData()
        );
    }

    /**
     * Create a new global medicine and distribute it
     * to every existing pharmacy.
     */
    public function store(
        Request $request
    ): RedirectResponse {
        $validated = $this->validateMedicine(
            $request
        );

        $medicine = DB::transaction(
            function () use ($validated) {

                /*
                |--------------------------------------------------------------------------
                | Create Master Medicine
                |--------------------------------------------------------------------------
                */

                $medicine = Medicine::create([
                    ...$validated,

                    /*
                     * NULL = global/master product.
                     */
                    'pharmacy_id' => null,
                ]);

                /*
                |--------------------------------------------------------------------------
                | Distribute To Every Existing Pharmacy
                |--------------------------------------------------------------------------
                |
                | We create only the pharmacy inventory/customisation row.
                | We do not duplicate the master medicine itself.
                |
                | Every pharmacy begins with zero stock for the new product.
                |
                */

                $now = now();

                Pharmacy::query()
                    ->select('id')
                    ->orderBy('id')
                    ->chunkById(
                        500,
                        function ($pharmacies) use (
                            $medicine,
                            $now
                        ) {
                            $rows = [];

                            foreach ($pharmacies as $pharmacy) {
                                $rows[] = [
                                    'pharmacy_id' =>
                                        $pharmacy->id,

                                    'medicine_id' =>
                                        $medicine->id,

                                    'stock_quantity' => 0,

                                    'minimum_stock' =>
                                        $medicine->minimum_stock
                                        ?? 10,

                                    'tax_percentage' =>
                                        $medicine->tax_percentage
                                        ?? 0,

                                    'is_active' => true,

                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ];
                            }

                            if (! empty($rows)) {
                                PharmacyMedicine::insertOrIgnore(
                                    $rows
                                );
                            }
                        }
                    );

                return $medicine;
            }
        );

        return redirect()
            ->route(
                'platform.medicines.index'
            )
            ->with(
                'success',
                "Global product \"{$medicine->name}\" created and distributed to all pharmacies."
            );
    }
        /**
     * Display one global medicine.
     */
    public function show(
        Medicine $medicine
    ): Response {
        /*
        |--------------------------------------------------------------------------
        | Global Medicine Only
        |--------------------------------------------------------------------------
        */

        abort_unless(
            $medicine->pharmacy_id === null,
            404
        );

        $medicine->load([
            'category',
            'manufacturer',
            'unit',
        ]);

        /*
         * Count how many pharmacies currently have this
         * master medicine connected.
         */
        $pharmacyCount = PharmacyMedicine::where(
            'medicine_id',
            $medicine->id
        )->count();

        return Inertia::render(
            'Platform/Medicines/Show',
            [
                'medicine' => $medicine,

                'pharmacyCount' =>
                    $pharmacyCount,

                'totalPharmacies' =>
                    Pharmacy::count(),
            ]
        );
    }

    /**
     * Show global medicine edit form.
     */
    public function edit(
        Medicine $medicine
    ): Response {
        abort_unless(
            $medicine->pharmacy_id === null,
            404
        );

        return Inertia::render(
            'Platform/Medicines/Edit',
            [
                'medicine' => $medicine,

                ...$this->formData(),
            ]
        );
    }

    /**
     * Update a global/master medicine.
     */
    public function update(
        Request $request,
        Medicine $medicine
    ): RedirectResponse {
        abort_unless(
            $medicine->pharmacy_id === null,
            404
        );

        $validated = $this->validateMedicine(
            $request,
            $medicine
        );

        DB::transaction(
            function () use (
                $medicine,
                $validated
            ) {
                /*
                |--------------------------------------------------------------------------
                | Update Master Product
                |--------------------------------------------------------------------------
                |
                | This changes the global/default information.
                |
                | PharmacyMedicine overrides are NOT overwritten.
                |
                */

                $medicine->update(
                    $validated
                );

                /*
                |--------------------------------------------------------------------------
                | Repair Missing Pharmacy Links
                |--------------------------------------------------------------------------
                |
                | Normally every pharmacy already has this product.
                |
                | But if a pharmacy link is missing for any reason,
                | editing the global product repairs it automatically.
                |
                */

                $now = now();

                Pharmacy::query()
                    ->select('id')
                    ->orderBy('id')
                    ->chunkById(
                        500,
                        function ($pharmacies) use (
                            $medicine,
                            $now
                        ) {
                            $rows = [];

                            foreach ($pharmacies as $pharmacy) {
                                $rows[] = [
                                    'pharmacy_id' =>
                                        $pharmacy->id,

                                    'medicine_id' =>
                                        $medicine->id,

                                    'stock_quantity' => 0,

                                    'minimum_stock' =>
                                        $medicine->minimum_stock
                                        ?? 10,

                                    'tax_percentage' =>
                                        $medicine->tax_percentage
                                        ?? 0,

                                    'is_active' => true,

                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ];
                            }

                            if (! empty($rows)) {
                                PharmacyMedicine::insertOrIgnore(
                                    $rows
                                );
                            }
                        }
                    );
            }
        );

        return redirect()
            ->route(
                'platform.medicines.index'
            )
            ->with(
                'success',
                "Global product \"{$medicine->name}\" updated successfully."
            );
    }

    /**
     * Delete a global/master medicine.
     */
    public function destroy(
        Medicine $medicine
    ): RedirectResponse {
        abort_unless(
            $medicine->pharmacy_id === null,
            404
        );

        $name = $medicine->name;

        DB::transaction(
            function () use ($medicine) {

                /*
                |--------------------------------------------------------------------------
                | Remove Pharmacy Catalogue Links
                |--------------------------------------------------------------------------
                */

                PharmacyMedicine::where(
                    'medicine_id',
                    $medicine->id
                )->delete();

                /*
                |--------------------------------------------------------------------------
                | Delete Master Product
                |--------------------------------------------------------------------------
                */

                $medicine->delete();
            }
        );

        return redirect()
            ->route(
                'platform.medicines.index'
            )
            ->with(
                'success',
                "Global product \"{$name}\" deleted successfully."
            );
    }
        /**
     * Data required by the global medicine
     * create and edit forms.
     */
    private function formData(): array
    {
        return [
            'categories' => Category::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),

            'manufacturers' => Manufacturer::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),

            'suppliers' => \App\Models\Supplier::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),

            'units' => Unit::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
        ];
    }

    /**
     * Validate global medicine data.
     */
    private function validateMedicine(
        Request $request,
        ?Medicine $medicine = null
    ): array {
        $medicineId = $medicine?->id;

        return $request->validate([
            /*
            |--------------------------------------------------------------------------
            | Basic Information
            |--------------------------------------------------------------------------
            */

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'generic_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'brand_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            /*
            |--------------------------------------------------------------------------
            | Barcode / SKU
            |--------------------------------------------------------------------------
            |
            | Your current medicines table has GLOBAL unique constraints
            | on barcode and sku.
            |
            | Therefore even local and global Medicine rows cannot currently
            | share the same barcode/sku in the medicines table.
            |
            */

            'barcode' => [
                'required',
                'string',
                'max:255',

                Rule::unique(
                    'medicines',
                    'barcode'
                )->ignore($medicineId),
            ],

            'sku' => [
                'required',
                'string',
                'max:255',

                Rule::unique(
                    'medicines',
                    'sku'
                )->ignore($medicineId),
            ],

            /*
            |--------------------------------------------------------------------------
            | Medicine Type
            |--------------------------------------------------------------------------
            */

            'medicine_type' => [
                'required',

                Rule::in([
                    'Tablet',
                    'Capsule',
                    'Syrup',
                    'Injection',
                    'Cream',
                    'Drops',
                    'Powder',
                    'Other',
                ]),
            ],

            /*
            |--------------------------------------------------------------------------
            | Relationships
            |--------------------------------------------------------------------------
            */

            'category_id' => [
                'required',
                'integer',
                'exists:categories,id',
            ],

            'manufacturer_id' => [
                'required',
                'integer',
                'exists:manufacturers,id',
            ],

            'supplier_id' => [
                'required',
                'integer',
                'exists:suppliers,id',
            ],

            'unit_id' => [
                'required',
                'integer',
                'exists:units,id',
            ],

            /*
            |--------------------------------------------------------------------------
            | Pricing
            |--------------------------------------------------------------------------
            */

            'purchase_price' => [
                'required',
                'numeric',
                'min:0',
            ],

            'selling_price' => [
                'required',
                'numeric',
                'min:0',
            ],

            'tax_percentage' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
            ],

            /*
            |--------------------------------------------------------------------------
            | Master Defaults
            |--------------------------------------------------------------------------
            |
            | These values are defaults for the master catalogue.
            |
            | Actual pharmacy stock is stored in pharmacy_medicines and
            | starts at zero when the product is distributed.
            |
            */

            'stock_quantity' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'minimum_stock' => [
                'required',
                'integer',
                'min:0',
            ],

            /*
            |--------------------------------------------------------------------------
            | Batch / Expiry
            |--------------------------------------------------------------------------
            */

            'batch_number' => [
                'nullable',
                'string',
                'max:255',
            ],

            'expiry_date' => [
                'nullable',
                'date',
            ],

            /*
            |--------------------------------------------------------------------------
            | Extra
            |--------------------------------------------------------------------------
            */

            'description' => [
                'nullable',
                'string',
            ],

            'image' => [
                'nullable',
                'string',
                'max:255',
            ],

            'is_active' => [
                'nullable',
                'boolean',
            ],
        ]);
    }
}