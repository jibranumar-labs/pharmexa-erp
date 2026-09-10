<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Make barcode optional.
     *
     * Pharmexa allows products without a barcode.
     * GTIN and SKU are separate product identifiers.
     */
    public function up(): void
    {
        Schema::table('medicines', function (Blueprint $table) {
            $table->string('barcode')
                ->nullable()
                ->change();
        });

        Schema::table('pharmacy_medicines', function (Blueprint $table) {
            $table->string('barcode')
                ->nullable()
                ->change();
        });
    }

    /**
     * Restore barcode as required if this migration is rolled back.
     */
    public function down(): void
    {
        Schema::table('medicines', function (Blueprint $table) {
            $table->string('barcode')
                ->nullable(false)
                ->change();
        });

        Schema::table('pharmacy_medicines', function (Blueprint $table) {
            $table->string('barcode')
                ->nullable(false)
                ->change();
        });
    }
};