<?php

namespace App\Services;

use App\Models\GlobalMedicineContribution;
use App\Models\GlobalMedicineUpdate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use RuntimeException;

class GlobalMedicineUpdateService
{
    /**
     * Fields that are allowed to be changed in the global
     * medicine catalogue.
     *
     * Pharmacy-specific business data such as:
     * SKU, stock, prices, supplier, batch and expiry
     * must NEVER be synchronized globally.
     */
    protected array $allowedGlobalFields = [
        'gtin',
        'barcode',
        'name',
        'generic_name',
        'brand_name',
        'medicine_type',
    ];

    /**
     * Approve and publish a pending contribution.
     *
     * correction:
     *     Existing global medicine is corrected.
     *
     * new_medicine:
     *     A new global medicine is created.
     *
     * Everything happens inside one database transaction.
     */
    public function approveContribution(
        int $contributionId,
        ?int $reviewedBy = null,
        ?string $reviewNote = null
    ): GlobalMedicineUpdate {
        return DB::transaction(function () use (
            $contributionId,
            $reviewedBy,
            $reviewNote
        ) {
            $contribution = GlobalMedicineContribution::query()
                ->lockForUpdate()
                ->findOrFail($contributionId);

            if ($contribution->status !== 'pending') {
                throw new RuntimeException(
                    'Only pending contributions can be approved.'
                );
            }

            if ($contribution->contribution_type === 'correction') {
                return $this->approveCorrection(
                    $contribution,
                    $reviewedBy,
                    $reviewNote
                );
            }

            if ($contribution->contribution_type === 'new_medicine') {
                return $this->approveNewMedicine(
                    $contribution,
                    $reviewedBy,
                    $reviewNote
                );
            }

            throw new RuntimeException(
                'Unknown contribution type: ' .
                $contribution->contribution_type
            );
        });
    }

    /**
     * Approve a correction to an existing global medicine.
     */
    protected function approveCorrection(
        GlobalMedicineContribution $contribution,
        ?int $reviewedBy,
        ?string $reviewNote
    ): GlobalMedicineUpdate {
        if (!$contribution->medicine_id) {
            throw new RuntimeException(
                'The contribution does not contain a medicine ID.'
            );
        }

        $medicine = DB::table('medicines')
            ->where('id', $contribution->medicine_id)
            ->lockForUpdate()
            ->first();

        if (!$medicine) {
            throw new RuntimeException(
                'The global medicine could not be found.'
            );
        }

        if ($medicine->pharmacy_id !== null) {
            throw new RuntimeException(
                'Only global medicines can be updated by the global catalogue service.'
            );
        }

        /*
         * New format: one contribution can contain several changed global
         * fields inside payload.changes.
         *
         * Legacy format: older contributions contain one field_name and one
         * proposed_value. We continue supporting them so existing approvals
         * are not broken.
         */
        $payload = $contribution->payload;
        if (is_string($payload)) {
            $payload = json_decode($payload, true);
        }
        if (!is_array($payload)) {
            $payload = [];
        }

        $changesToApply = [];

        if (!empty($payload['changes']) && is_array($payload['changes'])) {
            foreach ($payload['changes'] as $field => $change) {
                if (!is_array($change) || !array_key_exists('new', $change)) {
                    continue;
                }

                $field = trim((string) $field);

                if (!$this->isAllowedGlobalField($field)) {
                    throw new RuntimeException(
                        "The field [{$field}] is not allowed for global synchronization."
                    );
                }

                if (!Schema::hasColumn('medicines', $field)) {
                    throw new RuntimeException(
                        "The field [{$field}] does not exist in the medicines table."
                    );
                }

                $oldValue = $medicine->{$field};
                $newValue = $this->normalizeValue($field, $change['new']);

                $this->validateCorrectionValue($field, $newValue, $medicine->id);

                $changesToApply[$field] = [
                    'old' => $oldValue,
                    'new' => $newValue,
                ];
            }
        } else {
            // Legacy one-field contribution.
            $field = trim((string) $contribution->field_name);

            if (!$this->isAllowedGlobalField($field)) {
                throw new RuntimeException(
                    "The field [{$field}] is not allowed for global synchronization."
                );
            }

            if (!Schema::hasColumn('medicines', $field)) {
                throw new RuntimeException(
                    "The field [{$field}] does not exist in the medicines table."
                );
            }

            $oldValue = $medicine->{$field};
            $newValue = $this->normalizeValue(
                $field,
                $contribution->proposed_value
            );

            $this->validateCorrectionValue($field, $newValue, $medicine->id);

            $changesToApply[$field] = [
                'old' => $oldValue,
                'new' => $newValue,
            ];
        }

        if (empty($changesToApply)) {
            throw new RuntimeException(
                'This correction request does not contain any valid changes.'
            );
        }

        $publishedChanges = [];

        foreach ($changesToApply as $field => $change) {
            $oldValue = $change['old'];
            $newValue = $change['new'];

            if ($this->valuesAreEqual($oldValue, $newValue)) {
                continue;
            }

            DB::table('medicines')
                ->where('id', $contribution->medicine_id)
                ->update([
                    $field => $newValue,
                    'updated_at' => now(),
                ]);

            $this->synchronizePharmacies(
                $contribution->medicine_id,
                $field,
                $oldValue,
                $newValue
            );

            $publishedChanges[$field] = [
                'old' => $oldValue,
                'new' => $newValue,
            ];
        }

        $contribution->update([
            'status' => 'approved',
            'reviewed_by' => $reviewedBy ?? Auth::id(),
            'reviewed_at' => now(),
            'review_note' => $reviewNote,
        ]);

        if (empty($publishedChanges)) {
            $publishedChanges = $changesToApply;
        }

        return $this->createUpdateHistory(
            $contribution,
            $contribution->medicine_id,
            $publishedChanges,
            $reviewedBy
        );
    }

