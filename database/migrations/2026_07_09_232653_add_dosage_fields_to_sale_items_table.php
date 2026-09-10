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
        Schema::table('sale_items', function (Blueprint $table) {

            $table->string('dosage')->nullable()->after('quantity');

            $table->string('time')->nullable()->after('dosage');

            $table->string('food')->nullable()->after('time');

            $table->string('duration')->nullable()->after('food');

            $table->text('notes')->nullable()->after('duration');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {

            $table->dropColumn([
                'dosage',
                'time',
                'food',
                'duration',
                'notes',
            ]);

        });
    }
};