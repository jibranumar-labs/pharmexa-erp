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
    Schema::create('medicines', function (Blueprint $table) {

        $table->id();

       // Basic Information

$table->string('barcode')->unique();

$table->string('sku')->unique();

$table->string('name');

$table->string('generic_name')->nullable();

$table->string('brand_name')->nullable();

$table->enum('medicine_type', [
    'Tablet',
    'Capsule',
    'Syrup',
    'Injection',
    'Cream',
    'Drops',
    'Powder',
    'Other',
])->default('Tablet');

        // Relationships
        $table->foreignId('category_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
        $table->foreignId('manufacturer_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
        $table->foreignId('supplier_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
        $table->foreignId('unit_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();

        // Pricing
        $table->decimal('purchase_price', 10, 2);
        $table->decimal('selling_price', 10, 2);
        $table->decimal('tax_percentage', 5, 2)->default(0);

        // Stock
        $table->integer('stock_quantity')->default(0);
        $table->integer('minimum_stock')->default(10);

        // Batch & Expiry
        $table->string('batch_number')->nullable();
        $table->date('expiry_date')->nullable();

        // Extra
        $table->text('description')->nullable();
        $table->string('image')->nullable();

        // Status
        $table->boolean('is_active')->default(true);

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
