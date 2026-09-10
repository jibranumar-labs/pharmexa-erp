<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->foreignId('pharmacy_id')
                ->nullable()
                ->after('id')
                ->constrained('pharmacies')
                ->nullOnDelete();

            $table->index([
                'pharmacy_id',
                'expense_date',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropIndex([
                'pharmacy_id',
                'expense_date',
            ]);

            $table->dropForeign([
                'pharmacy_id',
            ]);

            $table->dropColumn('pharmacy_id');
        });
    }
};