<?php

namespace App\Services;

use App\Models\GlobalMedicineContribution;
use Illuminate\Support\Facades\Auth;

class GlobalMedicineContributionService
{
    public function __construct(
        protected GlobalMedicineIdentity $identity
    ) {
    }

    /**
     * Submit a correction to an existing global medicine.
     *
     * This does NOT modify the global medicine immediately.
     * The correction is stored as a pending contribution and will
     * be handled by the verification/update process later.
     *
     * Duplicate pending contributions are prevented.
     */
    public function submitCorrection(
        int $pharmacyId,
        int $medicineId,
        string $fieldName,
        $oldValue,
        $proposedValue,
        array $data = []
    ): GlobalMedicineContribution {
        $fieldName = trim($fieldName);

        $oldValue = $this->normalizeValue($oldValue);
        $proposedValue = $this->normalizeValue($proposedValue);

        /*
         * Do not create another identical pending contribution
         * from the same pharmacy for the same medicine/field/value.
         */
        $existing = $this->findPendingContribution(
            pharmacyId: $pharmacyId,
            medicineId: $medicineId,
            fieldName: $fieldName,
            proposedValue: $proposedValue
        );

        if ($existing) {
            return $existing;
        }

        return GlobalMedicineContribution::create([
            'pharmacy_id' => $pharmacyId,
            'medicine_id' => $medicineId,
            'user_id' => $data['user_id'] ?? Auth::id(),

            'source' => $data['source'] ?? 'manual',
            'contribution_type' => 'correction',

            'field_name' => $fieldName,
            'old_value' => $oldValue,
            'proposed_value' => $proposedValue,

            'payload' => $data['payload'] ?? null,

            'raw_gs1_data' => $data['raw_gs1_data'] ?? null,

            'gtin' => $this->identity->normalizeForStorage(
                $data['gtin'] ?? null
            ),

            'barcode' => $this->identity->normalizeForStorage(
                $data['barcode'] ?? null
            ),

            'confidence_score' => $this->confidenceScore(
                $data['confidence_score'] ?? 0
            ),

            'status' => 'pending',
        ]);
    }

    /**
     * Submit a newly discovered medicine.
     *
     * This does NOT immediately create a global medicine.
     * It creates a pending candidate for verification.
     *
     * Duplicate pending candidates are prevented.
     */
    public function submitNewMedicine(
        int $pharmacyId,
        array $medicineData,
        array $data = []
    ): NewMedicineSubmissionResult {
        $gtin = $this->identity->normalizeForStorage(
            $data['gtin'] ?? ($medicineData['gtin'] ?? null)
        );

        $barcode = $this->identity->normalizeForStorage(
            $data['barcode'] ?? ($medicineData['barcode'] ?? null)
        );

        $name = trim((string) ($medicineData['name'] ?? ''));

        $duplicate = $this->identity->findGlobalDuplicate(
            $gtin,
            $barcode
        );

        if ($duplicate && $duplicate['match'] === 'gtin') {
            $existingName = $duplicate['medicine']->name;

            return new NewMedicineSubmissionResult(
                status: NewMedicineSubmissionResult::GTIN_EXISTS,
                message: $existingName
                    ? "Product already exists in the Global Catalogue ({$existingName})."
                    : 'Product already exists in the Global Catalogue.',
                existingMedicine: $duplicate['medicine']
            );
        }

        if ($duplicate && $duplicate['match'] === 'barcode') {
            $existingName = $duplicate['medicine']->name;

            return new NewMedicineSubmissionResult(
                status: NewMedicineSubmissionResult::BARCODE_EXISTS,
                message: $existingName
                    ? "Barcode already exists in the Global Catalogue ({$existingName})."
                    : 'Barcode already exists in the Global Catalogue.',
                existingMedicine: $duplicate['medicine']
            );
        }

        /*
         * If we have a GTIN, use it as the strongest identifier.
         * Otherwise use the barcode.
         */
        $existing = $this->findPendingNewMedicine(
            pharmacyId: $pharmacyId,
            gtin: $gtin,
            barcode: $barcode
        );

        if ($existing) {
            return new NewMedicineSubmissionResult(
                status: NewMedicineSubmissionResult::ALREADY_PENDING,
                message: 'Product submitted successfully for Global Catalogue approval.',
                contribution: $existing
            );
        }

        $payload = $this->identityOnlyPayload(
            $medicineData,
            $gtin,
            $barcode,
            $name
        );

        $contribution = GlobalMedicineContribution::create([
            'pharmacy_id' => $pharmacyId,
            'medicine_id' => null,
            'user_id' => $data['user_id'] ?? Auth::id(),

            'source' => $data['source'] ?? 'manual',
            'contribution_type' => 'new_medicine',

            'field_name' => null,
            'old_value' => null,
            'proposed_value' => $name !== '' ? $name : null,

            'payload' => $payload,

            'raw_gs1_data' => $data['raw_gs1_data'] ?? null,

            'gtin' => $gtin,
            'barcode' => $barcode,

            'confidence_score' => $this->confidenceScore(
                $data['confidence_score'] ?? 0
            ),

            'status' => 'pending',
        ]);

        return new NewMedicineSubmissionResult(
            status: NewMedicineSubmissionResult::SUBMITTED,
            message: 'Product submitted successfully for Global Catalogue approval.',
            contribution: $contribution
        );
    }

