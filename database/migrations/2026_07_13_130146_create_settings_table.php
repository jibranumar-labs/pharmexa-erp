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
        Schema::create('settings', function (Blueprint $table) {

            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Pharmacy Information
            |--------------------------------------------------------------------------
            */

            $table->string('pharmacy_name')->default('PHARMEXA');
            $table->string('pharmacy_name_ar')->default('صيدلية فارمكسا');

            $table->string('branch_name')->nullable();
            $table->string('branch_name_ar')->nullable();

            $table->string('owner_name')->nullable();
            $table->string('pharmacist_name')->nullable();

            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable();

            $table->string('website')->nullable();
            $table->string('slogan')->nullable();
$table->string('slogan_ar')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Address
            |--------------------------------------------------------------------------
            */

            $table->string('address')->nullable();
            $table->string('address_ar')->nullable();

            $table->string('city')->default('Riyadh');
            $table->string('country')->default('Saudi Arabia');

            /*
            |--------------------------------------------------------------------------
            | Saudi Legal Information
            |--------------------------------------------------------------------------
            */

            $table->string('vat_number')->nullable();
            $table->decimal('tax_percentage', 5, 2)->default(15.00);

            $table->string('commercial_registration')->nullable();

            $table->string('pharmacy_license')->nullable();
$table->string('zatca_qr')->nullable();
            /*
            |--------------------------------------------------------------------------
            | Receipt Settings
            |--------------------------------------------------------------------------
            */

            $table->enum('receipt_size', [
                '58',
                '80',
            ])->default('80');
            $table->string('default_printer')->nullable();

            $table->boolean('auto_print_receipt')->default(true);

            $table->boolean('auto_print_sticker')->default(false);

            $table->boolean('show_logo')->default(true);

            $table->boolean('show_barcode')->default(true);

            $table->boolean('show_qr')->default(true);

            $table->boolean('show_pharmacist')->default(true);
            $table->boolean('show_patient_name')->default(true);
$table->boolean('show_expiry_date')->default(true);
$table->boolean('show_sticker_logo')->default(false);
            /*
            |--------------------------------------------------------------------------
            | Regional
            |--------------------------------------------------------------------------
            */

            $table->string('currency')->default('SAR');
            $table->string('currency_symbol')->default('SAR');

            $table->string('timezone')->default('Asia/Riyadh');

            $table->string('language')->default('en');

            /*
            |--------------------------------------------------------------------------
            | Branding
            |--------------------------------------------------------------------------
            */

            $table->string('logo')->nullable();

            $table->string('favicon')->nullable();
            $table->text('receipt_header')->nullable();
            $table->text('receipt_header_ar')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Footer
            |--------------------------------------------------------------------------
            */

            $table->text('receipt_footer')->nullable();

            $table->text('receipt_footer_ar')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};