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
    Schema::create('recycling_records', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('material_id')->constrained();
        $table->integer('quantity');
        $table->string('location');
        $table->text('comments')->nullable();
        $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
        $table->integer('points_earned')->nullable();
        $table->string('ticket_number')->unique();
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recycling_records');
    }
};
