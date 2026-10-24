<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MenuItemRequest;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminMenuItemController extends Controller
{
    /**
     * Display a listing of menu items with filtering and search.
     */
    public function index(Request $request): JsonResponse
    {
        $query = MenuItem::with('category');

        // Search by name or description
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        }

        // Scope to manager's canteen or requested canteen
        $user = $request->user();
        if ($user && $user->canteen_id) {
            $query->where('canteen_id', $user->canteen_id);
        } elseif ($canteenId = $request->input('canteen_id')) {
            $query->where('canteen_id', $canteenId);
        }

        // Filter by availability
        if ($request->has('is_available') && $request->input('is_available') !== '') {
            $query->where('is_available', filter_var($request->input('is_available'), FILTER_VALIDATE_BOOLEAN));
        }

        // Filter by featured
        if ($request->has('is_featured') && $request->input('is_featured') !== '') {
            $query->where('is_featured', filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN));
        }

        // Order
        $sortBy = $request->input('sort_by', 'sort_order');
        $sortOrder = $request->input('sort_direction', 'asc');
        $allowedSorts = ['name', 'price', 'sort_order', 'created_at', 'updated_at'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'desc' ? 'desc' : 'asc');
        } else {
            $query->orderBy('sort_order', 'asc');
        }

        $items = $query->paginate($request->integer('per_page', 50));

        return response()->json([
            'data' => MenuItemResource::collection($items->items()),
            'pagination' => [
                'total' => $items->total(),
                'per_page' => $items->perPage(),
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
            ],
        ]);
    }

    /**
     * Store a newly created menu item.
     */
    public function store(MenuItemRequest $request): JsonResponse
    {
        $data = $request->validated();
        unset($data['image']);

        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $safeName = 'food_' . time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('food', $safeName, 'public');
            $data['image_path'] = $path;
        }

        $data['slug'] = Str::slug($data['name']);
        
        if ($request->user() && $request->user()->canteen_id) {
            $data['canteen_id'] = $request->user()->canteen_id;
        } elseif ($request->filled('canteen_id')) {
            $data['canteen_id'] = $request->input('canteen_id');
        }

        $item = MenuItem::create($data);

        return response()->json([
            'message' => 'Menu item created successfully',
            'data' => new MenuItemResource($item->load('category')),
        ], 201);
    }

    /**
     * Display the specified menu item.
     */
    public function show(int $id): JsonResponse
    {
        $item = MenuItem::with('category')->findOrFail($id);

        return response()->json([
            'data' => new MenuItemResource($item),
        ]);
    }

    /**
     * Update the specified menu item.
     */
    public function update(MenuItemRequest $request, int $id): JsonResponse
    {
        $item = MenuItem::findOrFail($id);
        $data = $request->validated();
        unset($data['image']);

        // Handle image replacement
        if ($request->hasFile('image')) {
            // Remove old uploaded file if stored locally
            if ($item->image_path && !Str::startsWith($item->image_path, ['http://', 'https://'])) {
                Storage::disk('public')->delete($item->image_path);
            }

            $file = $request->file('image');
            $safeName = 'food_' . time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('food', $safeName, 'public');
            $data['image_path'] = $path;
        }

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $item->update($data);

        return response()->json([
            'message' => 'Menu item updated successfully',
            'data' => new MenuItemResource($item->fresh()->load('category')),
        ]);
    }

    /**
     * Remove the specified menu item.
     */
    public function destroy(int $id): JsonResponse
    {
        $item = MenuItem::findOrFail($id);

        if ($item->image_path && !Str::startsWith($item->image_path, ['http://', 'https://'])) {
            Storage::disk('public')->delete($item->image_path);
        }

        $item->delete();

        return response()->json([
            'message' => 'Menu item deleted successfully',
        ]);
    }

    /**
     * Toggle item availability.
     */
    public function toggleAvailability(int $id): JsonResponse
    {
        $item = MenuItem::findOrFail($id);
        $item->is_available = !$item->is_available;
        $item->save();

        return response()->json([
            'message' => "Item '{$item->name}' is now " . ($item->is_available ? 'Available' : 'Unavailable'),
            'data' => new MenuItemResource($item->load('category')),
        ]);
    }

    /**
     * Toggle featured status.
     */
    public function toggleFeatured(int $id): JsonResponse
    {
        $item = MenuItem::findOrFail($id);
        $item->is_featured = !$item->is_featured;
        $item->save();

        return response()->json([
            'message' => "Item '{$item->name}' featured status updated",
            'data' => new MenuItemResource($item->load('category')),
        ]);
    }

    /**
     * Reorder menu items.
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:menu_items,id',
            'items.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->input('items') as $orderData) {
            MenuItem::where('id', $orderData['id'])->update(['sort_order' => $orderData['sort_order']]);
        }

        return response()->json([
            'message' => 'Menu items reordered successfully',
        ]);
    }
}
