<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\GlobalMedicineContribution;
use App\Models\Category;
use App\Models\Manufacturer;
use App\Models\Medicine;
use App\Models\PharmacyMedicine;
use App\Models\Supplier;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class MedicineController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Medicine List
    |--------------------------------------------------------------------------
    |
    | SUPER OWNER:
    | Shows the global/master catalogue.
    |
    | PHARMACY USER:
    | Shows:
    |   1. Global medicines
    |   2. Medicines created by this pharmacy
    |
    | Pharmacy-specific values are taken from pharmacy_medicines when an
    | override exists.
    |
    */

    public function index(Request $request): Response
    {
        $user = auth()->user();
        $search = trim((string) $request->input('search', ''));

        /*
        |--------------------------------------------------------------------------
        | Super Owner
        |--------------------------------------------------------------------------
        */

        if ($user->isSuperOwner()) {

            $medicines = Medicine::query()
                ->whereNull('pharmacy_id')
                ->with([
                    'category',
                    'manufacturer',
                    'supplier',
                    'unit',
                ])
                ->when($search, function ($query) use ($search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('sku', 'like', "%{$search}%")
                            ->orWhere('barcode', 'like', "%{$search}%")
                            ->orWhere('generic_name', 'like', "%{$search}%")
                            ->orWhere('brand_name', 'like', "%{$search}%");
                    });
                })
                ->orderBy('name')
                ->paginate(10)
                ->withQueryString();

            return Inertia::render('Inventory/Medicines/Index', [
                'medicines' => $medicines,

                'filters' => [
                    'search' => $search,
                ],

                'stats' => [
                    'total' => Medicine::whereNull('pharmacy_id')->count(),

                    'active' => Medicine::whereNull('pharmacy_id')
                        ->where('is_active', true)
                        ->count(),

                    'low_stock' => 0,

                    'expiring' => 0,
                ],

                /*
                 * Helpful for the React page later if we want to display
                 * "Global Catalogue" or different actions.
                 */
                'catalogueMode' => 'global',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Pharmacy User
        |--------------------------------------------------------------------------
        */

        $pharmacyId = $user->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        /*
         * We query the master medicines table because every global medicine
         * must automatically be visible to every pharmacy.
         *
         * We also include products created specifically by this pharmacy.
         */
        $query = Medicine::query()
            ->where(function ($q) use ($pharmacyId) {
                $q->whereNull('pharmacy_id')
                    ->orWhere('pharmacy_id', $pharmacyId);
            })
            ->with([
                'category',
                'manufacturer',
                'unit',

                /*
                 * Load ONLY this pharmacy's override.
                 */
                'pharmacyMedicines' => function ($query) use ($pharmacyId) {
                    $query->where('pharmacy_id', $pharmacyId);
                },
            ])
            ->when($search, function ($query) use ($search, $pharmacyId) {
                $query->where(function ($q) use ($search, $pharmacyId) {

                    /*
                     * Search master/global values.
                     */
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('barcode', 'like', "%{$search}%")
                        ->orWhere('generic_name', 'like', "%{$search}%")
                        ->orWhere('brand_name', 'like', "%{$search}%")

                        /*
                         * Also search this pharmacy's overridden values.
                         */
                        ->orWhereHas(
                            'pharmacyMedicines',
                            function ($overrideQuery) use (
                                $search,
                                $pharmacyId
                            ) {
                                $overrideQuery
                                    ->where('pharmacy_id', $pharmacyId)
                                    ->where(function ($local) use ($search) {
                                        $local
                                            ->where(
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
                            }
                        );
                });
            })
            ->orderBy('name');

        $medicines = $query
            ->paginate(10)
            ->withQueryString();

        /*
        |--------------------------------------------------------------------------
        | Transform Medicine For Pharmacy
        |--------------------------------------------------------------------------
        |
        | Existing React pages expect fields such as:
        |
        | medicine.stock_quantity
        | medicine.selling_price
        | medicine.barcode
        |
        | So we merge the pharmacy override into the returned medicine without
        | changing the React page yet.
        |
        */

        $medicines->getCollection()->transform(
            function (Medicine $medicine) {

                $override = $medicine->pharmacyMedicines->first();

                /*
                 * Keep the master values available.
                 */
                $medicine->setAttribute(
                    'is_global',
                    $medicine->pharmacy_id === null
                );

                $medicine->setAttribute(
                    'has_pharmacy_override',
                    $override !== null
                );

                /*
                 * Local text/product information.
                 */
                if ($override) {

                    $medicine->setAttribute(
                        'barcode',
                        $override->barcode ?? $medicine->barcode
                    );

                    $medicine->setAttribute(
                        'gtin',
                        $override->gtin ?? $medicine->gtin
                    );

                    $medicine->setAttribute(
                        'sku',
                        $override->sku ?? $medicine->sku
                    );

                    $medicine->setAttribute(
                        'name',
                        $override->name ?? $medicine->name
                    );

                    $medicine->setAttribute(
                        'generic_name',
                        $override->generic_name
                            ?? $medicine->generic_name
                    );

                    $medicine->setAttribute(
                        'brand_name',
                        $override->brand_name
                            ?? $medicine->brand_name
                    );

                    $medicine->setAttribute(
                        'medicine_type',
                        $override->medicine_type
                            ?? $medicine->medicine_type
                    );

                    /*
                     * Pharmacy-specific pricing.
                     */
                    $medicine->setAttribute(
                        'purchase_price',
                        $override->purchase_price
                            ?? $medicine->purchase_price
                    );

                    $medicine->setAttribute(
                        'selling_price',
                        $override->selling_price
                            ?? $medicine->selling_price
                    );

                    $medicine->setAttribute(
                        'tax_percentage',
                        $override->tax_percentage
                    );

                    /*
                     * Inventory MUST come from pharmacy_medicines.
                     */
                    $medicine->setAttribute(
                        'stock_quantity',
                        $override->stock_quantity
                    );

                    $medicine->setAttribute(
                        'minimum_stock',
                        $override->minimum_stock
                    );

                    $medicine->setAttribute(
                        'batch_number',
                        $override->batch_number
                    );

                    $medicine->setAttribute(
                        'expiry_date',
                        $override->expiry_date
                    );

                    $medicine->setAttribute(
                        'description',
                        $override->description
                            ?? $medicine->description
                    );

                    $medicine->setAttribute(
                        'image',
                        $override->image
                            ?? $medicine->image
                    );

                    $medicine->setAttribute(
                        'is_active',
                        $override->is_active
                    );

                    $medicine->setAttribute(
                        'supplier_id',
                        $override->supplier_id
                    );
                } else {

                    /*
                     * Global product visible to the pharmacy but the pharmacy
                     * has not created inventory/customisation for it yet.
                     *
                     * IMPORTANT:
                     * Master stock must NOT become pharmacy stock.
                     */
                    $medicine->setAttribute(
                        'stock_quantity',
                        0
                    );

                    $medicine->setAttribute(
                        'minimum_stock',
                        10
                    );

                    $medicine->setAttribute(
                        'batch_number',
                        null
                    );

                    $medicine->setAttribute(
                        'expiry_date',
                        null
                    );

                    $medicine->setAttribute(
                        'supplier_id',
                        null
                    );

                    /*
                     * A global product is available/visible by default.
                     */
                    $medicine->setAttribute(
                        'is_active',
                        (bool) $medicine->is_active
                    );
                }

                /*
                 * Don't send the complete override collection to React.
                 */
                $medicine->unsetRelation('pharmacyMedicines');

                return $medicine;
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Statistics
        |--------------------------------------------------------------------------
        */

        $visibleMedicineIds = Medicine::query()
            ->where(function ($query) use ($pharmacyId) {
                $query->whereNull('pharmacy_id')
                    ->orWhere('pharmacy_id', $pharmacyId);
            })
            ->pluck('id');

        $total = $visibleMedicineIds->count();

        /*
         * Global products without an override are considered visible/active.
         * An override can deactivate a product for this pharmacy.
         */
        $inactiveOverrideCount = PharmacyMedicine::where(
            'pharmacy_id',
            $pharmacyId
        )
            ->whereIn('medicine_id', $visibleMedicineIds)
            ->where('is_active', false)
            ->count();

        $active = $total - $inactiveOverrideCount;

        /*
         * Low stock and expiry are pharmacy inventory concepts, therefore
         * calculate them ONLY from pharmacy_medicines.
         */
        $lowStock = PharmacyMedicine::where(
            'pharmacy_id',
            $pharmacyId
        )
            ->where('is_active', true)
            ->whereColumn(
                'stock_quantity',
                '<=',
                'minimum_stock'
            )
            ->count();

        $expiring = PharmacyMedicine::where(
            'pharmacy_id',
            $pharmacyId
        )
            ->where('is_active', true)
            ->whereNotNull('expiry_date')
            ->whereDate(
                'expiry_date',
                '>=',
                today()
            )
            ->whereDate(
                'expiry_date',
                '<=',
                today()->copy()->addDays(30)
            )
            ->count();

        return Inertia::render('Inventory/Medicines/Index', [
            'medicines' => $medicines,

            'filters' => [
                'search' => $search,
            ],

            'stats' => [
                'total' => $total,
                'active' => max(0, $active),
                'low_stock' => $lowStock,
                'expiring' => $expiring,
            ],

            'catalogueMode' => 'pharmacy',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

    public function create(): Response
    {
        $user = auth()->user();

        $data = $this->formData();

        if (! $user->isSuperOwner()) {
            $pharmacyId = $user->pharmacy_id;
            abort_if(! $pharmacyId, 403);

            $data['autoGenerateSku'] = true;
            $data['nextSku'] = $this->generatePharmacySku($pharmacyId);
        } else {
            $data['autoGenerateSku'] = false;
            $data['nextSku'] = null;
        }

        return Inertia::render(
            'Inventory/Medicines/Create',
            $data
        );
    }
        /*
    |--------------------------------------------------------------------------
    | Store
    |--------------------------------------------------------------------------
    |
    | SUPER OWNER:
    | Creates a global/master medicine with pharmacy_id = NULL.
    | It becomes visible automatically to every pharmacy.
    |
    | PHARMACY USER:
    | Creates a medicine owned only by that pharmacy and also creates its
    | pharmacy_medicines inventory record.
    |
    */

    public function store(Request $request): RedirectResponse
    {
        $user = auth()->user();

        /*
        |--------------------------------------------------------------------------
        | Super Owner - Create Global Medicine
        |--------------------------------------------------------------------------
        */

        if ($user->isSuperOwner()) {

            $validated = $this->validateMedicine($request);

            $validated['pharmacy_id'] = null;
            $validated['is_active'] = true;

            $medicine = Medicine::create($validated);

            ActivityLog::record(
                'Medicines',
                'Created',
                $medicine->name,
                'Global medicine added successfully.'
            );

            return redirect()
                ->route('medicines.index')
                ->with(
                    'success',
                    'Global medicine added successfully and is now available to all pharmacies.'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Pharmacy User - Create Local Medicine
        |--------------------------------------------------------------------------
        */

        $pharmacyId = $user->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $autoGenerateSku = $request->boolean(
            'auto_generate_sku',
            true
        );

        /*
         * When automatic SKU generation is enabled, do not validate the
         * preview SKU from the form. Another user may have used that preview
         * before this request reaches the server. The final SKU is generated
         * inside the transaction below.
         */
        if ($autoGenerateSku) {
            $request->merge([
                'sku' => null,
            ]);
        }

        $validated = $this->validateMedicine(
            $request,
            null,
            $pharmacyId
        );

        $medicine = DB::transaction(function () use (
            $validated,
            $pharmacyId,
            $autoGenerateSku
        ) {
            if ($autoGenerateSku) {
                $validated['sku'] = $this->generatePharmacySku(
                    $pharmacyId
                );
            }

            /*
             * Create the product identity.
             *
             * Because pharmacy_id is set, this product belongs only
             * to this pharmacy and is NOT global.
             */
 $medicineData = $validated;

$medicineData['pharmacy_id'] = $pharmacyId;
$medicineData['is_active'] = true;
$medicineData['is_serialized'] =
    (bool) ($validated['is_serialized'] ?? false);

/*
 * Operational stock belongs to pharmacy_medicines.
 */
$medicineData['stock_quantity'] = 0;

$medicine = Medicine::create($medicineData);

            /*
             * Create the pharmacy inventory/customisation record.
             *
             * Stock, price, barcode, expiry etc. are now controlled
             * through pharmacy_medicines.
             */
            PharmacyMedicine::create([
                'pharmacy_id' => $pharmacyId,
                'medicine_id' => $medicine->id,

                'barcode' => $validated['barcode'],
                'gtin' => $validated['gtin'] ?? null,
                'sku' => $validated['sku'],

                'name' => $validated['name'],
                'generic_name' =>
                    $validated['generic_name'] ?? null,
                'brand_name' =>
                    $validated['brand_name'] ?? null,
                'medicine_type' =>
                    $validated['medicine_type'],

                'supplier_id' =>
                    $validated['supplier_id'] ?? null,

                'purchase_price' =>
                    $validated['purchase_price'],

                'selling_price' =>
                    $validated['selling_price'],

                'tax_percentage' =>
                    $validated['tax_percentage'] ?? 0,

                'stock_quantity' =>
                    $validated['stock_quantity'],

                'minimum_stock' =>
                    $validated['minimum_stock'],

                'batch_number' =>
                    $validated['batch_number'] ?? null,

                'expiry_date' =>
                    $validated['expiry_date'] ?? null,

                'description' =>
                    $validated['description'] ?? null,

                'image' =>
                    $validated['image'] ?? null,

                'is_active' => true,
            ]);

            return $medicine;
        });

        ActivityLog::record(
            'Medicines',
            'Created',
            $medicine->name,
            'Pharmacy medicine added successfully.'
        );

        return redirect()
            ->route('medicines.index')
            ->with(
                'success',
                'Medicine added successfully.'
            );
    }

    /**
     * Generate the next pharmacy-specific medicine SKU.
     *
     * Example for pharmacy 6:
     * PH6-MED-000001
     * PH6-MED-000002
     */
    private function generatePharmacySku(int $pharmacyId): string
    {
        $nextNumber = PharmacyMedicine::where(
            'pharmacy_id',
            $pharmacyId
        )->count() + 1;

        do {
            $sku =
                'PH' .
                $pharmacyId .
                '-MED-' .
                str_pad(
                    $nextNumber,
                    6,
                    '0',
                    STR_PAD_LEFT
                );

            $exists = PharmacyMedicine::where(
                'pharmacy_id',
                $pharmacyId
            )
                ->where('sku', $sku)
                ->exists();

            if ($exists) {
                $nextNumber++;
            }
        } while ($exists);

        return $sku;
    }

    /*
    |--------------------------------------------------------------------------
    | Show
    |--------------------------------------------------------------------------
    */

    public function show(Medicine $medicine): Response
    {
        $user = auth()->user();

        /*
        |--------------------------------------------------------------------------
        | Super Owner
        |--------------------------------------------------------------------------
        */

        if ($user->isSuperOwner()) {

            /*
             * Super Owner's normal catalogue screen is for global products.
             */
            abort_if(
                $medicine->pharmacy_id !== null,
                403
            );

            $medicine->load([
                'category',
                'manufacturer',
                'supplier',
                'unit',
            ]);

            $medicine->setAttribute(
                'is_global',
                true
            );

            $medicine->setAttribute(
                'has_pharmacy_override',
                false
            );

            return Inertia::render(
                'Inventory/Medicines/Show',
                [
                    'medicine' => $medicine,
                    'catalogueMode' => 'global',
                ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Pharmacy User
        |--------------------------------------------------------------------------
        */

        $pharmacyId = $user->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        /*
         * Pharmacy can access:
         *
         * 1. Global medicine
         * 2. Medicine created by this pharmacy
         *
         * It cannot access another pharmacy's local medicine.
         */
        abort_if(
            $medicine->pharmacy_id !== null
            && (int) $medicine->pharmacy_id !== (int) $pharmacyId,
            403
        );

        $medicine->load([
            'category',
            'manufacturer',
            'unit',

            'pharmacyMedicines' => function ($query) use (
                $pharmacyId
            ) {
                $query
                    ->where('pharmacy_id', $pharmacyId)
                    ->with('supplier');
            },
        ]);

        $medicine = $this->applyPharmacyOverride(
            $medicine,
            $pharmacyId
        );

        return Inertia::render(
            'Inventory/Medicines/Show',
            [
                'medicine' => $medicine,
                'catalogueMode' => 'pharmacy',
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Edit
    |--------------------------------------------------------------------------
    */

    public function edit(Medicine $medicine): Response
    {
        $user = auth()->user();

        /*
        |--------------------------------------------------------------------------
        | Super Owner
        |--------------------------------------------------------------------------
        */

        if ($user->isSuperOwner()) {

            abort_if(
                $medicine->pharmacy_id !== null,
                403
            );

            $medicine->load([
                'category',
                'manufacturer',
                'supplier',
                'unit',
            ]);

            return Inertia::render(
                'Inventory/Medicines/Edit',
                [
                    'medicine' => $medicine,

                    ...$this->formData(),

                    'catalogueMode' => 'global',
                ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Pharmacy User
        |--------------------------------------------------------------------------
        */

        $pharmacyId = $user->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        abort_if(
            $medicine->pharmacy_id !== null
            && (int) $medicine->pharmacy_id !== (int) $pharmacyId,
            403
        );

        $medicine->load([
            'category',
            'manufacturer',
            'unit',

            'pharmacyMedicines' => function ($query) use (
                $pharmacyId
            ) {
                $query->where(
                    'pharmacy_id',
                    $pharmacyId
                );
            },
        ]);

        /*
         * Merge pharmacy-specific values so your existing Edit.jsx
         * receives the same field names it already expects.
         */
        $medicine = $this->applyPharmacyOverride(
            $medicine,
            $pharmacyId
        );

        return Inertia::render(
            'Inventory/Medicines/Edit',
            [
                'medicine' => $medicine,

                ...$this->formData(),

                'catalogueMode' => 'pharmacy',
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        Medicine $medicine
    ): RedirectResponse {
        $user = auth()->user();

        /*
        |--------------------------------------------------------------------------
        | Super Owner - Update Global Master
        |--------------------------------------------------------------------------
        */

        if ($user->isSuperOwner()) {

            abort_if(
                $medicine->pharmacy_id !== null,
                403
            );

            $validated = $this->validateMedicine(
                $request,
                $medicine
            );

            /*
             * Super Owner edits the master/global medicine.
             *
             * Pharmacy overrides are NOT overwritten.
             *
             * Therefore:
             * - pharmacies without an override see the new master values
             * - pharmacies with an override keep their local values
             */
            $medicine->update($validated);

            ActivityLog::record(
                'Medicines',
                'Updated',
                $medicine->name,
                'Global medicine updated successfully.'
            );

            return redirect()
                ->route('medicines.index')
                ->with(
                    'success',
                    'Global medicine updated successfully.'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Pharmacy User - Update Local Override
        |--------------------------------------------------------------------------
        */

        $pharmacyId = $user->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        abort_if(
            $medicine->pharmacy_id !== null
            && (int) $medicine->pharmacy_id !== (int) $pharmacyId,
            403
        );

        $validated = $this->validateMedicine(
            $request,
            $medicine,
            $pharmacyId
        );

        DB::transaction(function () use (
            $validated,
            $medicine,
            $pharmacyId
        ) {

            /*
             * If this is a global medicine, pharmacy changes to global identity
             * fields become pending contributions for Super Owner review.
             * The local pharmacy value is still saved immediately below.
             */
            if ($medicine->pharmacy_id === null) {
                $existingOverride = PharmacyMedicine::where(
                    'pharmacy_id',
                    $pharmacyId
                )
                    ->where('medicine_id', $medicine->id)
                    ->first();

                $globalFields = [
                    'gtin',
                    'barcode',
                    'name',
                    'generic_name',
                    'brand_name',
                    'medicine_type',
                ];

                $changes = [];

                foreach ($globalFields as $field) {
                    // Compare against the value the pharmacist currently has locally.
                    // This prevents an untouched existing local override from creating
                    // a new approval request on every Save.
                    $currentLocalValue = $existingOverride?->{$field} ?? $medicine->{$field};
                    $newValue = array_key_exists($field, $validated)
                        ? $validated[$field]
                        : $currentLocalValue;

                    if ((string) ($currentLocalValue ?? '') === (string) ($newValue ?? '')) {
                        continue;
                    }

                    // Store the GLOBAL old value for the Super Owner review.
                    $globalOldValue = $medicine->{$field};

                    $changes[$field] = [
                        'old' => $globalOldValue,
                        'new' => $newValue,
                    ];
                }

                if (!empty($changes)) {
                    // Keep one pending request per pharmacy + medicine.
                    // If one already exists, replace its proposed changes with
                    // the latest complete submission instead of creating rows
                    // for every field.
                    $pendingContribution = GlobalMedicineContribution::query()
                        ->where('pharmacy_id', $pharmacyId)
                        ->where('medicine_id', $medicine->id)
                        ->where('contribution_type', 'correction')
                        ->where('status', 'pending')
                        ->latest('id')
                        ->first();

                    $payload = [
                        'request_type' => 'medicine_correction',
                        'changes' => $changes,
                    ];

                    $contributionData = [
                        'pharmacy_id' => $pharmacyId,
                        'medicine_id' => $medicine->id,
                        'user_id' => auth()->id(),
                        'source' => 'manual',
                        'contribution_type' => 'correction',
                        'field_name' => null,
                        'old_value' => null,
                        'proposed_value' => null,
                        'payload' => $payload,
                        'raw_gs1_data' => null,
                        'gtin' => array_key_exists('gtin', $changes)
                            ? $changes['gtin']['new']
                            : ($validated['gtin'] ?? $medicine->gtin),
                        'barcode' => array_key_exists('barcode', $changes)
                            ? $changes['barcode']['new']
                            : ($validated['barcode'] ?? $medicine->barcode),
                        'confidence_score' => 0,
                        'status' => 'pending',
                    ];

                    if ($pendingContribution) {
                        $pendingContribution->update($contributionData);
                    } else {
                        GlobalMedicineContribution::create($contributionData);
                    }
                }
            }

            /*
             * Create or update this pharmacy's record.
             *
             * For a global medicine this leaves the master medicine untouched.
             *
             * For a pharmacy-created medicine, pharmacy_medicines remains the
             * operational inventory/customisation source.
             */
            PharmacyMedicine::updateOrCreate(
                [
                    'pharmacy_id' => $pharmacyId,
                    'medicine_id' => $medicine->id,
                ],
                [
                    'barcode' =>
                        $validated['barcode'],

                    'gtin' =>
                        $validated['gtin'] ?? null,

                    'sku' =>
                        $validated['sku'],

                    'name' =>
                        $validated['name'],

                    'generic_name' =>
                        $validated['generic_name'] ?? null,

                    'brand_name' =>
                        $validated['brand_name'] ?? null,

                    'medicine_type' =>
                        $validated['medicine_type'],

                    'supplier_id' =>
                        $validated['supplier_id'] ?? null,

                    'purchase_price' =>
                        $validated['purchase_price'],

                    'selling_price' =>
                        $validated['selling_price'],

                    'tax_percentage' =>
                        $validated['tax_percentage'] ?? 0,

                    'stock_quantity' =>
                        $validated['stock_quantity'],

                    'minimum_stock' =>
                        $validated['minimum_stock'],

                    'batch_number' =>
                        $validated['batch_number'] ?? null,

                    'expiry_date' =>
                        $validated['expiry_date'] ?? null,

                    'description' =>
                        $validated['description'] ?? null,

                    'image' =>
                        $validated['image'] ?? null,

                    'is_active' =>
                        array_key_exists(
                            'is_active',
                            $validated
                        )
                            ? (bool) $validated['is_active']
                            : true,
                ]
            );

            /*
             * If this product was originally created by THIS pharmacy,
             * keep its descriptive master record in sync too.
             *
             * We intentionally do NOT use pharmacy inventory fields
             * such as stock as the operational source.
             */
           if (
    (int) $medicine->pharmacy_id
    === (int) $pharmacyId
) {
    $medicine->update([
        'barcode' =>
            $validated['barcode'],

        'gtin' =>
            $validated['gtin'] ?? null,

        'sku' =>
            $validated['sku'],

        'name' =>
            $validated['name'],

        'generic_name' =>
            $validated['generic_name'] ?? null,

        'brand_name' =>
            $validated['brand_name'] ?? null,

        'medicine_type' =>
            $validated['medicine_type'],

        'category_id' =>
            $validated['category_id'],

        'manufacturer_id' =>
            $validated['manufacturer_id'],

        'supplier_id' =>
            $validated['supplier_id'],

        'unit_id' =>
            $validated['unit_id'],

        /*
         * Pharmacy-specific price, stock, minimum stock,
         * batch and expiry are intentionally NOT written
         * to the Medicine master record.
         *
         * They are already stored in pharmacy_medicines
         * by PharmacyMedicine::updateOrCreate() above.
         */

        'description' =>
            $validated['description'] ?? null,

        'is_active' =>
            array_key_exists(
                'is_active',
                $validated
            )
                ? (bool) $validated['is_active']
                : true,
                'is_serialized' =>
    (bool) ($validated['is_serialized'] ?? false),
    ]);
}
        });

        ActivityLog::record(
            'Medicines',
            'Updated',
            $validated['name'],
            $medicine->pharmacy_id === null
                ? 'Pharmacy medicine override updated successfully.'
                : 'Pharmacy medicine updated successfully.'
        );

        return redirect()
            ->route('medicines.index')
            ->with(
                'success',
                'Medicine updated successfully.'
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Destroy
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Medicine $medicine
    ): RedirectResponse {
        $user = auth()->user();

        /*
        |--------------------------------------------------------------------------
        | Super Owner
        |--------------------------------------------------------------------------
        */

        if ($user->isSuperOwner()) {

            abort_if(
                $medicine->pharmacy_id !== null,
                403
            );

            $name = $medicine->name;

            /*
             * NOTE:
             * Your pharmacy_medicines.medicine_id uses cascadeOnDelete().
             *
             * Therefore deleting a global medicine here also deletes all
             * pharmacy override rows for that medicine.
             *
             * This is intentional only if Super Owner truly wants to remove
             * the product platform-wide.
             */
            $medicine->delete();

            ActivityLog::record(
                'Medicines',
                'Deleted',
                $name,
                'Global medicine deleted from the platform.'
            );

            return redirect()
                ->route('medicines.index')
                ->with(
                    'success',
                    'Global medicine deleted successfully.'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Pharmacy User
        |--------------------------------------------------------------------------
        */

        $pharmacyId = $user->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        abort_if(
            $medicine->pharmacy_id !== null
            && (int) $medicine->pharmacy_id !== (int) $pharmacyId,
            403
        );

        $name = $medicine->name;

        /*
        |--------------------------------------------------------------------------
        | Global Medicine
        |--------------------------------------------------------------------------
        |
        | A pharmacy must NEVER delete the global master medicine.
        |
        | Instead create/update its pharmacy override and mark it inactive.
        |
        */

        if ($medicine->pharmacy_id === null) {

            $override = PharmacyMedicine::firstOrNew([
                'pharmacy_id' => $pharmacyId,
                'medicine_id' => $medicine->id,
            ]);

            /*
             * If this is the first local record, copy useful values from the
             * master before hiding it.
             */
            if (! $override->exists) {
                $override->barcode =
                    $medicine->barcode;

                $override->sku =
                    $medicine->sku;

                $override->name =
                    $medicine->name;

                $override->generic_name =
                    $medicine->generic_name;

                $override->brand_name =
                    $medicine->brand_name;

                $override->medicine_type =
                    $medicine->medicine_type;

                $override->purchase_price =
                    $medicine->purchase_price;

                $override->selling_price =
                    $medicine->selling_price;

                $override->tax_percentage =
                    $medicine->tax_percentage ?? 0;

                /*
                 * New pharmacy inventory starts at zero.
                 */
                $override->stock_quantity = 0;

                $override->minimum_stock =
                    $medicine->minimum_stock ?? 10;

                $override->description =
                    $medicine->description;

                $override->image =
                    $medicine->image;
            }

            $override->is_active = false;

            $override->save();

            ActivityLog::record(
                'Medicines',
                'Hidden',
                $name,
                'Global medicine hidden from this pharmacy.'
            );

            return redirect()
                ->route('medicines.index')
                ->with(
                    'success',
                    'Medicine removed from this pharmacy.'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Pharmacy-created Medicine
        |--------------------------------------------------------------------------
        |
        | Since this product belongs only to this pharmacy, it can be deleted.
        | pharmacy_medicines will also be removed through cascadeOnDelete().
        |
        */

        $medicine->delete();

        ActivityLog::record(
            'Medicines',
            'Deleted',
            $name,
            'Pharmacy medicine deleted successfully.'
        );

        return redirect()
            ->route('medicines.index')
            ->with(
                'success',
                'Medicine deleted successfully.'
            );
    }
        /*
    |--------------------------------------------------------------------------
    | Form Data
    |--------------------------------------------------------------------------
    */

    private function formData(): array
    {
        $user = auth()->user();

        /*
         * Categories, manufacturers and units are currently shared/master
         * records in your existing structure.
         */
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get();

        $manufacturers = Manufacturer::where('is_active', true)
            ->orderBy('name')
            ->get();

        $units = Unit::where('is_active', true)
            ->orderBy('name')
            ->get();

        /*
         * Suppliers belong to pharmacies.
         *
         * Super Owner may currently need the global suppliers if you have
         * records where pharmacy_id is NULL.
         *
         * Normal pharmacy users MUST see only their own suppliers.
         */
        if ($user->isSuperOwner()) {
            $suppliers = Supplier::whereNull('pharmacy_id')
                ->where('is_active', true)
                ->orderBy('name')
                ->get();
        } else {
            $pharmacyId = $user->pharmacy_id;

            abort_if(! $pharmacyId, 403);

            $suppliers = Supplier::where(
                'pharmacy_id',
                $pharmacyId
            )
                ->where('is_active', true)
                ->orderBy('name')
                ->get();
        }

        return [
            'categories' => $categories,
            'manufacturers' => $manufacturers,
            'suppliers' => $suppliers,
            'units' => $units,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Medicine
    |--------------------------------------------------------------------------
    |
    | SUPER OWNER:
    | Barcode and SKU must be unique in the global medicines table.
    |
    | PHARMACY:
    | Barcode and SKU must be unique only inside that pharmacy's
    | pharmacy_medicines records.
    |
    */

    private function validateMedicine(
        Request $request,
        ?Medicine $medicine = null,
        ?int $pharmacyId = null
    ): array {
        $user = auth()->user();

        /*
        |--------------------------------------------------------------------------
        | Super Owner Validation
        |--------------------------------------------------------------------------
        */

        if ($user->isSuperOwner()) {

            $medicineId = $medicine?->id;

            return $request->validate([
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

                'barcode' => [
                    'required',
                    'string',
                    'max:255',

                    Rule::unique(
                        'medicines',
                        'barcode'
                    )->ignore($medicineId),
                ],

                'gtin' => [
                    'nullable',
                    'string',
                    'digits_between:8,14',
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

                'category_id' => [
                    'required',
                    'exists:categories,id',
                ],

                'manufacturer_id' => [
                    'required',
                    'exists:manufacturers,id',
                ],

              /*
 * Supplier is pharmacy-specific and optional.
 * A pharmacy can select its own supplier later.
 */
'supplier_id' => [
    'nullable',
    'exists:suppliers,id',
],

                'unit_id' => [
                    'required',
                    'exists:units,id',
                ],

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

                'stock_quantity' => [
                    'required',
                    'integer',
                    'min:0',
                ],

                'minimum_stock' => [
                    'required',
                    'integer',
                    'min:0',
                ],

                'batch_number' => [
                    'nullable',
                    'string',
                    'max:255',
                ],

                'expiry_date' => [
                    'nullable',
                    'date',
                ],

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
                'is_serialized' => [
    'nullable',
    'boolean',
],
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Validation
        |--------------------------------------------------------------------------
        */

        abort_if(! $pharmacyId, 403);

        /*
         * When editing, find this pharmacy's existing override so Laravel
         * ignores that exact row during barcode/SKU uniqueness validation.
         */
        $override = null;

        if ($medicine) {
            $override = PharmacyMedicine::where(
                'pharmacy_id',
                $pharmacyId
            )
                ->where(
                    'medicine_id',
                    $medicine->id
                )
                ->first();
        }

        $overrideId = $override?->id;

        return $request->validate([
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
             * Unique only inside THIS pharmacy.
             */
            'barcode' => [
                'required',
                'string',
                'max:255',

                Rule::unique(
                    'pharmacy_medicines',
                    'barcode'
                )
                    ->where(
                        fn ($query) =>
                        $query->where(
                            'pharmacy_id',
                            $pharmacyId
                        )
                    )
                    ->ignore($overrideId),
            ],

            'gtin' => [
                'nullable',
                'string',
                'digits_between:8,14',
            ],

            'sku' => [
                'required_unless:auto_generate_sku,true',
                'nullable',
                'string',
                'max:255',

                Rule::unique(
                    'pharmacy_medicines',
                    'sku'
                )
                    ->where(
                        fn ($query) =>
                        $query->where(
                            'pharmacy_id',
                            $pharmacyId
                        )
                    )
                    ->ignore($overrideId),
            ],

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

            'category_id' => [
                'required',
                'exists:categories,id',
            ],

            'manufacturer_id' => [
                'required',
                'exists:manufacturers,id',
            ],

           /*
 * Supplier is optional, but if selected it must belong
 * to the logged-in pharmacy.
 */
'supplier_id' => [
    'nullable',
                Rule::exists(
                    'suppliers',
                    'id'
                )->where(
                    fn ($query) =>
                    $query->where(
                        'pharmacy_id',
                        $pharmacyId
                    )
                ),
            ],

            'unit_id' => [
                'required',
                'exists:units,id',
            ],

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

            'stock_quantity' => [
                'required',
                'integer',
                'min:0',
            ],

            'minimum_stock' => [
                'required',
                'integer',
                'min:0',
            ],

            'batch_number' => [
                'nullable',
                'string',
                'max:255',
            ],

            'expiry_date' => [
                'nullable',
                'date',
            ],

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
            'is_serialized' => [
    'nullable',
    'boolean',
],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Apply Pharmacy Override
    |--------------------------------------------------------------------------
    |
    | Converts:
    |
    | Medicine + PharmacyMedicine
    |
    | into the same structure your existing React pages expect.
    |
    */

    private function applyPharmacyOverride(
        Medicine $medicine,
        int $pharmacyId
    ): Medicine {
        /*
         * Use already loaded relationship if available.
         */
        if ($medicine->relationLoaded('pharmacyMedicines')) {
            $override = $medicine
                ->pharmacyMedicines
                ->first();
        } else {
            $override = PharmacyMedicine::where(
                'pharmacy_id',
                $pharmacyId
            )
                ->where(
                    'medicine_id',
                    $medicine->id
                )
                ->first();
        }

        $medicine->setAttribute(
            'is_global',
            $medicine->pharmacy_id === null
        );

        $medicine->setAttribute(
            'has_pharmacy_override',
            $override !== null
        );

        /*
        |--------------------------------------------------------------------------
        | No Override Yet
        |--------------------------------------------------------------------------
        */

        if (! $override) {

            /*
             * Global catalogue information remains available.
             *
             * But inventory information starts independently for
             * each pharmacy.
             */
            if ($medicine->pharmacy_id === null) {

                $medicine->setAttribute(
                    'stock_quantity',
                    0
                );

                $medicine->setAttribute(
                    'minimum_stock',
                    10
                );

                $medicine->setAttribute(
                    'batch_number',
                    null
                );

                $medicine->setAttribute(
                    'expiry_date',
                    null
                );

                $medicine->setAttribute(
                    'supplier_id',
                    null
                );
            }

            $medicine->unsetRelation(
                'pharmacyMedicines'
            );

            return $medicine;
        }

        /*
        |--------------------------------------------------------------------------
        | Product Information
        |--------------------------------------------------------------------------
        */

        $medicine->setAttribute(
            'barcode',
            $override->barcode
                ?? $medicine->barcode
        );

        $medicine->setAttribute(
            'gtin',
            $override->gtin
                ?? $medicine->gtin
        );

        $medicine->setAttribute(
            'sku',
            $override->sku
                ?? $medicine->sku
        );

        $medicine->setAttribute(
            'name',
            $override->name
                ?? $medicine->name
        );

        $medicine->setAttribute(
            'generic_name',
            $override->generic_name
                ?? $medicine->generic_name
        );

        $medicine->setAttribute(
            'brand_name',
            $override->brand_name
                ?? $medicine->brand_name
        );

        $medicine->setAttribute(
            'medicine_type',
            $override->medicine_type
                ?? $medicine->medicine_type
        );

        /*
        |--------------------------------------------------------------------------
        | Pricing
        |--------------------------------------------------------------------------
        */

        $medicine->setAttribute(
            'purchase_price',
            $override->purchase_price
                ?? $medicine->purchase_price
        );

        $medicine->setAttribute(
            'selling_price',
            $override->selling_price
                ?? $medicine->selling_price
        );

        $medicine->setAttribute(
            'tax_percentage',
            $override->tax_percentage
        );

        /*
        |--------------------------------------------------------------------------
        | Inventory
        |--------------------------------------------------------------------------
        */

        $medicine->setAttribute(
            'stock_quantity',
            $override->stock_quantity
        );

        $medicine->setAttribute(
            'minimum_stock',
            $override->minimum_stock
        );

        $medicine->setAttribute(
            'batch_number',
            $override->batch_number
        );

        $medicine->setAttribute(
            'expiry_date',
            $override->expiry_date
        );

        /*
        |--------------------------------------------------------------------------
        | Other Local Values
        |--------------------------------------------------------------------------
        */

        $medicine->setAttribute(
            'supplier_id',
            $override->supplier_id
        );

        $medicine->setAttribute(
            'description',
            $override->description
                ?? $medicine->description
        );

        $medicine->setAttribute(
            'image',
            $override->image
                ?? $medicine->image
        );

        $medicine->setAttribute(
            'is_active',
            (bool) $override->is_active
        );

        /*
         * If supplier was loaded through PharmacyMedicine,
         * expose it as medicine.supplier so existing JSX continues
         * to work.
         */
        if ($override->relationLoaded('supplier')) {
            $medicine->setRelation(
                'supplier',
                $override->supplier
            );
        }

        $medicine->unsetRelation(
            'pharmacyMedicines'
        );

        return $medicine;
    }

    /*
    |--------------------------------------------------------------------------
    | Expiry Management
    |--------------------------------------------------------------------------
    */

    public function expiryManagement(
        Request $request
    ): Response {
        $user = auth()->user();

        $filter = $request->get('filter');

        /*
        |--------------------------------------------------------------------------
        | Super Owner
        |--------------------------------------------------------------------------
        |
        | Super Owner does not own pharmacy inventory.
        |
        | We keep the page available, but the global catalogue should not be
        | treated as the stock/expiry inventory of every pharmacy.
        |
        */

        if ($user->isSuperOwner()) {

            return Inertia::render(
                'Inventory/Medicines/ExpiryManagement',
                [
                    'filter' => $filter,

                    'stats' => [
                        'expired' => 0,
                        'thirtyDays' => 0,
                        'ninetyDays' => 0,
                        'sixMonths' => 0,
                        'noExpiry' => 0,
                    ],

                    'expiredMedicines' => [],
                    'nearExpiryMedicines' => [],
                    'filteredMedicines' => [],

                    'catalogueMode' => 'global',
                ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Inventory
        |--------------------------------------------------------------------------
        */

        $pharmacyId = $user->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        /*
         * Base query for THIS pharmacy's inventory records.
         *
         * medicine gives us category/unit/master information.
         */
        $baseQuery = PharmacyMedicine::query()
            ->where(
                'pharmacy_id',
                $pharmacyId
            )
            ->where(
                'is_active',
                true
            )
            ->with([
                'medicine.category',
                'medicine.unit',
                'supplier',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Expired
        |--------------------------------------------------------------------------
        */

        $expiredRecords = (clone $baseQuery)
            ->whereNotNull('expiry_date')
            ->whereDate(
                'expiry_date',
                '<',
                today()
            )
            ->orderBy('expiry_date')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Within 30 Days
        |--------------------------------------------------------------------------
        */

        $thirtyDayRecords = (clone $baseQuery)
            ->whereNotNull('expiry_date')
            ->whereBetween(
                'expiry_date',
                [
                    today(),
                    today()->copy()->addDays(30),
                ]
            )
            ->orderBy('expiry_date')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | 31 - 90 Days
        |--------------------------------------------------------------------------
        */

        $ninetyDayRecords = (clone $baseQuery)
            ->whereNotNull('expiry_date')
            ->whereBetween(
                'expiry_date',
                [
                    today()->copy()->addDays(31),
                    today()->copy()->addDays(90),
                ]
            )
            ->orderBy('expiry_date')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | 91 Days - 6 Months
        |--------------------------------------------------------------------------
        */

        $sixMonthRecords = (clone $baseQuery)
            ->whereNotNull('expiry_date')
            ->whereBetween(
                'expiry_date',
                [
                    today()->copy()->addDays(91),
                    today()->copy()->addMonths(6),
                ]
            )
            ->orderBy('expiry_date')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | No Expiry
        |--------------------------------------------------------------------------
        */

        $noExpiryRecords = (clone $baseQuery)
            ->whereNull('expiry_date')
            ->get()
            ->sortBy(function ($record) {
                return strtolower(
                    $record->name
                    ?? $record->medicine?->name
                    ?? ''
                );
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Convert PharmacyMedicine -> Medicine Shape
        |--------------------------------------------------------------------------
        |
        | This keeps your current ExpiryManagement.jsx compatible.
        |
        */

        $expiredMedicines =
            $this->convertPharmacyMedicineCollection(
                $expiredRecords
            );

        $thirtyDaysMedicines =
            $this->convertPharmacyMedicineCollection(
                $thirtyDayRecords
            );

        $ninetyDaysMedicines =
            $this->convertPharmacyMedicineCollection(
                $ninetyDayRecords
            );

        $sixMonthsMedicines =
            $this->convertPharmacyMedicineCollection(
                $sixMonthRecords
            );

        $noExpiryMedicines =
            $this->convertPharmacyMedicineCollection(
                $noExpiryRecords
            );

        /*
        |--------------------------------------------------------------------------
        | Selected Filter
        |--------------------------------------------------------------------------
        */

        $displayMedicines = match ($filter) {
            'expired' =>
                $expiredMedicines,

            '30' =>
                $thirtyDaysMedicines,

            '90' =>
                $ninetyDaysMedicines,

            '180' =>
                $sixMonthsMedicines,

            'no-expiry' =>
                $noExpiryMedicines,

            default =>
                collect(),
        };

        return Inertia::render(
            'Inventory/Medicines/ExpiryManagement',
            [
                'filter' => $filter,

                'stats' => [
                    'expired' =>
                        $expiredMedicines->count(),

                    'thirtyDays' =>
                        $thirtyDaysMedicines->count(),

                    'ninetyDays' =>
                        $ninetyDaysMedicines->count(),

                    'sixMonths' =>
                        $sixMonthsMedicines->count(),

                    'noExpiry' =>
                        $noExpiryMedicines->count(),
                ],

                'expiredMedicines' =>
                    $expiredMedicines,

                'nearExpiryMedicines' =>
                    $thirtyDaysMedicines,

                'filteredMedicines' =>
                    $displayMedicines,

                'catalogueMode' =>
                    'pharmacy',
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Convert Pharmacy Medicine Collection
    |--------------------------------------------------------------------------
    */

    private function convertPharmacyMedicineCollection(
        $records
    ) {
        return $records
            ->map(function (
                PharmacyMedicine $record
            ) {

                $medicine = $record->medicine;

                if (! $medicine) {
                    return null;
                }

                /*
                 * Product identity
                 */
                $medicine->setAttribute(
                    'is_global',
                    $medicine->pharmacy_id === null
                );

                $medicine->setAttribute(
                    'has_pharmacy_override',
                    true
                );

                /*
                 * Pharmacy-specific product values
                 */
                $medicine->setAttribute(
                    'barcode',
                    $record->barcode
                        ?? $medicine->barcode
                );

                $medicine->setAttribute(
                    'gtin',
                    $record->gtin
                        ?? $medicine->gtin
                );

                $medicine->setAttribute(
                    'sku',
                    $record->sku
                        ?? $medicine->sku
                );

                $medicine->setAttribute(
                    'name',
                    $record->name
                        ?? $medicine->name
                );

                $medicine->setAttribute(
                    'generic_name',
                    $record->generic_name
                        ?? $medicine->generic_name
                );

                $medicine->setAttribute(
                    'brand_name',
                    $record->brand_name
                        ?? $medicine->brand_name
                );

                $medicine->setAttribute(
                    'medicine_type',
                    $record->medicine_type
                        ?? $medicine->medicine_type
                );

                /*
                 * Inventory
                 */
                $medicine->setAttribute(
                    'stock_quantity',
                    $record->stock_quantity
                );

                $medicine->setAttribute(
                    'minimum_stock',
                    $record->minimum_stock
                );

                $medicine->setAttribute(
                    'batch_number',
                    $record->batch_number
                );

                $medicine->setAttribute(
                    'expiry_date',
                    $record->expiry_date
                );

                /*
                 * Pricing
                 */
                $medicine->setAttribute(
                    'purchase_price',
                    $record->purchase_price
                        ?? $medicine->purchase_price
                );

                $medicine->setAttribute(
                    'selling_price',
                    $record->selling_price
                        ?? $medicine->selling_price
                );

                $medicine->setAttribute(
                    'tax_percentage',
                    $record->tax_percentage
                );

                /*
                 * Local fields
                 */
                $medicine->setAttribute(
                    'supplier_id',
                    $record->supplier_id
                );

                $medicine->setAttribute(
                    'description',
                    $record->description
                        ?? $medicine->description
                );

                $medicine->setAttribute(
                    'image',
                    $record->image
                        ?? $medicine->image
                );

                $medicine->setAttribute(
                    'is_active',
                    (bool) $record->is_active
                );

                /*
                 * Keep category/unit from master medicine.
                 */
                if (
                    $medicine->relationLoaded('category')
                ) {
                    $medicine->setRelation(
                        'category',
                        $medicine->category
                    );
                }

                if (
                    $medicine->relationLoaded('unit')
                ) {
                    $medicine->setRelation(
                        'unit',
                        $medicine->unit
                    );
                }

                /*
                 * Supplier is pharmacy-specific.
                 */
                if ($record->relationLoaded('supplier')) {
                    $medicine->setRelation(
                        'supplier',
                        $record->supplier
                    );
                }

                return $medicine;
            })
            ->filter()
            ->values();
    }
    public function scan()
{
    return inertia(
        'Inventory/Medicines/Scan'
    );
}


public function searchBarcode(Request $request)
{
    $barcode = trim($request->barcode);

    $medicine = Medicine::with('category')
        ->where('barcode', $barcode)
        ->first();

    if ($medicine) {
        return response()->json([
            'found' => true,
            'source' => 'local',
            'medicine' => $medicine,
        ]);
    }

    $global = app(\App\Services\GlobalMedicineService::class)
        ->search($barcode);

    if ($global['found']) {
        return response()->json([
            'found' => true,
            'source' => 'global',
            'medicine' => $global['medicine'],
        ]);
    }

    return response()->json([
        'found' => false,
    ]);
}
public function searchExisting(Request $request)
{
    $search = $request->search;

    $medicines = Medicine::where('name', 'like', "%{$search}%")
        ->orWhere('generic_name', 'like', "%{$search}%")
        ->limit(20)
        ->get(['id', 'name', 'barcode']);

    return response()->json($medicines);
}

public function linkBarcode(Request $request)
{
    $request->validate([
        'medicine_id' => 'required|exists:medicines,id',
        'barcode' => 'required',
    ]);

    $medicine = Medicine::findOrFail($request->medicine_id);

    $medicine->barcode = $request->barcode;
    $medicine->save();

    return response()->json([
        'success' => true,
        'message' => 'Barcode linked successfully.',
    ]);
}
}