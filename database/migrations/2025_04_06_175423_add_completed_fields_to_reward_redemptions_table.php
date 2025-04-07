<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('reward_redemptions', function (Blueprint $table) {
        $table->timestamp('completed_at')->nullable();
        $table->unsignedBigInteger('completed_by')->nullable();
        $table->foreign('completed_by')->references('id')->on('users');
    });
}

public function down()
{
    Schema::table('reward_redemptions', function (Blueprint $table) {
        $table->dropForeign(['completed_by']);
        $table->dropColumn(['completed_at', 'completed_by']);
    });
}
};
