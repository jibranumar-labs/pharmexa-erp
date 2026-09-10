<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('medicines', function (Blueprint $table) {

            // GS1 GTIN (AI 01)
            $table->string('gtin', 14)
                ->nullable()
                ->after('barcode');

            // GS1 Serial Number (AI 21)
            $table->string('serial_number')
                ->nullable()
                ->after('expiry_date');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medicines', function (Blueprint $table) {
            $table->dropColumn([
                'gtin',
                'serial_number',
            ]);
        });
    }
};