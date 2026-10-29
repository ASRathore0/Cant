<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Canteen;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PublicOrderController extends Controller
{
    /**
     * Place a new customer order (via QR Menu).
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'canteen_id' => 'nullable|integer|exists:canteens,id',
            'canteen_slug' => 'nullable|string',
            'order_type' => 'required|in:dine_in,takeaway,delivery',
            'table_number' => 'nullable|string|max:50',
            'customer_name' => 'nullable|string|max:100',
            'customer_phone' => 'nullable|string|max:30',
            'notes' => 'nullable|string|max:500',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'nullable|integer|exists:menu_items,id',
            'items.*.name' => 'required|string|max:150',
            'items.*.variant' => 'nullable|string|max:50',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please provide valid order details.',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Resolve canteen
        $canteen = null;
        if ($request->filled('canteen_id')) {
            $canteen = Canteen::find($request->input('canteen_id'));
        } elseif ($request->filled('canteen_slug')) {
            $canteen = Canteen::where('slug', $request->input('canteen_slug'))->first();
        }

        if (!$canteen) {
            $canteen = Canteen::where('is_default', true)->first() ?? Canteen::first();
        }

        if (!$canteen) {
            return response()->json([
                'success' => false,
                'message' => 'Canteen / Restaurant not found.',
            ], 404);
        }

        if (!$canteen->billing_enabled) {
            return response()->json([
                'success' => false,
                'message' => 'Online ordering & billing are currently disabled for this restaurant.',
            ], 403);
        }

        return DB::transaction(function () use ($request, $canteen) {
            $orderNumber = Order::generateOrderNumber($canteen->id);
            $tokenNumber = Order::generateTokenNumber($canteen->id);

            $subtotal = 0;
            $itemsData = [];

            foreach ($request->input('items') as $item) {
                $qty = (int) $item['quantity'];
                $unitPrice = (float) $item['unit_price'];
                $lineTotal = round($qty * $unitPrice, 2);
                $subtotal += $lineTotal;

                $itemsData[] = [
                    'menu_item_id' => $item['menu_item_id'] ?? null,
                    'item_name' => $item['name'],
                    'variant' => $item['variant'] ?? null,
                    'unit_price' => $unitPrice,
                    'quantity' => $qty,
                    'total_price' => $lineTotal,
                    'notes' => $item['notes'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            $discount = 0.00;
            $tax = 0.00;
            $totalAmount = max(0, $subtotal - $discount + $tax);

            $order = Order::create([
                'canteen_id' => $canteen->id,
                'order_number' => $orderNumber,
                'token_number' => $tokenNumber,
                'order_type' => $request->input('order_type', 'dine_in'),
                'table_number' => $request->input('table_number'),
                'customer_name' => $request->input('customer_name'),
                'customer_phone' => $request->input('customer_phone'),
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'payment_method' => $request->input('payment_method', 'unspecified'),
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'total_amount' => $totalAmount,
                'notes' => $request->input('notes'),
                'source' => 'qr_customer',
            ]);

            foreach ($itemsData as &$it) {
                $it['order_id'] = $order->id;
            }
            OrderItem::insert($itemsData);

            $order->load(['items', 'canteen:id,name,slug,phone,whatsapp,logo_url,address,location_landmark']);

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully! The counter has been notified.',
                'data' => $order,
            ], 201);
        });
    }

    /**
     * Track customer order by order_number.
     */
    public function show(string $orderNumber): JsonResponse
    {
        $order = Order::with(['items', 'canteen:id,name,slug,phone,whatsapp,logo_url,address,location_landmark,tagline,pure_veg_label,primary_color,secondary_color,accent_color,digital_ebill_enabled,whatsapp_billing_enabled'])
            ->where('order_number', $orderNumber)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order receipt not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }
}

