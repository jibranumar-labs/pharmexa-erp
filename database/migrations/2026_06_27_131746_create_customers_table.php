<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {

            $table->id();

$table->foreignId('pharmacy_id')
    ->nullable()
    ->constrained()
    ->nullOnDelete();

$table->string('customer_code')->unique();

            $table->string('name');

            $table->string('phone')->nullable()->index();

            $table->string('email')->nullable();

            $table->enum('gender', [
                'Male',
                'Female',
                'Other'
            ])->default('Male');

            $table->date('date_of_birth')->nullable();

            $table->text('address')->nullable();

            $table->string('city')->nullable();

            $table->string('national_id')->nullable();

            $table->integer('loyalty_points')->default(0);

            $table->decimal('credit_limit',12,2)->default(0);

            $table->decimal('current_balance',12,2)->default(0);

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};