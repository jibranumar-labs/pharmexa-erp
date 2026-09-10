<?php

namespace App\Exports;

use App\Models\SerializedInventory;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class SfdaStockMatchExport implements
    FromCollection,
    WithHeadings,
    WithColumnFormatting
{
    public function __construct(
        protected int $pharmacyId
    ) {
    }

    /**
     * Build the SFDA Stock Match data.
     *
     * Output:
     * GTIN | BN | Quantity
     */
    public function collection(): Collection
    {
        return SerializedInventory::query()
            ->where('pharmacy_id', $this->pharmacyId)
            ->where('status', 'available')
            ->whereNotNull('gtin')
            ->where('gtin', '!=', '')
            ->whereNotNull('batch_number')
            ->where('batch_number', '!=', '')
            ->select([
                'gtin',
                'batch_number',
            ])
            ->get()
            ->groupBy(function ($item) {
                return $item->gtin . '|' . $item->batch_number;
            })
            ->map(function (Collection $items) {
                $first = $items->first();

                return [
                    'gtin' => (string) $first->gtin,
                    'bn' => (string) $first->batch_number,
                    'quantity' => $items->count(),
                ];
            })
            ->values();
    }

    /**
     * Exact SFDA column headings.
     */
    public function headings(): array
    {
        return [
            'GTIN',
            'BN',
            'Quantity',
        ];
    }

    /**
     * GTIN must remain Text in Excel.
     */
    public function columnFormats(): array
    {
        return [
            'A' => NumberFormat::FORMAT_TEXT,
        ];
    }
}