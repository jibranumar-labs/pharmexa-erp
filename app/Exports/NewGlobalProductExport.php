<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\DefaultValueBinder;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class NewGlobalProductExport extends DefaultValueBinder implements
    FromArray,
    WithHeadings,
    WithColumnFormatting,
    WithCustomValueBinder,
    ShouldAutoSize
{
    public function __construct(
        protected string $gtin,
        protected string $barcode,
        protected string $name
    ) {
    }

    public function array(): array
    {
        return [
            [
                (string) $this->gtin,
                (string) $this->barcode,
                (string) $this->name,
            ],
        ];
    }

    public function headings(): array
    {
        return [
            'GTIN',
            'Barcode',
            'Product Name',
        ];
    }

    public function columnFormats(): array
    {
        return [
            'A' => NumberFormat::FORMAT_TEXT,
            'B' => NumberFormat::FORMAT_TEXT,
            'C' => NumberFormat::FORMAT_TEXT,
        ];
    }

    public function bindValue(Cell $cell, $value): bool
    {
        $cell->setValueExplicit(
            (string) $value,
            DataType::TYPE_STRING
        );

        return true;
    }
}
