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
        Schema::table('pharmacies', function (Blueprint $table) {
            $table->string('logo')->nullable()->after('country');
            $table->text('notes')->nullable()->after('status');
            $table->foreignId('owner_id')
                ->nullable()
                ->after('owner_name')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pharmacies', function (Blueprint $table) {
            $table->dropForeign(['owner_id']);
            $table->dropColumn(['logo', 'notes', 'owner_id']);
        });
    }
};
