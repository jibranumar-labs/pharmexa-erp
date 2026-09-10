<?php

namespace App\Exceptions;

use App\Models\Medicine;
use RuntimeException;

class DuplicateGlobalMedicineException extends RuntimeException
{
    public function __construct(
        public string $matchType,
        public ?Medicine $existingMedicine = null,
        string $message = ''
    ) {
        parent::__construct(
            $message !== ''
                ? $message
                : $this->defaultMessage()
        );
    }

    protected function defaultMessage(): string
    {
        $existingName = $this->existingMedicine?->name;

        if ($this->matchType === 'gtin') {
            return $existingName
                ? "Product already exists in the Global Catalogue ({$existingName})."
                : 'Product already exists in the Global Catalogue.';
        }

        return $existingName
            ? "Barcode already exists in the Global Catalogue ({$existingName})."
            : 'Barcode already exists in the Global Catalogue.';
    }
}