    /**
     * Submit a correction obtained from a GS1 DataMatrix.
     *
     * GS1 evidence receives a strong initial confidence score,
     * but it still remains pending until the verification system
     * approves it.
     */
    public function submitGs1Correction(
        int $pharmacyId,
        int $medicineId,
        string $fieldName,
        $oldValue,
        $proposedValue,
        array $data = []
    ): GlobalMedicineContribution {
        $data['source'] = 'gs1';

        /*
         * Allow an explicitly supplied score, otherwise use 80.
         */
        $data['confidence_score'] = $data['confidence_score'] ?? 80;

        return $this->submitCorrection(
            pharmacyId: $pharmacyId,
            medicineId: $medicineId,
            fieldName: $fieldName,
            oldValue: $oldValue,
            proposedValue: $proposedValue,
            data: $data
        );
    }

    /**
     * Submit a newly discovered medicine obtained from
     * a GS1 DataMatrix.
     */
    public function submitGs1NewMedicine(
        int $pharmacyId,
        array $medicineData,
        array $data = []
    ): GlobalMedicineContribution {
        $data['source'] = 'gs1';

        /*
         * GS1 evidence gives a strong initial confidence score,
         * but the medicine is still pending verification.
         */
        $data['confidence_score'] = $data['confidence_score'] ?? 80;

        return $this->submitNewMedicine(
            pharmacyId: $pharmacyId,
            medicineData: $medicineData,
            data: $data
        );
    }

    /**
     * Store only catalogue identity for a new-medicine contribution.
     *
     * Pharmacy operational data is never exported to Super Owner review.
     * source_medicine_id is kept internally so approval can promote the
     * existing local catalogue row without creating a barcode clash.
     */
    protected function identityOnlyPayload(
        array $medicineData,
        ?string $gtin,
        ?string $barcode,
        string $name
    ): array {
        $payload = [
            'gtin' => $gtin,
            'barcode' => $barcode,
            'name' => $name,
        ];

        if (! empty($medicineData['source_medicine_id'])) {
            $payload['source_medicine_id'] = (int) $medicineData['source_medicine_id'];
        }

        /*
         * Classification fields may arrive from the existing GS1 new-medicine
         * path. They are not pharmacy inventory, and they remain available
         * when a brand-new global row must be created.
         */
        foreach ([
            'generic_name',
            'brand_name',
            'medicine_type',
            'category_id',
            'manufacturer_id',
            'unit_id',
        ] as $field) {
            if (array_key_exists($field, $medicineData) && $medicineData[$field] !== null && $medicineData[$field] !== '') {
                $payload[$field] = $medicineData[$field];
            }
        }

        return $payload;
    }

    /**
     * Find an identical pending correction.
     */
    protected function findPendingContribution(
        int $pharmacyId,
        int $medicineId,
        string $fieldName,
        $proposedValue
    ): ?GlobalMedicineContribution {
        return GlobalMedicineContribution::query()
            ->where('pharmacy_id', $pharmacyId)
            ->where('medicine_id', $medicineId)
            ->where('field_name', $fieldName)
            ->where('proposed_value', (string) $proposedValue)
            ->where('status', 'pending')
            ->latest('id')
            ->first();
    }

    /**
     * Find an identical pending new-medicine candidate.
     */
    protected function findPendingNewMedicine(
        int $pharmacyId,
        ?string $gtin,
        ?string $barcode
    ): ?GlobalMedicineContribution {
        $query = GlobalMedicineContribution::query()
            ->where('pharmacy_id', $pharmacyId)
            ->where('contribution_type', 'new_medicine')
            ->where('status', 'pending');

        /*
         * Prefer GTIN because it is the strongest product identifier.
         */
        $normalizedGtin = $this->identity->normalizeForComparison($gtin);
        $normalizedBarcode = $this->identity->normalizeForComparison($barcode);

        if ($normalizedGtin !== null) {
            return $query
                ->whereRaw(
                    "REPLACE(REPLACE(REPLACE(COALESCE(gtin, ''), ' ', ''), '-', ''), CHAR(9), '') = ?",
                    [$normalizedGtin]
                )
                ->latest('id')
                ->first();
        }

        if ($normalizedBarcode !== null) {
            return $query
                ->whereRaw(
                    "REPLACE(REPLACE(REPLACE(COALESCE(barcode, ''), ' ', ''), '-', ''), CHAR(9), '') = ?",
                    [$normalizedBarcode]
                )
                ->latest('id')
                ->first();
        }

        /*
         * A new medicine without either identifier cannot be
         * safely deduplicated by identifier.
         */
        return null;
    }

    /**
     * Normalize values before storing/comparing them.
     *
     * Arrays/objects are left alone because they may be used
     * inside payload data, while scalar values are converted
     * consistently for contribution comparison.
     */
    protected function normalizeValue($value)
    {
        if ($value === null) {
            return null;
        }

        if (is_string($value)) {
            return trim($value);
        }

        return $value;
    }

    /**
     * Convert empty strings to NULL for optional identifiers.
     */
    protected function normalizeNullable($value): ?string
    {
        return $this->identity->normalizeForStorage(
            $value === null ? null : (string) $value
        );
    }

    /**
     * Keep confidence scores inside the database range.
     */
    protected function confidenceScore($score): float
    {
        $score = is_numeric($score)
            ? (float) $score
            : 0.0;

        return max(0, min(100, $score));
    }
}