    /**
     * Validate one proposed global correction.
     */
    protected function validateCorrectionValue(
        string $field,
        mixed $newValue,
        int $medicineId
    ): void {
        if (
            in_array($field, ['gtin', 'barcode', 'name'], true)
            && ($newValue === null || $newValue === '')
        ) {
            throw new RuntimeException(
                "The proposed value for [{$field}] cannot be empty."
            );
        }

        if (
            $field === 'gtin'
            && $newValue !== null
            && !preg_match('/^\d{8}$|^\d{12}$|^\d{13}$|^\d{14}$/', (string) $newValue)
        ) {
            throw new RuntimeException(
                'The proposed GTIN must contain 8, 12, 13 or 14 digits.'
            );
        }

        if ($field === 'gtin' && $newValue !== null) {
            $duplicate = DB::table('medicines')
                ->where('gtin', $newValue)
                ->where('id', '!=', $medicineId)
                ->whereNull('pharmacy_id')
                ->exists();

            if ($duplicate) {
                throw new RuntimeException(
                    "GTIN [{$newValue}] is already assigned to another global medicine."
                );
            }
        }

        if ($field === 'barcode' && $newValue !== null) {
            $duplicate = DB::table('medicines')
                ->where('barcode', $newValue)
                ->where('id', '!=', $medicineId)
                ->whereNull('pharmacy_id')
                ->exists();

            if ($duplicate) {
                throw new RuntimeException(
                    "Barcode [{$newValue}] is already assigned to another global medicine."
                );
            }
        }
    }

