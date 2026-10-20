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
        Schema::create('canteens', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('slug', 150)->unique();
            $table->string('tagline', 255)->nullable();
            $table->string('logo_url', 500)->nullable();
            
            // Theming & Colors
            $table->string('primary_color', 30)->default('#062D1F');
            $table->string('secondary_color', 30)->default('#07402A');
            $table->string('accent_color', 30)->default('#E8C928');
            $table->string('bg_color', 30)->default('#F8F6F0');
            $table->string('theme_preset', 50)->default('emerald');

            // Dietary & Badges
            $table->string('dietary_type', 50)->default('pure_veg'); // pure_veg, veg_nonveg, jain_available, custom
            $table->string('pure_veg_label', 100)->default('100% Pure Vegetarian');

            // Location & Contact
            $table->text('address')->nullable();
            $table->string('location_landmark', 255)->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('whatsapp', 50)->nullable();
            $table->string('opening_hours', 255)->nullable();

            // Hero & Announcements
            $table->string('hero_heading', 255)->nullable();
            $table->text('hero_subheading')->nullable();
            $table->boolean('announcement_enabled')->default(false);
            $table->text('announcement_text')->nullable();

            // Discount & Honor
            $table->boolean('discount_badge_enabled')->default(true);
            $table->string('discount_badge_title', 100)->default('Armed Forces 10% Off');
            $table->text('discount_badge_text')->nullable();

            // Standee QR URL
            $table->string('qr_target_url', 500)->nullable();

            // Status
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);

            $table->timestamps();
        });

        // Add canteen_id to categories if not exists
        if (Schema::hasTable('categories') && !Schema::hasColumn('categories', 'canteen_id')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->foreignId('canteen_id')->nullable()->after('id')->constrained('canteens')->nullOnDelete();
            });
        }

        // Add canteen_id to menu_items if not exists
        if (Schema::hasTable('menu_items') && !Schema::hasColumn('menu_items', 'canteen_id')) {
            Schema::table('menu_items', function (Blueprint $table) {
                $table->foreignId('canteen_id')->nullable()->after('id')->constrained('canteens')->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('menu_items') && Schema::hasColumn('menu_items', 'canteen_id')) {
            Schema::table('menu_items', function (Blueprint $table) {
                $table->dropForeign(['canteen_id']);
                $table->dropColumn('canteen_id');
            });
        }

        if (Schema::hasTable('categories') && Schema::hasColumn('categories', 'canteen_id')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->dropForeign(['canteen_id']);
                $table->dropColumn('canteen_id');
            });
        }

        Schema::dropIfExists('canteens');
    }
};
