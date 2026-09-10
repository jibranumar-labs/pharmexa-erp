<?php

namespace App\Services;

use App\Models\Medicine;
use Illuminate\Database\Eloquent\Builder;

class GlobalMedicineIdentity
{
    /**
     * Normalize an identifier for comparison only.
     *
     * Spaces and hyphens are ignored so accidental formatting
     * differences do not create duplicate global products.
     *
     * Leading zeros are preserved. The value is never cast to int.
     */
    public function normalizeForComparison(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim((string) $value);
        $value = str_replace([' ', '-', "\t"], '', $value);

        return $value === '' ? null : $value;
    }

    /**
     * Normalize an identifier for storage.
     *
     * Matches the existing contribution convention: trim only.
     * The official stored value is not rewritten.
     */
    public function normalizeForStorage(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    public function findGlobalByGtin(?string $gtin): ?Medicine
    {
        $normalized = $this->normalizeForComparison($gtin);

        if ($normalized === null) {
            return null;
        }

        return $this->globalQuery()
            ->where(function (Builder $query) use ($normalized) {
                $this->whereNormalizedIdentifier($query, 'gtin', $normalized);
            })
            ->first();
    }

    public function findGlobalByBarcode(?string $barcode): ?Medicine
    {
        $normalized = $this->normalizeForComparison($barcode);

        if ($normalized === null) {
            return null;
        }

        return $this->globalQuery()
            ->where(function (Builder $query) use ($normalized) {
                $this->whereNormalizedIdentifier($query, 'barcode', $normalized);
            })
            ->first();
    }

    public function findGlobalDuplicate(?string $gtin, ?string $barcode): ?array
    {
        $existingByGtin = $this->findGlobalByGtin($gtin);

        if ($existingByGtin) {
            return [
                'match' => 'gtin',
                'medicine' => $existingByGtin,
            ];
        }

        $existingByBarcode = $this->findGlobalByBarcode($barcode);

        if ($existingByBarcode) {
            return [
                'match' => 'barcode',
                'medicine' => $existingByBarcode,
            ];
        }

        return null;
    }

    /**
     * Lock matching global rows during approval to reduce races.
     */
    public function findGlobalDuplicateForUpdate(?string $gtin, ?string $barcode): ?array
    {
        $normalizedGtin = $this->normalizeForComparison($gtin);
        $normalizedBarcode = $this->normalizeForComparison($barcode);

        if ($normalizedGtin !== null) {
            $existingByGtin = $this->globalQuery()
                ->lockForUpdate()
                ->where(function (Builder $query) use ($normalizedGtin) {
                    $this->whereNormalizedIdentifier($query, 'gtin', $normalizedGtin);
                })
                ->first();

            if ($existingByGtin) {
                return [
                    'match' => 'gtin',
                    'medicine' => $existingByGtin,
                ];
            }
        }

        if ($normalizedBarcode !== null) {
            $existingByBarcode = $this->globalQuery()
                ->lockForUpdate()
                ->where(function (Builder $query) use ($normalizedBarcode) {
                    $this->whereNormalizedIdentifier($query, 'barcode', $normalizedBarcode);
                })
                ->first();

            if ($existingByBarcode) {
                return [
                    'match' => 'barcode',
                    'medicine' => $existingByBarcode,
                ];
            }
        }

        return null;
    }

    protected function globalQuery(): Builder
    {
        return Medicine::query()->whereNull('pharmacy_id');
    }

    protected function whereNormalizedIdentifier(
        Builder $query,
        string $column,
        string $normalized
    ): void {
        $wrapped = $query->getGrammar()->wrap($column);

        $query->whereRaw(
            "REPLACE(REPLACE(REPLACE(COALESCE({$wrapped}, ''), ' ', ''), '-', ''), CHAR(9), '') = ?",
            [$normalized]
        );
    }
}
