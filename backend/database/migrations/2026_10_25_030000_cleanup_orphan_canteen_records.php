<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Remove unassigned duplicate categories & items
        DB::table('menu_items')->whereNull('canteen_id')->delete();
        DB::table('categories')->whereNull('canteen_id')->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Irreversible data cleanup
    }
};
