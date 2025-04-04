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
        if (!Schema::hasColumn('materials', 'weight_per_unit')) {
            Schema::table('materials', function (Blueprint $table) {
                $table->float('weight_per_unit')->default(0.1)->after('points_per_unit');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('materials', function (Blueprint $table) {
            if (Schema::hasColumn('materials', 'weight_per_unit')) {
                $table->dropColumn('weight_per_unit');
            }
        });
    }
};

