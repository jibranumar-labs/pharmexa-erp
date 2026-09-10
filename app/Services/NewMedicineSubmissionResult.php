<?php

namespace App\Services;

use App\Models\GlobalMedicineContribution;
use App\Models\Medicine;

class NewMedicineSubmissionResult
{
    public const SUBMITTED = 'submitted';

    public const ALREADY_PENDING = 'already_pending';

    public const GTIN_EXISTS = 'gtin_exists';

    public const BARCODE_EXISTS = 'barcode_exists';

    public function __construct(
        public string $status,
        public string $message,
        public ?GlobalMedicineContribution $contribution = null,
        public ?Medicine $existingMedicine = null
    ) {
    }

    public function isSubmitted(): bool
    {
        return in_array($this->status, [
            self::SUBMITTED,
            self::ALREADY_PENDING,
        ], true);
    }
}
