<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('daily_cash_records', function (Blueprint $table) {
            if (!Schema::hasColumn('daily_cash_records', 'total_sales')) {
                $table->decimal('total_sales', 14, 2)
                    ->default(0)
                    ->after('other_sales');
            }

            if (!Schema::hasColumn('daily_cash_records', 'physical_cash')) {
                $table->decimal('physical_cash', 14, 2)
                    ->default(0)
                    ->after('expenses');
            }

            if (!Schema::hasColumn('daily_cash_records', 'physical_shabaka')) {
                $table->decimal('physical_shabaka', 14, 2)
                    ->default(0)
                    ->after('physical_cash');
            }

            if (!Schema::hasColumn('daily_cash_records', 'physical_others')) {
                $table->decimal('physical_others', 14, 2)
                    ->default(0)
                    ->after('physical_shabaka');
            }

            if (!Schema::hasColumn('daily_cash_records', 'net_cash')) {
                $table->decimal('net_cash', 14, 2)
                    ->default(0)
                    ->after('physical_others');
            }
        });
    }

    public function down(): void
    {
        Schema::table('daily_cash_records', function (Blueprint $table) {
            $columns = [
                'total_sales',
                'physical_cash',
                'physical_shabaka',
                'physical_others',
                'net_cash',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('daily_cash_records', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};