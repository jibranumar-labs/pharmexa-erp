<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->foreignId('pharmacy_id')
                ->nullable()
                ->after('id')
                ->constrained('pharmacies')
                ->cascadeOnDelete();

            $table->unique(
                'pharmacy_id',
                'settings_pharmacy_id_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropUnique('settings_pharmacy_id_unique');
            $table->dropConstrainedForeignId('pharmacy_id');
        });
    }
};