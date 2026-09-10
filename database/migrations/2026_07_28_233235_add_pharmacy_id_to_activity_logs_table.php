<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->foreignId('pharmacy_id')
                ->nullable()
                ->after('user_id')
                ->constrained('pharmacies')
                ->nullOnDelete();

            $table->index(['pharmacy_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropIndex(['pharmacy_id', 'created_at']);
            $table->dropConstrainedForeignId('pharmacy_id');
        });
    }
};