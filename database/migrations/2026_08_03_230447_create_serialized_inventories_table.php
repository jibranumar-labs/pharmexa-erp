<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('serialized_inventories', function (Blueprint $table) {

            $table->id();

            $table->foreignId('pharmacy_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('medicine_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('purchase_item_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignId('sale_item_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('gtin', 50);

            $table->string('serial_number')->unique();

            $table->string('batch_number');

            $table->date('expiry_date');

            $table->enum('status', [
                'available',
                'reserved',
                'sold',
                'returned',
                'expired',
            ])->default('available');

            $table->timestamp('sold_at')->nullable();

            $table->timestamps();

            $table->index([
                'medicine_id',
                'status',
            ]);

            $table->index([
                'batch_number',
            ]);

            $table->index([
                'expiry_date',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('serialized_inventories');
    }
};