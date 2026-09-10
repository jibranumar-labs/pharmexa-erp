<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('traceability_transactions', function (Blueprint $table) {

            $table->id();

            $table->foreignId('pharmacy_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('sale_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->enum('operation', [
                'sale',
                'return',
                'cancel'
            ]);

            $table->enum('status', [
                'pending',
                'processing',
                'sent',
                'failed'
            ])->default('pending');

            // SFDA Notification ID
            $table->string('reference_number')->nullable();

            // 00000, 11043, etc.
            $table->string('response_code', 10)->nullable();

            $table->text('response_message')->nullable();

            $table->timestamp('sent_at')->nullable();

            // Optional but highly recommended
            $table->unsignedSmallInteger('retry_count')->default(0);

            $table->timestamps();

            $table->index('status');
            $table->index('reference_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('traceability_transactions');
    }
};