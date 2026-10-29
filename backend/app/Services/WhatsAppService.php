<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    /**
     * Build formatted bill receipt text message for WhatsApp.
     */
    public static function buildBillTextMessage(Order $order, ?string $receiptUrl = null): string
    {
        $canteen = $order->canteen;
        $canteenName = $canteen ? $canteen->name : 'Restaurant';
        
        $lines = [];
        $lines[] = "🧾 *BILL RECEIPT* - *{$canteenName}*";
        if ($canteen && !empty($canteen->tagline)) {
            $lines[] = "_{$canteen->tagline}_";
        }
        $lines[] = "━━━━━━━━━━━━━━━━━━━━";
        $lines[] = "🔢 *Token #*: *" . ($order->token_number ?? 'N/A') . "*";
        $lines[] = "📄 *Order #*: #" . $order->order_number;
        $lines[] = "📅 *Date*: " . ($order->created_at ? $order->created_at->format('d M Y, h:i A') : date('d M Y, h:i A'));
        
        if (!empty($order->table_number)) {
            $lines[] = "🪑 *Table*: " . $order->table_number;
        } else {
            $lines[] = "🛍️ *Type*: " . ucfirst(str_replace('_', ' ', $order->order_type ?? 'Takeaway'));
        }
        
        if (!empty($order->customer_name)) {
            $lines[] = "👤 *Customer*: " . $order->customer_name;
        }
        $lines[] = "────────────────────";
        $lines[] = "*ORDER ITEMS:*";
        
        foreach ($order->items as $item) {
            $variant = $item->variant ?? $item->portion_name ?? '';
            $portionText = !empty($variant) ? " ({$variant})" : '';
            $price = $item->total_price ?? $item->subtotal ?? ($item->unit_price * $item->quantity);
            $subtotalFormatted = number_format((float) $price, 2);
            $lines[] = "• {$item->quantity}x {$item->item_name}{$portionText} - ₹{$subtotalFormatted}";
        }
        
        $lines[] = "────────────────────";
        $lines[] = "Subtotal: ₹" . number_format((float) $order->subtotal, 2);
        
        $discount = (float) ($order->discount ?? $order->discount_amount ?? 0);
        $tax = (float) ($order->tax ?? $order->tax_amount ?? 0);
        $finalTotal = (float) ($order->total_amount ?? $order->final_total ?? $order->subtotal);

        if ($discount > 0) {
            $lines[] = "Discount: -₹" . number_format($discount, 2);
        }
        if ($tax > 0) {
            $lines[] = "Tax / GST: ₹" . number_format($tax, 2);
        }
        
        $lines[] = "*TOTAL PAID*: *₹" . number_format($finalTotal, 2) . "*";
        $lines[] = "Payment Mode: " . strtoupper($order->payment_method ?? 'CASH') . " (" . strtoupper($order->payment_status ?? 'PAID') . ")";
        
        // Include digital e-bill URL if available or enabled
        if ($receiptUrl || ($canteen && $canteen->digital_ebill_enabled)) {
            $url = $receiptUrl ?: url("/receipt/{$order->order_number}");
            $lines[] = "━━━━━━━━━━━━━━━━━━━━";
            $lines[] = "🌐 *View / Download Digital E-Bill Receipt*:";
            $lines[] = $url;
        }
        
        $lines[] = "━━━━━━━━━━━━━━━━━━━━";
        $lines[] = "🙏 Thank you for dining with us! Visit again. ✨";
        
        return implode("\n", $lines);
    }

    /**
     * Sanitize phone number to international WhatsApp format (defaulting to India country code 91 if 10 digits).
     */
    public static function sanitizePhoneNumber(?string $phone): ?string
    {
        if (empty($phone)) {
            return null;
        }
        
        // Remove non-digit characters except leading +
        $digits = preg_replace('/[^\d]/', '', $phone);
        if (empty($digits)) {
            return null;
        }
        
        // If 10 digits, assume India (+91)
        if (strlen($digits) === 10) {
            return '91' . $digits;
        }
        
        // If 11 digits and starts with 0, replace 0 with 91
        if (strlen($digits) === 11 && str_starts_with($digits, '0')) {
            return '91' . substr($digits, 1);
        }
        
        return $digits;
    }

    /**
     * Generate free 1-click direct WhatsApp wa.me URL for Cashier / POS.
     */
    public static function generateWaMeUrl(Order $order, ?string $receiptUrl = null): ?string
    {
        $phone = self::sanitizePhoneNumber($order->customer_phone);
        $message = self::buildBillTextMessage($order, $receiptUrl);
        $encodedMessage = urlencode($message);
        
        if (!empty($phone)) {
            return "https://wa.me/{$phone}?text={$encodedMessage}";
        }
        
        return "https://wa.me/?text={$encodedMessage}";
    }

    /**
     * Send Bill automatically via WhatsApp Cloud API if credentials configured.
     */
    public static function sendBillViaCloudApi(Order $order, ?string $receiptUrl = null): array
    {
        $canteen = $order->canteen;
        if (!$canteen) {
            return ['success' => false, 'error' => 'Canteen not found for order.'];
        }

        if (!$canteen->whatsapp_auto_send_enabled) {
            return ['success' => false, 'error' => 'WhatsApp auto-send is not enabled for this establishment.'];
        }

        $phone = self::sanitizePhoneNumber($order->customer_phone);
        if (empty($phone)) {
            return ['success' => false, 'error' => 'Customer phone number is missing or invalid.'];
        }

        $phoneId = trim($canteen->whatsapp_api_phone_id ?? '');
        $token = trim($canteen->whatsapp_api_token ?? '');

        if (empty($phoneId) || empty($token)) {
            Log::info("WhatsApp Auto-Send skipped for Order #{$order->order_number}: Meta API phone ID or token not configured.");
            return [
                'success' => true,
                'simulated' => true,
                'message' => 'Simulated: WhatsApp API credentials not set, but auto-send trigger was processed.',
            ];
        }

        $bodyText = self::buildBillTextMessage($order, $receiptUrl);

        try {
            $response = Http::withToken($token)
                ->timeout(10)
                ->post("https://graph.facebook.com/v21.0/{$phoneId}/messages", [
                    'messaging_product' => 'whatsapp',
                    'recipient_type' => 'individual',
                    'to' => $phone,
                    'type' => 'text',
                    'text' => [
                        'preview_url' => true,
                        'body' => $bodyText,
                    ],
                ]);

            if ($response->successful()) {
                Log::info("WhatsApp Bill sent successfully for Order #{$order->order_number} to {$phone}");
                return [
                    'success' => true,
                    'response' => $response->json(),
                ];
            } else {
                Log::error("WhatsApp Cloud API error for Order #{$order->order_number}: " . $response->body());
                return [
                    'success' => false,
                    'status' => $response->status(),
                    'error' => $response->body(),
                ];
            }
        } catch (\Throwable $e) {
            Log::error("WhatsApp send exception for Order #{$order->order_number}: " . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
