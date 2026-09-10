<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('traceability_transaction_items', function (Blueprint $table) {

            $table->id();

            $table->unsignedBigInteger('traceability_transaction_id');
            $table->unsignedBigInteger('sale_item_id')->nullable();
            $table->unsignedBigInteger('medicine_id');

            // GS1 Data
            $table->string('gtin', 14);
            $table->string('serial_number', 100);
            $table->string('batch_number', 100);
            $table->date('expiry_date');

            $table->unsignedInteger('quantity')->default(1);

            $table->enum('status', [
                'pending',
                'sent',
                'failed',
            ])->default('pending');

            $table->string('response_code', 10)->nullable();

            $table->text('response_message')->nullable();

            $table->timestamps();

            // Foreign Keys (short names for MySQL)
            $table->foreign(
                'traceability_transaction_id',
                'tti_transaction_fk'
            )->references('id')
             ->on('traceability_transactions')
             ->cascadeOnDelete();

            $table->foreign(
                'sale_item_id',
                'tti_sale_item_fk'
            )->references('id')
             ->on('sale_items')
             ->nullOnDelete();

            $table->foreign(
                'medicine_id',
                'tti_medicine_fk'
            )->references('id')
             ->on('medicines')
             ->cascadeOnDelete();

            // Indexes
            $table->index('gtin');
            $table->index('serial_number');
            $table->index('batch_number');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('traceability_transaction_items');
    }
};