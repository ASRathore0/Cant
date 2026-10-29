<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Canteen;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\WhatsAppService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminOrderController extends Controller
{
    /**
     * Get orders for the manager's canteen with filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Order::with(['items', 'canteen:id,name,slug,phone,whatsapp,logo_url,address,location_landmark'])
            ->latest();

        // Scope to user's canteen if not super admin
        if ($user->role !== 'super_admin' && $user->canteen_id) {
            $query->where('canteen_id', $user->canteen_id);
        } elseif ($request->filled('canteen_id')) {
            $query->where('canteen_id', $request->input('canteen_id'));
        }

        // Filter by status
        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        // Filter by order type
        if ($request->filled('order_type') && $request->input('order_type') !== 'all') {
            $query->where('order_type', $request->input('order_type'));
        }

        // Search query
        if ($request->filled('search')) {
            $s = $request->input('search');
            $query->where(function ($q) use ($s) {
                $q->where('order_number', 'like', "%{$s}%")
                    ->orWhere('token_number', 'like', "%{$s}%")
                    ->orWhere('table_number', 'like', "%{$s}%")
                    ->orWhere('customer_name', 'like', "%{$s}%")
                    ->orWhere('customer_phone', 'like', "%{$s}%");
            });
        }

        // Date filter
        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->input('date'));
        } else {
            // By default show today's orders first or paginate
        }

        $orders = $query->paginate($request->input('per_page', 30));

        // Aggregate statistics for quick summary on POS header
        $statsCanteenId = ($user->role !== 'super_admin' && $user->canteen_id)
            ? $user->canteen_id
            : ($request->input('canteen_id') ?? null);

        $statsQuery = Order::whereDate('created_at', today());
        if ($statsCanteenId) {
            $statsQuery->where('canteen_id', $statsCanteenId);
        }

        $stats = [
            'total_today' => (clone $statsQuery)->count(),
            'pending_count' => (clone $statsQuery)->where('status', 'pending')->count(),
            'active_kitchen' => (clone $statsQuery)->whereIn('status', ['confirmed', 'preparing'])->count(),
            'today_sales' => (float) (clone $statsQuery)->where('payment_status', 'paid')->sum('total_amount'),
        ];

        return response()->json([
            'success' => true,
            'data' => $orders,
            'stats' => $stats,
        ]);
    }

    /**
     * Direct Counter POS Billing: Create & complete order with receipt.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'canteen_id' => 'nullable|integer|exists:canteens,id',
            'order_type' => 'required|in:dine_in,takeaway,delivery',
            'table_number' => 'nullable|string|max:50',
            'customer_name' => 'nullable|string|max:100',
            'customer_phone' => 'nullable|string|max:30',
            'payment_method' => 'required|in:cash,upi,card,online,unspecified',
            'payment_status' => 'nullable|in:paid,unpaid,partially_paid',
            'discount' => 'nullable|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
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

        $canteenId = ($user->role !== 'super_admin' && $user->canteen_id)
            ? $user->canteen_id
            : ($request->input('canteen_id') ?? $user->canteen_id ?? Canteen::first()?->id);

        $canteen = Canteen::find($canteenId);
        if (!$canteen) {
            return response()->json([
                'success' => false,
                'message' => 'Restaurant entity not found.',
            ], 404);
        }

        if (!$canteen->billing_enabled && $user->role !== 'super_admin') {
            return response()->json([
                'success' => false,
                'message' => 'Billing & POS features are currently disabled for this restaurant. Please contact Super Admin to activate.',
            ], 403);
        }

        return DB::transaction(function () use ($request, $canteen, $user) {
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

            $discount = (float) $request->input('discount', 0);
            $tax = (float) $request->input('tax', 0);
            $totalAmount = max(0, round($subtotal - $discount + $tax, 2));

            $paymentStatus = $request->input('payment_status', 'paid');
            $paymentMethod = $request->input('payment_method', 'cash');

            $order = Order::create([
                'canteen_id' => $canteen->id,
                'order_number' => $orderNumber,
                'token_number' => $tokenNumber,
                'order_type' => $request->input('order_type', 'dine_in'),
                'table_number' => $request->input('table_number'),
                'customer_name' => $request->input('customer_name'),
                'customer_phone' => $request->input('customer_phone'),
                'status' => 'completed',
                'payment_status' => $paymentStatus,
                'payment_method' => $paymentMethod,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'total_amount' => $totalAmount,
                'notes' => $request->input('notes'),
                'billed_by' => $user->name,
                'source' => 'counter_pos',
                'settled_at' => ($paymentStatus === 'paid') ? now() : null,
            ]);

            foreach ($itemsData as &$it) {
                $it['order_id'] = $order->id;
            }
            OrderItem::insert($itemsData);

            $order->load(['items', 'canteen']);

            // Auto-send WhatsApp bill if enabled and customer phone is provided
            $autoSendResult = null;
            if ($canteen->whatsapp_auto_send_enabled && !empty($order->customer_phone)) {
                $autoSendResult = WhatsAppService::sendBillViaCloudApi($order);
            }

            return response()->json([
                'success' => true,
                'message' => 'Bill created successfully! Ready for printing.',
                'data' => $order,
                'wa_me_url' => WhatsAppService::generateWaMeUrl($order),
                'receipt_url' => url("/receipt/{$order->order_number}"),
                'whatsapp_auto_sent' => $autoSendResult,
            ], 201);
        });
    }

    /**
     * Get order details.
     */
    public function show($id): JsonResponse
    {
        $order = Order::with(['items', 'canteen'])->find($id);
        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found.'], 404);
        }

        return response()->json(['success' => true, 'data' => $order]);
    }

    /**
     * Update order status or payment status.
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $order = Order::with(['items', 'canteen'])->find($id);
        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'nullable|in:pending,confirmed,preparing,ready,completed,cancelled',
            'payment_status' => 'nullable|in:unpaid,paid,partially_paid',
            'payment_method' => 'nullable|in:cash,upi,card,online,unspecified',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid status parameters.',
                'errors' => $validator->errors(),
            ], 422);
        }

        if ($request->filled('status')) {
            $order->status = $request->input('status');
        }

        if ($request->filled('payment_status')) {
            $order->payment_status = $request->input('payment_status');
            if ($order->payment_status === 'paid' && !$order->settled_at) {
                $order->settled_at = now();
            }
        }

        if ($request->filled('payment_method')) {
            $order->payment_method = $request->input('payment_method');
        }

        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully.',
            'data' => $order,
        ]);
    }

    /**
     * Formatted thermal receipt payload.
     */
    public function receipt($id): JsonResponse
    {
        $order = Order::with(['items', 'canteen'])->find($id);
        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found.'], 404);
        }

        $canteen = $order->canteen;
        $receiptUrl = url("/receipt/{$order->order_number}");

        return response()->json([
            'success' => true,
            'receipt' => [
                'canteen_name' => $canteen->name,
                'tagline' => $canteen->tagline,
                'address' => $canteen->address,
                'location_landmark' => $canteen->location_landmark,
                'phone' => $canteen->phone,
                'whatsapp' => $canteen->whatsapp,
                'pure_veg_label' => $canteen->pure_veg_label,
                'order_number' => $order->order_number,
                'token_number' => $order->token_number,
                'order_type' => ucfirst(str_replace('_', ' ', $order->order_type)),
                'table_number' => $order->table_number,
                'date' => $order->created_at->format('d-M-Y'),
                'time' => $order->created_at->format('h:i A'),
                'billed_by' => $order->billed_by ?? 'Cashier',
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'payment_method' => strtoupper($order->payment_method),
                'payment_status' => strtoupper($order->payment_status),
                'items' => $order->items->map(function ($it) {
                    return [
                        'name' => $it->item_name . ($it->variant ? " ({$it->variant})" : ''),
                        'qty' => $it->quantity,
                        'rate' => number_format($it->unit_price, 2),
                        'total' => number_format($it->total_price, 2),
                    ];
                }),
                'subtotal' => number_format($order->subtotal, 2),
                'discount' => number_format($order->discount, 2),
                'tax' => number_format($order->tax, 2),
                'total' => number_format($order->total_amount, 2),
                'notes' => $order->notes,
                'digital_ebill_enabled' => (bool) ($canteen->digital_ebill_enabled ?? true),
                'whatsapp_billing_enabled' => (bool) ($canteen->whatsapp_billing_enabled ?? true),
                'whatsapp_auto_send_enabled' => (bool) ($canteen->whatsapp_auto_send_enabled ?? false),
                'receipt_url' => $receiptUrl,
                'wa_me_url' => WhatsAppService::generateWaMeUrl($order, $receiptUrl),
                'whatsapp_text' => WhatsAppService::buildBillTextMessage($order, $receiptUrl),
            ],
        ]);
    }

    /**
     * Send or re-send WhatsApp bill message to customer.
     */
    public function sendWhatsApp(Request $request, $id): JsonResponse
    {
        $order = Order::with(['items', 'canteen'])->find($id);
        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found.'], 404);
        }

        if ($request->filled('customer_phone')) {
            $order->customer_phone = $request->input('customer_phone');
            $order->save();
        }

        $receiptUrl = url("/receipt/{$order->order_number}");
        $cloudApiResult = WhatsAppService::sendBillViaCloudApi($order, $receiptUrl);
        $waMeUrl = WhatsAppService::generateWaMeUrl($order, $receiptUrl);

        return response()->json([
            'success' => true,
            'message' => $cloudApiResult['success'] ? 'WhatsApp Bill notification sent successfully!' : 'WhatsApp direct link ready.',
            'wa_me_url' => $waMeUrl,
            'receipt_url' => $receiptUrl,
            'cloud_api_result' => $cloudApiResult,
        ]);
    }

    /**
     * Delete / Cancel an order.
     */
    public function destroy($id): JsonResponse
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found.'], 404);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully.',
        ]);
    }
}

