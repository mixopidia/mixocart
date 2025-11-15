<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            if (!Schema::hasColumn('roles', 'permissions')) {
                $table->json('permissions')->nullable();
            }
            if (!Schema::hasColumn('roles', 'status')) {
                $table->boolean('status')->default(true);
            }
            if (!Schema::hasColumn('roles', 'description')) {
                $table->text('description')->nullable();
            }
            if (!Schema::hasColumn('roles', 'created_by')) {
                $table->unsignedBigInteger('created_by')->nullable();
            }
            if (!Schema::hasColumn('roles', 'updated_by')) {
                $table->unsignedBigInteger('updated_by')->nullable();
            }
            if (!Schema::hasColumn('roles', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn(['permissions', 'status', 'description', 'created_by', 'updated_by', 'deleted_at']);
        });
    }
};