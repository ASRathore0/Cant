<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuItemResource;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\QrScan;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    /**
     * Get verified administrative dashboard metrics.
     */
    public function index(): JsonResponse
    {
        $totalItems = MenuItem::count();
        $availableItems = MenuItem::where('is_available', true)->count();
        $unavailableItems = MenuItem::where('is_available', false)->count();
        $totalCategories = Category::count();
        $activeCategories = Category::where('is_active', true)->count();
        $featuredItems = MenuItem::where('is_featured', true)->count();

        // Real recorded QR scans
        $totalScans = QrScan::count();
        $todayScans = QrScan::whereDate('scanned_at', today())->count();

        // Recently updated items
        $recentItems = MenuItem::with('category')
            ->orderBy('updated_at', 'desc')
            ->take(6)
            ->get();

        return response()->json([
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
