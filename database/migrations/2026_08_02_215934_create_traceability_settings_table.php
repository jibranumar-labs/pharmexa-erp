<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('traceability_settings', function (Blueprint $table) {

            $table->id();

            $table->foreignId('pharmacy_id')
                ->constrained()
                ->cascadeOnDelete()
                ->unique();

            $table->boolean('enabled')->default(false);

            $table->enum('environment', [
                'sandbox',
                'production'
            ])->default('sandbox');

            $table->string('gln', 20)->nullable();

            $table->string('username')->nullable();

            $table->text('password')->nullable();

            $table->string('certificate_path')->nullable();

            $table->string('certificate_password')->nullable();

            $table->string('api_endpoint')->nullable();

            $table->string('drug_endpoint')->nullable();

            $table->boolean('is_connected')->default(false);

            $table->timestamp('last_connection_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('traceability_settings');
    }
};