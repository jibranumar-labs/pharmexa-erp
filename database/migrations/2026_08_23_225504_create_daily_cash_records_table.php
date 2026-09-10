<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('daily_cash_records', function (Blueprint $table) {
            $table->foreignId('pharmacy_id')
                ->after('id')
                ->constrained()
                ->cascadeOnDelete();

            $table->date('record_date')
                ->after('pharmacy_id');

            $table->decimal('opening_cash', 12, 2)
                ->default(0)
                ->after('record_date');

            $table->decimal('cash_sales', 12, 2)
                ->default(0)
                ->after('opening_cash');

            $table->decimal('shabaka_sales', 12, 2)
                ->default(0)
                ->after('cash_sales');

            $table->decimal('other_sales', 12, 2)
                ->default(0)
                ->after('shabaka_sales');

            $table->decimal('other_cash', 12, 2)
                ->default(0)
                ->after('other_sales');

            $table->decimal('total_sales', 12, 2)
                ->default(0)
                ->after('other_cash');

            $table->decimal('expenses', 12, 2)
                ->default(0)
                ->after('total_sales');

            $table->decimal('net_cash', 12, 2)
                ->default(0)
                ->after('expenses');

            $table->decimal('physical_cash', 12, 2)
                ->default(0)
                ->after('net_cash');

            $table->decimal('physical_shabaka', 12, 2)
                ->default(0)
                ->after('physical_cash');

            $table->decimal('physical_others', 12, 2)
                ->default(0)
                ->after('physical_shabaka');

            $table->decimal('cash_difference', 12, 2)
                ->default(0)
                ->after('physical_others');

            $table->decimal('shabaka_difference', 12, 2)
                ->default(0)
                ->after('cash_difference');

            $table->decimal('other_difference', 12, 2)
                ->default(0)
                ->after('shabaka_difference');

            $table->decimal('closing_cash', 12, 2)
                ->default(0)
                ->after('other_difference');

            $table->text('notes')
                ->nullable()
                ->after('closing_cash');

            $table->foreignId('user_id')
                ->nullable()
                ->after('notes')
                ->constrained()
                ->nullOnDelete();

            $table->unique(
                ['pharmacy_id', 'record_date'],
                'daily_cash_pharmacy_date_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('daily_cash_records', function (Blueprint $table) {
            $table->dropForeign(['pharmacy_id']);
            $table->dropForeign(['user_id']);

            $table->dropUnique('daily_cash_pharmacy_date_unique');

            $table->dropColumn([
                'pharmacy_id',
                'record_date',
                'opening_cash',
                'cash_sales',
                'shabaka_sales',
                'other_sales',
                'other_cash',
                'total_sales',
                'expenses',
                'net_cash',
                'physical_cash',
                'physical_shabaka',
                'physical_others',
                'cash_difference',
                'shabaka_difference',
                'other_difference',
                'closing_cash',
                'notes',
                'user_id',
            ]);
        });
    }
};