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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('canteen_id')->constrained('canteens')->cascadeOnDelete();
            $table->string('order_number', 50)->unique();
            $table->string('token_number', 20)->nullable();
            $table->enum('order_type', ['dine_in', 'takeaway', 'delivery'])->default('dine_in');
            $table->string('table_number', 50)->nullable();
            $table->string('customer_name', 100)->nullable();
            $table->string('customer_phone', 30)->nullable();
            $table->enum('status', ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'])->default('pending');
            $table->enum('payment_status', ['unpaid', 'paid', 'partially_paid'])->default('unpaid');
            $table->enum('payment_method', ['cash', 'upi', 'card', 'online', 'unspecified'])->default('unspecified');
            $table->decimal('subtotal', 10, 2)->default(0.00);
            $table->decimal('discount', 10, 2)->default(0.00);
            $table->decimal('tax', 10, 2)->default(0.00);
            $table->decimal('total_amount', 10, 2)->default(0.00);
            $table->text('notes')->nullable();
            $table->string('billed_by', 100)->nullable();
            $table->string('source', 30)->default('qr_customer'); // 'qr_customer' or 'counter_pos'
            $table->timestamp('settled_at')->nullable();
            $table->timestamps();

            $table->index(['canteen_id', 'status']);
            $table->index(['canteen_id', 'created_at']);
            $table->index('order_number');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('menu_item_id')->nullable()->constrained('menu_items')->nullOnDelete();
            $table->string('item_name', 150);
            $table->string('variant', 50)->nullable(); // e.g. 'Half', 'Full', '1 Pc'
            $table->decimal('unit_price', 10, 2)->default(0.00);
            $table->integer('quantity')->default(1);
            $table->decimal('total_price', 10, 2)->default(0.00);
            $table->string('notes', 255)->nullable();
            $table->timestamps();

            $table->index('order_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
