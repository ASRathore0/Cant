<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuItemResource;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\QrScan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    /**
     * Get verified administrative dashboard metrics.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $canteenId = $user ? $user->canteen_id : null;

        $itemQuery = MenuItem::query();
        $catQuery = Category::query();
        $qrQuery = QrScan::query();

        if ($canteenId) {
            $itemQuery->where('canteen_id', $canteenId);
            $catQuery->where('canteen_id', $canteenId);
        }

        $totalItems = (clone $itemQuery)->count();
        $availableItems = (clone $itemQuery)->where('is_available', true)->count();
        $unavailableItems = (clone $itemQuery)->where('is_available', false)->count();
        $totalCategories = (clone $catQuery)->count();
        $activeCategories = (clone $catQuery)->where('is_active', true)->count();
        $featuredItems = (clone $itemQuery)->where('is_featured', true)->count();

        // Real recorded QR scans
        $totalScans = (clone $qrQuery)->count();
        $todayScans = (clone $qrQuery)->whereDate('scanned_at', today())->count();

        // Recently updated items
        $recentItems = (clone $itemQuery)->with('category')
            ->orderBy('updated_at', 'desc')
            ->take(6)
            ->get();

        return response()->json([
            'canteen' => $user && $user->canteen ? [
                'id' => $user->canteen->id,
                'name' => $user->canteen->name,
                'slug' => $user->canteen->slug,
            ] : null,
            'metrics' => [
                'total_items' => $totalItems,
                'available_items' => $availableItems,
                'unavailable_items' => $unavailableItems,
                'total_categories' => $totalCategories,
                'active_categories' => $activeCategories,
                'featured_items' => $featuredItems,
                'total_scans' => $totalScans,
                'today_scans' => $todayScans,
            ],
            'recent_items' => MenuItemResource::collection($recentItems),
        ]);
    }
}
