<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicine_serials', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pharmacy_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('medicine_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('gtin', 14);
            $table->string('serial_number')->unique();
            $table->string('batch_number');
            $table->date('expiry_date');

            $table->enum('status', [
                'in_stock',
                'sold',
                'returned',
                'cancelled',
                'expired'
            ])->default('in_stock');

            $table->foreignId('purchase_item_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignId('sale_item_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->timestamps();

            $table->index('gtin');
            $table->index('batch_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicine_serials');
    }
};