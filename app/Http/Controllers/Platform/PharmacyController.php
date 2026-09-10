<?php

namespace App\Http\Controllers\Platform;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Platform\StorePharmacyRequest;
use App\Http\Requests\Platform\UpdatePharmacyRequest;
use App\Models\Medicine;
use App\Models\Pharmacy;
use App\Models\PharmacyMedicine;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PharmacyController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Pharmacy List
    |--------------------------------------------------------------------------
    */

    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        $pharmacies = Pharmacy::query()
            ->withCount('users')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('owner_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%")
                        ->orWhere('country', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Platform/Pharmacies/Index', [
            'pharmacies' => $pharmacies,

            'filters' => [
                'search' => $search,
            ],

            'stats' => [
                'total' => Pharmacy::count(),

                'active' => Pharmacy::where(
                    'status',
                    true
                )->count(),

                'suspended' => Pharmacy::where(
                    'status',
                    false
                )->count(),

                'subscription_active' => Pharmacy::where(
                    'subscription_status',
                    'active'
                )->count(),

                'subscription_expired' => Pharmacy::where(
                    'subscription_status',
                    'expired'
                )->count(),
            ],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Create Form
    |--------------------------------------------------------------------------
    */

    public function create(): Response
    {
        return Inertia::render(
            'Platform/Pharmacies/Create'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Store Pharmacy
    |--------------------------------------------------------------------------
    */

    public function store(
        StorePharmacyRequest $request
    ): RedirectResponse {
        $validated = $request->validated();

        /*
         * Store the uploaded file before the transaction.
         *
         * If the database transaction fails, we remove the
         * uploaded file in the catch block.
         */
        $logoPath = null;

        if ($request->hasFile('logo')) {
            $logoPath = $request
                ->file('logo')
                ->store(
                    'pharmacies/logos',
                    'public'
                );
        }

        try {
            $pharmacy = DB::transaction(
                function () use (
                    $validated,
                    $logoPath
                ) {
                    /*
                    |--------------------------------------------------------------------------
                    | Create Pharmacy
                    |--------------------------------------------------------------------------
                    */

                    $pharmacy = Pharmacy::create([
                        'name' =>
                            $validated['name'],

                        'owner_name' =>
                            $validated['owner_name'],

                        'email' =>
                            $validated['email'],

                        'phone' =>
                            $validated['phone'] ?? null,

                        'address' =>
                            $validated['address'] ?? null,

                        'city' =>
                            $validated['city'] ?? null,

                        'country' =>
                            $validated['country']
                            ?? 'Saudi Arabia',

                        'logo' =>
                            $logoPath,

                        'notes' =>
                            $validated['notes'] ?? null,

                        'status' =>
                            $validated['status'] === 'active',

                        /*
                        |--------------------------------------------------------------------------
                        | Subscription
                        |--------------------------------------------------------------------------
                        */

                        'subscription_plan' =>
                            $validated['subscription_plan'],

                        'subscription_status' =>
                            $validated['subscription_status'],

                        'subscription_expires_at' =>
                            $validated['subscription_expires_at']
                            ?? null,
                    ]);

                    /*
                    |--------------------------------------------------------------------------
                    | Create Owner
                    |--------------------------------------------------------------------------
                    */

                    $owner = User::create([
                        'pharmacy_id' =>
                            $pharmacy->id,

                        'name' =>
                            $validated['owner_name'],

                        'email' =>
                            $validated['email'],

                        'password' =>
                            $validated['password'],

                        'role' =>
                            UserRole::Owner,
                    ]);

                    $pharmacy->update([
                        'owner_id' => $owner->id,
                    ]);

                    /*
                    |--------------------------------------------------------------------------
                    | Create Pharmacy-Specific Settings
                    |--------------------------------------------------------------------------
                    |
                    | This is the important branding connection.
                    |
                    | When the pharmacy is created, its business information
                    | becomes its initial printing configuration.
                    |
                    | The pharmacy can later customise these settings.
                    |
                    */

                    Setting::updateOrCreate(
                        [
                            'pharmacy_id' => $pharmacy->id,
                        ],
                        [
                            'pharmacy_name' =>
                                $pharmacy->name,

                            'owner_name' =>
                                $pharmacy->owner_name,

                            'phone' =>
                                $pharmacy->phone,

                            'email' =>
                                $pharmacy->email,

                            'address' =>
                                $pharmacy->address,

                            'city' =>
                                $pharmacy->city
                                ?: 'Riyadh',

                            'country' =>
                                $pharmacy->country
                                ?: 'Saudi Arabia',

                            'logo' =>
                                $pharmacy->logo,

                            'pharmacy_name_ar' =>
                                'صيدلية فارمكسا',

                            'tax_percentage' => 15,

                            'currency' => 'SAR',

                            'currency_symbol' => 'SAR',

                            'timezone' =>
                                'Asia/Riyadh',

                            'language' => 'en',

                            'receipt_size' => '80',

                            'auto_print_receipt' => true,

                            'auto_print_sticker' => false,

                            'show_logo' => true,

                            'show_barcode' => true,

                            'show_qr' => true,

                            'show_pharmacist' => true,

                            'show_patient_name' => true,

                            'show_expiry_date' => true,

                            'show_sticker_logo' => false,
                        ]
                    );

                    /*
                    |--------------------------------------------------------------------------
                    | Initialise Global Medicine Catalogue
                    |--------------------------------------------------------------------------
                    */

                    $this->syncGlobalCatalogue(
                        $pharmacy
                    );

                    return $pharmacy;
                }
            );
        } catch (\Throwable $e) {
            /*
             * Database rollback cannot roll back filesystem changes.
             */
            if ($logoPath) {
                Storage::disk('public')
                    ->delete($logoPath);
            }

            throw $e;
        }

        return redirect()
            ->route(
                'platform.pharmacies.show',
                $pharmacy
            )
            ->with(
                'success',
                "Pharmacy \"{$pharmacy->name}\" has been created successfully."
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Show Pharmacy
    |--------------------------------------------------------------------------
    */

    public function show(
        Pharmacy $pharmacy
    ): Response {
        $pharmacy->load([
            'owner',

            'users' => fn ($query) =>
                $query->orderBy('name'),
        ]);

        $setting = Setting::where(
            'pharmacy_id',
            $pharmacy->id
        )->first();

        return Inertia::render(
            'Platform/Pharmacies/Show',
            [
                'pharmacy' => $pharmacy,

                'setting' => $setting,
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Edit Pharmacy
    |--------------------------------------------------------------------------
    */

    public function edit(
        Pharmacy $pharmacy
    ): Response {
        return Inertia::render(
            'Platform/Pharmacies/Edit',
            [
                'pharmacy' => $pharmacy,

                'setting' => Setting::where(
                    'pharmacy_id',
                    $pharmacy->id
                )->first(),
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Update Pharmacy
    |--------------------------------------------------------------------------
    */

    public function update(
        UpdatePharmacyRequest $request,
        Pharmacy $pharmacy
    ): RedirectResponse {
        $validated = $request->validated();

        /*
         * Keep the old logo path until the DB update succeeds.
         */
        $oldLogo = $pharmacy->logo;

        $newLogoPath = null;

        if ($request->hasFile('logo')) {
            $newLogoPath = $request
                ->file('logo')
                ->store(
                    'pharmacies/logos',
                    'public'
                );
        }

        try {
            DB::transaction(
                function () use (
                    $request,
                    $validated,
                    $pharmacy,
                    $newLogoPath
                ) {
                    /*
                    |--------------------------------------------------------------------------
                    | Determine Logo
                    |--------------------------------------------------------------------------
                    */

                    $logoPath = $pharmacy->logo;

                    if ($request->boolean('remove_logo')) {
                        $logoPath = null;
                    }

                    if ($newLogoPath) {
                        $logoPath = $newLogoPath;
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Update Pharmacy
                    |--------------------------------------------------------------------------
                    */

                    $pharmacy->update([
                        'name' =>
                            $validated['name'],

                        'owner_name' =>
                            $validated['owner_name'],

                        'email' =>
                            $validated['email'],

                        'phone' =>
                            $validated['phone'] ?? null,

                        'address' =>
                            $validated['address'] ?? null,

                        'city' =>
                            $validated['city'] ?? null,

                        'country' =>
                            $validated['country']
                            ?? 'Saudi Arabia',

                        'logo' =>
                            $logoPath,

                        'notes' =>
                            $validated['notes'] ?? null,

                        'status' =>
                            $validated['status'] === 'active',

                        /*
                        |--------------------------------------------------------------------------
                        | Subscription
                        |--------------------------------------------------------------------------
                        */

                        'subscription_plan' =>
                            $validated['subscription_plan'],

                        'subscription_status' =>
                            $validated['subscription_status'],

                        'subscription_expires_at' =>
                            $validated['subscription_expires_at']
                            ?? null,
                    ]);

                    /*
                    |--------------------------------------------------------------------------
                    | Update Owner
                    |--------------------------------------------------------------------------
                    */

                    $owner = User::query()
                        ->where(
                            'pharmacy_id',
                            $pharmacy->id
                        )
                        ->where(
                            'role',
                            UserRole::Owner->value
                        )
                        ->first();

                    if ($owner) {
                        $owner->name =
                            $validated['owner_name'];

                        $owner->email =
                            $validated['email'];

                        if (! empty(
                            $validated['password']
                        )) {
                            $owner->password =
                                $validated['password'];
                        }

                        $owner->save();
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Ensure Settings Exist
                    |--------------------------------------------------------------------------
                    |
                    | We create settings for older pharmacies that were created
                    | before pharmacy-specific settings were introduced.
                    |
                    | IMPORTANT:
                    | We do NOT overwrite a pharmacy's customised printing
                    | name, VAT, Arabic name, footer, etc. on every platform edit.
                    |
                    */

                    $setting = Setting::firstOrCreate(
                        [
                            'pharmacy_id' =>
                                $pharmacy->id,
                        ],
                        [
                            'pharmacy_name' =>
                                $pharmacy->name,

                            'owner_name' =>
                                $pharmacy->owner_name,

                            'phone' =>
                                $pharmacy->phone,

                            'email' =>
                                $pharmacy->email,

                            'address' =>
                                $pharmacy->address,

                            'city' =>
                                $pharmacy->city
                                ?: 'Riyadh',

                            'country' =>
                                $pharmacy->country
                                ?: 'Saudi Arabia',

                            'logo' =>
                                $pharmacy->logo,

                            'pharmacy_name_ar' =>
                                'صيدلية فارمكسا',

                            'currency' => 'SAR',

                            'currency_symbol' => 'SAR',

                            'timezone' =>
                                'Asia/Riyadh',

                            'language' => 'en',

                            'receipt_size' => '80',
                        ]
                    );

                    /*
                     * Keep basic account contact information aligned with the
                     * platform pharmacy record.
                     *
                     * We intentionally do NOT replace pharmacy_name here,
                     * because the pharmacy may have customised its print name.
                     */
                    $setting->update([
                        'owner_name' =>
                            $pharmacy->owner_name,

                        'phone' =>
                            $pharmacy->phone,

                        'email' =>
                            $pharmacy->email,

                        'address' =>
                            $pharmacy->address,

                        'city' =>
                            $pharmacy->city
                            ?: 'Riyadh',

                        'country' =>
                            $pharmacy->country
                            ?: 'Saudi Arabia',

                        'logo' =>
                            $pharmacy->logo,
                    ]);

                    /*
                    |--------------------------------------------------------------------------
                    | Repair / Synchronise Catalogue
                    |--------------------------------------------------------------------------
                    */

                    $this->syncGlobalCatalogue(
                        $pharmacy
                    );
                }
            );
        } catch (\Throwable $e) {
            /*
             * If a newly uploaded file was never committed to the database,
             * remove it.
             */
            if ($newLogoPath) {
                Storage::disk('public')
                    ->delete($newLogoPath);
            }

            throw $e;
        }

        /*
        |--------------------------------------------------------------------------
        | Remove Old Logo After Successful Transaction
        |--------------------------------------------------------------------------
        */

        if (
            $oldLogo
            && $oldLogo !== $pharmacy->logo
        ) {
            Storage::disk('public')
                ->delete($oldLogo);
        }

        return redirect()
            ->route(
                'platform.pharmacies.show',
                $pharmacy
            )
            ->with(
                'success',
                "Pharmacy \"{$pharmacy->name}\" updated successfully."
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Pharmacy
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Pharmacy $pharmacy
    ): RedirectResponse {
        $name = $pharmacy->name;

        $logo = $pharmacy->logo;

        DB::transaction(
            function () use ($pharmacy) {
                /*
                |--------------------------------------------------------------------------
                | Pharmacy Settings
                |--------------------------------------------------------------------------
                */

                Setting::where(
                    'pharmacy_id',
                    $pharmacy->id
                )->delete();

                /*
                |--------------------------------------------------------------------------
                | Pharmacy Inventory
                |--------------------------------------------------------------------------
                */

                PharmacyMedicine::where(
                    'pharmacy_id',
                    $pharmacy->id
                )->delete();

                /*
                |--------------------------------------------------------------------------
                | Pharmacy Users
                |--------------------------------------------------------------------------
                */

                User::where(
                    'pharmacy_id',
                    $pharmacy->id
                )->delete();

                /*
                |--------------------------------------------------------------------------
                | Pharmacy
                |--------------------------------------------------------------------------
                */

                $pharmacy->delete();
            }
        );

        /*
         * Remove file only after database deletion succeeds.
         */
        if ($logo) {
            Storage::disk('public')
                ->delete($logo);
        }

        return redirect()
            ->route('platform.pharmacies.index')
            ->with(
                'success',
                "Pharmacy \"{$name}\" deleted successfully."
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Synchronise Global Catalogue
    |--------------------------------------------------------------------------
    */

    private function syncGlobalCatalogue(
        Pharmacy $pharmacy
    ): void {
        $now = now();

        Medicine::query()
            ->whereNull('pharmacy_id')
            ->select([
                'id',
                'minimum_stock',
                'tax_percentage',
            ])
            ->orderBy('id')
            ->chunkById(
                500,
                function ($medicines) use (
                    $pharmacy,
                    $now
                ) {
                    $rows = [];

                    foreach ($medicines as $medicine) {
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
} 