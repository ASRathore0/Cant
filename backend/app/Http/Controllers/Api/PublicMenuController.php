<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\MenuItemResource;
use App\Models\Canteen;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\QrScan;
use App\Models\RestaurantSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicMenuController extends Controller
{
    /**
     * Get the full public menu with categories and available/seeded items.
     */
    public function menu(Request $request): JsonResponse
    {
        $canteenParam = $request->input('canteen');
        $canteen = null;

        if ($canteenParam) {
            $canteen = Canteen::where('slug', $canteenParam)
                ->orWhere('id', is_numeric($canteenParam) ? (int) $canteenParam : -1)
                ->first();
        }

        if (!$canteen) {
            $canteen = Canteen::getDefault();
        }

        $query = Category::query()->active()->orderBy('sort_order', 'asc');
        if ($canteen) {
            $query->where(function ($q) use ($canteen) {
                $q->where('canteen_id', $canteen->id)
                  ->orWhereNull('canteen_id'); // backwards compatibility
            });
        }

        $categories = $query->with(['menuItems' => function ($q) use ($canteen) {
            $q->orderBy('sort_order', 'asc');
            if ($canteen) {
                $q->where(function ($sub) use ($canteen) {
                    $sub->where('canteen_id', $canteen->id)
                        ->orWhereNull('canteen_id');
                });
            }
        }])->get();

        $settings = $canteen ? $canteen->toSettingsArray() : RestaurantSetting::getAllSettings();

        // Optional record QR scan if query parameter 'from_qr' is present
        if ($request->boolean('from_qr')) {
            QrScan::create([
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'source' => $request->input('table', 'qr_table'),
                'scanned_at' => now(),
            ]);
        }

        return response()->json([
            'categories' => CategoryResource::collection($categories),
            'settings' => $settings,
            'canteen' => $canteen ? array_merge($canteen->toArray(), ['full_logo_url' => $canteen->full_logo_url]) : null,
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * List all active canteens for directory / canteen switcher.
     */
    public function canteens(): JsonResponse
    {
        $canteens = Canteen::where('is_active', true)
            ->orderBy('is_default', 'desc')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->id,
                    'name' => $c->name,
                    'slug' => $c->slug,
                    'tagline' => $c->tagline,
                    'logo_url' => $c->full_logo_url,
                    'primary_color' => $c->primary_color,
                    'accent_color' => $c->accent_color,
                    'bg_color' => $c->bg_color,
                    'dietary_type' => $c->dietary_type,
                    'pure_veg_label' => $c->pure_veg_label,
                    'address' => $c->address,
                    'is_default' => $c->is_default,
                ];
            });

        return response()->json([
            'canteens' => $canteens,
        ]);
    }

    /**
     * Get active categories list.
     */
    public function categories(): JsonResponse
    {
        $categories = Category::query()
            ->active()
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json([
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    /**
     * Get public restaurant settings and branding details.
     */
    public function restaurant(): JsonResponse
    {
        $settings = RestaurantSetting::getAllSettings();

        return response()->json([
            'settings' => $settings,
        ]);
    }

    /**
     * Record a verified QR scan event.
     */
    public function recordScan(Request $request): JsonResponse
    {
        $scan = QrScan::create([
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'source' => $request->input('source', 'qr_code'),
            'scanned_at' => now(),
        ]);

        return response()->json([
            'message' => 'Scan recorded successfully',
            'id' => $scan->id,
        ], 201);
    }
}
