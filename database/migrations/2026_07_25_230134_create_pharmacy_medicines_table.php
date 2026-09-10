<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pharmacy_medicines', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Pharmacy + Master Medicine
            |--------------------------------------------------------------------------
            */

            $table->foreignId('pharmacy_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('medicine_id')
                ->constrained()
                ->cascadeOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Pharmacy Specific Product Information
            |--------------------------------------------------------------------------
            |
            | Nullable means:
            | if the pharmacy has not changed the value, we can use the value
            | from the global medicines table.
            |
            */

            $table->string('barcode')->nullable();
            $table->string('sku')->nullable();

            $table->string('name')->nullable();
            $table->string('generic_name')->nullable();
            $table->string('brand_name')->nullable();
            $table->string('medicine_type')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Pharmacy Inventory / Pricing
            |--------------------------------------------------------------------------
            */

            $table->foreignId('supplier_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->decimal('purchase_price', 12, 2)->nullable();
            $table->decimal('selling_price', 12, 2)->nullable();
            $table->decimal('tax_percentage', 5, 2)->default(0);

            $table->integer('stock_quantity')->default(0);
            $table->integer('minimum_stock')->default(10);

            /*
            |--------------------------------------------------------------------------
            | Batch / Expiry
            |--------------------------------------------------------------------------
            */

            $table->string('batch_number')->nullable();
            $table->date('expiry_date')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Local Customisation
            |--------------------------------------------------------------------------
            */

            $table->text('description')->nullable();
            $table->string('image')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            |
            | Allows one pharmacy to hide/remove a global product without
            | deleting the master medicine.
            |
            */

            $table->boolean('is_active')->default(true);

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Constraints
            |--------------------------------------------------------------------------
            */

            $table->unique(
                ['pharmacy_id', 'medicine_id'],
                'pharmacy_medicine_unique'
            );

            $table->unique(
                ['pharmacy_id', 'barcode'],
                'pharmacy_medicine_barcode_unique'
            );

            $table->unique(
                ['pharmacy_id', 'sku'],
                'pharmacy_medicine_sku_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharmacy_medicines');
    }
};