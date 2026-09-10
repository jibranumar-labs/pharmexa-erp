<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add GS1 GTIN to pharmacy-specific medicine records.
     *
     * A pharmacy may inherit the GTIN from the global medicine,
     * while still having its own stored value when synchronized.
     */
    public function up(): void
    {
        Schema::table('pharmacy_medicines', function (Blueprint $table) {
            $table->string('gtin', 14)
                ->nullable()
                ->after('barcode');

            $table->index('gtin', 'pharmacy_medicines_gtin_index');
        });
    }

    /**
     * Reverse the migration.
     */
    public function down(): void
    {
        Schema::table('pharmacy_medicines', function (Blueprint $table) {
            $table->dropIndex('pharmacy_medicines_gtin_index');
            $table->dropColumn('gtin');
        });
    }
};