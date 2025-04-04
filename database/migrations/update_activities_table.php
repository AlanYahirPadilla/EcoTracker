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
        Schema::table('activities', function (Blueprint $table) {
            // Añadir nuevos campos manteniendo la estructura original
            $table->string('title')->after('id')->nullable();
            $table->integer('points_reward')->default(0)->after('description');
            $table->string('image_path')->nullable()->after('points_reward');
        });

        // Crear tabla pivote para usuarios que participan en actividades
        if (!Schema::hasTable('activity_user')) {
            Schema::create('activity_user', function (Blueprint $table) {
                $table->id();
                $table->foreignId('activity_id')->constrained()->onDelete('cascade');
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('status')->default('registered'); // registered, attended, cancelled
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->dropColumn(['title', 'points_reward', 'image_path']);
        });

        Schema::dropIfExists('activity_user');
    }
};

