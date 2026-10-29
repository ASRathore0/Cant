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
        Schema::table('canteens', function (Blueprint $table) {
            $table->boolean('digital_ebill_enabled')->default(true)->after('billing_enabled');
            $table->boolean('whatsapp_billing_enabled')->default(true)->after('digital_ebill_enabled');
            $table->boolean('whatsapp_auto_send_enabled')->default(false)->after('whatsapp_billing_enabled');
            $table->string('whatsapp_api_phone_id', 100)->nullable()->after('whatsapp_auto_send_enabled');
            $table->text('whatsapp_api_token')->nullable()->after('whatsapp_api_phone_id');
            $table->string('whatsapp_api_template', 100)->nullable()->after('whatsapp_api_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('canteens', function (Blueprint $table) {
            $table->dropColumn([
                'digital_ebill_enabled',
                'whatsapp_billing_enabled',
                'whatsapp_auto_send_enabled',
                'whatsapp_api_phone_id',
                'whatsapp_api_token',
                'whatsapp_api_template',
            ]);
        });
    }
};
