<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the foundation for the automatic Global Medicine
     * Contribution + Update History system.
     *
     * This migration does NOT change the existing medicines table.
     */
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Global Medicine Contributions
        |--------------------------------------------------------------------------
        |
        | Pharmacies can submit:
        | 1. A correction to an existing global medicine.
        | 2. A newly discovered medicine that is not yet global.
        |
        | Contributions are kept separate from the master catalogue so that
        | one incorrect pharmacy entry can never directly overwrite global data.
        |
        */
        Schema::create('global_medicine_contributions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pharmacy_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('medicine_id')
                ->nullable()
                ->constrained('medicines')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Contribution Source
            |--------------------------------------------------------------------------
            */
            $table->string('source', 30)
                ->default('manual');

            /*
            |--------------------------------------------------------------------------
            | What is being contributed?
            |--------------------------------------------------------------------------
            |
            | correction = correction to an existing global medicine
            | new_medicine = pharmacy discovered a medicine not in the catalogue
            |
            */
            $table->string('contribution_type', 30);

            /*
            |--------------------------------------------------------------------------
            | Changed Field
            |--------------------------------------------------------------------------
            |
            | Examples:
            | gtin, barcode, name, generic_name, brand_name,
            | manufacturer_id, category_id, etc.
            |
            */
            $table->string('field_name')->nullable();

            $table->text('old_value')->nullable();
            $table->text('proposed_value')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Complete Candidate Data
            |--------------------------------------------------------------------------
            |
            | Used especially for a newly discovered medicine.
            | This lets us store the complete pharmacy submission without
            | creating a global master record immediately.
            |
            */
            $table->json('payload')->nullable();

            /*
            |--------------------------------------------------------------------------
            | GS1 Evidence
            |--------------------------------------------------------------------------
            */
            $table->text('raw_gs1_data')->nullable();

            $table->string('gtin', 14)->nullable();
            $table->string('barcode')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Confidence / Verification
            |--------------------------------------------------------------------------
            */
            $table->decimal('confidence_score', 5, 2)
                ->default(0);

            $table->string('status', 30)
                ->default('pending');

            $table->foreignId('reviewed_by')
                ->nullable()
                ->constrained('users')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->timestamp('reviewed_at')->nullable();

            $table->text('review_note')->nullable();

            $table->timestamps();

            $table->index(['medicine_id', 'status']);
            $table->index(['pharmacy_id', 'status']);
            $table->index(['gtin', 'status']);
            $table->index(['contribution_type', 'status']);
        });

        /*
        |--------------------------------------------------------------------------
        | Global Medicine Update History
        |--------------------------------------------------------------------------
        |
        | Every approved change to the global catalogue receives a permanent
        | version record.
        |
        | Later, the nightly pharmacy sync will use these versions to determine
        | what each pharmacy needs to receive.
        |
        */
        Schema::create('global_medicine_updates', function (Blueprint $table) {
            $table->id();

            $table->foreignId('medicine_id')
                ->constrained('medicines')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->unsignedBigInteger('version')
                ->default(1);

            $table->foreignId('contribution_id')
                ->nullable()
                ->constrained('global_medicine_contributions')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreignId('changed_by')
                ->nullable()
                ->constrained('users')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Change Details
            |--------------------------------------------------------------------------
            |
            | Example:
            |
            | {
            |     "gtin": {
            |         "old": "wrong",
            |         "new": "06286434001187"
            |     },
            |     "barcode": {
            |         "old": "wrong",
            |         "new": "06286434001187"
            |     }
            | }
            |
            */
            $table->json('changes');

            $table->string('source', 30)
                ->default('manual');

            $table->string('status', 30)
                ->default('published');

            $table->timestamp('published_at')->nullable();

            $table->timestamps();

            $table->unique(['medicine_id', 'version']);

            $table->index(['medicine_id', 'status']);
            $table->index('published_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('global_medicine_updates');
        Schema::dropIfExists('global_medicine_contributions');
    }
};