    /**
     * Approve a newly discovered medicine.
     *
     * This creates a brand-new global medicine with pharmacy_id = NULL.
     */
    protected function approveNewMedicine(
        GlobalMedicineContribution $contribution,
        ?int $reviewedBy,
        ?string $reviewNote
    ): GlobalMedicineUpdate {
        $payload = $contribution->payload;

        if (is_string($payload)) {
            $payload = json_decode($payload, true);
        }

        if (!is_array($payload)) {
            $payload = [];
        }

        $sourceMedicineId = !empty($payload['source_medicine_id'])
            ? (int) $payload['source_medicine_id']
            : null;

        $gtin = $this->normalizeValue(
            'gtin',
            $contribution->gtin ?? ($payload['gtin'] ?? null)
        );

        $barcode = $this->normalizeValue(
            'barcode',
            $contribution->barcode ?? ($payload['barcode'] ?? null)
        );

        $name = $this->normalizeValue(
            'name',
            $payload['name'] ?? null
        );

        if ($name === null || $name === '') {
            throw new RuntimeException(
                'A new global medicine must have a medicine name.'
            );
        }

        if (
            $gtin !== null
            && !preg_match('/^\d{8}$|^\d{12}$|^\d{13}$|^\d{14}$/', $gtin)
        ) {
            throw new RuntimeException(
                'The proposed GTIN must contain 8, 12, 13 or 14 digits.'
            );
        }

        /*
         * Never allow approval to create a duplicate global identity.
         * When promoting the pharmacy's local medicine, exclude that same row.
         */
        if ($gtin !== null) {
            $query = DB::table('medicines')
                ->whereNull('pharmacy_id')
                ->where('gtin', $gtin);

            if ($sourceMedicineId) {
                $query->where('id', '!=', $sourceMedicineId);
            }

            if ($query->exists()) {
                throw new RuntimeException(
                    "GTIN [{$gtin}] already exists in the medicine catalogue."
                );
            }
        }

        if ($barcode !== null) {
            $query = DB::table('medicines')
                ->whereNull('pharmacy_id')
                ->where('barcode', $barcode);

            if ($sourceMedicineId) {
                $query->where('id', '!=', $sourceMedicineId);
            }

            if ($query->exists()) {
                throw new RuntimeException(
                    "Barcode [{$barcode}] already exists in the global medicine catalogue."
                );
            }
        }

        /*
         * If the pharmacy already created a local Medicine record, promote
         * THAT SAME RECORD to global instead of creating a second medicine.
         * This preserves medicine_id references, stock history and the
         * pharmacy's existing PharmacyMedicine row.
         */
        if ($sourceMedicineId) {
            $local = DB::table('medicines')
                ->where('id', $sourceMedicineId)
                ->lockForUpdate()
                ->first();

            if (!$local) {
                throw new RuntimeException(
                    'The pharmacy-created source medicine could not be found.'
                );
            }

            if (
                $local->pharmacy_id === null
                || (int) $local->pharmacy_id !== (int) $contribution->pharmacy_id
            ) {
                throw new RuntimeException(
                    'The source medicine does not belong to the submitting pharmacy.'
                );
            }

            $medicineData = [
                'pharmacy_id' => null,
                'gtin' => $gtin,
                'barcode' => $barcode,
                'name' => $name,
                'generic_name' => $this->normalizeValue(
                    'generic_name',
                    $payload['generic_name'] ?? $local->generic_name
                ),
                'brand_name' => $this->normalizeValue(
                    'brand_name',
                    $payload['brand_name'] ?? $local->brand_name
                ),
                'medicine_type' => $this->normalizeValue(
                    'medicine_type',
                    $payload['medicine_type'] ?? $local->medicine_type
                ),
                'sku' => 'GLOBAL-' . strtoupper(uniqid()),
                'stock_quantity' => 0,
                'purchase_price' => 0,
                'selling_price' => 0,
                'tax_percentage' => 0,
                'minimum_stock' => 10,
                'supplier_id' => null,
                'batch_number' => null,
                'expiry_date' => null,
                'is_active' => true,
                'updated_at' => now(),
            ];

            foreach (['category_id', 'manufacturer_id', 'unit_id'] as $field) {
                if (
                    Schema::hasColumn('medicines', $field)
                    && array_key_exists($field, $payload)
                    && $payload[$field] !== null
                    && $payload[$field] !== ''
                ) {
                    $medicineData[$field] = $payload[$field];
                }
            }

            DB::table('medicines')
                ->where('id', $sourceMedicineId)
                ->update($medicineData);

            $medicineId = $sourceMedicineId;

            $contribution->update([
                'medicine_id' => $medicineId,
                'status' => 'approved',
                'reviewed_by' => $reviewedBy ?? Auth::id(),
                'reviewed_at' => now(),
                'review_note' => $reviewNote,
            ]);

            /*
             * The submitting pharmacy keeps its own SKU, stock, price,
             * supplier, batch and expiry. Only product identity becomes global.
             */
            if (Schema::hasTable('pharmacy_medicines')) {
                $localPm = DB::table('pharmacy_medicines')
                    ->where('pharmacy_id', $contribution->pharmacy_id)
                    ->where('medicine_id', $medicineId)
                    ->lockForUpdate()
                    ->first();

                if ($localPm) {
                    $pmChanges = [];

                    if (Schema::hasColumn('pharmacy_medicines', 'gtin')) {
                        $pmChanges['gtin'] = $gtin;
                    }

                    if (Schema::hasColumn('pharmacy_medicines', 'barcode')) {
                        $pmChanges['barcode'] = $barcode;
                    }

                    if ($pmChanges) {
                        $pmChanges['updated_at'] = now();
                        DB::table('pharmacy_medicines')
                            ->where('id', $localPm->id)
                            ->update($pmChanges);
                    }
                }
            }

            $this->ensurePharmacyLinks($medicineId);

            $changes = [
                'created' => [
                    'old' => null,
                    'new' => $medicineData,
                ],
                'promoted_source_medicine_id' => [
                    'old' => $sourceMedicineId,
                    'new' => $medicineId,
                ],
            ];

            return $this->createUpdateHistory(
                $contribution,
                $medicineId,
                $changes,
                $reviewedBy
            );
        }

        /*
         * No local source record exists. Create a clean global catalogue row.
         */
        $medicineData = [
            'pharmacy_id' => null,
            'gtin' => $gtin,
            'barcode' => $barcode,
            'name' => $name,
            'generic_name' => $this->normalizeValue(
                'generic_name',
                $payload['generic_name'] ?? null
            ),
            'brand_name' => $this->normalizeValue(
                'brand_name',
                $payload['brand_name'] ?? null
            ),
            'medicine_type' => $this->normalizeValue(
                'medicine_type',
                $payload['medicine_type'] ?? null
            ),
            'sku' => 'GLOBAL-' . strtoupper(uniqid()),
            'stock_quantity' => 0,
            'purchase_price' => 0,
            'selling_price' => 0,
            'tax_percentage' => 0,
            'minimum_stock' => 10,
            'supplier_id' => null,
            'batch_number' => null,
            'expiry_date' => null,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        foreach (['category_id', 'manufacturer_id', 'unit_id'] as $field) {
            if (
                Schema::hasColumn('medicines', $field)
                && array_key_exists($field, $payload)
                && $payload[$field] !== null
                && $payload[$field] !== ''
            ) {
                $medicineData[$field] = $payload[$field];
            }
        }

        $medicineId = DB::table('medicines')->insertGetId($medicineData);

        $contribution->update([
            'medicine_id' => $medicineId,
            'status' => 'approved',
            'reviewed_by' => $reviewedBy ?? Auth::id(),
            'reviewed_at' => now(),
            'review_note' => $reviewNote,
        ]);

        $this->ensurePharmacyLinks($medicineId);

        return $this->createUpdateHistory(
            $contribution,
            $medicineId,
            [
                'created' => [
                    'old' => null,
                    'new' => $medicineData,
                ],
            ],
            $reviewedBy
        );
    }

    /**
     * Make an approved global product available to every pharmacy without
     * touching any pharmacy's stock, price, SKU, supplier, batch or expiry.
     */
    protected function ensurePharmacyLinks(int $medicineId): void
    {
        if (!Schema::hasTable('pharmacies') || !Schema::hasTable('pharmacy_medicines')) {
            return;
        }

        $now = now();

        DB::table('pharmacies')
            ->select('id')
            ->orderBy('id')
            ->chunkById(500, function ($pharmacies) use ($medicineId, $now) {
                $rows = [];

                foreach ($pharmacies as $pharmacy) {
                    $rows[] = [
                        'pharmacy_id' => $pharmacy->id,
                        'medicine_id' => $medicineId,
                        'stock_quantity' => 0,
                        'minimum_stock' => 10,
                        'tax_percentage' => 0,
                        'is_active' => true,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }

                if ($rows) {
                    DB::table('pharmacy_medicines')->insertOrIgnore($rows);
                }
            });
    }

    /**
     * Connect an existing pharmacy medicine to a newly created
     * global medicine.
     *
     * We do not create duplicate pharmacy inventory records.
     */
    protected function attachSubmittingPharmacyMedicine(
        GlobalMedicineContribution $contribution,
        int $medicineId,
        ?string $barcode,
        array $payload
    ): void {
        if (!Schema::hasTable('pharmacy_medicines')) {
            return;
        }

        $query = DB::table('pharmacy_medicines')
            ->where('pharmacy_id', $contribution->pharmacy_id);

        /*
         * Barcode is the strongest available matching value.
         */
        if (
            $barcode !== null
            && Schema::hasColumn('pharmacy_medicines', 'barcode')
        ) {
            $query->where('barcode', $barcode);
        } elseif (
            !empty($payload['sku'])
            && Schema::hasColumn('pharmacy_medicines', 'sku')
        ) {
            $query->where('sku', $payload['sku']);
        } else {
            return;
        }

        $pharmacyMedicine = $query
            ->lockForUpdate()
            ->first();

        if (!$pharmacyMedicine) {
            return;
        }

        /*
         * If it is already attached to another global medicine,
         * do not silently steal it.
         */
        if (
            $pharmacyMedicine->medicine_id !== null
            && (int) $pharmacyMedicine->medicine_id !== $medicineId
        ) {
            throw new RuntimeException(
                'The pharmacy medicine is already linked to another global medicine.'
            );
        }

        DB::table('pharmacy_medicines')
            ->where('id', $pharmacyMedicine->id)
            ->update([
                'medicine_id' => $medicineId,
                'updated_at' => now(),
            ]);
    }

    /**
     * Synchronize a corrected global field to pharmacy records.
     *
     * NULL means the pharmacy is inheriting the global value.
     *
     * The old global value also counts as inherited because an older
     * version may already have been copied to pharmacy_medicines.
     */
    protected function synchronizePharmacies(
        int $medicineId,
        string $field,
        mixed $oldValue,
        mixed $newValue
    ): void {
        if (!Schema::hasColumn('pharmacy_medicines', $field)) {
            return;
        }

        if (!$this->isPharmacySyncField($field)) {
            return;
        }

        $pharmacyMedicines = DB::table('pharmacy_medicines')
            ->where('medicine_id', $medicineId)
            ->lockForUpdate()
            ->get();

        foreach ($pharmacyMedicines as $pharmacyMedicine) {
            $currentLocalValue = $pharmacyMedicine->{$field};

            /*
             * NULL means the pharmacy never customized this field.
             *
             * The old global value also means the pharmacy is still
             * using the previous global value.
             */
            $inheritsGlobal = (
                $currentLocalValue === null
                || $this->valuesAreEqual(
                    $currentLocalValue,
                    $oldValue
                )
            );

            /*
             * Never overwrite an intentional pharmacy-specific value.
             */
            if (!$inheritsGlobal) {
                continue;
            }

            /*
             * Barcode has a pharmacy-level unique constraint.
             */
            if ($field === 'barcode' && $newValue !== null) {
                $duplicate = DB::table('pharmacy_medicines')
                    ->where(
                        'pharmacy_id',
                        $pharmacyMedicine->pharmacy_id
                    )
                    ->where('barcode', $newValue)
                    ->where('id', '!=', $pharmacyMedicine->id)
                    ->exists();

                if ($duplicate) {
                    throw new RuntimeException(
                        "Cannot synchronize barcode [{$newValue}] to pharmacy ID {$pharmacyMedicine->pharmacy_id} because that barcode is already used by another pharmacy medicine."
                    );
                }
            }

            DB::table('pharmacy_medicines')
                ->where('id', $pharmacyMedicine->id)
                ->update([
                    $field => $newValue,
                    'updated_at' => now(),
                ]);
        }
    }

    /**
     * Fields allowed to synchronize to PharmacyMedicine.
     */
    protected function isPharmacySyncField(string $field): bool
    {
        return in_array($field, [
            'barcode',
            'gtin',
            'name',
            'generic_name',
            'brand_name',
            'medicine_type',
        ], true);
    }

    /**
     * Check whether a field is allowed in the global catalogue.
     */
    protected function isAllowedGlobalField(string $field): bool
    {
        return in_array(
            $field,
            $this->allowedGlobalFields,
            true
        );
    }

    /**
     * Normalize contributed values.
     */
    protected function normalizeValue(
        string $field,
        mixed $value
    ): mixed {
        if (is_string($value)) {
            $value = trim($value);
        }

        /*
         * GTIN and barcode are stored as strings.
         * This is important because leading zeroes must be preserved.
         *
         * Example:
         *
         * 06286434001187
         *
         * must NOT become:
         *
         * 6286434001187
         */
        if (
            in_array($field, ['gtin', 'barcode'], true)
            && $value !== null
        ) {
            $value = trim((string) $value);
        }

        return $value;
    }

    /**
     * Compare values safely.
     */
    protected function valuesAreEqual(
        mixed $oldValue,
        mixed $newValue
    ): bool {
        if ($oldValue === null && $newValue === null) {
            return true;
        }

        return (string) $oldValue === (string) $newValue;
    }

    /**
     * Get the next global medicine version.
     */
    protected function nextVersion(int $medicineId): int
    {
        $latestVersion = GlobalMedicineUpdate::query()
            ->where('medicine_id', $medicineId)
            ->lockForUpdate()
            ->max('version');

        return ((int) $latestVersion) + 1;
    }

    /**
     * Create permanent global update history.
     */
    protected function createUpdateHistory(
        GlobalMedicineContribution $contribution,
        int $medicineId,
        array $changes,
        ?int $changedBy = null
    ): GlobalMedicineUpdate {
        $version = $this->nextVersion($medicineId);

        return GlobalMedicineUpdate::create([
            'medicine_id' => $medicineId,
            'version' => $version,
            'contribution_id' => $contribution->id,
            'changed_by' => $changedBy ?? Auth::id(),

            'changes' => $changes,

            'source' => $contribution->source ?? 'manual',
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    /**
     * Reject a pending contribution.
     *
     * Rejected contributions remain permanently stored
     * for audit/history.
     */
    public function rejectContribution(
        int $contributionId,
        ?int $reviewedBy = null,
        ?string $reviewNote = null
    ): GlobalMedicineContribution {
        return DB::transaction(function () use (
            $contributionId,
            $reviewedBy,
            $reviewNote
        ) {
            $contribution = GlobalMedicineContribution::query()
                ->lockForUpdate()
                ->findOrFail($contributionId);

            if ($contribution->status !== 'pending') {
                throw new RuntimeException(
                    'Only pending contributions can be rejected.'
                );
            }

            $contribution->update([
                'status' => 'rejected',
                'reviewed_by' => $reviewedBy ?? Auth::id(),
                'reviewed_at' => now(),
                'review_note' => $reviewNote,
            ]);

            return $contribution->fresh();
        });
    }
}